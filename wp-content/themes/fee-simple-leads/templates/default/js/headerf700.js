const PROMO_MESSAGE_SHOW_TIMEOUT = 1000;
const PROMO_MESSAGE_HIDE_TIMEOUT = 5000;

// header fixed
jQuery(window).scroll(function(){
  if (jQuery(this).scrollTop() > 500){
    jQuery('body').addClass("header-fixed");
  }
 else{
    jQuery('body').removeClass("header-fixed");
  }
});

// menu
jQuery(document).ready(function(){
  jQuery(".menuIcon").click(function(){
    jQuery("header").toggleClass("active");
    controlNavMenuTransition();
    return false;
  });
  jQuery(document).not(jQuery(".subnav-parent")).click(function(){
    jQuery("header").removeClass("active");
    jQuery('.subnav-content').removeClass("active");
    controlNavMenuTransition();
  });
  jQuery(".subnav-parent").click(function(){
    var thisSubnav = jQuery(this).parent().find('.subnav-content');
    jQuery('.subnav-content').not(thisSubnav).removeClass("active");
    thisSubnav.toggleClass("active");
    return false;
  });
});

jQuery(window).scroll(function(){
  if (jQuery(this).scrollTop() > 10){
    jQuery("header").removeClass("active")
    controlNavMenuTransition();
  }
});

function controlNavMenuTransition() {
  if (jQuery("header").hasClass("active")) {
    jQuery(".navigation").removeClass("notransition");
  } else {
    setTimeout(function() { jQuery(".navigation").addClass("notransition");}, 300);
  }
}

// Promo code message
jQuery(document).ready(function () {
  setTimeout(function() { 
    jQuery('.promo-code-msg').slideDown('slow');
    setTimeout(function() { 
      jQuery('.promo-code-msg').slideUp('slow');
    } , PROMO_MESSAGE_HIDE_TIMEOUT);
  } , PROMO_MESSAGE_SHOW_TIMEOUT);
});