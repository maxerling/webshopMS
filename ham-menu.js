$(document).ready(function () {
  /**
   *
   *
   */
  $(".navbar-icon").click(function () {
    $("#sidebar").show().animate({ left: "0" }, "slow");
  });
  /**
   *
   *
   */
  $(".close-sidebar").click(function () {
    $("#sidebar").animate({ left: "-200" }, "slow");
  });
  /**
   *
   *
   */
  $("#search").click(function () {
    $(this).css("display", "none");
    $(".search-field").css("display", "block");
  });
});
