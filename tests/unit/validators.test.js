const Validators = require('../../src/utils/validators');

describe('Validators', () => {
  describe('validateTCKN', () => {
    test('geçerli TC Kimlik No doğrulamalı', () => {
      // 11111111110 geçerli bir test TCKN'dir
      const result = Validators.validateTCKN('11111111110');
      expect(result).toBeNull();
    });

    test('boş TCKN için hata vermeli', () => {
      const result = Validators.validateTCKN('');
      expect(result).toBe('Boş bırakılamaz');
    });

    test('11 haneli olmayan TCKN için hata vermeli', () => {
      const result = Validators.validateTCKN('123456789');
      expect(result).toBe('11 haneli bir sayı olmalıdır');
    });

    test('0 ile başlayan TCKN için hata vermeli', () => {
      const result = Validators.validateTCKN('01234567890');
      expect(result).toBe('Geçersiz TC Kimlik No');
    });

    test('harf içeren TCKN için hata vermeli', () => {
      const result = Validators.validateTCKN('1234567890a');
      expect(result).toBe('11 haneli bir sayı olmalıdır');
    });

    test('algoritma kontrolü geçmeyen TCKN için hata vermeli', () => {
      const result = Validators.validateTCKN('12345678901');
      expect(result).toBe('Geçersiz TC Kimlik No');
    });
  });

  describe('validateName', () => {
    test('geçerli isim doğrulamalı', () => {
      const result = Validators.validateName('Ahmet');
      expect(result).toBeNull();
    });

    test('boş isim için hata vermeli', () => {
      const result = Validators.validateName('');
      expect(result).toBe('Boş bırakılamaz');
    });

    test('2 karakterden az isim için hata vermeli', () => {
      const result = Validators.validateName('A');
      expect(result).toBe('En az 2 karakter olmalıdır');
    });

    test('özel karakter içeren isim için hata vermeli', () => {
      const result = Validators.validateName('Ahmet123');
      expect(result).toBe('Sadece harf ve boşluk içerebilir');
    });

    test('Türkçe karakterli isim doğrulamalı', () => {
      const result = Validators.validateName('Ömer Şahin');
      expect(result).toBeNull();
    });

    test('50 karakterden fazla isim için hata vermeli', () => {
      const longName = 'A'.repeat(51);
      const result = Validators.validateName(longName);
      expect(result).toBe('En fazla 50 karakter olabilir');
    });
  });

  describe('validateSurname', () => {
    test('geçerli soyisim doğrulamalı', () => {
      const result = Validators.validateSurname('Yılmaz');
      expect(result).toBeNull();
    });

    test('boş soyisim için hata vermeli', () => {
      const result = Validators.validateSurname('');
      expect(result).toBe('Boş bırakılamaz');
    });

    test('2 karakterden az soyisim için hata vermeli', () => {
      const result = Validators.validateSurname('Y');
      expect(result).toBe('En az 2 karakter olmalıdır');
    });
  });

  describe('validateBirthDate', () => {
    test('geçerli doğum tarihi doğrulamalı', () => {
      const result = Validators.validateBirthDate('01.01.1990');
      expect(result).toBeNull();
    });

    test('boş doğum tarihi için hata vermeli', () => {
      const result = Validators.validateBirthDate('');
      expect(result).toBe('Boş bırakılamaz');
    });

    test('yanlış format için hata vermeli', () => {
      const result = Validators.validateBirthDate('1990-01-01');
      expect(result).toBe('GG.AA.YYYY formatında olmalıdır');
    });

    test('geçersiz gün için hata vermeli', () => {
      const result = Validators.validateBirthDate('32.01.1990');
      expect(result).toBe('Geçersiz gün. 1-31 arası bir değer giriniz');
    });

    test('geçersiz ay için hata vermeli', () => {
      const result = Validators.validateBirthDate('01.13.1990');
      expect(result).toBe('Geçersiz ay. 1-12 arası bir değer giriniz');
    });

    test('gelecek tarih için hata vermeli', () => {
      const currentYear = new Date().getFullYear();
      const result = Validators.validateBirthDate(`01.01.${currentYear + 1}`);
      expect(result).toContain('1900 ile');
    });

    test('şubat ayında geçersiz gün için hata vermeli', () => {
      const result = Validators.validateBirthDate('30.02.1990');
      expect(result).toBe('2. ay 28 gün içerir. Lütfen geçerli bir gün giriniz');
    });
  });
});
