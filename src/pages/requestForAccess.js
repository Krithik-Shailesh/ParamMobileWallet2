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
import RNPickerSelect from 'react-native-picker-select';

class RequestForAccess extends Component {
    render() {
        return (
            <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'Football', value: 'football' },
                    { label: 'Baseball', value: 'baseball' },
                    { label: 'Hockey', value: 'hockey' },
                ]}
            />
        )
    }
}

export default RequestForAccess;