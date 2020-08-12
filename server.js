/* server.js - Express server*/
'use strict';
const log = console.log;
log('Express server');

const express = require('express');
const hbs = require('hbs');

const app = express();
app.use(express.static(__dirname + '/pub'));
app.set('views', (__dirname + '/pub'));
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/pub/partials');

app.get('/',(req,res)=>{
	res.render('index');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});  // localhost development port 5000  (http://localhost:5000)

