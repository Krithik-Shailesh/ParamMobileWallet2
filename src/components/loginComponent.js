import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Pressable,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../assets/logo.svg'

class LoginComponent extends Component {
    render() {
        return (
            <SafeAreaView>
                <View style={{ marginTop: 30, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => {this.props.navigation.goback()}}><MaterialCommunityIcons name="arrow-left" size={40} color="black" /></Pressable>
                    <View style={{ marginTop: 5, height: 20 }}><Logo></Logo></View>
                </View>
            </SafeAreaView>
        )
    }
}

export default LoginComponent