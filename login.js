/*Global variable for save customer to array list*/
const form = document.getElementById("form");
const emailField = document.getElementById("input-username");
const passField = document.getElementById("input-password");
const invalidMsg = document.getElementsByClassName("invalid-feedback");
let msg = "";
$(document).ready(function () {
  loginButton();
  $(document).on("click", "#signOut", function () {
    localStorage.removeItem("customer");
  });
});

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
 * Checks for a valid email and show error message based on result
 * @returns boolean
 */
function checkEmail1() {
  let regPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if (emailField.value.length == 0) {
    msg = "Obligatoriskt fält!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    emailField.classList.add("is-invalid");
    return false;
  } else if (!regPattern.test(emailField.value)) {
    msg = "Giltig e-post krävs!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    emailField.classList.add("is-invalid");
    return false;
  } else {
    msg = "";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "none";
    emailField.classList.remove("is-invalid");
    emailField.classList.add("is-valid");
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
    passField.classList.add("is-invalid");
    return false;
  } else {
    msg = "";
    invalidMsg[1].innerHTML = msg;
    invalidMsg[1].style.display = "none";
    passField.classList.remove("is-invalid");
    passField.classList.add("is-valid");
    return true;
  }
}

$(document).on("click", "#modal-login-button", function (e) {
  // let result =''
  e.preventDefault();

  if (checkEmail1() && checkPassword1()) {
    let user = {
      email: emailField.value,
      password: passField.value,
    };
    fetch(`https://hakims-webshop.herokuapp.com/user/authentication`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else if (res.status == 400) {
          return res.text();
        }
      })
      .then((result) => {
        if (result != "Incorrect USER or PASSWORD") {
          msg = "";
          invalidMsg[1].innerHTML = msg;
          invalidMsg[0].innerHTML = msg;
          invalidMsg[0].style.display = "none";
          invalidMsg[1].style.display = "none";
          emailField.classList.remove("is-invalid");
          emailField.classList.add("is-valid");
          passField.classList.remove("is-invalid");
          passField.classList.add("is-valid");
          if (result.accountType == 1) {
            this.classList.add("was-validated");
            location.href = "admin-panel/index.html";
          } else if (result.accountType == 0) {
            localStorage.setItem("customer", JSON.stringify(result));
            document.querySelector("#logIn").style.display = "none";
            document.querySelector("#mobileLogin").style.display = "none";
            document.querySelector("#customer-name").innerText =
              result.firstname;
            document.querySelector(".userLoggedIn").style.display = "block";
            $(".login-modal").modal("hide");
            this.classList.add("was-validated");
            if (location.href == "http://127.0.0.1:5501/order.html") {
              loadCustomerInfo();
            }
          }
        } else {
          e.stopPropagation();
          msg = "Felaktig e-post eller lösenord!";
          invalidMsg[0].innerHTML = msg;
          invalidMsg[1].innerHTML = msg;
          invalidMsg[0].style.display = "block";
          invalidMsg[1].style.display = "block";
          emailField.classList.remove("is-valid");
          passField.classList.remove("is-valid");
          emailField.classList.add("is-invalid");
          passField.classList.add("is-invalid");
        }
      })
      .catch((err) => console.log(err));
  } else {
    e.stopPropagation();
    msg = "Felaktig e-post eller lösenord!";
    invalidMsg[0].innerHTML = msg;
    invalidMsg[1].innerHTML = msg;
    invalidMsg[0].style.display = "block";
    invalidMsg[1].style.display = "block";
    emailField.classList.remove("is-valid");
    passField.classList.remove("is-valid");
    emailField.classList.add("is-invalid");
    passField.classList.add("is-invalid");
  }
});
