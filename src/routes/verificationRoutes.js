const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const VerificationService = require('../services/verificationService');
const { ERROR_MESSAGES } = require('../utils/constants');

// TC Kimlik No doğrulama endpoint'i
router.post('/tckn', [
    body('tckn')
        .notEmpty().withMessage('TC Kimlik No boş olamaz')
        .isLength({ min: 11, max: 11 }).withMessage('TC Kimlik No 11 haneli olmalıdır')
        .isNumeric().withMessage('TC Kimlik No sadece rakamlardan oluşmalıdır')
], async (req, res) => {
    try {
        // Validation hatalarını kontrol et
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        // TC Kimlik No doğrulamasını yap
        const result = await VerificationService.verifyTCKN(req.body.tckn);
        res.json(result);

    } catch (error) {
        console.error('TCKN verification error:', error);
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});

// Tam kimlik doğrulama endpoint'i
router.post('/verify', [
    body('tckn')
        .notEmpty().withMessage('TC Kimlik No boş olamaz')
        .isLength({ min: 11, max: 11 }).withMessage('TC Kimlik No 11 haneli olmalıdır')
        .isNumeric().withMessage('TC Kimlik No sadece rakamlardan oluşmalıdır'),
    body('ad')
        .notEmpty().withMessage('Ad boş olamaz')
        .isLength({ min: 2 }).withMessage('Ad en az 2 karakter olmalıdır'),
    body('soyad')
        .notEmpty().withMessage('Soyad boş olamaz')
        .isLength({ min: 2 }).withMessage('Soyad en az 2 karakter olmalıdır'),
    body('dogumTarihi')
        .notEmpty().withMessage('Doğum tarihi boş olamaz')
        .matches(/^\d{2}\.\d{2}\.\d{4}$/).withMessage('Doğum tarihi GG.AA.YYYY formatında olmalıdır')
], async (req, res) => {
    try {
        // Validation hatalarını kontrol et
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        // Kimlik doğrulamasını yap
        const result = await VerificationService.verifyIdentity(req.body);
        res.json(result);

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
});

// Health check endpoint'i
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Service is running'
    });
});

module.exports = router; 