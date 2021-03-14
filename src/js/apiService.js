export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImages() {
        const BASE_URL = 'https://pixabay.com/api/';
        const API_KEY = '20648109-aff5f53cd54a5f40fa07937d6';
        return fetch(`${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw Error();
            }
            return response.json();
        })
        .then(({ hits }) => {
            this.incrementPage();
            return hits})
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery){
        this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page +=1;
    }

    resetPage() {
        this.page = 1;
    }
};

