const { setupRegisterForm } = require('./register')
const { setUpLoginForm } = require('./login')

const { registerTemplate } = require('./templates/registerForm')
const { loginFormTemplate } = require('./templates/loginForm')

const { navbarTemplate } = require('./templates/navbar')
const { allSnacksTemplate } = require('./templates/allSnacks')
const { setupSnacks } = require('./allSnacks')

const { viewOneSnackTemplate } = require('./templates/viewOneSnack')
const { editOneSnackTemplate } = require('./templates/editSnack')
const { getSnack, setupSnackButtons, setupEditSnackTemplateButtons } = require('./viewOne')

const {
  getAll: getUsers,
  getUser: getMyInfo,
} = require('./requests/users')

const { getAllForUser: getUserReviews } = require('./requests/reviews')

const { adminNavbarTemplate } = require('./templates/adminNavbar')
const { allUsersTemplate } = require('./templates/allUsers')
const { setupAdminUsers } = require('./admin')

const mainContentDiv = document.getElementById('main-content')
const navContentDiv = document.getElementById('nav-content')

window.isAdmin = false
window.isLoggedIn = false

function toTop() {
    window.scrollTo(0, 0)
}

function redirectTo(str) {
  if (str.includes('#')) window.location.hash = str
}

function setupAdmin() {
  const token = window.localStorage.getItem('token')
  navContentDiv.innerHTML = adminNavbarTemplate()
  getUsers(token).then((result) => {
    window.location.hash = ('/admin')
    const { users } = result.data
    mainContentDiv.innerHTML = allUsersTemplate(users)
    setupAdminUsers()
  })
}

function setupLogin() {
  navContentDiv.innerHTML = navbarTemplate(window.isLoggedIn)
  mainContentDiv.innerHTML = loginFormTemplate()
  setUpLoginForm()
}

function setupRegister() {
  navContentDiv.innerHTML = navbarTemplate(window.isLoggedIn)
  mainContentDiv.innerHTML = registerTemplate()
  setupRegisterForm()
}

function showSnacks() {
  navContentDiv.innerHTML = window.isAdmin? adminNavbarTemplate() : navbarTemplate(window.isLoggedIn)
  window.location.href = '#/snacks'
  setupSnacks().then((snacks) => {
    mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    toTop()
  })
}

function showOneSnack() {
  navContentDiv.innerHTML = window.isAdmin? adminNavbarTemplate() : navbarTemplate(window.isLoggedIn)
  const snackId = window.location.href.split('/')[5]
<<<<<<< HEAD
  if(snackId === 'new') {
    console.log('add a new snack')
    mainContentDiv.innerHTML = editOneSnackTemplate()
    setupEditSnackTemplateButtons()
  } else {
    getSnack(snackId).then((snack) => {
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
      setupSnackButtons() 
    })
  }
=======
  getSnack(snackId).then((snack) => {
    mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    setupSnackButtons() 
    toTop()
  })
>>>>>>> e699245149de6072504c6146965d61a8e2c66bb3
}

function showOneUser() {
  navContentDiv.innerHTML = window.isAdmin? adminNavbarTemplate() : navbarTemplate(window.isLoggedIn)
  const userId = window.location.href.split('/')[5]
  getUserReviews(userId).then((result) => {
    const { reviews } = result.data
    console.log(reviews)
    // mainContentDiv.innerHTML = viewUsersReviewsTemplate(reviews)
    toTop()
  })
}

function logOut() {
  window.localStorage.clear()
  window.isLoggedIn = false
  window.isAdmin = false
  redirectTo('#/login')
}

function setupLoggedOutView() {
  if (window.location.href.includes('#/login')) {
    setupLogin()
  } else if (window.location.href.includes('#/register')) {
    setupRegister()
  } if (window.location.href.endsWith('#/snacks')) {
    showSnacks()
  } else if (window.location.href.includes('#/snacks')) {
    showOneSnack()
  } else {
    showSnacks()
  }
}

function loadHome() {
  if (window.location.href.endsWith('#/snacks')) {
    showSnacks()
  } else if (window.location.href.includes('#/snacks')) {
    showOneSnack()
  } else if (window.location.href.includes('#/logout')) {
    logOut()
  } else if (window.location.href.includes('#/login')) {
    setupLogin()
  } else if (window.location.href.includes('#/register')) {
    setupRegister()
  } else if (window.location.href.includes('#/admin')) {
    setupAdmin()
  } else if (window.location.href.includes('#/users')) {
    showOneUser()
  } else { 
    showSnacks()
  }
  toTop()
}

function setupHome() {
  const token = window.localStorage.getItem('token')
  if (token) {
    getMyInfo(token).then((result) => {
      const user = result.data
      window.isLoggedIn = true
      window.isAdmin = user.admin
      if (window.isAdmin) {
        setupAdmin()
      } else {
        loadHome()
      }
    }).catch((err) => {
      window.localStorage.removeItem('token')
    })
  }

  else {
    setupLoggedOutView()
  } 
}

setupHome()
window.addEventListener('hashchange', loadHome, false)
