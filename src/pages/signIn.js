import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from 'react-native';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';

class signIn extends Component{

constructor(props){
    super(props);
    this.state = {
      text: ""
    }
    this.onButtonPress = this.onButtonPress.bind(this)
    this.store = Storage.getInstance()
  }

  changeTextInputValue(textVal) {
    this.setState({
      text: textVal
    })
  }

  onButtonPress() {
    let Store = this.store
    let email = this.state.text
    email = email.toLowerCase().trim();

    Store.setToStorage('emailID', email)
    return ParamConnector.getInstance().getKeyStoreService().sendOTP(email)
    .then(res => {
      this.props.navigation.navigate('VerifyOTP',{email: email})
    })
    
  }
  render() {
    return(
      <SafeAreaView>
        <TextInput
        style={{color: "black"}}
        onChangeText={(text) => this.changeTextInputValue(text)}
        value={this.state.text}
      />
      <Button 
      onPress={this.onButtonPress}
      title="Send OTP"
      color="#841584"></Button>
      </SafeAreaView>
    );
  }

  
}

export default signIn;