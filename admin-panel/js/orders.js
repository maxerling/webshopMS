

let invoceList = [];

function render(json) {
  let output = "";
  let tbody = document.querySelector("tbody");
  let trTable = "";
  json.forEach((order) => {
    trTable = `
        <tr>
            <td class="cut">${order.ordernumber}</td>
            <td class="cut">${order.date}</td>
            <td class="cut">${order.customerid}</td>
            <td class="cut">${order.totalPrice}$</td>
            <td class="cut">

                <div class="statusEdit">
                    <select name="" id="" class="">
                    <option value="">-</option>
                    <option value="">Utskriven</option>
                    <option value="">Skickad</option>
                    <option value="">Levererad</option>
                    </select>

                    <a class="cancelStatus" title="cancelStatus" 
                    ><i class="material-icons">X</i></a>

                    <a class="submitStatus" title="submitStatus" 
                    ><i class="material-icons">Y</i></a>
                </div>

                <div class="status">
                    ${order.status} 
                    <a class="editStatus" title="Edit" 
                    ><i class="material-icons">&#xE254;</i></a>
                </div>
            </td>
            <td>
                <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
                <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
                <!-- <a href="#" data-bs-toggle="modal" data-bs-target="#Modal" class="view" title="" data-toggle="tooltip" data-original-title="View">
                    <i class="material-icons"></i>
                </a> -->
                <a type="button" class="view" data-bs-toggle="modal" data-bs-target="#staticBackdrop" href="#staticBackdrop" title="" data-toggle="tooltip" data-original-title="View" onclick="createModal(${order.id})">
                    <i class="material-icons"></i>
                </a>
            </td>
            
        </tr>
        `;
    let modalData = {};
    modalData.id = order.id;
    modalData.products = order.products;
    modalData.totalPrice = order.totalPrice;
    invoceList.push(modalData);

    output += trTable;
  });
  tbody.innerHTML = output;
}

function createModal(id) {

  let trModal = "";
  let output = "";
  invoceList.forEach((item) => {
    if (item.id == id) {
      item.products.forEach((product) => {
        console.log(product.productid);
        trModal = `
                <tr>
                    <td>${product.productid}</td>
                    <td>${product.qunatity}</td>
                    <td>${product.price}$</td>
                    <td>${product.price * product.qunatity}</td>
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
                    `;
                    
                   
        output += trModal;
      });

      document.getElementById("modal-tbody").innerHTML = output;
      document.getElementById("totalPrice").innerText = item.totalPrice;
    }
  });
}

$(document).ready(function () {

    fetch("../../data/orders.json")
    .then((response) => response.json())
    .then((data) => render(data))
    .catch((error) => console.error(error));

  
  $('[data-toggle="tooltip"]').tooltip();
 
  // Append table with add row form on add new button click
  //console.log(actions);
  $(".add-new").click(function () {

  
    var actions = $("#myTable2 td:last-child").html();
    $(this).attr("disabled", "disabled");
    var index = $("#myTable2 tbody tr:last-child").index();

    var row =
      `<tr> 
      <td class="cut"><input type="text" class="form-control"  name="title" id="product"></td>
      <td class="cut"><input type="text" class="form-control"  name="brand" id="qty"></td>
      <td class="cut"><input type="text" class="form-control"  name="description" id="price"></td>
      <td class="cut"><input type="text" class="form-control"  name="image" id="total"></td>
      <td>
       ${actions}
      </td>
      </tr>`;
      
        $("#myTable2").append(row);
        $("#myTable2 tbody tr")
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

  $(document).on("click", ".editStatus", function () {
    $(this).parents("td").find(".status").hide();
    $(this).parents("td").find(".statusEdit").show();
  });

  // Delete row on delete button click
  $(document).on("click", ".delete", function () {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });
});
