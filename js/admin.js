// pull all users template and turn into admin dashboard
const userRoutes = require('./requests/users')

const token = window.localStorage.getItem('token')

function makeUserAdmin(e) {
  const userId = e.target.id.split('-')[2]
  userRoutes.edit(userId, { admin: true }, token).then((result) => {
    window.location.href = '#/admin'
  })
}

function deleteUser(e) {
  const userId = e.target.id.split('-')[2]
  confirm('Are you sure?')
  userRoutes.delete(userId, token).then((result) => {
    window.location.href = '#/admin'
  }).catch(console.error)
}

function setupAdminUsers() {
  Array.from(document.querySelectorAll('.admin-user')).forEach((userButton) => {
    userButton.addEventListener('click', makeUserAdmin)
  })
  Array.from(document.querySelectorAll('.delete-user')).forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteUser)
  })
}

module.exports = {
  setupAdminUsers,
}
