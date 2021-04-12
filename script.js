$(document).ready(function () {
  getData();
});

window.addEventListener("load", function () {
  loginButton();
  disableOrEnableCartButton();
  updateCartBtnQtn();
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
  $(img).click(() => {
      btnEventHandler(`${product.id}`, products);
    });
  const p1 = createNode("p");
  const p2 = createNode("p");
  const p3 = createNode("p");
  const btn = createNode("button");
  const quantityInput = createNode("input");
  addClass(quantityInput, "");
  const plusBtn = createNode("button");
  const minusBtn = createNode("button");
  const valueChanger = createNode("div");
  addClass(btn, "btn-primary");
  addClass(btn, "btn");
  quantityInput.type = "tel";
  quantityInput.id = "quantityInput";
  quantityInput.min = 0;
  quantityInput.setAttribute("pattern", "[0-9]+");
  addClass(quantityInput, "text-center");
  plusBtn.innerHTML = "+";
  minusBtn.innerHTML = "-";
  addClassesToQuantityButton(plusBtn);
  addClassesToQuantityButton(minusBtn);

  if (cat == "produkter") {
    appendToDiv(
      product,
      img,
      p1,
      p2,
      p3,
      btn,
      quantityInput,
      plusBtn,
      minusBtn,
      div,
      valueChanger
    );
  } else if (cat == product.category) {
    appendToDiv(
      product,
      img,
      p1,
      p2,
      p3,
      btn,
      quantityInput,
      plusBtn,
      minusBtn,
      div,
      valueChanger
    );
  }

  let cartArray = JSON.parse(localStorage.getItem("cart"));
  const cartProduct = cartArray.find((element) => element.id === product.id);
  if (product.quantity == 0) {
    $(btn).attr("disabled", "disabled");
    $(btn).html("Slut i lager");
    $(p1).attr("style", "color:gray;");
    $(p2).attr("style", "color:gray;");
    $(p3).attr("style", "color:gray;");
    removeClass(img, "product-hover");
  } else {
    $(btn).click(() => {
      valueChanger.style.display = "block";
      btn.style.display = "none";

      if (
        cartProduct != undefined &&
        cartProduct.quantity + 1 <= product.quantity
      ) {
        quantityInput.value = cartProduct.quantity + 1;
        addToCart(`${product.id}`, products);
      } else if (cartProduct != undefined && cartProduct.quantity > 0) {
        quantityInput.value = cartProduct.quantity;
      } else {
        quantityInput.value = 1;
        addToCart(`${product.id}`, products);
      }

      updateCartBtnQtn();
      disableOrEnableCartButton();
    });
  }

  plusBtn.addEventListener("click", () => {
    let field = plusBtn.parentNode.querySelector("input[type=tel]");
    if (Number(field.value) + 1 <= product.quantity) {
      field.value = Number(field.value) + 1;
      cartArray = JSON.parse(localStorage.getItem("cart"));
      cartArray.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          cartItem.quantity = Number(field.value);
        }
      });

      addProductIfDontExist(cartArray, product.id, field.value);
      updateCartBtnQtn();
      disableOrEnableCartButton();
    }
  });

  minusBtn.addEventListener("click", () => {
    let field = minusBtn.parentNode.querySelector("input[type=tel]");
    if (Number(field.value) - 1 >= 0) {
      field.value = Number(field.value) - 1;
      cartArray = JSON.parse(localStorage.getItem("cart"));
      cartArray.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          cartItem.quantity = Number(field.value);
        }
      });

      localStorage.setItem("cart", JSON.stringify(cartArray));
      updateCartBtnQtn();
      disableOrEnableCartButton();
    }
  });

  quantityInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]+/, "");
    let inputValue = e.target.value;
    if (Number(inputValue) >= 0 && Number(inputValue <= product.quantity)) {
      quantityInput.setCustomValidity("");
      setTimeout(() => {
        cartArray = JSON.parse(localStorage.getItem("cart"));
        cartArray.forEach((cartItem) => {
          if (cartItem.id === product.id) {
            if (
              inputValue.length == 0 ||
              inputValue == null ||
              inputValue == "0"
            ) {
              cartItem.quantity = 0;
            } else {
              cartItem.quantity = Number(inputValue);
            }
          }
        });

        addProductIfDontExist(cartArray, product.id, inputValue);
        updateCartBtnQtn();
        disableOrEnableCartButton();
      }, 700);
    } else {
      quantityInput.setCustomValidity("Kvantitet ej tillgänlig!");
    }
  });
}

/**
 * Checks if product exist in cart by comparing with AllProducts array.
 *
 * @param {array} cartArray
 * @param {number} productid
 * @param {string} inputValue - value from input[type="tel"]
 */

