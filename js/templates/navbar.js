function navbarTemplate(loggedIn) {
    let logLink
    if(loggedIn) {
        logLink = `<a class="nav-link loginLink" id="loginLink" href='#/logout'>Log Out</i></a>`
    } else {
        logLink = `<a class='nav-link loginLink' id='loginLink' href='#/login'>Log In</i></a>`
    }
  return `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-grey scrolling-navbar">
        <a class="navbar-brand" href="#"><strong>Galvanize Snacks</strong></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/snacks">All Snacks</a>
                </li>
                ${loggedIn ? `<li class="nav-item">
                    <a class="nav-link" href="#/user/reviews">My Reviews</a>
                </li>` : ``}
            </ul>
            <ul class="navbar-nav nav-flex-icons">
                <li class="nav-item">
                    ${logLink}
                </li>
                ${!loggedIn ? `<li class="nav-item">
                    <a class="nav-link" href="#/register">Register</a>
                </li>` : ``}
            </ul>
        </div>
    </nav>
    `
}

module.exports = {
  navbarTemplate,
}
