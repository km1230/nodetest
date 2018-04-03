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
let db, counter;
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

//index
app.get('/', (req, res)=>{
	db.collection('heros').find({}).toArray((err, result)=>{
		if(err){
			console.log(err)
		} else {
			res.render('index.ejs', {result: result});
		}
	});
});

//Get Hero
app.get('/edit/:key', (req, res)=>{
	db.collection('heros').find({_id: parseInt(req.params.key)}).toArray((err, result)=>{
		if(result.length<1){
			res.render('404.ejs')
		} else {
			res.render('edit.ejs', {result: result})
		}
	})
});

//Add hero
app.post('/post', (req, res)=>{
	db.collection('counter').findAndModify({_id: 'hero_id'},{},{$inc:{seq:1}}, {new: true},(err, result)=>{
		counter = result.value.seq;
		db.collection('heros').save({
			_id: counter,
			hero: req.body.hero,
			win: req.body.win,
			on_fire: req.body.on_fire,
			ed_ratio: req.body.ed_ratio
		}, (err, result)=>{
			if(err){console.log(err)};
			res.redirect('/')
		})
	});
});

//Update hero
app.post('/update', (req, res)=>{
	db.collection('heros').updateOne(
		{_id: req.body._id},
		{
			$set: {
				win: req.body.win, 
				on_fire: req.body.on_fire,
				ed_ratio: req.body.ed_ratio 
			}
		}
	);
	res.redirect('/')
});

//Remove hero
app.get('/delete/:key', (req, res)=>{
	db.collection('heros').deleteOne({_id: parseInt(req.params.key)}, (err, result)=>{
		res.redirect('/')
	});
});