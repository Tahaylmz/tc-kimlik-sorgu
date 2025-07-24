const Validators = require('../utils/validators');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../utils/constants');

const validateVerificationRequest = (req, res, next) => {
    const { tckn, ad, soyad, dogumTarihi } = req.body;

    // Zorunlu alan kontrolü
    if (!tckn || !ad || !soyad || !dogumTarihi) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.MISSING_FIELDS || 'Tüm alanlar zorunludur'
        });
    }

    // TC Kimlik No doğrulama
    const tcknError = Validators.validateTCKN(tckn);
    if (tcknError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: tcknError
        });
    }

    // İsim doğrulama
    const nameError = Validators.validateName(ad);
    if (nameError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: nameError
        });
    }

    // Soyisim doğrulama
    const surnameError = Validators.validateSurname(soyad);
    if (surnameError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: surnameError
        });
    }

    // Doğum tarihi doğrulama
    const birthDateError = Validators.validateBirthDate(dogumTarihi);
    if (birthDateError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: birthDateError
        });
    }

    next();
};

module.exports = {
    validateVerificationRequest
}; 