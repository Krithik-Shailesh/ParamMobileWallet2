import MMKV from "./index";

class Storage{

    static getInstance() {
    
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
        
    }

    setToStorage(key,value) {
        value = JSON.stringify(value)
        MMKV.setString(key, value)
    }

    getFromStorage(key) {
        let value = MMKV.getString(key)
        if(value){
            let parseValue = JSON.parse(value)
            return parseValue
        }
        return
    }

    clearStorage(){
        MMKV.clearStore()
    }

}

export default Storage;