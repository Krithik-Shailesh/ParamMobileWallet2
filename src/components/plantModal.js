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
import Item from './item';

class PlantModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            
        }
       
    }

    setLocation = (location) => {
        this.props.selectedPlant(location)
    }

    setModalState = () => {
        
        this.props.updateModalState(false)
    }


    renderItem = (item) => (
        <Item
            type={this.props.title}
            modal={this.setModalState}
            title={item.location}
            itemDetails={item}
            selectedPlant={this.setLocation}
        />
    );

    render() {
        const Data = this.props.data

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.open}
                onRequestClose={() => {
                    // this.closeButtonFunction()
                }}>
                <View
                    style={{
                        height: '50%',
                        marginTop: 'auto',
                        backgroundColor: 'white'
                    }}>
                    <View style={{ marginLeft: 17, marginTop: 26 }}>
                        <View><Text style={styles.title}>{this.props.title}</Text></View>
                        <FlatList
                            data={Data}
                            keyExtractor={item => item.ID}
                            renderItem={({ item }) => this.renderItem(item)} />
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    title: {
        fontFamily: "Montserrat-Bold",
        color: "#0D0D0D"
    }

});

export default PlantModal;