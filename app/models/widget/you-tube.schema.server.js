var mongoose = require("mongoose");

module.exports = function () {

    var YouTubeSchema = mongoose.Schema({
        url: String,
        width: String
    });

    return YouTubeSchema;
};