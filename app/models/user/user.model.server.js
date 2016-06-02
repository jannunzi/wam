var mongoose = require("mongoose");
var q = require("q");

module.exports = function (db) {
    var UserSchema = require("./user.schema.server.js")();
    var User = mongoose.model("User", UserSchema);

    var api = {
        createUser: createUser,
        findAllUsers: findAllUsers,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByCredentials: findUserByCredentials,
        findUserByGoogleId: findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        findUserById: findUserById,
        searchUser: searchUser
    };
    return api;

    function searchUser(username) {
        return User.find({'username': {$regex: username, $options: 'i'}});
    }

    function findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return User.findOne({'google.id': googleId});
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByCredentials(credentials) {
        return User.findOne(
            {
                username: credentials.username,
                password: credentials.password
            }
        );
    }
    function deleteUser (username) {
        var deferred = q.defer();
        User
            .remove (
                {username: username},
                function (err, stats) {
                    if (!err) {
                        deferred.resolve(stats);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    function updateUser (username, user) {
        var deferred = q.defer();
        delete user._id;
        User
            .update (
                {username: username},
                {$set: user},
                function (err, stats) {
                    if (!err) {
                        deferred.resolve(stats);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    function findUserByUsername (username) {
        var deferred = q.defer ();
        User
            .findOne (
                {username: username},
                function (err, user) {
                    if (!err) {
                        deferred.resolve(user);
                    } else {
                        deferred.reject(err);
                    }
                }
            );
        return deferred.promise;
    }

    function findAllUsers () {
        var deferred = q.defer ();
        User.find (
            function (err, users) {
                if (!err) {
                    deferred.resolve (users);
                } else {
                    deferred.reject (err);
                }
            }
        );
        return deferred.promise;
    }

    function createUser (user) {
        var deferred = q.defer();
        User.create(user, function (err, doc) {
            if (err) {
                deferred.reject (err);
            } else {
                deferred.resolve (doc);
            }
        });
        return deferred.promise;
    }
};