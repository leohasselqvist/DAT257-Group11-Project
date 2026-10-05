const Database = require('better-sqlite3')('foobar.db', Option);
import {readFileSync} from 'node:fs';


// Creates a new db if not exits
const db = new Database('goodfood.db');


function createTables():void{
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
        return Number(getUser((user)));

    }
} 

//retrieves a user id from the db 
export function getUser(user:{username:string}): number{
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
export function removeUser()void;


