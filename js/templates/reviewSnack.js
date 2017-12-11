function addEditSnackReviewTemplate(snack, review) {
  if (!review) {
    review = {
      title: '',
      text: '',
      rating: 3,
      snack_id: snack.id,
    }
  }
  return `
  <div class='container-fluid reviewBox'>
    <div class='title'>
      <div class='inputLine'>
        <p class='strongP'>Review ${snack.name}</p>
      </div>
    </div>
    <div class='snackImg'>
      <img src='${snack.img}' width=300 alt='a picture of ${snack.name}'>
    </div>
    <div class='textInputs'>
      <form id='add-review-${snack.id}'>
        <div class='inputLine'>
          <p class='strongP'>ID Number: </p><span>${snack.id}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Name: </p><span>${snack.name}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Rating: </p>
          <select name="review-rating" value=${review.rating} id='review-rating'>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Price: </p><span>${snack.price}</span>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review Title: </p><input class='formInput' id='review-title' type='text' placeholder='Awesome snack!' value='${review.title}'>
        </div>
        <div class='inputLine'>
          <p class='strongP'>Review: </p><input class='formInput' id='review-text' type='text' placeholder='Tastes great!' value='${review.text}'>
        </div>
        <input type='submit' value='Submit Review!' class='submitButton'>
      </form>
    </div>
  </div>`
}

module.exports = {
  addEditSnackReviewTemplate,
}
