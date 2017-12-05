const baseURL = 'localhost:3000'

function processForm(e) {
    if (e.preventDefault) e.preventDefault()
    const name = e.srcElement[0].value
    const email = e.srcElement[1].value
    const password = e.srcElement[2].value

    axios.post(`${baseURL}/register`, { name: name, email: email, password: password })
        .then(result => {
            
        })
    return false
}

var form = document.getElementById('signupForm')

if (form.attachEvent) form.attachEvent("submit", processForm)
else form.addEventListener("submit", processForm)