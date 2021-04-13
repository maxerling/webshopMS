$(document).ready(function () {
  let cartItems = [];
  let freeShippingThreshold = 250;
  let shippingCost = 49;
  let vat = 1.12;
  /**
   *  Fetches data as an array with JSON object from local storage
   *  Appends html-elements using function htmlGenerator that creates html.
   */
  function getDataFromLocalStorage() {
    let data = localStorage.getItem("cart");
    if (cartItems != null) {
      cartItems = JSON.parse(data);
    }
    for (let i = 0; i < cartItems.length; i++) {
      $(".cart-table").append(htmlGenerator(cartItems[i]));
    }
    checkInputField();
  }

  // /**
  //  * Listener for input fields in cart that checks if value is positive.
  //  * If not it resets the old value.
  //  */
  function checkInputField() {
    $(".amount-changed").on("keyup change", function () {
      let newValue = Number(this.value.match(/^\d+$/));
      let id = Number($(this).closest(".quantity-tr").attr("id"));
      let tempProd = cartItems.filter((item) => {
        return item.id == id;
      })[0];
      if (newValue && Number(newValue) > 0) {
        setNewQuantity(id, newValue);
        $(this).closest(".quantity-td").find("input").val(newValue);
      }
      // if (Number($(this).val()) === 0) {
      //   $(this).val(tempProd.quantity);
      // }
    });
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
              <td>${data.price.toFixed(2)}</td>
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
    $("#total-price").html(sum.toFixed(2));
    $(".products-total-price").html(sum.toFixed(2));
    calcVat(sum);

    if (sum > freeShippingThreshold) {
      $(".total-price").html(sum.toFixed(2));
    } else {
      sum += shippingCost;
      $(".total-price").html(sum.toFixed(2));
    }
  }

  function calcVat(sum) {
    let temp;
    if (sum > freeShippingThreshold) {
      temp = sum - sum / vat;
      console.log("SUMMA UTAN FRAKT");
    } else {
      temp = sum - sum / vat + shippingCost - shippingCost / vat;
      console.log("SUMMPA MED FRAKT");
    }

    $(".vat").html(temp.toFixed(2));
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
        $(`#${id}`)
          .closest(".quantity-tr")
          .find("input")
          .attr("value", cartItems[i].quantity);
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
   * Listener for plus sign button on each item in the cart.
   * Finds id for product and updates elements quantity.
   * Calls function setNewQuantity().
   */
  $(document).on("click", ".fa-plus", function () {
    let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    q++;
    console.log(q);
    setNewQuantity(id, q);
    $(this).closest(".quantity-td").find("input").val(q);
  });

  /**
   * Listener for minus sign button on each item in the cart.
   * Finds id for product and updates elements quantity.
   * If quantity equals 1 trigger button with cart-remove-product class,
   * else calls function setNewQuantity().
   */
  $(document).on("click", ".fa-minus", function () {
    let q = Number($(this).closest(".quantity-td").find("input").attr("value"));
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    if (q === 1) return;

    q--;
    setNewQuantity(id, q);
    $(this).closest(".quantity-td").find("input").val(q);
  });

  /**
   * Listener for trash bin sign button for each item in the cart.
   * Removes items from cart page using function removeFromList().
   */
  $(document).on("click", ".cart-remove-product", function () {
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    $(this).closest(".quantity-tr").remove();
    removeFromList(id);
  });

  // <h5 class="title"><span class="prod-title">Title</span></h5>

  // <p>Description: <span id="prod-descr"></span></span></p>
  // <p>Brand: <span id="prod-brand"></span></span></p>
  // <p>Units: <span id="prod-units"></span></p>
  // <p>Price: <span id="prod-price"></span></p>

  function getDataForModalFromLS(id) {
    let data;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id == id) {
        data = cartItems[i];
      }
    }
    console.log(data);

    $("#modal-prod-img").html(
      `<img id="modal-prod-img" src="${data.image}" alt="Product image"></img>}`
    );
    $("#prod-title").text(`${data.title}`);
    $("#prod-descr").text(`${data.description}`);
    $("#prod-brand").text(`${data.brand}`);
    $("#prod-units").text(`${data.units}`);
    $("#prod-price").text(`${data.price}`);
  }

  $(document).on("click", ".cart-image, .td-title", function () {
    let id = Number($(this).closest(".quantity-tr").attr("id"));
    getDataForModalFromLS(id);
    $(".cart-modal").modal("show");
  });
  $(".modal-btn-close").click(function () {
    $(".cart-modal").modal("hide");
  });
  $(".modal-btn-ok").click(function () {
    $(".cart-modal").modal("hide");
  });
  // Runs on page load.
  getDataFromLocalStorage();
  calcPrice();
});
