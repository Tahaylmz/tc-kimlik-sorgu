# TC Kimlik Doğrulama API

Bu proje, TC Kimlik numarası doğrulama işlemlerini gerçekleştiren bir REST API sunar. Resmi Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü (NVİ) KPS servisini kullanarak kimlik doğrulaması yapar.

## Özellikler

- TC Kimlik numarası algoritma kontrolü
- Ad, soyad ve doğum yılı doğrulaması
- Detaylı hata mesajları
- RESTful API yapısı
- Güvenli SOAP entegrasyonu

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici/tc-kimlik-sorgu.git
cd tc-kimlik-sorgu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

## API Kullanımı

### Kimlik Doğrulama

```http
POST /api/verify
Content-Type: application/json

{
    "tckn": "12345678901",
    "ad": "AD",
    "soyad": "SOYAD",
    "dogumTarihi": "01.01.1990"
}
```

#### Başarılı Yanıt

```json
{
    "success": true,
    "data": {
        "tckn": "12345678901",
        "ad": "AD",
        "soyad": "SOYAD",
        "dogumTarihi": "01.01.1990",
        "verified": true,
        "message": "Kimlik doğrulama başarılı"
    }
}
```

#### Hata Yanıtı

```json
{
    "success": false,
    "message": "Kimlik bilgileri doğrulanamadı. Ad bilgisi geçersiz."
}
```

## Kullanılan Servisler

- NVİ KPS Public Service: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx
- SOAP 1.1 Endpoint: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

## Test

Testleri çalıştırmak için:

```bash
npm test
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Dalınıza push yapın (`git push origin yeni-ozellik`)
5. Bir Pull Request oluşturun 