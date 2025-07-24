# TC Kimlik Doğrulama API

Bu proje, TC Kimlik numarası doğrulama işlemlerini gerçekleştiren bir API servisidir. NVI (Nüfus ve Vatandaşlık İşleri) servisini kullanarak kimlik doğrulaması yapar.

## Özellikler

- TC Kimlik numarası algoritma kontrolü
- Gerçek zamanlı kimlik doğrulama
- RESTful API
- Hata yönetimi ve loglama
- CORS desteği
- Güvenli HTTP başlıkları
- Helmet.js güvenlik önlemleri

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/tc-kimlik-sorgu.git
cd tc-kimlik-sorgu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Gerekli modülleri yükleyin:
```bash
npm install express express-validator cors helmet soap
```

4. Uygulamayı başlatın:
```bash
npm start
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

## İletişim

- GitHub: [@Tahaylmz](https://github.com/Tahaylmz)
- Email: tahayilmazdev@gmail.com