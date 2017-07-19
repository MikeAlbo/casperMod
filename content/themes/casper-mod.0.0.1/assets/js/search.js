// api request
// data manipulation
// build list
// on keyDown
// onEnter


jQuery(document).ready(function (){

    // -- post and tag data pulled from the server --
    var postAndTagData = [];

    // -- AJAX get request for the blog tags, using the ghost.url.api to generate the link --
    function getTags() {
        $.get(
            ghost.url.api('tags', {limit: 'all', fields: 'uuid, name'})
        ).done(function (data) {
            postAndTagData = postAndTagData.concat(data.tags);
        }).error(function (err) {
            console.log(err);
        })
    }

    // -- AJAX get request for the blog post, using the ghost.url.api to generate the link --
    function getPost() {
        $.get(
             ghost.url.api('posts', {limit: 'all', fields: 'uuid, author, title, created_at, url, featured, markdown, tags', include: "author, tags"})
        ).done(function (data) {
           postAndTagData = postAndTagData.concat(data.posts);
        }).fail(function (err) {
            console.log(err);
        })
    }

    // jQuery promise (when) to notify that the data exist and the rest of the functionality can continue, wrapped in a function that is either called onLoad or when the user initiates the search
    function initSearch() {
        $.when(getPost(), getTags()).done(function () {
            setTimeout(function () {
                console.log(postAndTagData);
            }, 1);
        })
    }



    // initialize the search div

    // append returned results to the div


    // filter the list by name, author, and tags
    
    function filter(value) {
        return postAndTagData.filter(function (item) {
            return item.name == value || item.tags.name == value || item.author.name == value;
        })
    }



});