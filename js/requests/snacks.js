const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/snacks`)
    },
    find(id) {
        return axios.get(`${baseURL}/api/snacks/${id}`)
    },
    create(body, token) {
        return axios.post(`${baseURL}/api/snacks`, body, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
    update(id, body, token) {
        return axios.put(`${baseURL}/api/snacks/${id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/snacks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    }
    
}