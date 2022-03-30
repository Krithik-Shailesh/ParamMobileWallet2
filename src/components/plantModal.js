import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Pressable,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Modal from 'react-native-modal'
import Item from './item';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height
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
                style={{ margin: 0 }}
                isVisible={this.props.open}
                coverScreen={true}
                swipeDirection="down"
                onSwipeComplete={() => { this.setModalState() }}
                onBackdropPress={() => { this.setModalState() }}
            >
                <View
                    style={{
                        height: '50%',
                        marginTop: 'auto',
                        backgroundColor: 'white'
                    }}>
                     <View style={{alignItems: 'center', marginTop: "4%"}}><View style={{backgroundColor: "#9B9B9B", width: 125, height: 5, borderRadius: 2}}></View></View>   
                    <View style={{ marginLeft: 17, marginTop: 26 }}>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        
                            <View><Text style={styles.title}>{this.props.title}</Text></View>
                        </View>
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
        color: "#0D0D0D",
        fontSize: 18
    }

});

export default PlantModal;