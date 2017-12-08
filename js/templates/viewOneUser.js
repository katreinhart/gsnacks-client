function viewOneUserTemplate(user) {
  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <pclass='strongP'>User name</p>
      </div>
      <div class='snackImg'>
        <p>Replace with img of user</p>
      </div>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>Name</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Email: </p><span>fake@email.com</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'># of Reviews: </p><span>Price</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Delete User? </p><a href=''>Yes</a>
        </div>
      </div>
    </div>`
}

module.exports = {
  viewOneUserTemplate,
}
