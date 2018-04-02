//------------------------------------------------------
//dotenv
require('dotenv').config();
//Express
const express = require('express');
const app = express();
//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//mongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
//ejs
app.set('view engine', 'ejs');
//------------------------------------------------------

//Connect to mongoDB
MongoClient.connect(process.env.DB_SETTING, (err, client)=>{
	db = client.db(process.env.DB_NAME);
	//port
	const port = process.env.PORT || 8000;
	app.listen(port, ()=>console.log(`Listening on port ${port}...`));
});


//Get
app.get('/', (req, res)=>{
	db.collection('posts').find({}).toArray((err, result)=>{
		if(err){
			console.log(err)
		} else {
			res.render('index.ejs', {result: result})
		}
	})
});

//Post
app.post('/newpost', (req, res)=>{
	db.collection('posts').save(req.body, (err, result)=>{
		if(err){console.log(err)};
		//res.send(req.body)
		res.redirect('/')
	});
});

/*
Get by key
app.get('/post/:id', (req, res)=>{
	let post = posts.find(p=>p.id === parseInt(req.params.id));
	if(post){
		res.send(post);
	} else {
		res.send('No such post :(');
	};
});
*/