const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getAll(token) {
        return axios.get(`${baseURL}/api/users`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    find(id) {
        return axios.get(`${baseURL}/api/users/${id}`)
    },
    edit(id, body, token) {
        return axios.patch(`${baseURL}/api/users/${id}`, body, { headers: { "Authorization": `Bearer ${token}` } })
    },
    delete(id, token) {
        return axios.delete(`${baseURL}/api/users/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    },
    register(body) {
        return axios.post(`${baseURL}/auth/register`, body)
    },
    login(body) {
        return axios.post(`${baseURL}/auth/login`, body)
    }
    
}