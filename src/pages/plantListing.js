import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Button, List } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Utils from '../libs/utilities';
import Settings from '../../settings.json';
import { convertToDoubleStruck } from '../utils/fontstyle';


import PlantModal from '../components/plantModal';
import LoginComponent from '../components/loginComponent';

class PlantListing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            modal: false,
            location: "",
            allPlants: []
        }


    }

    componentDidMount() {
        this.getAllGSTN()
            .then(res => {
                this.getProfile()
                this.setState({
                    allPlants: Utils.getFromStorage(Settings.allPlants)
                })
            })

    }

    getAllGSTN = () => {
        return ParamConnector.getInstance().getKeyStoreService().getAllGSTN().then(res => {
            if (!res || !res.status) {
                return Promise.reject("Error in getAllGSTN")
            }
            if (res.data && res.data.taxInfo && res.data.taxInfo.length !== 0) {
                let plants = res.data.taxInfo[0].taxInfo[0].plants
                Utils.setToStorage(Settings.allPlantDetails, plants)
                let plantsArr = []
                for (let i = 0; i < plants.length; i++) {
                    let plantObj = {}
                    plantObj.paramID = plants[i].keyStore["ethID"]
                    plantObj.ID = plants[i].plantCode
                    plantObj.taxID = plants[i].taxID
                    plantObj.plantName = plants[i].plantName
                    plantObj.location = plants[i].location
                    plantsArr.push(plantObj)
                    Utils.setToStorage(plants[i].plantCode, plants[i])
                }

                Utils.setToStorage(Settings.allPlants, plantsArr)
                Utils.setToStorage(Settings.selectedPlant, plantsArr[0])
            }
        }
        )
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

    goBack = () => {
        this.props.navigation.goBack(null)
    }

    render() {
        let data = this.state.allPlants ? this.state.allPlants : []
        let penID = this.state.data && this.state.data[0] && this.state.data[0]["C_PenID"] ? this.state.data[0]["C_PenID"] : <></>

        let penID1 = penID && penID.length > 0 && penID.substring(0, penID.length / 2)
        let penID2 = penID && penID.length > 0 && penID.substring(penID.length / 2)
        let name = Utils.getFromStorage(Settings.orgName)//this.state.data && this.state.data[0] && this.state.data[0].Profile["P_LegalName"] ? this.state.data[0].Profile["P_LegalName"] : <></>
        return (
            <SafeAreaView>
                <LoginComponent goBack={this.goBack}/>

                <SafeAreaView style={{ alignItems: 'center' }}>
                    <View style={{ ...style.avatarContainer, marginTop: 79, marginHorizontal: 127 }}>
                        <Text style={style.avatar}>{penID1 && convertToDoubleStruck(penID1)}</Text>
                        <Text style={style.avatar}>{penID2 && convertToDoubleStruck(penID2)}</Text>
                    </View>
                    <View><Text style={style.name}>{name}</Text></View>
                </SafeAreaView>

                <List.Section style={style.select}>
                    <List.Accordion
                        titleStyle={style.accordianTitle}
                        title={this.state.location ? this.state.location : "Choose a Plant"}
                        style={{ padding: 15, color: '#484848' }}
                        onPress={this.toggleModal}
                    >
                    </List.Accordion>
                </List.Section>
                <View style={{...style.divider}} />
                <View style={{ marginBottom: 40, marginHorizontal: 26 }}><Button style={{ height: 50, justifyContent: "center", backgroundColor: "#542493" }} mode="contained" onPress={() => { this.props.navigation.navigate('RequestForAccess', { plantLocation: this.state.location}) }} >Continue</Button></View>
                <View style={{...style.footerContainer}}>
                    <Text style={style.footer}>Registration means that you agree to</Text>
                    <Text style={style.footer}>⦃param⦄.network User Agreement & User Privacy</Text>
                </View>
                {/* {this.state.modal === true ? <PlantModal title ="Choose a Plant" data={this.allPlants} open={this.state.modal}/> : <></>} */}
                <PlantModal
                    title="Choose your plant"
                    data={data}
                    open={this.state.modal}
                    updateModalState={this.updateModalState}
                    selectedPlant={this.updateSelectedPlant}
                />
                
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
        marginBottom: 10,
        padding: 10
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
    accordianTitle: { 
        fontFamily: "Montserrat-Regular", 
        color: '#484848' 
    }

})
export default PlantListing;