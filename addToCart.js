/**
 * Gets arrays from localStorage and checks if product exist in cartArray.
 * If object doesn't match productid, the object get stored in cartArray
 * else it will +1 object.quantity in cartArray. This is later stored in localStorage.
 *
 * @param {number} productId - The current product ID
 */
function addToCart(productId) {
  let cartArray = JSON.parse(localStorage.getItem("cart"));
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  console.log(cartArray);
  let item = allProducts.find((item) => item.id == productId);
  let cartIndex = cartArray.findIndex((e) => e.id == productId);

  if (item != undefined && cartIndex != -1) {
    cartArray[cartIndex].quantity++;
  } else {
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
    cartArray.push(selectedPrd);
  }

  localStorage.setItem("cart", JSON.stringify(cartArray));
  disableOrEnableCartButton();
}
