/**
 * Form Component
 * TC Kimlik doğrulama form yönetimi
 */

import { ValidationUtils } from '../utils/validation.js';
import { InputUtils } from '../utils/inputUtils.js';
import { DOMUtils } from '../utils/domUtils.js';

export class FormComponent {
    constructor(formElement, apiService) {
        this.form = formElement;
        this.api = apiService;
        this.isSubmitting = false;
        
        // Form elemanları
        this.elements = {
            tckn: this.form.querySelector('#tckn'),
            ad: this.form.querySelector('#ad'),
            soyad: this.form.querySelector('#soyad'),
            dogumTarihi: this.form.querySelector('#dogumTarihi'),
            submitButton: this.form.querySelector('button[type="submit"]'),
            resultDiv: document.querySelector('#result')
        };

        // Hata container'ları
        this.errorContainers = this.createErrorContainers();
        
        this.init();
    }

    /**
     * Form'u başlatır
     */
    init() {
        this.setupInputMasks();
        this.setupValidation();
        this.setupFormSubmission();
        this.addClearButton();
        
        console.log('Form component initialized');
    }

    /**
     * Hata container'larını oluşturur
     * @returns {Object} Error container'ları
     */
    createErrorContainers() {
        const containers = {};
        
        Object.keys(this.elements).forEach(key => {
            if (this.elements[key] && this.elements[key].tagName === 'INPUT') {
                const errorDiv = DOMUtils.createElement('div', {
                    className: 'error-message',
                    style: 'display: none;'
                });
                
                this.elements[key].parentNode.appendChild(errorDiv);
                containers[key] = errorDiv;
            }
        });
        
        return containers;
    }

    /**
     * Input mask'lerini kurar
     */
    setupInputMasks() {
        InputUtils.setupInputMask(this.elements.tckn, 'tckn');
        InputUtils.setupInputMask(this.elements.ad, 'name');
        InputUtils.setupInputMask(this.elements.soyad, 'name');
        InputUtils.setupInputMask(this.elements.dogumTarihi, 'birthdate');

        // Paste handler'ları
        InputUtils.setupPasteHandler(this.elements.tckn, 'tckn');
        InputUtils.setupPasteHandler(this.elements.ad, 'name');
        InputUtils.setupPasteHandler(this.elements.soyad, 'name');
        InputUtils.setupPasteHandler(this.elements.dogumTarihi, 'birthdate');
    }

    /**
     * Real-time validation kurar
     */
    setupValidation() {
        // TCKN validation
        this.elements.tckn.addEventListener('blur', () => {
            this.validateField('tckn');
        });

        // Ad validation
        this.elements.ad.addEventListener('blur', () => {
            this.validateField('ad');
        });

        // Soyad validation
        this.elements.soyad.addEventListener('blur', () => {
            this.validateField('soyad');
        });

        // Doğum tarihi validation
        this.elements.dogumTarihi.addEventListener('blur', () => {
            this.validateField('dogumTarihi');
        });

        // Input değişikliklerinde hataları temizle ve scroll
        Object.keys(this.elements).forEach(key => {
            if (this.elements[key] && this.elements[key].tagName === 'INPUT') {
                this.elements[key].addEventListener('input', () => {
                    if (this.errorContainers[key].style.display === 'block') {
                        this.hideError(key);
                    }
                });

                // Focus olduğunda yumuşak scroll
                this.elements[key].addEventListener('focus', () => {
                    this.smoothScrollToElement(this.elements[key]);
                });
            }
        });
    }

    /**
     * Tek bir alanı validate eder
     * @param {string} fieldName - Alan adı
     */
    validateField(fieldName) {
        const value = this.elements[fieldName].value.trim();
        let error = null;

        switch (fieldName) {
            case 'tckn':
                error = ValidationUtils.validateTCKN(value);
                break;
            case 'ad':
                error = ValidationUtils.validateName(value, 'Ad');
                break;
            case 'soyad':
                error = ValidationUtils.validateName(value, 'Soyad');
                break;
            case 'dogumTarihi':
                error = ValidationUtils.validateBirthDate(value);
                break;
        }

        if (error) {
            this.showError(fieldName, error);
        } else {
            this.hideError(fieldName);
        }

        return !error;
    }

    /**
     * Hata gösterir
     * @param {string} fieldName - Alan adı
     * @param {string} message - Hata mesajı
     */
    showError(fieldName, message) {
        const errorContainer = this.errorContainers[fieldName];
        const inputElement = this.elements[fieldName];

        if (errorContainer && inputElement) {
            errorContainer.textContent = message;
            DOMUtils.toggleVisibility(errorContainer, true);
            DOMUtils.toggleClass(inputElement, 'error-input', true);
            DOMUtils.animateElement(errorContainer, 'fadeIn');
            
            // Hata olan alana scroll et
            this.scrollToError(inputElement);
        }
    }

