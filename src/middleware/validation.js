const Validators = require('../utils/validators');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../utils/constants');

const validateVerificationRequest = (req, res, next) => {
    const { tckn, ad, soyad, dogumYili } = req.body;

    // Zorunlu alan kontrolü
    if (!tckn || !ad || !soyad || !dogumYili) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.MISSING_FIELDS
        });
    }

    // TC Kimlik No doğrulama
    const tcknValidation = Validators.validateTCKN(tckn);
    if (!tcknValidation.valid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: tcknValidation.message
        });
    }

    // İsim doğrulama
    const nameValidation = Validators.validateName(ad);
    if (!nameValidation.valid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: nameValidation.message
        });
    }

    // Soyisim doğrulama
    const surnameValidation = Validators.validateSurname(soyad);
    if (!surnameValidation.valid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: surnameValidation.message
        });
    }

    // Doğum yılı doğrulama
    const birthYearValidation = Validators.validateBirthYear(dogumYili);
    if (!birthYearValidation.valid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: birthYearValidation.message
        });
    }

    next();
};

module.exports = {
    validateVerificationRequest
}; 