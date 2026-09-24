import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: string;
  __typename?: 'Category_Key';
}

export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}

export interface DeleteCategoryVariables {
  id: string;
}

export interface DeleteEventData {
  event_delete?: Event_Key | null;
}

export interface DeleteEventVariables {
  id: string;
}

export interface DeleteFeedbackData {
  feedback_delete?: Feedback_Key | null;
}

export interface DeleteFeedbackVariables {
  id: string;
}

export interface DeleteScheduleData {
  schedule_delete?: Schedule_Key | null;
}

export interface DeleteScheduleVariables {
  id: string;
}

export interface DeleteShiftData {
  shift_delete?: Shift_Key | null;
}

export interface DeleteShiftVariables {
  id: string;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: string;
}

export interface DeleteVolunteerData {
  volunteer_delete?: Volunteer_Key | null;
}

export interface DeleteVolunteerVariables {
  id: string;
}

export interface Event_Key {
  id: string;
  __typename?: 'Event_Key';
}

export interface Feedback_Key {
  id: string;
  __typename?: 'Feedback_Key';
}

export interface GetEventByIdData {
  event?: {
    id: string;
    name: string;
    code?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
    status: string;
    allowVolunteerRegistration?: boolean | null;
    openShiftVisibility?: boolean | null;
    autoGenerationEnabled?: boolean | null;
    headerImageUrl?: string | null;
    footerImageUrl?: string | null;
    adminUids?: string[] | null;
    createdAt?: string | null;
  } & Event_Key;
}

export interface GetEventByIdVariables {
  id: string;
}

export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    username?: string | null;
    name: string;
    role: string;
    phone?: string | null;
    avatarUrl?: string | null;
    eventIds?: string[] | null;
    createdAt?: string | null;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface GetUserByIdData {
  user?: {
    id: string;
    email: string;
    username?: string | null;
    name: string;
    role: string;
    phone?: string | null;
    avatarUrl?: string | null;
    eventIds?: string[] | null;
    createdAt?: string | null;
  } & User_Key;
}

export interface GetUserByIdVariables {
  id: string;
}

export interface GetUserByUsernameData {
  users: ({
    id: string;
    email: string;
    username?: string | null;
    name: string;
    role: string;
    phone?: string | null;
    avatarUrl?: string | null;
    eventIds?: string[] | null;
    createdAt?: string | null;
  } & User_Key)[];
}

export interface GetUserByUsernameVariables {
  username: string;
}

export interface ListCategoriesByEventData {
  categories: ({
    id: string;
    eventId: string;
    name: string;
    description?: string | null;
    color?: string | null;
    priority?: number | null;
    createdAt?: string | null;
  } & Category_Key)[];
}

export interface ListCategoriesByEventVariables {
  eventId: string;
}

export interface ListEventsData {
  events: ({
    id: string;
    name: string;
    code?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
    status: string;
    allowVolunteerRegistration?: boolean | null;
    openShiftVisibility?: boolean | null;
    autoGenerationEnabled?: boolean | null;
    headerImageUrl?: string | null;
    footerImageUrl?: string | null;
    adminUids?: string[] | null;
    createdAt?: string | null;
  } & Event_Key)[];
}

export interface ListFeedbacksByEventData {
  feedbacks: ({
    id: string;
    eventId: string;
    volunteerId: string;
    shiftId?: string | null;
    rating: number;
    comments?: string | null;
    createdAt?: string | null;
  } & Feedback_Key)[];
}

export interface ListFeedbacksByEventVariables {
  eventId: string;
}

export interface ListSchedulesByEventData {
  schedules: ({
    id: string;
    eventId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    generalLocation?: string | null;
    categoryId?: string | null;
    requiredVolunteers?: number | null;
    roles?: unknown | null;
    notes?: string | null;
    createdAt?: string | null;
  } & Schedule_Key)[];
}

export interface ListSchedulesByEventVariables {
  eventId: string;
}

export interface ListShiftsByEventData {
  shifts: ({
    id: string;
    eventId: string;
    scheduleId: string;
    title?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    generalLocation?: string | null;
    categoryId?: string | null;
    status: string;
    hasDeficit?: boolean | null;
    deficitCount?: number | null;
    assignments?: unknown | null;
    approvedBy?: string | null;
    approvedAt?: string | null;
    createdAt?: string | null;
  } & Shift_Key)[];
}

