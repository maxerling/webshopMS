"use strict";

let cartItems = [];
let freeShippingThreshold = 250;
let shippingCost = 49;
let vat = 1.12;

/**
 *  Fetches data as an array with JSON object from local storage
 *  Appends html-elements using function htmlGenerator that creates html.
 */
function getDataFromLocalStorage() {
  let data = localStorage.getItem("cart");
  if (cartItems != null) {
    cartItems = JSON.parse(data);
  }
  for (let i = 0; i < cartItems.length; i++) {
    $(".cart-table").append(htmlGenerator(cartItems[i]));
  }
}

/**
 * Function that creates html table.
 * @param {object} data recieved from function getDataFromLocalStorage()
 * @returns a string
 */
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

/**
 * Function that calculates total price of current cart items.
 * Gets price and quantity from each object in cart.
 * Sets total-price html element to sum calculated.
 */
function calcPrice() {
  let sum = 0;
  for (let i = 0; i < cartItems.length; i++) {
    sum += cartItems[i].price * cartItems[i].quantity;
  }

  $(".products-total-price").html(sum.toFixed(2));
  calcVat(sum);

  if(sum > freeShippingThreshold) {
    $(".total-price").html(sum.toFixed(2));
  } else {
    sum += shippingCost;
    $(".total-price").html(sum.toFixed(2));
  }
  
}

function calcVat(sum) {
  let temp;
  let shippingTemp;
  if(sum > freeShippingThreshold) {
    temp = (sum) - (sum / vat);
    console.log(temp);
  } else {
    temp = (sum) - (sum / vat);
    shippingTemp = shippingCost / vat;
    console.log(shippingTemp);
  }

  $(".vat").html(temp.toFixed(2));
  
}

/**
 * Function that takes an id and new quantity and sets that element to the new quantity.
 * @param {number} id id of product element of button clicked.
 * @param {number} qty new quantity after button clicked on -/+.
 */
function setNewQuantity(id, qty) {
  for (let i = 0; i < cartItems.length; i++) {
    if (Number(cartItems[i].id) === id) {
      cartItems[i].quantity = qty;
      break;
    }
  }
  calcPrice();
}

/**
 * Function that removes an object from cartItems array and
 * the corresponding html element.
 * Also updates local storage "cart" array accordingly.
 * Calls function calcPrice() to recalculate total price.
 * @param {number} id of product element of button clicked.
 */
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

/**
 * Listener for plus sign button on each item in the cart.
 * Finds id for product and updates elements quantity.
 * Calls function setNewQuantity().
 */
$(document).on("click", ".fa-plus", function () {
  let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
  let id = Number($(this).closest(".quantity-tr").attr("id"));
  console.log(id);
  q++;
  setNewQuantity(id, q);
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

/**
 * Listener for minus sign button on each item in the cart.
 * Finds id for product and updates elements quantity.
 * If quantity equals 1 trigger button with cart-remove-product class,
 * else calls function setNewQuantity().
 */
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
  setNewQuantity(id, q);
  $(this).closest(".quantity-td").find("input").attr("value", q);
});

/**
 * Listener for trash bin sign button for each item in the cart.
 * Removes items from cart page using function removeFromList().
 */
$(document).on("click", ".cart-remove-product", function () {
  let id = Number($(this).closest(".quantity-tr").attr("id"));
  $(this).closest(".quantity-tr").remove();
  removeFromList(id);
});

// Runs on page load.
getDataFromLocalStorage();
calcPrice();
