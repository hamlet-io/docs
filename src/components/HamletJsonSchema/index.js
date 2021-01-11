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

export {
  getJsonSchemaData,
  patternPropertiesRegex,
};
export default getJsonSchemaData;
