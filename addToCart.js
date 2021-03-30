function addToCart(productId) {
  let inCartArray = JSON.parse(localStorage.getItem("cart"));
  let allProducts = JSON.parse(localStorage.getItem("allProducts"));
  console.log(inCartArray);
  inCartArray.push(allProducts[0]);
  let item;
  let index;
  if ((item = allProducts.find((item) => item.id == productId))) {
    index = inCartArray.findIndex((e) => e.id == item.id);
    inCartArray[index].quantity + 1;
    console.log(inCartArray[index].quantity);
  } else {
  }

  //product.id == products.product.id
  /*for (let i = 0; i < allProducts.length; i++) {
    if (productId == allProducts[i].id && inCartArray[i].quantity > 0) {
      inCartArray[i].quantity++;
    } else if (productId == inCartArray[i].id) {
      for (let j = 0; j < allProducts.length; j++) {
        let selectedPrd = {
          id: allProducts[i].id,
          title: allProducts[i].title,
          image: allProducts[i].image,
          price: allProducts[i].price,
          quantity: 1,
          units: allProducts[i].units,
          category: allProducts[i].category,
        };
        inCartArray.push(selectedPrd);
      }
    }

    console.log(inCartArray);
  }*/

  //inCartArray.push(sel);
}

/**
 let selectedPrd = {
            id: allProducts[i].id,
            title: allProducts[i].title,
            image: allProducts[i].image,
            price: allProducts[i].price,
            quantity: 1,
            units: allProducts[i].units,
            category: allProducts[i].category,
          };
          inCartArray.push(selectedPrd);
 */
