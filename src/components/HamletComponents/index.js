import React, { useState, useEffect } from "react";
import Admonition from "react-admonitions";

import axios from "axios";

import "./styles.css";
import HamletExample from "@site/src/components/HamletExample";

const schemaUrl =
  "https://hamlet-docs-git-add-schema-documents.hamlet.now.sh/schema/latest/blueprint/component.json";
const filterObjects = ["deployment-units", "instances"];
const filterAttributerObjects = [
  "DeploymentUnits",
  "Instances",
  "additionalProperties",
];

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

function HamletAttribute(props) {
  return (
    <tr className="ref-row-data">
      <td>{props.name}</td>
      <td>{props.mandatory && "Yes"}</td>
      {props.type === "object" ? (
        <td>
          <a href={"#" + props.name}>{props.name} Object</a>
        </td>
      ) : (
        <td className="capitalize">{Array(props.type).toLocaleString()}</td>
      )}
      <td>
        {props.enum && (
          <p>
            {String(props.enum)
              .split(",")
              .map((str) => '"' + str + '", ')}
          </p>
        )}
      </td>
      <td>
        {props.default &&
          String(props.default)
            .split(",")
            .map((str) => '"' + str + '"')}
      </td>
      <td>{props.description && props.description}</td>
    </tr>
  );
}

function HamletSchema(props) {
  const [schema, setSchema] = useState({ attributes: [] });

  useEffect(() => {
    setSchema(getAttributeStructure(props.attributes));
  }, []);

  return (
    <React.Fragment>
      <table className="reference">
        <colgroup className="ref-col-group">
          <col className="ref-col--attr" />
          <col className="ref-col--mand" />
          <col className="ref-col--type" />
          <col className="ref-col--vals" />
          <col className="ref-col--def" />
          <col className="ref-col--desc" />
        </colgroup>
        <thead className="ref-title">
          <div className="schema-title">
            <a id={props.name}>{props.name + " Schema"}</a>
          </div>
        </thead>
        <thead className="reference-thead">
          <tr className="ref-row-headers">
            <th>Attributes</th>
            <th>Mandatory</th>
            <th>Type</th>
            <th>Valid Values</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody className="reference-tbody">
          {schema.attributes.map((parent) => {
            return (
              <HamletAttribute
                name={parent.attribute.name}
                type={parent.attribute.type}
                mandatory={parent.attribute.mandatory}
                enum={parent.attribute.enum}
                default={parent.attribute.default}
                description={parent.attribute.description}
              />
            );
          })}
        </tbody>
      </table>
      {schema.attributes.map((parent) => {
        parent.children.map((child) => {
          return <HamletSchema name={child.name} attributes={child.value} />;
        });
      })}
    </React.Fragment>
  );
}

function HamletComponent(props) {
  const [componentSchemas, setComponentSchemas] = useState({
    schemas: [],
  });

  const schemas = getComponentSchemas(props);
  useEffect(() => {
    setComponentSchemas(schemas);
  }, []);

  return (
    <div className="item shadow--tl component">
      <div className="container">
        <div className="row">
          <div className="col col--4 ref-component-header avatar">
            {props.name + " Component"}
          </div>
          <div className="col col--8">
            <HamletExample />
          </div>
        </div>
      </div>
      {componentSchemas.schemas.map((schema) => {
        return <HamletSchema name={schema.name} attributes={schema.value} />;
      })}
    </div>
  );
}

const HamletComponents = () => {
  const [definitions, setDefinitions] = useState({ components: [] });

  useEffect(() => {
    getAsyncDefinitions().then((result) => {
      setDefinitions(result);
    });
  }, []);

  return (
    <React.Fragment>
      <Admonition type="note" title="Under Development">
        The hamlet reference data is currently under development. Check back
        very soon to see a complete hamlet component reference.
      </Admonition>
      {definitions.components.map((component, index) => {
        return (
          <HamletComponent
            key={index}
            name={component.name}
            attributes={component.attributes}
          />
        );
      })}
    </React.Fragment>
  );
};

export default HamletComponents;
