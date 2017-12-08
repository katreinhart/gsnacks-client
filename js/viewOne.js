const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')

const { addEditSnackTemplate } = require('./templates/addEditSnack')
const { editOneSnackTemplate } = require('./templates/editSnack')

const { update: editSnackRequest } = require('./requests/snacks')

const mainContentDiv = document.getElementById('main-content')

function getSnack(id) {
  const snackReviewPromise = reviewsRequests.getAllForSnack(id)
  const snackPromise = snackRequests.find(id)

  return Promise.all([snackReviewPromise, snackPromise]).then((result) => {
    const [{ data: snackReviews }, { data: { snacks } }] = result
    let average = snackReviews.reviews
      .reduce((acc, item) => acc + parseInt(item.rating, 10), 0) / snackReviews.length
    if (snackReviews.reviews.length < 1) average = 'N/A'
    snacks.reviews = snackReviews.reviews
    snacks.averageRating = average
    return snacks
  })
}

function setupSnackButtons() {
  const snackId = window.location.hash.split('/')[2]
  if (window.isAdmin) {
    document.getElementById(`edit-${snackId}`).addEventListener('click', (e) => {
      getSnack(snackId).then((snack) => {
        mainContentDiv.innerHTML += editOneSnackTemplate(snack)
        const token = window.localStorage.getItem('token')
        document.getElementById(`edit-snack-${snackId}`).addEventListener('submit', (e) => {
          e.preventDefault()
          const name = document.getElementById('snack_name').value
          const img = document.getElementById('snack_img').value
          const price = document.getElementById('snack_price').value
          const description = document.getElementById('snack_description').value
          const isPerishable = document.getElementById('snack_is_perish').value
          const updatedSnack = { name, img, price, description, is_perishable: isPerishable }
          editSnackRequest(snackId, updatedSnack, token).then((result) => {
            window.location.reload()
          }).catch(console.error)
        })
      })
    })
    document.getElementById(`delete-${snackId}`).addEventListener('click', (e) => {
      console.log('delete snack')

    })
  }
  document.getElementById(`review-${snackId}`).addEventListener('click', (e) => {
    console.log('review this snack')
  })
}

module.exports = {
  getSnack,
  setupSnackButtons,
}
