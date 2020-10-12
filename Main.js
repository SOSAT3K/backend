const express       = require('express');
const app           = express();
const path          = require('path');
const mysql         = require('mysql');
//const session       = require('express-session');
//const MySQLStore    = require('express-mysql-session')(session);
//const Router        = require('./Router');

//console.log('testing server') - To test response

//app.use(express.static(path.join(__dirname, 'build'))); //Tell express to server our static build folder
//app.use(express.json());    //Allows sending and receiving data from API

//Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1234',
    database: 'newmarket_users'

});

db.connect(function(err){
    if (err) {
        console.log('DB error');
        throw err;
        return false;
    }
});

