

/**
 * remove and add active class by each click on sidebar menu!
 * @param {*} event 
 */
 function activeClass(event){
   $('.nav-link').removeClass("active")
   event.currentTarget.className += " active";
 }

 






