import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Pressable,
    Dimensions,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import { TextInput, Button, Divider, List } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import Utils from '../libs/utilities';
import Settings from '../../settings.json';
import SplashScreen from 'react-native-splash-screen'
import { convertToDoubleStruck } from '../utils/fontstyle';
import { type } from 'os';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../assets/logo.svg'
import PlantModal from '../components/plantModal';
import * as Style from '../styles/index'

class PlantListing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            modal: false,
            location: ""
        }
        this.allPlants = Utils.getFromStorage('allPlants')

    }

    componentDidMount() {
        this.getProfile()

    }

    getProfile = () => {
        let email = Utils.getFromStorage("email")

        email = Utils.getHashedData(email)
        return ParamConnector.getInstance().getKeyStoreService().getMetaData(email).then((res) => {
            let data = res && res.data ? res.data : {}
            let object = Object.assign(data)
            let org = object.org

            let orgName = org && org["Contact"] && org["Contact"]["C_Organization"] ? org["Contact"]["C_Organization"] : ""
            Utils.setToStorage(Settings.orgName, orgName)
            let user = object.user
            org.user = {}
            org.user = user
            let tableData = []
            let keys = Object.keys(org);
            let obj = {}
            for (let i in keys) {
                let key = keys[i]
                Object.assign(obj, org[key])
                // Key level implemented -- TODO: Get clarity on this
                if (key === "user") {
                    obj["Profile"] = org[key]
                }
                obj[key] = org[key]
            }
            tableData.push(obj)
            this.setState({
                data: tableData,
            })
        }).catch((err) => {
            console.error("[Error] ", err.message)
        })
    }

    toggleModal = () => {
        console.log(Utils.getFromStorage(Settings.selectedPlant), Utils.getFromStorage(Settings.selectedPlantName))
        this.setState({
            modal: true
        })
    }

    updateModalState = (bool) => {
        this.setState({
            modal: bool
        })
    }

    updateSelectedPlant = (location) => {
        this.setState({
            location: location
        })
    }

    render() {
        let penID = this.state.data && this.state.data[0] && this.state.data[0]["C_PenID"] ? this.state.data[0]["C_PenID"] : <></>

        let penID1 = penID && penID.length > 0 && penID.substring(0, penID.length / 2)
        let penID2 = penID && penID.length > 0 && penID.substring(penID.length / 2)
        let name = this.state.data && this.state.data[0] && this.state.data[0].Profile["P_LegalName"] ? this.state.data[0].Profile["P_LegalName"] : <></>
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ marginTop: 30, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => {this.props.navigation.goback()}}><View><MaterialCommunityIcons name="arrow-left" size={40} color="black" /></View></Pressable>
                    <View style={{ marginTop: 5, height: 20 }}><Logo></Logo></View>
                </View>
                <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ ...style.avatarContainer, marginTop: 79, marginHorizontal: 127 }}>
                        <Text style={style.avatar}>{penID1 && convertToDoubleStruck(penID1)}</Text>
                        <Text style={style.avatar}>{penID2 && convertToDoubleStruck(penID2)}</Text>
                    </View>
                    <View ><Text style={style.name}>{name}</Text></View>
                </SafeAreaView>
                <List.Section style={style.select}>
                    <List.Accordion
                        titleStyle={{fontFamily: "Montserrat-Regular", color: '#484848'}}
                        title={this.state.location ? this.state.location : "Choose a Plant"}
                        style={{padding: 15, color: '#484848' }}
                        onPress={this.toggleModal}
                    >
                    </List.Accordion>
                </List.Section>
                <View style={style.divider} />
                <View style={{ marginBottom: 40, marginHorizontal: 26}}><Button style={{ height: 50, justifyContent: "center", backgroundColor:  "#542493"}} mode="contained" onPress={() => { this.props.navigation.navigate('DashBoard') }} >Login</Button></View>

                {/* {this.state.modal === true ? <PlantModal title ="Choose a Plant" data={this.allPlants} open={this.state.modal}/> : <></>} */}
                <PlantModal
                    title="Choose a Plant"
                    data={this.allPlants}
                    open={this.state.modal}
                    updateModalState={this.updateModalState}
                    selectedPlant={this.updateSelectedPlant}
                />
                <View style={{alignItems: 'center', left: 0, right: 0, bottom: "5%", marginTop: "20%"}}>
        <Text style={{fontSize: 12}}>Registration means that you agree to</Text>
        <Text style={{fontSize: 12}}>⦃param⦄.network User Agreement & User Privacy</Text></View>
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
        borderWidth: 2
    },
    avatar: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 28,
        color: "#542493"
    },
    name: {
        fontFamily: "Montserrat-Regilar",
        fontSize: 28,
        marginTop: 20,
        color: "#0D0D0D",
        marginBottom: 10
    },
    select: {
        color: "#9F84C2",
        marginTop: 40,
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
        marginBottom:26
    }
})
export default PlantListing;