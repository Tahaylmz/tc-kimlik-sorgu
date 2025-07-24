const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests', () => {
  describe('POST /api/verify', () => {
    test('geçerli veri ile istek göndermeli', async () => {
      const testData = {
        tckn: '11111111110',
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const response = await request(app)
        .post('/api/verify')
        .send(testData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });

    test('geçersiz TC Kimlik No ile hata dönmeli', async () => {
      const testData = {
        tckn: '123',
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const response = await request(app)
        .post('/api/verify')
        .send(testData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('eksik veri ile hata dönmeli', async () => {
      const testData = {
        tckn: '11111111110',
        ad: 'Ahmet'
        // soyad ve dogumTarihi eksik
      };

      const response = await request(app)
        .post('/api/verify')
        .send(testData)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('boş body ile hata dönmeli', async () => {
      const response = await request(app)
        .post('/api/verify')
        .send({})
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Content-Type application/json gerekli', async () => {
      const response = await request(app)
        .post('/api/verify')
        .send('invalid data')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/health', () => {
    test('sağlık kontrolü çalışmalı', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Service is running'
      });
    });
  });

  describe('404 Errors', () => {
    test('olmayan endpoint için 404 dönmeli', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    test('yanlış HTTP method için hata dönmeli', async () => {
      const response = await request(app)
        .put('/api/verify')
        .send({})
        .expect(404);
    });
  });
});
