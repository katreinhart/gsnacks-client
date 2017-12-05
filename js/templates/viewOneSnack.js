
function viewOneSnackTemplate(snack) {
  return `<div class='infoBox title'>
      <div class='inputLine'>
        <p>View a Snack</p>
      </div>
    </div>
    <div class='infoBox snackImg'>
     <img src='${snack.img}' width=300 alt='An image of ${snack.name}'>
    </div>
    <div class='infoBox textInputs'>
      <form>
        <div class='inputLine'>
          <p>ID Number: ${snack.id}</p>
          <input class='formInput' type='text' placeholder='ID Number'>
        </div>
        <div class='inputLine'>
          <p>Name: </p><input class='formInput' type='text' placeholder='Name'>
        </div>
        <div class='inputLine'>
          <p>Rating: </p><select name="snack">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class='inputLine'>
          <p>Price: </p><input class='formInput' type='text' placeholder='Price'>
        </div>
        <div class='inputLine'>
          <p>Description: </p><input class='formInput' type='text' placeholder='Description'>
        </div>
        <input type='submit' value='Add/Edit'>
      </form>
    </div>`
}

module.exports = {
  viewOneSnackTemplate,
}
