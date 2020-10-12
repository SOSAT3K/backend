const bcrypt = require('bcrypt');

let pswrd = bcrypt.hashSync('12345', 9);    //9=number of letters used to run through salt 
console.log(pswrd)