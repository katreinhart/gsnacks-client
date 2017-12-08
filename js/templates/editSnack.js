function editOneSnackTemplate(snack) {
  return `
  <div class='container-fluid infoBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>Edit a Snack</p>
      </div>
    </div>
    <div class='snackImg'>
      <p>Replace with img of snack</p>
    </div>
    <div class='textInputs'>
      <form>
        <div class='inputLine'>
          <p class='strongP'>ID Number: </p>
          <input class='formInput' type='text' placeholder='ID Number'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><input class='formInput' type='text' placeholder='Name'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p><select name="snack">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><input class='formInput' type='text' placeholder='Price'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Description: </p><input class='formInput' type='text' placeholder='Gingerbread cake jelly pudding jelly beans. Fruitcake gingerbread wafer wafer gingerbread apple pie marshmallow. Biscuit jelly cookie dragée brownie dessert carrot cake macaroon bonbon. Unerdwear.com liquorice marshmallow fruitcake caramels dessert gingerbread.'>
        </div>
        <input type='submit' value='Add/Edit'>
      </form>
    </div>
  </div>`
}

module.exports = {
  editOneSnackTemplate,
}
