/*
    These components do not render any elements, they are used for processing the Hamlet JSONSchema.
*/
/* AttributeSet Imports */
import AttributeSetSchema from "@site/static/schema/latest/schema-AttributeSet-schema.json"
import ComponentSchema from "@site/static/schema/latest/schema-Component-schema.json"
import LayerSchema from "@site/static/schema/latest/schema-Layer-schema.json"
import ModuleSchema from "@site/static/schema/latest/schema-Module-schema.json"
import ReferenceSchema from "@site/static/schema/latest/schema-Reference-schema.json"

const patternPropertiesRegex = "^[A-Za-z_][A-Za-z0-9_-]*$";

const schema = {
  Layer: LayerSchema,
  Component: ComponentSchema,
  Reference: ReferenceSchema,
  Module: ModuleSchema,
  AttributeSet: AttributeSetSchema,
};

function getJsonSchemaData(type, instance){
  let result = (instance) ? schema[type].definitions[instance] : schema[type].data;
  return result;
};

function getSchemaExample(data){

  var example = new Object;

  if (data) {
    if (data["$ref"]) {
      data.type = "link-object";
    }

    if (data?.definitions) {
      example = getSchemaExample(Object.values(
        data.definitions)[0].properties)
    } else {
      example =
        (data.patternProperties) ? { "*" : getSchemaExample(data.properties ) }
        : (data.properties) ? getSchemaExample(data.properties)
        : (data.anyOf) ? data.anyOf.map(a => a.type).join(' or ')
        : (data.type) ? data.type
        : new Object
    }

    // process children
    if (Object.keys(example).length == 0) {
      Object.keys(data).map(attrName => {
        example[attrName] = getSchemaExample(data[attrName]);
        return example
      });

    }
    return example;
  }
}

export {
  schema,
  getJsonSchemaData,
  getSchemaExample,
  patternPropertiesRegex,
};
export default getJsonSchemaData;
