
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
        <input type='submit' class="btn btn-success" value='Sign up!'>
      </form>
      <button class="btn btn-info btn-sm" id="login">Already signed up? Login here.</button>
    </div>`
}

module.exports = {
  registerTemplate,
}
