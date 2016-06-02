var mongoose = require("mongoose");

module.exports = function (websiteModel) {

    var ShareSchema = require("./share.schema.server.js")();
    var ShareModel = mongoose.model("ShareModel", ShareSchema);

    var api = {
        shareWebsite: shareWebsite,
        unshareWebsite: unshareWebsite,
        findSharedWebsite: findSharedWebsite
    };
    return api;

    function unshareWebsite(websiteId, username) {
        return ShareModel.remove({websiteId: websiteId, username: username});
    }

    function shareWebsite(websiteId, username) {
        var share = new ShareModel();
        share.websiteId = websiteId;
        share.username      = username;
        return share.save();
    }

    function findSharedWebsite(websiteId) {
        return ShareModel.find({websiteId: websiteId});
    }
};