$(document).ready(function () {

    // get the nav from the index.hbs page
    var headerContainer = $("#header-container"),
        headerNavigation = $("#header-navigation"),
        headerContent = $("#header-content"),
        searchDiv = $("#search"),
        contentDiv = $("#content"),
        pageTitle = $(".page-title"),
        pageDescript = $(".page-description"),
        fixedTitle = $("#fixedTitle"),
        headerNavTagContainer = $("#headerNavTagContainer"),
        fixedNavTagContainer = $("#fixedNavTagContainer"),
        menuButton = $(".menu-button"),
        navClose = $(".nav-close"),
        asideTags = $("#asideTags"),
        searchButton = $("#searchButton"),
        searchBoxInput = $("#searchBoxInput"),
        backButton = $("#goBack");

    /* --- helpers ---*/

    var documentHeight, st;

    // get the document height on page load
    (function () {
        documentHeight = $(document).height();
        console.log(documentHeight);
        setupAside(documentHeight);
        setupMenuComponents(documentHeight);
    })();

    //get scrollTop on PageLoad
    (function () {
        st = $(document).scrollTop();

    })();

    /* add / remove classes based on document size*/
    function setupAside(windowHeight) {
        if(windowHeight < 2000) {
            asideTags.addClass('fade-in-element');
        }
    };

    function setupMenuComponents(windowHeight) {
        if(windowHeight > 2000){
            menuButton.removeClass('fade-out-element');
            searchButton.removeClass('search-button-move');
            searchBoxInput.removeClass('search-box-move');
        }
    }




    // window scroll event listener, calls $.addClass or $.removeClass on the nav depending on scroll position
    $(document).scroll(function () {

        // find scroll top
        st = $(this).scrollTop();

        if (st > 350) {
            pageTitle.addClass("fade-out-element");
        } else {
            pageTitle.removeClass("fade-out-element");
        }

        if (st > 390) {
            pageDescript.addClass("fade-out-element");
        } else {
            pageDescript.removeClass("fade-out-element");
        }

        // if (st > 200) {
        //     fixedTitle.addClass("fade-in-element");
        // } else {
        //     fixedTitle.removeClass("fade-in-element");
        // }

        if ( documentHeight > 2000 && st > 400) {
            // headerNavTagContainer.addClass("fade-out-element");
            // fixedNavTagContainer.removeClass("fade-out-element");
                menuButton.addClass('fade-out-element');
                searchButton.addClass('search-button-move');
                searchBoxInput.addClass('search-box-move');
            // headerNavigation.addClass("fade-background-to-white");
        }
        else if ( documentHeight < 2000 && st > 100) {
            // headerNavTagContainer.addClass("fade-out-element");
            // fixedNavTagContainer.removeClass("fade-out-element");
            menuButton.addClass('fade-out-element');
            searchButton.addClass('search-button-move');
            searchBoxInput.addClass('search-box-move');

            // headerNavigation.addClass("fade-background-to-white");
        }
        else {
            // headerNavTagContainer.removeClass("fade-out-element");
            // fixedNavTagContainer.addClass("fade-out-element");
            menuButton.removeClass("fade-out-element");
            searchButton.removeClass('search-button-move');
            searchBoxInput.removeClass('search-box-move');

            // headerNavigation.removeClass("fade-background-to-white");
        }

        if(documentHeight < 2000) {
            return asideTags.addClass('fade-in-element');
        } else if (st > 650 && documentHeight > 2000) {
                asideTags.addClass('fade-in-element');
        } else {
            asideTags.removeClass('fade-in-element');


        }


        // if ($(this).scrollTop() > 800) {
        //     headerNavigation.addClass("fade-in-background");
        // } else {
        //     headerNavigation.removeClass("fade-in-background");
        // }






    });






    backButton.on('click', function () {
        window.history.back();
    });


    
});