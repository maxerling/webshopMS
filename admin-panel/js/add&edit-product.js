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

    $("input[name=featured]").change(function () {
        if(parseInt($("input[name=featured]:checked").val()) == 1 ){

            $("#input7").val(1).attr("disabled", true);

         }else{
            $("#input7").attr("disabled", false);
         }
    })
   

    $('#input8').change(function () {
        if($('#input8').val() != ""){
            $('#input9').attr("disabled",false);
        }else{
            $('#input9').attr("disabled",true);
        }
    })

    if(location.href.split("?id=")[1] != null){
      let id = location.href.split("?id=")[1]
      getProductById(id)
      editAndCreateProduct(id)
    
    }else{
      editAndCreateProduct(null)
    }

    function editAndCreateProduct(id){
       
            $("form").submit(function (e) {
                e.preventDefault();
                let product = {};
                let cat = [];

                if ($("#input8").val() != "") {
                    if ($("#input9").val() != "") {
                      cat = [
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
                      cat = [
                        {
                          id: $("#input7").val(),
                        },
                        {
                          id: $("#input8").val(),
                        },
                      ];
                    }
                  } else {
                    cat = [
                      {
                        id: $("#input7").val(),
                      },
                    ];
                  }
                  

                  product = {
                    title: $("#input1").val(),
                    brand: $("#input2").val(),
                    description: $("#input3").val(),
                    image: $("#upload").val(),
                    price: $("#input4").val(),
                    quantity: $("#input5").val(),
                    unit: $("#input6").val(),
                    featured: parseInt($("input[name=featured]:checked").val()),
                    category : cat
                  };

                if(id != null){
                   product.id = id;
                }
                      sendProductToDB(product , "https://hakims-webshop.herokuapp.com/product/add")
              });
    }
   
});

let  getProductById = (id) =>{
    fetch(`https://hakims-webshop.herokuapp.com/product/get/${id}`)
    .then((resp) => resp.json())
    .then((data) =>{
        setProductInForm(data)
    })
    .catch((err) => console.log(err));
}


function setProductInForm(data){
    console.log(data);

     $("#input1").val(data.title)
     $("#input2").val(data.brand)
     $("#input3").val(data.description)
     $("#upload").val(data.image)
     $("#input4").val(data.price)
     $("#input5").val(data.quantity)
     $("#input6").val(data.unit)
     
     if(data.featured == true){
         $("#true").attr("checked", true)
     }
 

if(data.category.length == 1){
    $("#input7").val(data.category[0].id)
    
}else if(data.category.length == 2){
    $("#input7").val(data.category[0].id)
    $("#input8").val(data.category[1].id)
}else if(data.category.length == 3){

    $("#input7").val(data.category[0].id)
    $("#input8").val(data.category[1].id)
    $("#input9").val(data.category[2].id).attr("disabled", false)
}
      
}

function sendProductToDB(product , url){

    fetch(url, {
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
            alert("Något gick fel /n Forsök igen");
          }
        })
        .then(function (product) {
          console.log(product);
        })
        .catch(function (error) {
          console.log(error);
        });
}



