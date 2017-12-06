window.Snacks = {
    getAll(){
        return axios.get(`${baseURL}/api/snacks`)
    },
    find(id){
        return axios.get(`${baseURL}/api/snacks/${id}`)
    },
    create(body){
        return axios.post(`${baseURL}/api/snacks`, body)
    },
    update(body){
        return axios.put(`${baseURL}/api/snacks/${id}`, body)
    },
    delete(id){
        return axios.delete(`${baseURL}/api/snacks/${id}`)
    }
    
}