import React, { useState, useEffect, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Pressable,
    Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Card, Title, Drawer, DataTable, ToggleButton, Menu } from 'react-native-paper';
import ParamConnector from '../../libs/connector';
import Utils from '../../libs/utilities';
import Schema from './schema';

class DocListing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabs: [],
            columns: [],
            tableData: [],
            indexes: [],
            activeTab: "",
            visible: false
        }
        this.app = []
    }

    componentDidMount() {
        this.getSMTabs().then(res => {
            this.getListing()
        }).then(res => {

        })
    }
    getSubstates = (stateObj, state, substates, tabArr) => {

        if (!substates) {
            return tabArr;
        }
        if (Object.keys(substates).length === 0) {
            return tabArr;
        }
        let startAt = '';
        let nextState = '';
        for (let substate in substates) {
            if (substates[substate].Start === true) {
                startAt = substate;
                //tabArr.push(`${state}:${startAt}`);
                tabArr.push(`${stateObj.Desc}${' '}:${' '}${startAt}`)
                nextState = substates[substate].NextState;
            }
            if (nextState) {
                //tabArr.push(`${state}:${nextState}`);
                tabArr.push(`${stateObj.Desc}${' '}:${' '}${nextState}`)
                nextState = substates[nextState].NextState
            }
        }
        return tabArr
    }

    getAppDefinition = () => {
        let smID = this.props.route.params.appInfo.smID
        if (smID) {
            let appInfo = {
                sm: smID
            }
            return ParamConnector.getInstance().getWalletService().getAppsDefinition(appInfo).catch(err => {
                console.error("Error in getAppDefinition, Reason: ", err)
            })
        }
        return Promise.reject('Invalid smID')
    }

    getSMTabs = () => {
        let smID = this.props.route.params.appInfo.smID
        this.app = Utils.getFromStorage(smID)

        let promise = Promise.resolve(this.app);
        if (!this.app) {
            promise = Promise.reject()
        }
        return promise.then(app => {
            let appInfo = this.app;
            let tabArr = [];
            let stateTo = this.props.route.params.stateTo
            let startAt = stateTo
            let obj = appInfo["States"];
            let len = Object.keys(appInfo["States"]).length;

            let state = '';
            let previousState = '';
            let nextState = ''
            for (let i = 0; i < len; i++) {

                if (i === 0) {
                    state = startAt;
                    previousState = state;
                    if (obj[state].NextState) {
                        tabArr.push(obj[state].Desc)
                        tabArr = this.getSubstates(obj[state], state, obj[state].SubStates, tabArr);
                        // tabArr = this.getAttachStates(obj[state].Schema, obj[state].Schema.split(":"), obj[state].AttachStates, tabArr, obj);
                        nextState = obj[state].NextState; // add next state
                    }
                    else {
                        tabArr.push(obj[state].Desc)
                    }
                }

                if (i !== 0) {
                    if (nextState) {
                        previousState = state;
                        state = nextState;
                        if (obj[state].Props) {
                            if (obj[state].Props.Flip === true) {
                                let stateSchema = obj[previousState] && obj[previousState].Schema && obj[previousState].Schema !== undefined ? obj[previousState].Schema : "";
                                let stateSm = stateSchema && stateSchema.length !== 0 ? stateSchema.split(":") : [];
                                // if (stateSm.length > 0 && stateSm[0] !== "@schema/Commerce") {
                                if (stateSm.length > 0) {
                                    tabArr.push(obj[state].Desc);
                                    tabArr = this.getSubstates(obj[state], state, obj[state].SubStates, tabArr);
                                    // tabArr = this.getAttachStates(obj[state].Schema, obj[state].Schema.split(":"), obj[state].AttachStates, tabArr, obj);
                                }
                                //}
                            }
                        } else {
                            let stateSchema = obj[state] && obj[state].Schema && obj[state].Schema !== undefined ? obj[state].Schema : "";
                            let stateSm = stateSchema && stateSchema.length !== 0 ? stateSchema.split(":") : [];
                            if (stateSm.length > 0 && stateSm[0] !== "@schema/Commerce") {
                                tabArr.push(obj[state].Desc);
                                tabArr = this.getSubstates(obj[state], state, obj[state].SubStates, tabArr);
                                // tabArr = this.getAttachStates(obj[state].Schema, obj[state].Schema.split(":"), obj[state].AttachStates, tabArr, obj);
                            }
                        }
                        if (obj[state].NextState) {
                            nextState = obj[state].NextState
                        }
                    }
                }
            }
            return tabArr;
        }).then(tabs => {
            this.setState({ tabs: tabs, activeTab: tabs[0] })
        })
    }

    loopUntilGetSchemaID = (states, stateTo) => {
        let newStateTo = stateTo;
        let schemaID = ''
        for (let state in states) {
            if (states[state].NextState) {
                if (states[state].NextState === stateTo) {
                    newStateTo = state;
                    if (states[state].Schema) {
                        let schemaID = states[state].Schema;
                        return { schemaID, newStateTo }
                    }
                }
            }
        }
        return { schemaID, newStateTo }
    }

    getSchemaID = (states, stateTo) => {
        // --- substates -- start
        //  1. if it's a substate then take active tab ---- and get the state of the substate and then take that/parent schema
        let activeTab = this.state.activeTab ? this.state.activeTab : this.state.tabs[0];
        if (activeTab.includes(':')) {
            let tab = activeTab.split(':');
            //stateTo = tab[0];
            stateTo = Utils.getState(states, tab[0].trim());
        }
        // --- substates -- end

        let schema = states[stateTo].Schema;
        if (!schema) {
            let schemaDetails = this.loopUntilGetSchemaID(states, stateTo);
            if (schemaDetails.schemaID) {
                schema = schemaDetails.schemaID
            }
        }

        let pIndex = schema.indexOf("public");
        schema = schema.slice(pIndex);
        return schema
    }

    getListing = () => {
        this.isAPIInProgress = true;
        let smID = this.props.route.params.appInfo.smID
        let app = Utils.getFromStorage(smID);
        let extended_sm = app && app.Base_sm ? true : false;
        let appObj = app.States;
        //let roles = app.Roles;
        let activeTab = this.state.activeTab ? this.state.activeTab : this.state.tabs[0];
        // substates condition -- s
        let subState = '';
        if (activeTab) {
            let subActiveTab = activeTab.split(':');
            if (subActiveTab.length === 2) {
                activeTab = subActiveTab[0].trim();
                subState = subActiveTab[1].trim();
            }
        }
        // substates condition -- e

        let stateTo = Utils.getState(appObj, activeTab);
        let key = `${this.props.route.params.segment === "Purchases" ? "Buyer" : "Seller"}.C_PlantID`
        let plantFilter = Utils.getPlant(key);
        if (this.props.route.params.segment === 'Apps') {
            if (plantFilter[`Buyer.C_PlantID`]) {
                delete plantFilter[`Buyer.C_PlantID`];
            }
            if (plantFilter['Seller.C_PlantID']) {
                delete plantFilter['Seller.C_PlantID'];
            }
        }
        //substate Filter -- s
        if (plantFilter && subState) {
            plantFilter[`SystemProperties.P_SubState`] = `${stateTo}:${subState}`;
            plantFilter[`SystemProperties.P_SmID`] = `${smID}`
        }
        else {
            plantFilter[`SystemProperties.P_SmID`] = `${smID}`
            plantFilter[`SystemProperties.P_SubState`] = ``;
        }

        if (!extended_sm) {
            delete plantFilter[`SystemProperties.P_SmID`];
        }

        let segment = this.props.route.params.segment;
        let Role = segment === "Purchases" ? 'Buyer' : 'Seller';
        let listingInfo = {
            branch: false,
            fields: [],
            isListing: true,
            filterOptions: plantFilter,
            sm: smID,
            stateTo,
        }
        let schemaID = {
            sm: this.getSchemaID(appObj, stateTo)
        }
        let indexes = [];
        return ParamConnector.getInstance().getWalletService().getSchema(schemaID).then(schema => {
            if (schema.status === true && schema.response) {
                if (schema.response && schema.response.data) {
                    indexes = Schema.getSchema(schema.response.data);
                    indexes["_id"] = '_id';
                    indexes['Roles'] = 'LocalProperties.Roles';
                    indexes['TxnID'] = 'LocalProperties.TxnID';
                    let fields = Object.values(indexes);
                    listingInfo.fields = fields;
                }
            }
            return schema
        }).then(schema => {
            return this.getAppDefinition();
        }).then(res => {
            return ParamConnector.getInstance().getWalletService().getListing(listingInfo)
        }).then(res => {
            let response = res && res.response ? res.response : []
            let tableColumns = response && response.tableColumns && response.tableColumns.length !== 0 ? response.tableColumns[0] : []
            let header = tableColumns && tableColumns.Header ? tableColumns.Header : ""
            let columns = tableColumns && tableColumns.columns ? tableColumns.columns : []
            let tableData = response && response.tableData ? response.tableData : []
            tableData.sort(function (a, b) { return b.Date - a.Date; });
            let col = this.props.route.params.segment === 'purchases' ? "Buyer Name" : "Seller Name";
            for (let i in columns) {
                if (columns[i].Header === col) {
                    columns.splice(i, 1)
                }
            }

            for (let index in tableData) {
                let val = tableData[index]
                delete val[col]
                for (let field in tableData[index]) {
                    if (field.includes('Date')) {
                        let timestamp = tableData[index][field];
                        let date = new Date(timestamp);
                        let day = date.getDate() + "";
                        let final_day = day.length > 1 ? day : "0" + day;
                        let final_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + final_day;
                        tableData[index][field] = final_date;
                    }
                }

                if (tableData[index].Amount) {
                    let amount = tableData[index].Amount;
                    let amountFormat = amount.toFixed(2);
                    tableData[index].Amount = amountFormat
                }
            }
            tableColumns = Utils.getColumnData(columns)
            tableColumns.push({ name: 'Action', selector: 'action', sortable: true, align: "left", width: '250px', })
            this.setState({
                columns: tableColumns,
                tableData: tableData,
                indexes: indexes,
            })
            //this.props.updateFilters(header, response.indexes)
        }).catch(err => {
            console.error("[ERROR] Error in getLisiting", err)
        }).finally(() => {
            this.isAPIInProgress = false
        })
    }

    getColumns = () => {
        let columns = this.state.columns
        let columnArr = []

        for (let i = 0; i < columns.length; i++) {
            columnArr.push(<Text>{columns[i].name}</Text>)
        }

        return columnArr
    }

    getTableColumns = (columns) => {
        let columnArr = []
        let borderRightWidth;
        for (let i = 0; i < columns.length; i++) {
            borderRightWidth = i === columns.length - 1 ? 1 : 0
            columnArr.push(<DataTable.Title style={{ height: 33, backgroundColor: '#F4F4F4', borderColor: '#CBCBCB', borderBottomWidth: 1, width: 100, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: borderRightWidth, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14 }}>{columns[i].name}</Text></DataTable.Title>)
        }

        return columnArr;
    }



    getTableData = (columns, tableData) => {
        let dataArr = [];
        let borderRightWidth, borderBottomWidth, textColor;
        for (let i = 0; i < tableData.length; i++) {
            let cells = []
            borderBottomWidth = i === tableData.length - 1 ? 1 : 0
            for (let j = 0; j < columns.length; j++) {
                borderRightWidth = j === columns.length - 1 ? 1 : 0
                textColor = j === 1 ? '#542493' : '#2D353D';
                cells.push(
                    <DataTable.Cell style={{ borderColor: '#CBCBCB', borderLeftWidth: 1, borderRightWidth: borderRightWidth, borderBottomWidth: borderBottomWidth, width: 150, justifyContent: 'center', alignItems: 'center' }}>{j === 1 ? <Text onPress={() => { console.log("Pressed Document") }} style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: textColor }}>{tableData[i][columns[j].selector] ? tableData[i][columns[j].selector] : '-'}</Text> : <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: textColor }}>{tableData[i][columns[j].selector] ? tableData[i][columns[j].selector] : '-'}</Text>}</DataTable.Cell>
                )
            }
            dataArr.push(<DataTable.Row style={{ borderWidth: 0, borderColor: '#FFFFFF' }}>{cells}</DataTable.Row>)
        }
        return dataArr
    }
    getDataTable = () => {

        let { columns, tableData } = this.state;

        console.log(columns)
        return (<DataTable >
            <DataTable.Header style={{ height: 33 }} >
                {this.getTableColumns(columns)}
            </DataTable.Header>
            <ScrollView>{this.getTableData(columns, tableData)}</ScrollView>
        </DataTable>)
    }

    getTabs = (tabs) => {
        let tabArr = []

        for (let i = 0; i < tabs.length; i++) {
            tabArr.push(<ToggleButton style={{ width: 150 }} icon={() => <View><Text style={{ fontFamily: "Montserrat-Regular" }}>{tabs[i]}</Text></View>} value={tabs[i]} />)

        }

        return tabArr
    }

    getMenuItems = (tabs) => {
        let menuArr = []
        for (let i = 0; i < tabs.length; i++) {
            menuArr.push(
                <Menu.Item titleStyle={{ fontFamily: "Montserrat-Regular" }} onPress={() => { this.setState({ activeTab: tabs[i], visible: false }) }} title={tabs[i]} />
            )
        }
        return menuArr
    }

    setToggleValue = (value) => {
        this.setState({
            activeTab: value
        })
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-between' }}>
                        <Pressable onPress={() => { this.props.navigation.goBack() }}><MaterialCommunityIcons name="arrow-left" size={30} color='black' /></Pressable>
                        <View><Text style={{ fontFamily: "Montserrat-Regular", fontSize: 20 }}>{this.props.route.params.appName}</Text></View>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="bell" size={25} color='black' />
                        </View>
                    </View>
                    <View style={{ marginTop: 4, borderColor: '#CBCBCB', borderWidth: 1 }}></View>
                </View>
                <View style={{ maxHeight: "82%" }}>
                    <ScrollView horizontal={true}>
                        <View>
                            {this.state.columns.length > 0 && this.state.tableData.length > 0 ? this.getDataTable() : <></>}
                        </View>
                    </ScrollView>
                </View>
                {this.state.tabs.length > 0 ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, alignContent: 'center' }}>
                        <View style={{ marginRight: 10 }}>
                            <Menu
                                contentStyle={{ marginBottom: 45 }}
                                visible={this.state.visible}
                                onDismiss={() => { this.setState({ visible: false }) }}
                                anchor={<MaterialCommunityIcons style={{ color: "#3E3A58" }} name="format-list-bulleted" size={30} onPress={() => this.setState({ visible: this.state.visible === false ? true : false })} />}
                            >
                                {this.getMenuItems(this.state.tabs)}
                            </Menu>
                        </View>
                        <ToggleButton.Row onValueChange={value => this.setToggleValue(value)} value={this.state.activeTab}>
                            {this.getTabs(this.state.tabs)}
                        </ToggleButton.Row></View> :
                    <></>}
            </View>

        )
    }
}

export default DocListing