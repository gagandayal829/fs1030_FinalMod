const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
var session = require('express-session');

const {getHomePage} = require('./routes/index');
const {addPatientPage, addPatient, deletePatient, editPatient, editPatientPage} = require('./routes/patient');
const port = 5000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emrdb'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// routes for the app

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
//app.get('/home', function(request, response) {
//	if (request.session.loggedin) {
//		response.send('Welcome back, ' + request.session.username + '!');
//	} else {
//		response.send('Please login to view this page!');
//	}
//	response.end();
//});
app.get('/home', getHomePage);
app.get('/add', addPatientPage);
app.get('/edit/:id', editPatientPage);
app.get('/delete/:id', deletePatient);
app.post('/add', addPatient);
app.post('/edit/:id', editPatient);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});