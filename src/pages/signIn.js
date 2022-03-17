import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Link
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from "../../config.json";
import { isValidEmail } from '../utils/index';

const aesctr = require('../libs/utilities/aes-ctr')
const crypto = require('crypto')


class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      otp: "",
      validEmail: "",
      requestForAccess: false,
      errorOtp: false
    }
    //this.onButtonPress = this.onButtonPress.bind(this)
    this.store = Storage.getInstance()
  }

  changeEmailInputValue = (emailInput) => {
    this.setState({
      email: emailInput,
      
    })
  }

  validEmail = (email) => {
   
    let validEmail = isValidEmail(email)
    this.setState({
      validEmail: validEmail
    })
  }

  changeOTPInputValue = (otpInput) => {
    this.setState({
      otp: otpInput
    })
  }

  sendOTP = () => {
    let Store = this.store
    let email = this.state.email
    email = email.toLowerCase().trim();

    Store.setToStorage('emailID', email)
    return ParamConnector.getInstance().getKeyStoreService().sendOTP(email)
      .then(res => {
        // this.props.navigation.navigate('VerifyOTP',{email: email})
      })

  }

  verifyOTP = () => {
    let Store = this.store
    
    let email = this.state.email;
    email = email.toLowerCase().trim();
    let OTP = this.state.otp;
    let isTermsAndConditionVerified = true;
    
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
          let isActive = currentApp.isActive
          if (isActive === 0 || currentApp.taxInfo) {
            this.setState({
              requestForAccess: true
            })
          	this.props.navigation.navigate('RequestForAccess')
          }
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
          }
        }
      }
      else{
        this.setState({
          errorOtp: true
        })
      }
    }).catch(err => {
      console.log(err)
    }).then(res => {
      this.setState({
        email: "",
        otp: ""
      })
      if(this.state.requestForAccess === false && this.state.errorOtp === false){
        this.props.navigation.navigate('DashBoard')
      }
    })

  }
  render() {
    return (
      <SafeAreaView>
        <TextInput
          mode="outlined"
          outlineColor="#6200ee"
          focused={true}
          style={{ marginTop: "70%", borderRadius: 10, marginRight: 20, marginLeft: 20 }}
          label="Enter email id"
          placeholder="AC@example.com"
          onChangeText={(text) => this.changeEmailInputValue(text)}
          onEndEditing = {(text) => this.validEmail(text.nativeEvent.text)}
          value={this.state.email}
        />
        {this.state.validEmail === false ? <Text style={{color: "red", marginLeft: 20}}>Enter a valid email!</Text> : <></>}
        <TextInput
          mode="outlined"
          outlineColor="#6200ee"
          style={{ marginTop: 5, borderRadius: 5, marginRight: 20, marginLeft: 20 }}
          label="Enter OTP"
          placeholder="ne2LMDj3"
          onChangeText={(text) => { this.changeOTPInputValue(text) }}
          value={this.state.otp}
          right={<TextInput.Icon name={() => <MaterialCommunityIcons name="send" size={30} color={"#6200ee"} />} style={{ marginRight: 20 }} onPress={() => { this.sendOTP() }} />}
        />
        {this.state.errorOtp === true ? <Text style={{color: "red", marginLeft: 20}}>Invalid OTP!</Text> : <></>}
        <Text style={{ color: "#6200ee", marginLeft: 20, marginTop: 30 }}>Didn't get a verification code?  <Text style={{ textDecorationLine: 'underline' }} onPress={() => { this.sendOTP() }}>Resend</Text></Text>
        <View style={{ marginTop: 80, margin: 20 }}><Button style={{ height: 50, justifyContent: "center" }} mode="contained" onPress={() => {this.verifyOTP() }} >Login</Button></View>
      </SafeAreaView>
    );
  }


}

export default SignIn;