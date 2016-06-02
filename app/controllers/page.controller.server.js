var q = require("q");

// server side controllers handle page routes 
module.exports = function(app, model) {

    // get page model from model singleton
    var pageModel = model.pageModel;

    // get mongo to query for repeater and datatable
    var db = model.mongo;

    // receive data as path parameters
    app.get('/developer/:username/website/:websiteId/page/:pageId', pageController);

    // controller handles request
    // renders template view
    function pageController(req, res) {

        // extract path parameters from URL
        // including username too
        var username      = req.params.username;
        var websiteId = req.params.websiteId;
        var pageId        = req.params.pageId;

        // use model to retrieve page object
        pageModel.findPage(websiteId, pageId)
            .then(
                function(page) {

                    // create data map
                    var context = {
                        username      : username,
                        websiteId : websiteId,
                        pageId        : pageId,
                        page          : page // add page to data map for template
                    };

                    var dbAccess = false;
                    var widgetNeedingDbData = null;
                    for(var i in page.widgets) {
                        var widget = page.widgets[i];
                        var widgetType = widget.widgetType;
                        if(widgetType == "REPEATER" || widgetType == "DATATABLE") {
                            widgetNeedingDbData = widget;
                        }
                    }

                    if(widgetNeedingDbData) {
                        var collectionName = widgetNeedingDbData.repeater ? widgetNeedingDbData.repeater.collectionName : widgetNeedingDbData.datatable.collectionName;
                        var collection = db.collection(collectionName.replace(/ /g,"_"));
                        collection.find(function(err, docs){
                            docs.reverse();
                            if(!err) {
                                context.data = {};
                                context.collectionName = collectionName;
                                context.data[collectionName] = docs;
                                res.render('page', context);
                            }
                        });
                    } else {
                        res.render('page', context);
                    }
                }
            );
    }
}
