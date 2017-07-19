// api request
// data manipulation
// build list
// on keyDown
// onEnter


jQuery(document).ready(function (){

    // -- post and tag data pulled from the server --
    var postData = [], tagData = [];

    // -- AJAX get request for the blog tags, using the ghost.url.api to generate the link --
    function getTags() {
        $.get(
            ghost.url.api('tags', {limit: 'all', fields: 'uuid, name'})
        ).done(function (data) {
            tagData = data.tags;
        }).error(function (err) {
            console.log(err);
        })
    }

    // -- AJAX get request for the blog post, using the ghost.url.api to generate the link --
    function getPost() {
        $.get(
             ghost.url.api('posts', {limit: 'all', fields: 'uuid, author, title, created_at, url, featured, markdown, tags', include: "author, tags"})
        ).done(function (data) {
           postData = data.posts;
        }).fail(function (err) {
            console.log(err);
        })
    }

    // jQuery promise (when) to notify that the data exist and the rest of the functionality can continue, wrapped in a function that is either called onLoad or when the user initiates the search
    function initSearch() {
        $.when(getPost(), getTags()).done(function () {
            setTimeout(function () {
                //console.log(tagData, postData);
                console.log("results: ", filterPost('Kri'));
                console.log("tags: ", filterTags('Chr'));
            }, 1);
        })
    }


    initSearch();

    // initialize the search div

    // append returned results to the div


    // filter the list by name, author, and tags
    
    function filterPost(value) {
        return postData.filter(function (post) {
            var regex = new RegExp(value, "igm");
            if(regex.test(post.title)){
                return post;
            } else if (regex.test(post.author.name)){
                return post;
            } else if (regex.test(post.tags.name)){
                return post;
            }
        })
    }

    function filterTags(value) {
        return tagData.filter(function (tag) {
            var regex = new RegExp(value, "igm");
            if(regex.test(tag.name)){
                return tag;
            }
        })
    }


});