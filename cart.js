/************************GLOBAL VARIABLES********** */
let cartItems = [];
let freeShippingThreshold = 250;
let shippingCost = 49;
let vat = 1.12;

/** *************************document *************************/
$(document).ready(function () {
  /**
   *
   */

  $(".order-button").click(function () {
    if (localStorage.getItem("customer") != null) {
      let customer = JSON.parse(localStorage.getItem("customer"));
      createOrder(customer.id);
    } else {
      alert("Please login first!");
    }
  });

  /**
   * Listener for plus sign button on each item in the cart.
   * Finds id for product and updates elements quantity.
   * Calls function setNewQuantity().
   */
  $(document).on("click", ".fa-plus", function () {
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
    let item = allProducts.find((item) => item.id == id);
    q++;
    let isQuantityEnough = checkQuantity(id) >= q;
    if (isQuantityEnough) {
      setNewQuantity(id, q);
      $(this).closest(".quantity-td").find("input").val(q);
      $(this)
        .closest("tr")
        .find(".cart-table-item-total")
        .html(unitFormatter(item.price * q));
    }
  });

  /**
   * Listener for minus sign button on each item in the cart.
   * Finds id for product and updates elements quantity.
   * If quantity equals 1 trigger button with cart-remove-product class,
   * else calls function setNewQuantity().
   */
  $(document).on("click", ".fa-minus", function () {
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
    let item = allProducts.find((item) => item.id == id);
    if (q === 1) return;
    q--;
    setNewQuantity(id, q);
    $(this).closest(".quantity-td").find("input").val(q);
    $(this)
      .closest("tr")
      .find(".cart-table-item-total")
      .html(unitFormatter(item.price * q));
  });

  /**
   * Listener for trash bin sign button for each item in the cart.
   * Removes items from cart page using function removeFromList().
   */
  $(document).on("click", ".cart-remove-product", function () {
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    $(this).closest(".quantity-tr").remove();
    removeFromList(id);
    setOrderButtonStatus();
  });

  /**
   * Listeners that displays and closes modal window of specific product
   * when user clicks image or title of product.
   */
  $(document).on("click", ".td-title", function () {
    if (window.innerWidth < 576) {
      let id = Number($(this).closest(".quantity-tr").attr("id"));
      loadProductCard(id);
      $(".product-card").modal("show");
    }
  });

  $(document).on("click", ".cart-image", function () {
    if (window.innerWidth >= 576) {
      let id = Number($(this).closest(".quantity-tr").attr("id"));
      loadProductCard(id);
      $(".product-card").modal("show");
    }
  });

  $(".modal-btn-close").click(function () {
    $(".product-card").modal("hide");
  });

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
    location.href = "index.html";
  });
  $("#orderModal").modal({ backdrop: "static", keyboard: false });

  // MODAL SKAPA KONTO BUTTON
  $(document).on("click", ".register-new-user-button", function () {
    $(".login-modal").modal("hide");
    $(".register-modal").modal("show");
  });
  $(document).on("click", "#mobileLogin", function () {
    $(".login-modal").modal("show");
  });

  $(document).on("click", ".modal-cancel-button", function () {
    $("#loginModal").modal("hide");
    $("#registerModal").modal("hide");
    $("#orderModal").modal("hide");
  });
});

/********************************Runs on page load******************************************** */
getDataFromLocalStorage();
calcPrice();
$(window).on("load", loadCustomerInfo);
$(window).on("load", setOrderButtonStatus);
/*********************ALL FUNCTIONS**************************************** */
/**
 *
 */
function loadCustomerInfo() {
  if (localStorage.getItem("customer")) {
    $(".customer-information").show();
    $(".order-button").prop("disabled", false).text("Beställ").removeClass("disabled-order-button");

    let temp = JSON.parse(localStorage.getItem("customer"));
    $("#customer-information-name").val(temp.firstName + " " + temp.lastName);
    $("#customer-information-address").val(temp.address.street);
    $("#customer-information-zip").val(temp.address.zipcode + ", " + temp.address.city);
    $("#customer-information-telephone-number").val(temp.number);
  }
}

/**
 *  Fetches data as an array with JSON object from local storage
 *  Appends html-elements using function htmlGenerator that creates html.
 */
function getDataFromLocalStorage() {
  if (localStorage.getItem("cart")) {
    let data = localStorage.getItem("cart");
    if (cartItems != null) {
      cartItems = JSON.parse(data);
    }
    for (let i = 0; i < cartItems.length; i++) {
      $(".cart-table").append(htmlGenerator(cartItems[i]));
    }
    checkInputField();
  }
}

/**
 *
 * @param {*} orderRowData Added function to show order modal, remove ls, show info in order modal
 */
