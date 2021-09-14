/**
 * remove and add active class by each click on sidebar menu!
 * @param {*} event
 */
function activeClass(event) {
  $(".nav-link").removeClass("active");
  event.currentTarget.className += " active";
}

$(document).ready(function () {
  if (localStorage.getItem("token")) {
    const token = parseJwt(localStorage.getItem("token"));
    const auth = token.authorities;
    console.log();
    if (auth.length != 4 && !auth.includes("user:delete")) {
      alert("Du måste ha behörighet för att se sidan");
      location.href = "./../index.html";
    }
  } else if (!localStorage.getItem("token")) {
    alert("Du måste ha behörighet för att se sidan");
    location.href = "./../index.html";
  }
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

$("#signOut").click(() => {
  localStorage.clear();
});
