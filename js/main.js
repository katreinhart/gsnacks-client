// const { baseURL } = require('./constants')

const { setupRegisterForm } = require('./register')
const { setUpLoginForm } = require('./login')

const { registerTemplate } = require('./templates/registerForm')
const { loginFormTemplate } = require('./templates/loginForm')

const { navbarTemplate } = require('./templates/navbar')
const { allSnacksTemplate } = require('./templates/allSnacks')

const mainContentDiv = document.getElementById('main-content')
const navContentDiv = document.getElementById('nav-content')

const token = window.localStorage.getItem('token')

if (!token) {
  mainContentDiv.innerHTML = registerTemplate()
  setupRegisterForm()
}

if (window.location.href.includes('#/login')) {
  mainContentDiv.innerHTML = loginFormTemplate()
  setUpLoginForm()
}

else {
  navContentDiv.innerHTML = navbarTemplate()
  mainContentDiv.innerHTML = allSnacksTemplate()
}
