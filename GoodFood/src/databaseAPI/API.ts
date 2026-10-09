const API_URL = 'http://localhost:8000'; // use 10.0.2.2:8000 on the Android emulator, or your PC's IP on a phone

// Looks up a user's id by username. Returns -1 if the user doesn't exist.
export async function getUserId(username: string): Promise<number> {
    const res = await fetch(API_URL + '/user?username=' + encodeURIComponent(username));
    const data = await res.json();
    return data.id;
}

// Login/register in one: creates the user, or returns the existing id if the name is taken.
// Save the returned id and pass it to the favourite functions below.
export async function addUser(username: string): Promise<number> {
    const res = await fetch(API_URL + '/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username }),
    });
    const data = await res.json();
    return data.id;
}

// Deletes a user and their favourites. Returns 1 if deleted, 0 if no such user.
export async function removeUser(username: string): Promise<number> {
    const res = await fetch(API_URL + '/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username }),
    });
    const data = await res.json();
    return data.stat;
}

// Favourites a recipe for a user. recipeId is the recipe's id number.
// Returns 1 on success, -1 if it failed (already favourited or user doesn't exist).
export async function addFavouriteRecipe(userId: number, recipeId: number) {
    const res = await fetch(API_URL + '/favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, recipeId: recipeId }),
    });
    return await res.json();
}

// Unfavourites a recipe for a user.
// Returns 1 if removed, 0 if it wasn't favourited, -1 on error.
export async function removeFavouriteRecipe(userId: number, recipeId: number) {
    const res = await fetch(API_URL + '/favourite', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, recipeId: recipeId }),
    });
    return await res.json();
}

// Gets the recipe ids a user has favourited, e.g. [5, 7]. Empty list if none.
// Call this again after adding or removing to refresh the list.
export async function getFavouriteRecipes(userId: number): Promise<number[]> {
    const res = await fetch(API_URL + '/favourite?userId=' + encodeURIComponent(userId));
    return await res.json();
}