function confirmBtn(orderRowData) {
  if (JSON.parse(localStorage.getItem("cart")).length == orderRowData.length) {
    $("#orderModal").modal("show");

    let date = new Date();
    let orderDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .replaceAll("T", ", Kl: ");
    let orderPrice = localStorage.getItem("totalPrice").replace(".", ":") + " kr";
    let orderNum = orderRowData[0].order.id;

    document.getElementById("p-order").innerHTML = "<b>Order nummer: </b>" + orderNum;
    document.getElementById("p-date").innerHTML =
      "<b>Beställningsdatum: </b>" + orderDate.substring(0, 21);
    document.getElementById("p-sum").innerHTML = "<b>Total belopp: </b>" + orderPrice;
    localStorage.removeItem("totalPrice");
  } else {
    let message = `Order ${orderRowData[0].order.id} är mottagen men dessa varor fanns ej i lager:`;
    let cartArray = JSON.parse(localStorage.getItem("cart"));
    for (let i = 0; i < orderRowData.length; i++) {
      for (let j = 0; j < cartArray.length; j++) {
        if (orderRowData[i].product.id == cartArray[j].id) {
          message += `\n${cartArray[j].title}`;
        }
      }
    }
    localStorage.removeItem("totalPrice");
    location.href = "index.html";
    alert(message);
  }
  localStorage.removeItem("cart");
}
/**
 * Creates and order that is sent to the database which
 * responds with an object with information about status
 * @param {*} customerId
 */
