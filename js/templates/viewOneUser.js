const { userReviewTemplate } = require('./userReviews')

function viewOneUserTemplate(user, reviews) {
  const reviewTemplate = reviews.map(review => userReviewTemplate(review)).join('')

  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <pclass='strongP'>${user.first_name} ${user.last_name}</p>
      </div>
      <div class='snackImg'>
        <p>Replace with img of user</p>
      </div>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${user.first_name} ${user.last_name}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Email: </p><span>${user.email}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'># of Reviews: </p><span>${reviews.length}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Delete User? </p><a href=''>Yes</a>
        </div>
      </div>
    </div>
    ${reviewTemplate}
    `
}

module.exports = {
  viewOneUserTemplate,
}
