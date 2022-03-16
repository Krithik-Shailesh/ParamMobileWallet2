import CryptoJS from 'crypto-js';

export function encrypt(text, password) {
    var encrypted = CryptoJS.AES.encrypt(text, password, {
        mode: CryptoJS.mode.CTR
    });
    return encrypted.toString();
}

export function decrypt(encrypted, password) {
    var decrypted = CryptoJS.AES.decrypt(encrypted, password, {
        mode: CryptoJS.mode.CTR
    });
    return (CryptoJS.enc.Utf8.stringify(decrypted))
}
