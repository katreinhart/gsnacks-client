const { baseURL } = require('./constants')
const axios = require('axios')

function getSnack(id) {
  return axios.get(`${baseURL}/api/snacks/${id}`)
    .then(result => result.data.snacks)
}

module.exports = {
  getSnack,
}
