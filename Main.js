const express       = require('express');
const app           = express();
const path          = require('path');
const mysql         = require('mysql');
const session       = require('express-session');
const MySQLStore    = require('express-mysql-session')(session);
const backendRouter        = require('./backend_router');

//console.log('testing server') - To test response

app.use(express.static(path.join(__dirname, 'build'))); //Tell express to server our static build folder
app.use(express.json());    //Allows sending and receiving data from API

//Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1234',
    database: 'newmarket_users'

});

db.connect(function(err) {
    if (err) {
        console.log('DB error');
        throw err;
        return false;
    }
});

//Session store
const sessionStore = new MySQLStore({
    expiration: (1285 * 86400 * 1000), //Expires in 5 years
    endConnectionOnClose: false
}, db);

app.use(session({
    key: 'j345l34hlt8ih5o',
    secret: 'ghg785ugfjg854',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1285 * 86400 * 1000),
        httpOnly: false
    }
}));

new backendRouter(app, db);    //To access both app and db automatically

//Serve build from the frontend by using express 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));  //Serve index.html from build folder (CHECK FOR SERVER)
});

app.listen(3000);