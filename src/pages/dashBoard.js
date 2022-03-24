import React, { useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    ScrollView,
    Image
} from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import ParamConnector from '../libs/connector';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../libs/utilities';
import { convertToDoubleStruck } from '../utils/fontstyle';
import Settings from '../../settings.json';

import PurchasesLogo from '../../assets/purchases.svg'
import SalesLogo from '../../assets/sales.svg'
import AppLogo from '../../assets/apps.svg'
import SettingsLogo from '../../assets/settings.svg'
import ToolsLogo from '../../assets/tools.svg'
import LogisticsLogo from '../../assets/logistics.svg'
import AppListing from './appListing';
import ParamLogo from '../../assets/paramLogo.svg'
class DashBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            apps: [],
            index: 0,
            routes: [],
            data: []
        }
    }

    componentDidMount() {
        this.getApps().then(res => {
            this.getProfile()
        }).then(() => {
            SplashScreen.hide()
        })
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

    getApps = () => {
        return ParamConnector.getInstance().getWalletService().getApps().then(res => {
            if (res) {
                let apps = res.response.data;
                let routeArr = []
                for (let i = 0; i < apps.length; i++) {
                    if (apps[i].Name === "Logistics") {
                        continue
                    }
                    let routeObj = {}
                    routeObj.index = i
                    routeObj.key = apps[i].Name
                    routeObj.title = apps[i].Name
                    routeArr.push(routeObj)
                }
                routeArr.push({ "key": "Settings", "title": "Settings" })
                this.setState({
                    apps: res.response.data,
                    routes: routeArr
                })
            }
        })
    }


    setIndex = (index) => {
        console.log(index)
        this.setState({
            index: index
        })
    }



    renderScene = (route, jumpTo) => {

        switch (route.key) {
            case 'Settings':
                return <AppListing content={'Settings'} />

            case 'Sales':
                return <AppListing appInfo={this.state.apps} content={'Sales'} />;

            case 'Tools':
                return <AppListing appInfo={this.state.apps} content={'Tools'} />;

            case 'Apps':
                return <AppListing appInfo={this.state.apps} content={"Apps"} />

            case 'Logistics':
                return <AppListing appInfo={this.state.apps} content={"Logistics"} />

            case 'Purchases':
                return <AppListing appInfo={this.state.apps} content={"Purchases"} />

        }

    }

    renderIcon = (routes) => {
        switch (routes.key) {
            case 'Settings':
                return <SettingsLogo />;
            case 'Sales':
                return <SalesLogo />;
            case 'Tools':
                return <ToolsLogo />;
            case 'Apps':
                return <AppLogo />
            case 'Logistics':
                return <LogisticsLogo />
            case 'Purchases':
                return <PurchasesLogo />
        }
    }

    render() {
        let penID = this.state.data && this.state.data[0] && this.state.data[0]["C_PenID"] ? this.state.data[0]["C_PenID"] : <></>

        let penID1 = penID && penID.length > 0 && penID.substring(0, penID.length / 2)
        let penID2 = penID && penID.length > 0 && penID.substring(penID.length / 2)
        let name = Utils.getFromStorage(Settings.orgName)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{flexDirection: 'row', margin: 10, justifyContent: 'space-between'}}>
                    <MaterialCommunityIcons name="menu" size={30}/>
                    <ParamLogo/>
                    <MaterialCommunityIcons name="bell" size={25}/>
                </View>
                <View style={{ margin: 10, backgroundColor: "#F6F6F6", justifyContent: 'space-between', flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                    <View><Text style={styles.name}>{name}</Text></View>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{penID1 && convertToDoubleStruck(penID1)}</Text>
                        <Text style={styles.avatar}>{penID2 && convertToDoubleStruck(penID2)}</Text>
                    </View>
                </View>
                {/* <Button title='Logout' onPress={() => { Utils.clearStorage(), this.props.navigation.navigate('SignOut') }}></Button> */}
                {this.state.routes && this.state.routes.length > 0 ?
                    <BottomNavigation
                        shifting={false}
                        navigationState={this.state}
                        onIndexChange={(index) => this.setIndex(index)}
                        renderScene={({ route, jumpTo }) => this.renderScene(route, jumpTo)}
                        renderIcon={({ route }) => this.renderIcon(route)}
                        barStyle={{ backgroundColor: 'white' }}
                    />
                    : <></>}
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily: "Montserrat-Bold"
    },
    avatar: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: "#542493"
    },
    name: {
        fontFamily: "Montserrat-Regular",
        fontSize: 18
    },
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        height: 64,
        borderRadius: 64 / 2,
        backgroundColor: "#F8F5FF",
        borderColor: "#E6DBFF",
        borderWidth: 2,
    }
})

export default DashBoard;