const reviewRequests = require('./requests/reviews')

function averageSnackReview(snackId) {
  return reviewRequests.getAverageSnackReview(snackId)
    .then(result => result.data[0])    
}
          
module.exports = {
  averageSnackReview,
}

