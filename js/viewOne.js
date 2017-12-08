const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')

function getSnack(id) {
  const snackReviewPromise = reviewsRequests.getAllForSnack(id)
  const snackPromise = snackRequests.find(id)

  return Promise.all([snackReviewPromise, snackPromise]).then((result) => {
    const [{ data: snackReviews }, { data: { snacks } }] = result
    let average = snackReviews.reviews.reduce((acc, item) => {
      return acc + parseInt(item.rating)
    }, 0) / 2
    if(snackReviews.reviews.length < 1) average = 'N/A'
    snacks.reviews = snackReviews.reviews
    snacks.averageRating = average
    return snacks
  })
}

module.exports = {
  getSnack,
}
