const { baseURL } = require('./constants')


function setupSnacks() {
  return axios.get(`${baseURL}/api/snacks`)
    .then(result => result.data.snacks)
}

module.exports = {
  setupSnacks,
}

