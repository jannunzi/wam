var mongoose = require("mongoose");

module.exports = function () {

    var ScriptSchema = require("../script/script.schema.server")();

    var ButtonSchema = mongoose.Schema({
        url       : String,
        pageId    : String,
        icon      : String,
        style     : String,
        dbCommand : String,
        navigate  : String,
        script    : ScriptSchema
    });

    return ButtonSchema;
};