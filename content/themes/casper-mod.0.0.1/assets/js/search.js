// api request
// data manipulation
// build list
// on keyDown
// onEnter

jQuery(document).ready(function (){


    var resultsContainer = $("#resultsContainer");
    var searchContainer = $("#searchContainer");
    var mainBlogLoop = $("#mainBlogLoop");
    var searchBoxButton = $("#searchBoxButton");
    var searchBoxInput = $("#searchBoxInput");
    var searchCountValue = $("#searchCountValue");

    searchContainer.hide();

    var viewSearchBool = false;

    var demoButton = $("#demoButton"); // remove
    demoButton.on('click', function(){  //remove
        fadeSearch(viewSearchBool);
    });

    // show and hide the search bar

    var searchButton = $("#searchButton");

    function showSearchDiv(show) {
        if(show){
            searchBoxInput.addClass("scaleOut-searchInput");
            searchButton.addClass("hideButton-searchButton");
        } else {
            searchBoxInput.removeClass("scaleOut-searchInput");
            searchButton.removeClass("hideButton-searchButton");
        }
    }


    $(searchButton).on('click', function () {
        showSearchDiv(true);
        setTimeout(function () {
            searchBoxInput.focus();
        },300);
    })


    // update search results count value
    function updateResultsCount(count) {
        searchCountValue.text(count);
    }


    // ===== animations ====== \\

    // cross-fade the main blog loop and the search results container

    function crossFadeContainers(containerIn, containerOut) {
        containerOut.fadeOut(200, function () {
            containerIn.fadeIn(1000);
        });
    }


    //searchBox onFocus event
    searchBoxInput.focus(function () {
       crossFadeContainers(searchContainer, mainBlogLoop);
    });

    //searchBox unFocus with empty search
    searchBoxInput.focusout(function () {
        if(searchBoxInput.val() === ''){
            crossFadeContainers(mainBlogLoop, searchContainer);
            showSearchDiv();
        }
    });


    //searchBox onClick handler
    searchBoxInput.on('keyup',function (e) {

        searchContainer.show();

        if(e.which === 13){
            // handle enter function
        } else {
            // handle live search
            callLiveSearchOnValue();

            if(!viewSearchBool){
                viewSearchBool = true;
                fadeSearch(viewSearchBool);
            }

            if(searchBoxInput.val() == '' && viewSearchBool){
                viewSearchBool = false;
                fadeSearch(viewSearchBool);
            }
        }
    });

    function callLiveSearchOnValue(){
        var searchText = searchBoxInput.val();
        console.log(searchText);
        liveSearch(searchText);
    }

    function fadeSearch(viewSearch) {
        if(viewSearch){
            searchContainer.fadeIn();
            mainBlogLoop.fadeOut();
            viewSearchBool = false;
        }else {
            mainBlogLoop.fadeIn();
            searchContainer.fadeOut();
            viewSearchBool = true;
        }
    }


    // -- post and tag data pulled from the server --
    var postData = [], tagData = [];

    // -- AJAX get request for the blog tags, using the ghost.url.api to generate the link --
    function getTags() {
        $.get(
            ghost.url.api('tags', {limit: 'all', fields: 'uuid, name, slug'})
        ).done(function (data) {
            return tagData = data.tags;
        }).error(function (err) {
            console.error(err);
        })
    }

    // -- AJAX get request for the blog post, using the ghost.url.api to generate the link --
    function getPost() {
        $.get(
             ghost.url.api('posts', {limit: 'all', fields: 'uuid, author, title, created_at, url, featured, markdown, tags', include: "author, tags"})
        ).done(function (data) {
           return postData = data.posts;
        }).fail(function (err) {
            console.error(err);
        })
    }

    // jQuery promise (when) to notify that the data exist and the rest of the functionality can continue, wrapped in a function that is either called onLoad or when the user initiates the search
    function initSearch() {
        $.when(getPost(), getTags()).done(function () {
            setTimeout(function () {
                //console.log(postData);
                //console.log("results: ", filterPost('Michael'));
                //console.log("tags: ", filterTags('Chr'));
                console.log(tagData);
                // filterPost('Michael').forEach(function (post) {
                //     console.log("boom: ", post);
                // });

                buildIndexPageTagList(tagData, 5);
                autoLoadInitialSearchResults();

                //liveSearch('Michael');
                //fadeSearch(viewSearchBool);
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

        str = str.join(' ').split('');

        var regexForPhoto = new RegExp(/([!|\[])/, 'igm');
        var photoFound = false;

        var photoFiltered = [];

        str.forEach(function (char) {
            if(!regexForPhoto.test(char) && !photoFound){
                photoFiltered.push(char);
            } else {
                photoFound = true;
            }
        });

        photoFiltered = photoFiltered.join('').split(' ');


        if(photoFiltered.length <= 1){
            return '[ embedded images ]';
        }


        return photoFiltered.length < length ? photoFiltered.join(' ') : photoFiltered.slice(0,length + 1).join(' ');
    }

    function dateParser(rawDate) {
    //    "2017-07-16T14:45:45.000Z"
        var splitDate = rawDate.split('');
        var year = splitDate.splice(0,4).join('');
        var month = splitDate.splice(1,2).join('');
        var day = splitDate.splice(2,2).join('');

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

        var result = '<article class="post searchResults" id="'+ post.uuid +'"> ';

        result += '<header class="post-header"> <h2 class="post-title">Search -- <a href="'+ post.url+'">' + post.title + '</a></h2></header>';
        result += '<section class="post-excerpt"><p>' +  excerpt;

        if(excerpt.length > 1){
            result += '<a class="read-more" href="'+ post.url+'"> &raquo;</a></p></section>';
        } else {
            result += '<a class="read-more" href="'+ post.url+'"> No content...</a></p></section>';
        }
        result += '<footer class="post-meta">' + post.author.name;
        if(post.tags.length != 0){
            result += ' on  <a href="/tag/'+ post.tags[0].slug +'">' + post.tags[0].name + '</a>';
        }
        result += '<time class="post-date" datetime="'+ post.created_at +' format="YYYY-MM-DD">'+ date +'</time></footer>';

        result += '</article>';

        return result;
    }

    // function liveSearch(value) {
    //
    //     resultsContainer.fadeOut().empty();
    //
    //     filterPost(value).forEach(function (post) {
    //         resultsContainer.append(postResult(post)).slideDown();
    //     });
    //
    // }

    function liveSearch(value) {


        if(resultsContainer.children().length > 1) {
            resultsContainer.empty();

        }

            var filteredPost = filterPost(value);
            updateResultsCount(filteredPost.length);

            filteredPost.forEach(function (post) {

                resultsContainer.append(postResult(post));
            });
    }

    function autoLoadInitialSearchResults() {

        var length = postData.length > 5 ? 5 : postData.length;

        for(var i = 0; i < length; i++){
            resultsContainer.append(postResult(postData[i]));
        }
    }






    // tag generation for home page
    function tagBuilder(tag) {
        // console.log("Tag builder: ", tag)
        return '<li><a class="page-description" href="/tag/' + tag.slug + '/">'+tag.name+'</a></li>';
    }

    //generate tags
    function generateTagsUl(tags, count) {

        var ul = '<ul>';

        count = count || tags.length;

        for(var i = 0; i < count; i++){
            ul += tagBuilder(tags[i]);
        }

        ul += '</ul>';

        return ul;
    }

    // append the generated tags to the parent element inside of index.js
    function buildIndexPageTagList(tags, count) {

        $("#tags-container").append(generateTagsUl(tags, count));
    }


});


/*
* main blog should slowly fade out upon initial search
* search results should fade out and be hidden if the search box is empty and a search has been init
* init search should not be called until the search box has focus
*
*
*
* */