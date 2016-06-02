var mongoose = require("mongoose");

module.exports = function () {

    var HtmlSchema = mongoose.Schema({
        text: String
    });

    return HtmlSchema;
};