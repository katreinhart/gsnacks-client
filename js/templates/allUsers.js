function allUsersTemplate(users) {
  const userDivContent = users.map(user => `<div class='row allSnackRow'>
        <div class='row userRow'>
          <div class='col-4'>
            <img src='images/user.png' alt='picture of user' class='userListImg'>
          </div>
          <div class='col-8'>
            <p>Username</p>
            <p>Average User Rating: <strong>5</strong></p>
            <a href=''><p>User's Reviews Link</p></a>
            <ul>
              <a href=''><li>Delete</li></a>
            </ul>
          </div>
        </div>
      </div>`
}

module.exports = {
  allUsersTemplate,
}
