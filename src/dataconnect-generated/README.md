# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserById*](#getuserbyid)
  - [*GetUserByEmail*](#getuserbyemail)
  - [*GetUserByUsername*](#getuserbyusername)
  - [*ListEvents*](#listevents)
  - [*GetEventById*](#geteventbyid)
  - [*ListCategoriesByEvent*](#listcategoriesbyevent)
  - [*ListSchedulesByEvent*](#listschedulesbyevent)
  - [*ListVolunteersByEvent*](#listvolunteersbyevent)
  - [*ListShiftsByEvent*](#listshiftsbyevent)
  - [*ListFeedbacksByEvent*](#listfeedbacksbyevent)
- [**Mutations**](#mutations)
  - [*UpsertUser*](#upsertuser)
  - [*DeleteUser*](#deleteuser)
  - [*UpsertEvent*](#upsertevent)
  - [*DeleteEvent*](#deleteevent)
  - [*UpsertCategory*](#upsertcategory)
  - [*DeleteCategory*](#deletecategory)
  - [*UpsertSchedule*](#upsertschedule)
  - [*DeleteSchedule*](#deleteschedule)
  - [*UpsertVolunteer*](#upsertvolunteer)
  - [*DeleteVolunteer*](#deletevolunteer)
  - [*UpsertShift*](#upsertshift)
  - [*DeleteShift*](#deleteshift)
  - [*UpsertFeedback*](#upsertfeedback)
  - [*DeleteFeedback*](#deletefeedback)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserById
You can execute the `GetUserById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserById(vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserById(dc: DataConnect, vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface GetUserByIdRef {
  ...
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
}
export const getUserByIdRef: GetUserByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByIdRef:
```typescript
const name = getUserByIdRef.operationName;
console.log(name);
```

### Variables
The `GetUserById` query requires an argument of type `GetUserByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByIdVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUserById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserById, GetUserByIdVariables } from '@firebasegen/default-connector';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  id: ..., 
};

// Call the `getUserById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserById(getUserByIdVars);
// Variables can be defined inline as well.
const { data } = await getUserById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserById(dataConnect, getUserByIdVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserById(getUserByIdVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByIdRef, GetUserByIdVariables } from '@firebasegen/default-connector';

// The `GetUserById` query requires an argument of type `GetUserByIdVariables`:
const getUserByIdVars: GetUserByIdVariables = {
  id: ..., 
};

// Call the `getUserByIdRef()` function to get a reference to the query.
const ref = getUserByIdRef(getUserByIdVars);
// Variables can be defined inline as well.
const ref = getUserByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByIdRef(dataConnect, getUserByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserByEmail
You can execute the `GetUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@firebasegen/default-connector';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@firebasegen/default-connector';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUserByUsername
You can execute the `GetUserByUsername` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByUsername(vars: GetUserByUsernameVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByUsernameData, GetUserByUsernameVariables>;

interface GetUserByUsernameRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByUsernameVariables): QueryRef<GetUserByUsernameData, GetUserByUsernameVariables>;
}
export const getUserByUsernameRef: GetUserByUsernameRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByUsername(dc: DataConnect, vars: GetUserByUsernameVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByUsernameData, GetUserByUsernameVariables>;

interface GetUserByUsernameRef {
  ...
  (dc: DataConnect, vars: GetUserByUsernameVariables): QueryRef<GetUserByUsernameData, GetUserByUsernameVariables>;
}
export const getUserByUsernameRef: GetUserByUsernameRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByUsernameRef:
```typescript
const name = getUserByUsernameRef.operationName;
console.log(name);
```

### Variables
The `GetUserByUsername` query requires an argument of type `GetUserByUsernameVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByUsernameVariables {
  username: string;
}
```
### Return Type
Recall that executing the `GetUserByUsername` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByUsernameData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserByUsername`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByUsername, GetUserByUsernameVariables } from '@firebasegen/default-connector';

// The `GetUserByUsername` query requires an argument of type `GetUserByUsernameVariables`:
const getUserByUsernameVars: GetUserByUsernameVariables = {
  username: ..., 
};

// Call the `getUserByUsername()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByUsername(getUserByUsernameVars);
// Variables can be defined inline as well.
const { data } = await getUserByUsername({ username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByUsername(dataConnect, getUserByUsernameVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByUsername(getUserByUsernameVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByUsername`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByUsernameRef, GetUserByUsernameVariables } from '@firebasegen/default-connector';

// The `GetUserByUsername` query requires an argument of type `GetUserByUsernameVariables`:
const getUserByUsernameVars: GetUserByUsernameVariables = {
  username: ..., 
};

// Call the `getUserByUsernameRef()` function to get a reference to the query.
const ref = getUserByUsernameRef(getUserByUsernameVars);
// Variables can be defined inline as well.
const ref = getUserByUsernameRef({ username: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByUsernameRef(dataConnect, getUserByUsernameVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListEvents
You can execute the `ListEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEvents(options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface ListEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEventsData, undefined>;
}
export const listEventsRef: ListEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEvents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEventsData, undefined>;

interface ListEventsRef {
  ...
  (dc: DataConnect): QueryRef<ListEventsData, undefined>;
}
export const listEventsRef: ListEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEventsRef:
```typescript
const name = listEventsRef.operationName;
console.log(name);
```

### Variables
The `ListEvents` query has no variables.
### Return Type
Recall that executing the `ListEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEventsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEvents } from '@firebasegen/default-connector';


// Call the `listEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEvents(dataConnect);

console.log(data.events);

// Or, you can use the `Promise` API.
listEvents().then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

### Using `ListEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEventsRef } from '@firebasegen/default-connector';


// Call the `listEventsRef()` function to get a reference to the query.
const ref = listEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.events);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

## GetEventById
You can execute the `GetEventById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEventById(vars: GetEventByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventByIdData, GetEventByIdVariables>;

interface GetEventByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEventByIdVariables): QueryRef<GetEventByIdData, GetEventByIdVariables>;
}
export const getEventByIdRef: GetEventByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEventById(dc: DataConnect, vars: GetEventByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEventByIdData, GetEventByIdVariables>;

interface GetEventByIdRef {
  ...
  (dc: DataConnect, vars: GetEventByIdVariables): QueryRef<GetEventByIdData, GetEventByIdVariables>;
}
export const getEventByIdRef: GetEventByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEventByIdRef:
```typescript
const name = getEventByIdRef.operationName;
console.log(name);
```

### Variables
The `GetEventById` query requires an argument of type `GetEventByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEventByIdVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetEventById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEventByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetEventById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEventById, GetEventByIdVariables } from '@firebasegen/default-connector';

// The `GetEventById` query requires an argument of type `GetEventByIdVariables`:
const getEventByIdVars: GetEventByIdVariables = {
  id: ..., 
};

// Call the `getEventById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEventById(getEventByIdVars);
// Variables can be defined inline as well.
const { data } = await getEventById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEventById(dataConnect, getEventByIdVars);

console.log(data.event);

// Or, you can use the `Promise` API.
getEventById(getEventByIdVars).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

### Using `GetEventById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEventByIdRef, GetEventByIdVariables } from '@firebasegen/default-connector';

// The `GetEventById` query requires an argument of type `GetEventByIdVariables`:
const getEventByIdVars: GetEventByIdVariables = {
  id: ..., 
};

// Call the `getEventByIdRef()` function to get a reference to the query.
const ref = getEventByIdRef(getEventByIdVars);
// Variables can be defined inline as well.
const ref = getEventByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEventByIdRef(dataConnect, getEventByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.event);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.event);
});
```

## ListCategoriesByEvent
You can execute the `ListCategoriesByEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCategoriesByEvent(vars: ListCategoriesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesByEventData, ListCategoriesByEventVariables>;

interface ListCategoriesByEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCategoriesByEventVariables): QueryRef<ListCategoriesByEventData, ListCategoriesByEventVariables>;
}
export const listCategoriesByEventRef: ListCategoriesByEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCategoriesByEvent(dc: DataConnect, vars: ListCategoriesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesByEventData, ListCategoriesByEventVariables>;

interface ListCategoriesByEventRef {
  ...
  (dc: DataConnect, vars: ListCategoriesByEventVariables): QueryRef<ListCategoriesByEventData, ListCategoriesByEventVariables>;
}
export const listCategoriesByEventRef: ListCategoriesByEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCategoriesByEventRef:
```typescript
const name = listCategoriesByEventRef.operationName;
console.log(name);
```

### Variables
The `ListCategoriesByEvent` query requires an argument of type `ListCategoriesByEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCategoriesByEventVariables {
  eventId: string;
}
```
### Return Type
Recall that executing the `ListCategoriesByEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCategoriesByEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListCategoriesByEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCategoriesByEvent, ListCategoriesByEventVariables } from '@firebasegen/default-connector';

// The `ListCategoriesByEvent` query requires an argument of type `ListCategoriesByEventVariables`:
const listCategoriesByEventVars: ListCategoriesByEventVariables = {
  eventId: ..., 
};

// Call the `listCategoriesByEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCategoriesByEvent(listCategoriesByEventVars);
// Variables can be defined inline as well.
const { data } = await listCategoriesByEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCategoriesByEvent(dataConnect, listCategoriesByEventVars);

console.log(data.categories);

// Or, you can use the `Promise` API.
listCategoriesByEvent(listCategoriesByEventVars).then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

### Using `ListCategoriesByEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCategoriesByEventRef, ListCategoriesByEventVariables } from '@firebasegen/default-connector';

// The `ListCategoriesByEvent` query requires an argument of type `ListCategoriesByEventVariables`:
const listCategoriesByEventVars: ListCategoriesByEventVariables = {
  eventId: ..., 
};

// Call the `listCategoriesByEventRef()` function to get a reference to the query.
const ref = listCategoriesByEventRef(listCategoriesByEventVars);
// Variables can be defined inline as well.
const ref = listCategoriesByEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCategoriesByEventRef(dataConnect, listCategoriesByEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.categories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

## ListSchedulesByEvent
You can execute the `ListSchedulesByEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSchedulesByEvent(vars: ListSchedulesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListSchedulesByEventData, ListSchedulesByEventVariables>;

interface ListSchedulesByEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSchedulesByEventVariables): QueryRef<ListSchedulesByEventData, ListSchedulesByEventVariables>;
}
export const listSchedulesByEventRef: ListSchedulesByEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSchedulesByEvent(dc: DataConnect, vars: ListSchedulesByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListSchedulesByEventData, ListSchedulesByEventVariables>;

interface ListSchedulesByEventRef {
  ...
  (dc: DataConnect, vars: ListSchedulesByEventVariables): QueryRef<ListSchedulesByEventData, ListSchedulesByEventVariables>;
}
export const listSchedulesByEventRef: ListSchedulesByEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSchedulesByEventRef:
```typescript
const name = listSchedulesByEventRef.operationName;
console.log(name);
```

### Variables
The `ListSchedulesByEvent` query requires an argument of type `ListSchedulesByEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSchedulesByEventVariables {
  eventId: string;
}
```
### Return Type
Recall that executing the `ListSchedulesByEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSchedulesByEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListSchedulesByEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByEvent, ListSchedulesByEventVariables } from '@firebasegen/default-connector';

// The `ListSchedulesByEvent` query requires an argument of type `ListSchedulesByEventVariables`:
const listSchedulesByEventVars: ListSchedulesByEventVariables = {
  eventId: ..., 
};

// Call the `listSchedulesByEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSchedulesByEvent(listSchedulesByEventVars);
// Variables can be defined inline as well.
const { data } = await listSchedulesByEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSchedulesByEvent(dataConnect, listSchedulesByEventVars);

console.log(data.schedules);

// Or, you can use the `Promise` API.
listSchedulesByEvent(listSchedulesByEventVars).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

### Using `ListSchedulesByEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSchedulesByEventRef, ListSchedulesByEventVariables } from '@firebasegen/default-connector';

// The `ListSchedulesByEvent` query requires an argument of type `ListSchedulesByEventVariables`:
const listSchedulesByEventVars: ListSchedulesByEventVariables = {
  eventId: ..., 
};

// Call the `listSchedulesByEventRef()` function to get a reference to the query.
const ref = listSchedulesByEventRef(listSchedulesByEventVars);
// Variables can be defined inline as well.
const ref = listSchedulesByEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSchedulesByEventRef(dataConnect, listSchedulesByEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.schedules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.schedules);
});
```

## ListVolunteersByEvent
You can execute the `ListVolunteersByEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listVolunteersByEvent(vars: ListVolunteersByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListVolunteersByEventData, ListVolunteersByEventVariables>;

interface ListVolunteersByEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListVolunteersByEventVariables): QueryRef<ListVolunteersByEventData, ListVolunteersByEventVariables>;
}
export const listVolunteersByEventRef: ListVolunteersByEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVolunteersByEvent(dc: DataConnect, vars: ListVolunteersByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListVolunteersByEventData, ListVolunteersByEventVariables>;

interface ListVolunteersByEventRef {
  ...
  (dc: DataConnect, vars: ListVolunteersByEventVariables): QueryRef<ListVolunteersByEventData, ListVolunteersByEventVariables>;
}
export const listVolunteersByEventRef: ListVolunteersByEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVolunteersByEventRef:
```typescript
const name = listVolunteersByEventRef.operationName;
console.log(name);
```

### Variables
The `ListVolunteersByEvent` query requires an argument of type `ListVolunteersByEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListVolunteersByEventVariables {
  eventId: string;
}
```
### Return Type
Recall that executing the `ListVolunteersByEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVolunteersByEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListVolunteersByEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVolunteersByEvent, ListVolunteersByEventVariables } from '@firebasegen/default-connector';

// The `ListVolunteersByEvent` query requires an argument of type `ListVolunteersByEventVariables`:
const listVolunteersByEventVars: ListVolunteersByEventVariables = {
  eventId: ..., 
};

// Call the `listVolunteersByEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVolunteersByEvent(listVolunteersByEventVars);
// Variables can be defined inline as well.
const { data } = await listVolunteersByEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVolunteersByEvent(dataConnect, listVolunteersByEventVars);

console.log(data.volunteers);

// Or, you can use the `Promise` API.
listVolunteersByEvent(listVolunteersByEventVars).then((response) => {
  const data = response.data;
  console.log(data.volunteers);
});
```

### Using `ListVolunteersByEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVolunteersByEventRef, ListVolunteersByEventVariables } from '@firebasegen/default-connector';

// The `ListVolunteersByEvent` query requires an argument of type `ListVolunteersByEventVariables`:
const listVolunteersByEventVars: ListVolunteersByEventVariables = {
  eventId: ..., 
};

// Call the `listVolunteersByEventRef()` function to get a reference to the query.
const ref = listVolunteersByEventRef(listVolunteersByEventVars);
// Variables can be defined inline as well.
const ref = listVolunteersByEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVolunteersByEventRef(dataConnect, listVolunteersByEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.volunteers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.volunteers);
});
```

## ListShiftsByEvent
You can execute the `ListShiftsByEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listShiftsByEvent(vars: ListShiftsByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListShiftsByEventData, ListShiftsByEventVariables>;

interface ListShiftsByEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListShiftsByEventVariables): QueryRef<ListShiftsByEventData, ListShiftsByEventVariables>;
}
export const listShiftsByEventRef: ListShiftsByEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listShiftsByEvent(dc: DataConnect, vars: ListShiftsByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListShiftsByEventData, ListShiftsByEventVariables>;

interface ListShiftsByEventRef {
  ...
  (dc: DataConnect, vars: ListShiftsByEventVariables): QueryRef<ListShiftsByEventData, ListShiftsByEventVariables>;
}
export const listShiftsByEventRef: ListShiftsByEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listShiftsByEventRef:
```typescript
const name = listShiftsByEventRef.operationName;
console.log(name);
```

### Variables
The `ListShiftsByEvent` query requires an argument of type `ListShiftsByEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListShiftsByEventVariables {
  eventId: string;
}
```
### Return Type
Recall that executing the `ListShiftsByEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListShiftsByEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListShiftsByEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listShiftsByEvent, ListShiftsByEventVariables } from '@firebasegen/default-connector';

// The `ListShiftsByEvent` query requires an argument of type `ListShiftsByEventVariables`:
const listShiftsByEventVars: ListShiftsByEventVariables = {
  eventId: ..., 
};

// Call the `listShiftsByEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listShiftsByEvent(listShiftsByEventVars);
// Variables can be defined inline as well.
const { data } = await listShiftsByEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listShiftsByEvent(dataConnect, listShiftsByEventVars);

console.log(data.shifts);

// Or, you can use the `Promise` API.
listShiftsByEvent(listShiftsByEventVars).then((response) => {
  const data = response.data;
  console.log(data.shifts);
});
```

### Using `ListShiftsByEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listShiftsByEventRef, ListShiftsByEventVariables } from '@firebasegen/default-connector';

// The `ListShiftsByEvent` query requires an argument of type `ListShiftsByEventVariables`:
const listShiftsByEventVars: ListShiftsByEventVariables = {
  eventId: ..., 
};

// Call the `listShiftsByEventRef()` function to get a reference to the query.
const ref = listShiftsByEventRef(listShiftsByEventVars);
// Variables can be defined inline as well.
const ref = listShiftsByEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listShiftsByEventRef(dataConnect, listShiftsByEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shifts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shifts);
});
```

## ListFeedbacksByEvent
You can execute the `ListFeedbacksByEvent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFeedbacksByEvent(vars: ListFeedbacksByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;

interface ListFeedbacksByEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFeedbacksByEventVariables): QueryRef<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;
}
export const listFeedbacksByEventRef: ListFeedbacksByEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFeedbacksByEvent(dc: DataConnect, vars: ListFeedbacksByEventVariables, options?: ExecuteQueryOptions): QueryPromise<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;

interface ListFeedbacksByEventRef {
  ...
  (dc: DataConnect, vars: ListFeedbacksByEventVariables): QueryRef<ListFeedbacksByEventData, ListFeedbacksByEventVariables>;
}
export const listFeedbacksByEventRef: ListFeedbacksByEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFeedbacksByEventRef:
```typescript
const name = listFeedbacksByEventRef.operationName;
console.log(name);
```

### Variables
The `ListFeedbacksByEvent` query requires an argument of type `ListFeedbacksByEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFeedbacksByEventVariables {
  eventId: string;
}
```
### Return Type
Recall that executing the `ListFeedbacksByEvent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFeedbacksByEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListFeedbacksByEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFeedbacksByEvent, ListFeedbacksByEventVariables } from '@firebasegen/default-connector';

// The `ListFeedbacksByEvent` query requires an argument of type `ListFeedbacksByEventVariables`:
const listFeedbacksByEventVars: ListFeedbacksByEventVariables = {
  eventId: ..., 
};

// Call the `listFeedbacksByEvent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFeedbacksByEvent(listFeedbacksByEventVars);
// Variables can be defined inline as well.
const { data } = await listFeedbacksByEvent({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFeedbacksByEvent(dataConnect, listFeedbacksByEventVars);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
listFeedbacksByEvent(listFeedbacksByEventVars).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

### Using `ListFeedbacksByEvent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFeedbacksByEventRef, ListFeedbacksByEventVariables } from '@firebasegen/default-connector';

// The `ListFeedbacksByEvent` query requires an argument of type `ListFeedbacksByEventVariables`:
const listFeedbacksByEventVars: ListFeedbacksByEventVariables = {
  eventId: ..., 
};

// Call the `listFeedbacksByEventRef()` function to get a reference to the query.
const ref = listFeedbacksByEventRef(listFeedbacksByEventVars);
// Variables can be defined inline as well.
const ref = listFeedbacksByEventRef({ eventId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFeedbacksByEventRef(dataConnect, listFeedbacksByEventVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.feedbacks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.feedbacks);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@firebasegen/default-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  username: ..., // optional
  name: ..., 
  role: ..., 
  phone: ..., // optional
  avatarUrl: ..., // optional
  eventIds: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., email: ..., username: ..., name: ..., role: ..., phone: ..., avatarUrl: ..., eventIds: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@firebasegen/default-connector';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  username: ..., // optional
  name: ..., 
  role: ..., 
  phone: ..., // optional
  avatarUrl: ..., // optional
  eventIds: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., email: ..., username: ..., name: ..., role: ..., phone: ..., avatarUrl: ..., eventIds: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@firebasegen/default-connector';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@firebasegen/default-connector';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## UpsertEvent
You can execute the `UpsertEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertEvent(vars: UpsertEventVariables): MutationPromise<UpsertEventData, UpsertEventVariables>;

interface UpsertEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEventVariables): MutationRef<UpsertEventData, UpsertEventVariables>;
}
export const upsertEventRef: UpsertEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertEvent(dc: DataConnect, vars: UpsertEventVariables): MutationPromise<UpsertEventData, UpsertEventVariables>;

interface UpsertEventRef {
  ...
  (dc: DataConnect, vars: UpsertEventVariables): MutationRef<UpsertEventData, UpsertEventVariables>;
}
export const upsertEventRef: UpsertEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertEventRef:
```typescript
const name = upsertEventRef.operationName;
console.log(name);
```

### Variables
The `UpsertEvent` mutation requires an argument of type `UpsertEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertEventData {
  event_upsert: Event_Key;
}
```
### Using `UpsertEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertEvent, UpsertEventVariables } from '@firebasegen/default-connector';

// The `UpsertEvent` mutation requires an argument of type `UpsertEventVariables`:
const upsertEventVars: UpsertEventVariables = {
  id: ..., 
  name: ..., 
  code: ..., // optional
  startDate: ..., // optional
  endDate: ..., // optional
  description: ..., // optional
  status: ..., 
  allowVolunteerRegistration: ..., // optional
  openShiftVisibility: ..., // optional
  autoGenerationEnabled: ..., // optional
  headerImageUrl: ..., // optional
  footerImageUrl: ..., // optional
  adminUids: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEvent(upsertEventVars);
// Variables can be defined inline as well.
const { data } = await upsertEvent({ id: ..., name: ..., code: ..., startDate: ..., endDate: ..., description: ..., status: ..., allowVolunteerRegistration: ..., openShiftVisibility: ..., autoGenerationEnabled: ..., headerImageUrl: ..., footerImageUrl: ..., adminUids: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertEvent(dataConnect, upsertEventVars);

console.log(data.event_upsert);

// Or, you can use the `Promise` API.
upsertEvent(upsertEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_upsert);
});
```

### Using `UpsertEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertEventRef, UpsertEventVariables } from '@firebasegen/default-connector';

// The `UpsertEvent` mutation requires an argument of type `UpsertEventVariables`:
const upsertEventVars: UpsertEventVariables = {
  id: ..., 
  name: ..., 
  code: ..., // optional
  startDate: ..., // optional
  endDate: ..., // optional
  description: ..., // optional
  status: ..., 
  allowVolunteerRegistration: ..., // optional
  openShiftVisibility: ..., // optional
  autoGenerationEnabled: ..., // optional
  headerImageUrl: ..., // optional
  footerImageUrl: ..., // optional
  adminUids: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertEventRef()` function to get a reference to the mutation.
const ref = upsertEventRef(upsertEventVars);
// Variables can be defined inline as well.
const ref = upsertEventRef({ id: ..., name: ..., code: ..., startDate: ..., endDate: ..., description: ..., status: ..., allowVolunteerRegistration: ..., openShiftVisibility: ..., autoGenerationEnabled: ..., headerImageUrl: ..., footerImageUrl: ..., adminUids: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertEventRef(dataConnect, upsertEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_upsert);
});
```

## DeleteEvent
You can execute the `DeleteEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEvent(vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface DeleteEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
}
export const deleteEventRef: DeleteEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEvent(dc: DataConnect, vars: DeleteEventVariables): MutationPromise<DeleteEventData, DeleteEventVariables>;

interface DeleteEventRef {
  ...
  (dc: DataConnect, vars: DeleteEventVariables): MutationRef<DeleteEventData, DeleteEventVariables>;
}
export const deleteEventRef: DeleteEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEventRef:
```typescript
const name = deleteEventRef.operationName;
console.log(name);
```

### Variables
The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEventVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEventData {
  event_delete?: Event_Key | null;
}
```
### Using `DeleteEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEvent, DeleteEventVariables } from '@firebasegen/default-connector';

// The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`:
const deleteEventVars: DeleteEventVariables = {
  id: ..., 
};

// Call the `deleteEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEvent(deleteEventVars);
// Variables can be defined inline as well.
const { data } = await deleteEvent({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEvent(dataConnect, deleteEventVars);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
deleteEvent(deleteEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

### Using `DeleteEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEventRef, DeleteEventVariables } from '@firebasegen/default-connector';

// The `DeleteEvent` mutation requires an argument of type `DeleteEventVariables`:
const deleteEventVars: DeleteEventVariables = {
  id: ..., 
};

// Call the `deleteEventRef()` function to get a reference to the mutation.
const ref = deleteEventRef(deleteEventVars);
// Variables can be defined inline as well.
const ref = deleteEventRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEventRef(dataConnect, deleteEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_delete);
});
```

## UpsertCategory
You can execute the `UpsertCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCategory(vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface UpsertCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
}
export const upsertCategoryRef: UpsertCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCategory(dc: DataConnect, vars: UpsertCategoryVariables): MutationPromise<UpsertCategoryData, UpsertCategoryVariables>;

interface UpsertCategoryRef {
  ...
  (dc: DataConnect, vars: UpsertCategoryVariables): MutationRef<UpsertCategoryData, UpsertCategoryVariables>;
}
export const upsertCategoryRef: UpsertCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCategoryRef:
```typescript
const name = upsertCategoryRef.operationName;
console.log(name);
```

### Variables
The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCategoryVariables {
  id: string;
  eventId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  priority?: number | null;
  createdAt?: string | null;
}
```
### Return Type
Recall that executing the `UpsertCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCategoryData {
  category_upsert: Category_Key;
}
```
### Using `UpsertCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCategory, UpsertCategoryVariables } from '@firebasegen/default-connector';

// The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`:
const upsertCategoryVars: UpsertCategoryVariables = {
  id: ..., 
  eventId: ..., 
  name: ..., 
  description: ..., // optional
  color: ..., // optional
  priority: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCategory(upsertCategoryVars);
// Variables can be defined inline as well.
const { data } = await upsertCategory({ id: ..., eventId: ..., name: ..., description: ..., color: ..., priority: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCategory(dataConnect, upsertCategoryVars);

console.log(data.category_upsert);

// Or, you can use the `Promise` API.
upsertCategory(upsertCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_upsert);
});
```

### Using `UpsertCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCategoryRef, UpsertCategoryVariables } from '@firebasegen/default-connector';

// The `UpsertCategory` mutation requires an argument of type `UpsertCategoryVariables`:
const upsertCategoryVars: UpsertCategoryVariables = {
  id: ..., 
  eventId: ..., 
  name: ..., 
  description: ..., // optional
  color: ..., // optional
  priority: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertCategoryRef()` function to get a reference to the mutation.
const ref = upsertCategoryRef(upsertCategoryVars);
// Variables can be defined inline as well.
const ref = upsertCategoryRef({ id: ..., eventId: ..., name: ..., description: ..., color: ..., priority: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCategoryRef(dataConnect, upsertCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_upsert);
});
```

## DeleteCategory
You can execute the `DeleteCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface DeleteCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
}
export const deleteCategoryRef: DeleteCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface DeleteCategoryRef {
  ...
  (dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
}
export const deleteCategoryRef: DeleteCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCategoryRef:
```typescript
const name = deleteCategoryRef.operationName;
console.log(name);
```

### Variables
The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCategoryVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}
```
### Using `DeleteCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCategory, DeleteCategoryVariables } from '@firebasegen/default-connector';

// The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`:
const deleteCategoryVars: DeleteCategoryVariables = {
  id: ..., 
};

// Call the `deleteCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCategory(deleteCategoryVars);
// Variables can be defined inline as well.
const { data } = await deleteCategory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCategory(dataConnect, deleteCategoryVars);

console.log(data.category_delete);

// Or, you can use the `Promise` API.
deleteCategory(deleteCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_delete);
});
```

### Using `DeleteCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCategoryRef, DeleteCategoryVariables } from '@firebasegen/default-connector';

// The `DeleteCategory` mutation requires an argument of type `DeleteCategoryVariables`:
const deleteCategoryVars: DeleteCategoryVariables = {
  id: ..., 
};

// Call the `deleteCategoryRef()` function to get a reference to the mutation.
const ref = deleteCategoryRef(deleteCategoryVars);
// Variables can be defined inline as well.
const ref = deleteCategoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCategoryRef(dataConnect, deleteCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_delete);
});
```

## UpsertSchedule
You can execute the `UpsertSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertSchedule(vars: UpsertScheduleVariables): MutationPromise<UpsertScheduleData, UpsertScheduleVariables>;

interface UpsertScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertScheduleVariables): MutationRef<UpsertScheduleData, UpsertScheduleVariables>;
}
export const upsertScheduleRef: UpsertScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertSchedule(dc: DataConnect, vars: UpsertScheduleVariables): MutationPromise<UpsertScheduleData, UpsertScheduleVariables>;

interface UpsertScheduleRef {
  ...
  (dc: DataConnect, vars: UpsertScheduleVariables): MutationRef<UpsertScheduleData, UpsertScheduleVariables>;
}
export const upsertScheduleRef: UpsertScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertScheduleRef:
```typescript
const name = upsertScheduleRef.operationName;
console.log(name);
```

### Variables
The `UpsertSchedule` mutation requires an argument of type `UpsertScheduleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertScheduleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertScheduleData {
  schedule_upsert: Schedule_Key;
}
```
### Using `UpsertSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertSchedule, UpsertScheduleVariables } from '@firebasegen/default-connector';

// The `UpsertSchedule` mutation requires an argument of type `UpsertScheduleVariables`:
const upsertScheduleVars: UpsertScheduleVariables = {
  id: ..., 
  eventId: ..., 
  title: ..., 
  date: ..., 
  startTime: ..., 
  endTime: ..., 
  generalLocation: ..., // optional
  categoryId: ..., // optional
  requiredVolunteers: ..., // optional
  roles: ..., // optional
  notes: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertSchedule(upsertScheduleVars);
// Variables can be defined inline as well.
const { data } = await upsertSchedule({ id: ..., eventId: ..., title: ..., date: ..., startTime: ..., endTime: ..., generalLocation: ..., categoryId: ..., requiredVolunteers: ..., roles: ..., notes: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertSchedule(dataConnect, upsertScheduleVars);

console.log(data.schedule_upsert);

// Or, you can use the `Promise` API.
upsertSchedule(upsertScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_upsert);
});
```

### Using `UpsertSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertScheduleRef, UpsertScheduleVariables } from '@firebasegen/default-connector';

// The `UpsertSchedule` mutation requires an argument of type `UpsertScheduleVariables`:
const upsertScheduleVars: UpsertScheduleVariables = {
  id: ..., 
  eventId: ..., 
  title: ..., 
  date: ..., 
  startTime: ..., 
  endTime: ..., 
  generalLocation: ..., // optional
  categoryId: ..., // optional
  requiredVolunteers: ..., // optional
  roles: ..., // optional
  notes: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertScheduleRef()` function to get a reference to the mutation.
const ref = upsertScheduleRef(upsertScheduleVars);
// Variables can be defined inline as well.
const ref = upsertScheduleRef({ id: ..., eventId: ..., title: ..., date: ..., startTime: ..., endTime: ..., generalLocation: ..., categoryId: ..., requiredVolunteers: ..., roles: ..., notes: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertScheduleRef(dataConnect, upsertScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_upsert);
});
```

## DeleteSchedule
You can execute the `DeleteSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSchedule(vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface DeleteScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
}
export const deleteScheduleRef: DeleteScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSchedule(dc: DataConnect, vars: DeleteScheduleVariables): MutationPromise<DeleteScheduleData, DeleteScheduleVariables>;

interface DeleteScheduleRef {
  ...
  (dc: DataConnect, vars: DeleteScheduleVariables): MutationRef<DeleteScheduleData, DeleteScheduleVariables>;
}
export const deleteScheduleRef: DeleteScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteScheduleRef:
```typescript
const name = deleteScheduleRef.operationName;
console.log(name);
```

### Variables
The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteScheduleVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteScheduleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteScheduleData {
  schedule_delete?: Schedule_Key | null;
}
```
### Using `DeleteSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSchedule, DeleteScheduleVariables } from '@firebasegen/default-connector';

// The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`:
const deleteScheduleVars: DeleteScheduleVariables = {
  id: ..., 
};

// Call the `deleteSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSchedule(deleteScheduleVars);
// Variables can be defined inline as well.
const { data } = await deleteSchedule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSchedule(dataConnect, deleteScheduleVars);

console.log(data.schedule_delete);

// Or, you can use the `Promise` API.
deleteSchedule(deleteScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.schedule_delete);
});
```

### Using `DeleteSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteScheduleRef, DeleteScheduleVariables } from '@firebasegen/default-connector';

// The `DeleteSchedule` mutation requires an argument of type `DeleteScheduleVariables`:
const deleteScheduleVars: DeleteScheduleVariables = {
  id: ..., 
};

// Call the `deleteScheduleRef()` function to get a reference to the mutation.
const ref = deleteScheduleRef(deleteScheduleVars);
// Variables can be defined inline as well.
const ref = deleteScheduleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteScheduleRef(dataConnect, deleteScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.schedule_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.schedule_delete);
});
```

## UpsertVolunteer
You can execute the `UpsertVolunteer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertVolunteer(vars: UpsertVolunteerVariables): MutationPromise<UpsertVolunteerData, UpsertVolunteerVariables>;

interface UpsertVolunteerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertVolunteerVariables): MutationRef<UpsertVolunteerData, UpsertVolunteerVariables>;
}
export const upsertVolunteerRef: UpsertVolunteerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertVolunteer(dc: DataConnect, vars: UpsertVolunteerVariables): MutationPromise<UpsertVolunteerData, UpsertVolunteerVariables>;

interface UpsertVolunteerRef {
  ...
  (dc: DataConnect, vars: UpsertVolunteerVariables): MutationRef<UpsertVolunteerData, UpsertVolunteerVariables>;
}
export const upsertVolunteerRef: UpsertVolunteerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertVolunteerRef:
```typescript
const name = upsertVolunteerRef.operationName;
console.log(name);
```

### Variables
The `UpsertVolunteer` mutation requires an argument of type `UpsertVolunteerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertVolunteer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertVolunteerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertVolunteerData {
  volunteer_upsert: Volunteer_Key;
}
```
### Using `UpsertVolunteer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertVolunteer, UpsertVolunteerVariables } from '@firebasegen/default-connector';

// The `UpsertVolunteer` mutation requires an argument of type `UpsertVolunteerVariables`:
const upsertVolunteerVars: UpsertVolunteerVariables = {
  id: ..., 
  eventId: ..., 
  userId: ..., // optional
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  type: ..., 
  experience: ..., 
  availabilities: ..., // optional
  unavailabilities: ..., // optional
  categoryPreferences: ..., // optional
  adminRating: ..., // optional
  adminNotes: ..., // optional
  active: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertVolunteer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertVolunteer(upsertVolunteerVars);
// Variables can be defined inline as well.
const { data } = await upsertVolunteer({ id: ..., eventId: ..., userId: ..., name: ..., email: ..., phone: ..., type: ..., experience: ..., availabilities: ..., unavailabilities: ..., categoryPreferences: ..., adminRating: ..., adminNotes: ..., active: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertVolunteer(dataConnect, upsertVolunteerVars);

console.log(data.volunteer_upsert);

// Or, you can use the `Promise` API.
upsertVolunteer(upsertVolunteerVars).then((response) => {
  const data = response.data;
  console.log(data.volunteer_upsert);
});
```

### Using `UpsertVolunteer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertVolunteerRef, UpsertVolunteerVariables } from '@firebasegen/default-connector';

// The `UpsertVolunteer` mutation requires an argument of type `UpsertVolunteerVariables`:
const upsertVolunteerVars: UpsertVolunteerVariables = {
  id: ..., 
  eventId: ..., 
  userId: ..., // optional
  name: ..., 
  email: ..., // optional
  phone: ..., // optional
  type: ..., 
  experience: ..., 
  availabilities: ..., // optional
  unavailabilities: ..., // optional
  categoryPreferences: ..., // optional
  adminRating: ..., // optional
  adminNotes: ..., // optional
  active: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertVolunteerRef()` function to get a reference to the mutation.
const ref = upsertVolunteerRef(upsertVolunteerVars);
// Variables can be defined inline as well.
const ref = upsertVolunteerRef({ id: ..., eventId: ..., userId: ..., name: ..., email: ..., phone: ..., type: ..., experience: ..., availabilities: ..., unavailabilities: ..., categoryPreferences: ..., adminRating: ..., adminNotes: ..., active: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertVolunteerRef(dataConnect, upsertVolunteerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.volunteer_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.volunteer_upsert);
});
```

## DeleteVolunteer
You can execute the `DeleteVolunteer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteVolunteer(vars: DeleteVolunteerVariables): MutationPromise<DeleteVolunteerData, DeleteVolunteerVariables>;

interface DeleteVolunteerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVolunteerVariables): MutationRef<DeleteVolunteerData, DeleteVolunteerVariables>;
}
export const deleteVolunteerRef: DeleteVolunteerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteVolunteer(dc: DataConnect, vars: DeleteVolunteerVariables): MutationPromise<DeleteVolunteerData, DeleteVolunteerVariables>;

interface DeleteVolunteerRef {
  ...
  (dc: DataConnect, vars: DeleteVolunteerVariables): MutationRef<DeleteVolunteerData, DeleteVolunteerVariables>;
}
export const deleteVolunteerRef: DeleteVolunteerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteVolunteerRef:
```typescript
const name = deleteVolunteerRef.operationName;
console.log(name);
```

### Variables
The `DeleteVolunteer` mutation requires an argument of type `DeleteVolunteerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteVolunteerVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteVolunteer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteVolunteerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteVolunteerData {
  volunteer_delete?: Volunteer_Key | null;
}
```
### Using `DeleteVolunteer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteVolunteer, DeleteVolunteerVariables } from '@firebasegen/default-connector';

// The `DeleteVolunteer` mutation requires an argument of type `DeleteVolunteerVariables`:
const deleteVolunteerVars: DeleteVolunteerVariables = {
  id: ..., 
};

// Call the `deleteVolunteer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteVolunteer(deleteVolunteerVars);
// Variables can be defined inline as well.
const { data } = await deleteVolunteer({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteVolunteer(dataConnect, deleteVolunteerVars);

console.log(data.volunteer_delete);

// Or, you can use the `Promise` API.
deleteVolunteer(deleteVolunteerVars).then((response) => {
  const data = response.data;
  console.log(data.volunteer_delete);
});
```

### Using `DeleteVolunteer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteVolunteerRef, DeleteVolunteerVariables } from '@firebasegen/default-connector';

// The `DeleteVolunteer` mutation requires an argument of type `DeleteVolunteerVariables`:
const deleteVolunteerVars: DeleteVolunteerVariables = {
  id: ..., 
};

// Call the `deleteVolunteerRef()` function to get a reference to the mutation.
const ref = deleteVolunteerRef(deleteVolunteerVars);
// Variables can be defined inline as well.
const ref = deleteVolunteerRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteVolunteerRef(dataConnect, deleteVolunteerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.volunteer_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.volunteer_delete);
});
```

## UpsertShift
You can execute the `UpsertShift` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertShift(vars: UpsertShiftVariables): MutationPromise<UpsertShiftData, UpsertShiftVariables>;

interface UpsertShiftRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertShiftVariables): MutationRef<UpsertShiftData, UpsertShiftVariables>;
}
export const upsertShiftRef: UpsertShiftRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertShift(dc: DataConnect, vars: UpsertShiftVariables): MutationPromise<UpsertShiftData, UpsertShiftVariables>;

interface UpsertShiftRef {
  ...
  (dc: DataConnect, vars: UpsertShiftVariables): MutationRef<UpsertShiftData, UpsertShiftVariables>;
}
export const upsertShiftRef: UpsertShiftRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertShiftRef:
```typescript
const name = upsertShiftRef.operationName;
console.log(name);
```

### Variables
The `UpsertShift` mutation requires an argument of type `UpsertShiftVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertShift` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertShiftData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertShiftData {
  shift_upsert: Shift_Key;
}
```
### Using `UpsertShift`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertShift, UpsertShiftVariables } from '@firebasegen/default-connector';

// The `UpsertShift` mutation requires an argument of type `UpsertShiftVariables`:
const upsertShiftVars: UpsertShiftVariables = {
  id: ..., 
  eventId: ..., 
  scheduleId: ..., 
  title: ..., // optional
  date: ..., 
  startTime: ..., 
  endTime: ..., 
  generalLocation: ..., // optional
  categoryId: ..., // optional
  status: ..., 
  hasDeficit: ..., // optional
  deficitCount: ..., // optional
  assignments: ..., // optional
  approvedBy: ..., // optional
  approvedAt: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertShift()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertShift(upsertShiftVars);
// Variables can be defined inline as well.
const { data } = await upsertShift({ id: ..., eventId: ..., scheduleId: ..., title: ..., date: ..., startTime: ..., endTime: ..., generalLocation: ..., categoryId: ..., status: ..., hasDeficit: ..., deficitCount: ..., assignments: ..., approvedBy: ..., approvedAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertShift(dataConnect, upsertShiftVars);

console.log(data.shift_upsert);

// Or, you can use the `Promise` API.
upsertShift(upsertShiftVars).then((response) => {
  const data = response.data;
  console.log(data.shift_upsert);
});
```

### Using `UpsertShift`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertShiftRef, UpsertShiftVariables } from '@firebasegen/default-connector';

// The `UpsertShift` mutation requires an argument of type `UpsertShiftVariables`:
const upsertShiftVars: UpsertShiftVariables = {
  id: ..., 
  eventId: ..., 
  scheduleId: ..., 
  title: ..., // optional
  date: ..., 
  startTime: ..., 
  endTime: ..., 
  generalLocation: ..., // optional
  categoryId: ..., // optional
  status: ..., 
  hasDeficit: ..., // optional
  deficitCount: ..., // optional
  assignments: ..., // optional
  approvedBy: ..., // optional
  approvedAt: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertShiftRef()` function to get a reference to the mutation.
const ref = upsertShiftRef(upsertShiftVars);
// Variables can be defined inline as well.
const ref = upsertShiftRef({ id: ..., eventId: ..., scheduleId: ..., title: ..., date: ..., startTime: ..., endTime: ..., generalLocation: ..., categoryId: ..., status: ..., hasDeficit: ..., deficitCount: ..., assignments: ..., approvedBy: ..., approvedAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertShiftRef(dataConnect, upsertShiftVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shift_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shift_upsert);
});
```

## DeleteShift
You can execute the `DeleteShift` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteShift(vars: DeleteShiftVariables): MutationPromise<DeleteShiftData, DeleteShiftVariables>;

interface DeleteShiftRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteShiftVariables): MutationRef<DeleteShiftData, DeleteShiftVariables>;
}
export const deleteShiftRef: DeleteShiftRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteShift(dc: DataConnect, vars: DeleteShiftVariables): MutationPromise<DeleteShiftData, DeleteShiftVariables>;

interface DeleteShiftRef {
  ...
  (dc: DataConnect, vars: DeleteShiftVariables): MutationRef<DeleteShiftData, DeleteShiftVariables>;
}
export const deleteShiftRef: DeleteShiftRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteShiftRef:
```typescript
const name = deleteShiftRef.operationName;
console.log(name);
```

### Variables
The `DeleteShift` mutation requires an argument of type `DeleteShiftVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteShiftVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteShift` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteShiftData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteShiftData {
  shift_delete?: Shift_Key | null;
}
```
### Using `DeleteShift`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteShift, DeleteShiftVariables } from '@firebasegen/default-connector';

// The `DeleteShift` mutation requires an argument of type `DeleteShiftVariables`:
const deleteShiftVars: DeleteShiftVariables = {
  id: ..., 
};

// Call the `deleteShift()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteShift(deleteShiftVars);
// Variables can be defined inline as well.
const { data } = await deleteShift({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteShift(dataConnect, deleteShiftVars);

console.log(data.shift_delete);

// Or, you can use the `Promise` API.
deleteShift(deleteShiftVars).then((response) => {
  const data = response.data;
  console.log(data.shift_delete);
});
```

### Using `DeleteShift`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteShiftRef, DeleteShiftVariables } from '@firebasegen/default-connector';

// The `DeleteShift` mutation requires an argument of type `DeleteShiftVariables`:
const deleteShiftVars: DeleteShiftVariables = {
  id: ..., 
};

// Call the `deleteShiftRef()` function to get a reference to the mutation.
const ref = deleteShiftRef(deleteShiftVars);
// Variables can be defined inline as well.
const ref = deleteShiftRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteShiftRef(dataConnect, deleteShiftVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shift_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shift_delete);
});
```

## UpsertFeedback
You can execute the `UpsertFeedback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertFeedback(vars: UpsertFeedbackVariables): MutationPromise<UpsertFeedbackData, UpsertFeedbackVariables>;

interface UpsertFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertFeedbackVariables): MutationRef<UpsertFeedbackData, UpsertFeedbackVariables>;
}
export const upsertFeedbackRef: UpsertFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertFeedback(dc: DataConnect, vars: UpsertFeedbackVariables): MutationPromise<UpsertFeedbackData, UpsertFeedbackVariables>;

interface UpsertFeedbackRef {
  ...
  (dc: DataConnect, vars: UpsertFeedbackVariables): MutationRef<UpsertFeedbackData, UpsertFeedbackVariables>;
}
export const upsertFeedbackRef: UpsertFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertFeedbackRef:
```typescript
const name = upsertFeedbackRef.operationName;
console.log(name);
```

### Variables
The `UpsertFeedback` mutation requires an argument of type `UpsertFeedbackVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertFeedbackVariables {
  id: string;
  eventId: string;
  volunteerId: string;
  shiftId?: string | null;
  rating: number;
  comments?: string | null;
  createdAt?: string | null;
}
```
### Return Type
Recall that executing the `UpsertFeedback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertFeedbackData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertFeedbackData {
  feedback_upsert: Feedback_Key;
}
```
### Using `UpsertFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertFeedback, UpsertFeedbackVariables } from '@firebasegen/default-connector';

// The `UpsertFeedback` mutation requires an argument of type `UpsertFeedbackVariables`:
const upsertFeedbackVars: UpsertFeedbackVariables = {
  id: ..., 
  eventId: ..., 
  volunteerId: ..., 
  shiftId: ..., // optional
  rating: ..., 
  comments: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertFeedback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertFeedback(upsertFeedbackVars);
// Variables can be defined inline as well.
const { data } = await upsertFeedback({ id: ..., eventId: ..., volunteerId: ..., shiftId: ..., rating: ..., comments: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertFeedback(dataConnect, upsertFeedbackVars);

console.log(data.feedback_upsert);

// Or, you can use the `Promise` API.
upsertFeedback(upsertFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedback_upsert);
});
```

### Using `UpsertFeedback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertFeedbackRef, UpsertFeedbackVariables } from '@firebasegen/default-connector';

// The `UpsertFeedback` mutation requires an argument of type `UpsertFeedbackVariables`:
const upsertFeedbackVars: UpsertFeedbackVariables = {
  id: ..., 
  eventId: ..., 
  volunteerId: ..., 
  shiftId: ..., // optional
  rating: ..., 
  comments: ..., // optional
  createdAt: ..., // optional
};

// Call the `upsertFeedbackRef()` function to get a reference to the mutation.
const ref = upsertFeedbackRef(upsertFeedbackVars);
// Variables can be defined inline as well.
const ref = upsertFeedbackRef({ id: ..., eventId: ..., volunteerId: ..., shiftId: ..., rating: ..., comments: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertFeedbackRef(dataConnect, upsertFeedbackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.feedback_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.feedback_upsert);
});
```

## DeleteFeedback
You can execute the `DeleteFeedback` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFeedback(vars: DeleteFeedbackVariables): MutationPromise<DeleteFeedbackData, DeleteFeedbackVariables>;

interface DeleteFeedbackRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFeedbackVariables): MutationRef<DeleteFeedbackData, DeleteFeedbackVariables>;
}
export const deleteFeedbackRef: DeleteFeedbackRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFeedback(dc: DataConnect, vars: DeleteFeedbackVariables): MutationPromise<DeleteFeedbackData, DeleteFeedbackVariables>;

interface DeleteFeedbackRef {
  ...
  (dc: DataConnect, vars: DeleteFeedbackVariables): MutationRef<DeleteFeedbackData, DeleteFeedbackVariables>;
}
export const deleteFeedbackRef: DeleteFeedbackRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFeedbackRef:
```typescript
const name = deleteFeedbackRef.operationName;
console.log(name);
```

### Variables
The `DeleteFeedback` mutation requires an argument of type `DeleteFeedbackVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFeedbackVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteFeedback` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFeedbackData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFeedbackData {
  feedback_delete?: Feedback_Key | null;
}
```
### Using `DeleteFeedback`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFeedback, DeleteFeedbackVariables } from '@firebasegen/default-connector';

// The `DeleteFeedback` mutation requires an argument of type `DeleteFeedbackVariables`:
const deleteFeedbackVars: DeleteFeedbackVariables = {
  id: ..., 
};

// Call the `deleteFeedback()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFeedback(deleteFeedbackVars);
// Variables can be defined inline as well.
const { data } = await deleteFeedback({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFeedback(dataConnect, deleteFeedbackVars);

console.log(data.feedback_delete);

// Or, you can use the `Promise` API.
deleteFeedback(deleteFeedbackVars).then((response) => {
  const data = response.data;
  console.log(data.feedback_delete);
});
```

### Using `DeleteFeedback`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFeedbackRef, DeleteFeedbackVariables } from '@firebasegen/default-connector';

// The `DeleteFeedback` mutation requires an argument of type `DeleteFeedbackVariables`:
const deleteFeedbackVars: DeleteFeedbackVariables = {
  id: ..., 
};

// Call the `deleteFeedbackRef()` function to get a reference to the mutation.
const ref = deleteFeedbackRef(deleteFeedbackVars);
// Variables can be defined inline as well.
const ref = deleteFeedbackRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFeedbackRef(dataConnect, deleteFeedbackVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.feedback_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.feedback_delete);
});
```

