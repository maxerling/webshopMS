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
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else if (
          checkValidFirstName() &&
          checkValidLastName() &&
          checkEmail() &&
          checkPassword() &&
          checkPhone() &&
          checkStreet() &&
          checkOrt() &&
          checkPostNr()
        ) {
          console.log("hej");
          form.classList.add("was-validated");
          showSuccessMessage();
        }
      },
      false
    );
  });
})();
/**
 * måste skickas till databas och efter det visas det!! 
 */
function showSuccessMessage(){
    alert(" Hej testare hoppas att allt är ok :D")
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

$("#validationCustom04").focusout(function () {
  checkPassword();
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
  let test = document.getElementById("validationCustom01");
  let invalid = "#invalidFirstName";
  let regPattern = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
  if (firstname == "") {
    $(inputId).hide();
    $(invalid).text("förnamn krävs");
    $(invalid).show();
    $(test).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(firstname)) {
    $(inputId).hide();
    $(invalid).text("Ogiltig! Endast karaktärer tack");
    $(invalid).show();
    $(test).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalid).hide();
    $(inputId).text("Giltig");
    $(inputId).show();
    $(test).removeClass("is-invalid").addClass("is-valid");
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
  let regPattern = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;

  if (lastName == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Efternamn krävs");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");

    return false;
  } else if (!regPattern.test(lastName)) {
    $(validDiv).hide();
    $(invalidDiv).css("color", "red");
    $(invalidDiv).text("Ogiltig! Endast karaktärer tack");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else {
    $(invalidDiv).hide();
    $(validDiv).text("Giltig");
    $(validDiv).show();

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
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(email)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltig e-postadress");
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
function checkPassword() {
  let regPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let validDiv = "#validLösenord";
  let invalidDiv = "#invalidLösenord";
  let password = $("#validationCustom04").val();
  let input = document.getElementById("validationCustom04");

  if (password == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Lösenord krävs");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(password)) {
    $(validDiv).hide();
    $(invalidDiv).text("Lösenordet ska innehålla minst 1 bokstav och 1 siffra, samt vara minst 8 tecken långt");
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
 * Check address is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkStreet() {
  let validDiv = "#validGata";
  let invalidDiv = "#invalidGata";
  let address = $("#validationCustom06").val();
  let regPattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  let input = document.getElementById("validationCustom06");
  if (address == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Gata krävs");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(address)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltig gata");
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
  let regPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let validDiv = "#validPhone";
  let invalidDiv = "#invalidPhone";
  let phoneNumber = $("#validationCustom05").val();
  let input = document.getElementById("validationCustom05");
  if (phoneNumber == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Telefon krävs för att leverantören kunna kontakta dig när hen är framme");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(phoneNumber)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt telefon nummer");
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
 * Check address is correct.
 * @returns true if the input is valid otherwise false.
 */
function checkOrt() {
  let validDiv = "#validOrt";
  let address = $("#validationCustom07").val();
  let invalidDiv = "#invalidOrt";
  let regPattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  let input = document.getElementById("validationCustom07");
  if (address == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Ort krävs");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(address)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt Ort");
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
  let regPattern = /^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$/;
  let validDiv = "#validPostNr";
  let invalidDiv = "#invalidPostNr";
  let postNr = $("#validationCustom08").val();
  let input = document.getElementById("validationCustom08");
  if (postNr == "") {
    $(validDiv).hide();
    $(invalidDiv).text("Post nummer krävs");
    $(invalidDiv).show();
    $(input).addClass("is-invalid").removeClass("is-valid");
    return false;
  } else if (!regPattern.test(postNr)) {
    $(validDiv).hide();
    $(invalidDiv).text("Ogiltigt post nummer");
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

function setProfileFromLS(){
  let data = JSON.parse(localStorage.getItem("customer"));
  let firstName = $("#validationCustom01").val(data.name.firstName);
  let lastName = $("#validationCustom02").val(data.name.lastName);
  let email = $("#validationCustom03").val(data.email);
  let password = $("#validationCustom04").val(data.password);
  let phoneNumber = $("#validationCustom05").val(data.number);
  let address = $("#validationCustom06").val(data.address.city);
  let street = $("#validationCustom07").val(data.address.street);
  let postNr = $("#validationCustom08").val(data.address.zipcode);
  $("#welcomeText").text("Hej "+ data.name.firstName +" "+ data.name.lastName)
  $("#welcomeEmail").text(data.email)

}

setProfileFromLS()
