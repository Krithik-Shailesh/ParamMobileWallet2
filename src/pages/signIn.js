import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from "../../config.json";
import { isValidEmail } from '../utils/index';
import SplashScreen from 'react-native-splash-screen'
import Logo from '../../assets/logo.svg'
import * as Style from '../styles/index'
import { ScrollView } from 'react-native-gesture-handler';

const aesctr = require('../libs/utilities/aes-ctr')
const crypto = require('crypto')

const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height

const heightPercent = parseInt((25 / 100) * SCREEN_HEIGHT)

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      otp: "",
      validEmail: "",
      requestForAccess: false,
      errorOtp: false,
      timer: 59,
      resend: false,
      directLogin: false
    }
    //this.onButtonPress = this.onButtonPress.bind(this)
    this.store = Storage.getInstance()

  }

  componentDidMount() {
    SplashScreen.hide()
  }

  changeEmailInputValue = (emailInput) => {
    this.setState({
      email: emailInput,
    })
  }

  countDown = () => {
    let time = this.state.timer

    setTimeout(() => {
      this.setState({
        timer: time - 1
      })
    }, 1000);

    return time
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
    this.countDown()
    this.setState({
      resend: true
    })

    Store.setToStorage('emailID', email)
    return ParamConnector.getInstance().getKeyStoreService().sendOTP(email)
      .then(res => {
        // this.props.navigation.navigate('VerifyOTP',{email: email})

      })

  }

  reSendOTP = () => {
    let Store = this.store
    let email = this.state.email
    email = email.toLowerCase().trim();
    this.setState({
      timer: 59
    })


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
        let selectedPlant = Store.getFromStorage("selectedPlant")
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
          if (isActive === 0) {
            this.setState({
              requestForAccess: true
            })
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
            Store.setToStorage('paramID', ethID)
            Store.setToStorage('privateKey', privateKey)
            Store.setToStorage('publicKey', publicKey)

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
              let plantCode = "" + plants[i].plantCode
              Store.setToStorage(plantCode, plantObj)
            }
            Store.setToStorage('allPlants', allPlants)
            Store.setToStorage('selectedPlant', allPlants[0])
          }
          else {
            let role = Storage.getInstance().getFromStorage('role')
            if (role !== 1) {
              if (plants && plants[0] || selectedPlant) {
                this.setState({
                  directLogin: true
                })
              }
            }
          }
        }
        if (currentApp && currentApp.taxInfo && currentApp.kycStatus && currentApp.kycStatus === 1) {
          return ParamConnector.getInstance().getKeyStoreService().getAllGSTN().then(res => {
            if (!res || !res.status) {
              return Promise.reject("Error in getAllGSTN")
            }
            if (res.data && res.data.taxInfo && res.data.taxInfo.length === 0) {
              console.log('GSTN ADD')
            }
            else if (res.data && res.data.taxInfo && res.data.taxInfo[0].taxInfo.length === 0) {
              console.log("GSTN ADD")
            }
            this.setState({
              requestForAccess: true
            })
          }
          ).catch(err => {
            console.log('[ERROR]', err)
          })
        }
        if (plants && plants[0] || selectedPlant) {
          this.setState({
            directLogin: true
          })
        }
      }
      else {
        this.setState({
          errorOtp: true
        })
      }
    }).catch(err => {
      console.log(err)
    }).then(res => {

      if (this.state.requestForAccess === true && this.state.directLogin === false && this.state.errorOtp === false) {
        this.props.navigation.navigate('PlantListing')
      }
      else {
        this.props.navigation.navigate('DashBoard')
      }
    }).finally(() => {
      this.setState({
        email: "",
        otp: ""
      })
    })

  }
  render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" >
          <SafeAreaView style={{ marginLeft: 20, marginRight: 20 }}>
            <View style={{ ...styles.logo }}><Logo></Logo></View>
            <View style={{ marginTop: "20%" }}>
              <Text style={styles.welcomeText}>Welcome to </Text>
              <Text style={styles.welcomeText}>⦃param⦄.network</Text>
            </View>
            <View style={{ marginTop: "20%" }}>
              <TextInput
                mode="outlined"
                outlineColor="#9F84C2"
                activeOutlineColor='#9F84C2'
                focused={true}
                style={{ borderRadius: 10, fontFamily: "Montserrat-Regular" }}
                fontFamily="Montserrat-Regular"
                theme={{ fonts: { regular: "" } }}
                label={<Text style={{ fontFamily: "Montserrat-Regular" }}>Enter email id</Text>}
                placeholder="AC@example.com"
                onChangeText={(text) => this.changeEmailInputValue(text)}
                onEndEditing={(text) => this.validEmail(text.nativeEvent.text)}
                value={this.state.email}
              />
              {this.state.validEmail === false ? <Text style={{ color: "red" }}>Enter a valid email!</Text> : <></>}
              <TextInput
                mode="outlined"
                outlineColor="#9F84C2"
                activeOutlineColor='#9F84C2'
                style={{ fontFamily: "Montserrat-Regular", marginTop: 20, marginBottom: 44, borderRadius: 5 }}
                fontFamily="Montserrat-Regular"
                theme={{ fonts: { regular: "" } }}
                label={<Text style={{ fontFamily: "Montserrat-Regular" }}>Enter OTP</Text>}
                placeholder="OTP"
                onChangeText={(text) => { this.changeOTPInputValue(text) }}
                value={this.state.otp}
                right={this.state.resend === false ? <TextInput.Icon name={() => <MaterialCommunityIcons name="send" size={30} color={Style.primary_color} />} style={{ marginRight: 20 }} onPress={() => { this.sendOTP() }} /> : this.state.timer !== 0 ? <TextInput.Affix text={`00:${this.countDown()}`} textStyle={{ color: Style.primary_color }} /> : <TextInput.Icon name={() => <MaterialCommunityIcons name="send" size={30} color={Style.primary_color} />} style={{ marginRight: 20 }} onPress={() => { this.reSendOTP() }} />}
              />
            </View>
            {this.state.errorOtp === true ? <Text style={{ color: "red" }}>Invalid OTP!</Text> : <></>}
            <Divider style={{ color: "#EBEBEB" }} />
            {/* <Text style={{ color: "#6200ee", marginTop: 30 }}>Didn't get a verification code?  <Text style={{ textDecorationLine: 'underline' }} onPress={() => { this.sendOTP() }}>Resend</Text></Text> */}
            <View style={{flex: 1}}>
              <View style={styles.buttonContainer}><Button style={styles.button} mode="contained" onPress={() => { this.verifyOTP() }} >Login</Button></View>
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Registration means that you agree to</Text>
                <Text style={styles.footerText}>⦃param⦄.network User Agreement & User Privacy</Text></View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>


    );
  }


}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat-Bold"
  },
  logo: {

    marginTop: "20%"
  },
  welcomeText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 32,
    color: "black"
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: 'black'
  },
  footerContainer: {
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: "2%",
    marginTop: "20%"
  },
  buttonContainer: {
    marginTop: 26,
    marginBottom: "10%"
  },
  button: {
    height: 50,
    justifyContent: "center",
    backgroundColor: Style.primary_color
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

export default SignIn;