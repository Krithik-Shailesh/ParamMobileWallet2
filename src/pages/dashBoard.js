import React, { useState, useEffect, Component } from 'react';
import { 
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    ScrollView
  } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';

class DashBoard extends Component{

    constructor(props) {
        super(props)
        this.state = {
            apps: []
        }
    }

    componentDidMount() {
        this.getApps().then(res => {
            SplashScreen.hide()
        })
    }
    
    getApps = () =>  {
        return ParamConnector.getInstance().getWalletService().getApps().then(res => {
            if(res){
                this.setState({
                    apps: res.response.data
                })
            }
        })
    }

    getAppsData = (data) => {
        let appArr = []
        for(let i=0;i<data.length;i++){
            appArr.push(
               <View style={{color: "black", margin: 20}}><Text style={{color:"black"}}>{data[i].Name+"\n"}</Text></View>
            )
        }
        return appArr
    }

    render(){
        return(
            <SafeAreaView>
                 <Text style={styles.text}>Welcome</Text>
                <ScrollView>
                {this.state.apps ? this.getAppsData(this.state.apps) : <></>}
                <View style={{margin: 20}}><Button title="Settings" onPress={() => { this.props.navigation.navigate('Settings') }}></Button></View>
                <View style={{margin: 20}}><Button title="Logout" onPress={() => { Storage.getInstance().clearStorage(), this.props.navigation.navigate('SignOut') }}></Button></View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    text: {
      fontFamily: "Montserrat-Bold"
    }
})

export default DashBoard;