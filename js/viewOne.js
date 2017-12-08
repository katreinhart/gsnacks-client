const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')

function getSnack(id) {
  const snackReviewPromise = reviewsRequests.getAllForSnack(id)
  const snackPromise = snackRequests.find(id)

  return Promise.all([snackReviewPromise, snackPromise]).then((result) => {
    const [{ data: snackReviews }, { data: { snacks } }] = result
    console.log(snackReviews, snacks)
    return { snackReviews, snacks }
  })
}

module.exports = {
  getSnack,
}