function addProductIfDontExist(cartArray, productid, inputValue) {
  if (!findMatch(cartArray, productid)) {
    let allProducts = JSON.parse(localStorage.getItem("allProducts"));
    let productThatWillBeAdded = allProducts.find(
      (ele) => ele.id === productid
    );
    productThatWillBeAdded.quantity = Number(inputValue);
    cartArray.push(productThatWillBeAdded);
  }
  cartArray = cartArray.filter((item) => item.quantity > 0);

  localStorage.setItem("cart", JSON.stringify(cartArray));
}


/**
 * Checks if cartArray match with productid
 * returns boolean
 */

function findMatch(cartArray, productid) {
  let i,
    match = false;

  for (i = 0; i < cartArray.length; i++) {
    if (cartArray[i].id == productid) {
      match = true;
      break;
    }
  }

  return match;
}

/*
 * adds style to button quantity
 * @param {element} btn
 */
function addClassesToQuantityButton(btn) {
  addClass(btn, "m-2");
  addClass(btn, "quantity-value-changer");
}

/**
 * Add all the elements to a "main" div
 * @param {object} product
 * @param {element} img
 * @param {element} p1
 * @param {element} p2
 * @param {element} p3
 * @param {element} btn
 * @param {element} quantityInput
 * @param {element} plusBtn
 * @param {element} minusBtn
 * @param {element} div
 * @param {element} div
 */

function appendToDiv(
  product,
  img,
  p1,
  p2,
  p3,
  btn,
  quantityInput,
  plusBtn,
  minusBtn,
  div,
  valueChanger
) {
  img.src = product.image;
  p1.innerHTML = `${product.price} kr`;
  p2.innerHTML = product.title;
  p3.innerHTML = `${product.brand} | ${product.units}`;
  btn.innerHTML = "Köp";
  addClass(valueChanger, "value-changer");
  append(div, img);
  append(div, p1);
  append(div, p2);
  append(div, p3);
  append(div, btn);
  append(valueChanger, minusBtn);
  append(valueChanger, quantityInput);
  append(valueChanger, plusBtn);
  append(div, valueChanger);
  valueChanger.style.display = "none";
  append(products, div);
}

function updateCartBtnQtn() {
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  const btn = document.getElementById("cart");
  const mobileCartBtn = document.getElementById("btnGroupDrop1");
  if (cartArray != null && cartArray.length > 0) {
    let sum = 0;
    for (let i = 0; i < cartArray.length; i++) {
      sum += 1 * cartArray[i].quantity;
    }

    btn.innerHTML = `<i class="fas fa-shopping-cart"></i> Antal produkter: ${sum}`;
    mobileCartBtn.innerHTML = `${sum}`;
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

$(document).on("click", ".card-modal-cancel-button", function () {
  $(".card-modal").modal("hide");
});

// MODAL SKAPA KONTO BUTTON
$(document).on("click", ".register-new-user-button", function () {
  $(".login-modal").modal("hide");
  $(".register-modal").modal("show");
});
$(document).on("click", "#mobileLogin", function () {
  $(".login-modal").modal("show");
});

/**
 * Disables cart button if the cartArray is empty or null else it will rederict to order.html
 */

function disableOrEnableCartButton() {
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  cartArray = cartArray.filter((product) => product.quantity > 0);
  const cartBtn = document.getElementById("cart");
  const mobileCartBtn = document.getElementById("btnGroupDrop1");
  if (cartArray == null || cartArray.length == 0) {
    cartBtn.disabled = true;
    mobileCartBtn.disabled = true;
    cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i>
      Kundvagn`;
    mobileCartBtn.innerHTML = "";
  } else {
    cartBtn.disabled = false;
    cartBtn.addEventListener("click", () => {
      window.location.href = "order.html";
    });

    mobileCartBtn.disabled = false;
    mobileCartBtn.addEventListener("click", () => {
      window.location.href = "order.html";
    });
  }
}
function loginButton() {
  let customer = JSON.parse(localStorage.getItem("customer"));
  const logInBtn = document.getElementById("logIn");
  const userIcon = document.querySelector(".userLoggedIn");
  const customerName = document.querySelector("#customer-name ");

  if (customer != null) {
    document.querySelector("#mobileLogin").style.display = "none";

    logInBtn.style.display = "none";
    customerName.innerText = customer.name.firstName;
    userIcon.style.display = "block";
  }
}

function btnEventHandler(itemID) {
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  let item = allProducts.find((item) => item.id == itemID);
  if (item != undefined) {
    $(".product-card-title").text(item.title);
    $(".product-card-desc").text(item.description);
    $(".product-card-img").attr("src", item.image);
    $(".card-modal").modal("show");
    $(".product-specs").text(`${item.brand} | ${item.units}`);
    $(".product-price").text("Pris: " + item.price + " kr");
  }
}

