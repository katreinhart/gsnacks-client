const { setupRegisterForm } = require('./register')
const { setUpLoginForm } = require('./login')

const { registerTemplate } = require('./templates/registerForm')
const { loginFormTemplate } = require('./templates/loginForm')

const { navbarTemplate } = require('./templates/navbar')
const { allSnacksTemplate } = require('./templates/allSnacks')
const { setupSnacks } = require('./allSnacks')

const { viewOneSnackTemplate } = require('./templates/viewOneSnack')
const { getSnack } = require('./viewOne')

const {
  getAll: getUsers,
  getUser: getMyInfo,
} = require('./requests/users')

const { adminNavbarTemplate } = require('./templates/adminNavbar')
const { allUsersTemplate } = require('./templates/allUsers')
const { setupAdminUsers } = require('./admin')

const mainContentDiv = document.getElementById('main-content')
const navContentDiv = document.getElementById('nav-content')

let isAdmin = false, isLoggedIn = false

function redirectTo(str) {
  if (str.includes('#')) window.location.hash = str
  window.location.reload()
  loadHome()
}

function setupAdmin() {
  const token = window.localStorage.getItem('token')
  navContentDiv.innerHTML = adminNavbarTemplate()
  getUsers(token).then((result) => {
    const { users } = result.data
    mainContentDiv.innerHTML = allUsersTemplate(users)
    setupAdminUsers()
  })
}

function setupLoggedOutView() {
  if (window.location.href.includes('#/login')) {
    navContentDiv.innerHTML = navbarTemplate(isLoggedIn)
    mainContentDiv.innerHTML = loginFormTemplate()
    setUpLoginForm()
  } else if (window.location.href.includes('#/register')) {
    navContentDiv.innerHTML = navbarTemplate(isLoggedIn)
    mainContentDiv.innerHTML = registerTemplate()
    setupRegisterForm()
  } else {
    navContentDiv.innerHTML = navbarTemplate(isLoggedIn)
    window.location.href = '/#/snacks'
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  }
}

function loadHome() {
  if (window.location.href.endsWith('#/snacks')) {
    navContentDiv.innerHTML = isAdmin? adminNavbarTemplate() : navbarTemplate(true)
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  } else if (window.location.href.includes('#/snacks')) {
    navContentDiv.innerHTML = isAdmin? adminNavbarTemplate() : navbarTemplate(true)
    const snackId = window.location.href.split('/')[5]
    getSnack(snackId).then((snack) => {
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    })
  } else if (window.location.href.includes('#/logout')) {
    window.localStorage.removeItem('token')
    redirectTo('#/login')
  } else { // fallback route
    navContentDiv.innerHTML = isAdmin? adminNavbarTemplate() : navbarTemplate(true)
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  }
}

function setupHome() {
  const token = window.localStorage.getItem('token')
  if(token) {
    getMyInfo(token).then(result => {
      const user = result.data
      isLoggedIn = true
      isAdmin = user.admin
      if(isAdmin) {
        setupAdmin()
      } else {
        loadHome()
      }
    }).catch(console.error)
  }

  else {
    setupLoggedOutView()
  } 
}

setupHome()
window.addEventListener('hashchange', loadHome, false)
