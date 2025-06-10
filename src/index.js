const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Hata mesajları
const ERROR_MESSAGES = {
    INVALID_TCKN: 'Geçersiz TC Kimlik Numarası',
    INVALID_NAME: 'Geçersiz Ad',
    INVALID_SURNAME: 'Geçersiz Soyad',
    INVALID_BIRTH_YEAR: 'Geçersiz Doğum Yılı',
    MISSING_FIELDS: 'Tüm alanlar zorunludur',
    SERVER_ERROR: 'Sunucu hatası oluştu',
    VERIFICATION_FAILED: 'Kimlik doğrulama başarısız',
    INVALID_NAME_LENGTH: 'Ad en az 2 karakter olmalıdır',
    INVALID_SURNAME_LENGTH: 'Soyad en az 2 karakter olmalıdır',
    INVALID_BIRTH_YEAR_RANGE: 'Doğum yılı 1900 ile 2024 arasında olmalıdır'
};

// TC Kimlik No validation function
function validateTCKN(tckn) {
    // Boşluk kontrolü
    if (!tckn || tckn.trim() === '') {
        return { valid: false, message: ERROR_MESSAGES.INVALID_TCKN };
    }

    // Sadece rakam kontrolü
    if (!/^[0-9]+$/.test(tckn)) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_TCKN };
    }

    // 11 haneli olma kontrolü
    if (tckn.length !== 11) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_TCKN };
    }

    // İlk hane 0 olamaz
    if (tckn[0] === '0') {
        return { valid: false, message: ERROR_MESSAGES.INVALID_TCKN };
    }

    const digits = tckn.split('').map(Number);
    
    // Algoritma kontrolü
    const odd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const even = digits[1] + digits[3] + digits[5] + digits[7];
    
    const digit10 = ((odd * 7) - even) % 10;
    const digit11 = (digits.slice(0, 10).reduce((acc, val) => acc + val, 0)) % 10;

    if (digit10 !== digits[9] || digit11 !== digits[10]) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_TCKN };
    }

    return { valid: true };
}

// İsim kontrolü
function validateName(name) {
    if (!name || name.trim().length < 2) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_NAME_LENGTH };
    }
    if (!/^[A-ZÇĞİÖŞÜ\s]+$/i.test(name)) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_NAME };
    }
    return { valid: true };
}

// Soyisim kontrolü
function validateSurname(surname) {
    if (!surname || surname.trim().length < 2) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_SURNAME_LENGTH };
    }
    if (!/^[A-ZÇĞİÖŞÜ\s]+$/i.test(surname)) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_SURNAME };
    }
    return { valid: true };
}

// Doğum yılı kontrolü
function validateBirthYear(year) {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
        return { valid: false, message: ERROR_MESSAGES.INVALID_BIRTH_YEAR_RANGE };
    }
    return { valid: true };
}

// TC Kimlik verification endpoint
app.post('/api/verify', async (req, res) => {
    try {
        const { tckn, ad, soyad, dogumYili } = req.body;

        // Zorunlu alan kontrolü
        if (!tckn || !ad || !soyad || !dogumYili) {
            return res.status(400).json({
                success: false,
                message: ERROR_MESSAGES.MISSING_FIELDS
            });
        }

        // TC Kimlik No doğrulama
        const tcknValidation = validateTCKN(tckn);
        if (!tcknValidation.valid) {
            return res.status(400).json({
                success: false,
                message: tcknValidation.message
            });
        }

        // İsim doğrulama
        const nameValidation = validateName(ad);
        if (!nameValidation.valid) {
            return res.status(400).json({
                success: false,
                message: nameValidation.message
            });
        }

        // Soyisim doğrulama
        const surnameValidation = validateSurname(soyad);
        if (!surnameValidation.valid) {
            return res.status(400).json({
                success: false,
                message: surnameValidation.message
            });
        }

        // Doğum yılı doğrulama
        const birthYearValidation = validateBirthYear(dogumYili);
        if (!birthYearValidation.valid) {
            return res.status(400).json({
                success: false,
                message: birthYearValidation.message
            });
        }

        // Burada resmi TC Kimlik doğrulama servisine istek atılacak
        // Şimdilik mock response dönüyoruz
        const mockResponse = {
            success: true,
            data: {
                tckn,
                ad: ad.toUpperCase(),
                soyad: soyad.toUpperCase(),
                dogumYili,
                verified: true,
                message: 'Kimlik doğrulama başarılı'
            }
        };

        res.json(mockResponse);
    } catch (error) {
        console.error('Doğrulama hatası:', error);
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.SERVER_ERROR
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'Servis çalışıyor',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`TC Kimlik API sunucusu ${port} portunda çalışıyor`);
}); 