
function loginFormTemplate() {
  return `
    <div class='loginBox animated fadeIn hidden'>
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
