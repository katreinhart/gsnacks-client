const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')
const userRequests = require('./requests/users')

const { editOneSnackTemplate } = require('./templates/editSnack')
const { addEditSnackReviewTemplate } = require('./templates/reviewSnack')
const { viewOneSnackTemplate } = require('./templates/viewOneSnack')

const { averageSnackReview } = require('./averageReview')

const {
  update: editSnackRequest,
  create: createNewSnackRequest,
  delete: deleteSnackRequest,
} = require('./requests/snacks')

const mainContentDiv = document.getElementById('main-content')

function getSnack(id) {
  const snackReviewPromise = reviewsRequests.getAllForSnack(id)
  const snackPromise = snackRequests.find(id)

  return Promise.all([snackReviewPromise, snackPromise]).then((result) => {
    const [{ data: snackReviews }, { data: { snacks } }] = result
    return averageSnackReview(id).then((average) => {
      snacks.reviews = snackReviews.reviews
      snacks.averageRating = parseFloat(average.avg)
      return snacks
    })
  })
}

function getUpdatedInfo() {
  const name = document.getElementById('snack_name').value
  const img = document.getElementById('snack_img').value
  const price = document.getElementById('snack_price').value
  const description = document.getElementById('snack_description').value
  const isPerishable = document.getElementById('snack_is_perish').value
  return {
    name,
    img,
    price,
    description,
    is_perishable: isPerishable,
  }
}

function handleEditSnack(e) {
  e.preventDefault()
  const token = window.localStorage.getItem('token')
  const snackId = window.location.hash.split('/')[2]
  const updatedSnack = getUpdatedInfo()

  editSnackRequest(snackId, updatedSnack, token).then((result) => {
    mainContentDiv.innerHTML = viewOneSnackTemplate(updatedSnack)
  }).catch(console.error)
}

function getSnackReviewFromForm() {
  const rating = document.getElementById('review-rating').value
  const title = document.getElementById('review-title').value
  const text = document.getElementById('review-text').value

  return {
    rating, title, text,
  }
}

function handleAddEditReview(user, snack, userReview) {
  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')
  const snackReview = getSnackReviewFromForm()
  snackReview.snack_id = snackId
  snackReview.user_id = user.id
  if (userReview) {
    reviewsRequests.update(userReview.id, snackReview, token).then((response) => {
      reviewsRequests.getAllForSnack(snackId).then((snackReviews) => {
        const { data: { reviews: updatedReviews } } = snackReviews
        snack.reviews = updatedReviews
        mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
      })
    })
  } else {
    reviewsRequests.create(snackReview, token).then((response) => {
      snack.reviews.push(snackReview)
      mainContentDiv.innerHTML = viewOneSnackTemplate(snack)
    }).catch(console.error)
  }
}

function handleSnackReview(e) {
  e.preventDefault()
  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')
  const snackPromise = getSnack(snackId)
  const userPromise = userRequests.getUser(token)
  Promise.all([snackPromise, userPromise]).then((result) => {
    const [snack, { data: user }] = result
    reviewsRequests.getAllForUser(user.id).then((reviewResult) => {
      const { data: { reviews } } = reviewResult
      const userReview = reviews.find(review => (review.user_id === user.id && review.snack_id === snack.id))
      if (userReview) {
        mainContentDiv.innerHTML += addEditSnackReviewTemplate(snack, userReview)
      } else {
        mainContentDiv.innerHTML += addEditSnackReviewTemplate(snack)
      }
      document.getElementById(`add-review-${snack.id}`).addEventListener('submit', (ev) => {
        ev.preventDefault()
        handleAddEditReview(user, snack, userReview)
      })
    })
  })
}

function handleDeleteSnack(e) {
  const snackId = window.location.hash.split('/')[2]
  const token = window.localStorage.getItem('token')
  e.preventDefault()
  deleteSnackRequest(snackId, token).then((result) => {
    window.location.hash = '#/snacks'
  }).catch(console.error)
}

function handleEditSnackClick (e) {
  e.preventDefault()
  const snackId = window.location.hash.split('/')[2]
  getSnack(snackId).then((snack) => {
    mainContentDiv.innerHTML += editOneSnackTemplate(snack)
    document.getElementById(`edit-snack-${snackId}`).addEventListener('submit', handleEditSnack)
  })
}

function setupSnackButtons() {
  const snackId = window.location.hash.split('/')[2]
  if (window.isAdmin) {
    document.getElementById(`edit-${snackId}`).addEventListener('click', handleEditSnackClick)
    document.getElementById(`delete-${snackId}`).addEventListener('click', handleDeleteSnack)
  }
  if (window.isLoggedIn) {
    document.getElementById(`review-${snackId}`).addEventListener('click', handleSnackReview)
  }
}

function setupEditSnackTemplateButtons() {
  document.getElementById('add-snack').addEventListener('submit', (e) => {
    e.preventDefault()
    const newSnack = getUpdatedInfo()
    const token = window.localStorage.getItem('token')
    createNewSnackRequest(newSnack, token).then((result) => {
      const newSnackId = result.data.snack[0].id
      window.location.href = `#/snacks/${newSnackId}`
    }).catch(console.error)
  })
}

module.exports = {
  getSnack,
  setupSnackButtons,
  setupEditSnackTemplateButtons,
}
