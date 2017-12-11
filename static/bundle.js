(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// pull all users template and turn into admin dashboard
const userRoutes = require('./requests/users')

function makeUserAdmin(e) {
  const token = window.localStorage.getItem('token')
  const userId = e.target.id.split('-')[2]
  userRoutes.edit(userId, { admin: true }, token).then((result) => {
    window.location.href = '#/admin'
  })
}

function deleteUser(e) {
  const token = window.localStorage.getItem('token')
  const userId = e.target.id.split('-')[2]
  // probably want to replace this with a fancy modal confirm instead of an ugly js confirm
  confirm('Are you sure?')
  userRoutes.delete(userId, token).then((result) => {
    window.location.href = '#/admin'
    window.location.reload()
  }).catch(console.error)
}

function setupAdminUsers() {
  Array.from(document.querySelectorAll('.admin-user')).forEach((userButton) => {
    userButton.addEventListener('click', makeUserAdmin)
  })
  Array.from(document.querySelectorAll('.delete-user')).forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteUser)
  })
}

module.exports = {
  setupAdminUsers,
}

},{"./requests/users":10}],2:[function(require,module,exports){
const snackRequests = require('./requests/snacks')

function setupSnacks() {
  return snackRequests.getAll()
    .then(result => result.data.snacks)
}

module.exports = {
  setupSnacks,
}

},{"./requests/snacks":9}],3:[function(require,module,exports){
const reviewRequests = require('./requests/reviews')

function averageSnackReview(snackId) {
  return reviewRequests.getAverageSnackReview(snackId)
    .then(result => result.data[0])
}

module.exports = {
  averageSnackReview,
}

},{"./requests/reviews":8}],4:[function(require,module,exports){
const baseURL = 'https://snack-team-deploy.herokuapp.com'

module.exports = {
  baseURL,
}

},{}],5:[function(require,module,exports){
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

},{"./requests/users":10}],6:[function(require,module,exports){
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
  find: getUserInfo,
} = require('./requests/users')

const { getAllForUser: getUserReviews } = require('./requests/reviews')

const { adminNavbarTemplate } = require('./templates/adminNavbar')
const { allUsersTemplate } = require('./templates/allUsers')
const { viewOneUserTemplate } = require('./templates/viewOneUser')
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
  navContentDiv.innerHTML = window.isAdmin
    ? adminNavbarTemplate()
    : navbarTemplate(window.isLoggedIn)
  window.location.href = '#/snacks'
  setupSnacks().then((snacks) => {
    mainContentDiv.innerHTML = allSnacksTemplate(snacks)
    toTop()
  })
}

function showOneSnack() {
  navContentDiv.innerHTML = window.isAdmin
    ? adminNavbarTemplate()
    : navbarTemplate(window.isLoggedIn)
  const snackId = window.location.href.split('/')[5]
  if (snackId === 'new') {
    mainContentDiv.innerHTML = editOneSnackTemplate()
    setupEditSnackTemplateButtons()
  } else {
    getSnack(snackId).then((snack) => {
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
      setupSnackButtons()
    })
  }
}

