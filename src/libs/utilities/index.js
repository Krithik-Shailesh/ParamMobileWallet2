import settings from '../../../settings.json'
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
}

export default Utils;