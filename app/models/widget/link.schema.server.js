var mongoose = require("mongoose");

module.exports = function () {

    var LinkSchema = mongoose.Schema({
        url: String
    });

    return LinkSchema;
};