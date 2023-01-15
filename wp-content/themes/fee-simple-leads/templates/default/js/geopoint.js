/* aos js */
AOS.init({
    duration: 1000,
})

// jarallax :-
$('.jarallax').jarallax({
  speed: 0.5,
  imgWidth: 1366,
  imgHeight: 768
}); 

$('.testimonial-carousel').owlCarousel({
    loop:true,
    margin:40,
    nav:true,
    autoplay:true,
    smartSpeed:700,
    navText: [ '', '' ],
    responsive:{
      0:{
          items:1
      },
      768:{
          items:2
      },
      992:{
          items:3
      }
    } 
});

setInterval(function(){ 
  var width = $(window).width();
  $(".shap-top").css("border-right-width", width);
  $(".shap-bottom").css("border-left-width", width)
}, 100);

// accordion js
$(document).ready(function () {
    $('.accordion').find('.accordion-toggle').click(function () {
        $(this).next().slideToggle('600');
        $(this).parent().siblings().children(".accordion-content").not($(this).next()).slideUp('600');
    });
    $('.accordion-toggle').on('click', function () {
        $(this).toggleClass('active').parent().siblings().children().removeClass('active');
    });
});