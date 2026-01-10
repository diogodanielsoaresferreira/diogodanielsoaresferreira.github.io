function loadPlugin(src, onLoad) {
    if (loadPlugin.loaded[src]) {
        onLoad();
        return;
    }

    $.getScript(src)
        .done(function() {
            loadPlugin.loaded[src] = true;
            onLoad();
        });
}
loadPlugin.loaded = {};

// Need this to show animation when go back in browser
window.onunload = function() {};

$(function() {
    // dl-menu options
    var $menu = $('#dl-menu');
    if ($menu.length) {
        loadPlugin('/assets/js/jquery.dlmenu.min.js', function() {
            $menu.dlmenu({
                animationClasses: { classin: 'dl-animate-in', classout: 'dl-animate-out' }
            });
        });
    }

    // zoom in/zoom out animations
    if ($('.container').hasClass('fadeOut')) {
        $('.container').removeClass('fadeOut').addClass('fadeIn');
    }
    if ($('.wrapper').hasClass('fadeOut')) {
        $('.wrapper').removeClass('fadeOut').addClass('fadeIn');
    }
    $('.zoombtn').click(function() {
        $('.container').removeClass('fadeIn').addClass('fadeOut');
        $('.wrapper').removeClass('fadeIn').addClass('fadeOut');
    });

    // Add lightbox class to all image links and load lightbox only when needed.
    var $imageLinks = $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']")
        .addClass('image-popup');
    if ($imageLinks.length) {
        loadPlugin('/assets/js/jquery.magnific-popup.min.js', function() {
            $imageLinks.magnificPopup({
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                },
                image: {
                    tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
                },
                removalDelay: 300,
                mainClass: 'mfp-fade'
            });
        });
    }

    // FitVids options
    if ($('.content iframe, .content object, .content embed').length) {
        loadPlugin('/assets/js/jquery.fitvid.min.js', function() {
            $('.content').fitVids();
        });
    }
});

$(window).on('load', function() {
    // go up button only when page is long enough
    if (document.body.scrollHeight > window.innerHeight * 1.5) {
        loadPlugin('/assets/js/jquery.goup.min.js', function() {
            $.goup({
                trigger: 500,
                bottomOffset: 10,
                locationOffset: 20,
                containerRadius: 0,
                containerColor: '#fff',
                arrowColor: '#000',
                goupSpeed: 'normal'
            });
        });
    }
});
