import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { Card, Title, Drawer } from 'react-native-paper';
import Utils from '../../libs/utilities';

import First from '../../../assets/svgIcons/100.svg'
import Second from '../../../assets/svgIcons/101.svg'
import Third from '../../../assets/svgIcons/102.svg'
import Fourth from '../../../assets/svgIcons/103.svg'
import Fifth from '../../../assets/svgIcons/104.svg'
import Sixth from '../../../assets/svgIcons/105.svg'
import Seventh from '../../../assets/svgIcons/106.svg'
import Eighth from '../../../assets/svgIcons/107.svg'
import Nineth from '../../../assets/svgIcons/108.svg'
import Tenth from '../../../assets/svgIcons/109.svg'
import Eleventh from '../../../assets/svgIcons/110.svg'
import Twelth from '../../../assets/svgIcons/111.svg'
import Thirteenth from '../../../assets/svgIcons/112.svg'
import Fourteen from '../../../assets/svgIcons/113.svg'
import Fifteen from '../../../assets/svgIcons/114.svg'
import Sixteen from '../../../assets/svgIcons/115.svg'
import Twenty from '../../../assets/svgIcons/120.svg'
import TwentyOne from '../../../assets/svgIcons/121.svg'
import TwentyTwo from '../../../assets/svgIcons/122.svg'
import TwentyThree from '../../../assets/svgIcons/123.svg'
import TwentyFour from '../../../assets/svgIcons/124.svg'

class AppListing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: this.props.content,
            appInfo: this.getAppsInfo(this.props.appInfo, this.props.content)
        }
    }

    getAppIcons = (item) => {
        switch (item) {
            case 100:
                return <First />;
            case 101:
                return <Second />
            case 102:
                return <Third />
            case 103:
                return <Fourth />
            case 104:
                return <Fifth />
            case 105:
                return <Sixth />
            case 106:
                return <Seventh />
            case 107:
                return <Eighth />
            case 108:
                return <Nineth />
            case 109:
                return <Tenth />
            case 110:
                return <Eleventh />
            case 111:
                return <Twelth />
            case 112:
                return <Thirteenth />
            case 113:
                return <Fourteen />
            case 114:
                return <Fifteen />
            case 115:
                return <Sixteen />
            case 120:
                return <Twenty />
            case 121:
                return <TwentyOne />
            case 122:
                return <TwentyTwo />
            case 123:
                return <TwentyThree />
            case 124:
                return <TwentyFour />
            case 115:
                return <Sixteen />
            default:
                return <First />
        }
    }

    shouldComponentUpdate(nextProps) {
        return true
    }

    getAppsInfo = (appsInfo, currentApp) => {
        let appsValue = []
        if (!appsInfo || appsInfo.length === 0) {
            return appsValue;
        }
        let index = this.getIndex(appsInfo, currentApp)
        appsValue = appsInfo[index] && appsInfo[index].Value ? appsInfo[index].Value : appsValue
        return appsValue;
    }

    getIndex = (appsInfo, currentApp) => {
        if (!appsInfo || !currentApp) {
            return "";
        }
        let index = 0;
        Object.entries(appsInfo).map(([key, value]) => {
            if (value && value.Name) {
                let name = value.Name
                if (name === currentApp) {
                    index = key;
                }
            }
        })
        return index;
    }

    renderCard = (item) => {
        let Icon = this.getAppIcons(item.Props.Icon)
        let cardColor = item.Props.BgColor
        let app = this.state.appInfo
        Utils.setToStorage(item.smID, item)
        let marginBottom = item === app[app.length-1] ? 40 : 0

        return (
            <TouchableOpacity style={{ marginTop: 40, marginBottom: marginBottom}} onPress={() => this.props.navigateToDocListing( {segment: this.props.content,appName: item.Name, appInfo: item, stateTo: item.StartAt})}>
                <Card elevation={0} style={{ ...styles.card, backgroundColor: cardColor }}>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Card.Content style={styles.cardContent}>
                            {Icon}
                        </Card.Content>
                        <Text style={{ textAlign: 'center', fontFamily: "Montserrat-Regular" }}>{item.Name}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }
    render() {
        let apps = this.state.appInfo ? this.state.appInfo : []
        return (
            <View >
                <View style={{ alignSelf: 'center' }}>
                    <FlatList
                        data={apps}
                        numColumns={2}
                        keyExtractor={item => item["_id"]}
                        renderItem={({ item }) => this.renderCard(item)}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        padding: 2,
        marginHorizontal: 20,
        maxWidth: 135,
        minWidth: 135,
        maxHeight: 135,
        minHeight: 135
    },
    'card:last-child': {
        marginBottom: 10,
        backgroundColor: 'blue',
        color: 'blue'
    },
    cardContent: {
        alignItems: 'center'
    }
})
export default AppListing;