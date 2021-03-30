"use strict";
/*********************************************** */
// Adderar mockdata till local storage tills vidare (tills data läggs till i local storage i index.html)
const productArray = [];

$.getJSON("data/products.json", function (json) {
  console.log(json);
  for (let i = 0; i < json.length; i++) {
    productArray.push(json[i]);
  }
  localStorage.setItem("prod1", JSON.stringify(json[0]));
  localStorage.setItem("prod2", JSON.stringify(json[1]));
  localStorage.setItem("prod3", JSON.stringify(json[2]));
  localStorage.setItem("prod4", JSON.stringify(json[3]));
  localStorage.setItem("prod5", JSON.stringify(json[4]));
  localStorage.setItem("prod6", JSON.stringify(json[5]));
  localStorage.setItem("prod7", JSON.stringify(json[6]));
});

console.log(productArray);

/*********************************************** */

function getDataFromLocalStorage() {}

/**
 * Creating element
 *
 * @param {string} element - The element you wanna creaate
 * @returns
 */
let createNode = (element) => document.createElement(element);

/**
 * Adding class to element
 *
 * @param {string} element - The element you wanna pick
 * @param {string} className - The class you wanna add
 * @returns
 */
let addClass = (element, className) => element.classList.add(className);

function createElementsForProduct(product) {
  const h2 = document.getElementById("category");
  const h2Value = h2.getAttribute("data-value");
  const div = createNode("div");
  addClass(h2, "m-2");
  addClass(div, "p-2");
  addClass(div, "col-xs-12");
  addClass(div, "col-md-6");
  addClass(div, "col-lg-3");
  addClass(div, "border");
  addClass(div, "text-center");
  addClass(div, "product");

  const img = createNode("img");
  addClass(img, "mb-4");
  addClass(img, "product-hover");
  const p1 = createNode("p");
  const p2 = createNode("p");
  const p3 = createNode("p");
  const btn = createNode("button");
  addClass(btn, "btn-primary");
  addClass(btn, "btn");
  console.log(product);
  console.log(product.quantity);
  if (product.quantity == 0) {
    btn.setAttribute("disabled", "disabled");
    p1.setAttribute("style", "color:grey;");
    p2.setAttribute("style", "color:grey;");
    p3.setAttribute("style", "color:grey;");
    removeClass(img, "product-hover");
  }
  const products = document.getElementById("products");
  if (h2Value == "produkter") {
    img.src = product.image;
    p1.innerHTML = `${product.price} kr`;
    p2.innerHTML = product.title;
    p3.innerHTML = `${product.brand} | ${product.units}`;
    btn.innerHTML = "Köp";

    append(div, img);
    append(div, p1);
    append(div, p2);
    append(div, p3);
    append(div, btn);
    append(products, div);
  } else if (h2Value == product.category) {
    img.src = product.image;
    p1.innerHTML = `${product.price} kr`;
    p2.innerHTML = product.title;
    p3.innerHTML = `${product.brand} | ${product.units}`;
    btn.innerHTML = "Köp";

    append(div, img);
    append(div, p1);
    append(div, p2);
    append(div, p3);
    append(div, btn);
    append(products, div);
  }
}
