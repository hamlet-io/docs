import React, { useState, useEffect, Component } from "react";
import Layout from "@theme/Layout";
import axios from "axios";
import "./components.css";
import Admonition from "react-admonitions";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Highlight, { defaultProps } from "prism-react-renderer";

/*
 alert(JSON.stringify(components[0], null, 4));
*/

const schemaUrl =
  "https://hamlet-docs-git-add-schema-documents.hamlet.now.sh/schema/latest/blueprint/component.json";
const filterObjects = ["deployment-units", "instances"];
const filterAttributerObjects = [
  "DeploymentUnits",
  "Instances",
  "additionalProperties",
];

const examplejson =
    {
      "Tiers": {
          "tiername" : {
              "Components" : {
                  "componentname" : {}
              }
          }
      }
  }

const getAttributeStructure = (attributes) => {
  let results = [];
  attributes.map((attribute) => {
    let result = {};
    let childAttributes = [];

    let required = "No";
    if (attribute.value.mandatory) {
      let required = "Yes";
    }

    switch (attribute.value.type) {
      default:
      case "boolean":
      case "string":
        result = {
          name: attribute.name,
          mandatory: required,
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
          mandatory: required,
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
          mandatory: required,
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
        childAttributes.push({ key: name, name: name, value: value });
        return childAttributes;
      });

    result.patternProperties &&
      Object.entries(result.patternProperties).map((pattern) => {
        let [n, val] = pattern;
        Object.entries(val.properties).map((child) => {
          let [name, value] = child;
          childAttributes.push({ key: name, name: name, value: value });
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

      /* Filter Components */
      if (!filterObjects.includes(name)) {
        /* Filter Attributes */
        let attributes = [];
        Object.entries(value.properties).map((attr) => {
          let [key, val] = attr;
          if (!filterAttributerObjects.includes(key)) {
            attributes.push({ name: key, value: val });
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
    return { components: components };
  });
};

/* Process Component Schemas Hook */
const getComponentSchemas = (props) => {
  let componentName = props.name;
  let componentAttributes = props.attributes;
  let componentSchemas = [];
  let topLevelAttributes = [];

  /* Top-Level Schema */
  componentAttributes.map((attribute) => {
    topLevelAttributes.push(attribute);
  });
  componentSchemas.push({
    name: componentName,
    value: topLevelAttributes,
  });

  /* Child Schemas */
  componentAttributes.map((attribute) => {
    let schemaAttributes = [];

    if (!["string", "boolean"].includes(attribute.value.type)) {
      /* Standard Attributes */
      attribute.value.properties &&
        Object.entries(attribute.value.properties).map((child) => {
          let [name, value] = child;
          schemaAttributes.push({ name: name, value: value });
          return schemaAttributes;
        });

      /* Sub Objects */
      attribute.value.patternProperties &&
        Object.entries(attribute.value.patternProperties).map((pattern) => {
          let [n, val] = pattern;
          Object.entries(val.properties).map((child) => {
            let [name, value] = child;
            schemaAttributes.push({ name: name, value: value });
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
      <td>{props.mandatory && props.mandatory}</td>
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
  const [schema, setSchema] = React.useState({ attributes: [] });

  React.useEffect(() => {
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
  const [componentSchemas, setComponentSchemas] = React.useState({
    schemas: [],
  });

  const schemas = getComponentSchemas(props);
  React.useEffect(() => {
    setComponentSchemas(schemas);
  }, []);

  return (
    <div className="item shadow--tl component">
      <div className="container">
        <div className="row">
          <div className="col col--4 ref-component-header avatar">{props.name + " Component"}</div>
          <div className="col col--8">
            <Tabs
              defaultValue="json"
              values={[
                { label: "JSON", value: "json" },
                { label: "YAML", value: "yaml" },
              ]}
            >
              <TabItem value="json">
                <Highlight {...defaultProps} code="" language="json">
                {highlight => <pre>{JSON.stringify(examplejson, null, 2)}</pre>}
                </Highlight>
              </TabItem>
              <TabItem value="yaml">
                <Highlight {...defaultProps} code="" language="yaml">
                  {highlight => <pre>{JSON.stringify({"test" : "test2"}, null, 2)}</pre>}
                </Highlight>
              </TabItem>

            </Tabs>
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
  const [definitions, setDefinitions] = React.useState({ components: [] });

  React.useEffect(() => {
    getAsyncDefinitions().then((result) => {
      setDefinitions(result);
    });
  }, []);

  return (
    <Layout id="HamletComponents">
      <div className="container">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
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
          </div>
          <div className="col col--1" />
        </div>
      </div>
    </Layout>
  );
};

export default HamletComponents;
