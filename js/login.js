const userRequests = require('./requests/users')

function processLoginForm(e) {
  if (e.preventDefault) e.preventDefault()
  const email = e.srcElement[0].value
  const password = e.srcElement[1].value
  return userRequests.login({ email, password })
    .then((result) => {
      window.localStorage.setItem('token', result.data.token)
      window.isLoggedIn = true
      userRequests.getUser(result.data.token).then((user) => {
        if (user.data.admin) {
          window.location.href = '#/admin'
          window.isAdmin = true
        } else {
          window.location.href = '#/snacks'
        }
      })
    })
    .catch((err) => {
      console.error(err)
      document.getElementById('login-error').classList.remove('hidden')
    })
}

function setUpLoginForm() {
  const form = document.getElementById('loginForm')
  if (form.attachEvent) form.attachEvent('submit', processLoginForm)
  else form.addEventListener('submit', processLoginForm)
}

module.exports = {
  processLoginForm,
  setUpLoginForm,
}
