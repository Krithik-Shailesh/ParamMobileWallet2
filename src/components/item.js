import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Pressable,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import Utils from '../libs/utilities';
import Settings from '../../settings.json'

class Item extends Component {

    constructor(props) {
        super(props)
        
    }

    onSelectPress = () => {
        this.props.modal()
        this.props.selectedPlant(this.props.title)
        if(this.props.type === "Choose a Plant"){
            Utils.setToStorage(Settings.selectedPlant, this.props.itemDetails)
            Utils.setToStorage(Settings.selectedPlantLocation, this.props.title)
        }
    }

    render() {
        return(
            <View style={styles.container}>
            <View>
            <TouchableOpacity onPress={() => this.onSelectPress()}><Text style={styles.title}>{this.props.title}</Text></TouchableOpacity>
            <View style={styles.divider} />
            </View>
            </View>
        )   
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        
      },
      title: {
        fontSize: 16,
        marginBottom: 15,
        
      },
      container: {
        marginTop: 15
      },
      divider: {
        borderBottomColor: "#C4C4C4",
        borderBottomWidth: 0.2,
        marginRight: 28
      }
})
export default Item;