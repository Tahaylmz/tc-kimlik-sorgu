const soap = require('soap');

class VerificationService {
    static async verifyIdentity(data) {
        try {
            console.log('Verification service input:', data);

            // TC Kimlik No algoritması
            const tckn = data.tckn;
            const digits = tckn.split('').map(Number);
            
            // 1. rakam 0 olamaz
            if (digits[0] === 0) {
                return {
                    success: false,
                    message: 'Geçersiz TC Kimlik No'
                };
            }
            
            // 1-10. rakamların toplamının birler basamağı 11. rakamı vermeli
            const sum1 = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
            if (sum1 % 10 !== digits[10]) {
                return {
                    success: false,
                    message: 'Geçersiz TC Kimlik No'
                };
            }
            
            // 1,3,5,7,9. rakamların toplamının 7 katından, 2,4,6,8. rakamların toplamı çıkartıldığında,
            // elde edilen sonucun 10'a bölümünden kalan, 10. rakamı vermeli
            const sum2 = digits.slice(0, 9).reduce((acc, val, idx) => {
                return acc + (idx % 2 === 0 ? val * 7 : -val);
            }, 0);
            if ((sum2 % 10 + 10) % 10 !== digits[9]) {
                return {
                    success: false,
                    message: 'Geçersiz TC Kimlik No'
                };
            }

            // SOAP istemcisini oluştur
            const wsdlUrl = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
            
            try {
                const client = await new Promise((resolve, reject) => {
                    soap.createClient(wsdlUrl, {
                        disableCache: true,
                        forceSoap12Headers: false,
                        wsdl_headers: {
                            'User-Agent': 'Mozilla/5.0',
                            'Content-Type': 'text/xml;charset=UTF-8',
                            'SOAPAction': 'http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula'
                        },
                        wsdl_options: {
                            timeout: 5000,
                            strictSSL: false
                        }
                    }, (err, client) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(client);
                        }
                    });
                });

                // TC Kimlik doğrulama servisine istek at
                const args = {
                    TCKimlikNo: parseInt(data.tckn),
                    Ad: data.ad,
                    Soyad: data.soyad,
                    DogumYili: parseInt(data.dogumTarihi.split('.')[2])
                };

                const result = await new Promise((resolve, reject) => {
                    client.TCKimlikNoDogrula(args, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                // Servis yanıtını kontrol et
                if (result.TCKimlikNoDogrulaResult === true) {
                    return {
                        success: true,
                        data: {
                            verified: true,
                            message: 'Kimlik doğrulama başarılı'
                        }
                    };
                } else {
                    return {
                        success: false,
                        message: 'Kimlik bilgileri doğrulanamadı'
                    };
                }
            } catch (soapError) {
                console.error('SOAP client error:', soapError);
                return {
                    success: false,
                    message: 'Kimlik doğrulama servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyiniz.'
                };
            }

        } catch (error) {
            console.error('Verification service error:', error);
            return {
                success: false,
                message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
            };
        }
    }
}

module.exports = VerificationService; 