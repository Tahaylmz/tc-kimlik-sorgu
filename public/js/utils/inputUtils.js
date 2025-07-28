/**
 * Input Utilities
 * Input maskeleme ve format fonksiyonları
 */

export class InputUtils {
    /**
     * TC Kimlik No formatı (sadece rakam)
     * @param {string} value - Input değeri
     * @returns {string} Formatlanmış değer
     */
    static formatTCKN(value) {
        return value.replace(/\D/g, '').slice(0, 11);
    }

    /**
     * İsim formatı (sadece harf ve boşluk)
     * @param {string} value - Input değeri
     * @returns {string} Formatlanmış değer
     */
    static formatName(value) {
        return value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
    }

    /**
     * Doğum tarihi formatı (GG.AA.YYYY)
     * @param {string} value - Input değeri
     * @returns {string} Formatlanmış değer
     */
    static formatBirthDate(value) {
        let numericValue = value.replace(/\D/g, '');
        
        if (numericValue.length <= 2) {
            return numericValue;
        } else if (numericValue.length <= 4) {
            return numericValue.slice(0, 2) + '.' + numericValue.slice(2);
        } else {
            return numericValue.slice(0, 2) + '.' + 
                   numericValue.slice(2, 4) + '.' + 
                   numericValue.slice(4, 8);
        }
    }

    /**
     * Input maskeleme setup
     * @param {HTMLInputElement} input - Input elementi
     * @param {string} type - Maskeleme tipi ('tckn', 'name', 'birthdate')
     */
    static setupInputMask(input, type) {
        switch (type) {
            case 'tckn':
                input.addEventListener('input', (e) => {
                    e.target.value = this.formatTCKN(e.target.value);
                });
                break;
                
            case 'name':
                input.addEventListener('input', (e) => {
                    e.target.value = this.formatName(e.target.value);
                });
                break;
                
            case 'birthdate':
                input.addEventListener('input', (e) => {
                    e.target.value = this.formatBirthDate(e.target.value);
                });
                break;
        }
    }

    /**
     * Input'a paste olayında da formatlamayı uygular
     * @param {HTMLInputElement} input - Input elementi
     * @param {string} type - Format tipi
     */
    static setupPasteHandler(input, type) {
        input.addEventListener('paste', (e) => {
            setTimeout(() => {
                switch (type) {
                    case 'tckn':
                        e.target.value = this.formatTCKN(e.target.value);
                        break;
                    case 'name':
                        e.target.value = this.formatName(e.target.value);
                        break;
                    case 'birthdate':
                        e.target.value = this.formatBirthDate(e.target.value);
                        break;
                }
            }, 0);
        });
    }
}
