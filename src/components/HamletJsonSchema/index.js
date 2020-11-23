/* 
    These components do not render any elements, they are used for processing the Hamlet JSONSchema.
*/
import axios from "axios";

const patternPropertiesRegex = "^[A-Za-z_][A-Za-z0-9_]*$";

const schema = {
  basePath: '../schema',
  reference: {
      data: `blueprint/reference-schema`,
  },
  component: {
      data: `blueprint/component-schema`,
  },
  metaparameter: {
      data: `blueprint/metaparameter-schema`,
  }
};

const filterSets = {
  "component" : [
    "DeploymentUnits",
    "Export"
  ]
}

const getHamletJsonSchemaData = (props) => {
  let path = schema[props.type].data;
  return axios.get(`${schema.basePath}/${props.version}/${path}.json`);
}

const getAsyncSchemaData = (props) => {
  let components = [];
  return getHamletJsonSchemaData({ type: props.type, version: props.version}).then((response) => {
    Object.entries(response.data.definitions).map(definition => {
      let [name, value] = definition;
      let requiresList = value.required || [];
      let attributes = [];
      Object.entries(value.patternProperties[patternPropertiesRegex].properties).map((componentAttribute) => {
        let [attrName, attrValue] = componentAttribute;
        if (!filterSets.component.includes(attrName)) {
          attributes.push({
            name: attrName,
            value: attrValue,
            required: requiresList.includes(attrName),
          });
        }
        return attributes;
      });
      components.push({
        name: name,
        attributes: attributes,
      });
      return components;
    });
    return { components: components };
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
          enum: attribute.value.enum,
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
        childAttributes.push({
          key: name,
          name: name,
          value: value,
          required: requiredList.includes(name),
        });
        return childAttributes;
      });

    result.patternProperties &&
      Object.entries(result.patternProperties).map((pattern) => {
        let [, val] = pattern;
        let requiredList = val.required || [];
        Object.entries(val.properties).map((child) => {
          let [name, value] = child;
          childAttributes.push({
            key: name,
            name: name,
            value: value,
            required: requiredList.includes(name),
          });
          return childAttributes;
        });
      });
    results.push({ attribute: result, children: childAttributes });
  });
  return { attributes: results };
};

const getComponentStructure = (props) => {
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
    required: topLevelRequires,
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
          schemaAttributes.push({
            name: name,
            value: value,
            required: requiredList.includes(name),
          });
          return schemaAttributes;
        });

      /* Sub Objects */
      attribute.value.patternProperties &&
        Object.entries(attribute.value.patternProperties).map((pattern) => {
          let [, val] = pattern;
          let requiredList = val.required || [];
          Object.entries(val.properties).map((child) => {
            let [name, value] = child;
            schemaAttributes.push({
              name: name,
              value: value,
              required: requiredList.includes(name),
            });
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

const getComponentExampleCodeblock = (schema) => {
  let example = new Object();
  example[schema.name] = new Object();
  schema.attributes.map((attribute) => {
    let attributes = getAttributesExampleCodeblock({name: attribute.name, value: attribute.value});
    Object.assign(example[schema.name], attributes);
    return example;
  });
  return JSON.stringify(example, null, 4)
};

const getAttributesExampleCodeblock = ({name, value}) => {

  const patternProperties = value?.patternProperties;
  const properties = value?.properties;
  const type = value?.type;
  const ref = value?.$ref;

  let example = new Object();

  if (patternProperties) {
    // if object has pattern properties, wrap it in an identifier
    let propertiesId = "<" + name.toLowerCase() + "-id>";
    let children = patternProperties[patternPropertiesRegex].properties;
    let exampleAttribute = new Object();
    exampleAttribute[propertiesId] = new Object();
    Object.keys(children).map((childName) => {
      let childValue = children[childName];
      let result = getAttributesExampleCodeblock({name: childName, value: childValue});
      Object.assign(exampleAttribute[propertiesId], result);
      return exampleAttribute;
    });
    example[name] = exampleAttribute;
  } else if (properties) {
    //object has direct children
    let exampleAttribute = new Object();
    Object.keys(properties).map((childName) => {
      let childValue = properties[childName];
      let result = getAttributesExampleCodeblock({name: childName, value: childValue});
      Object.assign(exampleAttribute, result); 
      return exampleAttribute;
    });
    example[name] = exampleAttribute;
  } else if (ref) {
    example[name] = ref;
  } else if (type) {
    example[name] = "<" + String(type).replace(',', '-or-') + ">";
  }
  
  return example;
};


export {
  getAsyncSchemaData,
  getAttributeStructure,
  getComponentStructure,
  getComponentExampleCodeblock,
};
export default getHamletJsonSchemaData;
