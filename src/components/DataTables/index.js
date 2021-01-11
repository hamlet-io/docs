import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import {
  getJsonSchemaData,
  patternPropertiesRegex,
} from "@site/src/components/HamletJsonSchema";

import "./styles.css";

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

const getDataTables = (name, value, required) => {

  if (value["$ref"]) {
    value.type = "object";
  }
  
  if (value.type || value.anyOf) {
    var values = (value?.enum) ? value.enum.join(', ') : null;
    var defaultValue = formatDataTableDefault(value.type, value?.default);
    var type = (value.anyOf) ? value.anyOf.map(a => a.type).join(' or ') : value.type;
    var mandatory = (required && required.includes(name)) ? "true" : "false";
    return {
      id: '',
      attribute: name,
      description: value?.description,
      type: type,
      mandatory: mandatory,
      values: values,
      default: defaultValue,
    }
  }
  
  var dataTables = [];
  var tableData = [];
  Object.keys(value).map(attrName => {
    var attrValue = value[attrName];
    // add the attribute to the current DataTable
    tableData.push(getDataTables(attrName, attrValue, required));

    // objects with properties or patternProperties have child attributes.
    // define new dataTables for them.
    if (attrValue.patternProperties) {
      var childPath = attrValue.patternProperties[patternPropertiesRegex].properties;
      var required = attrValue.patternProperties[patternPropertiesRegex]?.required;
    }
    else if (attrValue.properties) {
      var childPath = attrValue.properties;
      var required = attrValue?.required;
    }

    if (childPath) {
      var children = [];
      Object.keys(childPath).map(childName => {
        var childValue = childPath[childName];
        children.push(getDataTables(childName, childValue, required));
        return children;
      });
      dataTables.push({
        title: attrName + " Sub-Schema",
        data: children,
      });
    }

    return {tableData, dataTables};
  });

  // add the current tableData to the Data Table.
  // as the primary data table, it goes at the start of the array
  dataTables.unshift(
    {
     title: name + " Schema",
     data: tableData,
    }
  );

  return dataTables
}

const getJsonSchemaDataTables = ({data, type}) => {

  var references = [];
  
  if (data.definitions) {
    
    Object.keys(data.definitions).map(title => {
      // define the root of the attributes for this reference data
      const referenceAttributeRoot = data.definitions[title].patternProperties[patternPropertiesRegex].properties;
      var mandatory = data.definitions[title].patternProperties[patternPropertiesRegex]?.required;
      // construct attribute data tables
      var dataTables = getDataTables(title, referenceAttributeRoot, mandatory);

      // add the reference
      references.push(
        {
          title: title,
          type: type,
          dataTables: dataTables,
        }
      );
      return references;
    });
  }
  return references;
}

function HamletDataTable({title, data, stripeTables=true, denseRows=true, defaultSort="attribute", columns=defaultColumns}) {
  return (
    <div className="reference">
      <DataTable
        title={title}
        columns={columns}
        data={data}
        striped={stripeTables}
        dense={denseRows}
        defaultSortField={defaultSort}
        theme="hamlet"
      />
    </div>
  )
}

function HamletDataTables(props) {

  const [referenceData, setReferenceData] = useState([]);
  
  const schemaData = getJsonSchemaData(props.type);
  const references = getJsonSchemaDataTables({data: schemaData, type: props.type});

  useEffect(() => {
    setReferenceData(references);
  }, []);

  return (
    <React.Fragment>
      {   
        referenceData.map((reference, idx) => {
          return (
            <div className="item shadow--tl component" key={idx} >
            { 
              reference.dataTables.map((table, index) => {
                return (
                  <div className="row" key={index} >
                    <div className="col col--1" />
                    <div className="col col--10 component" key={index + "col--10"} >
                      <HamletDataTable
                        title={table.title}
                        data={table.data}
                      />
                    </div>
                  </div>
                )
              })
            }
            </div>
          )
        })
      }
      <br />
    </React.Fragment>
  );
};

export default HamletDataTables;
