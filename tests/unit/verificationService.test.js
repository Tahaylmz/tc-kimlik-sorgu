const VerificationService = require('../../src/services/verificationService');

describe('VerificationService', () => {
  describe('verifyIdentity', () => {
    test('geçersiz TC Kimlik No için false döndürmeli', async () => {
      const invalidData = {
        tckn: '12345678901',
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const result = await VerificationService.verifyIdentity(invalidData);

      expect(result).toEqual({
        success: false,
        message: 'Geçersiz TC Kimlik No'
      });
    });

    test('0 ile başlayan TC Kimlik No için false döndürmeli', async () => {
      const invalidData = {
        tckn: '01234567890',
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const result = await VerificationService.verifyIdentity(invalidData);

      expect(result).toEqual({
        success: false,
        message: 'Geçersiz TC Kimlik No'
      });
    });

    test('algoritmaya uygun olmayan TC Kimlik No için false döndürmeli', async () => {
      const invalidData = {
        tckn: '11111111111', // Bu TCKN algoritma kontrolünden geçmez
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const result = await VerificationService.verifyIdentity(invalidData);

      expect(result).toEqual({
        success: false,
        message: 'Geçersiz TC Kimlik No'
      });
    });

    test('SOAP servis hatası durumunda error response döndürmeli', async () => {
      // Bu test gerçek SOAP servisine bağlanmaya çalışacak ve muhtemelen timeout veya network error alacak
      const validAlgorithmData = {
        tckn: '11111111110', // Bu TCKN algoritma kontrolünden geçer ama gerçek değil
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        dogumTarihi: '01.01.1990'
      };

      const result = await VerificationService.verifyIdentity(validAlgorithmData);

      // SOAP servis hatası bekliyoruz
      expect(result.success).toBe(false);
      expect(result.message).toContain('doğrulanamadı');
    }, 15000); // 15 saniye timeout
  });
});
