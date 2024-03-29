import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import HamletExample from "@site/src/components/HamletExample";
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  getJsonSchemaData,
  getSchemaExample,
  patternPropertiesRegex,
} from "@site/src/components/HamletJsonSchema";
import { useLocation } from "react-router-dom";
import qs from "qs";

import "./styles.css";

const getSchemaUrl = (ref) => {
  if ( ! ref.startsWith('#definitions')) {
    return {
      "url" : useBaseUrl(ref),
      "name" : ref
    }
  }
  else {
    return {
      "url" : ref,
      "name" : ref
    }
  }
}

const getExternalSchemaUrl = (ref) => {
  const url = new URL(ref);
  const schema_source = url.pathname.substring(url.pathname.lastIndexOf('/')+1).split("-")[0];
  const definition = url.hash.substring(url.hash.lastIndexOf('/')+1);
  return {
    "url" : useBaseUrl("reference?type=" + schema_source + "&instance=" + definition),
    "name" : schema_source + ":" + definition
  }
}

const defaultColumns = [
  {
    name: "Attribute",
    selector: row => row.attribute,
    grow: 1,
    sortable: true,
  },
  {
    name: "Description",
    selector: row => row.description,
    grow: 2,
    wrap: true,
  },
  {
    name: "Types",
    selector: row => row.type,
    center: true,
    wrap: true,
    grow: 1,
    cell: row => {
      return (
        <div data-tag="allowRowEvents">
          {
            (row.type.startsWith('#')) ? <a href={getSchemaUrl(row.type).url}>{getSchemaUrl(row.type).name}</a>
            : (row.type.startsWith('https://')) ? <a href={getExternalSchemaUrl(row.type).url}>{getExternalSchemaUrl(row.type).name}</a>
            : (row.type == "object") ? <a href={getSchemaUrl('#' + row.attribute).url}>{getSchemaUrl(row.attribute).name}</a>
            : row.type
          }
        </div>
      )
    },
  },
  {
    name: "Mandatory",
    selector: row => row.mandatory,
    grow: 1,
    center: true,
    sortable: true,
    wrap: true,
  },
  {
    name: "Possible Values",
    selector: row => row.values,
    grow: 1,
    wrap: true,
    cell: row => {
      return (
        <div>{row.values}</div>
      )
    }
  },
  {
    name: "Default Value",
    selector: row => row.default,
    grow: 1,
    wrap: true,
    cell: row => {
      return (
        <div>{row.default}</div>
      )
    }
  },
];

createTheme("hamlet", {
  text: {
    primary: "#1c1e21",
  },
  context: {
    text: "#be282d",
  },
  divider: {
    default: "#4d94ff",
  },
});

const customStyles = {
  cells: {
      style: {
        whiteSpace: "pre-wrap"
      },
  },
};

const formatDataTableDefault = (type, value) => {
  // format an attributes default value based on its attribute type.
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case "object":
      return JSON.stringify(value, null, 2);

    case "array":
      return value.join('\n');

    case "boolean":
      return value ? "true" : "false";

    default:
      return value;
  }
}

const getDataTableList = (table, data) => {
  var tableList = [];

  tableList.push({
    table: table,
    data: data.properties,
    required: (data?.required) ? data.required : []
  })

  if ( data.properties ) {

    for ( const [key, value] of Object.entries(data.properties)) {
      if ( value.type === "object" ) {
        if ( value.properties ) {
          tableList.push.apply(tableList, getDataTableList(key, value))
        }

        if ( value.patternProperties ) {
          tableList.push.apply(tableList, getDataTableList(key, value.patternProperties[patternPropertiesRegex]))
        }
      }
    }
  }

  return tableList;
}

const getDataTableRows = (data, required) => {
  var tableRows = [];

  for ( const [key, value] of Object.entries(data) ) {

    value.type = (value["$ref"]) ? value["$ref"] : value.type;
    const values = (value?.enum) ? value.enum.join('\n') : null;
    const defaultValue = formatDataTableDefault(value.type, value?.default);
    const type = Array.isArray(value.type) ? value.type.join('\n') : value.type;
    const isRequired = (required.includes(key)) ? "yes" : null;

    tableRows.push({
      id: key,
      attribute: key,
      description: value?.description,
      type: type,
      mandatory: isRequired,
      values: values,
      default: defaultValue
    })
  }

  return tableRows
}

function HamletDataTable({title, data, stripeTables=false, denseRows=false, defaultSort="mandatory", columns=defaultColumns}) {
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
          customStyles={customStyles}
          theme="hamlet"
        />
      </section>
    </div>
  )
}

function HamletDataTables() {
  const { type, instance } = qs.parse(useLocation().search, { ignoreQueryPrefix: true })

  if (instance && type ) {
    const schemaHeader = type + ": " + instance;
    const schemaData = getJsonSchemaData(type, instance);
    const dataTables = getDataTableList("", schemaData);
    const schemaExample = JSON.stringify(getSchemaExample(schemaData), null, 4);

    return (
      <React.Fragment>
        <div className="item component" >
          <section id={instance}>
            <h1>{schemaHeader}</h1>
            <p>{schemaData.description}</p>
            <br></br>
          </section>
          <div>
            <h3>Syntax</h3>
            <section>To use this configuration create an object with the following syntax:</section>
            <br></br>
          </div>
          <HamletExample
            codeblock={schemaExample}
          />
          <div>
            <h3>Details</h3>
            <section>Each table below provides details on the properties for each object in the syntax above </section>
            <br></br>
          </div>
          {
            dataTables.map((table) => {
              const tableRows = getDataTableRows(table.data, table.required);
              return (
                  <section key={table.table} id={table.table.toLowerCase()}>
                    <HamletDataTable
                      title={table.table}
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
  }
  else {
    return (
      <React.Fragment>
        <div className="item component" >
          <section id="welcome">
            <h1>Hamlet Solution Reference</h1>
          </section>
          <section>
            The hamlet solution reference provides detailed information on what can be defined in a hamlet solution file
          </section>
          <br></br>
          <section>
            The reference is broken up into sections based on how the configuration is used:
            <ul>
              <li><strong>Layers</strong> Set the context of what is being deployed and allow you to describe multiple applications within a single hamlet</li>
              <li><strong>Components</strong> Describe each function performed as part of your application</li>
              <li><strong>Reference Data</strong> Provides a collection of metadata that can shared across components</li>
              <li><strong>Modules</strong> Inject blueprint data into your solution to share and reuse your solution</li>
              <li><strong>Tasks</strong> Describe a task that should be executed based on a hamlet provided contract such as a runbook</li>
              <li><strong>Attribute Sets</strong> Are used to define configuration which is shared throughout the solution</li>
            </ul>
          </section>
          <br></br>
          <section>
          <h2>Using the Reference</h2>
          <div>
            Each reference is made up of two sections, the Syntax and the Details.
            <ul>
              <li><strong>Syntax</strong>  The full structure of the configuration item with all values populated by the type of the property.</li>
              <li><strong>Details</strong> A table for each object in the configuration along with the properties of each attribute </li>
            </ul>
          </div>
          </section>
        </div>
        <br />
      </React.Fragment>
    )
  }
};

export default HamletDataTables;
