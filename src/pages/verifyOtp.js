import React, { Component, useState } from 'react';
import { 
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput
  } from 'react-native';

import ParamConnector from '../libs/connector';
import Config from "../../config.json";
import StorageUtilities from '../libs/storage/utilities';

import settings from '../../settings.json'
import Storage from '../libs/storage/utilities';

const aesctr = require('../libs/utilities/aes-ctr')
const crypto = require('crypto')

class verifyOtp extends Component{

    constructor(props){
      super(props)
      this.state = {
        otp: ""
      }
      this.store = Storage.getInstance();
    }

    setOtp = (otp) => {
      this.setState({
        otp: otp
      })
    }

    onButtonPress = () => {
      let Store = this.store
      console.log('prps',this.props)
      let email = this.props.route.params.email;
      email = email.toLowerCase().trim();
      let OTP = this.state.otp;
      let isTermsAndConditionVerified = true;
      console.log(email)
      return ParamConnector.getInstance().getKeyStoreService().verifyOTP(email, OTP, isTermsAndConditionVerified).then(res => {
        
        if (res.status) {
      
          let response = []
          let redirect = false
          let key = crypto
              .createHash('sha256')
              .update(OTP)
              .digest('hex')

          let decryptedData = aesctr.decrypt(res.data.encryptedPayload, key)
          
          decryptedData = JSON.parse(decryptedData)
          
          response = decryptedData.tokensInfo ? decryptedData.tokensInfo : []
          let domains = decryptedData.domains ? decryptedData.domains : []
          let appID = Config.appKey;
          let domainIndex = 0, currentApp = {}, currentDomain = {};
         // if (appID !== "") {
              for (let index in response) {
                  if (response[index].appID === appID) {
                      domainIndex = parseInt(index)
                      currentApp = response[domainIndex]
                      response.splice(domainIndex, 1)
                      break;
                  }
              }
              for (let index in domains) {
                  if (domains[index].appID === appID) {
                      domainIndex = parseInt(index)
                      currentDomain = domains[domainIndex]
                      domains.splice(domainIndex, 1)
                      break;
                  }
              }
              if (currentApp && Object.keys(currentApp).length !== 0) {
                  response = [...[currentApp], ...response]
              }
              if (currentDomain && Object.keys(domains).length !== 0) {
                  domains = [...[currentDomain], ...domains]
              }
          //}
          
          let authToken = response && response[domainIndex] && response[domainIndex].token.toString() ? response[domainIndex].token.toString() : ""
          let refreshToken = response && response[domainIndex] && response[domainIndex].refreshToken.toString() ? response[domainIndex].refreshToken.toString() : ""
          Store.setToStorage('profile', response)
          Store.setToStorage('email', email)
          Store.setToStorage('domains', domains)
          Store.setToStorage('otpToken', authToken)
          Store.setToStorage('otpRefreshToken', refreshToken)
          Store.setToStorage("appName", currentApp.name)
          Store.setToStorage('showMeta', true)
          Store.setToStorage('role', response[0].role)
      
          // if (response && response[domainIndex] && response[domainIndex].taxInfo && response[domainIndex].taxInfo.length === 0) {
          // 	this.props.history.push({
          // 		pathname: '/enn/tax/add'
          // 	})
          // }

          let plants;
          if (currentApp && currentApp.taxInfo && currentApp.taxInfo[0]) {
            // let isActive = currentApp.isActive
            // if (isActive === 0) {
            // 	this.props.history.push({
            // 		pathname: "/enn/tax/request_for_access"
            // 	})
            // 	return;
            // }
            let taxInfo = currentApp.taxInfo[0]
            Store.setToStorage("taxID", currentApp.taxInfo[0].taxID)
            plants = taxInfo && taxInfo.plants && taxInfo.plants[0] ? taxInfo.plants[0] : null
            if (plants) {
              let ethID = ""
              let privateKey = ""
              let publicKey = ""
              if (plants.keyStore && plants.keyStore.ethID) {
                ethID = plants.keyStore.ethID
              }
              if (plants.keyStore && plants.keyStore.publicKey) {
                publicKey = plants.keyStore.publicKey
              }
              if (plants.keyStore && plants.keyStore.privateKey) {
                privateKey = plants.keyStore.privateKey
              }
              Store.setToStorage(settings.paramID, ethID)
              Store.setToStorage(settings.privateKey, privateKey)
              Store.setToStorage(settings.publicKey, publicKey)

              let allPlants = []
              plants = taxInfo.plants ? taxInfo.plants : []
              for (let i in plants) {
                let name = plants[i].plantName;
                let ID = plants[i].plantCode;
                let plantLocation = plants[i].location;
                let paramID = ""
                if (plants[i] && plants[i].keyStore && plants[i].keyStore.ethID) {
                  paramID = plants[i].keyStore.ethID
                }
                let plantObj = { name, ID, paramID, location: plantLocation }
                allPlants.push(plantObj)
                Store.setToStorage(plants[i].plantCode, plantObj)
              }
              Store.setToStorage(settings.allPlants, allPlants)
              Store.setToStorage(settings.selectedPlant, allPlants[0])
            }}}
          }).catch(err => {
            console.log(err)
          }).finally(res => {
              this.props.navigation.navigate('DashBoard')
          })
      
    }

    render(){

    
    return(
        <SafeAreaView>
          <TextInput
          style={{color: "black"}}
          onChangeText={(text) => this.setOtp(text)}
          value={this.state.otp}
        />
        <Button 
        onPress={this.onButtonPress}
        title="Verify OTP"
        color="#841584"></Button>
        </SafeAreaView>
      );
    }
}

export default verifyOtp;
