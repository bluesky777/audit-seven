$(document).ready(function () {
    //themes, change CSS with JS
    //default theme(CSS) is cerulean, change it if needed
    var defaultTheme = 'cerulean';

    //var currentTheme = $.cookie('currentTheme') == null ? defaultTheme : $.cookie('currentTheme');
    var msie = navigator.userAgent.match(/msie/i);
    $.browser = {};
    $.browser.msie = {};
    //switchTheme(currentTheme);

    $('.navbar-toggle').click(function (e) {
        e.preventDefault();
        $('.nav-sm').html($('.navbar-collapse').html());
        $('.sidebar-nav').toggleClass('active');
        $(this).toggleClass('active');
    });

    var $sidebarNav = $('.sidebar-nav');

    // Hide responsive navbar on clicking outside
    $(document).mouseup(function (e) {
        if (!$sidebarNav.is(e.target) // if the target of the click isn't the container...
            && $sidebarNav.has(e.target).length === 0
            && !$('.navbar-toggle').is(e.target)
            && $('.navbar-toggle').has(e.target).length === 0
            && $sidebarNav.hasClass('active')
            )// ... nor a descendant of the container
        {
            e.stopPropagation();
            $('.navbar-toggle').click();
        }
    });


    $('#themes a').click(function (e) {
        e.preventDefault();
        currentTheme = $(this).attr('data-value');
        //$.cookie('currentTheme', currentTheme, {expires: 365});
        //switchTheme(currentTheme);
    });


    function switchTheme(themeName) {
        if (themeName == 'classic') {
            $('#bs-css').attr('href', 'bower_components/bootstrap/dist/css/bootstrap.min.css');
        } else {
            $('#bs-css').attr('href', 'css/bootstrap-' + themeName + '.min.css');
        }

        $('#themes i').removeClass('glyphicon glyphicon-ok whitespace').addClass('whitespace');
        $('#themes a[data-value=' + themeName + ']').find('i').removeClass('whitespace').addClass('glyphicon glyphicon-ok');
    }



    //highlight current / active link
    $('ul.main-menu li a').each(function () {
        if ($($(this))[0].href == String(window.location))
            $(this).parent().addClass('active');
    });

    
    //other things to do on document ready, separated for ajax calls
    docReady();
});


function docReady() {
    //prevent # links from moving to top
    $('a[href="#"][data-top!=true]').click(function (e) {
        e.preventDefault();
    });

    $('.btn-close').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().parent().fadeOut();
    });
    $('.btn-minimize').click(function (e) {
        e.preventDefault();
        var $target = $(this).parent().parent().next('.box-content');
        if ($target.is(':visible')) $('i', $(this)).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        else                       $('i', $(this)).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        $target.slideToggle();
    });
    $('.btn-setting').click(function (e) {
        e.preventDefault();
        $('#myModal').modal('show');
    });



}


