var mongoose = require("mongoose");

module.exports = function () {

    var PageSchema = require("../page/page.schema.server.js")();

    var WebsiteSchema = mongoose.Schema({
        developerUsername: String,
        name: {type: String, default: "Website Name"},
        description: String,
        dateCreated: {type: Date, default: Date.now},
        pages: [PageSchema]
    }, {collection: "website"});

    return WebsiteSchema;
};
