function viewOneSnackTemplate(snack) {
  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <p> class='strongP'Snack Title</p>
      </div>
      <div class='snackImg'>
        <p>Replace with img of snack</p>
      </div>
      <div>
        <div class='inputLine'>
          <p class='strongP'>ID Number: </p><span>5</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>Name</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Average Rating: </p><span>5</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><span>Price</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Description: </p><span>Gingerbread cake jelly pudding jelly beans. Fruitcake gingerbread wafer wafer gingerbread apple pie marshmallow. Biscuit jelly cookie dragée brownie dessert carrot cake macaroon bonbon. Unerdwear.com liquorice marshmallow fruitcake caramels dessert gingerbread.</span>
        </div>
      </div>
    </div>`
}

module.exports = {
  viewOneSnackTemplate,
}
