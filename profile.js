// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else if (
          checkValidFirstName() &&
          checkValidLastName() &&
          checkEmail() &&
          //checkPassword() &&
          checkPhone() &&
          checkStreet() &&
          checkOrt() &&
          checkPostNr()
        ) {
          event.preventDefault();
          form.classList.add("was-validated");
          if (event.target.id == "profile-form") {
            $("#confirmationModal").modal("show");
          } else if (event.target.id == "CreateNewAccount-form") {
            createNewUser();
          }
        }
      },
      false
    );
  });
})();
/**
 *
 */
function createNewUser() {
  let user = {
    firstname: $("#validationCustom01").val(),
    lastname: $("#validationCustom02").val(),
    email: $("#validationCustom03").val(),
    password: $("#validationCustom04").val(),
    address: {
      street: $("#validationCustom06").val(),
      city: $("#validationCustom07").val(),
      zipcode: formatZipcodeForDb($("#validationCustom08").val()),
    },
    number: formatPhoneNumberForDb($("#validationCustom05").val()),
    status: 0,
    accountType: 0,
  };
  fetch("https://hakims-webshop.herokuapp.com/user/add", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (res) {
      if (res.status == 200) {
        return res.json();
      } else {
        alert("Mailadressen används redan");
        $(".register-modal").modal("hide");
      }
    })
    .then(function (user) {
      user.status = true;
      localStorage.setItem("customer", JSON.stringify(user));
      document.querySelector("#logIn").style.display = "none";
      document.querySelector("#mobileLogin").style.display = "none";
      document.querySelector("#customer-name").innerText = user.firstname;
      document.querySelector(".userLoggedIn").style.display = "block";
      alert(user.firstname + " har registrerats som ny användare.");
      location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 *
 */
function editUser() {
  let localST = JSON.parse(localStorage.getItem("customer"));
  let user = {
    id: localST.id,
    firstname: $("#validationCustom01").val(),
    lastname: $("#validationCustom02").val(),
    email: $("#validationCustom03").val(),
    password: $("#validationCustom04").val(),
    address: {
      id: localST.address.id,
      street: $("#validationCustom06").val(),
      city: $("#validationCustom07").val(),
      zipcode: formatZipcodeForDb($("#validationCustom08").val()),
    },
    number: formatPhoneNumberForDb($("#validationCustom05").val()),
    status: 0,
    accountType: 0,
  };
  fetch("https://hakims-webshop.herokuapp.com/user/update", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (res) {
      if (res.status == 200) {
        return res.json();
      } else {
        return "user not exists";
      }
    })
    .then(function (user) {
      if (user == "user not exists") {
        localStorage.removeItem("customer");
        location.href = "index.html";
        alert(
          "Profilen har blivit borttagen eller något annat fel har inträffat."
        );
      } else {
        localStorage.setItem("customer", JSON.stringify(user));
        location.reload();
        alert(user.firstname + " har blivit uppdaterat!");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
/**
 * Send request server to delete user
 */
function deleteUser() {
  let localST = JSON.parse(localStorage.getItem("customer"));

  let user = {
    id: localST.id,
    address: {
      id: localST.address.id,
    },
  };
  fetch("https://hakims-webshop.herokuapp.com/user/delete", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (res) {
      if (res.status == 200) {
        localStorage.removeItem("customer");
        alert("You have been deleted");
        window.location.href = "index.html";
      }
      return res.text();
    })
    .then(function (deleteMessage) {
      console.log(deleteMessage); // här kan vi visa en confirm!
    })
    .catch(function (error) {
      console.log(error);
    });
}

// **************** VALIDATE form ********************************

$("#validationCustom01").focusout(function () {
  checkValidFirstName();
});

$("#validationCustom02").focusout(function () {
  checkValidLastName();
});

$("#validationCustom03").focusout(function () {
  checkEmail();
});

let test = $(".validatePassword").focusout(function (event) {
  return checkPassword(event.target);
});

$("#validationCustom05").focusout(function () {
  checkPhone();
});

$("#validationCustom06").focusout(function () {
  checkStreet();
});
$("#validationCustom07").focusout(function () {
  checkOrt();
});
$("#validationCustom08").focusout(function () {
  checkPostNr();
});

/**
 * Check first name is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkValidFirstName() {
  let inputId = "#validFirstName";
  const firstname = $("#validationCustom01").val();
  let firstName = document.getElementById("validationCustom01");
  let invalid = "#invalidFirstName";
  let regPattern = /^(?=.{1,50}$)[a-zZäöåÄÖÅ]+(?:['_.\s][a-zZäöåÄÖÅ]+)*$/i;
  if (firstname.trim() == "") {
    $(inputId).hide();
    $(invalid).text("förnamn krävs");
    $(invalid).show();
    $(inputId).text("");
    $(firstName).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(firstname)) {
    $(inputId).hide();
    $(invalid).text("Ogiltig! Ange endast bokstäver");
    $(invalid).show();
    $(inputId).text("");
    $(firstName).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalid).hide();
    $(inputId).text("Giltig");
    $(inputId).show();
    $(firstName).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * Check Last name is correct.
 * @returns True if the input is valid otherwise false.
 */
function checkValidLastName() {
  let validDiv = "#validLastName";
  const lastName = $("#validationCustom02").val();
  let input = document.getElementById("validationCustom02");
  let invalidDiv = "#invalidLastName";
  let regPattern = /^(?=.{1,50}$)[a-zZäöåÄÖÅ]+(?:['_.\s][a-zZäöåÄÖÅ]+)*$/i;

  if (lastName.trim() == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Efternamn krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");

    return false;
  } else if (!regPattern.test(lastName)) {
    $(validDiv).hide();
    $(invalidDiv).css("color", "red");
    $(invalidDiv).text("Ogiltig! Endast karaktärer tack");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * Check E-post is correct.
 * @returns True if the input is valid otherwise false.
 */
function checkEmail() {
  let validDiv = "#validEmail";
  let invalidDiv = "#invalidEmail";
  let input = document.getElementById("validationCustom03");
  let regPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  let email = $("#validationCustom03").val();

  if (email == "") {
    $(validDiv).hide();
    $(invalidDiv).text("E-post krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(email)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltig e-postadress");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * Check password is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkPassword(target) {
  // let regPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let regPattern = /^[^åäöÅÄÖ]{6,100}$/;
  let validDiv = target.parentNode.querySelector(".validLösenord");
  let invalidDiv = target.parentNode.querySelector(".invalidLösenord");
  let password = target.value;
  let input = target;

  if (password == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Lösenord krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(password)) {
    $(validDiv).hide();
    $(invalidDiv).text(
      "Lösenordet ska innehålla minst 6 tecken och får inte innehålla Å,Ä,Ö."
    );
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (target.id == "validationCustom041" && checkRepeatPassword()) {
    $(validDiv).hide();
    $(invalidDiv).text("must be same password");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * checkRepeatPassword .
 * @returns true if the input is valid otherwise false.
 */
function checkRepeatPassword() {
  if ($("#validationCustom04").val() != $("#validationCustom041").val()) {
    return true;
  } else {
    return false;
  }
}
/**
 * Check address is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkStreet() {
  let validDiv = "#validGata";
  let invalidDiv = "#invalidGata";
  let address = $("#validationCustom06").val();
  // let regPattern = /^[A-Za-z0-9ZäöåÄÖÅ ]*$/;
  let regPattern = /^(?=.*[0-9])(?=.*[a-zA-ZåäöÅÄÖ])(?=.*[\s])[0-9a-zA-ZåäöÅÄÖ\s]+$/;
  let input = document.getElementById("validationCustom06");
  if (address.trim() == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Adress krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(address)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltig adress");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * Check phone number is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkPhone() {
  let regPattern = /(^07([\s-]*\d[\s-]*){8})$|^(\+46([\s-]*\d[\s-]*){9})$|^(0046([\s-]*\d[\s-]*){9})$/;
  let validDiv = "#validPhone";
  let invalidDiv = "#invalidPhone";
  let phoneNumber = $("#validationCustom05").val();
  let input = document.getElementById("validationCustom05");
  if (phoneNumber == "") {
    $(validDiv).hide();
    $(invalidDiv).text(
      "Telefon krävs för att leverantören kunna kontakta dig när hen är framme"
    );
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(phoneNumber)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt telefonnummer");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    $(input).val(formatPhoneNumberForDb(phoneNumber));
    return true;
  }
}
/**
 * Check address is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkOrt() {
  let validDiv = "#validOrt";
  let address = $("#validationCustom07").val();
  let invalidDiv = "#invalidOrt";
  let regPattern = /^[A-Za-zåäöÅÄÖ]*$/;
  let input = document.getElementById("validationCustom07");
  if (address == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Ort krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(address)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt Ort");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    return true;
  }
}
/**
 * Check post number is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkPostNr() {
  let regPattern = /^([\s]*\d[\s]*){5}$/;
  let validDiv = "#validPostNr";
  let invalidDiv = "#invalidPostNr";
  let postNr = $("#validationCustom08").val();
  let input = document.getElementById("validationCustom08");
  if (postNr == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Postnummer krävs");
    $(validDiv).text("");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(postNr)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt postnummer");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltigt");
    $(validDiv).show();
    $(input).removeClass("is-invalid").addClass("is-valid");
    $(input).val(formatZipcodeForDb(postNr));
    return true;
  }
}
/**
 * Writes information about the customer to the page from localstorage
 */
function setProfileFromLS() {
  if (
    localStorage.getItem("customer") != null &&
    localStorage.getItem("customer") != "undefined"
  ) {
    let localST = JSON.parse(localStorage.getItem("customer"));
    $("#validationCustom01").val(localST.firstname);
    $("#validationCustom02").val(localST.lastname);
    $("#validationCustom03").val(localST.email);
    $("#validationCustom04").val(localST.password);
    $("#validationCustom05").val(localST.number);
    $("#validationCustom06").val(localST.address.street);
    $("#validationCustom07").val(localST.address.city);
    $("#validationCustom08").val(localST.address.zipcode);
    $("#welcomeText").text("Hej " + localST.firstname + " " + localST.lastname);
    $("#welcomeEmail").text(localST.email);
  }
}

/**
 * Listener that closes create user modal when correct data is entered.
 */
$(document).on("click", ".create-new-account-button", function () {
  const validMsg = document.getElementsByClassName("valid-feedback");
  let counter = 0;
  for (msg of validMsg) {
    if (msg.innerHTML == "Giltig") {
      counter++;
    }
  }
  if (counter === 9) {
    $(".register-modal").modal("hide");
  }
  counter === 0;
});

// Formats incoming phonenumber to proper format as specified by PO.
function formatPhoneNumberForDb(phoneNumber) {
  let output = phoneNumber
    .trim()
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .replace("+46", "0")
    .replace(/^(0046)/, "0");

  return `${output.slice(0, 3)}-${output.slice(3, 6)} ${output.slice(
    6,
    8
  )} ${output.slice(8)}`;
}

// Formats incoming zipcode to proper format as specified by PO.
function formatZipcodeForDb(zipcode) {
  let output = zipcode.trim().replace(/\s/g, "");

  return `${output.slice(0, 3)} ${output.slice(3)}`;
}

setProfileFromLS();
