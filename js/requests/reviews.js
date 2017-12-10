const axios = require('axios')
const { baseURL } = require('../constants')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/reviews`)
    },
    getAllForSnack(id) {
        return axios.get(`${baseURL}/api/snacks/${id}/reviews`)
    },
    getAverageSnackReview(id) {
        return axios.get(`${baseURL}/api/reviews/avg/${id}`)
    },
    getAllForUser(id, token) {
        return axios.get(`${baseURL}/api/users/${id}/reviews`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    find(id) {
        return axios.get(`${baseURL}/api/reviews/${id}`)
    },
    create(body, token) {
        return axios.post(`${baseURL}/api/reviews`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    update(id, body, token) {
        return axios.put(`${baseURL}/api/reviews/${id}`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/reviews/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    }
}

