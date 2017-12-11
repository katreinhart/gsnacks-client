function userReviewTemplate(review) {
  return `<div class='container-fluid reviewBox'>
      <div class='title'>
        <p class='strongP'>${review.snack_id}</p>
      </div>
      <div>
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
      <button class='btn btn-info btn-sm' id='delete-${review.id}'>Delete This Review</button>
    </div>`
}

module.exports = {
  userReviewTemplate,
}
