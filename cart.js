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
/*
function getDataFromLocalStorage() {
  let data = localStorage.getItem("prodarray");
  if (cartItems != null) {
    cartItems = JSON.parse(data);
  }
  for (let i = 0; i < cartItems.length; i++) {
    $("#tbodyTable").append(htmlGenerator(cartItems[i]));
    // console.log(cartItems[i]);
    // console.log(cartItems);
  }
}

function htmlGenerator(data) {
  return `<tr id = "product">
  <th class="row">
      <img src="${data.image}" alt="" id="cartImage">
  </th>
  <td>
  <div id = "productID" style = "display: none;">
           ${data.id}
      </div>
      <div id="productTitle" class="col-4">
      ${data.title}
      </div>
      
  </td>
  <td>
      <div class="number-input md-number-input col-9">
          <button class="btn btn-secondary" id="removeOneProduct">-</button>
          <input min="1" name="quantity" value="1" type="text" readonly="" id="cartQuantity">
          <button class="btn btn-secondary" id="addOneProduct">+</button>
        </div>
  </td>
  <td>
      SEK ${data.price}
  </td>
  <td>
      <button class = "btn btn-warning p-1" id = "removeBtn">Remove</button>
  </td>
  </tr>
  `;
}
*/

getDataFromLocalStorage();
