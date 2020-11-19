import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import {
  getAsyncSchemaData,
  getAttributeStructure,
  getComponentStructure,
  getComponentExampleCodeblock,
} from "@site/src/components/HamletJsonSchema";
import HamletExample from "@site/src/components/HamletExample";

import "./styles.css";

const stripeTables = true;
const denseRows = true;
const defaultSortField = "attribute";
const columns = [
  {
    name: "Attribute",
    selector: "attribute",
    sortable: true,
  },
  {
    name: "Description",
    selector: "description",
    grow: 4,
    wrap: true,
  },
  {
    name: "Type",
    selector: "type",
    center: true,
  },
  {
    name: "Mandatory",
    selector: "mandatory",
    center: true,
  },
  {
    name: "Valid Values",
    selector: "values",
    grow: 2,
    wrap: true,
  },
  {
    name: "Default Value",
    selector: "default",
    grow: 1,
    wrap: true,
  },
];

createTheme("hamlet", {
  text: {
    primary: "#0b2e6d",
  },
  background: {
    default: "#f0f0f0",
  },
  context: {
    text: "#be282d",
  },
  divider: {
    default: "#4d94ff",
  },
});

function HamletSchemaDataTable(props) {
  const [schema, setSchema] = useState({ attributes: [] });

  useEffect(() => {
    setSchema(getAttributeStructure(props.data));
  }, []);
  let tablerows = [];
  schema.attributes.map((parent) => {
    tablerows.push({
      attribute: parent.attribute.name,
      type: parent.attribute.type,
      mandatory: parent.attribute.mandatory,
      values: parent.attribute.enum,
      default: parent.attribute.default,
      description: parent.attribute.description,
    });
  });

  return (
    <React.Fragment>
        <div className="reference">
            <DataTable
                title={props.title + " " + props.type + " Schema"}
                columns={columns}
                data={tablerows}
                striped={stripeTables}
                dense={denseRows}
                defaultSortField={defaultSortField}
                theme="hamlet"
            />
      </div>
      {schema.attributes.map((parent, index) => {
        parent.children.map((child) => {
          return (
            <HamletSchemaDataTable
              keyField={index}
              title={child.name}
              columns={columns}
              data={child.value}
            />
          );
        });
      })}
    </React.Fragment>
  );
}

function HamletDataTableComponent(props) {
  const [componentSchemas, setComponentSchemas] = useState({
    schemas: [],
  });

  const structure = getComponentStructure(props);

  useEffect(() => {
    setComponentSchemas(structure);
  }, []);

  const example = getComponentExampleCodeblock(props);

  return (
    <div className="item shadow--tl component">
      {componentSchemas.schemas.map((schema, index) => {
        return (
          <React.Fragment>
            <br />
            <h2>{schema.name} {props.type}</h2>
            <HamletExample
              codeblock={example}
            />
            <HamletSchemaDataTable
              key={index}
              title={schema.name}
              type={props.type}
              columns={columns}
              data={schema.value}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

const HamletDataTableComponents = (props) => {
  const [definitions, setDefinitions] = useState({ components: [] });

  useEffect(() => {
    getAsyncSchemaData({ type: props.type, version: props.version }).then(
      (result) => {
        setDefinitions(result);
      }
    );
  }, []);

  return (
    <React.Fragment>
      {definitions.components.map((component, index) => {
        return (
          <div className="row">
            <div className="col col--1" />
              <div className="col col--10 component">
                <HamletDataTableComponent
                  key={index}
                  name={component.name}
                  type={props.type}
                  attributes={component.attributes}
                />
              </div>
            <div className="col col--1" />
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default HamletDataTableComponents;
