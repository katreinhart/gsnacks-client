const { setupRegisterForm } = require('./register')
const { setUpLoginForm } = require('./login')

const { registerTemplate } = require('./templates/registerForm')
const { loginFormTemplate } = require('./templates/loginForm')

const { navbarTemplate } = require('./templates/navbar')
const { allSnacksTemplate } = require('./templates/allSnacks')
const { setupSnacks } = require('./allSnacks')

const { viewOneSnackTemplate } = require('./templates/viewOneSnack')
const { getSnack } = require('./viewOne')

const mainContentDiv = document.getElementById('main-content')
const navContentDiv = document.getElementById('nav-content')

function setupHome() {
  const token = window.localStorage.getItem('token')
  if (!token) {
    if (window.location.href.includes('#/login')) {
      navContentDiv.innerHTML = navbarTemplate(false)
      mainContentDiv.innerHTML = loginFormTemplate()
      setUpLoginForm()
    } else if (window.location.href.includes('#/register')) {
      navContentDiv.innerHTML = navbarTemplate(false)
      mainContentDiv.innerHTML = registerTemplate()
      setupRegisterForm()
    } else {
      navContentDiv.innerHTML = navbarTemplate(false)
      window.location.href = '/#/snacks'
      setupSnacks().then((snacks) => {
        mainContentDiv.innerHTML = allSnacksTemplate(snacks)
      })
    }
  } else if (window.location.href.endsWith('#/snacks')) {
    navContentDiv.innerHTML = navbarTemplate(true)
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  } else if (window.location.href.includes('#/snacks')) {
    navContentDiv.innerHTML = navbarTemplate(true)
    console.log('display one snack')
    const snackId = window.location.href.split('/')[5]
    getSnack(snackId).then((snack) => {
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    })
  } else if (window.location.href.includes('#/logout')) {
    window.localStorage.removeItem('token')
    window.location.href = '#/login'
  } else {
    navContentDiv.innerHTML = navbarTemplate(true)
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  }
}

setupHome()
window.addEventListener('hashchange', setupHome, false)
