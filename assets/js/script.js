$(function () {

  var delay=0, setTimeoutConst;
  $('.site-navigation:not(.onclick) .navbar-nav>li.dropdown, .site-navigation:not(.onclick) li.dropdown>ul>li.dropdown').hover(
  function(){
    var $this = $(this);
    setTimeoutConst = setTimeout(function(){
      $this.addClass('open').slideDown();
      $this.find('.dropdown-toggle').addClass('disabled');
    }, delay);

  },  function(){ 
    clearTimeout(setTimeoutConst );
    $(this).removeClass('open');
    $(this).find('.dropdown-toggle').removeClass('disabled');
  });

  // Slicknav menu
  $('.navbar-nav').slicknav({
      allowParentLinks: true,
      label: "",
      appendTo: "#masthead",
      closedSymbol: '<i class="fa fa-caret-down" aria-hidden="true"></i>',
      openedSymbol :'<i class="fa fa-caret-up" aria-hidden="true"></i>'
  });

  // menu click event
  $('.slicknav_btn').click(function() {
    $(this).toggleClass('act');
      if($(this).hasClass('act')) {
        $('.slicknav_menu').addClass('act');
      }
      else {
        $('.slicknav_menu').removeClass('act');
      }
  });

  //Counters
  if ($(".counter-item [data-to]").length>0) {
      $(".counter-item [data-to]").each(function() {
          var stat_item = $(this),
          offset = stat_item.offset().top;
          if($(window).scrollTop() > (offset - 800) && !(stat_item.hasClass('counting'))) {
              stat_item.addClass('counting');
              stat_item.countTo();
          };
          $(window).scroll(function() {
              if($(window).scrollTop() > (offset - 800) && !(stat_item.hasClass('counting'))) {
                  stat_item.addClass('counting');
                  stat_item.countTo();
              }
          });
      });
  };

    //shuffle.js
  var shuffleme = (function( $ ) {
    'use strict';
        var $grid = $('#grid'), //locate what we want to sort 
        $filterOptions = $('.portfolio-sorting li'),  //locate the filter categories

    init = function() {

      // None of these need to be executed synchronously
      setTimeout(function() {
        listen();
        setupFilters();
      }, 100);

      $("#grid .col-md-4").slice(0, 4).show();

      $("#loadMore").on('click', function(e) {
        e.preventDefault();
        $("#grid .col-md-4:hidden")
          .slice(0, 4)
          .fadeIn()
          .each(function() {
            $grid.shuffle('appended', $(this));
          });

        if($("#grid .col-md-4:hidden").length == 0){
          $("#loadMore").addClass("disabled").html("No more to Load");
        } 
      });

      // instantiate the plugin
      $grid.shuffle({
        itemSelector: '[class*="col-"]', 
         group: Shuffle.ALL_ITEMS, 
      });
    },

      
    // Set up button clicks
    setupFilters = function() {
      var $btns = $filterOptions.children();
      $btns.on('click', function(e) {
        e.preventDefault();
        var $this = $(this),
            isActive = $this.hasClass( 'active' ),
            group = isActive ? 'all' : $this.data('group');

        // Hide current label, show current label in title
        if ( !isActive ) {
          $('.portfolio-sorting li a').removeClass('active');
        }

        $this.toggleClass('active');

        // Filter elements
        $grid.shuffle( 'shuffle', group );
      });

      $btns = null;
    },

    // Re layout shuffle when images load. This is only needed
    // below 768 pixels because the .picture-item height is auto and therefore
    // the height of the picture-item is dependent on the image
    // I recommend using imagesloaded to determine when an image is loaded
    // but that doesn't support IE7
    listen = function() {
      var debouncedLayout = $.throttle( 300, function() {
        $grid.shuffle('update');
      });

      // Get all images inside shuffle
      $grid.find('img').each(function() {
        var proxyImage;

        // Image already loaded
        if ( this.complete && this.naturalWidth !== undefined ) {
          return;
        }

        // If none of the checks above matched, simulate loading on detached element.
        proxyImage = new Image();
        $( proxyImage ).on('load', function() {
          $(this).off('load');
          debouncedLayout();
        });

        proxyImage.src = this.src;
      });

      // Because this method doesn't seem to be perfect.
      setTimeout(function() {
        debouncedLayout();
      }, 500);
    };      

    return {
      init: init
    };
  }( jQuery ));

  if($('#grid').length >0 ) { 
    shuffleme.init(); //filter portfolio
  };

}());

// GoogleMap
if($('#map').length >0 ) {
  var google;
  function init() {
      // Basic options for a simple Google Map
      // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
      // var myLatlng = new google.maps.LatLng(40.71751, -73.990922);
      var myLatlng = new google.maps.LatLng(40.69847032728747, -73.9514422416687);

      var mapOptions = {
          // How zoomed in you want the map to start at (always required)
          zoom: 7,
          // The latitude and longitude to center the map (always required)
          center: myLatlng,
          // How you would like to style the map. 
          scrollwheel: false,
          styles: [{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]}]
      };

      // Get the HTML DOM element that will contain your map 
      // We are using a div with id="map" seen below in the <body>
      var mapElement = document.getElementById('map');
      // Create the Google Map using out element and options defined above
      var map = new google.maps.Map(mapElement, mapOptions);
      var addresses = ['Brooklyn'];
      for (var x = 0; x < addresses.length; x++) {
          $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&sensor=false', null, function (data) {
              var p = data.results[0].geometry.location
              var latlng = new google.maps.LatLng(p.lat, p.lng);
              new google.maps.Marker({
                  position: latlng,
                  map: map,
                  icon: 'images/loc.png'
              });

          });
      }
      
  }
  google.maps.event.addDomListener(window, 'load', init);
}