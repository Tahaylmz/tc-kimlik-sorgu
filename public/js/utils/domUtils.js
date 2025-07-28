/**
 * DOM Utilities
 * DOM manipülasyon ve element yönetimi
 */

export class DOMUtils {
    /**
     * Element oluşturur
     * @param {string} tag - HTML tag
     * @param {Object} attributes - Element özellikleri
     * @param {string} content - İçerik
     * @returns {HTMLElement}
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Class ekler/çıkarır
     * @param {HTMLElement} element - Element
     * @param {string} className - Class adı
     * @param {boolean} add - Ekle/çıkar
     */
    static toggleClass(element, className, add) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    /**
     * Element görünürlüğünü kontrol eder
     * @param {HTMLElement} element - Element
     * @param {boolean} show - Göster/gizle
     */
    static toggleVisibility(element, show) {
        element.style.display = show ? 'block' : 'none';
    }

    /**
     * Smooth scroll ile elementa kaydırır
     * @param {HTMLElement} element - Hedef element
     */
    static scrollToElement(element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }

    /**
     * Toast bildirimi gösterir
     * @param {string} message - Mesaj
     * @param {string} type - Tip ('success', 'error', 'info')
     * @param {number} duration - Süre (ms)
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = this.createElement('div', {
            className: `toast ${type}`,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#e74c3c' : '#333'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            `
        }, message);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }

    /**
     * Loading spinner oluşturur
     * @param {HTMLElement} container - Container elementi
     * @returns {HTMLElement} Spinner elementi
     */
    static createLoadingSpinner(container) {
        const spinner = this.createElement('div', {
            className: 'loading-spinner',
            style: `
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid transparent;
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `
        });

        container.appendChild(spinner);
        return spinner;
    }

    /**
     * Animasyon ile element'i gösterir
     * @param {HTMLElement} element - Element
     * @param {string} animation - Animasyon tipi
     */
    static animateElement(element, animation = 'fadeIn') {
        element.style.animation = `${animation} 0.3s ease-out`;
    }

    /**
     * Debounce fonksiyon
     * @param {Function} func - Çalıştırılacak fonksiyon
     * @param {number} wait - Bekleme süresi (ms)
     * @returns {Function} Debounced fonksiyon
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Element'in görünür olup olmadığını kontrol eder
     * @param {HTMLElement} element - Element
     * @returns {boolean} Görünürlük durumu
     */
    static isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}
