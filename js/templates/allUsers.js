function allUsersTemplate(users) {
  const userDivContent = users.map(user => `<div class='row allSnackRow'>
        <div class='row userRow'>
          <div class='col-4'>
            <img src='images/user.png' alt='picture of user' class='userListImg'>
          </div>
          <div class='col-8'>
            <p>${user.first_name} ${user.last_name}</p>
            <p>${user.email}</p>
            <p>Average User Rating: <strong>5</strong></p>
            <p>Admin: ${user.admin}</p>
            <a href='/#/users/${user.id}/reviews'><p>User's Reviews Link</p></a>
            <ul>
              ${user.admin ? '' : `<li><button class='delete-user' id='delete-user-${user.id}'>Delete</button></li>`}
              ${user.admin ? '' : `<li><button class='admin-user' id='admin-user-${user.id}'>Make Admin</button></li>`}
            </ul>
          </div>
        </div>
      </div>`)

  return `<div class='container-fluid mainBody'>
    <div class='row allSnackRow'>
      <div class='col-12'>
        <h1>All Users</h1>
      </div>
    </div>

    ${userDivContent}`
}

module.exports = {
  allUsersTemplate,
}
