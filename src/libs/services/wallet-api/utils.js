import Utils from "../../utilities/index";
import * as Config from "../../../../config.json";
import https from "https";
import Storage from "../../storage/utilities";

class WalletServerUtils {

    static prepareRequestParams(args, apiType) {
        let apiEndPoint = Config.serverURL;
        let body = {};
        let request = {};
        let method = "GET";
        let httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
        switch (apiType) {
            case "schema":
                apiEndPoint = apiEndPoint + `schema?schemaID=${args.sm}`;
                break;

            case "disputeSummary":
                apiEndPoint = apiEndPoint + "kg/dispute_summary";
                method = "POST";
                body['status'] = args.tabType;
                body['plants'] = args.plants ? args.plants : []
                break;

            case "reconSummary":
                apiEndPoint = apiEndPoint + "kg/summary";
                method = "POST";
                body = { category: args.category }
                break;

            case "reconReports":
                apiEndPoint = apiEndPoint + "kg/user_wise_report";
                method = "POST";
                body = { currency: args.currency, category: args.category, compareERP: args.compareERP ? args.compareERP : false };
                break;

            case "reconDetails":
                apiEndPoint = apiEndPoint + "kg/user_wise_docs";
                method = "POST";
                body = { userID: args.userID, currency: args.currency, category: args.category, compareERP: args.compareERP ? args.compareERP: false };
                break;

            case "apps":
                apiEndPoint = apiEndPoint + "apps";
                break;

            case "appsDefinition":
                apiEndPoint = apiEndPoint + `apps?sm=${args.sm}`;
                break;

            case "history":
                apiEndPoint = apiEndPoint + `stateGraph?id=${args.docID}`;
                break;

            case "listing":
                apiEndPoint = apiEndPoint + "sm";
                method = "POST";
                body = { q: Object.assign({}, args) };
                break;

            case "details":
                apiEndPoint = apiEndPoint + "sm";
                method = "POST";
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = { q: Object.assign({}, body) };
                break;

            case "disputeListing":
                apiEndPoint = apiEndPoint + "dispute";
                method = "POST";
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = body;
                break;

            case "disputeDetails":
                apiEndPoint = apiEndPoint + "kg/dispute_details"
                method = "POST";
                body = args;
                break;

            case "healthCheck":
                apiEndPoint = apiEndPoint + `kg/health_check`;
                method = "POST";
                body = { category: args.category }
                break;


            case "config":
                apiEndPoint = apiEndPoint + `config`;
                break;

            case "filter":
                apiEndPoint = apiEndPoint + `doc/filter`;
                method = "POST";
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = { q: Object.assign({}, body) };
                break;

            case "docDiff":
                apiEndPoint = apiEndPoint + `doc/diff`
                method = "POST"
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = { q: Object.assign({}, body) };
                break;

            case "getParentDoc":
                apiEndPoint = apiEndPoint + `doc/parent`
                method = "POST"
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = Object.assign({}, body)
                break;

            case "getChildDoc":
                apiEndPoint = apiEndPoint + `doc/child`
                method = "POST"
                Object.entries(args).map(([key, value]) => {
                    body[key] = value;
                });
                body = { q: Object.assign({}, body) }
                break;

            case "getUserWiseDoc":
                apiEndPoint = apiEndPoint + "kg/user_wise_docs"
                method = "POST"
                body = { userID: args.userID, currency: args.currency, category: args.category, compareERP: args.compareERP ? args.compareERP : false };
                break;

            case "getAllCurrencies":
                apiEndPoint = apiEndPoint + "kg/currencies"
                break;
        }

        request = {
            method,
            headers: {
                "Content-Type": "application/json",
                "paramID": Utils.getParamID(),
                "token": Storage.getInstance().getFromStorage('otpToken'),
                "app-key": Config.appKey
            },
            agent: httpsAgent
        };
        if (method === "POST") {
            request.body = JSON.stringify(body);
        }
        return { apiEndPoint, request };
    }

    static getCorrectData(value, key, json) {
        let type = typeof value;
        if (!value && type !== "boolean") {
            json[key] = "";
        }
        else {
            json[key] = value;
        }
        return json;
    }

}

export default WalletServerUtils;
