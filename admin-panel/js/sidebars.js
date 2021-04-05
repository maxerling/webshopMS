/* global bootstrap: false */
// (function () {
//   'use strict'
//   var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//   tooltipTriggerList.forEach(function (tooltipTriggerEl) {
//     new bootstrap.Tooltip(tooltipTriggerEl)
//   })
// })()


// function gfgMenu() {
//   const GFG = document.querySelector('.links');

//   if (GFG.style.display === "none") {
//       GFG.style.display = "block";
//   }
//   else {
//       GFG.style.display = "none";
//   }
// }


/**
 * remove and add active class by each click on sidebar menu!
 * @param {*} event 
 */
 function activeClass(event){
   $('.nav-link').removeClass("active")
   event.currentTarget.className += " active";
 }






