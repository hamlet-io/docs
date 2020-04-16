import React, { useState, useEffect, Component } from 'react';
import Layout from '@theme/Layout';
import axios from 'axios';

/*
 alert(JSON.stringify(components[0], null, 4));
*/

const schemaUrl = "https://hamlet-docs-git-add-schema-documents.hamlet.now.sh/schema/latest/blueprint/component.json";
const filterObjects = ["deployment-units", "instances"];
const filterAttributerObjects = ["DeploymentUnits", "Instances"];

const getAsyncDefinitions = () => {
  let components = [];
  return axios.get(schemaUrl).then(response => {
    Object.entries(response.data.definitions)
      .map(definition => {
        let [name, value] = definition; 

        /* Filter Components */
        if (! filterObjects.includes(name)) {

          /* Filter Attributes */
          let attributes = [];
          Object.entries(value.properties)
            .map(attr => {
              let [key, val] = attr;
              if (! filterAttributerObjects.includes(key)){
                attributes.push({ 'name': key, 'value': val })
              }
              return attributes
            });

          components.push(
            { 
              'name': name,
              'attributes': attributes
            }
          )
        }
        return components
      });
    return { 'components': components }
  });
}

function HamletAttribute(props) {
  return <p>{props.name}</p>
}


function HamletComponent(props) {
  const [componentState, setComponentState] = React.useState(
    { 
      attributes : props.attributes
    });

  return (
    <div>
      <h1>{props.name}</h1>
      <div className="AttributesContainer">
        {
          componentState.attributes.map((attribute, index) => {
            return <HamletAttribute key={index} name={attribute.name} />
          })
        }
      </div>
    </div>
  )
}

const HamletComponents = () => {
  const [definitions, setDefinitions] = React.useState({ components: [] });

  React.useEffect(() => {
    getAsyncDefinitions().then(result => {
      setDefinitions(result);
    });
  }, []);


  return(
    <Layout id="HamletComponents">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '20px',
          }}>
          {
            definitions.components.map((component, index) => {
              return <HamletComponent key={index} name={component.name} attributes={component.attributes} />
            })
          }
        </div>
      </Layout>
  );
}

export default HamletComponents;
