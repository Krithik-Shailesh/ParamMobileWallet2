import WalletServerConnector from './connector';
import WalletServerUtils from './utils';
import Config from '../../../../config.json';
import Utils from '../../utilities';
import Storage from '../../storage/utilities';


class APIService {

    constructor() {
        this.store = Storage.getInstance()
    }

    getListing (listingInfo) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            listingInfo,
            "listing"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getSchema (sm) {
        let apiEndPoint = Config.serverURL;
        apiEndPoint = apiEndPoint + `schema?schemaID=${sm.sm}`
        const request = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "token": this.store.getFromStorage("otpToken"),
                "paramID": Utils.getParamID(),
            },
        };
        return WalletServerConnector.makeAPICall(apiEndPoint, request).then(res => {
            // let response = res && res.response && res.response.data ? res.response.data : {response:{data:{}}}
            // res.response.data = SchemaUtils.getValidSchema(res.response.data)
            return res
        })
    }

    getReports (reportsInfo) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            reportsInfo,
            reportsInfo.type
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getDetails (detailsInfo) {
        let apiEndPoint = Config.serverURL;
        apiEndPoint = apiEndPoint + `sm`
        const request = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": this.store.getFromStorage("otpToken"),
                "paramID": Utils.getParamID(),
            },
            body: JSON.stringify({ q: { ...detailsInfo } })
        };
        return WalletServerConnector.makeAPICall(apiEndPoint, request).then(
            (response) => {
                return response;
            }
        );
    }

    getDisputes (disputeInfo) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            disputeInfo,
            disputeInfo.operation
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getDisputeDetails (disputeInfo) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            disputeInfo,
            "disputeDetails"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getHistory (historyInfo) {
        let res_obj = WalletServerUtils.prepareRequestParams(
            historyInfo,
            "history"
        );
        return WalletServerConnector.makeAPICall(res_obj.apiEndPoint, res_obj.request)
    }

    getApps () {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            {},
            "apps"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getAppsDefinition (appInfo) {
        let res_obj = WalletServerUtils.prepareRequestParams(
            appInfo,
            "appsDefinition"
        );
        return WalletServerConnector.makeAPICall(res_obj.apiEndPoint, res_obj.request).then(res => {
            let response = res && res.response && res.response.data ? res.response.data : {}
            return response;
        })
    }

    getConfig (appInfo) {
        let res_obj = WalletServerUtils.prepareRequestParams(
            appInfo,
            "config"
        );
        return WalletServerConnector.makeAPICall(res_obj.apiEndPoint, res_obj.requests)
    }

    getFilter (listingInfo) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            listingInfo,
            "filter"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getDocDiff (payload) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            payload,
            "docDiff"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getParentDoc (payload) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            payload,
            "getParentDoc"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getChildDoc (payload) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            payload,
            "getChildDoc"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request).then(res => {
            return res;
        })
    }

    getUserWiseDoc (payload) {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            payload,
            "getUserWiseDoc"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

    getAllCurrencies () {
        let { apiEndPoint, request } = WalletServerUtils.prepareRequestParams(
            {},
            "getAllCurrencies"
        );
        return WalletServerConnector.makeAPICall(apiEndPoint, request)
    }

}

export default APIService;
