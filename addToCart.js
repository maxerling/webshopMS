function addToCart(productId) {
  let inCartArray = JSON.parse(localStorage.getItem("cart"));
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  console.log(inCartArray);
  let item;
  let index;
  if ((item = allProducts.find((item) => item.id == productId))) {
    index = inCartArray.findIndex((e) => e.id == item.id);
    if (!(index == -1)) {
      console.log(index);
      inCartArray[index].quantity++;
    }
  } else {
    index = allProducts.findIndex((e) => e.id == item.id);
    let selectedPrd = {
      id: allProducts[index].id,
      title: allProducts[index].title,
      image: allProducts[index].image,
      price: allProducts[index].price,
      quantity: 1,
      units: allProducts[index].units,
      category: allProducts[index].category,
    };
    inCartArray.push(selectedPrd);
  }

  localStorage.setItem("cart", JSON.stringify(inCartArray));
}
