let allProducts = JSON.parse(localStorage.getItem("allProducts"));
let pTemp=[];
$(document).ready(function () {
  $(".search-field-input").keyup(function (e) {
    valueSearch = e.target.value.toUpperCase();
    let searchList = $("#search-list");
    searchList.html("").hide();
    if (valueSearch) {
      pTemp = allProducts.filter((item) => {
        if (item.title.toUpperCase().indexOf(valueSearch) > -1 ) {
          return item;
        }
      });
      pTemp.length = 5;
      pTemp.map((item) => {
        let productSearch = `
        <div class="border product product-search " id="ps${item.id}">
           <div>
                <img src=${item.image} class="h-100">
                <h5 class="d-inline-block ps-2 title-product">${item.title}</h5>
           </div>
   
           <p class="qyt-error" style="color: red; font-size:9pt;">Ej i lager</p>
           <button class="btn btn-primary btn-search-product p-1 px-3">Köp</button>

           <div class="value-changer value-changer-search ">
                <button class="quantity-value-changer minus-plus minus">-</button>
                <input type="tel" id="ns${item.id}" min="0" pattern="[0-9]+" class="text-center quantityInput quantityInput-search">
                <button class=" quantity-value-changer minus-plus plus">+</button>
            </div>
        </div>
      
        `;
      searchList.append(productSearch);
      })

      searchList.slideDown();
      setNumberProductForSearch()
      BuyBtn();
      minusSearchBtn()
      plusSearchBtn()
      $(".quantityInput-search").blur((e) => {
          let id= e.target.id.substr(2, e.target.id.length);
          focusOutNumber2(e,id)
      })
      $(".quantityInput-search").keyup((e) =>{        
        let id= e.target.id.substr(2, e.target.id.length);
        console.log(id);
        setNumberToSearch(e,id)
       })
      
    }
  });

  var x = window.matchMedia("(max-width: 888px)");

  $("#search-box input").on("focus",function(e) {
        $('.mask').css({"width": "100%", "height": "100%"});

        $('.mask').click(function () {
            $('.mask').css({"width": "0", "height": "0"});
            $("#search-list").slideUp(500);

            if (x.matches) {
              // If media query matches
              console.log("mobile");
              $("#search-box").hide();
              $("#logo").show();
              $("#search").show();
              $("#mobile-cart-login").show();
            } else {
              $("#search").hide();
              $("#logo").show();
              $("#search-box").show();
            }
        });

        
    
  })
});

/**
 * 
 */
function valueChanger() {
  $(btn, ".btn-search-product").click(() => {
    $(".value-changer-search").show();
    $(".btn-search-product").hide();
  });
}

/**
 * 
 */
function BuyBtn() {
  $(".btn-search-product").click((e) => {
    e.target.parentElement.querySelector(".btn-search-product").style.display =
      "none";
    e.target.parentElement.querySelector(
      ".value-changer-search"
    ).style.display = "block";
    let inputSearch = e.target.parentElement.querySelector(
      ".value-changer-search input"
    );
    inputSearch.value = 1;
    let id = inputSearch.id.substr(2, inputSearch.id.length);
    let idProduct = "#number" + id;
    document.querySelector(idProduct).value = 1;
    document.querySelector(idProduct).parentElement.style.display = "block";
    document
      .querySelector(idProduct)
      .parentElement.parentElement.querySelector(".btn-product").style.display =
      "none";

    addToCart(id);
    updateCartBtnQtn();
    disableOrEnableCartButton();
  });
}

/**
 * 
 */
function minusSearchBtn() {
  $(".minus").click((e) => {
    let input = e.target.parentElement.querySelector("input");
    let id = input.id.substr(2, input.id.length);
    let p = allProducts.filter(item => item.id == id) 
    minusButton(e, p[0]);
    let idNmberProduct = '#number' + p[0].id
    $(idNmberProduct).val(input.value)
  });
}

/**
 * 
 */
function plusSearchBtn() {
  $(".plus").click((e) => {
    let input = e.target.parentElement.querySelector("input");
    let id = input.id.substr(2, input.id.length);
    let p = allProducts.filter(item => item.id == id) 
    plusButton(e, p[0]);
    let idNmberProduct = '#number' + p[0].id
    $(idNmberProduct).val(input.value)
  });
}

/**
 * 
 */
function setNumberProductForSearch(){
        let cartArray=[]
        
        if(JSON.parse(localStorage.getItem("cart"))==null){
            $('.value-changer-search').hide()
        }else{
          cartArray = JSON.parse(localStorage.getItem("cart"));
          //cartArray = cartArray.filter((product) => product.quantity > 0)
        }
          cartArray.map(item => {
                let id = '#ns' + item.id
                let btn= '#ps' + item.id + ' .btn-search-product'
                if( $(id) != undefined ){
                    $(id).val(item.quantity)
                    $(btn).hide()
                    $(id).parent().show()
                }
            })

}
/**
 * 
 * @param {*} e 
 * @param {*} id 
 */
function focusOutNumber2(e,id){
   let cartArray = JSON.parse(localStorage.getItem("cart"))
  let inputValue = e.target.value;
  if (inputValue == "") {
    cartArray.forEach((cartItem, i) => {
      if (cartItem.id == id) {
        cartItem.quantity = 0;
        cartArray.splice(i, 1);      
        let idNumberProduct= '#number' + id
        let btnProduct = '#' + id + ' .btn-product'
        $(idNumberProduct).parent().hide()
        $(btnProduct).show()

        let idSearchProduct = '#ns' + id
        let btnSearchProduct= '#ps' + id + ' .btn-search-product'
        $(idSearchProduct).parent().hide()
        $(btnSearchProduct).show()
      }
    });
    localStorage.setItem("cart", JSON.stringify(cartArray));
    updateCartBtnQtn();
    disableOrEnableCartButton();
  }

}

/**
 * 
 * @param {*} e 
 * @param {*} id 
 */
function setNumberToSearch(e,id){
  e.target.value = e.target.value.replace(/[^0-9]+/, "");
  let inputValue = e.target.value;
  let cartArray = JSON.parse(localStorage.getItem("cart"))
  let product = allProducts.filter(item=>item.id==id)
  if (Number(inputValue) >= 0 && Number(inputValue <= product[0].quantity)) {
    e.target.parentNode.parentNode.querySelector(".qyt-error").style.display = "none";
    e.target.setCustomValidity("");
    setTimeout(() => {
      cartArray.forEach((cartItem, i) => {
        if (cartItem.id === product[0].id) {
          if ((inputValue == "0") & (inputValue != "")) {
            cartItem.quantity = 0;
            cartArray.splice(i, 1);
            e.target.parentNode.style.display = "none";
            e.target.parentNod.parentNod.querySelector(".btn-search-product").style.display = "inline-block";
          } else {
            if (inputValue != "") {
              cartItem.quantity = Number(inputValue);
            }
          }
        }
      });

      let idNmberSearchProduct = '#number' + product[0].id
      $(idNmberSearchProduct).val(inputValue)

      addProductIfDontExist(cartArray, product[0].id, inputValue);
      updateCartBtnQtn();
      disableOrEnableCartButton();
    }, 1000);
  } else {
    e.target.parentNode.parentNode.querySelector(".qyt-error").style.display = "block";
    e.target.value= "1"
  }
}