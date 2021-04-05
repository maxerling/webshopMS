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
    <td class="cut">${product.image}</td>
    <td class="cut">${product.price}$</td>
    <td class="cut">${product.quantity}</td>
    <td class="cut">${product.units}</td>
    <td class="cut">${product.category}</td>
    

    <td>
  
      <a href="add&edit-product.html" class="edit" title="Edit" data-toggle="tooltip"
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

// Delete row on delete button click
$(document).on("click", ".delete", function () {
  $(this).parents("tr").remove();
  $(".add-new").removeAttr("disabled");
});
});