var mongoose = require("mongoose");

module.exports = function () {

    var RepeaterSchema = mongoose.Schema({
        collectionName :  String,
        fields         : [String],
        template       :  String,
        deletable      :  Boolean // added deletable
    });

    return RepeaterSchema;
};