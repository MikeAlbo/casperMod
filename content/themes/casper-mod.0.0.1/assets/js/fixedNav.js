$(document).ready(function () {

    // get the nav from the index.hbs page
    var headerContainer = $("#header-container"),
        headerNavigation = $("#header-navigation"),
        headerContent = $("#header-content"),
        searchDiv = $("#search"),
        contentDiv = $("#content");


    // window scroll event listener, calls $.addClass or $.removeClass on the nav depending on scroll position
    $(document).scroll(function () {

        // find scroll top
        var st = $(this).scrollTop();
        //console.log(st);

        if ($(this).scrollTop() > 180) {
            headerContainer.addClass("fixNavToTop");
        } else {
            headerContainer.removeClass("fixNavToTop");
        }


    })

    

    
});