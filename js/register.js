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
