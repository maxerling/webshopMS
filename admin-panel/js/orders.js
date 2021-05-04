let invoiceList = [];
/**
 * Create elements based on order data (object data)
 * @param {object} json all orders
 */
function createOrderElements(json) {
  let output = "";
  let tbody = document.querySelector("tbody");
  let trTable = "";
  json.forEach((order) => {
    trTable = `
        <tr>
            <td class="cut">${order.id}</td>
            <td class="cut">${order.date}</td>
            <td class="cut">${order.users!=null ? order.users.email : "----"}</td>
            <td class="cut">${order.totalPrice} KR</td>
            <td class="cut">

                <div class="statusEdit">
                    <select name="" id="" class="statusList" >
                      <option value="-">-</option>
                      <option value="Utskriven">Utskriven</option>
                      <option value="Skickad">Skickad</option>
                      <option value="Levererad">Levererad</option>
                    </select>

                    <a class="cancelStatus" title="cancelStatus" 
                    ><i class="material-icons">&#xE5C9;</i></a>

                    <a class="submitStatus" title="submitStatus" 
                    ><i class="material-icons">&#xE86C;</i></a>
                </div>

                <div class="status">
                    <span > ${order.status} </span>
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
    output += trTable;
  });
  tbody.innerHTML = output;
}
/**
 * Create Modal based on order data 
 * @param {product-id} id For compare order row with database to show order line item.
 */
function createModal(id) {
  fetch(`https://hakims-webshop.herokuapp.com/orderRow/get/byOrderID/${id}`)
  .then((response) => response.json())
  .then((orderRow) =>{
  let trModal = "";
  let output = "";
  let shippingCost = "";
  $(".invoice-info").html(`
    <span class=""> ON.: ${orderRow[0].order.id}</span>
    <span class="ps-3"> Date: ${orderRow[0].order.date}</span>
  
  `)
  orderRow.forEach((item) => {
   
     
        trModal = `
                <tr>
                    <td>${item.product.title}</td>
                    <td>${item.quantity}</td>
                    <td>${item.productPriceWhenOrdering} KR</td>
                    <td>${item.productPriceWhenOrdering * item.quantity} KR</td>
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
        output += trModal;
      });
      shippingCost = `
      <tr>
        <td colspan="3">shippingCost</td>
        <td colspan="1">49 kr</td>
      </tr>
      `
      if(orderRow[0].order.totalPrice < 250){
        output += shippingCost

      }

      document.getElementById("modal-tbody").innerHTML = output;
      document.getElementById("totalPrice").innerText = orderRow[0].order.totalPrice;
 
  

  }).catch((error) => console.error(error));
  
}

$(document).ready(function () {
  $(".printme").click(function(){
    print();
  })

  // fetch order and call render function
  fetch("https://hakims-webshop.herokuapp.com/order/get")
    .then((response) => response.json())
    .then((data) => createOrderElements(data))
    .catch((error) => console.error(error));

  $('[data-toggle="tooltip"]').tooltip();


  /* *****************************Listeners for CRUD operations comment away******************************************* 
  // Append table with add row form on add new button click
  //console.log(actions);
  $(".add-new").click(function () {
    var actions = $("#myTable2 td:last-child").html();
    $(this).attr("disabled", "disabled");
    var index = $("#myTable2 tbody tr:last-child").index();

    var row = `<tr> 
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

  $(document).on("click", ".submitStatus", function () {
    let val = $(this).parents("td").find(".statusList").val();
    $(this).parents("td").find(".status span").text(val);
    $(this).parents("td").find(".status").show();
    $(this).parents("td").find(".statusEdit").hide();
  });

  $(document).on("click", ".cancelStatus", function () {
    $(this).parents("td").find(".status").show();
    $(this).parents("td").find(".statusEdit").hide();
  });

  // Delete row on delete button click
  $(document).on("click", ".delete", function () {
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });
  ********************************************************************************* */
});
