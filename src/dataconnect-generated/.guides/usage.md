# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUser, deleteUser, upsertEvent, deleteEvent, upsertCategory, deleteCategory, upsertSchedule, deleteSchedule, upsertVolunteer, deleteVolunteer } from '@firebasegen/default-connector';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation DeleteUser:  For variables, look at type DeleteUserVars in ../index.d.ts
const { data } = await DeleteUser(dataConnect, deleteUserVars);

// Operation UpsertEvent:  For variables, look at type UpsertEventVars in ../index.d.ts
const { data } = await UpsertEvent(dataConnect, upsertEventVars);

// Operation DeleteEvent:  For variables, look at type DeleteEventVars in ../index.d.ts
const { data } = await DeleteEvent(dataConnect, deleteEventVars);

// Operation UpsertCategory:  For variables, look at type UpsertCategoryVars in ../index.d.ts
const { data } = await UpsertCategory(dataConnect, upsertCategoryVars);

// Operation DeleteCategory:  For variables, look at type DeleteCategoryVars in ../index.d.ts
const { data } = await DeleteCategory(dataConnect, deleteCategoryVars);

// Operation UpsertSchedule:  For variables, look at type UpsertScheduleVars in ../index.d.ts
const { data } = await UpsertSchedule(dataConnect, upsertScheduleVars);

// Operation DeleteSchedule:  For variables, look at type DeleteScheduleVars in ../index.d.ts
const { data } = await DeleteSchedule(dataConnect, deleteScheduleVars);

// Operation UpsertVolunteer:  For variables, look at type UpsertVolunteerVars in ../index.d.ts
const { data } = await UpsertVolunteer(dataConnect, upsertVolunteerVars);

// Operation DeleteVolunteer:  For variables, look at type DeleteVolunteerVars in ../index.d.ts
const { data } = await DeleteVolunteer(dataConnect, deleteVolunteerVars);


```