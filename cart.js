"use strict";

let cartItems = [];

function getDataFromLocalStorage() {
  let data = localStorage.getItem("cart");
  if (cartItems != null) {
    cartItems = JSON.parse(data);
  }
  for (let i = 0; i < cartItems.length; i++) {
    $(".cart-table").append(htmlGenerator(cartItems[i]));
  }
}

function htmlGenerator(data) {
  return `
  <tr class="quantity-tr" id="${data.id}">
              <td><img src="${data.image}" alt="" style="width: 60px;"></td>
              <td class = "td-title">${data.title}</td>
                <td class="quantity-td">
                  <div class = "row mx-0 px-0">
                    <input class="col-12 col-sm-12 col-md-6" min="1" name="quantity" value="${
                      data.quantity
                    }" type="text" readonly id="cart-quantity">
                    <div class="md-remove-one-product col-3 d-none d-sm-block"><i class="fas fa-minus"></i></i></div>
                    <div class="md-add-one-product col-3 d-none d-sm-block"><i class="fas fa-plus"></i></div>
                  </div>
                  <div class="row">
                    <div class="sm-remove-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-minus"></i></div>
                    <div class="sm-add-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-plus"></i></div>
                  </div>
                </td>
              <td>${data.price.toFixed(2)}</td>
              <td>
                <button class="cart-remove-product"><i class="far fa-trash-alt" class="trash-bin-image"></i></button>
              </td>
            </tr>
  `;
}

function calcPrice() {
  let sum = 0;
  for (let i = 0; i < cartItems.length; i++) {
    sum += cartItems[i].price * cartItems[i].quantity;
  }
  $("#total-price").html(sum.toFixed(2));
}

function checkNewQuantity(id, qty) {
  for (let i = 0; i < cartItems.length; i++) {
    if (Number(cartItems[i].id) === id) {
      cartItems[i].quantity = qty;
      break;
    }
  }
  calcPrice();
}

function removeFromList(id) {
  for (let i = 0; i < cartItems.length; i++) {
    if (Number(cartItems[i].id === id)) {
      cartItems.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      break;
    }
  }
  calcPrice();
}

$(document).on("click", ".fa-plus", function () {
  let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
  let id = Number($(this).closest(".quantity-tr").attr("id"));
  console.log(id);
  q++;
  checkNewQuantity(id, q);
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

$(document).on("click", ".fa-minus", function () {
  let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
  let id = Number($(this).closest(".quantity-tr").attr("id"));
  if (q === 1) {
    $(this)
      .closest(".quantity-tr")
      .find(".cart-remove-product")
      .trigger("click");
    return;
  }
  q--;
  checkNewQuantity(id, q);
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

$(document).on("click", ".cart-remove-product", function () {
  let id = Number($(this).closest(".quantity-tr").attr("id"));
  $(this).closest(".quantity-tr").remove();
  removeFromList(id);
});

getDataFromLocalStorage();
calcPrice();
