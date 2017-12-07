
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
        <div class='inputLine'>
          <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf1234'>
        </div>
        <input type='submit' value='Sign up!' class='btn btn-info'>
      </form>
      <button class='btn btn-warning btn-sm' id='login' href='#/login'>Already registered? Login here!</button>
    </div>`
}

module.exports = {
  registerTemplate,
}
