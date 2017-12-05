const { baseURL } = require('./constants')
const axios = require('axios')

function processLoginForm(e) {
    if (e.preventDefault) e.preventDefault()
    const email = e.srcElement[0].value
    const password = e.srcElement[1].value
    const rememberMe = e.srcElement[2].checked
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