export interface ListShiftsByEventVariables {
  eventId: string;
}

export interface ListVolunteersByEventData {
  volunteers: ({
    id: string;
    eventId: string;
    userId?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    type: string;
    experience: string;
    availabilities?: unknown | null;
    unavailabilities?: unknown | null;
    categoryPreferences?: unknown | null;
    adminRating?: number | null;
    adminNotes?: string | null;
    active?: boolean | null;
    createdAt?: string | null;
  } & Volunteer_Key)[];
}

export interface ListVolunteersByEventVariables {
  eventId: string;
}

export interface Schedule_Key {
  id: string;
  __typename?: 'Schedule_Key';
}

export interface Shift_Key {
  id: string;
  __typename?: 'Shift_Key';
}

export interface UpsertCategoryData {
  category_upsert: Category_Key;
}

export interface UpsertCategoryVariables {
  id: string;
  eventId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  priority?: number | null;
  createdAt?: string | null;
}

export interface UpsertEventData {
  event_upsert: Event_Key;
}

export interface UpsertEventVariables {
  id: string;
  name: string;
  code?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  status: string;
  allowVolunteerRegistration?: boolean | null;
  openShiftVisibility?: boolean | null;
  autoGenerationEnabled?: boolean | null;
  headerImageUrl?: string | null;
  footerImageUrl?: string | null;
  adminUids?: string[] | null;
  createdAt?: string | null;
}

export interface UpsertFeedbackData {
  feedback_upsert: Feedback_Key;
}

export interface UpsertFeedbackVariables {
  id: string;
  eventId: string;
  volunteerId: string;
  shiftId?: string | null;
  rating: number;
  comments?: string | null;
  createdAt?: string | null;
}

export interface UpsertScheduleData {
  schedule_upsert: Schedule_Key;
}

export interface UpsertScheduleVariables {
  id: string;
  eventId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  generalLocation?: string | null;
  categoryId?: string | null;
  requiredVolunteers?: number | null;
  roles?: unknown | null;
  notes?: string | null;
  createdAt?: string | null;
}

export interface UpsertShiftData {
  shift_upsert: Shift_Key;
}

export interface UpsertShiftVariables {
  id: string;
  eventId: string;
  scheduleId: string;
  title?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  generalLocation?: string | null;
  categoryId?: string | null;
  status: string;
  hasDeficit?: boolean | null;
  deficitCount?: number | null;
  assignments?: unknown | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  createdAt?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  id: string;
  email: string;
  username?: string | null;
  name: string;
  role: string;
  phone?: string | null;
  avatarUrl?: string | null;
  eventIds?: string[] | null;
  createdAt?: string | null;
}

export interface UpsertVolunteerData {
  volunteer_upsert: Volunteer_Key;
}

export interface UpsertVolunteerVariables {
  id: string;
  eventId: string;
  userId?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  type: string;
  experience: string;
  availabilities?: unknown | null;
  unavailabilities?: unknown | null;
  categoryPreferences?: unknown | null;
  adminRating?: number | null;
  adminNotes?: string | null;
  active?: boolean | null;
  createdAt?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface Volunteer_Key {
  id: string;
  __typename?: 'Volunteer_Key';
}

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface UpsertEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEventVariables): MutationRef<UpsertEventData, UpsertEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEventVariables): MutationRef<UpsertEventData, UpsertEventVariables>;
  operationName: string;
}
export const upsertEventRef: UpsertEventRef;

export function upsertEvent(vars: UpsertEventVariables): MutationPromise<UpsertEventData, UpsertEventVariables>;
export function upsertEvent(dc: DataConnect, vars: UpsertEventVariables): MutationPromise<UpsertEventData, UpsertEventVariables>;

interface DeleteEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
  operationName: string;
}
export const deleteEventRef: DeleteEventRef;

export function deleteEvent(vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;
export function deleteEvent(dc: DataConnect, vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface UpsertCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
  operationName: string;
}
export const upsertCategoryRef: UpsertCategoryRef;

export function upsertCategory(vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;
export function upsertCategory(dc: DataConnect, vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface DeleteCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  operationName: string;
}
export const deleteCategoryRef: DeleteCategoryRef;

export function deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;
export function deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface UpsertScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertScheduleVariables): MutationRef<UpsertScheduleData, UpsertScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertScheduleVariables): MutationRef<UpsertScheduleData, UpsertScheduleVariables>;
  operationName: string;
}
export const upsertScheduleRef: UpsertScheduleRef;

