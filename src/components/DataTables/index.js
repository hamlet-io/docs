import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import HamletExample from "@site/src/components/HamletExample";
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  getJsonSchemaData,
  getSchemaExample,
  patternPropertiesRegex,
} from "@site/src/components/HamletJsonSchema";
import { useLocation, useParams } from "react-router-dom";
import qs from "qs";

import "./styles.css";

const getSchemaUrl = (ref) => (! ref.startsWith('#definitions')) ? useBaseUrl(ref) : ref;

const defaultColumns = [
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
    cell: row => {
      return (
        <div data-tag="allowRowEvents">
          {
            (row.type.startsWith('#')) ? <a href={getSchemaUrl(row.type)}>object</a> 
            : (row.type == "object") ? <a href={getSchemaUrl('#' + row.attribute)}>object</a>
            : row.type
          }
        </div>
      )
    },
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

const formatDataTableDefault = (type, value) => {
  // format an attributes default value based on its attribute type.
  if (!value) {
    return '';
  }
  switch (type) {
    case "object":
      return JSON.stringify(value, null, 4);
      break;

    case "array":
      return value.join(', ')
      break;
  
    default:
      return value;
      break;
  }
}

const getDataTableList = (data) => {
  var tableList = [];
  if (data?.definitions) {
    const schemaName = Object.keys(data.definitions)[0];
    const schemaAttributeRoot = data.definitions[schemaName].patternProperties[patternPropertiesRegex];
    const schemaData = schemaAttributeRoot.properties;
    const required = (schemaAttributeRoot?.required) ? schemaAttributeRoot.required : []; 
    tableList = getDataTableList(schemaData);
    tableList.unshift({table: schemaName, data: schemaData, required: required});
  } else {
    Object.keys(data).map(attrName => {
      const attrValue = data[attrName];
      const required = (attrValue?.required) ? attrValue.required : []; 
      (attrValue?.properties) ? tableList.push({ 
        table: attrName,
        data: attrValue.properties,
        required: required
      })
      : (attrValue?.patternProperties) ? (
        tableList.push({
          table: attrName, 
          data: attrValue.patternProperties[patternPropertiesRegex].properties,
          required: 
            (attrValue.patternProperties[patternPropertiesRegex]?.required) ? 
              attrValue.patternProperties[patternPropertiesRegex].required 
              : []
        })
      ) : null
      return tableList
    })
  }
  return tableList
}

const getDataTableRows = (data, required) => {
  var tableRows = [];
  Object.keys(data).map((attrName, idx) => {
    const attrValue = data[attrName];
    attrValue.type = (attrValue["$ref"]) ? attrValue["$ref"] : attrValue.type;
    const values = (attrValue?.enum) ? attrValue.enum.join(', ') : null;
    const defaultValue = formatDataTableDefault(attrValue.type, attrValue?.default);
    const type = (attrValue?.anyOf) ? attrValue.anyOf.map(a => a.type).join(' or ') : attrValue.type;
    const isRequired = (required.includes(attrName)) ? "true" : "false";
    tableRows.push({
      id: idx,
      attribute: attrName,
      description: attrValue?.description,
      type: type,
      mandatory: isRequired,
      values: values,
      default: defaultValue
    });
    return tableRows
  })
  return tableRows
}

function HamletDataTable({title, data, stripeTables=true, denseRows=true, defaultSort="attribute", columns=defaultColumns}) {
  return (
    <div className="reference">
      <section id={title} key={title}>
        <DataTable
          title={title}
          columns={columns}
          data={data}
          striped={stripeTables}
          dense={denseRows}
          defaultSortField={defaultSort}
          theme="hamlet"
        />
      </section>
    </div>
  )
}

function HamletDataTables() {
  const { type, instance } = qs.parse(useLocation().search, { ignoreQueryPrefix: true })
  const schemaHeader = instance + " " + type;
  const schemaData = getJsonSchemaData(type || 'component', instance || 'baseline');
  const dataTables = getDataTableList(schemaData);
  const schemaExample = JSON.stringify(getSchemaExample(schemaData), null, 4);
  return (
    <React.Fragment>
      <div className="item shadow--tl component" > 
        <div className="ref-row-headers">
          <section id={instance}>
            <h1>{schemaHeader}</h1>
          </section>
        </div>
        <HamletExample
          codeblock={schemaExample}
        />
        { 
          dataTables.map((table) => {
            const tableRows = getDataTableRows(table.data, table.required);
            return (
                <section id={table.table.toLowerCase()}>
                  <HamletDataTable
                    title={table.table + " Schema"}
                    data={tableRows}
                  />
                  <br />
                </section>
            )
          })
        }
      </div>
      <br />
    </React.Fragment>
  )
};

export default HamletDataTables;
