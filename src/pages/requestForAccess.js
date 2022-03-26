import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Button } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import Utils from '../libs/utilities';
import Settings from '../../settings.json'
import LoginComponent from '../components/loginComponent';
import EmailLogo from '../../assets/email.svg'
const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height

const heightPercent = parseInt((25 / 100) * SCREEN_HEIGHT)

class RequestForAccess extends Component {

    constructor(props) {
        super(props)
        this.state = {
            domain: "",
            email: "",
            gstnList: [],
            plantOptions: [],

            loading: false,
            eventID: '',
            plantErrMsg: '',
        }
        this.emailID = Storage.getInstance().getFromStorage('email')
        this.domain = this.emailID ? this.emailID.split("@").pop().trim() : ""
        this.selectedPlant = "",
            this.selectedPlantDetails = {}
    }

    componentDidMount() {

    }


    onButtonPress = () => {

        const selectedPlant = Utils.getFromStorage(Settings.selectedPlant)
        const selectedPlantDetails = Utils.getFromStorage(selectedPlant['ID'])
        
        if (!selectedPlant || !selectedPlantDetails) {
            return;
        }

        let request = [], options = {}
        let email = Utils.getFromStorage('email')
        let taxID = selectedPlantDetails['taxID'] || ""
        let plantCode = selectedPlantDetails['plantCode'] || ""
        options['ID'] = taxID
        options['emailID'] = [email]
        options['type'] = "GSTN"
        options['role'] = "user"
        options['plantCode'] = plantCode
        request.push(options)
        Utils.setToStorage('adminEmail', this.getProtectedEmail(selectedPlantDetails['emailID']))
        return ParamConnector.getInstance().getKeyStoreService().requestForAccessV1(request, selectedPlantDetails['emailID']).then((res) => {
            if (res.data.code && res.data.code === 1) {
                Utils.setToStorage("accessCode", 2)
                this.props.navigation.navigate('ReqAccessSuccess')
            }
            else {
                this.props.navigation.navigate('ReqAccessSuccess')
            }
        }).catch(err => {
            console.error("Error in sending request for access, Reason: ", err)
        })
    }

    getProtectedEmail = (email) => {
        let [username, userdomain] = email.split("@");
        if (username.length === 1)
            username = username + "***"
        return `${username[0]}${new Array(username.length).join("*")}@${userdomain}`;
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    render() {

        return (
            <SafeAreaView>
                <LoginComponent goBack={this.goBack}/>
                <SafeAreaView style={{ alignItems: 'center' }}>
                    <View style={{ ...style.avatarContainer, marginTop: 79, marginHorizontal: 127 }}>
                        <View style={style.avatar}><EmailLogo/></View>
                    </View>
                    <View ><Text style={style.name}>Request For Access</Text></View>
                    <View style={{marginTop: 40}}>
                        <Text style={{fontFamily: "Montserrat-Regular", fontSize: 16, color: "#484848"}}>{Utils.getFromStorage('email')}</Text>
                    </View>
                    <Text style={{...style.content, marginTop: 20}}>{'Your Email Id Is Not'}</Text>
                    <Text style={style.content}>{'Registered'}</Text>
                </SafeAreaView>

                <View style={{...style.divider, marginTop: 34}} />
                <View style={style.buttonContainer}>
                    <Button style={style.button} mode="contained" onPress={() => {this.onButtonPress()}} >Request For Access</Button></View>
                <View style={style.footerContainer}>
                    <Text style={style.footer}>Registration means that you agree to</Text>
                    <Text style={style.footer}>⦃param⦄.network User Agreement & User Privacy</Text>
                </View>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 122,
        height: 122,
        borderRadius: 122 / 2,
        backgroundColor: "#F8F5FF",
        borderColor: "#E6DBFF",
        borderWidth: 2,
    },
    avatar: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 28,
        color: "#542493"
    },
    name: {
        fontFamily: "Montserrat-Regular",
        fontSize: 28,
        marginTop: 20,
        color: "#0D0D0D",
        marginBottom: 10
    },
    select: {
        color: "#9F84C2",
        marginTop: 30,
        marginBottom: 60,
        borderRadius: 5,
        marginHorizontal: 34,
        borderColor: "#9F84C2",
        borderWidth: 2,
        height: 78,
        justifyContent: 'center'
    },
    divider: {
        borderBottomColor: "#C4C4C4",
        borderBottomWidth: 0.2,
        marginHorizontal: 26,
        marginBottom: 26
    },
    footer: {
        fontSize: 12,
        fontFamily: "Montserrat-Regular"
    },
    footerContainer: {
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: "5%",
        marginTop: "20%"
    },
    button: {
        height: 50,
        justifyContent: "center",
        backgroundColor: "#542493"
    },
    buttonContainer: {
        marginBottom: 40,
        marginHorizontal: 26
    },
    content: {
        fontFamily: "Montserrat-Regular",
        fontSize: 18,
        color: "#444444"
    }
}
)

export default RequestForAccess;