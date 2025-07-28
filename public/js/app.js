/**
 * TC Kimlik Doğrulama Uygulaması
 * Ana uygulama modülü
 */

import { ApiService } from './services/apiService.js';
import { FormComponent } from './components/formComponent.js';
import { DOMUtils } from './utils/domUtils.js';

class TCKimlikApp {
    constructor() {
        this.apiService = new ApiService();
        this.formComponent = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            await this.waitForDOM();
            this.setupGlobalStyles();
            this.setupNetworkMonitoring();
            this.initializeComponents();
            this.setupKeyboardShortcuts();
            
            this.isInitialized = true;
            await this.performHealthCheck();
            
        } catch (error) {
            console.error('Uygulama başlatılırken hata oluştu:', error);
            this.displayInitializationError(error);
        }
    }

    /**
     * DOM'un yüklenmesini bekler
     */
    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Global CSS animasyonlarını ekler
     */
    setupGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes shake {
                0%, 20%, 40%, 60%, 80% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Network durumunu izler
     */
    setupNetworkMonitoring() {
        this.apiService.setupNetworkListeners(
            () => DOMUtils.showToast('İnternet bağlantısı geri geldi', 'success'),
            () => DOMUtils.showToast('İnternet bağlantısı kesildi', 'error', 5000)
        );

        if (!this.apiService.isOnline()) {
            DOMUtils.showToast('İnternet bağlantısı yok', 'error', 5000);
        }
    }

    /**
     * Component'leri başlatır
     */
    initializeComponents() {
        const formElement = document.getElementById('verificationForm');
        
        if (!formElement) {
            throw new Error('Verification form bulunamadı');
        }

        this.formComponent = new FormComponent(formElement, this.apiService);
    }

    /**
     * Keyboard shortcuts kurar
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: Form submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                }
            }

            // Escape: Clear form
            if (e.key === 'Escape') {
                e.preventDefault();
                const clearButton = document.querySelector('.clear-button');
                if (clearButton) {
                    clearButton.click();
                }
            }

            // F5 yerine Ctrl+R: Reload prevention
            if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
                if (this.formComponent && this.formComponent.isSubmitting) {
                    e.preventDefault();
                    DOMUtils.showToast('Doğrulama devam ediyor, lütfen bekleyin', 'info');
                }
            }
        });
    }

    /**
     * Health check yapar
     */
    async performHealthCheck() {
        try {
            const result = await this.apiService.healthCheck();
            
            if (result.success) {
                DOMUtils.showToast('Servis bağlantısı başarılı', 'success', 2000);
            } else {
                DOMUtils.showToast('Servis bağlantısında sorun var', 'error');
            }
        } catch (error) {
            console.error('Health check error:', error);
        }
    }

    /**
     * Başlatma hatasını gösterir
     * @param {Error} error - Hata objesi
     */
    displayInitializationError(error) {
        const errorDiv = DOMUtils.createElement('div', {
            className: 'initialization-error',
            style: `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #f8d7da;
                color: #721c24;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #f1b0b7;
                z-index: 9999;
                max-width: 400px;
                text-align: center;
            `
        });

        errorDiv.innerHTML = `
            <h3>🚫 Uygulama Başlatılamadı</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Sayfayı Yenile</button>
        `;

        document.body.appendChild(errorDiv);
    }

    /**
     * Uygulamayı temizler
     */
    destroy() {
        if (this.formComponent) {
            this.formComponent.destroy();
            this.formComponent = null;
        }
        this.isInitialized = false;
    }
}

// Global app instance
window.TCKimlikApp = new TCKimlikApp();

// Auto-start when script loads
window.TCKimlikApp.init().catch(console.error);

export default TCKimlikApp;
