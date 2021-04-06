$(document).ready(function () {
  getData();
  updateCartBtn();
});

window.addEventListener("load", function () {
  cartButton();
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
    .then((data) => {
      productsData = data;
      storeData(data);
      loadCategories(data);
      categoryLinkListener();
    })
    .catch((err) => console.log(err));
}
/**
 * Storing data from fetch, promise into array
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS object
 */
function storeData(data) {
  let cartArray = [];
  if (localStorage.getItem("cart") === null) {
    cartArray = new Array();
  } else {
    cartArray = JSON.parse(localStorage.getItem("cart"));
  }

  localStorage.setItem("allProducts", JSON.stringify(productsData));
  localStorage.setItem("cart", JSON.stringify(cartArray));
  cat = categoryFormatter(cat);
  document.getElementById("category").innerText = cat;
  cat = categoryOrignalFormatter(cat);
  data.forEach((product) => createElementsForProduct(product));
}

/**
 * Map data to createCategory function.
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS object
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
  addClass(img, "product-hover");
  const p1 = createNode("p");
  const p2 = createNode("p");
  const p3 = createNode("p");
  const btn = createNode("button");
  addClass(btn, "btn-primary");
  addClass(btn, "btn");

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

  if (product.quantity == 0) {
    $(btn).attr("disabled", "disabled");
    $(btn).html("Slut i lager");
    $(p1).attr("style", "color:gray;");
    $(p2).attr("style", "color:gray;");
    $(p3).attr("style", "color:gray;");
    removeClass(img, "product-hover");
  } else {
    $(btn).click(() => {
      addToCart(`${product.id}`, products);
      updateCartBtn();
    });
  }
}

function updateCartBtn() {
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  const btn = document.getElementById("cart");
  if (cartArray != null && cartArray.length > 0) {
    let sum = 0;
    for (let i = 0; i < cartArray.length; i++) {
      sum += 1;
    }

    btn.innerHTML = `<i class="fas fa-shopping-cart"></i> Antal produkter: ${sum}`;
  }
}
$(document).on("click", ".modal-cancel-button", function () {
  $("#loginModal").modal("hide");
  $("#registerModal").modal("hide");
  $("#orderModal").modal("hide");
});
/**
 * Create element base on category name.
 * @param {string} category . All of categories
 */
function createCategory(category) {
  category = categoryFormatter(category);
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
 * Formats the text to make it:
 * 1. String[0] Uppercase
 * 2. remove the - and replace it with " och "
 * @param {string} category
 * @returns string
 */

function categoryFormatter(category) {
  category = category.replace(
    category.charAt(0),
    category.charAt(0).toUpperCase()
  );

  category = category.replace("-", " och ");

  return category;
}
/**
 * Added function to show order modal, remove ls, show info in order modal
 */
function confirmBtn() {
  $("#orderModal").modal("show");

  let orderNum;
  let orderDate = new Date().toISOString().replaceAll("T", ", Kl: ");
  let orderPrice;

  document.getElementById("p-order").innerHTML =
    "<b>Order nummer: </b>" + orderNum;
  document.getElementById("p-date").innerHTML =
    "<b>Beställningsdatum: </b>" + orderDate.substring(0, 21);
  document.getElementById("p-sum").innerHTML =
    "<b>Total belopp: </b>" + orderPrice;
  localStorage.removeItem("inCartArray"); //Dubbelkolla key name
}
/**
 * Add category function when you press element.
 */
function categoryLinkListener() {
  document.querySelectorAll(".cat").forEach((item) => {
    item.addEventListener("click", function (event) {
      let target = event.target;
      cat = target.innerText;
      cat = categoryOrignalFormatter(cat);
      products.innerHTML = "";
      $("#sidebar").animate({ left: "-200" }, "slow");
      storeData(productsData);
    });
  });
}

/**
 * Revert back the text to its original form state
 *
 * @param {string} category
 * @returns string
 */

function categoryOrignalFormatter(category) {
  category = category.replace(
    category.charAt(0),
    category.charAt(0).toLowerCase()
  );

  category = category.replace(" och ", "-");

  return category;
}

/*function checkCartStatus() {
  const list = JSON.parse(localStorage.getItem("cart"));
  if (list.length === 0) {
    $("#cart").attr("disabled", "disabled");
    $("cart-btn-link").attr("disabled", "disabled");
  }
}

checkCartStatus();*/

$(document).on("click", "#logIn", function () {
  $(".login-modal").modal("show");
});

$(document).on("click", "#mobileLogin", function () {
  $(".login-modal").modal("show");
});

// MODAL CANCEL BUTTONS
$(document).on("click", ".login-modal-cancel-button", function () {
  $(".login-modal").modal("hide");
});

$(document).on("click", ".register-modal-cancel-button", function () {
  $(".register-modal").modal("hide");
});

$(document).on("click", ".order-modal-cancel-button", function () {
  $(".order-modal").modal("hide");
});

// MODAL SKAPA KONTO BUTTON
$(document).on("click", ".register-new-user-button", function () {
  $(".login-modal").modal("hide");
  $(".register-modal").modal("show");
});
$(document).on("click", "#mobileLogin", function () {
  $(".login-modal").modal("show");
});

/*Global variable for save customer to array list*/
let customers = [];
/**
 * fetch all users for check login form!
 */
function getCustomers() {
  fetch("../../data/users.json")
    .then((resp) => resp.json())
    .then((data) => {
      customers = data;
    })
    .catch((err) => console.log(err));
}
/**
 * Function on login button to check customer and admin account and
 * when a user logs in send them to their own  page.
 */
$(document).on("click", "#modal-login-button", function () {
  getCustomers();

  var username = $("#input-username").val();
  var password = $("#input-password").val();

  console.log(username);
  console.log(password);
  customers.forEach((customer) => {
    if (customer.email == username && customer.password == password) {
      if (customer.accountType == 1) {
        alert(
          "Hello " +
            customer.name.firstName +
            " " +
            customer.name.lastName +
            " ---> you are admin"
        );
        location.href = "/admin-panel/index.html";
      } else if (customer.accountType == 0) {
        alert(
          "Hello " +
            customer.name.firstName +
            " " +
            customer.name.lastName +
            " ---> you are customer"
        );
        localStorage.setItem("customer", JSON.stringify(customer));
        location.href = "profile.html";
      }
    }
  });

  // alert("Please enter correct email and password")
});

/**
 * Disables cart button if the cartArray is empty or null else it will rederict to order.html
 */

function cartButton() {
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  const cartBtn = document.getElementById("cart");
  if (cartArray == null || cartArray.length == 0) {
    cartBtn.disabled = true;
  } else {
    cartBtn.disabled = false;
    cartBtn.addEventListener("click", () => {
      window.location.href = "order.html";
    });
  }
}