export function upsertSchedule(vars: UpsertScheduleVariables): MutationPromise<UpsertScheduleData, UpsertScheduleVariables>;
export function upsertSchedule(dc: DataConnect, vars: UpsertScheduleVariables): MutationPromise<UpsertScheduleData, UpsertScheduleVariables>;

interface DeleteScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
  operationName: string;
}
export const deleteScheduleRef: DeleteScheduleRef;

export function deleteSchedule(vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;
export function deleteSchedule(dc: DataConnect, vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface UpsertVolunteerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertVolunteerVariables): MutationRef<UpsertVolunteerData, UpsertVolunteerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertVolunteerVariables): MutationRef<UpsertVolunteerData, UpsertVolunteerVariables>;
  operationName: string;
}
export const upsertVolunteerRef: UpsertVolunteerRef;

export function upsertVolunteer(vars: UpsertVolunteerVariables): MutationPromise<UpsertVolunteerData, UpsertVolunteerVariables>;
export function upsertVolunteer(dc: DataConnect, vars: UpsertVolunteerVariables): MutationPromise<UpsertVolunteerData, UpsertVolunteerVariables>;

interface DeleteVolunteerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVolunteerVariables): MutationRef<DeleteVolunteerData, DeleteVolunteerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteVolunteerVariables): MutationRef<DeleteVolunteerData, DeleteVolunteerVariables>;
  operationName: string;
}
export const deleteVolunteerRef: DeleteVolunteerRef;

export function deleteVolunteer(vars: DeleteVolunteerVariables): MutationPromise<DeleteVolunteerData, DeleteVolunteerVariables>;
export function deleteVolunteer(dc: DataConnect, vars: DeleteVolunteerVariables): MutationPromise<DeleteVolunteerData, DeleteVolunteerVariables>;

interface UpsertShiftRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertShiftVariables): MutationRef<UpsertShiftData, UpsertShiftVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertShiftVariables): MutationRef<UpsertShiftData, UpsertShiftVariables>;
  operationName: string;
}
export const upsertShiftRef: UpsertShiftRef;

export function upsertShift(vars: UpsertShiftVariables): MutationPromise<UpsertShiftData, UpsertShiftVariables>;
export function upsertShift(dc: DataConnect, vars: UpsertShiftVariables): MutationPromise<UpsertShiftData, UpsertShiftVariables>;

interface DeleteShiftRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShiftVariables): MutationRef<DeleteShiftData, DeleteShiftVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteShiftVariables): MutationRef<DeleteShiftData, DeleteShiftVariables>;
  operationName: string;
}
export const deleteShiftRef: DeleteShiftRef;

export function deleteShift(vars: DeleteShiftVariables): MutationPromise<DeleteShiftData, DeleteShiftVariables>;
export function deleteShift(dc: DataConnect, vars: DeleteShiftVariables): MutationPromise<DeleteShiftData, DeleteShiftVariables>;

interface UpsertFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertFeedbackVariables): MutationRef<UpsertFeedbackData, UpsertFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertFeedbackVariables): MutationRef<UpsertFeedbackData, UpsertFeedbackVariables>;
  operationName: string;
}
export const upsertFeedbackRef: UpsertFeedbackRef;

export function upsertFeedback(vars: UpsertFeedbackVariables): MutationPromise<UpsertFeedbackData, UpsertFeedbackVariables>;
export function upsertFeedback(dc: DataConnect, vars: UpsertFeedbackVariables): MutationPromise<UpsertFeedbackData, UpsertFeedbackVariables>;

interface DeleteFeedbackRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFeedbackVariables): MutationRef<DeleteFeedbackData, DeleteFeedbackVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFeedbackVariables): MutationRef<DeleteFeedbackData, DeleteFeedbackVariables>;
  operationName: string;
}
export const deleteFeedbackRef: DeleteFeedbackRef;

export function deleteFeedback(vars: DeleteFeedbackVariables): MutationPromise<DeleteFeedbackData, DeleteFeedbackVariables>;
export function deleteFeedback(dc: DataConnect, vars: DeleteFeedbackVariables): MutationPromise<DeleteFeedbackData, DeleteFeedbackVariables>;

