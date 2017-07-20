// api request
// data manipulation
// build list
// on keyDown
// onEnter

jQuery(document).ready(function (){


    var resultsContainer = $("#resultsContainer");

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
                console.log(postData);
                //console.log("results: ", filterPost('Michael'));
                //console.log("tags: ", filterTags('Chr'));
                // filterPost('Michael').forEach(function (post) {
                //     console.log("boom: ", post);
                // });

                liveSearch('Michael');
            }, 100);
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

    function excerptParsers(text, length) {
        var str = text.split(' ');
        var regexp = new RegExp("#", 'igm');

        str = str.filter(function (char) {
            return !regexp.test(char);
        });

        return str.length < length ? str.join(' ') : str.slice(0,length + 1).join(' ');
    }

    function dateParser(rawDate) {
    //    "2017-07-16T14:45:45.000Z"
        var splitDate = rawDate.split('');
        var year = splitDate.splice(0,4).join('');
        var month = splitDate.splice(1,2).join('');
        var day = splitDate.splice(2,2).join('');
        console.log("year", year);
        console.log("Month", month);
        console.log("Day", day);

        function monthToText(month) {
            switch(month){
                case "01" : return 'January'; break;
                case "02" : return 'February'; break;
                case "03" : return 'March'; break;
                case "04" : return 'April'; break;
                case "05" : return 'May'; break;
                case "06" : return 'June'; break;
                case "07" : return 'July'; break;
                case "08" : return 'August'; break;
                case "09" : return 'September'; break;
                case "10" : return 'October'; break;
                case "11" : return 'November'; break;
                case "12" : return 'December'; break;
                default : return ' ';

            }
        }

        var textMonth = monthToText(month);

        return day + " " + textMonth + " " + year;
    }

    function postResult(post){
        var excerpt = excerptParsers(post.markdown, 26);

        var date = dateParser(post.created_at);

        /*
        * <article class="{{post_class}}">
         <header class="post-header">
         <h2 class="post-title"><a href="{{url}}">{{title}}</a></h2>
         </header>
         <section class="post-excerpt">
         <p>{{excerpt words="26"}} <a class="read-more" href="{{url}}">&raquo;</a></p>
         </section>
         <footer class="post-meta">
         {{#if author.image}}<img class="author-thumb" src="{{author.image}}" alt="{{author.name}}" nopin="nopin" />{{/if}}
         {{author}}
         {{tags prefix=" on "}}
         <time class="post-date" datetime="{{date format="YYYY-MM-DD"}}">{{date format="DD MMMM YYYY"}}</time>
         </footer>
         </article>*/

        var result = '<li><article class="post"> ';

        result += '<header class="post-header"> <h2 class="post-title"><a href="'+ post.url+'">' + post.title + '</a></h2></header>';
        result += '<section class="post-excerpt"><p>' +  excerpt + '<a class="read-more" href="'+ post.url+'"> &raquo;</a></p></section>';
        result += '<footer class="post-meta">' + post.author.name + '<time class="post-date" datetime="'+ post.created_at +' format="YYYY-MM-DD">'+ date +'</time></footer>';

        result += '</article></li>';

        return result;
    }

    function liveSearch(value) {

        filterPost(value).forEach(function (post) {
            resultsContainer.append(postResult(post));
        });

        console.log("results ctrn: ", resultsContainer);

    }


});