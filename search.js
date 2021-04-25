$(document).ready(function () {
  $(".search-field-input").keyup(function (e) {
    
    valueSearch = e.target.value.toUpperCase();
    let searchList=$('#search-list')
    searchList.html("").hide();
    if(valueSearch){
    let products = JSON.parse(localStorage.getItem("allProducts")).filter(
      (item) => {
        if (item.title.toUpperCase().indexOf(valueSearch) > -1) {
          let productSearch = `
            <div class="border product product-search px-5">
               <div>
                    <img src=${item.image} class="h-100">
                    <h5 class="d-inline-block ps-2">${item.title}</h5>
               </div>
               <button class="btn btn-primary btn-search-product p-1 px-3">BUY</button>
            </div>
            <div class="value-changer value-changer-search" style="display: none;">
                <button class="m-2 quantity-value-changer">-</button>
                <input type="tel" id="quantityInput" min="0" pattern="[0-9]+" class="text-center">
                <button class="m-2 quantity-value-changer">+</button>
            </div>
            `;
            searchList.append(productSearch)
          return item;
        }
      }
    );
      searchList.show()
    console.log(products);
    $('.btn-search-product').click(() => {
        console.log("hide");
    })
}
  });

  



});
function valueChanger(){
    $(btn,'.btn-search-product').click(() => {

        $(".value-changer-search").show();
        $('.btn-search-product').hide();

    })
    
}

