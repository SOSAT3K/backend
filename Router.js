//API endpoint
const bcrypt = require('bcrypt');

class Router {
    //Access app in db, to access in each route (
    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db) {

        app.post('/login', (req, res) => {

            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();    //Change username to all lowercase

            if (username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    msg: 'An error occurred, please try again'
                })
                return;
            }

            //check if user exists in the database
            let cols = [username];
            db.query('SELECT * FROM user_info WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Unable to find user in the database LIMIT 1'
                    })
                    return;
                }
                //If user is found
                if (data && data.length === 1) {
                    //Use bcrypt to compare password to database
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {

                        if (verified) {

                            req.session.userID = data[0].id;

                            //Return user name to user to avoid extra calls to API
                            res.json({
                                success: true,
                                username: data[0].username
                            })

                            return;
                        }

                        else {
                            res.join({
                                success: false,
                                msg: 'Invalid Password'     
                            })                               
                        }
                                
                    });

                } else {
                    res.json({
                        success: false,
                        msg: 'User not found, try again'  
                    })
                }
                

            });

            console.log(username)   //remove once it's working
        });

    }

    logout(app, db) {

        app.post('/logout', (req, res) =>{
            //If user exists, log out 
            if (req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })

                return true;

            //Else if session is not existent, return false
            } else {
                res.json({
                    success: false
                })
                return false;
            }
        });
    } 
    //API endpoint used to check if user is logged in
    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) =>{

            if (req.session.userID) {
                //ID is user set when session created
                let cols = [req.session.userID];
                db.query('SELECT * FROM user_info WHERE id = ? LIMIT 1', cols, (err, data, fields) =>{

                    if (data && data.length ===1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        })

                        return true;
                    
                    //IF there is no data (User ID exists, but not in database)
                    } else {
                        res.json({
                            success: false
                        })
                    }
                });   
            }
           
            //If session ID is not set at all
            else {
                res.json({
                    success: false
                })
            }

        });

    }

}   

module.exports = Router;
