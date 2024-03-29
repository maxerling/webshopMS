$(document).ready(function () {
  fetch('https://hakims-webshop.herokuapp.com/product/get')
    .then((response) => response.json())
    .then((data) => {
      if (document.querySelector('h2').innerText == 'All products') {
        createProductElements(data)
      } else {
        createVIPProductElements(data)
      }
    })
    .catch((error) => console.error(error))

  // Delete row on delete button click
  $(document).on('click', '.delete', function () {
    let result = confirm('Are you sure to delete?')
    if (result) {
      let id = $(this).closest('tr').find('>:first-child').text()
      $(this).parents('tr').remove()
      $('.add-new').removeAttr('disabled')
      // DELETE FROM DB
      fetch(`https://hakims-webshop.herokuapp.com/product/delete/${id}`, {
        method: 'POST',
      })
        .then(function (res) {
          if (res.status == 200) {
            return res.text()
          } else {
            alert('Något gick fel/n Forsök igen!')
          }
        })
        .then(function (result) {
          alert(result)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  })
})

/**
 * Create elements based on product data (object data)
 * @param {object} products All of products
 */
function createProductElements(products) {
  let output = ''
  let tbody = document.querySelector('tbody')
  let trTable = ''
  products.forEach((product) => {
    trTable = `
    <tr>
    <td class="cut">${product.id}</td>
    <td class="cut">${product.title}</td>
    <td class="cut">${product.brand}</td>
    <td class="cut">${product.price} KR</td>
    <td class="cut">${product.quantity}</td>
    <td class="cut">${product.unit}</td>
    <td class="cut"  colspan="2">${product.category.map(
      (item) => item.name
    )}</td>
    <td class="cut">${product.featured}</td>
    <td>
      <a href="add&edit-product.html?id=${
        product.id
      }" class="edit" title="Edit" data-toggle="tooltip"
        ><i class="material-icons">&#xE254;</i></a
      >
      <a class="delete" title="Delete" data-toggle="tooltip"
        ><i class="material-icons">&#xE872;</i></a>
    </td>
  </tr>
        `
    output += trTable
  })
  tbody.innerHTML = output
}

function createVIPProductElements(products) {
  let output = ''
  let tbody = document.querySelector('tbody')
  let trTable = ''
  products.forEach((product) => {
    if (product.featured == true) {
      trTable = `
      <tr>
        <td class="cut" >${product.id}</td>
        <td class="cut">${product.title}</td>
        <td class="cut">${product.brand}</td>
        <td class="cut">${product.price} KR</td>
        <td class="cut">${product.quantity}</td>
        <td class="cut">${product.unit}</td>
        <td class="cut">${product.category.map((item) => item.name)}</td>
      </tr>
            `
      output += trTable
    }
  })
  tbody.innerHTML = output
}
