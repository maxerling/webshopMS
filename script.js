let createNode = (element) => document.createElement(element);

let addClass = (element, className) => element.classList.add(className);

let append = (parent, el) => parent.appendChild(el);

function getData() {
  const url = "data/products.json";

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => loadData(data))
    .catch((err) => console.log(err));
}
function loadData(data) {
  data.map(function (product) {
    createElementsForProduct(product);
  });
}

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

$(document).on("click", "#register", function() {
$("#registerModal").modal("show");})
$(document).on("click", "#closeModal", function() {
$("#registerModal").modal("hide");})
