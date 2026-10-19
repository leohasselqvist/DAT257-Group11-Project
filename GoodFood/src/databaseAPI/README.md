# GoodFood Database API

Express + SQLite (`better-sqlite3`) backend and a client module (`API.ts`) for user profiles and favourite recipes in the Good Food app.

## Getting started

Install dependencies:

```
npm install
```

Then start everything:

```
npm start
```

This starts both the database server and the web app. The terminal shows the local URL to open in your browser. The database server runs on port `8000` (`http://localhost:8000`).
### Database file

The SQLite database is `goodfood.db` in the project root. It is created automatically on first run, and the tables are created from `databaseServer/schema.sql` every time the server starts (`CREATE TABLE IF NOT EXISTS`, so existing data is kept).

To reset the database for testing, stop the server, delete `goodfood.db` and run `npm start` again.

## Using the API

Import `API.ts` and `UserContext.tsx` in the file where you need them:

```ts
import * as api from "../databaseAPI/API";
import {
    getCurrentUserId,
    storeCurrentUserId,
    clearCurrentUserId
} from "../contexts/UserContext";
```

Adjust the import paths depending on where your file is located.

> **Note:** all API functions are asynchronous. The examples below use `await`, so they must be inside an `async` function.

### Logging in and registering

`addUser(username)` creates a new user and returns its ID, or returns `-1` if the username is already taken. `getUserId(username)` returns the ID of an existing user, or `-1` if there is no such user. To log in or register in one step:

```ts
let userId = await api.addUser(username);
if (userId === -1) {
    userId = await api.getUserId(username);
}
storeCurrentUserId(userId);
```

### Current user

When a user logs in or is created, save their ID with `storeCurrentUserId(userId)`. In any other file, get it with `getCurrentUserId()`. On logout, call `clearCurrentUserId()`.

```ts
const userId = getCurrentUserId();
```

The ID is needed for functions that update a profile or manage favourite recipes. Check that `userId` isn't `null` before using it.

The ID is only kept in memory, so it is cleared whenever the app reloads.

## Favourite recipes

```ts
const userId = getCurrentUserId();

if (userId !== null) {
    // Add recipe 5 to favourites (1 = success, -1 = failed)
    await api.addFavouriteRecipe(userId, 5);

    // Get the user's favourite recipe IDs, e.g. [3, 5, 12]
    const favourites = await api.getFavouriteRecipes(userId);

    // Remove recipe 5 from favourites (1 = removed, 0 = wasn't a favourite)
    await api.removeFavouriteRecipe(userId, 5);
}
```

The number `5` is the recipe ID. `getFavouriteRecipes()` returns an array of recipe IDs, for example `[3, 5, 12]`, or an empty array if the user has none. Call it again after adding or removing to refresh the list.

## User profile

```ts
const userId = getCurrentUserId();

if (userId !== null) {
    // Update profile
    await api.updateUserProfile(userId, "Alex", "Smith", "alex@example.com");

    // Get profile information
    const user = await api.getUserById(userId);

    console.log(user.first_name);
    console.log(user.last_name);
    console.log(user.email);
}
```

`getUserById()` returns `{ id, username, first_name, last_name, email }`. The name and email fields are `null` until they have been set.

The name and email fields in `updateUserProfile()` are optional. Pass `undefined` for fields you don't want to change. For example, to update only the email:

```ts
await api.updateUserProfile(userId, undefined, undefined, "new@example.com");
```

Email addresses must be unique. Updating to an email that another user already has makes the server fail, and the call rejects.

## Function reference

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `addUser` | `username: string` | `Promise<number>` | The new user's ID, or `-1` if the username is taken. |
| `getUserId` | `username: string` | `Promise<number>` | The user's ID, or `-1` if the user doesn't exist. |
| `getUserById` | `userId: number` | `Promise<User>` | The user's profile. Throws if the user isn't found. |
| `updateUserProfile` | `userId: number`, `firstName?: string`, `lastName?: string`, `email?: string` | `Promise<boolean>` | `true` when the update was processed. Only the fields you pass are changed. |
| `removeUser` | `username: string` | `Promise<number>` | `1` if deleted, `0` if no such user, `-1` on error. Also deletes the user's favourites. |
| `addFavouriteRecipe` | `userId: number`, `recipeId: number` | `Promise<number>` | `1` on success, `-1` if it failed. |
| `getFavouriteRecipes` | `userId: number` | `Promise<number[]>` | The user's favourite recipe IDs. Empty array if none. |
| `removeFavouriteRecipe` | `userId: number`, `recipeId: number` | `Promise<number>` | `1` if removed, `0` if it wasn't a favourite, `-1` on error. |

## Error handling

| Situation | Behaviour |
| --- | --- |
| Username already taken | `addUser` returns `-1`. |
| User doesn't exist | `getUserId` returns `-1`, `removeUser` returns `0`, `addFavouriteRecipe` returns `-1`, `getFavouriteRecipes` returns `[]`, `getUserById` throws. `updateUserProfile` still returns `true` but changes nothing. |
| Recipe is already a favourite | `addFavouriteRecipe` returns `-1`. |
| Recipe isn't a favourite | `removeFavouriteRecipe` returns `0`. |
| Email already used by another user | `updateUserProfile` rejects. |
| Database server isn't running | The call rejects with a network error. |

Wrap calls in `try/catch` if you need to handle the cases that throw or reject.

## Not implemented yet

- Passwords
- Allergies