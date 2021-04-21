/**
 * Create elements based on product data (object data)
 * @param {object} products All of products
 */
function createProductElements(products) {
  let output = "";
  let tbody = document.querySelector("tbody");
  let trTable = "";
  products.forEach((product) => {
    trTable = `
    <tr>
    <td class="cut" >${product.id}</td>
    <td class="cut">${product.title}</td>
    <td class="cut">${product.brand}</td>
    <td class="cut" title=${product.description} alt=${product.description}>${product.description}</td>
    <td class="cut" title=${product.image}>${product.image}</td>
    <td class="cut">${product.price} KR</td>
    <td class="cut">${product.quantity}</td>
    <td class="cut">${product.unit}</td>
    <td class="cut"  colspan="2">${
      product.category.map(item=> item.name)
    }</td>
    <td class="cut">${product.featured}</td>

    

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
  fetch("https://hakims-webshop.herokuapp.com/product/get")
  .then((response) => response.json())
  .then((data) => createProductElements(data))
  .catch((error) => console.error(error));

// Delete row on delete button click
$(document).on("click", ".delete", function () {
  $(this).parents("tr").remove();
  $(".add-new").removeAttr("disabled");
});
});