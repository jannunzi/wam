var mongoose = require("mongoose");

module.exports = function () {

    var HeaderSchema    = require("./header.schema.server.js")();
    var TextInputSchema = require("./text-input.schema.server.js")();
    var LinkSchema      = require("./link.schema.server.js")();
    var ButtonSchema    = require("./button.schema.server.js")();
    var RepeaterSchema  = require("./repeater.schema.server.js")();
    var DataTableSchema = require("./data-table.schema.server.js")();
    var YouTubeSchema   = require("./you-tube.schema.server.js")();
    var ImageSchema     = require("./image.schema.server.js")();
    var HtmlSchema      = require("./html.schema.server.js")();

    var WidgetSchema = mongoose.Schema({
        widgetType: {type: String, enum: ["HTML", "HEADER", "LABEL", "TEXT",
            "LINK", "BUTTON", "IMAGE", "YOUTUBE","DATATABLE", "REPEATER"]},
        name      : String,
        title     : String,
        text      : {type:String, default:'Text'},
        url       : String,
        html      : HtmlSchema,
        link      : LinkSchema,
        image     : ImageSchema,
        youTube   : YouTubeSchema,
        header    : HeaderSchema,
        datatable : DataTableSchema,
        repeater  : RepeaterSchema,
        button    : ButtonSchema,
        textInput : TextInputSchema
    });

    return WidgetSchema;
};