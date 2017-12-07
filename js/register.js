const userRequests = require('./requests/users')

function processRegisterForm(e) {
  if (e.preventDefault) e.preventDefault()
  const fname = e.srcElement[0].value
  const lname = e.srcElement[1].value
  const email = e.srcElement[2].value
  const password = e.srcElement[3].value

  userRequests.register({ first_name: fname, last_name: lname, email, password })
    .then((result) => {
      window.location.href = '#/login'
    })
    .catch((err) => {
      console.error(err)
    })
}

function setupRegisterForm() {
  // const loginButton = document.getElementById('login')
  // loginButton.addEventListener('click', (e) => {
  //   window.location.href = '#/login'
  // })
  const form = document.getElementById('signupForm')
  if (form.attachEvent) form.attachEvent('submit', processRegisterForm)
  else form.addEventListener('submit', processRegisterForm)
}

module.exports = {
  processRegisterForm,
  setupRegisterForm,
}
