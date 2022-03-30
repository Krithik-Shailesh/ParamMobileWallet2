class Schema {
    static getSchema(schema) {
      let indexes = {};
      let sc = schema.properties[schema.name];
      let keys=Object.keys(schema.properties);
      let systemPropertiesExists = keys ? keys.includes('SystemProperties') : false;
      let isNested = true;
      if (sc === undefined || systemPropertiesExists) {
        isNested = false;
      }
      let convertedSchema = {};
      if (isNested === true) {
        convertedSchema = schema.properties[schema.name];
      } else {
        convertedSchema = schema;
      }
    
      let properties = convertedSchema.properties;
      for (let property in properties) {
        if (properties[property].type === "object") {
          let nestedProperties1 = properties[property].properties;
          for (let nestedP1 in nestedProperties1) {
            if(nestedP1==='R_Identifier'){
              indexes["R_Identifier"] = 'ReferencesOrder.R_Identifier';
            }
            if (nestedProperties1[nestedP1].index) {
              if (nestedProperties1[nestedP1].index > 99) {
                indexes[
                  nestedProperties1[nestedP1].title
                ] = `${property}.${nestedP1}`;
              }
            }
          }
        } else if (properties[property].type === "array") {
          let nestProperties2 = properties[property].items[0].properties;
          for (let nestedP2 in nestProperties2) {
            if (nestProperties2[nestedP2].index) {
              if (nestProperties2[nestedP2].index > 99) {
                indexes[
                  nestProperties2[nestedP2].title
                ] = `${property}.${nestedP2}`;
              }
            }
          }
        } else {
          if (properties[property].index) {
            if (properties[property].index > 99) {
              indexes[properties[property].title] = `${property}`;
            }
          }
        }
      }
      return indexes;
    }
  }
  
  export default Schema;