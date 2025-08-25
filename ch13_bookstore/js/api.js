// API 통신을 위한 기본 클래스
class API {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }
    
    async request(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(this.baseUrl + url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    async get(url) {
        return this.request(url, { method: 'GET' });
    }
    
    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
}

// 북스토어 API
class BookstoreAPI extends API {
    async login(username, password) {
        return this.post('/api/login', { username, password });
    }
    
    async register(userData) {
        return this.post('/api/register', userData);
    }
    
    async getBooks() {
        return this.get('/api/books');
    }
    
    async createOrder(orderData) {
        return this.post('/api/orders', orderData);
    }
    
    async getFavorites(userId) {
        return this.get(`/api/users/${userId}/favorites`);
    }
}

// 사용 예시
// const api = new BookstoreAPI('http://localhost:3000');