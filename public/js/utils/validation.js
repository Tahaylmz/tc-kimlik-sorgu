/**
 * Frontend Validation Utils
 * TC Kimlik No ve form validasyon fonksiyonları
 */

export class ValidationUtils {
    /**
     * TC Kimlik No algoritma kontrolü
     * @param {string} tckn - 11 haneli TC Kimlik No
     * @returns {string|null} Hata mesajı veya null
     */
    static validateTCKN(tckn) {
        if (!tckn) return 'TC Kimlik No boş bırakılamaz';
        if (!/^\d{11}$/.test(tckn)) return 'TC Kimlik No 11 haneli rakamlardan oluşmalıdır';
        
        const digits = tckn.split('').map(Number);
        
        // İlk rakam 0 olamaz
        if (digits[0] === 0) return 'TC Kimlik No 0 ile başlayamaz';
        
        // 1-10. rakamların toplamının birler basamağı 11. rakamı vermeli
        const sum1 = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
        if (sum1 % 10 !== digits[10]) return 'Geçersiz TC Kimlik No';
        
        // Çift ve tek pozisyonlardaki rakamların algoritma kontrolü
        const sum2 = digits.slice(0, 9).reduce((acc, val, idx) => {
            return acc + (idx % 2 === 0 ? val * 7 : -val);
        }, 0);
        if ((sum2 % 10 + 10) % 10 !== digits[9]) return 'Geçersiz TC Kimlik No';
        
        return null;
    }

    /**
     * İsim/Soyisim validasyonu
     * @param {string} name - Ad veya soyad
     * @param {string} fieldName - Alan adı (görüntüleme için)
     * @returns {string|null} Hata mesajı veya null
     */
    static validateName(name, fieldName) {
        if (!name) return `${fieldName} boş bırakılamaz`;
        if (name.length < 2) return `${fieldName} en az 2 karakter olmalıdır`;
        if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) {
            return `${fieldName} sadece harf ve boşluk içerebilir`;
        }
        if (name.length > 50) return `${fieldName} en fazla 50 karakter olabilir`;
        return null;
    }

    /**
     * Doğum tarihi validasyonu
     * @param {string} date - GG.AA.YYYY formatında tarih
     * @returns {string|null} Hata mesajı veya null
     */
    static validateBirthDate(date) {
        if (!date) return 'Doğum tarihi boş bırakılamaz';
        
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
            return 'Doğum tarihi GG.AA.YYYY formatında olmalıdır';
        }
        
        const [day, month, year] = date.split('.').map(Number);
        const currentYear = new Date().getFullYear();
        
        if (day < 1 || day > 31) return 'Geçersiz gün (1-31 arası)';
        if (month < 1 || month > 12) return 'Geçersiz ay (1-12 arası)';
        if (year < 1900 || year > currentYear) {
            return `Geçersiz yıl (1900-${currentYear} arası)`;
        }
        
        // Ayın gün sayısı kontrolü
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth) return `${month}. ay ${daysInMonth} gün içerir`;
        
        // Gelecek tarih kontrolü
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        if (birthDate > today) return 'Gelecek bir tarih giremezsiniz';
        
        return null;
    }

    /**
     * Form verilerini validasyona tabi tutar
     * @param {Object} formData - Form verileri
     * @returns {Object} Validation sonuçları
     */
    static validateForm(formData) {
        const errors = {};

        const tcknError = this.validateTCKN(formData.tckn);
        if (tcknError) errors.tckn = tcknError;

        const adError = this.validateName(formData.ad, 'Ad');
        if (adError) errors.ad = adError;

        const soyadError = this.validateName(formData.soyad, 'Soyad');
        if (soyadError) errors.soyad = soyadError;

        const dogumTarihiError = this.validateBirthDate(formData.dogumTarihi);
        if (dogumTarihiError) errors.dogumTarihi = dogumTarihiError;

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}