function showOneUser() {
  const token = window.localStorage.getItem('token')
  navContentDiv.innerHTML = window.isAdmin
    ? adminNavbarTemplate()
    : navbarTemplate(window.isLoggedIn)
  const userId = window.location.href.split('/')[5]

  const userPromise = getUserInfo(userId, token)
  const reviewsPromise = getUserReviews(userId)

  Promise.all([userPromise, reviewsPromise]).then((result) => {
    const [{ data: { users: user } }, { data: { reviews } }] = result
    mainContentDiv.innerHTML = viewOneUserTemplate(user, reviews)
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

},{"./admin":1,"./allSnacks":2,"./login":5,"./register":7,"./requests/reviews":8,"./requests/users":10,"./templates/adminNavbar":11,"./templates/allSnacks":12,"./templates/allUsers":13,"./templates/editSnack":14,"./templates/loginForm":15,"./templates/navbar":16,"./templates/registerForm":17,"./templates/viewOneSnack":21,"./templates/viewOneUser":22,"./viewOne":23}],7:[function(require,module,exports){
const userRequests = require('./requests/users')

function processRegisterForm(e) {
  if (e.preventDefault) e.preventDefault()
  const fname = e.srcElement[0].value
  const lname = e.srcElement[1].value
  const email = e.srcElement[2].value
  const password = e.srcElement[3].value

  userRequests.register({
    first_name: fname,
    last_name: lname,
    email,
    password,
  })
    .then((result) => {
      window.localStorage.setItem('token', result.data.token)
      window.isLoggedIn = true
      window.location.href = '#/snacks'
    })
    .catch((err) => {
      document.getElementById('used-email-error').classList.remove('hidden')
    })
}

function setupRegisterForm() {
  const loginButton = document.getElementById('login')
  loginButton.addEventListener('click', (e) => {
    window.location.href = '#/login'
  })
  const form = document.getElementById('signupForm')
  if (form.attachEvent) form.attachEvent('submit', processRegisterForm)
  else form.addEventListener('submit', processRegisterForm)
}

module.exports = {
  processRegisterForm,
  setupRegisterForm,
}

},{"./requests/users":10}],8:[function(require,module,exports){
const axios = require('axios')
const { baseURL } = require('../constants')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/reviews`)
    },
    getAllForSnack(id) {
        return axios.get(`${baseURL}/api/snacks/${id}/reviews`)
    },
    getAverageSnackReview(id) {
        return axios.get(`${baseURL}/api/reviews/avg/${id}`)
    },
    getAllForUser(id, token) {
        return axios.get(`${baseURL}/api/users/${id}/reviews`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    find(id) {
        return axios.get(`${baseURL}/api/reviews/${id}`)
    },
    create(body, token) {
        return axios.post(`${baseURL}/api/reviews`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    update(id, body, token) {
        return axios.put(`${baseURL}/api/reviews/${id}`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/reviews/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    }
}


},{"../constants":4,"axios":24}],9:[function(require,module,exports){
const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/snacks`)
    },
    find(id) {
        return axios.get(`${baseURL}/api/snacks/${id}`)
    },
    create(body, token) {
        return axios.post(`${baseURL}/api/snacks`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    update(id, body, token) {
        return axios.put(`${baseURL}/api/snacks/${id}`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/snacks/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    }
}

},{"../constants":4,"axios":24}],10:[function(require,module,exports){
const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getUser(token) {
        return axios.get(`${baseURL}/auth`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    getAll(token) {
        return axios.get(`${baseURL}/api/users`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    find(id, token) {
        return axios.get(`${baseURL}/api/users/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    edit(id, body, token) {
        return axios.patch(`${baseURL}/api/users/${id}`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/users/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    register(body) {
        return axios.post(`${baseURL}/auth/register`, body)
    },
    login(body) {
        return axios.post(`${baseURL}/auth/login`, body)
    }  
}
},{"../constants":4,"axios":24}],11:[function(require,module,exports){
function adminNavbarTemplate() {
  return `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-grey scrolling-navbar">
        <a class="navbar-brand" href="#/snacks"><strong>Galvanize Snacks</strong></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/snacks">All Snacks</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/user">My Reviews</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/snacks/new">Add Snack</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/admin">All Users</a>
                </li>
            </ul>
            <ul class="navbar-nav nav-flex-icons">
                <li class="nav-item">
                    <a class="nav-link loginLink" href="#/logout">Log Out</i></a>
                </li>
            </ul>
        </div>
    </nav>
    `
}

module.exports = {
  adminNavbarTemplate,
}

},{}],12:[function(require,module,exports){
function allSnacksTemplate(snacks) {
  const snackDivContent = snacks.map(snack => `<div class='row allSnackRow'> <div class='row'>
        <div class='col-8'>
          <h3><a href='#/snacks/${snack.id}'>${snack.name}</a></h3>
          
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

},{}],13:[function(require,module,exports){
function allUsersTemplate(users) {
  const userDivContent = users.map(user => `<div class='row allSnackRow'>
        <div class='row userRow'>
          <div class='col-4'>
            <img src='images/user.png' alt='picture of user' class='userListImg'>
          </div>
          <div class='col-8'>
            <p>${user.first_name} ${user.last_name}</p>
            <p>${user.email}</p>
            <p>Average User Rating: <strong>5</strong></p>
            <p>Admin: ${user.admin}</p>
            <a href='/#/users/${user.id}/reviews'><p>User's Reviews Link</p></a>
            <ul>
              ${user.admin ? '' : `<li><button class='delete-user' id='delete-user-${user.id}'>Delete</button></li>`}
              ${user.admin ? '' : `<li><button class='admin-user' id='admin-user-${user.id}'>Make Admin</button></li>`}
            </ul>
          </div>
        </div>
      </div>`)

  return `<div class='container-fluid mainBody'>
    <div class='row allSnackRow'>
      <div class='col-12'>
        <h1>All Users</h1>
      </div>
    </div>

    ${userDivContent}`
}

module.exports = {
  allUsersTemplate,
}

},{}],14:[function(require,module,exports){
function editOneSnackTemplate(snack) {
  if (!snack) snack = {
    id: null,
    name: '',
    img: '', 
    description: '',
    isPerishable: false
  }
  const editText = snack.id ? `Edit Snack ${snack.id}` : 'Add Snack'
  const formId = snack.id ? `edit-snack-${snack.id}` : 'add-snack'
  return `
  <div class='container-fluid infoBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>${editText}</p>
      </div>
    </div>
    <div class='textInputs'>
      <form id=${formId}>
        
        <div class='inputLine'>
          <p class='strongP'>Name: </p><input class='formInput' id='snack_name' type='text' placeholder='Name' value='${snack.name}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Image: </p><input class='formInput' id='snack_img' type='text' placeholder='An image of the snack.' value='${snack.img}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><input class='formInput' id='snack_price' type='text' placeholder='Price' value='${snack.price}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Description: </p><input class='formInput' id='snack_description' type='text' 
            placeholder='Gingerbread cake jelly pudding jelly beans. Fruitcake gingerbread wafer wafer gingerbread apple pie marshmallow. Biscuit jelly cookie dragée brownie dessert carrot cake macaroon bonbon. Unerdwear.com liquorice marshmallow fruitcake caramels dessert gingerbread.'
            value='${snack.description}'  
          >
        </div>
        <div class='inputLine'>
          <p class='strongP'>Perishable: </p>  
          <input type='checkbox' id='snack_is_perish' checked=${snack.isPerishable}>
        </div>
        <input type='submit' value='Add/Edit'>
      </form>
    </div>
  </div>`
}

module.exports = {
  editOneSnackTemplate,
}

},{}],15:[function(require,module,exports){

function loginFormTemplate() {
  return `
    <div class='loginBox animated fadeIn'>
      <div class='inputLine'>
        <p>Log in for Snacks!</p>
        <hr>
      </div>
      <form id='loginForm'>
        <div class='inputLine'>
          <p>Email: </p><input class='formInput' type='email' placeholder='Email Address' value='admin@example.com'>
        </div>
        <div class='inputLine'>
          <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf1234'>
        </div>
        <div class='inputLine'>
          <input id="checkBox" type="checkbox" checked><p class='rememberMe'>Remember me?</p>
        </div>
        <blockquote id='login-error' class="blockquote bq-danger hidden">
            <small class='danger'>Please check your email and password and try again.</small>
        </blockquote>
        <input type='submit' class='btn btn-info' value='Log in!'>
        <a href='#/register' class='btn btn-warning'>Need to register? click here.</a>
      </form>
    </div>`
}

module.exports = {
  loginFormTemplate,
}

},{}],16:[function(require,module,exports){
function navbarTemplate(loggedIn) {
    let logLink
    if(loggedIn) {
        logLink = `<a class="nav-link loginLink" id="loginLink" href='#/logout'>Log Out</i></a>`
    } else {
        logLink = `<a class='nav-link loginLink' id='loginLink' href='#/login'>Log In</i></a>`
    }
  return `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-grey scrolling-navbar">
        <a class="navbar-brand" href="#"><strong>Galvanize Snacks</strong></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/snacks">All Snacks</a>
                </li>
                ${loggedIn ? `<li class="nav-item">
                    <a class="nav-link" href="#/user/reviews">My Reviews</a>
                </li>` : ``}
            </ul>
            <ul class="navbar-nav nav-flex-icons">
                <li class="nav-item">
                    ${logLink}
                </li>
                ${!loggedIn ? `<li class="nav-item">
                    <a class="nav-link" href="#/register">Register</a>
                </li>` : ``}
            </ul>
        </div>
    </nav>
    `
}

module.exports = {
  navbarTemplate,
}

},{}],17:[function(require,module,exports){

function registerTemplate() {
  return `
    <div class='signupBox animated fadeIn'>
      <div class='inputLine'>
        <p>Sign up for Snacks!</p>
        <hr>
      </div>
      <form id='signupForm'>
        <div class='inputLine'>
          <p>First Name: </p><input class='formInput' type='text' placeholder='First Name' value='Kat'>
        </div>
        <div class='inputLine'>
        <p>Last Name: </p><input class='formInput' type='text' placeholder='Last Name' value='Example'>
      </div>
        <div class='inputLine'>
          <p>Email: </p><input class='formInput' type='email' placeholder='Email Address' value='kat@example.com'>
        </div>
        <blockquote id='used-email-error' class="blockquote bq-danger hidden">
            <small class='danger'>That email is already taken.</small>
        </blockquote>
        <div class='inputLine'>
          <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf1234'>
        </div>
        
        <input type='submit' value='Sign up!' class='btn btn-info'>
        <button class='btn btn-warning' id='login' href='#/login'>Already registered? Login here!</button>  
      </form>
      
    </div>`
}

module.exports = {
  registerTemplate,
}

},{}],18:[function(require,module,exports){
function addEditSnackReviewTemplate(snack, review) {
  if (!review) {
    review = {
      title: '',
      text: '',
      rating: 3,
      snack_id: snack.id,
    }
  }
  return `
  <div class='container-fluid reviewBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>Review ${snack.name}</p>
      </div>
    </div>
    <div class='snackImg'>
      <img src='${snack.img}' width=300 alt='a picture of ${snack.name}'>
    </div>
    <div class='textInputs'>
      <form id='add-review-${snack.id}'>
        <div class='inputLine'>
          <p class='strongP'>ID Number: </p><span>${snack.id}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${snack.name}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p>
          <select name="review-rating" value=${review.rating} id='review-rating'>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><span>${snack.price}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review Title: </p><input class='formInput' id='review-title' type='text' placeholder='Awesome snack!' value='${review.title}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><input class='formInput' id='review-text' type='text' placeholder='Tastes great!' value='${review.text}'>
        </div>
        <input type='submit' value='Submit Review!' class='submitButton'>
      </form>
    </div>
  </div>`
}

module.exports = {
  addEditSnackReviewTemplate,
}

},{}],19:[function(require,module,exports){

function snackReviewTemplate(review) {
  return `<div class='container-fluid reviewBox'>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${review.user_id}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Title: </p><span>${review.title}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p><span>${review.rating}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><span>${review.text}</span>
        </div>
      </div>
      
    </div>`
}

module.exports = {
  snackReviewTemplate,
}

},{}],20:[function(require,module,exports){
function userReviewTemplate(review) {
  return `<div class='container-fluid reviewBox'>
      <div class='title'>
        <p class='strongP'>${review.snack_id}</p>
      </div>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Title: </p><span>${review.title}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p><span>${review.rating}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><span>${review.text}</span>
        </div>
      </div>
      <button class='btn btn-info btn-sm disabled' id='delete-${review.id}'>Delete This Review</button>
    </div>`
}

module.exports = {
  userReviewTemplate,
}

},{}],21:[function(require,module,exports){
const { snackReviewTemplate } = require('./snackReviews')

function viewOneSnackTemplate(snack) {
  const adminButtons = window.isAdmin ? `
    <button class='btn btn-sm btn-warning' id='edit-${snack.id}'>Edit Snack</button>
    <button class='btn btn-sm btn-danger' id='delete-${snack.id}'>Delete Snack</button>
  ` : ``
  const reviewButton = window.isLoggedIn
    ? `<button class='btn btn-info btn-sm' id='review-${snack.id}'>Review ${snack.name}</button>`
    : ''
  const snackReviews = snack.reviews
    ? snack.reviews.map(review => snackReviewTemplate(review)).join('')
    : ''
  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <h3 class='strongP pt-2'>${snack.name}</h3>
      </div>
      <div class='snackImg'>
        <img src='${snack.img}' width=300 alt='a picture of ${snack.name}'>
      </div>
      <div>
        <div class='inputLine'>
          <p>ID Number: <span class='strongP'>${snack.id}</span></p>
        </div>
        <div class='inputLine'>
          <p>Name: <span class='strongP'>${snack.name}</span></p>
        </div>
        <div class='inputLine'>
          <p>Average Rating: <span class='strongP'>${snack.averageRating}</span></p>
        </div>
        <div class='inputLine'>
          <p>Price: <span class='strongP'>${snack.price}</span></p>
        </div>
        <div class='inputLine'>
          <p>Description: <span class='strongP'>${snack.description}</span></p>
        </div>
        
      </div>
      ${reviewButton} ${adminButtons}
      
    </div>
    ${snackReviews}
    `
}

module.exports = {
  viewOneSnackTemplate,
}

},{"./snackReviews":19}],22:[function(require,module,exports){
const { userReviewTemplate } = require('./userReviews')

function viewOneUserTemplate(user, reviews) {
  const reviewTemplate = reviews.map(review => userReviewTemplate(review)).join('')

  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <pclass='strongP'>${user.first_name} ${user.last_name}</p>
      </div>
      <div class='snackImg'>
        <img src="https://picsum.photos/360?image=1027">
      </div>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${user.first_name} ${user.last_name}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Email: </p><span>${user.email}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'># of Reviews: </p><span>${reviews.length}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Delete User? </p><a href=''>Yes</a>
        </div>
      </div>
    </div>
    ${reviewTemplate}
    `
}

module.exports = {
  viewOneUserTemplate,
}

},{"./userReviews":20}],23:[function(require,module,exports){
const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')
const userRequests = require('./requests/users')

const { editOneSnackTemplate } = require('./templates/editSnack')
const { addEditSnackReviewTemplate } = require('./templates/reviewSnack')
const { viewOneSnackTemplate } = require('./templates/viewOneSnack')

const { averageSnackReview } = require('./averageReview')

const {
  update: editSnackRequest,
  create: createNewSnackRequest,
  delete: deleteSnackRequest,
} = require('./requests/snacks')

const mainContentDiv = document.getElementById('main-content')

function getSnack(id) {
  const snackReviewPromise = reviewsRequests.getAllForSnack(id)
  const snackPromise = snackRequests.find(id)

  return Promise.all([snackReviewPromise, snackPromise]).then((result) => {
    const [{ data: snackReviews }, { data: { snacks } }] = result
    return averageSnackReview(id).then((average) => {
      snacks.reviews = snackReviews.reviews
      snacks.averageRating = parseFloat(average.avg)
      return snacks
    })
  })
}

function getUpdatedInfo() {
  const name = document.getElementById('snack_name').value
  const img = document.getElementById('snack_img').value
  const price = document.getElementById('snack_price').value
  const description = document.getElementById('snack_description').value
  const isPerishable = document.getElementById('snack_is_perish').value
  return {
    name,
    img,
    price,
    description,
    is_perishable: isPerishable,
  }
}

function handleEditSnack(e) {
  e.preventDefault()
  const token = window.localStorage.getItem('token')
  const snackId = window.location.hash.split('/')[2]
  const updatedSnack = getUpdatedInfo()

  editSnackRequest(snackId, updatedSnack, token).then((result) => {
    mainContentDiv.innerHTML = viewOneSnackTemplate(updatedSnack)
  }).catch(console.error)
}

function getSnackReviewFromForm() {
  const rating = document.getElementById('review-rating').value
  const title = document.getElementById('review-title').value
  const text = document.getElementById('review-text').value

  return {
    rating, title, text,
  }
}

function handleAddEditReview(user, snack, userReview) {
  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')
  const snackReview = getSnackReviewFromForm()
  snackReview.snack_id = snackId
  snackReview.user_id = user.id
  if (userReview) {
    reviewsRequests.update(userReview.id, snackReview, token).then((response) => {
      reviewsRequests.getAllForSnack(snackId).then((snackReviews) => {
        const { data: { reviews: updatedReviews } } = snackReviews
        snack.reviews = updatedReviews
        mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
      })
    })
  } else {
    reviewsRequests.create(snackReview, token).then((response) => {
      snack.reviews.push(snackReview)
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    }).catch(console.error)
  }
}

function handleSnackReview(e) {
  e.preventDefault()

  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')

  const snackPromise = getSnack(snackId)
  const userPromise = userRequests.getUser(token)
  const reviewsPromise = reviewsRequests.getAllForSnack(snackId)

  Promise.all([snackPromise, userPromise, reviewsPromise]).then((result) => {
    const [snack, { data: user }, { data: { reviews } }] = result
    const userReview = reviews.find(review => (
      review.user_id === user.id && review.snack_id === snack.id))
    if (userReview) {
      mainContentDiv.innerHTML += addEditSnackReviewTemplate(snack, userReview)
    } else {
      mainContentDiv.innerHTML += addEditSnackReviewTemplate(snack)
    }

    document.getElementById(`add-review-${snack.id}`).addEventListener('submit', (ev) => {
      ev.preventDefault()
      handleAddEditReview(user, snack, userReview)
    })
  })
}

function handleDeleteSnack(e) {
  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')
  e.preventDefault()
  deleteSnackRequest(snackId, token).then((result) => {
    window.location.hash = '#/snacks'
  }).catch(console.error)
}

function handleEditSnackClick(e) {
  e.preventDefault()
  const snackId = window.location.hash.split('/')[2]
  getSnack(snackId).then((snack) => {
    mainContentDiv.innerHTML += editOneSnackTemplate(snack)
    document.getElementById(`edit-snack-${snackId}`).addEventListener('submit', handleEditSnack)
  })
}

function setupSnackButtons() {
  const snackId = window.location.hash.split('/')[2]
  if (window.isAdmin) {
    document.getElementById(`edit-${snackId}`).addEventListener('click', handleEditSnackClick)
    document.getElementById(`delete-${snackId}`).addEventListener('click', handleDeleteSnack)
  }
  if (window.isLoggedIn) {
    document.getElementById(`review-${snackId}`).addEventListener('click', handleSnackReview)
  }
}

function setupEditSnackTemplateButtons() {
  document.getElementById('add-snack').addEventListener('submit', (e) => {
    e.preventDefault()
    const newSnack = getUpdatedInfo()
    const token = window.localStorage.getItem('token')
    createNewSnackRequest(newSnack, token).then((result) => {
      const newSnackId = result.data.snack[0].id
      window.location.href = `#/snacks/${newSnackId}`
    }).catch(console.error)
  })
}

module.exports = {
  getSnack,
  setupSnackButtons,
  setupEditSnackTemplateButtons,
}

},{"./averageReview":3,"./requests/reviews":8,"./requests/snacks":9,"./requests/users":10,"./templates/editSnack":14,"./templates/reviewSnack":18,"./templates/viewOneSnack":21}],24:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":26}],25:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

}).call(this,require('_process'))
},{"../core/createError":32,"./../core/settle":35,"./../helpers/btoa":39,"./../helpers/buildURL":40,"./../helpers/cookies":42,"./../helpers/isURLSameOrigin":44,"./../helpers/parseHeaders":46,"./../utils":48,"_process":50}],26:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":27,"./cancel/CancelToken":28,"./cancel/isCancel":29,"./core/Axios":30,"./defaults":37,"./helpers/bind":38,"./helpers/spread":47,"./utils":48}],27:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],28:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":27}],29:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],30:[function(require,module,exports){
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":37,"./../utils":48,"./InterceptorManager":31,"./dispatchRequest":33}],31:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":48}],32:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":34}],33:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":29,"../defaults":37,"./../helpers/combineURLs":41,"./../helpers/isAbsoluteURL":43,"./../utils":48,"./transformData":36}],34:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],35:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":32}],36:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":48}],37:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":25,"./adapters/xhr":25,"./helpers/normalizeHeaderName":45,"./utils":48,"_process":50}],38:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],39:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],40:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":48}],41:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],42:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":48}],43:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],44:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":48}],45:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":48}],46:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":48}],47:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],48:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":38,"is-buffer":49}],49:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],50:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[6]);
