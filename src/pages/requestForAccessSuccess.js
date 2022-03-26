import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Pressable
} from 'react-native';
import Utils from '../libs/utilities';
import LoginComponent from '../components/loginComponent';
import EmailLogo from '../../assets/email.svg'

class RequesForAccessSuccess extends Component {
    constructor(props) {
        super(props)
    }

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    render() {
        return (
            <SafeAreaView>
                <LoginComponent goBack={this.goBack} />
                <SafeAreaView style={{ alignItems: 'center', marginBottom: 30 }}>
                    <View style={{ ...style.avatarContainer, marginTop: 79, marginHorizontal: 127 }}>
                        <View style={style.avatar}><EmailLogo /></View>
                    </View>
                    <View style={{ ...style.messageContainer, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={style.name}>Request For Access</Text>
                        <Text style={style.name}>Is Successful</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 16, color: "#484848" }}>{Utils.getFromStorage('email')}</Text>
                    </View>
                    <View style={{ ...style.messageContainer, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 60 }}>
                        <Text style={style.message}>Please contact your administrator</Text>
                        <Text style={style.message}>{`${Utils.getFromStorage('adminEmail')} for approval`}</Text>
                    </View>
                    <Pressable onPress={() => {Utils.clearStorage(), this.props.navigation.navigate('SignOut')}}><Text style={style.login}>Back To Login</Text></Pressable>
                </SafeAreaView>
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
    messageContainer: {
        marginTop: 20,
        marginBottom: 10
    },
    name: {
        fontFamily: "Montserrat-Regular",
        fontSize: 28,
        color: "#0D0D0D",
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
    },
    message: {
        fontFamily: "Montserrat-Regular",
        fontSize: 18,
        color: "#444444"
    },
    login: {
        fontFamily: "Montserrat-Regular",
        color: "#908E99",
        fontSize: 16
    }
})

export default RequesForAccessSuccess;