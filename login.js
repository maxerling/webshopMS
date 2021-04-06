const form = document.getElementById("form");
const emailField = document.getElementById("input-username");
const passField = document.getElementById("input-password");
const invalidMsg = document.getElementsByClassName("invalid-feedback");
let msg = "";

form.addEventListener("submit", (e) => {
  for (msg of invalidMsg) {
    msg.style.color = "red";
    msg.style.fontSize = "1em";
  }

  if (checkEmail() & checkPassword() & testValidButDontMatchUser()) {
    console.log("sucess");
  } else {
    console.log("unsucessful");
    e.preventDefault();
    e.stopPropagation();
  }
});

/**
 * Checks for a valid email and show error message based on result
 * @returns boolean
 */
function checkEmail() {
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

function checkPassword() {
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
 * test for a "valid user"
 * @returns boolean
 */
function testValidButDontMatchUser() {
  if (emailField.value == "hh@h.com" && passField.value == "h") {
    msg = "";
    invalidMsg[1].innerHTML = msg;
    invalidMsg[0].innerHTML = msg;
    invalidMsg[0].style.display = "none";
    invalidMsg[1].style.display = "none";
    removeClass(emailField, "is-invalid");
    addClass(emailField, "is-valid");
    removeClass(passField, "is-invalid");
    addClass(passField, "is-valid");
    return true;
  } else {
    if (emailField.value.length > 0 && passField.value.length > 0) {
      console.log("Felaktig e-post eller lösenord!");
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
  }
  return false;
}

/**
 * checks for valid input based on regex 
 * @param {string} userInput 
 * @returns boolean
 */
function emailCheck(userInput) {
  let regEx = /[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/;

  return userInput.match(regEx) ? true : false;
}
