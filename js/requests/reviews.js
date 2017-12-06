window.Reviews = {
    getAll(){
        return axios.get(`${baseURL}/api/reviews`)
    },
    find(id){
        return axios.get(`${baseURL}/api/reviews/${id}`)
    },
    create(body){
        return axios.post(`${baseURL}/api/reviews`, body)
    },
    update(body){
        return axios.put(`${baseURL}/api/reviews/${id}`, body)
    },
    delete(id){
        return axios.delete(`${baseURL}/api/reviews/${id}`)
    }
}

