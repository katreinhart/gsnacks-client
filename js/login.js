const userRequests = require('./requests/users')

function processLoginForm(e) {
  if (e.preventDefault) e.preventDefault()
  const email = e.srcElement[0].value
  const password = e.srcElement[1].value
  const rememberMe = e.srcElement[2].checked
  return userRequests.login({ email, password })
    .then((result) => {
      if (rememberMe) {
        window.localStorage.setItem('token', result.data.token)
      }
      window.isLoggedIn = true
      window.location.href = '#/snacks'
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
