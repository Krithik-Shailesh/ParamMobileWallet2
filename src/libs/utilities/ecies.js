import cryptoRandomString from 'crypto-random-string'
import Storage from "../storage/utilities";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const aesctr = require('./aes-ctr');
const pbkdf2 = require('pbkdf2')

class ECIES {

    // appends 04 if not present in publicKey
    static formatPublickey(publicKey) {
        if (publicKey.startsWith("0x")) {
            publicKey = publicKey.substr(2);
        }
        if (publicKey.length === 128) {
            publicKey = "04" + publicKey;
        }
        return publicKey
    }

    static getPublicKey(cipherText) {
        const publicKey1 = cipherText.substr(0, 128);
        const publicKey2 = cipherText.substr(-128);
        const selfPublicKey = Storage.getInstance().getFromStorage("publicKey");
        if (publicKey1 === selfPublicKey)
            return publicKey2;
        return publicKey1;
    }

    // returns shared key of hex formatted publicKey and privateKey (without leading 0x)
    static getSharedKey(privateKey, publicKey) {
        publicKey = ECIES.formatPublickey(publicKey);
        privateKey = ec.keyFromPrivate(privateKey, 'hex');
        publicKey = ec.keyFromPublic(publicKey, 'hex');
        let sharedKey = privateKey.derive(publicKey.getPublic());
        sharedKey = sharedKey.toString('hex');
        if (sharedKey && sharedKey.length !== 64) {
            let gap = 64 - sharedKey.length
            let str = ""
            for (let index = 0; index < gap; index++) {
                str += "0"
            }
            sharedKey = str + sharedKey
        }
        return sharedKey;
    }

    // retruns HMAC-SHA512
    static getDigest(sharedKey, randomStr, encryptionVersion) {
        //for supporting GRN Manager
        if (encryptionVersion === "1") {
            sharedKey = "";
        }
        let digest = pbkdf2.pbkdf2Sync(sharedKey, randomStr, 2048, 256, 'sha512').toString('hex');
        return digest;
    }

    static encrypt(privateKey, receiverPublicKey, message, initialRandomStr, senderPublicKey) {
        // FIXME/TODO: Genrate strong random string hash b/w buyer, seller and 3rd Party.
        // We commented below code for supporting 3rd party can able to sign/modify the
        // JSONLd. Changed due to GRN Manager can able to add document.
        const sharedKey = ECIES.getSharedKey(privateKey, receiverPublicKey);
        const randomStr = initialRandomStr || cryptoRandomString({ length: 512, type: 'base64' }); //length: 512, type: "base64" 
        const encryptedRandomStr = aesctr.encrypt(randomStr, sharedKey);
        const encryptionVersion = "1";
        const receiptKey = ECIES.getDigest(sharedKey, randomStr, encryptionVersion);
        const cipherText = aesctr.encrypt(message, receiptKey);
        let len = encryptedRandomStr.length;
        len = len.toString(16);
        // len = “000” + len;
        len = len.slice(-3);
        if (!senderPublicKey) {
            senderPublicKey = Storage.getInstance().getFromStorage("publicKey");
        }
        let encryptedResponse = {
            encryptedPayload: senderPublicKey + encryptionVersion + len + encryptedRandomStr + cipherText + receiverPublicKey,
            encryptedRandomStr: receiptKey
        }
        return encryptedResponse;
        //return senderPublicKey + encryptionVersion + len + encryptedRandomStr + cipherText + receiverPublicKey;
    }

    static getSubscribers(privateKey, exchangeDetails, encryptedRandomStr) {
        let subscribers = {};
        if (!exchangeDetails) {
            exchangeDetails = []
        }
        if (!Array.isArray(exchangeDetails)) {
            exchangeDetails = [exchangeDetails]
        }
        for (let index = 0; index < exchangeDetails.length; index++) {
            if (exchangeDetails[index].paramID && exchangeDetails[index].publicKey) {
                let exchangePublicKey = exchangeDetails[index].publicKey
                let encryptedResponse = ECIES.encrypt(privateKey, exchangePublicKey, encryptedRandomStr)
                subscribers[exchangeDetails[index].paramID] = encryptedResponse.encryptedPayload
            }
        }
        return subscribers;
    }

