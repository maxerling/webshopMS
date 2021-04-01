$(document).ready(function () {
  
  $(".navbar-icon").click(function () {
    $("#sidebar").show().animate({ left: "0" }, "slow");
  });

  $(".close-sidebar").click(function () {
    $("#sidebar").animate({ left: "-200" }, "slow");
  });

  $("#search").click(function () {
    $(this).css("display", "none");
    $("#logo").css("display", "none");
    $(".search-field").css("display", "block");
  });


  var x = window.matchMedia("(max-width: 769px)");
  $(".search-field").focusout(function () {
    if (x.matches) {
      // If media query matches
      $(this).css("display", "none");
      $("#logo").css("display", "block");
      $("#search").css("display", "inline-block");
    } else {
      $("#search").css("display", "none");
      $("#logo").css("display", "block");
    }
  });
});


