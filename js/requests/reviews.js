const axios = require('axios')
const { baseURL } = require('../constants')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/reviews`)
    },
    find(id) {
        return axios.get(`${baseURL}/api/reviews/${id}`)
    },
    getAllForSnack(snackId) {
        return axios.get(`${baseURL}/api/snacks/${snackId}/reviews`)
    }, 
    getAllForUser(userId) {
        return axios.get(`${baseURL}/api/users/${userId}/reviews`)
    },
    create(body, token) {
        return axios.post(`${baseURL}/api/reviews`, body, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
    update(id, body, token) {
        return axios.put(`${baseURL}/api/reviews/${id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/reviews/${id}`)
    }
}

