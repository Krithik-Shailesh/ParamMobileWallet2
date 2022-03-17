import React, { useState, useEffect, Component } from 'react';
import { 
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    ScrollView
  } from 'react-native';
import ParamConnector from '../libs/connector';
import Storage from '../libs/storage/utilities';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
//import DataTable , {COL_TYPES} from 'react-native-datatable-component';
//import DataTable from "react-data-table-component";
import Data from '../../data.json'
class DashBoard extends Component{

    componentDidMount() {
        this.getApps(); 
    }
    
    getApps = () =>  {
        return ParamConnector.getInstance().getWalletService().getApps().then(res => {
            console.log(res)
        })
    }

    render(){
        return(
            <SafeAreaView>
                <ScrollView horizontal={true}>
                {/* <DataTable 
                data = {Data.tableData}
                colNames= {Data.tableColumns[0].columns}
                /> */}
          
                <Button title="Logout" onPress={() => { Storage.getInstance().clearStorage(), this.props.navigation.navigate('SignIn') }}></Button>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default DashBoard;