    /**
     * Hata olan input alanına smooth scroll yapar
     * @param {HTMLElement} element - Scroll edilecek element
     */
    scrollToError(element) {
        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            
            // Element viewport'un görünür alanının dışındaysa scroll et
            const isInViewport = (
                rect.top >= 80 && // Header'a mesafe bırak
                rect.bottom <= viewportHeight - 100 // Footer'a mesafe bırak
            );

            if (!isInViewport) {
                // Element'in üst kısmını viewport'un ortasına getir
                const targetPosition = window.pageYOffset + rect.top - (viewportHeight / 2) + (rect.height / 2);
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Visual feedback - hata alanını vurgula
                element.style.transition = 'all 0.3s ease';
                element.style.boxShadow = '0 0 20px rgba(220, 53, 69, 0.6)';
                element.style.transform = 'scale(1.02)';
                
                // Focus ver (accessibility)
                setTimeout(() => {
                    element.focus();
                }, 300);
                
                // Visual feedback'i temizle
                setTimeout(() => {
                    element.style.boxShadow = '';
                    element.style.transform = '';
                }, 2000);
            } else {
                // Element görünürse sadece focus ver
                element.focus();
            }
        }, 150); // CSS animasyonlarının tamamlanmasını bekle
    }

    /**
     * Hata gizler
     * @param {string} fieldName - Alan adı
     */
    hideError(fieldName) {
        const errorContainer = this.errorContainers[fieldName];
        const inputElement = this.elements[fieldName];

        if (errorContainer && inputElement) {
            DOMUtils.toggleVisibility(errorContainer, false);
            DOMUtils.toggleClass(inputElement, 'error-input', false);
        }
    }

    /**
     * Tüm hataları temizler
     */
    clearAllErrors() {
        Object.keys(this.errorContainers).forEach(fieldName => {
            this.hideError(fieldName);
        });
    }

    /**
     * Form submission kurar
     */
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    /**
     * Form submission'ı işler
     */
    async handleSubmit() {
        if (this.isSubmitting) return;

        // Form validation
        const formData = this.getFormData();
        const validation = ValidationUtils.validateForm(formData);

        if (!validation.isValid) {
            this.displayValidationErrors(validation.errors);
            return;
        }

        this.setLoadingState(true);

        try {
            const result = await this.api.verifyIdentity(formData);
            
            if (result.success && result.data.success) {
                this.displaySuccess(result.data, formData);
                DOMUtils.showToast('Kimlik doğrulama başarılı!', 'success');
            } else {
                const errorMessage = result.data?.message || result.error || 'Doğrulama başarısız';
                this.displayError(errorMessage);
                DOMUtils.showToast('Doğrulama başarısız', 'error');
            }
        } catch (error) {
            console.error('Submit error:', error);
            this.displayError('Bağlantı hatası oluştu');
            DOMUtils.showToast('Bağlantı hatası', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Form verilerini alır
     * @returns {Object} Form verileri
     */
    getFormData() {
        return {
            tckn: this.elements.tckn.value.trim(),
            ad: this.elements.ad.value.trim(),
            soyad: this.elements.soyad.value.trim(),
            dogumTarihi: this.elements.dogumTarihi.value.trim()
        };
    }

    /**
     * Validation hatalarını gösterir
     * @param {Object} errors - Hata objeleri
     */
    displayValidationErrors(errors) {
        this.clearAllErrors();
        
        // Form sırasına göre field'ları sırala
        const fieldOrder = ['tckn', 'ad', 'soyad', 'dogumTarihi'];
        const errorFields = Object.keys(errors);
        let firstErrorField = null;
        
        // İlk hata alanını form sırasına göre belirle
        for (const field of fieldOrder) {
            if (errorFields.includes(field)) {
                firstErrorField = field;
                break;
            }
        }
        
        // Hataları göster
        errorFields.forEach(fieldName => {
            this.showError(fieldName, errors[fieldName]);
        });

        // İlk hata olan alana scroll et (diğer scroll'lardan önce)
        if (firstErrorField && this.elements[firstErrorField]) {
            setTimeout(() => {
                this.scrollToFirstError(this.elements[firstErrorField]);
            }, 100);
        }

        this.elements.resultDiv.innerHTML = `
            <div class="error-container">
                <p class="error">⚠️ Lütfen formdaki hataları düzeltin.</p>
            </div>
        `;

        DOMUtils.animateElement(this.elements.resultDiv);
    }

    /**
     * İlk hata olan alana özel scroll (daha agresif)
     * @param {HTMLElement} element - İlk hata elementi
     */
    scrollToFirstError(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Element'i viewport'un üst kısmına getir
        const targetPosition = window.pageYOffset + rect.top - 120; // Header'dan uzak tut
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        // Güçlü visual feedback
        element.style.transition = 'all 0.4s ease';
        element.style.boxShadow = '0 0 30px rgba(220, 53, 69, 0.8)';
        element.style.transform = 'scale(1.05)';
        element.style.borderColor = '#dc3545';
        element.style.borderWidth = '3px';
        
        // Focus ver
        setTimeout(() => {
            element.focus();
        }, 400);
        
        // Visual feedback'i kademeli olarak temizle
        setTimeout(() => {
            element.style.transform = 'scale(1.02)';
            element.style.boxShadow = '0 0 15px rgba(220, 53, 69, 0.4)';
        }, 1000);
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.borderWidth = '';
        }, 3000);
    }

    /**
     * Yumuşak scroll (focus sırasında)
     * @param {HTMLElement} element - Scroll edilecek element
     */
    smoothScrollToElement(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Element viewport'un çok üstünde veya altındaysa yumuşak scroll
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        
        const isOutOfViewport = (
            elementTop < 100 || // Çok yukarıda
            elementBottom > viewportHeight - 100 // Çok aşağıda
        );
        
        if (isOutOfViewport) {
            const targetPosition = window.pageYOffset + rect.top - (viewportHeight / 3);
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        }
    }

    /**
     * Başarılı sonucu gösterir
     * @param {Object} data - API yanıtı
     * @param {Object} formData - Form verileri
     */
    displaySuccess(data, formData) {
        this.elements.resultDiv.innerHTML = `
            <div class="success-container">
                <p class="success">✅ ${data.data.message}</p>
                <div class="result-details">
                    <h3>Doğrulanan Bilgiler:</h3>
                    <p><strong>TC Kimlik No:</strong> ${formData.tckn}</p>
                    <p><strong>Ad:</strong> ${formData.ad}</p>
                    <p><strong>Soyad:</strong> ${formData.soyad}</p>
                    <p><strong>Doğum Tarihi:</strong> ${formData.dogumTarihi}</p>
                </div>
            </div>
        `;

        DOMUtils.animateElement(this.elements.resultDiv);
        DOMUtils.scrollToElement(this.elements.resultDiv);
    }

    /**
     * Hata sonucunu gösterir
     * @param {string} message - Hata mesajı
     */
    displayError(message) {
        this.elements.resultDiv.innerHTML = `
            <div class="error-container">
                <p class="error">❌ ${message}</p>
                <p class="error-hint">Bilgilerinizi kontrol edip tekrar deneyin.</p>
                ${!this.api.isOnline() ? '<button onclick="location.reload()" class="retry-button">Sayfayı Yenile</button>' : ''}
            </div>
        `;

        DOMUtils.animateElement(this.elements.resultDiv);
        DOMUtils.scrollToElement(this.elements.resultDiv);
    }

    /**
     * Loading durumunu ayarlar
     * @param {boolean} isLoading - Loading durumu
     */
    setLoadingState(isLoading) {
        this.isSubmitting = isLoading;
        this.elements.submitButton.disabled = isLoading;
        
        if (isLoading) {
            this.elements.submitButton.textContent = 'Doğrulanıyor...';
            DOMUtils.toggleClass(this.elements.submitButton, 'loading', true);
            
            this.elements.resultDiv.innerHTML = `
                <p class="loading">🔄 Kimlik doğrulama yapılıyor, lütfen bekleyin...</p>
            `;
        } else {
            this.elements.submitButton.textContent = 'Doğrula';
            DOMUtils.toggleClass(this.elements.submitButton, 'loading', false);
        }
    }

    /**
     * Temizle butonu ekler
     */
    addClearButton() {
        const clearButton = DOMUtils.createElement('button', {
            type: 'button',
            className: 'clear-button'
        }, 'Temizle');

        clearButton.addEventListener('click', () => {
            this.clearForm();
        });

        // Button container oluştur
        const buttonContainer = DOMUtils.createElement('div', {
            className: 'button-container'
        });

        const submitButton = this.elements.submitButton;
        submitButton.parentNode.insertBefore(buttonContainer, submitButton);
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(clearButton);
    }

    /**
     * Formu temizler
     */
    clearForm() {
        this.form.reset();
        this.clearAllErrors();
        this.elements.resultDiv.innerHTML = '';
        DOMUtils.showToast('Form temizlendi', 'info');
    }

    /**
     * Component'i yok eder
     */
    destroy() {
        // Event listener'ları temizle
        this.form.removeEventListener('submit', this.handleSubmit);
        
        // Error container'ları temizle
        Object.values(this.errorContainers).forEach(container => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
        
        console.log('Form component destroyed');
    }
}
