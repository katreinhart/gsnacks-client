const snackRequests = require('./requests/snacks')

function getSnack(id) {
  return snackRequests.find(id)
    .then(result => result.data.snacks)
}

module.exports = {
  getSnack,
}