function createOrder(customerId) {
  let total = calcPrice();

  let order = {
    date: currentDate(),
    users: {
      id: customerId,
    },
    totalPrice: total,
    status: 0,
  };

  StartCartSpinner();

  fetch("https://hakims-webshop.herokuapp.com/order/add", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(function (res) {
      if (res.status == 200) {
        return res.json();
      } else {
        return res.text();
      }
    })
    .then(function (result) {
      if (result != "The customer does not exist") {
        let orderId = result.id;
        createOrderRow(orderId);
      } else {
        localStorage.removeItem("customer");
        alert("Denna profil har blivit borttagen.\nVänligen skapa nytt konto för att beställa.");
        location.reload();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function StartCartSpinner() {
  $("#orderBtn").hide();
  $("#spinnerBtn").removeClass("d-none");
}

/**
 * Creates orderRows in database for all items customer have in local storage
 * @param {*} orderId
 */
function createOrderRow(orderId) {
  let orderRowItems = [];
  for (let i = 0; i < cartItems.length; i++) {
    let orderRow = {
      order: {
        id: orderId,
      },
      product: {
        id: cartItems[i].id,
        price: cartItems[i].price,
      },
      quantity: cartItems[i].quantity,
      status: 0,
    };
    orderRowItems.push(orderRow);
  }
  fetch("https://hakims-webshop.herokuapp.com/orderRow/add/list", {
    method: "POST",
    body: JSON.stringify(orderRowItems),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then(function (response) {
      if (response.status == 200) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      if (data == "Lagersaldona var mindre i lager än i beställningen") {
        alert(data);
      } else if ((data == data) == "Produkt data är korrumperad") {
        localStorage.removeItem("cart");
        localStorage.removeItem("totalPrice");
        alert(data);
        location.href = "index.html";
      } else {
        confirmBtn(data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
// /**
//  * Listener for input fields in cart that checks if value is positive.
//  * If not it resets the old value.
//  */
function checkInputField() {
  $(".amount-changed").on("keyup change", function () {
    let newValue = Number(this.value.match(/^\d+$/));
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    let inStock = checkQuantity(id);
    let item = allProducts.find((item) => item.id == id);

    if (newValue == 0) {
      setNewQuantity(id, 1);
      $(this).closest(".quantity-td").find("input").val(1);
      newValue = 1;
      $(this)
        .closest("tr")
        .find(".cart-table-item-total")
        .html(unitFormatter(item.price * newValue));
    } else if (newValue <= 99 && inStock >= newValue) {
      setNewQuantity(id, newValue);
      $(this).closest(".quantity-td").find("input").val(newValue);
      $(this)
        .closest("tr")
        .find(".cart-table-item-total")
        .html(unitFormatter(item.price * newValue));
    } else if (inStock <= 99) {
      setNewQuantity(id, inStock);
      $(this).closest(".quantity-td").find("input").val(inStock);
      newValue = inStock;
      $(this)
        .closest("tr")
        .find(".cart-table-item-total")
        .html(unitFormatter(item.price * newValue));
      alert("Aktuella lagersaldot för denna produkt är: " + inStock);
    } else {
      setNewQuantity(id, checkQuantity(id));
      newValue = 99;
      $(this).closest(".quantity-td").find("input").val(99);
      $(this)
        .closest("tr")
        .find(".cart-table-item-total")
        .html(unitFormatter(item.price * newValue));
      alert(
        "Högsta kvantitet man kan beställa online är 99.\nFör större kvantitet kontakta butiken."
      );
    }
  });
}
/**
 * Checks what the current quantity status if for a specific product
 * @param {*} id of the product that is to be checked
 * @returns
 */
function checkQuantity(id) {
  for (p of allProducts) {
    if (p.id == id) {
      return p.quantity;
    }
  }
}

/**
 * Function that creates html table.
 * @param {object} data recieved from function getDataFromLocalStorage()
 * @returns a string
 */
function htmlGenerator(data) {
  return `
  <tr class="quantity-tr" id="${data.id}">
              <td><img class="d-sm-block d-none cart-image" src="${
                data.image
              }" alt="" style="width: 60px;"></td>
              <td class = "td-title">${data.title}</td>
                <td class="quantity-td d-table-cell justify-content-center">
                  <div class = "row mx-0 px-0">
                    <div align="center" style="margin:auto; display:block;" class="md-remove-one-product col-3 d-none d-sm-block"><i class="fas fa-minus fa-2x"></i></i></div>

                    <input class="amount-changed col-12 col-sm-12 col-md-6" min="1" name="quantity" value="${
                      data.quantity
                    }" type="number" id="cart-quantity">
                    <div align="center" style="margin:auto; display:block;" class="md-add-one-product col-3 d-none d-sm-block"><i class="fas fa-plus fa-2x"></i></div>
                  </div>
                  <div class="row">
                    <div class="sm-remove-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-minus fa-2x mt-2 me-2"></i></div>
                    <div class="sm-add-one-product col-3 col-sm-3 col-md-3 d-block d-sm-none"><i class="fas fa-plus fa-2x mt-2 ms-2"></i></div>
                  </div>
                </td>
              <td>${unitFormatter(data.price)}</td>
              <td class="cart-table-item-total">${unitFormatter(data.price * data.quantity)}</td>
              <td>
                <button class="cart-remove-product"><i class="far fa-trash-alt" class="trash-bin-image"></i></button>
              </td>
            </tr>
  `;
}

/**
 * Function that calculates total price of current cart items.
 * Gets price and quantity from each object in cart.
 * Sets total-price html element to sum calculated.
 */
function calcPrice() {
  let sum = 0;
  for (let i = 0; i < cartItems.length; i++) {
    sum += cartItems[i].price * cartItems[i].quantity;
  }

  $(".products-total-price").html(unitFormatter(sum));

  if (sum > freeShippingThreshold || sum == 0) {
    shippingCost = 0;
  } else {
    shippingCost = 49;
    sum += shippingCost;
  }

  let tempVat = calcVat(sum);

  $(".shipping-cost").html(unitFormatter(shippingCost));
  $(".total-price").html(unitFormatter(sum));
  $(".vat").html(unitFormatter(tempVat));
  localStorage.setItem("totalPrice", sum);
  return sum;
}

/**
 * Calculates VAT for total amount on order
 * @param {*} sum
 * @returns
 */
function calcVat(sum) {
  return sum == 0 ? 0 : sum - sum / vat;
}

/**
 * Function that takes an id and new quantity and sets that element to the new quantity.
 * @param {number} id id of product element of button clicked.
 * @param {number} qty new quantity after button clicked on -/+.
 */
function setNewQuantity(id, qty) {
  for (let i = 0; i < cartItems.length; i++) {
    if (Number(cartItems[i].id) === id) {
      cartItems[i].quantity = qty;
      $(`#${id}`).closest(".quantity-tr").find("input").attr("value", cartItems[i].quantity);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      break;
    }
  }
  calcPrice();
}

/**
 * Function that removes an object from cartItems array and
 * the corresponding html element.
 * Also updates local storage "cart" array accordingly.
 * Calls function calcPrice() to recalculate total price.
 * @param {number} id of product element of button clicked.
 */
function removeFromList(id) {
  for (let i = 0; i < cartItems.length; i++) {
    if (Number(cartItems[i].id === id)) {
      cartItems.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      break;
    }
  }
  calcPrice();
}

/**
 * Checks if the cart is empty and then disabled the cart button
 * otherwise enables it
 */
function setOrderButtonStatus() {
  if (cartItems.length != 0) {
    $(".order-button").prop("disabled", false).text("Beställ").removeClass("disabled-order-button");
  } else {
    $(".order-button")
      .prop("disabled", true)
      .text("Kundvagnen är tom")
      .addClass("disabled-order-button");
  }
}

/**
 * Return current date as format 2021-04-25
 */
function currentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "/" + mm + "/" + dd;
  return today;
}
