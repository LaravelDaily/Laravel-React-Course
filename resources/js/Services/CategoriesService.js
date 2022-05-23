class CategoriesService {
    getAll() {
        return axios.get('/api/categories');
    }
}

export default new CategoriesService;
