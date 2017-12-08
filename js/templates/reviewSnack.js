function editOneSnackTemplate(snack) {
  return `
  <div class='container-fluid infoBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>Review a Snack</p>
      </div>
    </div>
    <div class='snackImg'>
      <p>Replace with img of snack</p>
    </div>
    <div class='textInputs'>
      <form>
        <div class='inputLine'>
          <p class='strongP'>ID Number: </p><span>5</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>Snack Name</span>
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
          <p class='strongP'>Price: </p><span>$4.99</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><input class='formInput' type='text' placeholder='Tastes great!'>
        </div>
        <input type='submit' value='Submit Review!'>
      </form>
    </div>
  </div>`
}

module.exports = {
  editOneSnackTemplate,
}
