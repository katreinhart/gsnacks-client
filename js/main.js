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

function setupHome() {
  const token = window.localStorage.getItem('token')
  getMyInfo(token).then(console.log)
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
    const snackId = window.location.href.split('/')[5]
    getSnack(snackId).then((snack) => {
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    })
  } else if (window.location.href.includes('#/logout')) {
    window.localStorage.removeItem('token')
    window.location.href = '#/login'
  } else if (window.location.href.includes('#/admin')) {
    // verify actual admin status
    navContentDiv.innerHTML = adminNavbarTemplate()
    getUsers(token).then((result) => {
      const { users } = result.data
      mainContentDiv.innerHTML = allUsersTemplate(users)
      setupAdminUsers()
    })
  } else {
    navContentDiv.innerHTML = navbarTemplate(true)
    setupSnacks().then((snacks) => {
      mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    })
  }
}

setupHome()
window.addEventListener('hashchange', setupHome, false)