    // static encryptForSubscriber(receiverPublicKey, message, initialRandomStr, encryptedRandomStr, senderPublicKey) {
    //     const encryptionVersion = "1";
    //     const receiptKey = ECIES.getDigest("", initialRandomStr, encryptionVersion);
    //     const cipherText = aesctr.encrypt(message, receiptKey);
    //     let len = encryptedRandomStr.length;
    //     len = len.toString(16);
    //     // len = “000” + len;
    //     len = len.slice(-3);
    //     if (!senderPublicKey) {
    //         senderPublicKey = Utils.getPublicKey();
    //     }
    //     return senderPublicKey + encryptionVersion + len + encryptedRandomStr + cipherText + receiverPublicKey;
    // }

    static decrypt(privateKey, cipherText) {
        try {
            const publicKey = ECIES.getPublicKey(cipherText);
            const sharedKey = ECIES.getSharedKey(privateKey, publicKey);
            cipherText = cipherText.slice(128, -128);
            const encryptionVersion = cipherText.substr(0, 1);
            let randomStrLength = cipherText.substr(1, 3);
            randomStrLength = parseInt(randomStrLength, 16);
            const messageCipher = cipherText.substr(randomStrLength + 4);

            // decrypt with receipt key for subscriber
            if (privateKey.length === 512) {
                if (encryptionVersion === "1") {
                    privateKey = ECIES.getDigest(sharedKey, privateKey, encryptionVersion);
                }
                return aesctr.decrypt(messageCipher, privateKey);
            }

            const randomStr = ECIES.getDecryptedRandomString(privateKey, publicKey, cipherText);
            const receiptKey = ECIES.getDigest(sharedKey, randomStr, encryptionVersion);

            return aesctr.decrypt(messageCipher, receiptKey);
        } catch (e) {
            console.error("Error in decrypting", e);
            throw new Error(e);
        }
    }

    static getDecryptedRandomString(privateKey, publicKey, cipherText) {
        try {
            const sharedKey = ECIES.getSharedKey(privateKey, publicKey);
            const encryptedRandomStr = ECIES.getEncryptedRandomString(cipherText);
            return aesctr.decrypt(encryptedRandomStr, sharedKey);
        } catch (e) {
            console.error("Error in decryptingRandomString", e);
            throw new Error(e);
        }
    }

    static getEncryptedRandomString(cipherText) {
        let randomStrLength = cipherText.substr(1, 3);
        randomStrLength = parseInt(randomStrLength, 16);
        const encryptedRandomStr = cipherText.substr(4, randomStrLength);
        return encryptedRandomStr;
    }

    static decryptWithReceiptKey(receiptCipher, receiptKey) {
        try {
            let randomStrLength = receiptCipher.substr(1, 3);
            randomStrLength = parseInt(randomStrLength, 16);
            receiptCipher = receiptCipher.substr(randomStrLength + 4);
            return aesctr.decrypt(receiptCipher, receiptKey);
        } catch (e) {
            console.error("Error in decryptingReceiptKey", e);
            throw new Error(e);
        }
    }

    static getReceiptKey(privateKey, cipherText) {
        const publicKey = ECIES.getPublicKey(cipherText);
        const sharedKey = ECIES.getSharedKey(privateKey, publicKey);
        cipherText = cipherText.slice(128, -128);
        const encryptionVersion = cipherText.substr(0, 1);
        const randomStr = ECIES.getDecryptedRandomString(privateKey, publicKey, cipherText);
        if (encryptionVersion === "1")
            return randomStr;
        return ECIES.getDigest(sharedKey, randomStr);
    }
}

export default ECIES;

