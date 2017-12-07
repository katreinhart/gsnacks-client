
function registerTemplate() {
  return `
    <div class='signupBox animated fadeIn hidden'>
      <div class='inputLine'>
        <p>Sign up for Snacks!</p>
        <hr>
      </div>
      <form id='signupForm'>
        <div class='inputLine'>
          <p>Name: </p><input class='formInput' type='text' placeholder='Name' value='Kat Cool'>
        </div>
        <div class='inputLine'>
          <p>Email: </p><input class='formInput' type='email' placeholder='Email Address' value='kat@example.com'>
        </div>
        <div class='inputLine'>
          <p>Password: </p><input class='formInput' type='password' placeholder='Password' value='asdf1234'>
        </div>
        <input type='submit' value='Sign up!'>
      </form>
    </div>`
}

module.exports = {
  registerTemplate,
}
