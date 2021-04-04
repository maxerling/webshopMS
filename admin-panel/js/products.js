function render(products) {
  let output = "";
  let tbody = document.querySelector("tbody");
  let trTable = "";
  products.forEach((product) => {
    trTable = `
    <tr>
    <td class="cut">${product.id}</td>
    <td class="cut">${product.title}</td>
    <td class="cut">${product.brand}</td>
    <td class="cut">${product.description}</td>
    <td class="cut" >${product.image}</td>
    <td class="cut">${product.price}$</td>
    <td class="cut">${product.quantity}</td>
    <td class="cut">${product.units}</td>
    <td class="cut">${product.category}</td>
    

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
        `;
        output += trTable;
  });
  tbody.innerHTML = output;
}

$(document).ready(function () {
  fetch("../../data/products.json")
  .then((response) => response.json())
  .then((data) => render(data))
  .catch((error) => console.error(error));

$('[data-toggle="tooltip"]').tooltip();
var actions = $("table td:last-child").html();
// Append table with add row form on add new button click
$(".add-new").click(function () {
  $(this).attr("disabled", "disabled");
  var index = $("table tbody tr:last-child").index();
  var row =
    "<tr>" +
    '<td class="cut"><input type="text" class="form-control"  name="title" id="name"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="brand" id="brand"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="description" id="description"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="image" id="image"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="price" id="price"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="qty" id="qty"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="units" id="units"></td>' +
    '<td class="cut"><input type="text" class="form-control"  name="category" id="category"></td>' +
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
});