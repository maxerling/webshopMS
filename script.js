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
  const url = "https://hakims-webshop.herokuapp.com/product/get";

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      productsData = data;
      storeData(data);
      loadCategories();
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
  setNumberProduct()
}
/**
 * Map data to createCategory function.
 * @param {object} data - Result of taking JSON as input and
 *  parsing it to produce a JS object
 */
function loadCategories() {
  fetch("https://hakims-webshop.herokuapp.com/category/get")
    .then((resp) => resp.json())
    .then((data) => {
      createCategory(data);
    });
}
/**
 * Create element base on category name.
 * @param {string} category . All of categories
 */
function createCategory(categories) {
  categories.map((item) => {
    let li = document.createElement("li");
    li.setAttribute("class", "nav-item");

    category = categoryFormatter(item.name);
    let div = document.createElement("a");
    div.setAttribute("class", "cat h4 nav-link");
    div.id = "cat" + item.id;
    div.innerText = category;

    li.appendChild(div);
    document.querySelector(".navbar-nav").appendChild(li);
  });
  categoryLinkListener();
}
/**
 * Add category function when you press element.
 */
function categoryLinkListener() {
  document.querySelectorAll(".cat").forEach((item) => {
    item.addEventListener("click", function (event) {
      let target = event.target;
      catId = target.id;
      cat = target.innerText;
      if(cat == "DAGENS HAKIMS DEAL"){
        cat = "Populär";
        catId = "cat1";
      }
      
      // cat = categoryOrignalFormatter(cat);
      products.innerHTML = "";
      $("#sidebar").animate({ left: "-200" }, "slow");

      let productsCat = [];
      productsData.map((product) => {
        product.category.map((item) => {
          if (item.id == catId.substr(3, catId.length)) {
            productsCat.push(product);
          }
        });
      });
      storeData(productsCat);
    });
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
  div.id = product.id;

  const img = createNode("img");
  addClass(img, "mb-4");
  addClass(img, "product-hover");
  $(img).click(() => {
    loadProductCard(`${product.id}`, products);
  });
  const p1 = createNode("p");
  const p2 = createNode("p");
  const p3 = createNode("p");
  const p4 = createNode("p");
  addClass(p4, "qyt-error")
  const btn = createNode("button");
  const quantityInput = createNode("input");
  addClass(quantityInput, "");
  const plusBtn = createNode("button");
  const minusBtn = createNode("button");
  const valueChanger = createNode("div");
  addClass(btn, "btn-primary");
  addClass(btn, "btn");
  addClass(btn, "btn-product");
  quantityInput.type = "tel";
  quantityInput.id = "number"+ product.id;
  addClass(quantityInput, "quantityInput")
  quantityInput.min = 0;
  quantityInput.setAttribute("pattern", "[0-9]+");
  addClass(quantityInput, "text-center");
  plusBtn.innerHTML = "+";
  minusBtn.innerHTML = "-";
  addClassesToQuantityButton(plusBtn);
  addClassesToQuantityButton(minusBtn);

  appendToDiv(
    product,
    img,
    p1,
    p2,
    p3,
    p4,
    btn,
    quantityInput,
    plusBtn,
    minusBtn,
    div,
    valueChanger
  );

  if (product.quantity == 0) {
    $(btn).attr("disabled", "disabled");
    $(btn).html("Slut i lager");
    $(p1).attr("style", "color:gray;");
    $(p2).attr("style", "color:gray;");
    $(p3).attr("style", "color:gray;");
    removeClass(img, "product-hover");
  }else{
    $(btn).click(() => {
      valueChanger.style.display = "block";
      btn.style.display = "none";
      
      quantityInput.value = 1;
      addToCart(`${product.id}`, products);
      
      let idSearchProduct = '#ns' + product.id
      let btnSearchProduct= '#ps' + product.id + ' .btn-search-product'
      $(idSearchProduct ).val(quantityInput.value)
      $(idSearchProduct).parent().show()
      $(btnSearchProduct).hide()

      updateCartBtnQtn();
      disableOrEnableCartButton();
    });
  }
  quantityInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]+/, "");
    let inputValue = e.target.value;
    if (Number(inputValue) >= 0 && Number(inputValue <= product.quantity)) {
      p4.style.display = "none";
      quantityInput.setCustomValidity("");
      setTimeout(() => {
        cartArray = JSON.parse(localStorage.getItem("cart"));
        cartArray.forEach((cartItem, i) => {
          if (cartItem.id === product.id) {
            if ((inputValue == "0") & (inputValue != "")) {
              cartItem.quantity = 0;
              cartArray.splice(i, 1);
              valueChanger.style.display = "none";
              btn.style.display = "inline-block";
            } else {
              if (inputValue != "") {
                cartItem.quantity = Number(inputValue);
              }
            }
          }
        });

        let idNmberSearchProduct = '#ns' + product.id
        $(idNmberSearchProduct).val(inputValue)

        addProductIfDontExist(cartArray, product.id, inputValue);
        updateCartBtnQtn();
        disableOrEnableCartButton();
      }, 500);
    } else {
      quantityInput.setCustomValidity(
        "Tyvärr har vi inte så många produkter i lager"
      );
      p4.style.display = "inline-block";
    }
  });

  quantityInput.addEventListener("focusout", (e) => {
     focusOutNumber(e,product.id)
  });

