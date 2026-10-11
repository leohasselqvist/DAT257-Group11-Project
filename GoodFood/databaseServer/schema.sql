--DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS recipes;
---INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES ('testuser', 'Test', 'User', 'testuser@example.com', 'hashed_password');



CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT 
);



CREATE TABLE IF NOT EXISTS recipes(
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    PRIMARY KEY(user_id, recipe_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


