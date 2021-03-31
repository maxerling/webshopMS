$(document).ready(function () {
  getData();
});

/** Global variable */
let cat = "produkter";
let products = document.getElementById("products");
let productsData = [];


/**
 * Creating element
 *
 * @param {string} element - The element you wanna create
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
    .then((data)=>{
      productsData = data;
      storeData(data);
      loadCategories(data);
      addListener();
    })
    .catch((err) => console.log(err));
}
/**
 * Storing data from fetch, promise into array
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS object
 */
function storeData(data) {
  document.getElementById("category").innerText = cat;
  // products = new Array();
  // products = data;
  data.forEach((product) => createElementsForProduct(product));
}

/**
 *
 *
 */
function loadCategories(data) {
  data.map(function (product) {
    createCategory(product.category);
  });
}


/**
 * Create elements based on product data (object data)
 * @param {object} product - object of array of objects
 */
 function createElementsForProduct(product) {
  
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


  $(document).on("click", "#logIn", function() {
    $("#loginModal").modal("show");
  });

  $(document).on("click", ".register-new-user-button", function() {
    $("#loginModal").modal("hide");
    $("#registerModal").modal("show");
  });

  $(document).on("click", ".modal-cancel-button", function() {
    $("#loginModal").modal("hide");
    $("#registerModal").modal("hide");
  })

