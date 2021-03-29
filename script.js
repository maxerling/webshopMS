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
/**
 * Add child element to parent element
 *
 * @param {string} parent - The parent element
 * @param {string} el - The child element
 * @returns
 */
let append = (parent, el) => parent.appendChild(el);
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
 * Stroing data from fetch, promise into array
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS Ojbect
 */
function storeData(data) {
  products = new Array();
  console.log(products);
  products = data;
  console.log(products);
}

window.addEventListener("load", () => {
  getData();
});
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
  const p1 = createNode("p");
  const p2 = createNode("p");
  const p3 = createNode("p");
  const btn = createNode("button");
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
