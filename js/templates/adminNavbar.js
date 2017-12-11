function adminNavbarTemplate() {
  return `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-grey scrolling-navbar">
        <a class="navbar-brand" href="#/snacks"><strong>Galvanize Snacks</strong></a>
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
                <!--<li class="nav-item">
                    <a class="nav-link" href="#/user">My Reviews</a>
                </li>-->
                <li class="nav-item">
                    <a class="nav-link" href="#/snacks/new">Add Snack</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#/admin">All Users</a>
                </li>
            </ul>
            <ul class="navbar-nav nav-flex-icons">
                <li class="nav-item">
                    <a class="nav-link loginLink" href="#/logout">Log Out</i></a>
                </li>
            </ul>
        </div>
    </nav>
    `
}

module.exports = {
  adminNavbarTemplate,
}
