# TC Kimlik Doğrulama API 🆔

TC Kimlik numarası doğrulama işlemlerini gerçekleştiren modern full-stack uygulaması. NVI (Nüfus ve Vatandaşlık İşleri) servisini kullanarak kimlik doğrulaması yapar.

## ✨ Özellikler

### Backend
- TC Kimlik algoritma kontrolü  
- RESTful API
- Kapsamlı test coverage (%80+)
- Hata yönetimi ve güvenlik

### Frontend  
- **Modüler ES6 yapısı**
- **Real-time validation**
- **Auto-scroll hata yönetimi**
- **Responsive tasarım**
- **Network monitoring**
- **Toast notifications**

## 🚀 Kurulum

```bash
# Projeyi klonla
git clone https://github.com/Tahaylmz/tc-kimlik-sorgu.git
cd tc-kimlik-sorgu

# Bağımlılıkları yükle  
npm install

# Uygulamayı başlat
npm start
```

**Tarayıcıda:** `http://localhost:3000`

## 🔧 Development

```bash
npm test              # Testleri çalıştır
npm run test:watch    # Test watch mode
npm run dev           # Development mode
```

## API Kullanımı

### Kimlik Doğrulama

```http
POST /api/verify
Content-Type: application/json

{
    "tckn": "TC Kimlik No",
    "ad": "Ad",
    "soyad": "Soyad",
    "dogumTarihi": "GG.AA.YYYY"
}
```

#### Başarılı Yanıt

```json
{
    "success": true,
    "data": {
        "verified": true,
        "message": "Kimlik doğrulama başarılı"
    }
}
```

#### Hata Yanıtı

```json
{
    "success": false,
    "message": "Hata mesajı"
}
```

### Curl İstekleri

Aşağıda API'yi test etmek için kullanabileceğiniz curl komutları bulunmaktadır:

#### Başarılı Doğrulama İsteği

```bash
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "tckn": "12345678901",
    "ad": "John",
    "soyad": "Doe",
    "dogumTarihi": "01.01.1990"
  }'
```

#### Geçersiz TC Kimlik Numarası

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "tckn": "123456789",
    "ad": "John",
    "soyad": "Doe",
    "dogumTarihi": "01.01.1990"
  }'
```

#### Eksik Alan İsteği

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "tckn": "12345678901",
    "ad": "John"
  }'
```

#### Verbose Mod ile İstek

```bash
curl -X POST http://localhost:3000/api/verify \
  -H "Content-Type: application/json" \
  -v \
  -d '{
    "tckn": "12345678901",
    "ad": "John",
    "soyad": "Doe",
    "dogumTarihi": "01.01.1990"
  }'
```

## Güvenlik

- CORS koruması
- Helmet.js güvenlik başlıkları
- Rate limiting
- Input validasyonu
- Güvenli HTTP başlıkları

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

## Testler

Bu proje kapsamlı test kapsama alanına sahiptir. Unit testler ve entegrasyon testleri mevcuttur.

### Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Testleri watch modunda çalıştır
npm run test:watch

# Test kapsama raporu oluştur
npm run test:coverage

# Sadece unit testleri çalıştır
npm run test:unit

# Sadece entegrasyon testleri çalıştır
npm run test:integration
```

### Test Yapısı

```
tests/
├── unit/                     # Unit testler
│   ├── validators.test.js    # Doğrulama fonksiyonları testleri
│   ├── verificationController.test.js  # Controller testleri
│   ├── verificationService.test.js     # Servis testleri
│   ├── validation.test.js    # Middleware testleri
│   └── errorHandler.test.js  # Hata yönetimi testleri
├── integration/              # Entegrasyon testleri
│   └── api.test.js          # API endpoint testleri
└── setup.js                 # Test konfigürasyonu
```

### Test Kapsama Alanı

Testler aşağıdaki alanları kapsar:

- **Validators**: TC Kimlik No algoritması, isim/soyisim validasyonu, doğum tarihi kontrolü
- **Controllers**: API controller fonksiyonları ve hata yönetimi
- **Services**: Kimlik doğrulama servisi ve SOAP entegrasyonu
- **Middleware**: Validasyon middleware ve error handler
- **API Endpoints**: RESTful API entegrasyon testleri

### Test Örneği

```javascript
// Validators test örneği
test('geçerli TC Kimlik No doğrulamalı', () => {
  const result = Validators.validateTCKN('11111111110');
  expect(result).toBeNull();
});

// API test örneği
test('geçerli veri ile istek göndermeli', async () => {
  const response = await request(app)
    .post('/api/verify')
    .send({
      tckn: '11111111110',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      dogumTarihi: '01.01.1990'
    });
  expect(response.status).toBe(200);
});
```

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

### MIT Lisansı

```
MIT License

Copyright (c) 2025 Taha Yılmaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## İletişim

- GitHub: [@Tahaylmz](https://github.com/Tahaylmz)
- Email: tahayilmazdev@gmail.com