var mongoose = require("mongoose");

module.exports = function () {

    var HeaderSchema = mongoose.Schema({
        size: Number
    });

    return HeaderSchema;
};