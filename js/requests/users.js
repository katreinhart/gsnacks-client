const baseURL = require('../constants')
const axios = require('axios')

module.exports = {
    getAll(){
        return axios.get(`${baseURL}/api/users`)
    },
    find(id){
        return axios.get(`${baseURL}/api/users/${id}`)
    },
    edit(id, body){
        return axios.patch(`${baseURL}/api/users/${id}`, body)
    },
    delete(id){
        return axios.delete(`${baseURL}/api/users/${id}`)
    },
    register(body){
        return axios.post(`${baseURL}/auth/register`, body)
    },
    login(body){
        return axios.post(`${baseURL}/auth/login`, body)
    }
    
}