interface GetUserByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  operationName: string;
}
export const getUserByIdRef: GetUserByIdRef;

export function getUserById(vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;
export function getUserById(dc: DataConnect, vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByUsernameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByUsernameVariables): QueryRef<GetUserByUsernameData, GetUserByUsernameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByUsernameVariables): QueryRef<GetUserByUsernameData, GetUserByUsernameVariables>;
  operationName: string;
}
export const getUserByUsernameRef: GetUserByUsernameRef;

export function getUserByUsername(vars: GetUserByUsernameVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByUsernameData, GetUserByUsernameVariables>;
export function getUserByUsername(dc: DataConnect, vars: GetUserByUsernameVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByUsernameData, GetUserByUsernameVariables>;

interface ListEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEventsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEventsData, undefined>;
  operationName: string;
}
export const listEventsRef: ListEventsRef;

export function listEvents(options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;
export function listEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface GetEventByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEventByIdVariables): QueryRef<GetEventByIdData, GetEventByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEventByIdVariables): QueryRef<GetEventByIdData, GetEventByIdVariables>;
  operationName: string;
}
export const getEventByIdRef: GetEventByIdRef;

export function getEventById(vars: GetEventByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventByIdData, GetEventByIdVariables>;
export function getEventById(dc: DataConnect, vars: GetEventByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventByIdData, GetEventByIdVariables>;

interface ListCategoriesByEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCategoriesByEventVariables): QueryRef<ListCategoriesByEventData, ListCategoriesByEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCategoriesByEventVariables): QueryRef<ListCategoriesByEventData, ListCategoriesByEventVariables>;
  operationName: string;
}
export const listCategoriesByEventRef: ListCategoriesByEventRef;

export function listCategoriesByEvent(vars: ListCategoriesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesByEventData, ListCategoriesByEventVariables>;
export function listCategoriesByEvent(dc: DataConnect, vars: ListCategoriesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesByEventData, ListCategoriesByEventVariables>;

interface ListSchedulesByEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByEventVariables): QueryRef<ListSchedulesByEventData, ListSchedulesByEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSchedulesByEventVariables): QueryRef<ListSchedulesByEventData, ListSchedulesByEventVariables>;
  operationName: string;
}
export const listSchedulesByEventRef: ListSchedulesByEventRef;

export function listSchedulesByEvent(vars: ListSchedulesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListSchedulesByEventData, ListSchedulesByEventVariables>;
export function listSchedulesByEvent(dc: DataConnect, vars: ListSchedulesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListSchedulesByEventData, ListSchedulesByEventVariables>;

interface ListVolunteersByEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVolunteersByEventVariables): QueryRef<ListVolunteersByEventData, ListVolunteersByEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListVolunteersByEventVariables): QueryRef<ListVolunteersByEventData, ListVolunteersByEventVariables>;
  operationName: string;
}
export const listVolunteersByEventRef: ListVolunteersByEventRef;

export function listVolunteersByEvent(vars: ListVolunteersByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListVolunteersByEventData, ListVolunteersByEventVariables>;
export function listVolunteersByEvent(dc: DataConnect, vars: ListVolunteersByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListVolunteersByEventData, ListVolunteersByEventVariables>;

interface ListShiftsByEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListShiftsByEventVariables): QueryRef<ListShiftsByEventData, ListShiftsByEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListShiftsByEventVariables): QueryRef<ListShiftsByEventData, ListShiftsByEventVariables>;
  operationName: string;
}
export const listShiftsByEventRef: ListShiftsByEventRef;

export function listShiftsByEvent(vars: ListShiftsByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListShiftsByEventData, ListShiftsByEventVariables>;
export function listShiftsByEvent(dc: DataConnect, vars: ListShiftsByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListShiftsByEventData, ListShiftsByEventVariables>;

interface ListFeedbacksByEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFeedbacksByEventVariables): QueryRef<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFeedbacksByEventVariables): QueryRef<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;
  operationName: string;
}
export const listFeedbacksByEventRef: ListFeedbacksByEventRef;

export function listFeedbacksByEvent(vars: ListFeedbacksByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;
export function listFeedbacksByEvent(dc: DataConnect, vars: ListFeedbacksByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;

