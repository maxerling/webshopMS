/**
 * fetch all users from the database JSON object!
 * call createCustomerElements method to create customers table
 */
function getData() {
  const url = 'https://hakims-webshop.herokuapp.com/user/list'

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (document.querySelector('h2').innerText == 'VIP-Customers') {
        createVIPCustomerElements(data)
      } else {
        createCustomerElements(data)
      }
    })
    .catch((err) => console.log(err))
}

/**
 * create elements based on customer data
 * @param {object} users all of customers info
 */
function createCustomerElements(users) {
  console.log(users)
  let output = ''
  let tbody = document.querySelector('tbody')
  let trTable = ''
  users.forEach((user) => {
    if (user.role == 'ROLE_USER') {
      trTable = `
      <tr> 
      <td class="cut">${user.firstName} ${user.lastName}</td>
      <td class="cut" title="${user.email}">${user.email}</td>
      <td class="cut">${user.address.city}</td>
      <td class="cut">${user.address.street}</td>
      <td class="cut">${user.address.zipcode}</td>
      <td class="cut" title="${user.number}">${user.number}</td>
      <td class="cut">${user.status}</td>
      
  
      <td>
        <a class="add" title="Add" data-toggle="tooltip"
          ><i class="material-icons">&#xE03B;</i></a
        >
        <a class="edit" title="Edit" data-toggle="tooltip"
          ><i class="material-icons">&#xE254;</i></a
        >
        <a class="delete" title="Delete" data-toggle="tooltip"
          ><i class="material-icons">&#xE872;</i></a
        >
      </td>
    </tr>
          `
      output += trTable
    }
  })
  tbody.innerHTML = output
}

/**
 * create elements based on customer data
 * @param {object} users all of customers info
 */
function createVIPCustomerElements(users) {
  let output = ''
  let tbody = document.querySelector('tbody')
  let trTable = ''
  users.forEach((user) => {
    if (user.role == 'ROLE_USER') {
      trTable = `
      <tr> 
      <td class="cut">${user.id}</td>
      <td class="cut">${user.firstName} ${user.lastName}</td>
      <td class="cut" title="${user.email}">${user.email}</td>
      <td class="cut">${user.address.city}</td>
      <td class="cut">${user.address.street}</td>
      <td class="cut">${user.address.zipcode}</td>
      <td class="cut" title="${user.number}">${user.number}</td>
    </tr>
          `
      output += trTable
    }
  })
  tbody.innerHTML = output
}

$(document).ready(function () {
  getData()

  $('[data-toggle="tooltip"]').tooltip()

  /**************************************Listeners for CRUD operations comment away************************************ 
   // Append table with add row form on add new button click
  $(".add-new").click(function () {
    var actions = $("table td:last-child").html();
    $(this).attr("disabled", "disabled");
    var index = $("table tbody tr:last-child").index();
    var row =
      "<tr>" +
      '<td><input type="text" class="form-control"  name="title" id="name"></td>' +
      '<td><input type="text" class="form-control"  name="brand" id="brand"></td>' +
      '<td><input type="text" class="form-control"  name="description" id="description"></td>' +
      '<td><input type="text" class="form-control"  name="image" id="image"></td>' +
      '<td><input type="text" class="form-control"  name="price" id="price"></td>' +
      '<td><input type="text" class="form-control"  name="qty" id="qty"></td>' +
      '<td><input type="text" class="form-control"  name="units" id="units"></td>' +
      "<td>" +
      actions +
      "</td>" +
      "</tr>";

    $("table").append(row);
    $("table tbody tr")
      .eq(index + 1)
      .find(".add, .edit")
      .toggle();
    $('[data-toggle="tooltip"]').tooltip();
  });
  // Add row on add button click
  $(document).on("click", ".add", function () {
    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
    input.each(function () {
      if (!$(this).val()) {
        $(this).addClass("error");
        empty = true;
      } else {
        $(this).removeClass("error");
      }
    });

    $(this).parents("tr").find(".error").first().focus();
    if (!empty) {
      input.each(function () {
        $(this).parent("td").html($(this).val());
      });
      $(this).parents("tr").find(".add, .edit").toggle();
      $(".add-new").removeAttr("disabled");
    }
  });
  
  // Edit row on edit button click
  $(document).on("click", ".edit", function () {
    $(this)
      .parents("tr")
      .find("td:not(:last-child)")
      .each(function () {
        $(this).html(
          '<input type="text" class="form-control" value="' +
            $(this).text() +
            '">'
        );
      });
    $(this).parents("tr").find(".add, .edit").toggle();
    $(".add-new").attr("disabled", "disabled");
  });
  
  // Delete row on delete button click
  $(document).on("click", ".delete", function () {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });
  *************************************************************************************************/
})
