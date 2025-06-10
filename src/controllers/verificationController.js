const VerificationService = require('../services/verificationService');
const { HTTP_STATUS } = require('../utils/constants');

class VerificationController {
    static async verify(req, res, next) {
        try {
            const result = await VerificationService.verifyIdentity(req.body);
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            next(error);
        }
    }

    static healthCheck(req, res) {
        res.status(HTTP_STATUS.OK).json({
            status: 'OK',
            message: 'Servis çalışıyor',
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = VerificationController; 