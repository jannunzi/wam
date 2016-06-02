var q = require("q");
var mongoose = require("mongoose");

module.exports = function(websiteModel) {

    var StatementSchema = require("./statement.schema.server.js")();
    var StatementModel  = mongoose.model("StatementModel", StatementSchema);

    var ScriptSchema = require("./script.schema.server.js")();
    var ScriptModel  = mongoose.model("ScriptModel", ScriptSchema);

    var api = {
        saveScript : saveScript,
        findScript : findScript,
        addStatement : addStatement,
        findStatement: findStatement,
        deleteStatement: deleteStatement,
        updateStatement: updateStatement
    };
    return api;

    function deleteStatement(scope) {
        return websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function (website) {
                    var statement = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId)
                        .button.script
                        .statements.id(scope.statementId)
                        .remove();
                    return website.save();

                });
    }

    function updateStatement(scope, newStatement) {
        return websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function(website) {
                    var statement = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId)
                        .button.script
                        .statements.id(scope.statementId);

                    if(statement.statementType == "NUMBER") {
                        if(!statement.numberStatement) {
                            statement.numberStatement = {};
                        }
                        statement.numberStatement.input1 = newStatement.numberStatement.input1;
                        statement.numberStatement.input2 = newStatement.numberStatement.input2;
                        statement.numberStatement.output = newStatement.numberStatement.output;
                        statement.numberStatement.operationType = newStatement.numberStatement.operationType;
                    }

                    return website.save();
                });
    }



    function findStatement(scope) {

        var deferred = q.defer();

        // retrieve website since we need all variables in the website
        websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function(website) {
                    
                    // get all variables from the website
                    // TODO: modularize retrieving all variables
                    var variables = [];
                    var pages = website.pages;
                    for(var i in pages) {
                        var page = pages[i];
                        var widgets = page.widgets;
                        for(var j in widgets) {
                            var widget = widgets[j];
                            if(widget.name) {
                                variables.push(widget.name);
                            }
                        }
                    }

                    // get the statement
                    var statement = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId)
                        .button.script
                        .statements.id(scope.statementId);

                    // add the variables to the statement
                    // so we can render them in the dropdowns
                    statement.variables = variables;
                    
                    deferred.resolve(statement);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }

    function addStatement(scope) {
        
        // use q because we want to control exactly we want to resolve
        // we want to resolve the script, not the website
        var deferred = q.defer();

        websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function(website) {
                    var widget = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if(!widget.button || !widget.button.script) {
                        widget.button = {
                            script: new ScriptModel()
                        };
                    }

                    var statement = new StatementModel({
                        statementType: scope.statementType
                    });

                    widget.button.script.statements.push(statement);

                    return website.save();
                },
                function(err) {
                    deferred.reject(err);
                }
            )
            .then(
                function(website) {
                    var widget = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);
                    deferred.resolve(widget);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }

    function saveScript(scope, script) {
        return websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function(website) {
                    var widget = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if(!widget.button) {
                        widget.button = {};
                    }

                    widget.button.script = script;
                    website.save();
                }
            );
    }

    function findScript(scope) {

        var deferred = q.defer();

        websiteModel
            .findWebsiteById(scope.websiteId)
            .then(
                function(website) {
                    var widget = website
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if (widget.button && widget.button.script) {
                        deferred.resolve(widget.button.script);
                    } else {
                        deferred.resolve({});
                    }
                },
                function(err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }
}