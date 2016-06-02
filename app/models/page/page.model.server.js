module.exports = function(websiteModel) {

    var Website = websiteModel.getMongooseModel();

    var api = {
        createPage: createPage,
        findPagesForWebsite: findPagesForWebsite,
        findPage: findPage,
        removePage: removePage,
        updatePage: updatePage,
        sortPage: sortPage
    };
    return api;

    function sortPage(websiteId, startIndex, endIndex) {
        return Website
            .findById(websiteId)
            .then(
                function(website) {
                    website.pages.splice(endIndex, 0, website.pages.splice(startIndex, 1)[0]);

                    // notify mongoose 'pages' field changed
                    website.markModified("pages");

                    website.save();
                }
            );
    }

    function updatePage(websiteId, pageObj) {
        return Website
            .findById(websiteId)
            .then(
                function(website){
                    var page   = website.pages.id(pageObj._id);
                    page.name  = pageObj.name;
                    page.title = pageObj.title;
                    return website.save();
                }
            );
    }

    function removePage(websiteId, pageId) {
        return Website
            .findById(websiteId)
            .then(
                function(website){
                    website.pages.id(pageId).remove();
                    return website.save();
                }
            );
    }

    function findPage(websiteId, pageId) {
        return Website
            .findById(websiteId)
            .then(
                function(website){
                    return website.pages.id(pageId);
                }
            );
    }

    function findPagesForWebsite(websiteId) {
        // use select() to retrieve a particular field
        return Website.findById(websiteId).select("pages");
    }

    function createPage(websiteId, page) {
        return Website.findById(websiteId)
            .then(
                function(website) {
                    website.pages.push(page);
                    return website.save();
                }
            );
    }
};
