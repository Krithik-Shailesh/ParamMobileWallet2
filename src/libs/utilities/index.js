import settings from '../../../settings.json'
import Crypto from 'crypto';
import Storage from "../storage/utilities";
class Utils {


    static getParamID() {
        return Storage.getInstance().getFromStorage(settings.paramID)
    }

    static getPrivateKey() {
        return Storage.getInstance().getFromStorage(settings.privateKey)
    }

    static getPublicKey() {
        return Storage.getInstance().getFromStorage(settings.publicKey)
    }

    static ValidateEmail(email) {
        var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
        if (email.match(mailformat)) {
            return true;
        }
        else {
            
            return false;
        }
    }

    static getHashedData(data) {
        if (!data || data === "") {
            return null;
        }
        return Crypto.createHash('sha256').update(data).digest('hex')
    }

    static checkForSameDomain(domain) {
        let selfDomain = Storage.getInstance().getFromStorage('email').split('@')[1]
        return selfDomain === domain
    }

    static getDomain(email) {
        if (!Utils.isValidEmail(email)) {
            return email;
        }
        email = email.trim().toLowerCase()
        let domain = email.split('@').pop().trim();
        if (!domain || domain === "") {
            return email;
        }
        return domain;
    }

    static isValidEmail(emailID) {
        if (!emailID || emailID === "") {
            return false;
        }
        emailID = emailID.trim().toLowerCase()
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(emailID)
    }
}

export default Utils;