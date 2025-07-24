const VerificationController = require('../../src/controllers/verificationController');
const VerificationService = require('../../src/services/verificationService');
const { HTTP_STATUS } = require('../../src/utils/constants');

// Mock the VerificationService
jest.mock('../../src/services/verificationService');

describe('VerificationController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        tckn: '11111111110',
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verify', () => {
    test('başarılı doğrulama için doğru yanıt vermeli', async () => {
      const mockResult = {
        success: true,
        data: {
          verified: true,
          message: 'Kimlik doğrulama başarılı'
        }
      };

      VerificationService.verifyIdentity.mockResolvedValue(mockResult);

      await VerificationController.verify(req, res, next);

      expect(VerificationService.verifyIdentity).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(next).not.toHaveBeenCalled();
    });

    test('servis hatası durumunda next çağrılmalı', async () => {
      const mockError = new Error('Servis hatası');
      VerificationService.verifyIdentity.mockRejectedValue(mockError);

      await VerificationController.verify(req, res, next);

      expect(VerificationService.verifyIdentity).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('healthCheck', () => {
    test('sağlık kontrolü doğru yanıt vermeli', () => {
      const mockDate = new Date('2023-01-01T10:00:00.000Z');
      jest.spyOn(Date, 'constructor').mockImplementation(() => mockDate);
      jest.spyOn(mockDate, 'toISOString').mockReturnValue('2023-01-01T10:00:00.000Z');

      VerificationController.healthCheck(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'OK',
        message: 'Servis çalışıyor',
        timestamp: expect.any(String)
      });
    });
  });
});
