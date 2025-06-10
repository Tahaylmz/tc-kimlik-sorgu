const ERROR_MESSAGES = {
    INVALID_TCKN: 'Geçersiz TC Kimlik Numarası. Lütfen 11 haneli TC Kimlik numaranızı kontrol ediniz.',
    INVALID_NAME: 'Geçersiz Ad. Adınız sadece harf içermelidir.',
    INVALID_SURNAME: 'Geçersiz Soyad. Soyadınız sadece harf içermelidir.',
    INVALID_BIRTH_DATE: 'Geçersiz Doğum Tarihi. Lütfen GG.AA.YYYY formatında giriniz.',
    MISSING_FIELDS: 'Lütfen tüm alanları doldurunuz.',
    SERVER_ERROR: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.',
    VERIFICATION_FAILED: 'Kimlik doğrulama başarısız. Bilgilerinizi kontrol edip tekrar deneyiniz.',
    INVALID_NAME_LENGTH: 'Ad en az 2 karakter olmalıdır.',
    INVALID_SURNAME_LENGTH: 'Soyad en az 2 karakter olmalıdır.',
    INVALID_DATE_FORMAT: 'Doğum tarihi GG.AA.YYYY formatında olmalıdır.',
    INVALID_DATE_RANGE: 'Doğum tarihi 01.01.1900 ile bugün arasında olmalıdır.',
    INVALID_DAY: 'Geçersiz gün. Ayın gün sayısına uygun bir değer giriniz.',
    INVALID_MONTH: 'Geçersiz ay. 1-12 arası bir değer giriniz.',
    INVALID_YEAR: 'Geçersiz yıl. 1900 ile bugün arası bir değer giriniz.'
};

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const REGEX_PATTERNS = {
    TCKN: /^[1-9][0-9]{10}$/,
    NAME: /^[A-ZÇĞİÖŞÜa-zçğıöşü\s]+$/,
    DATE: /^([0-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.(19[0-9]{2}|20[0-2][0-4])$/
};

const DATE_FORMAT = {
    DISPLAY: 'GG.AA.YYYY',
    REGEX: REGEX_PATTERNS.DATE
};

module.exports = {
    ERROR_MESSAGES,
    HTTP_STATUS,
    REGEX_PATTERNS,
    DATE_FORMAT
}; 