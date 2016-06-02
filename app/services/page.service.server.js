module.exports = function (app, model) {

    var websiteModel = model.websiteModel;

    app.post   ("/api/website/:websiteId/page", createPage);
    app.get    ("/api/website/:websiteId/page", findPagesForWebsite);
    app.get    ("/api/website/:websiteId/page/:pageId", findPage);
    app.delete ("/api/website/:websiteId/page/:pageId", removePage);
    app.put    ("/api/website/:websiteId/page/:pageId", updatePage);
    app.put    ("/api/website/:websiteId/page", updatePages);

    var pageModel   = require("../models/page/page.model.server.js")(websiteModel);

    function updatePages (req, res) {
        var websiteId = req.params.websiteId;
        var startIndex = req.query.startIndex;
        var endIndex = req.query.endIndex;

        if(startIndex && endIndex) {
            pageModel
                .sortPage(websiteId, startIndex, endIndex)
                .then(
                    function(stat) {
                        return res.json(200);
                    },
                    function(err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function updatePage (req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        pageModel
            .updatePage(websiteId, page)
            .then(
                function(stat) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function removePage (req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        pageModel
            .removePage(websiteId, pageId)
            .then(
                function(stat) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
    }

    function findPage(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        pageModel
            .findPage(websiteId, pageId)
            .then(
                function(page) {
                    res.json(page);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function findPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        pageModel
            .findPagesForWebsite(websiteId)
            .then(
                function(website) {
                    res.json(website.pages);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        pageModel
            .createPage(websiteId, page)
            .then(
                function(website) {
                    res.json(website);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }
}