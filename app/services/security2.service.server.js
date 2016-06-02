var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require("bcrypt-nodejs");

module.exports = function (app, model) {

    var auth = authorized;
    app.post  ('/api/2/login', passport.authenticate('web-app-maker-2'), login);
    app.post  ('/api/2/logout',         logout);
    app.get   ('/api/2/loggedin',       loggedin);
    app.post  ('/api/2/register',       register);

    passport.use('web-app-maker-2', new LocalStrategy(localStrategy));

    function localStrategy(username, password, done) {
        // lookup developer by username only. cant compare password since it's encrypted
        developerModel
            .findDeveloperByUsername(username)
            .then(
                function(user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function login(req, res) {
        var user = req.user;
        delete user.password;
        res.json(user);
    }

    function register (req, res) {
        var developer = req.body;
        developerModel
            .findDeveloperByUsername(developer.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        // encrypt the password when registering
                        developer.password = bcrypt.hashSync(developer.password);
                        return developerModel.createDeveloper(developer);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }
};