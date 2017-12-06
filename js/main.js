const page = require('page')

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


function home(ctx, next) {
  console.log(ctx)
  console.log('home')

  // navContentDiv.innerHTML = navbarTemplate()
  // setupSnacks().then((snacks) => {
  //   mainContentDiv.innerHTML = allSnacksTemplate(snacks)
  // })
}

function snacks(ctx, next) {

  console.log('snacks')
  console.log(ctx)
}

page.base('/')
page('/home', home)
page('/snacks', snacks)
// function setupHome() {
//   const token = window.localStorage.getItem('token')
//   if (!token) {
//     mainContentDiv.innerHTML = registerTemplate()
//     setupRegisterForm()
//   }
//   if (window.location.href.endsWith('/#/')) {
//     window.location.href = '/#/snacks'
//   } else if (window.location.href.includes('#/login')) {
//     mainContentDiv.innerHTML = loginFormTemplate()
//     setUpLoginForm()
//   } else if (window.location.href.endsWith('#/snacks')) {
//     navContentDiv.innerHTML = navbarTemplate()
//     setupSnacks().then((snacks) => {
//       mainContentDiv.innerHTML = allSnacksTemplate(snacks)
//     })
//   } else if (window.location.href.includes('#/snacks')) {
//     navContentDiv.innerHTML = navbarTemplate()
//     const snackId = window.location.href.split('/')[5]
//     getSnack(snackId).then((snack) => {
//       mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
//     })
//   } else if (window.location.href.includes('#/logout')) {
//     window.localStorage.removeItem('token')
//     window.location.href = '#' 
//     mainContentDiv.innerHTML = registerTemplate()
//     setupRegisterForm()
//   }
// }

// setupHome()
// window.addEventListener('hashchange', setupHome, false)
