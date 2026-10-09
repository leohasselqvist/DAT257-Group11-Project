import Database from 'better-sqlite3';
import {readFileSync} from 'node:fs';
import test from 'node:test';


// Creates a new db if not exits
const db = new Database('goodfood.db');
db.pragma('foreign_keys = ON');

export function createTables():void{
    db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));            
}
//adds a new user to the database and returns status 
export function addUser(user :{username: string;}): number{
    //create a prepared statement 
    const pstmt = db.prepare('INSERT INTO users (username) VALUES (?)');
    try { 
        //insert the username into the table
        const r = pstmt.run(user.username);
        // return the id of the newly created user
        return Number(r.lastInsertRowid);
    }
    catch(err: any){
        //if the user already exists
        //find its id and return it
        console.log('insert failed:', err.message);
    }
} 

//retrieves a user id from the db 
export function getUserId(user:{username:string}): number{
    try {
        const pstmt = db.prepare("SELECT id FROM users WHERE username = ?");
        const r = pstmt.get(user.username) as {id : number};
        return r.id;
    }
    catch(err){
        console.log("user does not exist");
        return -1;
    }
}

//removes a user from the database and returns the number of rows affected
export function removeUser(user:{username: string}): number{
        const ptstm = db.prepare("DELETE FROM users where username = ?");
    try {
        const r = ptstm.run(user.username);
        if (r.changes === 0) {
            console.log("user does not exist");
        } 
        return r.changes;
    } catch (error) {
        return -1
    }
}

// adds a favourite recipe to the database
export function addFavouriteRecipe(userId: number,recipeId: number ): number{
    const ptstm = db.prepare("INSERT INTO recipes (user_id, recipe_id) VALUES  (?,?)")
    try {
        const r = ptstm.run(userId,recipeId);
        return r.changes;
    } catch (error) {
        return -1;
    }
}

//removes a favourite recipe from the database
export function removeFavouriteRecipe(userId: number,recipeId: number ): number{
    const ptstm = db.prepare("DELETE FROM recipes WHERE user_id = ? AND recipe_id = ?");
    try {
        const r = ptstm.run(userId,recipeId);
        return r.changes;
    } catch (error) {
        return -1;
    }
}

//retrieves a list of all favourite recipes that belong to a user
export function getFavouriteRecipes(userId:number): number[]{
    const ptstm = db.prepare("SELECT recipe_id FROM recipes WHERE user_id = ?");
    try {
        const rows = ptstm.all(userId) as { recipe_id:number}[];
        return rows.map((row) => row.recipe_id);
    } catch (error) {
        return [];
    }
}