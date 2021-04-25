$(document).ready(function () {

  $(".search-field-input").keyup(function (e) {
    valueSearch = e.target.value.toUpperCase();
   
    let products = JSON.parse(localStorage.getItem("allProducts")).filter(
      (item) => {
        if (item.title.toUpperCase().indexOf(valueSearch) > -1) {
          return item;
        }
      }
    );

    console.log(products);
  });
  
});
