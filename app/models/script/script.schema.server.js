var mongoose = require("mongoose");

module.exports = function() {

    var StatementSchema = require("./statement.schema.server.js")();

    var ScriptSchema = mongoose.Schema({
        name       :  String,
        scope      :  Object,
        statements : [StatementSchema]
    });

    return ScriptSchema;
};