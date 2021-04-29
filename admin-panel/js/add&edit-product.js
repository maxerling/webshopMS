$("#upload-btn").click(function (e) {
  e.preventDefault();
  var input1 = $("#upload").val();
  console.log(input1);
  $("#imageResult").attr("src", input1);
});

///category
$(document).ready(function () {

  fetch("https://hakims-webshop.herokuapp.com/category/get")
    .then((resp) => resp.json())
    .then((data) =>
      data.map((item) =>
        $(".category").append(
          `<option value="${item.id}">${item.name}</option>`
        )
      )
    )
    .catch((err) => console.log(err));

    $('#input8').change(function () {
        if($('#input8').val() != ""){
            $('#input9').attr("disabled",false);
        }else{
            $('#input9').attr("disabled",true);
        }
    })
   


    $("form").submit(function (e) {
        e.preventDefault();
      console.log(parseInt($("input[name=featured]:checked").val()));
        let product = {
          title: $("#input1").val(),
          brand: $("#input2").val(),
          description: $("#input3").val(),
          image: $("#upload").val(),
          price: $("#input4").val(),
          quantity: $("#input5").val(),
          unit: $("#input6").val(),
          featured: parseInt($("input[name=featured]:checked").val())
        };
      
        if ($("#input8").val() != "") {
          if ($("#input9").val() != "") {
            product.category = [
              {
                id: $("#input7").val(),
              },
              {
                id: $("#input8").val(),
              },
              {
                id: $("#input9").val(),
              },
            ];
          } else {
            product.category = [
              {
                id: $("#input7").val(),
              },
              {
                id: $("#input8").val(),
              },
            ];
          }
        } else {
          product.category = [
            {
              id: $("#input7").val(),
            },
          ];
        }
      console.log(product.category);
        fetch("https://hakims-webshop.herokuapp.com/product/add", {
          method: "POST",
          body: JSON.stringify(product),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (res) {
            console.log(res);
            if (res.status == 200) {
              return res.json();
            } else {
              alert("fel");
            }
          })
          .then(function (product) {
            console.log(product);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
});



