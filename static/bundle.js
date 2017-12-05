(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const { baseURL } = require('./constants')


function setupSnacks() {
  return axios.get(`${baseURL}/api/snacks`)
    .then(result => result.data.snacks)
}

module.exports = {
  setupSnacks,
}


},{"./constants":2}],2:[function(require,module,exports){
const baseURL = window.location.href.includes('127.0.0.1') ? 'http://localhost:3000' : ''

module.exports = {
  baseURL,
}

},{}],3:[function(require,module,exports){
const { baseURL } = require('./constants')

function processLoginForm(e) {
    if (e.preventDefault) e.preventDefault()
    const email = e.srcElement[0].value
    const password = e.srcElement[1].value
    const rememberMe = e.srcElement[2].checked
    console.log({ email, password })
    axios.post(`${baseURL}/auth/login`, { email: email, password: password })
        .then(result => {
            window.localStorage.setItem('token', result.data.token)
            window.location.href = '#/snacks'
        })
        .catch(err => {
            console.error(err)
        })
    return false
}

function setUpLoginForm () {
    const form = document.getElementById('loginForm')
    
    if (form.attachEvent) form.attachEvent("submit", processLoginForm)
    else form.addEventListener("submit", processLoginForm)
}

module.exports = {
    processLoginForm,
    setUpLoginForm,
}

},{"./constants":2}],4:[function(require,module,exports){
// const { baseURL } = require('./constants')

const { setupRegisterForm } = require('./register')
const { setUpLoginForm } = require('./login')

const { registerTemplate } = require('./templates/registerForm')
const { loginFormTemplate } = require('./templates/loginForm')

const { navbarTemplate } = require('./templates/navbar')
const { allSnacksTemplate } = require('./templates/allSnacks')

const { setupSnacks } = require('./allSnacks')

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
} else {
  navContentDiv.innerHTML = navbarTemplate()
  setupSnacks().then((snacks) => {
    mainContentDiv.innerHTML = allSnacksTemplate(snacks)
  })
}

},{"./allSnacks":1,"./login":3,"./register":5,"./templates/allSnacks":6,"./templates/loginForm":7,"./templates/navbar":8,"./templates/registerForm":9}],5:[function(require,module,exports){
const { baseURL } = require('./constants')

function processRegisterForm(e) {
    if (e.preventDefault) e.preventDefault()
    const fname = e.srcElement[0].value
    const lname = e.srcElement[1].value
    const email = e.srcElement[2].value
    const password = e.srcElement[3].value

    axios.post(`${baseURL}/auth/register`, { first_name: fname, last_name: lname, email: email, password: password })
        .then(result => {
            window.location.href = '#/login'
        })
        .catch(err => {
            console.error(err) 
            
        })
    return false
}

function setupRegisterForm() {
    const form = document.getElementById('signupForm')
    
    if (form.attachEvent) form.attachEvent("submit", processRegisterForm)
    else form.addEventListener("submit", processRegisterForm)
}

module.exports = {
    processRegisterForm,
    setupRegisterForm,
}

},{"./constants":2}],6:[function(require,module,exports){
function allSnacksTemplate(snacks) {
  const snackDivContent = snacks.map(snack => `<div class='row allSnackRow'> <div class='row'>
        <div class='col-8'>
          <p><a href='#/snacks/${snack.id}'>${snack.name}</a></p>
          <p>Average User Rating: <strong>5</strong></p>
          <p>Price: <strong>${snack.price}</strong></p>
          <p>Description: <strong>${snack.description}</strong></p>
        </div>
        <div class='col-4'>
          <img src='${snack.img}' width=250 alt='a picture of ${snack.name}'>
        </div>
      </div></div>`).join('')
      
  return `<div class='container-fluid mainBody'>
  <div class='row allSnackRow'>
    <div class='col-12'>
      <h1>All Snacks!</h1>
    </div>
  </div>

  ${snackDivContent}`
}

module.exports = {
  allSnacksTemplate,
}

},{}],7:[function(require,module,exports){

function loginFormTemplate() {
  return `
  <div class='signupBox'>
    <div class='inputLine'>
      <p>Log in for Snacks!</p>
      <hr>
    </div>
    <form id='loginForm'>
      <div class='inputLine'>
        <p>Email: </p><input class='formInput' type='email' placeholder='Email Address' value='kat@example.com'>
      </div>
      <div class='inputLine'>
        <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf1234'>
      </div>
      <div class='inputLine'>
        <input id="checkBox" type="checkbox" checked><p class='rememberMe'>Remember me?</p>
      </div>
      <input type='submit' value='Log in!'>
    </form>
  </div>`
}

module.exports = {
  loginFormTemplate,
}

},{}],8:[function(require,module,exports){
function navbarTemplate() {
  return `<div class='container-fluid navigation'>
  <div class='row'>
    <div class='col-10'>
      <ul>
        <a href='/#/'><li>Home</li></a>
        <a href='/#/index'><li>View All</li></a>
        <a href='/#/edit'><li>Add/Edit</li></a>
      </ul>
    </div>
    <div class='col-2'>
      <a href=''>Log Out</a>
    </div>
  </div>
</div>`
}

module.exports = {
  navbarTemplate,
}

},{}],9:[function(require,module,exports){

function registerTemplate() {
  return `<div class='signupBox'>
      <div class='inputLine'>
        <p>Sign up for Snacks!</p>
        <hr>
      </div>
      <form id='signupForm'>
        <div class='inputLine'>
          <p>First Name: </p>
          <input class='formInput' type='text' placeholder='First Name' value='asdf'>
        </div>
        <div class='inputLine'>
          <p>Last Name: </p>
          <input class='formInput' type='text' placeholder='Last Name' value='ghjkl'>
        </div>
        <div class='inputLine'>
          <p>Email: </p><input class='formInput' type='email' placeholder='Email Address' value='asdf@example.com'>
        </div>
        <div class='inputLine'>
          <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf'>
        </div>
        <input type='submit' value='Sign up!'>
      </form>
    </div>`
}

module.exports = {
  registerTemplate,
}

},{}]},{},[4]);
