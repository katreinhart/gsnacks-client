window.Users = {
    getAll(){
        return axios.get(`${baseURL}/api/users`)
    },
    find(id){
        return axios.get(`${baseURL}/api/users/:id`)
    },
    edit(body){
        return axios.patch(`${baseURL}/api/users/:id`, body)
    },
    delete(id){
        return axios.delete(`${baseURL}/api/users/:id`)
    },
    register(){
        return axios.post(`${baseURL}/auth/register`)
    },
    login(){
        return axios.post(`${baseURL}/auth/login`)
    }
    
}