var mongoose = require("mongoose");

module.exports = function () {
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        email: String,
        firstName: String,
        lastName: String,
        google:   {
            id:    String,
            token: String
        },
        facebook:   {
            id:    String,
            token: String
        }
    }, {collection: 'user'});
    return UserSchema;
};
