/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import '../shim.js'
import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import KeystoreUtils from './libs/services/keystore/utils.js';
import Storage from './libs/storage/utilities.js';

import SignIn from './pages/signIn';
import verifyOtp from './pages/verifyOtp';
import DashBoard from './pages/dashBoard';
import RequestForAccess from './pages/requestForAccess';
import RequestForAccessSuccess from './pages/requestForAccessSuccess.js';
import Settings from './pages/settings.js';
import PlantListing from './pages/plantListing.js';

const Stack = createNativeStackNavigator();

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: ""
    }
    this.store = Storage.getInstance()
  }

  componentDidMount() {
    this.validToken()
  }

  validToken = () => {
    let token = this.store.getFromStorage('otpToken') ? this.store.getFromStorage('otpToken') : ""
    if(token != ""){
      KeystoreUtils.getValidToken(token).then(res => {
        if(res.token) {
          this.setState({
            token: res.token 
          })
       }
      })
    }
  }
  
  render(){
    return(
      <SafeAreaProvider>
      <NavigationContainer>
      <Stack.Navigator>
        { this.state.token == "" ? (        
        <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}}/>
        ):
        ( 

        <Stack.Screen name="DirectDashBoard" component={DashBoard} options={{headerShown: false}}/>
        )
        }
        <Stack.Screen name="SignOut" component={SignIn} options={{headerShown: false}}/>
        <Stack.Screen name="PlantListing" component={PlantListing} options={{headerShown: false}}/> 
        <Stack.Screen name="DashBoard" component={DashBoard} />
        <Stack.Screen name="RequestForAccess" component={RequestForAccess} options={{headerShown: false}}/>
        <Stack.Screen name="ReqAccessSuccess" component={RequestForAccessSuccess} options={{headerShown: false}}/>
        <Stack.Screen name="Settings" component={Settings}/>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    )
  }
}

export default App;