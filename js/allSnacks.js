const { baseURL } = require('./constants')
const axios = require('axios')

function setupSnacks() {
  return axios.get(`${baseURL}/api/snacks`)
    .then(result => result.data.snacks)
}

module.exports = {
  setupSnacks,
}

