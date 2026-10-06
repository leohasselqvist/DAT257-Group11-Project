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
  const user = String(req.query.username);
  const idnumber = db.getUser({username : user});
  res.json({id : idnumber});
});

app.post('/user',function(req,res){
  console.log(req.body);
  const user = String(req.body.username);
  const idnumber = db.addUser({username: user});
  console.log('returning id', idnumber);
  res.json({id: idnumber});
});

