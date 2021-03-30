$(document).ready(function () {
  getData();
});

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
let addClass = (element, className) => $(element).addClass(className);
/**
 * Removing class form element
 *
 * @param {string} element - element you wanna pick
 * @param {string} className - the class you wanna remove
 * @returns
 */
let removeClass = (element, className) => $(element).removeClass(className);
/**
 * Add child element to parent element
 *
 * @param {string} parent - The parent element
 * @param {string} el - The child element
 * @returns
 */
let append = (parent, el) => $(parent).append(el);
/**
 * Fetch data from url/path
 */
function getData() {
  const url = "data/products.json";

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => storeData(data))
    .catch((err) => console.log(err));
}
/**
 * Storing data from fetch, promise into array
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS object
 */
function storeData(data) {
  let products = new Array();
  let inCartArray = new Array();
  products = data;
  localStorage.setItem("allProducts", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(inCartArray));
  products.forEach((product) => createElementsForProduct(product));
}

/**
 * Create elements based on product data (object data)
 * @param {object} product - object of array of objects
 */
function createElementsForProduct(product) {
  const h2 = $("#category")[0];
  const h2Value = $(h2).attr("data-value");
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

  if (product.quantity == 0) {
    $(btn).attr("disabled", "disabled");
    $(p1).attr("style", "color:gray;");
    $(p2).attr("style", "color:gray;");
    $(p3).attr("style", "color:gray;");
    removeClass(img, "product-hover");
  } else {
    $(btn).click(() => addToCart(`${product.id}`, products));
  }
  const products = $("#products")[0];
  if (h2Value == "produkter") {
    $(img).attr("src", product.image);
    $(p1).html(`${product.price} kr`);
    $(p2).html(product.title);
    $(p3).html(`${product.brand} | ${product.units}`);
    $(btn).html("Köp");

    append(div, img);
    append(div, p1);
    append(div, p2);
    append(div, p3);
    append(div, btn);
    append(products, div);
  } else if (h2Value == product.category) {
    $(img).attr("src", product.image);
    $(p1).html(`${product.price} kr`);
    $(p2).html(product.title);
    $(p3).html(`${product.brand} | ${product.units}`);
    $(btn).html("Köp");

    append(div, img);
    append(div, p1);
    append(div, p2);
    append(div, p3);
    append(div, btn);
    append(products, div);
  }
  $(document).on("click", "#logIn", function () {
    $("#loginModal").modal("show");
  });

  $(document).on("click", ".register-new-user-button", function () {
    $("#registerModal").modal("show");
    $("#loginModal").modal("hide");
  });

  $(document).on("click", "#register", function () {
    $("#registerModal").modal("show");
  });
  $(document).on("click", "#closeModal", function () {
    $("#registerModal").modal("hide");
  });
}
