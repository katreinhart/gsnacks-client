const { baseURL } = require('../constants')
const axios = require('axios')

module.exports = {
    getUser(token) {
        return axios.get(`${baseURL}/auth`, { headers: { "Authorization": `Bearer ${token}` } })
    },
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
        return axios.delete(`${baseURL}/api/users/${id}`, { headers: { "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjN9LCJpYXQiOjE1MTI3NzAyODIsImV4cCI6MTUxMzk3OTg4Mn0.-A0g5UUM-izDXUDxy73mCNU7K51rkpCczJdXdlnAZFo` } })
    },
    register(body) {
        return axios.post(`${baseURL}/auth/register`, body)
    },
    login(body) {
        return axios.post(`${baseURL}/auth/login`, body)
    }  
}