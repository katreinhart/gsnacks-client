const { snackReviewTemplate } = require('./snackReviews')

function viewOneSnackTemplate(snack) {
  const adminButtons = window.isAdmin ? `
    <button class='btn btn-sm btn-warning' id='edit-${snack.id}'>Edit Snack</button>
    <button class='btn btn-sm btn-danger' id='delete-${snack.id}'>Delete Snack</button>
  ` : ``
  const reviewButton = window.isLoggedIn
    ? `<button class='btn btn-info btn-sm' id='review-${snack.id}'>Review ${snack.name}</button>`
    : ''
  const snackReviews = snack.reviews
    ? snack.reviews.map(review => snackReviewTemplate(review)).join('')
    : ''
  return `<div class='container-fluid infoBox'>
      <div class='title'>
        <h3 class='strongP pt-2'>${snack.name}</h3>
      </div>
      <div class='snackImg'>
        <img src='${snack.img}' width=300 alt='a picture of ${snack.name}'>
      </div>
      <div>
        <div class='inputLine'>
          <p>ID Number: <span class='strongP'>${snack.id}</span></p>
        </div>
        <div class='inputLine'>
          <p>Name: <span class='strongP'>${snack.name}</span></p>
        </div>
        <div class='inputLine'>
          <p>Average Rating: <span class='strongP'>${snack.averageRating}</span></p>
        </div>
        <div class='inputLine'>
          <p>Price: <span class='strongP'>${snack.price}</span></p>
        </div>
        <div class='inputLine'>
          <p>Description: <span class='strongP'>${snack.description}</span></p>
        </div>
        
      </div>
      ${reviewButton} ${adminButtons}
      
    </div>
    ${snackReviews}
    `
}

module.exports = {
  viewOneSnackTemplate,
}
