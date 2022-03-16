import keyStoreService from './services/keystore';
import WalletService from './services/wallet-api';

class ParamConnector {

    constructor() {
        //this.gprmService = new GPRMService();
        this.walletService = new WalletService();
    }

    static getInstance () {
        if (!ParamConnector.instance) {
            ParamConnector.instance = new ParamConnector();
        }
        return ParamConnector.instance;
    }

    // getGPRMService () {
    //     return this.gprmService;
    // }

    getWalletService () {
        return this.walletService;
    }

    getKeyStoreService () {
        return keyStoreService.getInstance();
    }

}

export default ParamConnector;