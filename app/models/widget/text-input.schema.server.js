var mongoose = require("mongoose");

module.exports = function () {

    var TextInputSchema = mongoose.Schema({
        placeholder : String,
        rows        : Number,
        formatted   : Boolean
    });

    return TextInputSchema;
};