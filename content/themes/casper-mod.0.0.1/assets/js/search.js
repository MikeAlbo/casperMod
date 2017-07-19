// api request
// data manipulation
// build list
// on keyDown
// onEnter


jQuery(document).ready(function (){

    console.log("search js file");

    function getTags() {
        $.get(
            ghost.url.api('tags', {limit: 'all'})
        ).done(function (data) {
            console.log(data);
        }).error(function (err) {
            console.log(err);
        })
    }

    function getPost() {
        $.get(
            ghost.url.api('posts', {limit: 'all', /*fields: 'uuid, author, title, created_at, url, featured, markdown',*/ include: "author, tags"})
        ).done(function (data) {
            console.log(data);
        }).fail(function (err) {
            console.log(err);
        })
    }

    getTags();
    getPost();
});