/* 
    These components do not render any elements, they are used for processing the Hamlet JSONSchema.
*/
import componentSchema from "@site/static/schema/latest/blueprint/schema-component-schema.json";
import referenceSchema from "@site/static/schema/latest/blueprint/schema-reference-schema.json";
import attributeSetSchema from "@site/static/schema/latest/blueprint/schema-attributeset-schema.json";

const patternPropertiesRegex = "^[A-Za-z_][A-Za-z0-9_]*$";

const schema = {
  reference: {
    data: referenceSchema,
  },
  component: {
    data: componentSchema,
  },
  attributeset: {
      data: attributeSetSchema,
  }
};

function getJsonSchemaData(type){
  return schema[type].data;
};

function getSchemaExample(definition){

  var example = new Object;

  if (definition.type || definition.anyOf) {
    var type = (definition.anyOf) ? definition.anyOf.map(a => a.type).join(' or ') : definition.type;
    example = new String;
    example = type;
    return example;
  }

  Object.keys(definition).map(attrName => {
    var attrValue = definition[attrName];
    example[attrName] = 
      (attrValue.patternProperties) ? getSchemaExample(attrValue.patternProperties[patternPropertiesRegex].properties)
      : (attrValue.properties) ? getSchemaExample(attrValue.properties)
      : getSchemaExample(attrValue)

    return example;
  });

  return example;
}

export {
  getJsonSchemaData,
  getSchemaExample,
  patternPropertiesRegex,
};
export default getJsonSchemaData;
