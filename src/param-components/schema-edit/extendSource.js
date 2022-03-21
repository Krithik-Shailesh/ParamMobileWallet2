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

class ExtendSource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formData: {},
            pageNumber: 0,
            showRequiredFeild: false,
            isValid: true,
            isValidPlantCode: true,
            selectedFields: {},
            countryCode: "",
            isvalidmail: true,
            render: 0,
            shouldStay: false,
        }
        this.invokeOnViewChange = this.invokeOnViewChange.bind(this);
        this.fields = [];
        this.isValidPattern = true;
        this.formData = {};
        this.taxInfo = null;
        this.requiredFields = [];
        this.requiredtabs = [];
        this.validateFields = [];
        this.kycStatus = this.props.kycstatus;
        this.additionalPropertiesActiveSchema = {};
        this.scrollbar = false
    }

    renderForm = (fields, required) => {
        if (fields && Object.keys(fields).length === 0) {
            let activeTab = this.getActiveTab();
            const { schema } = this.props;
            let currentTab = Utils.getState(schema, activeTab, "title")
            if (activeTab === "AdditionalProperties" || currentTab === "AdditionalProperties") {
                return (<AddCustomProperties onCustomFieldsAdded={this.onCustomFieldsAdded} fields={this.fields} />);
            } else {
                return <div className="a">No Items to Display</div>;
            }
        }
        const { data, index, editable, id, disable } = this.props
        const { isValidPlantCode } = this.state
        let content = data && data[index] ? data[index] : null
        if (!fields) {
            return <></>;
        }
        let that = this;
        return <>
            {
                Object.entries(fields).map(([key, value]) => {
                    let editable
                    if (value.index < 100) {
                        return
                    }
                    if (Array.isArray(value)) {
                        return this.getArrayInput(value, type, editable, content, key, required)
                    }
                    let isEmpty = that.requiredFields.includes(key)
                    let isValid = that.validateFields.includes(key)
                    let req = required && required.length != 0 && required.includes(key)
                    let label = value && value.title ? value.title : "";
                    if (label.length === 0) {
                        label = key;
                    }
                    let type = value && value.type ? value.type : ""
                    let format = value && value.format ? value.format : "";
                    if (key === 'C_PlantID' && type === "string")
                        format = "PLANTS"
                    let enumValue = value && value.enum ? value.enum : "";
                    let options = [], isDropDown = false;
                    format = value && value.format || format ? this.getDropDownFunction(format) : "";
                    if (enumValue && Array.isArray(enumValue) && enumValue.length !== 0) {
                        isDropDown = true;
                        for (let index in enumValue) {
                            options.push({
                                label: enumValue[index],
                                value: enumValue[index],
                                name: key,
                            });
                        }
                    }

                    if (key == "I_PriceCurrency") {
                        isDropDown = true;
                        for (let i in CurrencyList) {
                            options.push({
                                label: CurrencyList[i],
                                value: CurrencyList[i],
                                name: key
                            })
                        }
                    }

                    if (key == "C_PlantID" || key === "plantCode" || key === "plantID" || key === "C_BuyerPlantID") {
                        return (
                            <div className="col-12 pb-10">
                                <Label for={key} className="mt-15 mb-0" >
                                    {label}
                                    {req && <span className="color ml-3">{"*"}</span>}
                                </Label>
                                <Input
                                    className={classnames('form-control pr-30', { 'is-invalid': isEmpty })}
                                    type={type}
                                    id={key}
                                    aria-describedby="emailHelp"
                                    placeholder={`Enter  ${label}`}
                                    onChange={(e) => this.handleInputChange(e, "Input")}
                                    name={key}
                                    defaultValue={this.getDefaultValue(value, key)}
                                    value={this.getvalue(key)}
                                    onBlur={(e) => this.checkForValidPlantCode(key, e)}
                                    disabled={disable && disable.includes(key)}
                                />
                                {!isValidPlantCode && <div className="requiredcolor">Plant code must have a minimum of three and a maximum of ten characters</div>}
                                {/* {!isValidPlantCode && <div className="requiredcolor">Please enter a valid plant code</div>} */}
                                {/* {!isValidPlantCode && <div className="infocolor">Plant code must have a minimum of three and a maximum of ten characters</div>} */}
                            </div>
                        )
                    }


                    if (key === "C_TaxID") {
                        return (
                            <div className="col-12 pb-10">
                                <Label for={key} className="mt-15 mb-0" >
                                    {label}
                                    {req && <span className="color ml-3">{"*"}</span>}
                                </Label>
                                <Input
                                    className={classnames('form-control pr-30', { 'is-invalid': isEmpty })}
                                    type={type}
                                    id={key}
                                    aria-describedby="emailHelp"
                                    placeholder={`Enter  ${label}`}
                                    onChange={(e) => this.handleInputChange(e, "Input")}
                                    name={key}
                                    defaultValue={this.getDefaultValue(value, key)}
                                    value={this.getvalue(key)}
                                    onBlur={(e) => this.checkForValidPattern(key, e)}
                                    disabled={disable && disable.includes(key)}
                                />
                                {!this.isValidPattern && <div className="requiredcolor">Please enter a valid TAX ID</div>}
                            </div>
                        )
                    }

                    if (key == "phone" || key == "U_PhoneNumber" || key === "C_PhoneNumber" || key == "C_Telephone" || key == "P_Telephone" || key === "phoneNumber") {
                        return (
                            <div className="col-12 pb-10">
                                <Label for={key} className="mt-15 mb-0" >
                                    {label}
                                    {req && <span className="color ml-3">{"*"}</span>}
                                </Label>
                                {(!isDropDown) ? (
                                    <PhoneInput
                                        className={classnames('form-control pr-30 phonedata', { 'is-invalid': isEmpty })}
                                        id={key}
                                        type={type}
                                        name={key}
                                        styles={customStyles}
                                        aria-describedby="emailHelp"
                                        value={this.getDefaultValue(value, key)}
                                        placeholder={`Enter  ${label}`}
                                        onChange={(e) => this.handlecountrycode(e, key)}
                                        onBlur={(e) => this.getBlur(key, e)}
                                        disabled={disable && disable.includes(key)}
                                    />
                                ) : (
                                    <Select
                                        options={options}
                                        styles={customStyles}
                                        name={key}
                                        onChange={(e) => this.handleInputChange(e, "Select")}
                                        className={classnames("inputalign", { 'is-invalid': isEmpty })}
                                    // value={this.getSelectedOptions(key)}
                                    />
                                )}
                                {isEmpty ? <div className="requiredcolor">Required Feild should not be empty</div> : ""}
                            </div>
                        )
                    }
                    return <div className="col-12 pb-10">
                        <Label for={key} className="mt-15 mb-0" >
                            {label}
                            {req && <span className="color ml-3">{"*"}</span>}
                        </Label>
                        {format && value.format !== 'email' ? this.getFormat(value.format || format, key, value, label) :
                            <>
                                {!isDropDown ? (
                                    <Input
                                        className={classnames('form-control pr-30', { 'is-invalid': isEmpty })}
                                        type={type}
                                        id={key}
                                        aria-describedby="emailHelp"
                                        placeholder={`Enter  ${label}`}
                                        onChange={(e) => this.handleInputChange(e, "Input")}
                                        name={key}
                                        defaultValue={this.getDefaultValue(value, key)}
                                        value={this.getvalue(key)}
                                        onBlur={(e) => this.getBlur(key, e)}
                                        disabled={disable && disable.includes(key)}
                                    />
                                ) : (
                                    <Select
                                        options={options}
                                        size="5"
                                        name={key}
                                        styles={customStyles}
                                        onChange={(e) => this.handleInputChange(e, "Select")}
                                        className={classnames("inputalign", { 'is-invalid': isEmpty })}
                                        defaultValue={this.getOptionsValue(value, key, options)}
                                    // value={this.getSelectedOptions(key)}

                                    />
                                )}
                            </>
                        }
                        {isEmpty ? <div className="requiredcolor">Required Field should not be empty</div> : ""}
                        {isValid ? <div className="requiredcolor">Enter a valid Email</div> : ""}
                        {(this.state.isvalidmail == false && key === "emailID") && <div className="requiredcolor">Enter a valid Email</div>}
                    </div>
                })
            }
            {
                this.activeTab === "Additional Properties" &&
                <div style={{ marginLeft: "-1rem" }}>
                    <AddCustomProperties onCustomFieldsAdded={this.onCustomFieldsAdded} fields={this.fields} />
                </div>
            }
        </>
    };
}

export default ExtendSource;