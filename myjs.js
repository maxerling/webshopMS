/** Global variable */
let cat = "produkter";
let createNode = (element) => document.createElement(element);
let addClass = (element, className) => element.classList.add(className);
let append = (parent, el) => parent.appendChild(el);
let products = document.getElementById("products");
let productsData = [];

/**
 *
 *
 */
window.addEventListener("load", () => {
  getData();
});
/**
 *
 *
 */
function getData() {
  const url = "data/products.json";

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      loadData(data);
      productsData = data;
      loadCategories(data);
      addListener();
    })
    .catch((err) => console.log(err));
}
/**
 *
 *
 */
function loadData(data) {
  document.getElementById("category").innerText = cat;
  data.map(function (product) {
    createElementsForProduct(product);
  });
}
function loadCategories(data) {
  data.map(function (product) {
    createCategory(product.category);
  });
}
/**
 *
 *
 */
function createElementsForProduct(product) {
  console.log(cat);
  console.log(product.category);
  const div = createNode("div");
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

  if (cat == "produkter") {
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
  } else if (cat == product.category) {
    console.log(cat + "else");
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

/**
 *
 *
 */
function createCategory(category) {
  let li = document.createElement("li");
  li.setAttribute("class", "nav-item");

  if (document.getElementById(category) == null) {
    let div = document.createElement("a");
    div.setAttribute("class", "cat h4 nav-link");
    div.id = category;
    div.innerText = category;

    li.appendChild(div);
    document.querySelector(".navbar-nav").appendChild(li);
  }
}

/**
 *
 *
 */
function addListener() {
  document.querySelectorAll(".cat").forEach((item) => {
    item.addEventListener("click", function (event) {
      let target = event.target;
      cat = target.innerText;
      products.innerHTML = "";
      loadData(productsData);
    });
  });
}
