import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Link,
    StyleSheet,
    Dimensions
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput, Button, Menu, List } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height

const heightPercent = parseInt((25/100)*SCREEN_HEIGHT)

class RequestForAccess extends Component {

    constructor(props){
        super(props)
        this.state={
            domain: "",
            email: "",
            gstnList: [],
            plantOptions: [],
            selectedPlant: "",
            selectedPlantDetails: {},
            loading: false,
            eventID: '',
            plantErrMsg: '',
        }
    }

    componentDidMount(){
        let emailID = Storage.getInstance().getFromStorage('email')
        let domain = emailID ? emailID.split("@").pop().trim() : ""
        this.setState({
            domain
        })
        this.getAllGSTN()
    }
    
    getAllGSTN= () => {
        return ParamConnector.getInstance().getKeyStoreService().getAllGSTN().then(res => {
            if (!res || !res.status) {
                return Promise.reject("Error in getAllGSTN")
            }
            if (res.data && res.data.taxInfo && res.data.taxInfo.length !== 0) {
                let gstnList = res.data.taxInfo
                let plantOptions = []
                gstnList.map((value, key) => {
                    let taxInfo = value && value.taxInfo ? value.taxInfo : {}
                    taxInfo = !Array.isArray(taxInfo) ? [taxInfo] : taxInfo
                    if (taxInfo.length === 0) {
                        return;
                    }
                    taxInfo.map(taxDetails => {
                        let plants = taxDetails && taxDetails.plants ? taxDetails.plants : []
                        plants = !Array.isArray(plants) ? [plants] : plants
                        plants.map(plantDetails => {
                            if (plantDetails && plantDetails.plantName) {
                                let adminEmail = taxDetails && taxDetails.admins ? taxDetails.admins : "";
                                // let adminEmail = taxDetails && taxDetails.adminEmails && taxDetails.adminEmails.length !== 0 ? taxDetails.adminEmails[0] : ""
                                plantDetails['admin'] = this.getProtectedEmail(adminEmail)
                                plantOptions.push({
                                    label: plantDetails.plantName,
                                    value: plantDetails
                                })
                            }
                        })
                    })
                })
                this.setState({
                    plantOptions
                })
            }
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    onButtonPress = () => {
            const { selectedPlantDetails, selectedPlant } = this.state;
            if (!selectedPlant || !selectedPlantDetails) {
                return;
            }
            
            let request = [], options = {}
            let email = Storage.getInstance().getFromStorage('email')
            let taxID = selectedPlantDetails['taxID'] || ""
            let plantCode = selectedPlantDetails['plantCode'] || ""
            options['ID'] = taxID
            options['emailID'] = [email]
            options['type'] = "GSTN"
            options['role'] = "user"
            options['plantCode'] = plantCode
            request.push(options)
            Storage.getInstance().setToStorage('adminEmail', this.getProtectedEmail(selectedPlantDetails['emailID']))
            return ParamConnector.getInstance().getKeyStoreService().requestForAccessV1(request, selectedPlantDetails['emailID']).then((res) => {
                if (res.data.code && res.data.code === 1) {
                    Storage.getInstance().setToStorage("accessCode", 2)
                    this.props.navigation.navigate('ReqAccessSuccess')
                }
                else {
                    this.props.navigation.navigate('ReqAccessSuccess')
                }
            }).catch(err => {
                console.error("Error in sending request for access, Reason: ", err)
            })
    }

    getProtectedEmail = (email) => {
        let [username, userdomain] = email.split("@");
        if (username.length === 1)
            username = username + "***"
        return `${username[0]}${new Array(username.length).join("*")}@${userdomain}`;
    }

    getPlantList = (plants) => {
        let ListItemsArr = []
        for(let i =0 ;i<plants.length;i++){
            ListItemsArr.push(
                <List.Item 
                style={{color: 'black'}} 
                title = {plants[i].label} 
                onPress = {this.setState({
                    selectedPlant: plants[i].label,
                    selectedPlantDetails: plants[i].value
                })}
                />
            )
        }
        return ListItemsArr
    }
    render() {

        return (
            <SafeAreaView>
                <ScrollView>
                <View style={{marginLeft: 20,  marginTop: heightPercent, marginRight: 20}} >
                    <Text style={{color: "black", fontSize: 30}}>{this.state.domain} is already registered and may have multiple plants. Please select the plant for access request.</Text>
                </View>
                <List.Section style={{color: "#6200ee", margin: 20, borderRadius: 50}}>
                    <List.Accordion
                        title="Select a Plant...">
                        {this.getPlantList(this.state.plantOptions)}
                    </List.Accordion>
                </List.Section>
            <View style={{ margin: 20 }}><Button style={{ height: 50, justifyContent: "center" }} mode="contained" onPress={() => {this.verifyOTP() }} >Login</Button></View>
            </ScrollView>
            </SafeAreaView>
        )
    }
}



export default RequestForAccess;