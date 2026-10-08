import express from 'express'; //
import cors from 'cors';
import * as db from './db';

db.createTables();
const app = express(); // this stores the server object returned by express into app
app.use(cors()); // 
app.use(express.json());


// this starts the server at port 8000
app.listen( 8000, function() { 
  console.log('Server running on port 8000');
});

//this is a rule that handles get requests on the /health route 
app.get('/health',function (req,res) {
  res.json({ok: true})
});
//this function handles the username request and returns the id
app.get('/user',function (req,res) {
  const username = String(req.query.username);
  const userId = db.getUserId({username : username});
  res.json({id : userId});
});

//this function adds a new user to the database
app.post('/user',function(req,res){
  const username = String(req.body.username);
  const userId = db.addUser({username: username});
  console.log('returning id', userId);
  res.json({id: userId});
});

//this function removes a user from the database
app.delete('/user',function(req,res){
  const username = String(req.body.username);
  const status = db.removeUser({username : username});
  res.json({stat: status});
});

// this function removes a users favourite recipe from the db
app.delete('/favourite',function(req,res){
  const userId = req.body.userId;
  const recipeId = req.body.recipeId;
  const response = db.removeFavouriteRecipe(userId,recipeId);
  res.json(response);
});
//this function  adds a users favourite recipe to the db
app.post('/favourite',function(req,res){
  const userId = req.body.userId;
  const recipeId = req.body.recipeId;
  const response = db.addFavouriteRecipe(userId,recipeId);
  res.json(response);
});

//this function retivers all users favourite recipes
app.get('/favourite',function(req,res){
  const userId = Number(req.query.userId);
  const recipes = db.getFavouriteRecipes(userId);
  res.json(recipes);
});