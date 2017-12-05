const baseURL = 'localhost:3000'

function processForm(e) {
    if (e.preventDefault) e.preventDefault()
    const email = e.srcElement[0].value
    const password = e.srcElement[1].value
    const rememberMe = e.srcElement[2].checked

    axios.post(`${baseURL}/login`, { email: email, password: password })
        .then(result => {
            
        })
    return false
}

var form = document.getElementById('loginForm')

if (form.attachEvent) form.attachEvent("submit", processForm)
else form.addEventListener("submit", processForm)