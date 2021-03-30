function addToCart(productId) {
  let inCartArray = JSON.parse(localStorage.getItem("cart"));
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  console.log(inCartArray);
  console.log();
  console.log();
  let item = allProducts.find((item) => item.id == productId);
  let cartIndex = inCartArray.findIndex((e) => e.id == productId);
  console.log(item);
  console.log(cartIndex);
  if (item != undefined && cartIndex != -1) {
    console.log("if");
    console.log(cartIndex);
    inCartArray[cartIndex].quantity++;
  } else {
    console.log("else");
    let itemIndex = allProducts.findIndex((e) => e.id == productId);
    let selectedPrd = {
      id: allProducts[itemIndex].id,
      title: allProducts[itemIndex].title,
      image: allProducts[itemIndex].image,
      price: allProducts[itemIndex].price,
      quantity: 1,
      units: allProducts[itemIndex].units,
      category: allProducts[itemIndex].category,
    };
    inCartArray.push(selectedPrd);
  }

  localStorage.setItem("cart", JSON.stringify(inCartArray));
  console.log(inCartArray);
}
