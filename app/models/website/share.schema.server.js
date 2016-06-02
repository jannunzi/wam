var mongoose = require("mongoose");

module.exports = function () {

    var ShareSchema = mongoose.Schema({
        websiteId: String,
        developerId: String,
        username: String
    }, {collection: "share"});

    return ShareSchema;
};
