import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Link,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Button } from 'react-native-paper';
import Storage from '../libs/storage/utilities';

class RequesForAccessSuccess extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <SafeAreaView>
            <Text>ReqAccessSuccess</Text>
            <Button title="Logout" onPress={() => { Storage.getInstance().clearStorage(), this.props.navigation.navigate('SignOut') }}></Button>
            </SafeAreaView>
        )
    }
}

export default RequesForAccessSuccess;