var mongoose = require("mongoose");
var q = require("q");
module.exports = function () {
    var WebsiteSchema = require("./website.schema.server.js")();
    var Website = mongoose.model("Website", WebsiteSchema);

    var api = {
        createWebsite: createWebsite,
        findWebsitesForUsername: findWebsitesForUsername,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        removeWebsite: removeWebsite,
        getMongooseModel: getMongooseModel
    };
    return api;

    function getMongooseModel() {
        return Website;
    }

    function updateWebsite(websiteId, website) {
        return Website.update(
            {_id: websiteId},
            {$set: website}
        );
    }

    function removeWebsite(websiteId) {
        return Website.remove().where("_id").equals(websiteId);
    }

    function findWebsiteById (websiteId) {
        return Website.findById (websiteId);
    }

    function findWebsitesForUsername (username) {
        var deferred = q.defer();
        Website
            .find(
                {developerUsername: username},
                '_id dateCreated developerUsername name',
                function (err, websites) {
                    if (!err) {
                        deferred.resolve (websites);
                    } else {
                        deferred.reject (err);
                    }
                }
            );
        return deferred.promise;
    }

    function createWebsite (website) {
        var deferred = q.defer();
        Website.create (website,
            function (err, website) {
                if (!err) {
                    deferred.resolve(website);
                } else {
                    deferred.reject(err);
                }
        });
        return deferred.promise;
    }
};