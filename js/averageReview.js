const reviewRequests = require('./requests/reviews')

function averageSnackReview(snackId) {
  return reviewRequests.getAverageSnackReview(snackId)
    .then(result => result.data)
    // result.data.avg?
    
}


          
module.exports = {
  averageSnackReview,
}

