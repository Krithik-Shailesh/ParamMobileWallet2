import Config from "../../../../config.json";
import ECIES from "../../utilities/ecies";
import TxnType from "../txn";
import Storage from "../../storage/utilities";
class StateMachineWrapper {
  //Wrapper to convert JSON-LD to statemachine argument
  static parseArguments(
    from,
    txnType,
    stateTo,
    stateMachine,
    docID,
    jsonLD,
    payloadType,
    subscribers,
    roles,
    props = {},
    exchangeDetails
  ) {
    let docEntropy = "";
    if (payloadType === TxnType.PRIVATE) {
      //jsonLD = this.getEncryptedPayload(jsonLD)
      docEntropy = this.getDocEntropy(jsonLD);
    }
    let message = this.getMessage(
      from,
      txnType,
      stateTo,
      stateMachine,
      docID,
      docEntropy,
      subscribers,
      roles,
      props,
      exchangeDetails
    );
    let payload = this.getPayload(jsonLD, payloadType);
    return { message, payload };
  }

  static getMessage(
    from,
    txnType,
    stateTo,
    stateMachine,
    docID,
    docEntropy,
    subscribers,
    roles,
    props = {},
    exchangeDetails
  ) {
    let message = {
      from: from,
      fromSignedHash: from, //this.getSignedHash(),
      txnType: txnType,
      xchangeParamIDs: StateMachineWrapper.getExchangeParamID(exchangeDetails),
      subscribers: subscribers,
      docEntropy: docEntropy,
      stateTo: stateTo,
      stateMachine: stateMachine,
      docID: docID,
      roles: roles,
      props: props,
    };
    return message;
  }

  static getExchangeParamID(exchangeDetails) {
    let response = []
    if (!exchangeDetails) {
      return response;
    }
    for (let index = 0; index < exchangeDetails.length; index++) {
      response.push(exchangeDetails[index].paramID);
    }
    return response;
  }

  static getPayload(payloadJSON, payloadType) {
    let payload = {
      payload: payloadJSON,
      pType: payloadType,
    };
    return payload;
  }

  static getDocEntropy(encryptedJSON) {
    let docEntropy;
    docEntropy =
      encryptedJSON.substring(
        0,
        Config["blockchain-payload"].docEntropyLength
      ) +
      encryptedJSON.substring(
        encryptedJSON.length - Config["blockchain-payload"].docEntropyLength,
        encryptedJSON.length
      );
    return docEntropy;
  }

  static getEncryptedPayload(jsonLD) {
    // let cipherText = JSON.stringify(jsonLD);
    // let publicKey = ECIES.getPublicKey(cipherText);
    // let privateKey = this.getFromLocalStorage('privateKey')
    // let receiptKey = ECIES.getReceiptKey(privateKey, cipherText);
    // // if (extendedKnowledge) {
    // //     extendedKnowledge = ECIES.encrypt(privateKey, publicKey, extendedKnowledge);
    // // }
    let publicKey = jsonLD.customer.publicKey; //receiverPublicKey
    let privateKey = Storage.getInstance().getFromStorage("privateKey");
    return ECIES.encrypt(privateKey, publicKey, JSON.stringify(jsonLD));
  }
}

export default StateMachineWrapper;
