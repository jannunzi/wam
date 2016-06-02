module.exports = function(app, model) {

    var shareModel       = model.shareModel;
    var websiteModel = model.websiteModel;

    app.post   ("/api/share/:websiteId/developer/:username", shareWebsite)
    app.get    ("/api/share/:websiteId", findSharedWebsite)
    app.delete ("/api/share/:websiteId/developer/:username", unshareWebsite)

    function unshareWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var username = req.params.username;
        shareModel
            .unshareWebsite(websiteId, username)
            .then(
                function(share) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function shareWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var username = req.params.username;
        shareModel
            .shareWebsite(websiteId, username)
            .then(
                function(share) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findSharedWebsite(req, res) {
        var websiteId = req.params.websiteId;
        shareModel
            .findSharedWebsite(websiteId)
            .then(
                function(shares) {
                    var developers = [];
                    for(var s in shares) {
                        developers.push({username: shares[s].username, developerId: shares[s].developerId});
                    }
                    res.json(developers);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

};