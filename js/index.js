// const { baseURL } = require('./constants')
// const axios = require('axios')

const signupLink = document.getElementsByClassName('signupLink')[0]
const loginLink = document.getElementsByClassName('loginLink')[0]

const signupBox = document.getElementsByClassName('signupBox')[0]
const loginBox = document.getElementsByClassName('loginBox')[0]

signupLink.addEventListener('click', signupPop)
loginLink.addEventListener('click', loginPop)

const submit0 = document.getElementsByTagName('form')[0]
const submit1 = document.getElementsByTagName('form')[1]
const allSubmits = [submit0, submit1]
allSubmits.forEach(e => {
  e.addEventListener('submit', whichButton)
})

function whichButton(e){
  console.log(e.srcElement)
  if (e.srcElement.id == 'signupForm'){
    processSignupForm(e)
  } else if(e.srcElement.id == 'loginForm'){
    processLoginForm(e)
  }
}

function processLoginForm(e) {
  if (e.preventDefault) e.preventDefault()
  const email = e.srcElement[0].value
  const password = e.srcElement[1].value
  const rememberMe = e.srcElement[2].checked
  axios.post(`${baseURL}/auth/login`, { email, password })
    .then((result) => {
      if (rememberMe) {
        window.localStorage.setItem('token', result.data.token)
      }
      window.location.href = '#/snacks'
    })
    .catch((err) => {
      console.error(err)
    })
  return false
}

function processSignupForm(e) {
  if (e.preventDefault) e.preventDefault()
  const fname = e.srcElement[0].value
  const lname = e.srcElement[1].value
  const email = e.srcElement[2].value
  const password = e.srcElement[3].value

  axios.post(`${baseURL}/auth/register`, { first_name: fname, last_name: lname, email, password })
    .then((result) => {
      window.location.href = '#/login'
    })
    .catch((err) => {
      console.error(err)             
    })
  return false
}

function signupPop(){
  if (!loginBox.classList.contains('hidden')) loginBox.classList.add('hidden')
  signupBox.classList.contains('hidden') ? signupBox.classList.remove('hidden') : signupBox.classList.add('hidden')
}

function loginPop(){
  if (!signupBox.classList.contains('hidden')) signupBox.classList.add('hidden')
  loginBox.classList.contains('hidden') ? loginBox.classList.remove('hidden') : loginBox.classList.add('hidden')
}

module.exports = {
  processLoginForm,
  setUpLoginForm
}
