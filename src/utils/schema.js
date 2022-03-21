class SchemaUtils {
    static getValidSchema (schema) {
        // let 
        let properties = schema.properties
        // let propertiesArray = [];
        for (let pIndex in properties) {
            if (!properties[pIndex].title) {
                schema.properties['title'] = pIndex;
            }
            // propertiesArray.push({ key: pIndex, index: properties[pIndex].index, });
        }
        // propertiesArray = propertiesArray.sort((a, b) => {
        //     return a["index"] - b["index"]
        // });
        // let map = new Map()
        // for (let index in propertiesArray) {
        //     let key = propertiesArray[index].key
        //     map.set(key, properties[key])
        // }
        // schema.properties = Object.fromEntries(map);
        return schema
    }
    static sortKeys (schema, key) {

    }

    static orderedSchema (schema) {
        // let indexes=schema && schema.indexes ? schema.indexes : []
        // let order=schema && schema.order ? schema.order : []
        // indexes.sort(function(a, b){  
        //     return order.indexOf(a) - order.indexOf(b);
        //   });
        // schema["indexs"]
        let Properties = schema && schema.properties ? schema.properties : {}
        Object.entries(Properties).map(([key, value]) => {
            let prop = value && value.properties ? value.properties : {}
            let order = value && value.order ? value.order : []
            let objKeys = Object.keys(prop);
            objKeys.sort((a, b) => {
                return order.indexOf(a) - order.indexOf(b);
            });

            let final_obj = {};

            for (let i in objKeys) {
                let valKey = objKeys[i]
                final_obj[valKey] = prop[valKey]
            }
            let sortedObj = final_obj
            schema["properties"][key]["properties"] = sortedObj

        })
        return schema
    }

    static getTabsOrder (schema) {
        let indexes = schema && schema.indexes ? schema.indexes : []
        let order = schema && schema.order ? schema.order : []
        indexes.sort(function (a, b) {
            return order.indexOf(a) - order.indexOf(b);
        });

        schema["indexes"] = indexes
        return schema
    }
    getSchemaKey (schema, title) {
        let properties = schema.properties
        for (let pIndex in properties) {
            if (properties[pIndex].title === title) {
                return pIndex;
            }
            if (!properties[pIndex].title && pIndex === title) {
                return pIndex;
            }
        }
        return title;
    }
}
export default SchemaUtils;