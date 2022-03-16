import Config from "../../../../config.json";
import Storage from "../../storage/utilities";
import KeystoreUtils from "./utils";

class KeyStore {
  constructor() {
    this.store = Storage.getInstance();
  }

  static getInstance() {
    if (!KeyStore.instance) {
      KeyStore.instance = new KeyStore();
    }
    return KeyStore.instance;
  }

  sendOTP(email) {
    let options = {};
    let api = Config.oAuth.sendOTP;
    Object.assign(options, { email: email });
    return this.makeAPICall(api, "POST", options)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(
          "[ERROR] cannot fullfil API call, reason: ",
          error.message || error.status
        );
        // return error;
        return Promise.reject(error);
      });
  }

  verifyOTP(email, OTP, termsAndConditionAccepted) {
    let options = {};
    let api = Config.oAuth.verifyOTP;
    Object.assign(options, {
      email: email,
      otp: OTP,
      isTermsAndConditionVerified: termsAndConditionAccepted,
    });
    return this.makeAPICall(api, "POST", options)
      .then((response) => {
        console.log("otp response", response);
        return response;
      })
      .catch((error) => {
        console.error(
          "[ERROR] cannot fullfil API call, reason: ",
          error.message || error.status
        );
        //return error;
        return Promise.reject(error);
      });
  }

  refreshToken(refreshToken) {
    let options = {};
    let api = Config.oAuth.refreshToken;
    Object.assign(options, { refreshToken: refreshToken });
    return this.makeAPICall(api, "POST", options).then((response) => {
        if (response && response.data && response.data.token && response.data.refreshToken) {
            this.store.setToStorage("otpRefreshToken", response.data.refreshToken);
            this.store.setToStorage("otpToken", response.data.token);
            console.log("refreshToken", this.store.getFromStorage('otpRefreshToken'))
            console.log("token", this.store.getFromStorage('otpToken'))
            return response.status;
        }
        return Promise.reject("Unable to get token and refreshtoken!")
    }).catch((err) => {
        if (err.status === 401 || err.status === 403) {
            return Promise.reject(err);
        }
    });
  }

  makeAPICall(api, method, options, count = 0) {
    
    let endpoint = Config.keyStoreBaseURL.url + api;
    let request = {
      method: method,
      mode: "cors",
      headers: {
        "Content-type": "application/json",
        "app-key": Config.appKey,
      },
      body: JSON.stringify(options),
    }
    if(api === 'd/v1/send_otp' || api === 'd/v1/verify_otp'){
       return fetch(endpoint, request)
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          return Promise.reject({ status: response.status });
        }
        if (response.status !== 200) {
          return response.text().then((errorResponse) => {
            throw new Error(JSON.parse(errorResponse).message);
          });
        }
        return response.json();
      })
      .catch((err) => {
        console.error("Error in keystore service, Reason: ", err);
        // if (count < Config.retryCount) {
        //   return this.makeAPICall(api, method, options, (count += 1));
        // }
        //return err;
        return Promise.reject(err);
      });
    }
    else{
      
      let token = this.store.getFromStorage("otpToken");
      request.headers.authorization = token;
      
      return KeystoreUtils.getValidToken(token).then((res) => {
        request["headers"]["token"] = this.store.getFromStorage('otpToken');
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
}

export default KeyStore;