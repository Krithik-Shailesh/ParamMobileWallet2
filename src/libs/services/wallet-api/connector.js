import KeystoreUtils from "../keystore/utils";
import Config from "../../../../config.json";
import EventManager from "../../../event-manager";
import Storage from "../../storage/utilities";


class WalletServerConnector {
      
  static makeAPICall(api, request, count = 0) {
    
    let token = Storage.getInstance().getFromStorage("otpToken");
    return KeystoreUtils.getValidToken(token).then((res) => {
      request["headers"]["token"] = Storage.getInstance().getFromStorage('otpToken');
      return fetch(api, request);
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response;
    }).catch((err) => {
      console.error("[ERROR] Error in wallet server api, Reason: ", err);
      if (err === "TokenExpiredError") {
        return EventManager.getInstance().emitEvent("sessionExpired", 'expired');
      }
      if (err && err.message && err.message === "Failed to fetch") {
        if (count < Config.retryCount) {
          return this.makeAPICall(api, request, count += 1)
        }
      }
    });
  }
}

export default WalletServerConnector;
