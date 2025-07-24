document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verificationForm');
    const resultDiv = document.getElementById('result');
    const submitButton = form.querySelector('button[type="submit"]');

    // Form alanları
    const tcknInput = document.getElementById('tckn');
    const adInput = document.getElementById('ad');
    const soyadInput = document.getElementById('soyad');
    const dogumTarihiInput = document.getElementById('dogumTarihi');

    // Hata mesajları için container'lar oluştur
    function createErrorContainer(inputElement) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.display = 'none';
        inputElement.parentNode.appendChild(errorDiv);
        return errorDiv;
    }

    // Her input için hata container'ları oluştur
    const tcknError = createErrorContainer(tcknInput);
    const adError = createErrorContainer(adInput);
    const soyadError = createErrorContainer(soyadInput);
    const dogumTarihiError = createErrorContainer(dogumTarihiInput);

    // Hata mesajını göster
    function showError(errorContainer, message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        errorContainer.parentNode.querySelector('input').classList.add('error-input');
    }

    // Hata mesajını gizle
    function hideError(errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.parentNode.querySelector('input').classList.remove('error-input');
    }

    // Tüm hataları temizle
    function clearAllErrors() {
        [tcknError, adError, soyadError, dogumTarihiError].forEach(hideError);
    }

    // TC Kimlik No validasyonu
    function validateTCKN(tckn) {
        if (!tckn) return 'TC Kimlik No boş bırakılamaz';
        if (!/^\d{11}$/.test(tckn)) return 'TC Kimlik No 11 haneli rakamlardan oluşmalıdır';
        
        const digits = tckn.split('').map(Number);
        
        // İlk rakam 0 olamaz
        if (digits[0] === 0) return 'TC Kimlik No 0 ile başlayamaz';
        
        // Algoritma kontrolü
        const sum1 = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
        if (sum1 % 10 !== digits[10]) return 'Geçersiz TC Kimlik No';
        
        const sum2 = digits.slice(0, 9).reduce((acc, val, idx) => {
            return acc + (idx % 2 === 0 ? val * 7 : -val);
        }, 0);
        if ((sum2 % 10 + 10) % 10 !== digits[9]) return 'Geçersiz TC Kimlik No';
        
        return null;
    }

    // İsim validasyonu
    function validateName(name, fieldName) {
        if (!name) return `${fieldName} boş bırakılamaz`;
        if (name.length < 2) return `${fieldName} en az 2 karakter olmalıdır`;
        if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) return `${fieldName} sadece harf ve boşluk içerebilir`;
        if (name.length > 50) return `${fieldName} en fazla 50 karakter olabilir`;
        return null;
    }

    // Doğum tarihi validasyonu
    function validateBirthDate(date) {
        if (!date) return 'Doğum tarihi boş bırakılamaz';
        
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
            return 'Doğum tarihi GG.AA.YYYY formatında olmalıdır';
        }
        
        const [day, month, year] = date.split('.').map(Number);
        const currentYear = new Date().getFullYear();
        
        if (day < 1 || day > 31) return 'Geçersiz gün (1-31 arası)';
        if (month < 1 || month > 12) return 'Geçersiz ay (1-12 arası)';
        if (year < 1900 || year > currentYear) return `Geçersiz yıl (1900-${currentYear} arası)`;
        
        // Ayın gün sayısı kontrolü
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth) return `${month}. ay ${daysInMonth} gün içerir`;
        
        // Gelecek tarih kontrolü
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        if (birthDate > today) return 'Gelecek bir tarih giremezsiniz';
        
        return null;
    }

    // Form validasyonu
    function validateForm() {
        clearAllErrors();
        let isValid = true;

        // TC Kimlik No kontrolü
        const tcknValidation = validateTCKN(tcknInput.value.trim());
        if (tcknValidation) {
            showError(tcknError, tcknValidation);
            isValid = false;
        }

        // Ad kontrolü
        const adValidation = validateName(adInput.value.trim(), 'Ad');
        if (adValidation) {
            showError(adError, adValidation);
            isValid = false;
        }

        // Soyad kontrolü
        const soyadValidation = validateName(soyadInput.value.trim(), 'Soyad');
        if (soyadValidation) {
            showError(soyadError, soyadValidation);
            isValid = false;
        }

        // Doğum tarihi kontrolü
        const dogumTarihiValidation = validateBirthDate(dogumTarihiInput.value.trim());
        if (dogumTarihiValidation) {
            showError(dogumTarihiError, dogumTarihiValidation);
            isValid = false;
        }

        return isValid;
    }

    // Tarih formatı için maskeleme
    dogumTarihiInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 4) {
                value = value.slice(0, 2) + '.' + value.slice(2);
            } else {
                value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
            }
        }
        e.target.value = value;
    });

    // TC Kimlik No input - sadece rakam
    tcknInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
    });

    // Ad ve soyad input - sadece harf ve boşluk
    [adInput, soyadInput].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
        });
    });

    // Real-time validation
    tcknInput.addEventListener('blur', () => {
        const error = validateTCKN(tcknInput.value.trim());
        if (error) {
            showError(tcknError, error);
        } else {
            hideError(tcknError);
        }
    });

    adInput.addEventListener('blur', () => {
        const error = validateName(adInput.value.trim(), 'Ad');
        if (error) {
            showError(adError, error);
        } else {
            hideError(adError);
        }
    });

    soyadInput.addEventListener('blur', () => {
        const error = validateName(soyadInput.value.trim(), 'Soyad');
        if (error) {
            showError(soyadError, error);
        } else {
            hideError(soyadError);
        }
    });

    dogumTarihiInput.addEventListener('blur', () => {
        const error = validateBirthDate(dogumTarihiInput.value.trim());
        if (error) {
            showError(dogumTarihiError, error);
        } else {
            hideError(dogumTarihiError);
        }
    });

    // Loading state'i kontrol et
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Doğrulanıyor...' : 'Doğrula';
        
        if (isLoading) {
            submitButton.classList.add('loading');
            resultDiv.innerHTML = '<p class="loading">🔄 Kimlik doğrulama yapılıyor, lütfen bekleyin...</p>';
        } else {
            submitButton.classList.remove('loading');
        }
    }

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form validasyonu
        if (!validateForm()) {
            resultDiv.innerHTML = '<p class="error">⚠️ Lütfen formdaki hataları düzeltin.</p>';
            return;
        }
        
        const formData = {
            tckn: tcknInput.value.trim(),
            ad: adInput.value.trim(),
            soyad: soyadInput.value.trim(),
            dogumTarihi: dogumTarihiInput.value.trim()
        };

        setLoading(true);

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                resultDiv.innerHTML = `
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
            } else {
                resultDiv.innerHTML = `
                    <div class="error-container">
                        <p class="error">❌ ${data.message || 'Kimlik doğrulama başarısız'}</p>
                        <p class="error-hint">Bilgilerinizi kontrol edip tekrar deneyin.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Hata:', error);
            resultDiv.innerHTML = `
                <div class="error-container">
                    <p class="error">🚫 Bağlantı hatası oluştu</p>
                    <p class="error-hint">İnternet bağlantınızı kontrol edip tekrar deneyin.</p>
                    <button onclick="location.reload()" class="retry-button">Sayfayı Yenile</button>
                </div>
            `;
        } finally {
            setLoading(false);
        }
    });

    // Form temizleme
    function clearForm() {
        form.reset();
        clearAllErrors();
        resultDiv.innerHTML = '';
    }

    // Temizle butonu ekle
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Temizle';
    clearButton.className = 'clear-button';
    clearButton.addEventListener('click', clearForm);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(submitButton.parentNode.removeChild(submitButton));
    buttonContainer.appendChild(clearButton);
    form.appendChild(buttonContainer);
}); 