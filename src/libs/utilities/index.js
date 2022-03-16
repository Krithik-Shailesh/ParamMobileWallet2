import settings from '../../../settings.json'
import Storage from "../storage/utilities";
class Utils{
    

    static getParamID() {
        return Storage.getInstance().getFromStorage(settings.paramID)   
    }

    static getPrivateKey() {
        return Storage.getInstance().getFromStorage(settings.privateKey)
    }

    static getPublicKey() {
        return Storage.getInstance().getFromStorage(settings.publicKey)
    }
}   

export default Utils;