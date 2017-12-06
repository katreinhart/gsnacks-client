const snackRequests = require('./requests/snacks')

function setupSnacks() {
  return snackRequests.getAll()
    .then(result => result.data.snacks)
}

module.exports = {
  setupSnacks,
}
