module.exports = function (app, model) {

    var websiteModel = model.websiteModel;

    var multer  = require('multer');
    var upload = multer({ dest: __dirname+'/../../../data' });

    app.post ("/api/website/:websiteId/page/:pageId/widget", createWidget);
    app.get  ("/api/website/:websiteId/page/:pageId/widget", getWidgets);
    app.get  ("/api/website/:websiteId/page/:pageId/widget/:widgetId", findWidgetById);
    app.put  ("/api/website/:websiteId/page/:pageId/widget/:widgetId", updateWidget);
    app.delete("/api/website/:websiteId/page/:pageId/widget/:widgetId", removeWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put    ("/api/website/:websiteId/page/:pageId/widget", updateWidgets);

    var widgetModel = require("../models/widget/widget.model.server.js")(websiteModel);

    function updateWidgets(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var startIndex = req.query.startIndex;
        var endIndex = req.query.endIndex;

        if (startIndex && endIndex) {
            widgetModel
                .sortWidget(websiteId, pageId, startIndex, endIndex)
                .then(
                    function (stat) {
                        return res.json(200);
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                );
        }
    }

    function uploadImage(req, res) {

        var username      = req.user.username;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var destination   = myFile.destination;
        var path          = myFile.path;
        var originalname  = myFile.originalname;
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        var filename      = myFile.filename;

        websiteModel.getMongooseModel()
            .findById(websiteId)
            .then(
                function(website) {
                    var widget = website.pages.id(pageId).widgets.id(widgetId);
                    widget.image = {
                        url: "/uploads/" + filename,
                        width: width
                    }
                    return website.save();
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(){
                    res.redirect("/ide/#/developer/"+username+"/website/"+websiteId+"/page/"+pageId+"/widget");
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function removeWidget(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var widgetId = req.params.widgetId;
        widgetModel
            .removeWidget(websiteId, pageId, widgetId)
            .then(
                function(response) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function updateWidget(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var widgetId = req.params.widgetId;
        var widget = req.body;
        widgetModel
            .updateWidget(websiteId, pageId, widgetId, widget)
            .then(
                function(response) {
                    res.send(200);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );


    }

    function findWidgetById(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var widgetId = req.params.widgetId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website.pages.id(pageId).widgets.id(widgetId));
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function getWidgets(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website.pages.id(pageId).widgets);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }

    function createWidget(req, res) {
        var websiteId = req.params.websiteId;
        var pageId = req.params.pageId;
        var widgetType = req.query.widgetType;
        widgetModel
            .createWidget(websiteId, pageId, widgetType)
            .then(
                function(website) {
                    var widgets = website.pages.id(pageId).widgets;
                    res.send(widgets[widgets.length - 1]);
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
    }
}