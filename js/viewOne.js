const snackRequests = require('./requests/snacks')

function getSnack(id) {
  return snackRequests.getSnack(id)
    .then(result => result.data.snacks)
}

module.exports = {
  getSnack,
}
