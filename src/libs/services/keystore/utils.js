const jwt = require("jsonwebtoken");
import keystore from "./index";
import Storage from "../../storage/utilities";

class KeystoreUtils {

  static getValidToken(token) {
    return new Promise((resolve, reject) => {
      let tokenObject = jwt.decode(token);
      if (!tokenObject) {
        return reject("Unable to get the token, please relogin.");
      }
      let expiry = tokenObject.exp;
      if (!(new Date(expiry * 1000).getTime() < new Date().getTime())) {
        return resolve(token);
      }
      return resolve(null);
    })
      .then((tokenString) => {
        if (tokenString) {
          return Promise.resolve({ token: tokenString });
        }
        let refreshToken = Storage.getInstance().getFromStorage("otpRefreshToken");
        return keystore.getInstance().refreshToken(refreshToken);
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (err) {
          if (err.status === 401 || err.status === 403) {
            return Promise.reject("TokenExpiredError");
          }
        }
        return Promise.reject(err);
      });
  }
}

export default KeystoreUtils;
