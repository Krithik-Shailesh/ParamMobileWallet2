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

    static getFromStorage(key) {
        return Storage.getInstance().getFromStorage(key)
    }

    static setToStorage(key, value){
        Storage.getInstance().setToStorage(key, value)
    }

    static getHashedData(data) {
        if (!data || data === "") {
            return null;
        }
        return Crypto.createHash('sha256').update(data).digest('hex')
    }

    static getPlant(key) {
        let plantFilter = {}
        let plantID = Utils.getFromStorage(settings.selectedPlant) && Utils.getFromStorage(settings.selectedPlant).ID ? Utils.getFromStorage(settings.selectedPlant).ID : ""
        plantFilter[key] = [plantID, null, ""]
        return plantFilter;
    }

    static getState(state, activeTab, key = "Desc") {
        // : substates situation -- start 
        let isSubstate = false;
        let subActiveTab = activeTab.split(':');
        if (subActiveTab.length === 2) {
            isSubstate = true;
        }
        if (isSubstate === true) {
            for (let i in state) {
                let tab = state[i];
                if (tab[key] === subActiveTab[0]) {
                    let substates = tab['SubStates'];
                    for (let substate in substates) {
                        if (substate === subActiveTab[1]) {
                            return substate
                        }
                    }
                }
            }
        }
        // substates situation -- end

        if (isSubstate === false) {
            for (let i in state) {
                let tab = state[i];
                if (tab[key] === activeTab) {
                    return i;
                }
            }
        }
    }

    static getColumnData = (columns) => {
        let tableColumns = [];
        for (let index in columns) {
            if (columns[index].Header === '_id' || columns[index].Header === 'ReferencesOrder.R_Identifier' || columns[index].index < 100) {
                continue;
            }

            let columnObj = {
                name: columns[index].Header ? columns[index].Header : "",
                selector: columns[index].Header ? columns[index].Header : "",
                sortable: true,
                align: columns[index].dataType !== "string" ? "right" : "left",
            }
            tableColumns.push(columnObj)
        }

        return tableColumns;
    }

    static serializeURLParameters(obj) {
        return Object.keys(obj)
            .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
            .join('&')
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

    static getTermsAndCondition() {
        return "Welcome to ⦃param⦄! The website, viz, http://param.network together with the ⦃param⦄ mobile App (collectively the “Platform”) is developed, owned, operated and maintained by ParamNetwork India LLP, a limited liability partnership incorporated under the provisions of the Limited Liability Partnership Act, 2008 and having its registered office at 303, Sri Sri Paradise, New Thippasandra, Bangalore 560075 (“⦃param⦄”, “we” “us” or “our”)These terms and conditions (“Terms”) are applicable to the use of the Platform and of the content appearing on the Platform by all users of the Platform, including users who are just browsing as well as registered External Users (as defined below) who avail Limited Services (as defined below) provided by ⦃param⦄ (“you” or “your”). BY ACCESSING THE PLATFORM, YOU ARE AGREEING TO BE BOUND BY THESE TERMS, ALL APPLICABLE LAWS AND REGULATIONS, OUR PRIVACY POLICY AND AGREE THAT YOU ARE RESPONSIBLE FOR COMPLIANCE WITH ALL APPLICABLE LAWS. THESE TERMS CONSTITUTE A LEGAL AGREEMENT BETWEEN YOU AND ⦃PARAM⦄. IF YOU DO NOT AGREE TO THESE TERMS, PLEASE DO NOT USE THE PLATFORM AND/OR THE SERVICES. If you are accepting these Terms and using the Platform on behalf of a company, organization, government, or other legal entity, you represent that you are authorized to do so and have the authority to bind such entity to these Terms, in which case the words “you” or “your” as used in these Terms shall refer to such entity. All information, graphics, documents, text, products and all other elements of the Platform and all services offered on this Platform and services operated through the Platform, available for your use are also subject to the Terms set forth in this document."
    }
    static clearStorage() {
        Storage.getInstance().clearStorage()
    }
}

export default Utils;