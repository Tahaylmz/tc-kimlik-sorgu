const { validateVerificationRequest } = require('../../src/middleware/validation');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
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

  test('geçerli veri ile next çağrılmalı', () => {
    req.body = {
      tckn: '11111111110',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      dogumTarihi: '01.01.1990'
    };

    validateVerificationRequest(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('geçersiz TC Kimlik No ile hata dönmeli', () => {
    req.body = {
      tckn: '123',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      dogumTarihi: '01.01.1990'
    };

    validateVerificationRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('11 haneli')
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('eksik alan ile hata dönmeli', () => {
    req.body = {
      tckn: '11111111110',
      ad: 'Ahmet'
      // soyad eksik
    };

    validateVerificationRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('tüm alan')
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('geçersiz ad ile hata dönmeli', () => {
    req.body = {
      tckn: '11111111110',
      ad: 'Ahmet123',
      soyad: 'Yılmaz',
      dogumTarihi: '01.01.1990'
    };

    validateVerificationRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('Sadece harf')
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('geçersiz doğum tarihi ile hata dönmeli', () => {
    req.body = {
      tckn: '11111111110',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      dogumTarihi: '1990-01-01'
    };

    validateVerificationRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('GG.AA.YYYY')
    });
    expect(next).not.toHaveBeenCalled();
  });
});
