var mongoose = require("mongoose");

module.exports = function (app, model) {

    var websiteModel = model.websiteModel;

    app.post   ("/api/developer/:username/website", createWebsite);
    app.get    ("/api/developer/:username/website", findWebsitesForUsername);
    app.get    ("/api/website/:websiteId", findWebsiteById);
    app.delete ("/api/website/:websiteId", removeWebsite);
    app.put    ("/api/website/:websiteId", updateWebsite);

    function updateWebsite (req, res) {
        var website = req.body;
        var websiteId = req.params.websiteId;
        websiteModel
            .updateWebsite(websiteId, website)
            .then(
                function(response) {
                    res.json(response.result);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function removeWebsite (req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .removeWebsite(websiteId)
            .then(
                function(response) {
                    res.json(response.result);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findWebsiteById (req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findWebsitesForUsername (req, res) {
        var username = req.params.username;
        websiteModel
            .findWebsitesForUsername (username)
            .then (
                function (websites) {
                    res.json (websites);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function createWebsite (req, res) {
        var username = req.params.username;
        var website = req.body;
        websiteModel
            .createWebsite (website)
            .then (
                function (website) {
                    res.json (website);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }
}