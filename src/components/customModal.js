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
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal'

class CustomModal extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.open)
    }


    setModalState = () => {
        this.props.setTCModal(false)
    }

    renderData = (data) => {
        if (typeof data === "string") {
            return data
        }
    }

    render() {
        return (
            <Modal
                style={{ margin: 0 }}
                isVisible={this.props.open}
                propagateSwipe
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
                    }}
                >
                    <View style={{ alignItems: 'center', marginTop: "4%" }}><View style={{ backgroundColor: "#9B9B9B", width: 125, height: 5, borderRadius: 2 }}></View></View>
                    <View style={{marginTop: 20,marginLeft: 20, marginBottom: 20}}><Text style={styles.title}>{this.props.title}</Text></View>
                    <ScrollView>
                        <View style={styles.container}><Text style={styles.text}>{this.renderData(this.props.data)}</Text></View>
                    </ScrollView>

                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
        textAlign: 'justify',
        lineHeight: 30,
    },
    container: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20
    },
    title: {
        fontFamily: "Montserrat-Medium",
        fontSize: 18
    }
})
export default CustomModal;