
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
