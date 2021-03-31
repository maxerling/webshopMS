"use strict";

let cartItems = [];

/*********************************************** */
// Adderar mockdata till local storage tills vidare (tills data läggs till i local storage i index.html)
const productArray = [];

$.getJSON("data/products.json", function (json) {
  // console.log(json);
  for (let i = 0; i < json.length; i++) {
    // productArray.push(json[i]);
    let temp = {
      productid: json[i].id,
      producttitle: json[i].title,
      productimage: json[i].image,
      productprice: json[i].price,
      productquantity: 3,
    };
    productArray.push(temp);
    // console.log(temp);
  }
  localStorage.setItem("prodarray", JSON.stringify(productArray));
});

/*********************************************** */
function getDataFromLocalStorage() {
  let data = localStorage.getItem("prodarray");
  if (cartItems != null) {
    cartItems = JSON.parse(data);
  }
  for (let i = 0; i < cartItems.length; i++) {
    $(".cart-table").append(htmlGenerator(cartItems[i]));
  }
}

function htmlGenerator(data) {
  return `
  <tr class="quantity-tr">
              <td><img src="${
                data.productimage
              }" alt="" style="width: 60px;"></td>
              <td class = "td-title">${data.producttitle}</td>
                <td class="quantity-td">
                  <div class = "row mx-0 px-0">
                    <input class="col-12 col-sm-12 col-md-6" min="1" name="quantity" value="${
                      data.productquantity
                    }" type="text" readonly id="cart-quantity">
                    <div class="md-remove-one-product col-3 d-none d-sm-block"><i class="fas fa-minus"></i></i></div>
                    <div class="md-add-one-product col-3 d-none d-sm-block"><i class="fas fa-plus"></i></div>
                  </div>
                  <div class="row">
                    <div class="sm-remove-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-minus"></i></div>
                    <div class="sm-add-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-plus"></i></div>
                  </div>
                </td>
              <td>${data.productprice.toFixed(2)}</td>
              <td>
                <button class="cart-remove-product"><i class="far fa-trash-alt" class="trash-bin-image"></i></button>
              </td>
            </tr>
  `;
}

function calcPrice() {
  let sum = 0;
  for (let i = 0; i < cartItems.length; i++) {
    sum += cartItems[i].productprice * cartItems[i].productquantity;
  }
  $("#total-price").html(sum.toFixed(2));
}

$(document).on("click", ".fa-plus", function () {
  let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
  q++;
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

$(document).on("click", ".fa-minus", function () {
  let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
  if (q === 1) return;
  q--;
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

$(document).on("click", ".cart-remove-product", function () {
  $(this).closest(".quantity-tr").remove();
});

getDataFromLocalStorage();
calcPrice();
