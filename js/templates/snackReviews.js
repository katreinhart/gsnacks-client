
function snackReviewTemplate(review) {
  return `<div class='container-fluid reviewBox'>
      <div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${review.user_id}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Title: </p><span>${review.title}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p><span>${review.rating}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><span>${review.text}</span>
        </div>
      </div>
      
    </div>`
}

module.exports = {
  snackReviewTemplate,
}
