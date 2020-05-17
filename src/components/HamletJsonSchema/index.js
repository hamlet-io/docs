/* 
    These components do not render any elements, they are used for processing the Hamlet JSONSchema.
*/
import axios from "axios";

const schemaUrl =
  "https://hamlet-docs-git-add-schema-documents.hamlet.now.sh/schema/latest/blueprint/component.json";

const filterObjects = ["deployment-units", "instances"];
const filterAttributerObjects = [
"DeploymentUnits",
"Instances",
"additionalProperties",
];

/* Retrieve Definitions Hook */
const getAsyncDefinitions = () => {
    let components = [];
    return axios.get(schemaUrl).then((response) => {
      Object.entries(response.data.definitions).map((definition) => {
        let [name, value] = definition;
        let requiresList = value.required || [];
        /* Filter Components */
        if (!filterObjects.includes(name)) {
          /* Filter Attributes */
          let attributes = [];
          Object.entries(value.properties).map((attr) => {
            let [key, val] = attr;
            if (!filterAttributerObjects.includes(key)) {
              attributes.push({ name: key, value: val, required: requiresList.includes(key) });
            }
            return attributes;
          });
  
          components.push({
            name: name,
            attributes: attributes,
          });
        }
        return components;
      });
      return { components: components};
    });
  };


  const getAttributeStructure = (attributes) => {
    let results = [];
    attributes.map((attribute) => {
      let result = {};
      let childAttributes = [];
  
      switch (attribute.value.type) {
        default:
        case "boolean":
        case "string":
          result = {
            name: attribute.name,
            mandatory: attribute.required,
            type: attribute.value.type,
            enum: attribute.value.enum,
            default: attribute.value.default,
            description: attribute.value.description,
            properties: attribute.value.properties,
            patternProperties: attribute.value.patternProperties,
          };
          break;
  
        case "array":
          result = {
            name: attribute.name,
            mandatory: attribute.required,
            type: attribute.value.type,
            enum: attribute.value.items.enum,
            default: attribute.value.default,
            description: attribute.value.description,
            properties: attribute.value.properties,
            patternProperties: attribute.value.patternProperties,
          };
          break;
  
        case "object":
          result = {
            name: attribute.name,
            mandatory: attribute.required,
            type: attribute.value.type,
            enum: attribute.value.enum,
            default: attribute.value.default,
            description: attribute.value.description,
            properties: attribute.value.properties,
            patternProperties: attribute.value.patternProperties,
          };
          break;
      }
  
      result.properties &&
        Object.entries(result.properties).map((child) => {
          let [name, value] = child;
          let requiredList = value.required || [];
          childAttributes.push({ key: name, name: name, value: value, required: requiredList.includes(name) });
          return childAttributes;
        });
  
      result.patternProperties &&
        Object.entries(result.patternProperties).map((pattern) => {
          let [n, val] = pattern;
          let requiredList = val.required || [];
          Object.entries(val.properties).map((child) => {
            let [name, value] = child;
            childAttributes.push({ key: name, name: name, value: value, required: requiredList.includes(name) });
            return childAttributes;
          });
        });
      results.push({ attribute: result, children: childAttributes });
    });
    return { attributes: results };
  };
  
  /* Process Component Schemas Hook */
  const getComponentSchemas = (props) => {
    let componentName = props.name;
    let componentAttributes = props.attributes;
    let componentSchemas = [];
    let topLevelAttributes = [];
    let topLevelRequires = props.requires || [];
  
    /* Top-Level Schema */
    componentAttributes.map((attribute) => {
      topLevelAttributes.push(attribute);
    });
    componentSchemas.push({
      name: componentName,
      value: topLevelAttributes,
      required: topLevelRequires
    });
  
    /* Child Schemas */
    componentAttributes.map((attribute) => {
      let schemaAttributes = [];
  
      if (!["string", "boolean"].includes(attribute.value.type)) {
        /* Standard Attributes */
        let requiredList = attribute.value.required || [];
        attribute.value.properties &&
          Object.entries(attribute.value.properties).map((child) => {
            let [name, value] = child;
            schemaAttributes.push({ name: name, value: value, required: requiredList.includes(name) });
            return schemaAttributes;
          });
  
        /* Sub Objects */
        attribute.value.patternProperties &&
          Object.entries(attribute.value.patternProperties).map((pattern) => {
            let [n, val] = pattern;
            let requiredList = val.required || [];
            Object.entries(val.properties).map((child) => {
              let [name, value] = child;
              schemaAttributes.push({ name: name, value: value, required: requiredList.includes(name) });
              return schemaAttributes;
            });
          });
  
        componentSchemas.push({
          name: attribute.name,
          value: schemaAttributes,
        });
      }
      return componentSchemas;
    });
    return { schemas: componentSchemas };
  };

  const rawjson = 
[
  {
    "label": "JSON",
    "type": "json",
    "value": JSON.stringify({
      Tiers: {
        tiername: {
          Components: {
            componentname: {},
          },
        },
      }
    }, null, 2)
  }
]

function HamletJsonSchema () {

}

export {getAsyncDefinitions, getAttributeStructure, getComponentSchemas, rawjson};
export default HamletJsonSchema;
