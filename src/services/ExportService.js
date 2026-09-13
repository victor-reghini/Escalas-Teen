import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { StorageService } from './StorageService.js';

export class ExportService {
  /**
   * Formata a escala em texto para compartilhamento no WhatsApp
   * @param {Object} shift - Entidade Shift
   * @param {Object} event - Entidade Event
   * @returns {string} Texto formatado
   */
  static formatShiftAsWhatsAppText(shift, event) {
    if (!shift) return '';

    const assignments = shift.assignments || [];
    const dateFormatted = shift.date ? shift.date.split('-').reverse().join('/') : '';
    
    let text = `📋 *${shift.title}*\n`;
    if (dateFormatted) {
      text += `📅 *Data:* ${dateFormatted}\n`;
    }
    text += `📍 *Local Geral:* ${shift.generalLocation || 'Não informado'}\n`;
    text += `⏰ *Horário Geral:* ${shift.startTime || ''} às ${shift.endTime || ''}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*ESCALA DE VOLUNTÁRIOS:*\n\n`;

    if (assignments.length === 0) {
      text += `_Nenhum voluntário escalado no momento._\n`;
    } else {
      assignments.forEach((a, index) => {
        const roleAndLoc = a.specificLocation && a.specificLocation !== shift.generalLocation
          ? `${a.roleName || 'Staff'} (${a.specificLocation})`
          : (a.roleName || 'Staff');
        
        const timeRange = (a.startTime && a.endTime) 
          ? `${a.startTime} - ${a.endTime}` 
          : `${shift.startTime} - ${shift.endTime}`;

        text += `${index + 1}. *${a.volunteerName}*\n`;
        text += `   ⏳ ${timeRange} | 🏷️ ${roleAndLoc}\n`;
      });
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (event && event.name) {
      text += `✨ _${event.name}_ ✨\n`;
    }

    return text;
  }

  /**
   * Gera documento PDF da escala ou de múltiplas escalas
   * @param {Array|Object} shifts - Lista de escalas ou escala única
   * @param {Object} event - Entidade Event
   * @param {string} fileName - Nome do arquivo para download
   */
  static async generatePDF(shifts, event, fileName = 'Escala') {
    const shiftList = Array.isArray(shifts) ? shifts : [shifts];
    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const headerImg = StorageService.getHeaderImage(event);
    const footerImg = StorageService.getFooterImage(event);

    const headerHeight = 28;
    const footerHeight = 32;

    const totalPages = () => doc.internal.getNumberOfPages();

    function drawHeaderFooter(pageNumber) {
      // Cabeçalho Oficial
      try {
        doc.addImage(headerImg, 'PNG', 0, 0, pageWidth, headerHeight);
      } catch (e) {
        // Fallback gráfico se imagem for inválida
        doc.setFillColor(30, 83, 155);
        doc.rect(0, 0, pageWidth, headerHeight, 'F');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(event ? event.name.toUpperCase() : 'TEENSTREET BRASIL', pageWidth / 2, 16, { align: 'center' });
      }

      // Rodapé Oficial
      try {
        doc.addImage(footerImg, 'PNG', 0, pageHeight - footerHeight, pageWidth, footerHeight);
      } catch (e) {
        doc.setFillColor(240, 240, 240);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      }

      // Numeração de página
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Página ${pageNumber}`, pageWidth - 20, pageHeight - footerHeight - 2);
    }

    let startY = headerHeight + 8;

    shiftList.forEach((shift, shiftIndex) => {
      if (shiftIndex > 0) {
        doc.addPage();
        startY = headerHeight + 8;
      }

      // Título da Escala (Header da Tabela)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(25, 60, 130);
      doc.text(shift.title.toUpperCase(), pageWidth / 2, startY, { align: 'center' });
      startY += 5;

      // Subtítulo: Local Geral e Horário Geral
      const dateFormatted = shift.date ? shift.date.split('-').reverse().join('/') : '';
      const subTitle = `Local Geral: ${shift.generalLocation || 'Geral'}   |   Horário: ${shift.startTime} às ${shift.endTime}${dateFormatted ? `   |   Data: ${dateFormatted}` : ''}`;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 70, 70);
      doc.text(subTitle, pageWidth / 2, startY, { align: 'center' });
      startY += 4;

      // Dados da Tabela
      const tableRows = (shift.assignments || []).map(a => {
        const timeRange = (a.startTime && a.endTime) 
          ? `${a.startTime} - ${a.endTime}` 
          : `${shift.startTime} - ${shift.endTime}`;
        
        const roleAndLoc = a.specificLocation && a.specificLocation !== shift.generalLocation
          ? `${a.roleName || 'Staff'} (${a.specificLocation})`
          : (a.roleName || 'Staff');

        return [a.volunteerName, timeRange, roleAndLoc];
      });

      if (tableRows.length === 0) {
        tableRows.push(['Nenhum voluntário escalado', `${shift.startTime} - ${shift.endTime}`, '-']);
      }

      // Gera a tabela com AutoTable
      autoTable(doc, {
        startY: startY,
        head: [['VOLUNTÁRIO', 'HORÁRIO', 'FUNÇÃO / LOCAL']],
        body: tableRows,
        margin: { left: 14, right: 14, bottom: footerHeight + 10 },
        headStyles: {
          fillColor: [30, 83, 155],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [30, 30, 30],
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
          fillColor: [245, 248, 253]
        },
        didDrawPage: (data) => {
          drawHeaderFooter(data.pageNumber);
        }
      });
    });

    // Se houve apenas 1 página que não disparou o hook
    if (totalPages() === 1) {
      drawHeaderFooter(1);
    }

    doc.save(`${fileName}.pdf`);
  }

  /**
   * Gera imagem PNG da escala para download ou compartilhamento
   * @param {HTMLElement} elementToCapture - Elemento HTML contendo o preview estilizado
   * @param {string} fileName - Nome do arquivo
   */
  static async exportAsImage(elementToCapture, fileName = 'escala.png') {
    if (!elementToCapture) return;

    const canvas = await html2canvas(elementToCapture, {
      scale: 2, // Alta resolução para telas retina
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}
