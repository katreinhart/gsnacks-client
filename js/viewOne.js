const snackRequests = require('./requests/snacks')
const reviewsRequests = require('./requests/reviews')

const { editOneSnackTemplate } = require('./templates/editSnack')
// const { addEditSnackReviewTemplate } = require('./templates/reviewSnack')
const { viewOneSnackTemplate } = require('./templates/viewOneSnack')

const { 
  update: editSnackRequest,
  create: createNewSnackRequest,
} = require('./requests/snacks')

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

function setupSnackButtons() {
  const snackId = window.location.hash.split('/')[2]
  if (window.isAdmin) {
    document.getElementById(`edit-${snackId}`).addEventListener('click', (e) => {
      e.preventDefault()
      getSnack(snackId).then((snack) => {
        mainContentDiv.innerHTML += editOneSnackTemplate(snack)
        const token = window.localStorage.getItem('token')
        document.getElementById(`edit-snack-${snackId}`).addEventListener('submit', (e) => {
          e.preventDefault()
          const updatedSnack = getUpdatedInfo()
          editSnackRequest(snackId, updatedSnack, token).then((result) => {
            mainContentDiv.innerHTML = viewOneSnackTemplate(updatedSnack)
          }).catch(console.error)
        })
      })
    })
    document.getElementById(`delete-${snackId}`).addEventListener('click', (e) => {
      console.log('delete snack')
      // todo 
    })
  }
  document.getElementById(`review-${snackId}`).addEventListener('click', (e) => {
    console.log('review this snack')
    // todo
  })
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
