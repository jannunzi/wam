var mongoose = require("mongoose");

module.exports = function () {

    var DataTableSchema = mongoose.Schema({
        collectionName :  String,
        fields         : [String],
        deletable      :  Boolean // added deletable 
    });

    return DataTableSchema;
};