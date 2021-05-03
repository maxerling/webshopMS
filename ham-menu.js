$(document).ready(function () {
  
  $(".navbar-icon").click(function () {
    $("#sidebar").show().animate({ left: "0" }, "slow");
  });

  $(".close-sidebar").click(function () {
    $("#sidebar").animate({ left: "-200" }, "slow");
  });

  $("#search").click(function () {
    $(this).hide();
    $("#logo").hide();
    $("#mobile-cart-login").hide()
    $("#search-box").show();
    $(".search-field-input").focus();
  });

  $("#search-list button").click(function (e) {
    e.preventDefault() 
  });
  
});


