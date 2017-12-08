function editOneSnackTemplate(snack) {
  return `
  <div class='container-fluid infoBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>Edit Snack #${snack.id}</p>
      </div>
    </div>
    <div class='textInputs'>
      <form id='edit-snack-${snack.id}'>
        
        <div class='inputLine'>
          <p class='strongP'>Name: </p><input class='formInput' id='snack_name' type='text' placeholder='Name' value='${snack.name}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Image: </p><input class='formInput' id='snack_img' type='text' placeholder='An image of the snack.' value='${snack.img}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><input class='formInput' id='snack_price' type='text' placeholder='Price' value='${snack.price}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Description: </p><input class='formInput' id='snack_description' type='text' 
            placeholder='Gingerbread cake jelly pudding jelly beans. Fruitcake gingerbread wafer wafer gingerbread apple pie marshmallow. Biscuit jelly cookie dragée brownie dessert carrot cake macaroon bonbon. Unerdwear.com liquorice marshmallow fruitcake caramels dessert gingerbread.'
            value='${snack.description}'  
          >
        </div>
        <div class='inputLine'>
          <p class='strongP'>Perishable: </p>  
          <input type='checkbox' id='snack_is_perish' checked=${snack.isPerishable}>
        </div>
        <input type='submit' value='Add/Edit'>
      </form>
    </div>
  </div>`
}

module.exports = {
  editOneSnackTemplate,
}
