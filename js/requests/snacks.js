const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getAll() {
        return axios.get(`${baseURL}/api/snacks`)
    },
    find(id) {
        return axios.get(`${baseURL}/api/snacks/${id}`)
    },
    create(body) {
        return axios.post(`${baseURL}/api/snacks`, body)
    },
    update(id, body) {
        return axios.put(`${baseURL}/api/snacks/${id}`, body)
    },
    delete(id) {
        return axios.delete(`${baseURL}/api/snacks/${id}`)
    }
    
}