//################ number product Card#####################
  plusBtn.addEventListener("click", (e) => {
    plusButton(e, product);

    let idNmberSearchProduct = '#ns' + product.id
    $(idNmberSearchProduct).val(quantityInput.value)
  });

  minusBtn.addEventListener("click", (e) => {
    minusButton(e, product);
    let idNmberSearchProduct = '#ns' + product.id
    $(idNmberSearchProduct).val(quantityInput.value)
  });

  // setNumberProduct()
}
/**
 * 
 * @param {*} e 
 * @param {*} product 
 */
function plusButton(e, product){
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  let field = e.target.parentNode.querySelector("input[type=tel]");
  let p4 = e.target.parentNode.parentNode.querySelector(".qyt-error")

  if (Number(field.value) + 1 <= product.quantity) {
    p4.style.display = "none";
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
}
/**
 * 
 * @param {*} e 
 * @param {*} product 
 */
function minusButton(e, product){
 let field = e.target.parentNode.querySelector("input[type=tel]");
 let p4 = e.target.parentNode.parentNode.querySelector(".qyt-error")
   if (Number(field.value) - 1 >= 0) {
     if (Number(field.value) - 1 <= product.quantity) {
       p4.style.display = "none";
       field.setCustomValidity("");
     }

     field.value = Number(field.value) - 1;
     cartArray = JSON.parse(localStorage.getItem("cart"));
     cartArray.forEach((cartItem, i) => {
       if (cartItem.id === product.id) {
         cartItem.quantity = Number(field.value);
         if (cartItem.quantity == 0) {
           cartArray.splice(i, 1);
         }
       }
     });

     localStorage.setItem("cart", JSON.stringify(cartArray));
     updateCartBtnQtn();
     disableOrEnableCartButton();
   }
}
/**
 * 
 * @param {*} e 
 * @param {*} id 
 */
function focusOutNumber(e,id){
  // let cartArray = JSON.parse(localStorage.getItem("cart"))
  let inputValue = e.target.value;
  if (inputValue == "") {
    cartArray.forEach((cartItem, i) => {
      if (cartItem.id === id) {
        cartItem.quantity = 0;
        cartArray.splice(i, 1);
        
        let idNumberProduct= '#number' + id
        let btnProduct = '#' + id + ' .btn-product'
        $(idNumberProduct).parent().hide()
        $(btnProduct).show()

        
        let idSearchProduct = '#ns' + id
        let btnSearchProduct= '#ps' + id + ' .btn-search-product'
        $(idSearchProduct).parent().hide()
        $(btnSearchProduct).show()
      }
    });
    localStorage.setItem("cart", JSON.stringify(cartArray));
    updateCartBtnQtn();
    disableOrEnableCartButton();
  }

}
//################### End number product Card #################

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
 * 
 * @param {*} cartArray 
 * @param {*} productid 
 * @returns 
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

/**
 * 
 * @param {*} btn 
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
 * @param {element} p4
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
  p4,
  btn,
  quantityInput,
  plusBtn,
  minusBtn,
  div,
  valueChanger
) {
  img.src = product.image;

  p1.innerHTML = unitFormatter(product.price);
  p2.innerHTML = product.title;
  p3.innerHTML = `${product.brand} | ${unitFormatter(product.unit)}`;
  p4.innerHTML = "Tyvärr har vi inte så många produkter i lager";
  p4.style = "color:red;";
  p4.style.display = "none";
  btn.innerHTML = "Köp";
  addClass(valueChanger, "value-changer");
  append(div, img);
  append(div, p1);
  append(div, p2);
  append(div, p3);
  append(div, p4);
  append(div, btn);
  append(valueChanger, minusBtn);
  append(valueChanger, quantityInput);
  append(valueChanger, plusBtn);
  append(div, valueChanger);
  valueChanger.style.display = "none";
  append(products, div);
}

/**
 * Formatting units and prices based on PO request
 * @param {*} format 
 * @returns 
 */
function unitFormatter(format) {
  if (typeof format === "number") {
    return format.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace('.', ':') + ' kr';
  } else {
    const spaceIndex = format.toString().indexOf(" ");
    const value = Number(format.slice(0, spaceIndex));
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + format.slice(spaceIndex);
  }
}

/**
 * 
 * @param {*} price 
 * @param {*} unit 
 * @returns 
 */
function getJmfPrice(price, unit) {
    const spaceIndex = unit.toString().indexOf(" ");
    const unitValue = Number(unit.slice(0, spaceIndex));
    const outUnit = unit.slice(spaceIndex + 1) == "g" ? "kg" : "l";
    return (price / unitValue * 1000).toFixed(2).replace('.', ':') + " kr/" + outUnit;
}

/**
 * 
 */
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

/*
  PETA IN INFORAMTION TILL ORDER.HTML
*/

/**
 * Disables cart button if the cartArray is empty or null else it will rederict to order.html
 */

/**
 * 
 */
function disableOrEnableCartButton() {
  if (localStorage.getItem("cart") != null) {
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
}

/**
 * 
 */
function loginButton() {
  let customer = JSON.parse(localStorage.getItem("customer"));
  const logInBtn = document.getElementById("logIn");
  const userIcon = document.querySelector(".userLoggedIn");
  const customerName = document.querySelector("#customer-name ");

  if (customer != null) {
    document.querySelector("#mobileLogin").style.display = "none";

    logInBtn.style.display = "none";
    customerName.innerText = customer.firstname;
    userIcon.style.display = "block";
  }
}

/**
 * Displays it in modal window when users clicks on a product.
 * Uses a for-loop to confirm correct product.
 * @param {number} itemID gets correct id of product and compares to products in i cart.
 */
function loadProductCard(itemID) {
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  let item = allProducts.find((item) => item.id == itemID);
  if (item != undefined) {
    $(".product-card-title").text(item.title);
    $(".product-card-desc").text(item.description);
    $(".product-card-img").attr("src", item.image);
    $(".card-modal").modal("show");
    $(".product-specs").text(`${item.brand} | ${unitFormatter(item.unit)}`);
    $(".product-price").text("Pris: " + unitFormatter(item.price));
    $(".product-jmf-price").text("Jämförpris: " + getJmfPrice(item.price, item.unit));
    $(".product-warehouse-quantity").text("Antal kvar: " + (item.quantity > 100 ? "100+" : item.quantity) + " st");
  }
}

/**
 * 
 */
function setNumberProduct(){
      let cartArray=[]
      if(JSON.parse(localStorage.getItem("cart"))==null){
          $('.value-changer').hide()
      }else{
        cartArray = JSON.parse(localStorage.getItem("cart"));
        cartArray.map(item => {
              let id = '#number' + item.id
              let btn = '#' + item.id + ' .btn-product'
              if( $(id) != undefined ){
                  $(id).val(item.quantity)
                  $(btn).hide()
                  $(id).parent().show()
              }
          })
        }
}