const { ERROR_MESSAGES, REGEX_PATTERNS, DATE_FORMAT } = require('./constants');

class Validators {
    static validateTCKN(tckn) {
        if (!tckn) return 'Boş bırakılamaz';
        if (!/^\d{11}$/.test(tckn)) return '11 haneli bir sayı olmalıdır';
        
        // TC Kimlik No algoritması kontrolü
        const digits = tckn.split('').map(Number);
        
        // 1. rakam 0 olamaz
        if (digits[0] === 0) return 'Geçersiz TC Kimlik No';
        
        // 1-10. rakamların toplamının birler basamağı 11. rakamı vermeli
        const sum1 = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
        if (sum1 % 10 !== digits[10]) return 'Geçersiz TC Kimlik No';
        
        // 1,3,5,7,9. rakamların toplamının 7 katından, 2,4,6,8. rakamların toplamı çıkartıldığında,
        // elde edilen sonucun 10'a bölümünden kalan, 10. rakamı vermeli
        const sum2 = digits.slice(0, 9).reduce((acc, val, idx) => {
            return acc + (idx % 2 === 0 ? val * 7 : -val);
        }, 0);
        if ((sum2 % 10 + 10) % 10 !== digits[9]) return 'Geçersiz TC Kimlik No';
        
        return null;
    }

    static validateName(name) {
        if (!name) return 'Boş bırakılamaz';
        if (name.length < 2) return 'En az 2 karakter olmalıdır';
        if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) return 'Sadece harf ve boşluk içerebilir';
        if (name.length > 50) return 'En fazla 50 karakter olabilir';
        return null;
    }

    static validateSurname(surname) {
        if (!surname) return 'Boş bırakılamaz';
        if (surname.length < 2) return 'En az 2 karakter olmalıdır';
        if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(surname)) return 'Sadece harf ve boşluk içerebilir';
        if (surname.length > 50) return 'En fazla 50 karakter olabilir';
        return null;
    }

    static validateBirthDate(date) {
        if (!date) return 'Boş bırakılamaz';
        
        // GG.AA.YYYY formatı kontrolü
        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
            return 'GG.AA.YYYY formatında olmalıdır';
        }

        const [day, month, year] = date.split('.').map(Number);
        const currentYear = new Date().getFullYear();

        // Gün kontrolü
        if (day < 1 || day > 31) {
            return 'Geçersiz gün. 1-31 arası bir değer giriniz';
        }

        // Ay kontrolü
        if (month < 1 || month > 12) {
            return 'Geçersiz ay. 1-12 arası bir değer giriniz';
        }

        // Yıl kontrolü
        if (year < 1900 || year > currentYear) {
            return `Geçersiz yıl. 1900 ile ${currentYear} arası bir değer giriniz`;
        }

        // Ayın gün sayısı kontrolü
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth) {
            return `${month}. ay ${daysInMonth} gün içerir. Lütfen geçerli bir gün giriniz`;
        }

        // Gelecek tarih kontrolü
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        if (birthDate > today) {
            return 'Gelecek bir tarih giremezsiniz';
        }

        return null;
    }
}

module.exports = Validators; 