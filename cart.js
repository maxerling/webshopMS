"use strict";

let cartItems = [];

/*********************************************** */
// Adderar mockdata till local storage tills vidare (tills data läggs till i local storage i index.html)
const productArray = [];

$.getJSON("data/products.json", function (json) {
  console.log(json);
  for (let i = 0; i < json.length; i++) {
    productArray.push(json[i]);
  }
  localStorage.setItem("prodarray", JSON.stringify(productArray));
  // localStorage.setItem("prod2", JSON.stringify(json[1]));
  // localStorage.setItem("prod3", JSON.stringify(json[2]));
  // localStorage.setItem("prod4", JSON.stringify(json[3]));
  // localStorage.setItem("prod5", JSON.stringify(json[4]));
  // localStorage.setItem("prod6", JSON.stringify(json[5]));
  // localStorage.setItem("prod7", JSON.stringify(json[6]));
});

console.log(localStorage);
console.log(productArray);
// productArray.forEach((product) => createElementsForProduct(product));

/*********************************************** */
function getDataFromLocalStorage() {
  let data = localStorage.getItem("prodarray");
  if (cartItems != null) {
    cartItems = JSON.parse(data);
  }
  for (let i = 0; i < cartItems.length; i++) {
    $(".cart-table").append(htmlGenerator(cartItems[i]));
    // console.log(cartItems[i]);
    // console.log(cartItems);
  }
}

function htmlGenerator(data) {
  return `
  <tr>
  <td><img src="${data.image}" alt="" style="width: 75px;"></td>
  <td>${data.title}</td>
  <td><input min="1" name="quantity" value="1" type="number" id="cart-quantity"></td>
  <td>SEK ${data.price.toFixed(2)}</td>
  <td><button class="cart-remove-product"><i class="far fa-trash-alt class="trash-bin-image"></i></button></td>
  </tr>
  `
  ;
}


getDataFromLocalStorage();
