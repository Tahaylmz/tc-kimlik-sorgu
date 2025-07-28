/**
 * API Service
 * Backend API ile iletişim katmanı
 */

export class ApiService {
    constructor() {
        this.baseUrl = '/api';
        this.timeout = 10000; // 10 saniye
    }

    /**
     * HTTP istek wrapper
     * @param {string} url - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} API yanıtı
     */
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('İstek zaman aşımına uğradı');
            }
            
            if (!navigator.onLine) {
                throw new Error('İnternet bağlantısı yok');
            }
            
            throw error;
        }
    }

    /**
     * GET isteği
     * @param {string} url - Endpoint
     * @returns {Promise<Object>} API yanıtı
     */
    async get(url) {
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST isteği
     * @param {string} url - Endpoint
     * @param {Object} data - Gönderilecek veri
     * @returns {Promise<Object>} API yanıtı
     */
    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * TC Kimlik doğrulama
     * @param {Object} formData - Form verileri
     * @returns {Promise<Object>} Doğrulama sonucu
     */
    async verifyIdentity(formData) {
        try {
            const response = await this.post('/verify', formData);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Verification API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Health check
     * @returns {Promise<Object>} Servis durumu
     */
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error('Health Check Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Retry mekanizması
     * @param {Function} apiCall - API çağrısı
     * @param {number} maxRetries - Maksimum deneme sayısı
     * @param {number} delay - Deneme arası bekleme (ms)
     * @returns {Promise<Object>} API yanıtı
     */
    async retry(apiCall, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await apiCall();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                
                console.warn(`API call failed (attempt ${i + 1}/${maxRetries}):`, error.message);
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    /**
     * Bağlantı durumunu kontrol eder
     * @returns {boolean} Online durumu
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * Network durumu değişikliklerini dinler
     * @param {Function} onOnline - Online olduğunda çalışacak callback
     * @param {Function} onOffline - Offline olduğunda çalışacak callback
     */
    setupNetworkListeners(onOnline, onOffline) {
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
    }
}
