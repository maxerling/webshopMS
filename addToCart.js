function addToCart(productId) {
    

    let inCartArray = new Array();
    let allProducts = new Array();
    console.log(inCartArray);
    console.log(allProducts);


    inCartArray = JSON.parse(localStorage.getItem("cart"));
    allProducts = JSON.parse(localStorage.getItem("allProducts"));


    //console.log(products);
    console.log(productId);
    //product.id == products.product.id


}