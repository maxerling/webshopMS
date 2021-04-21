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
  /**
   *
   */

   $(".order-button").click(function () {
     if(localStorage.getItem("customer") != null){

      let customer = JSON.parse(localStorage.getItem("customer"));
      createOrder(customer.id);
     
     }else{
       alert("Please login first!")
     }
   
    
  });

  /**
 * Added function to show order modal, remove ls, show info in order modal
 */
function confirmBtn(orderRowData) {
  $("#orderModal").modal("show");

  let date = new Date();
  let orderDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().replaceAll("T", ", Kl: ");
  let orderPrice = localStorage.getItem("totalPrice").replace(".", ":") + " kr";
  let orderNum = orderRowData[0].order.id;

  document.getElementById("p-order").innerHTML =
    "<b>Order nummer: </b>" + orderNum;
  document.getElementById("p-date").innerHTML =
    "<b>Beställningsdatum: </b>" + orderDate.substring(0, 21);
  document.getElementById("p-sum").innerHTML =
    "<b>Total belopp: </b>" + orderPrice;
  localStorage.removeItem("cart");
}
 
 function createOrder(customerId){
 let total = localStorage.getItem("totalPrice");

      let order = {
        date: currentDate(),
        users:{
              "id": customerId
        },
        totalPrice: total,
        status: 0
      };
     fetch('https://hakims-webshop.herokuapp.com/order/add', {
        method: 'POST',
        body: JSON.stringify(order),
        headers:{
            "Content-Type": "application/json"
        } 
    })
    .then(function (res) {
       return res.json(); })
      .then(function(order){
        let orderId = order.id 
        createOrderRow(orderId)
      })
    .catch(function (error) {
      console.log(error);
    });

  }

  function createOrderRow(orderId) {
    let orderRowItems = [];
    for (let i = 0; i < cartItems.length; i++) {
      let orderRow = {
        order: {
          id: orderId,
        },
        product: {
          id: cartItems[i].id,
        },
        quantity: cartItems[i].quantity,
        status: 1,
      };
      orderRowItems.push(orderRow);
    }
    fetch("https://hakims-webshop.herokuapp.com/orderRow/add/list", {
      method: "POST",
      body: JSON.stringify(orderRowItems),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if(response.status == 200){
          return response.json();
        } else if(response.status == 500 || response.status == 404){
          alert("nånting gick fel!");
        }
      }).then((data)=>{
        confirmBtn(data);
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
      let tempProd = cartItems.filter((item) => {
        return item.id == id;
      })[0];
      if (newValue && Number(newValue) > 0) {
        setNewQuantity(id, newValue);
        $(this).closest(".quantity-td").find("input").val(newValue);
      }
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
              <td>${unitFormatter(data.price)}</td>
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
  }

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
   * Function that gets data from from localstorage
   * and displays it in modal window when users clicks on a product.
   * Uses a for-loop to confirm correct product.
   * @param {number} id gets correct id of product and compares to products in i cart.
   */
  function getDataForModalFromLS(id) {
    let data;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id == id) {
        data = cartItems[i];
      }
    }

    $("#modal-left-space").html(
      `<img id="modal-prod-img" src="${data.image}" alt="Product image">`
    );
    $("#prod-title").text(`${data.title}`);
    $("#prod-descr").text(`${data.description}`);
    $("#prod-brand").text(`${data.brand}`);
    $("#prod-units").text(`${data.units}`);
    $("#prod-price").text(`${data.price.toFixed(2)} SEK`);
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
    setOrderButtonStatus();
  });

  function setOrderButtonStatus() {
    if(cartItems.length != 0 && localStorage.getItem("customer") != null) {
      $(".order-button")
      .prop("disabled", false)
      .text("Beställ")
      .removeClass("disabled-order-button"); 
    } else {
      $(".order-button")
      .prop("disabled", true)
      .text(localStorage.getItem("customer") != null ? "Kundvagnen är tom" : "Logga in")
      .addClass("disabled-order-button"); 
    }
  }

  /**
   * Listeners that displays and closes modal window of specific product
   * when user clicks image or title of product.
   */
  $(document).on("click", ".td-title", function () {
    if (window.innerWidth < 576) {
      let id = Number($(this).closest(".quantity-tr").attr("id"));
      getDataForModalFromLS(id);
      $(".cart-modal").modal("show");
    }
  });

  $(document).on("click", ".cart-image", function () {
    if (window.innerWidth >= 576) {
      let id = Number($(this).closest(".quantity-tr").attr("id"));
      getDataForModalFromLS(id);
      $(".cart-modal").modal("show");
    }
  });

  $(".modal-btn-close").click(function () {
    $(".cart-modal").modal("hide");
  });

function loadCustomerInfo() {
  $("#customer-cart-info").hide();
  $(".person-content-title").hide();
  $(".order-button")
  .prop("disabled", true)
  .text("Logga in")
  .addClass("disabled-order-button");

  if(localStorage.getItem("customer")) {
    $(".order-button")
    .prop("disabled", false)
    .text("Beställ")
    .removeClass("disabled-order-button");

    $(".person-content-title").show();
    $("#customer-cart-info").show();
    let temp = JSON.parse(localStorage.getItem("customer"));
    console.log(temp.firstname);
    $("#customer-information-name").val(temp.firstname + " " + temp.lastname);
    $("#customer-information-address").val(temp.address.street);
    $("#customer-information-zip").val(temp.address.zipcode + ", " + temp.address.city);
    $("#customer-information-telephone-number").val(temp.number);
  }
}

function currentDate() {

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + '/' + mm + '/' + dd;
   console.log(today);
  
  // let today1 = Date.now()
  // console.log(today1)
  return today;
  }

  // Runs on page load
  getDataFromLocalStorage();
  calcPrice();  
  $(window).on('load', loadCustomerInfo); 
  $(window).on('load', setOrderButtonStatus);
  
});
