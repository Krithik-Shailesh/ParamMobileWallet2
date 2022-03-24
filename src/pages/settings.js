import React, { Component } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    ScrollView
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import Utils from '../libs/utilities';
import SchemaUtils from '../utils/schema';
import ProfileJson from '../../profile.json'
import PlantJson from '../../plants.json'

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabs: [],
            schema: {},
            isOpen: true,
            id: ["C_Identifier", "C_PenID", "C_Type", "C_InternalID"],
            disable: ["C_Email"],
            toastStatus: false,
            err: {},
            toastObject: {},
            address: {}
        }
        this.store = Storage.getInstance()
        this.taxDetails = {
            "phoneNumber": "9945111931",
            "taxID": "37AAICS6425J1Z9",
            "admins": "5c071a67e1c12f451c4f0ef569c26e5278a45065632e9a43caae31800d873ce6b947fe300b12f2b99cde0349e94a386af8b770717690381364a61f2bc49ba78f03acU2FsdGVkX1811Wy6Sjopq6p2MsuMHYc4CpLmgukMwYpfZk9rnT3bC8gF03vsFDG1j3GMmcnR3Y7b/V/V0jnNeMbAWswptGXSSh1gVPhuwpPCO9mf+2yAPUXY0z6Jy9wQg7jeOKKBtZPFIxKJZSkcLAYu9TJDjpS1OLjx2Xs0S0yXAKauZhPAp6ti/Yn+Ul/p6cULr2K1TGDaLPD2MNLPlB0jL1Ik7eh6aqRzRpLUhwxebizaGkpHRkrdqAJWF6xG2pCvL+FmW/AotBWf+3EcUQNhooDiOaoGLmNlDyyQh++qRgCJbXU2V09DBqxrekuR/DfMdgwKxs/Ll9MPM568vpBLZyzhMxDgmN+bYzMn1ObrbxJK+NY3kDTodQ2/7v+zehTWFlCBXer++jQ5VpZ0LQfQAgQgJvzrlzZrJ1tYEgckDfkflKHYTJ3yPVqQUK+zqSKOtoQMZHk6weSeS8d1wZ5zRGLdMPzGeu1jsuEa+xusBoZ/kUoDWQ/ReyymdA6dy7t1bYri62DkbB3Hfsic3wZo7DyaIHlbXEmyBAajurXSw2G68b0GwHaRQvOEb0w+jIVhTPP9DFUcx6QXy8fbBLT54R5xOCkhNN4qIuudpoz4ncA3H0ezrR4XQ0Dw6+On5BWRjSSIkVp8O7IbQQv8KEbLXHg/LMp9xQX62u8Sy5rvHE6zn2ezerQG2Dv3Rmo8GQtzA8tvn1QAsjCaveqDUeCBrV1YwL6RvpNOyKvdemNyqDWhGe74CkDyfFcwOxKgUD0kNoYzDRGa4zIkvAsGx079zAAdi6RyAGyoQqxP0JcEcSHfgQOzh643+dqZ3jWq6sKqZ2mYCNWnm3h8+3g5/RMvS34k1l0GYou2HqhwOAidKAxeiKAcUuL4zpW43JSrgLkmlA+IEyHMojKwopQ8APKzceP6Y5capVslj0yGz/8=U2FsdGVkX1/SqydDKH9KLJI7Uh93yaJXoutzahg3s94=5c071a67e1c12f451c4f0ef569c26e5278a45065632e9a43caae31800d873ce6b947fe300b12f2b99cde0349e94a386af8b770717690381364a61f2bc49ba78f",
            "companyName": "PARAMNETWORK INDIA LLP",
            "status": 0,
            "_id": "e2434ad08fadf754b90434be4f68e3ba59d047d6fdcce40273b655265c6e2876",
            "emailID": "krithik@zeb.com",
            "time": "18/02/2020",
            "address": "No.303, , Sri Sri Paradise, 3rd Main New Thippasandra, Near Hanumanth Temple, Bengaluru, Bengaluru (Bangalore) Urban, Karnataka, 560075",
            "verifyStatus": "verified",
            "type": "GSTN"
        }
        this.formData = {}
    }

    componentDidMount() {
        this.getProfileData()

        let taxDetails = this.taxDetails//this.store.getFromStorage('taxDetails')
        // if (taxDetails && taxDetails.taxDetails) {
        //     taxDetails = taxDetails.taxDetails
        // }
        let address = ""
        if (taxDetails.address) {
            address = taxDetails.address
            let addressArray = address.split(",")
            let length = addressArray.length
            if (length >= 5) {
                address = {}
                let postalCode = addressArray[length - 1]
                let state = addressArray[length - 2]
                let city = addressArray[length - 3]
                let addressLocality = addressArray[length - 4]
                let streetAddress = ""
                let index = 5, i = 0;
                while (i <= index) {
                    streetAddress += addressArray[i]
                    i++;
                    if (i != 5) {
                        streetAddress += ","
                    }
                }
                address.C_PostalCode = postalCode
                address.C_Region = state
                address.C_City = city
                address.C_AddressLocality = addressLocality
                address.C_StreetAddress = streetAddress
            }
            this.setState({ address: address })
        }

    }

    getValue = (key, formData = {}) => {
        let taxDetails = this.taxDetails;//this.store.getFromStorage('taxDetails')

        let val = "", address = this.state.address
        if (key == "C_Email" || key === "P_Email") {
            val = this.store.getFromStorage("email")
        }
        if (key == "C_TaxID" || key == "taxID") {
            val = this.store.getFromStorage("taxID")
        }
        if (key === "C_AddressLocality") {
            val = taxDetails.address ? taxDetails.address : ""
        }
        if (key === "C_Organization") {
            val = taxDetails.companyName ? taxDetails.companyName : ""
        }
        if (key === "C_Telephone" || key === "P_Telephone") {
            val = taxDetails.phoneNumber ? taxDetails.phoneNumber : ""
        }
        if (key === "C_PostalCode" || key === "C_Region" || key === "C_City" || key === "C_AddressLocality" || key === "C_StreetAddress") {
            val = address[key] ? address[key] : ""
        }
        if (key === "C_Telephone") {
            val === taxDetails.phoneNumber ? taxDetails.phoneNumber : ""
        }
        if (Object.keys(formData).includes(key)) {
            val = formData[key]
        }
        return val;
    }

    getProfileData = () => {
        // this.getMetaData()
        this.getSchema()
    }

    getPlantSchemaProperties = () => {
        let obj = PlantJson;
        return obj;
    }

    getSchema = () => {
        let res = ProfileJson
        let response = res && res.data ? res.data : {}
        let schemaDetails = SchemaUtils.orderedSchema(response)
        let order = schemaDetails && schemaDetails.order ? schemaDetails.order : []
        let schemaProperties = schemaDetails && schemaDetails.properties ? schemaDetails.properties : {}
        let tabDetails = [];
        for (let index in order) {
            if (order[index] === "Invitee" || order[index] == "groups" || order[index] == "SystemProperties" || order[index] === "AdditionalProperties") {
                delete (schemaProperties[order[index]])
                continue;
            }
            if (order[index] === "AdditionalProperties") {
                delete (schemaProperties[order[index]]["properties"])
            }
            tabDetails.push(schemaProperties[order[index]].title)
        }
        tabDetails.push("Add Plant")
        schemaProperties["Add Plant"] = this.getPlantSchemaProperties()
        this.setState({
            tabs: tabDetails,
            schema: schemaProperties,
            isOpen: true
        })
    }

    onSave = (formData) => {
        this.plantObj = {}
        let info = [], addPlantObj = {}
        if (formData && formData["Add Plant"]) {
            return this.getID(formData).then((res) => {
                info = res
                if (res['Add Plant'] && res['Add Plant'].emailID && this.validateEmailID(res['Add Plant'].emailID, "Unable to add Plant")) {
                    return Promise.reject()
                }
                addPlantObj = {};
                addPlantObj["Add Plant"] = res["Add Plant"];
                return this.addPlant(addPlantObj)
            }).then(result => {
                delete info["Add Plant"]
                return this.addProfile(info)
            }).then(res => {
                //return this.login(addPlantObj["Add Plant"])
            }).catch(err => {
                console.error('[ERROR]', err)
            })
        }
    }

    getID = (formData) => {

        formData = JSON.stringify(formData)
        let data = JSON.parse(formData)

        let email = data["Contact"]["C_Email"]
        if (!email) {
            return Promise.reject("EmailID can not be empty.")
        }
        return ParamConnector.getInstance().getKeyStoreService().getParamID(email).then((res) => {
            if (!res || !res.status || !res.metadata || !res.metadata.ethID || !res.metadata.paramID) {
                throw new Error("Unable to get paramID or penID")
            }
            let ethID = res.metadata.ethID
            let paramID = res.metadata.paramID
            let privateKey = res.metadata.privateKey
            let publicKey = res.metadata.publicKey

            // set new paramID, private key, public key -- s
            if (ethID) {
                this.store.setToStorage('paramID', ethID)
            }
            if (privateKey) {
                this.store.setToStorage("privateKey", privateKey)
            }
            if (publicKey) {
                this.store.setToStorage("publicKey", publicKey)
            }
            // set new paramID, private key, public key -- e

            data["Contact"]["C_Identifier"] = ethID
            data["Contact"]["C_PenID"] = paramID
            // }).then(() => {
            return data
        }).catch(err => {
            console.error('[ERROR]', err)
        })
    }

    validateEmailID = (emailID, title) => {
        if (emailID && !Utils.checkForSameDomain(Utils.getDomain(emailID))) {
            this.updateToast({ toastStatus: true, toastObject: { title, content: 'Cannot add emailID with different domain', color: "danger" } })
            return true;
        }
        return false;
    }

    addPlant = (data) => {
        let body = [];
        body = Object.values(data);
        return ParamConnector.getInstance().getKeyStoreService().addPlant(body).then((res) => {
            let obj = {}
            obj.ID = data["Add Plant"].plantCode
            obj.name = data["Add Plant"].plantName
            obj.location = data["Add Plant"].location
            obj.paramID = res.data[0].ethID
            let allPlants = []
            allPlants.push(obj)
            this.store.setToStorage('allPlants', allPlants)
            this.store.setToStorage('selectedPlant', obj)
            return res
        }).catch((err) => {
            return Promise.reject(err)
        })
    }

    addProfile = (formData) => {
        let email = this.store.getFromStorage("email")

        email = Utils.getHashedData(email)

        let org = {}
        org.Contact = {}
        org.Contact = formData.Contact
        org.BankDetails = formData.BankDetails

        let user = formData.Profile

        let obj = {}
        obj.org = {}
        obj.org = org
        obj.user = user
        return ParamConnector.getInstance().getKeyStoreService().updateMetaData(email, obj).then((res) => {
            this.store.setToStorage('condition', true)
            this.store.setToStorage('new_domain', "true")
        }).catch((err) => {
            return Promise.reject(err)
        })
    }

    onButtonClick = (otp) => {
        return this.verifyGSTN(otp).catch(err => {
            return err;
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    handleInputChange = (text, fieldName,data) => {
        console.log(this.formData)
        let formData = this.formData
        if(!formData){
            formData = {}
        }
        if(!formData[fieldName] && !Object.keys(formData).includes(fieldName)){
            formData[fieldName] = {}
        }
        formData[fieldName][data] = text

    }

    getTabs(data, schemaProperties){
        if(data && schemaProperties){
        
        let TabArr = []
        for (let i = 0; i < data.length; i++) {
            TabArr.push(
                <Text style={{marginLeft: 20}}>{data[i]}</Text>
            )
            let key =  data[i]
            if(key === 'Organization'){
                key = 'Contact'
            }
            if(key === 'Bank Details'){
                key = 'BankDetails'
            }
                
                let value = schemaProperties[key].properties
                let valueKeys = Object.keys(value)
                for(let k=0;k<Object.keys(value).length;k++){
                    let propKey = valueKeys[k]
                    let propVal = value[propKey].title
                    TabArr.push(
                        <TextInput
                            mode="outlined"
                            outlineColor="#6200ee"
                            focused={true}
                            style={{ marginTop: 10, borderRadius: 10, marginRight: 20, marginLeft: 20 }}
                            label={`Enter ${propVal}`}
                            placeholder=""
                            onChangeText={(text) => {this.handleInputChange(text, data[i],valueKeys[k])}}
                            //value={}
                        />
                    ) 
            }
        }
        return TabArr
        }
        else{
            return <></>
        }
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                <Text>Settings Page</Text>
                {this.state.tabs && this.state.schema ? this.getTabs(this.state.tabs, this.state.schema) : <></>}
                {/* 
                <View style={{ margin: 20 }}><Button title="Users" onPress={() => { Storage.getInstance().clearStorage(), this.props.navigation.navigate('Settings') }}></Button></View>
                <View style={{ margin: 20 }}><Button title="" onPress={() => { Storage.getInstance().clearStorage(), this.props.navigation.navigate('SignOut') }}></Button></View> */}
                <View style={{margin: 20}}><Button mode='contained' title="Submit" onPress={() => {this.onSave(this.formData)}}>Submit</Button></View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Settings;