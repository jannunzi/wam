var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// install and load bcrypt-nodejs module
// npm install bcrypt-nodejs --save
var bcrypt = require("bcrypt-nodejs");

module.exports = function (app, model) {

    var userModel = model.userModel;

    app.post ("/api/user", createUser);
    app.get ("/api/user", findAllUsers);
    app.get ("/api/user/:username", findUserByUsername);
    app.put ("/api/user/:username", updateUser);
    app.delete ("/api/user/:username", deleteUser);
    app.get ("/api/user/search/:username", searchUser);

    var auth = authorized;
    app.post  ('/api/login', passport.authenticate('web-app-maker'), login);
    app.post  ('/api/logout',         logout);
    app.get   ('/api/loggedin',       loggedin);
    app.post  ('/api/register',       register);

    app.get   ('/auth/google',   passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get   ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/ide/#/profile',
            failureRedirect: '/ide/#/login'
        }));
    app.get   ('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/ide/#/profile',
            failureRedirect: '/ide/#/login'
        }));

    var googleConfig = {
        clientID        : process.env.GOOGLE_CLIENT_ID,
        clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL     : process.env.GOOGLE_CALLBACK_URL
    };

    var facebookConfig = {
        clientID        : process.env.FACEBOOK_CLIENT_ID,
        clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL     : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use('web-app-maker', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var username = profile.displayName.replace(/ /g,"");
                        var email = profile.emails ? profile.emails[0].value:"";
                        var newFacebookUser = {
                            username: username,
                            firstName: names[0],
                            lastName:  names[names.length - 1],
                            email:     email,
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function localStrategy(username, password, done) {
        // lookup user by username only. cant compare password since it's encrypted
        userModel
            .findUserByUsername(username)
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

    function serializeUser(user, done) {
        delete user.password;
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    delete user.password;
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function searchUser(req, res) {
        var username = req.params.username;
        userModel
            .searchUser(username)
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            )
    }

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

    function deleteUser (req, res) {
        var username = req.params.username;
        userModel
            .deleteUser (username)
            .then (
                function (stats) {
                    res.send(200);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function updateUser (req, res) {
        var username = req.params.username;
        var user = req.body;
        userModel
            .updateUser (username, user)
            .then (
                function (stats) {
                    res.send(200);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUserByUsername (req, res) {
        userModel
            .findUserByUsername (req.params.username)
            .then (
                function (user) {
                    delete user.password;
                    res.json (user);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findAllUsers (req, res) {
        userModel
            .findAllUsers ()
            .then (
                function (users) {
                    res.json (users);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function createUser (req, res) {
        var user = req.body;
        userModel
            .createUser (user)
            .then (
                function (user) {
                    res.json (user);
                },
                function (err) {
                    res.status (400).send ( err);
                }
            );
    }

    function register (req, res) {
        var user = req.body;
        userModel
            .findUserByUsername(user.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        // encrypt the password when registering
                        user.password = bcrypt.hashSync(user.password);
                        return userModel.createUser(user);
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