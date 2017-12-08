const axios = require('axios')
const { baseURL } = require('../constants')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/reviews`)
    },
    getAllForSnack(id) {
        return axios.get(`${baseURL}/api/snacks/${id}/reviews`)
    },
    find(id) {
        return axios.get(`${baseURL}/api/reviews/${id}`)
    },
    create(body) {
        return axios.post(`${baseURL}/api/reviews`, body)
    },
    update(id, body) {
        return axios.put(`${baseURL}/api/reviews/${id}`, body)
    },
    delete(id) {
        return axios.delete(`${baseURL}/api/reviews/${id}`)
    }
}

