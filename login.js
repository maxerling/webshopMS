/*Global variable for save customer to array list*/
let customers = getCustomers();
const form = document.getElementById("form");
const emailField = document.getElementById("input-username");
const passField = document.getElementById("input-password");
const invalidMsg = document.getElementsByClassName("invalid-feedback");
let msg = "";
/**
 * fetch all users for check login form!
 */
function getCustomers() {
  fetch(`data\\users.json`) // https://hakims-webshop.herokuapp.com/user/get
    .then((resp) => resp.json())
    .then((data) => {
      customers = data;
    })
    .catch((err) => console.log(err));
}


/**
 * Checks for a valid email and show error message based on result
 * @returns boolean
 */
function checkEmail1() {

  if (emailField.value.length == 0) {
    msg = "Obligatoriskt fält!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    addClass(emailField, "is-invalid");
    return false;
  } else if (!emailCheck(emailField.value)) {
    msg = "Giltig e-post krävs!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    addClass(emailField, "is-invalid");
    return false;
  } else if (emailCheck(emailField.value)) {
    msg = "";

    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "none";
    removeClass(emailField, "is-invalid");
    addClass(emailField, "is-valid");

    return true;
  }
}

/**
 * Checks for a valid pass and show error message based on result
 * @returns boolean
 */

function checkPassword1() {
  if (passField.value.length == 0) {
    msg = "Obligatoriskt fält!";
    invalidMsg[1].innerHTML = msg;
    invalidMsg[1].style.display = "block";
    addClass(passField, "is-invalid");
    return false;
  } else {
    msg = "";
    invalidMsg[1].innerHTML = msg;
    invalidMsg[1].style.display = "none";
    removeClass(passField, "is-invalid");
    addClass(passField, "is-valid");
    return true;
  }
}

/**
 * checks for valid input based on regex
 * @param {string} userInput
 * @returns boolean
 */
function emailCheck(userInput) {
  let regEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  return userInput.match(regEx) ? true : false;
}

/**
 * Function on login button to check customer and admin account and
 * when a user logs in send them to their own  page.
 */
$(document).on("click", "#modal-login-button", function (e) {
  for (msg of invalidMsg) {
    msg.style.color = "red";
    msg.style.fontSize = "1em";
  }
  if (checkEmail1() && checkPassword1()) {
    customers.forEach((customer) => {
      if (
        emailField.value == customer.email &&
        passField.value == customer.password
      ) {
        msg = "";
        invalidMsg[1].innerHTML = msg;
        invalidMsg[0].innerHTML = msg;
        invalidMsg[0].style.display = "none";
        invalidMsg[1].style.display = "none";
        removeClass(emailField, "is-invalid");
        addClass(emailField, "is-valid");
        removeClass(passField, "is-invalid");
        addClass(passField, "is-valid");
        if (customer.accountType == 1) {
        
          this.classList.add("was-validated");
          location.href = "admin-panel/index.html";
        } else if (customer.accountType == 0) {
          localStorage.setItem("customer", JSON.stringify(customer));
          document.querySelector('#logIn').style.display="none"
          document.querySelector('#mobileLogin').style.display="none"
          document.querySelector('#customer-name').innerText= customer.firstname
          document.querySelector('.userLoggedIn').style.display="block"
          $(".login-modal").modal("hide");
          this.classList.add("was-validated");
          location.reload();
        }
      }
    });
  } else {
    e.stopPropagation();
    e.preventDefault();
    msg = "Felaktig e-post eller lösenord!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[1].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    invalidMsg[1].style.display = "block";
    removeClass(emailField, "is-valid");
    removeClass(passField, "is-valid");
    addClass(emailField, "is-invalid");
    addClass(passField, "is-invalid");
  }
});

$(document).on("click","#signOut",function(){
  localStorage.removeItem("customer")

});
