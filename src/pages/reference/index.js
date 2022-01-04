import React, { useState } from "react";
import Layout from "@theme/Layout";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import HamletDataTables from "@site/src/components/DataTables";
import { schema } from "@site/src/components/HamletJsonSchema";

function HamletRefRouter() {
  return (

      <div className="row sidebarContainer">
        <div className="col col--2">
          <div style={{ display: "flex" }}>
            <div
              style={{
                padding: "20px",
                width: "100%",
                background: "#f0f0f0",
              }}
            >
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <h2>Solution Reference</h2>
                  <React.Fragment>
                    <li>
                      <Link to={`/reference`}>
                        Home
                      </Link>
                    </li>
                  </React.Fragment>
                <br />
                <h2>Layers</h2>
                {Object.keys(schema.Layer.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=Layer&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Components</h2>
                {Object.keys(schema.Component.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=Component&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Reference Data</h2>
                {Object.keys(schema.Reference.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=Reference&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Modules</h2>
                {Object.keys(schema.Module.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=Module&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Tasks</h2>
                {Object.keys(schema.Task.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=Task&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Attribute Sets</h2>
                {Object.keys(schema.AttributeSet.definitions).sort().map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link to={`/reference?type=AttributeSet&instance=${instance}`}>
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
              </ul>
            </div>
          </div>
        </div>
        <div className="col col--9">
          <Switch>
            {Object.keys(schema).map((route, index) => (
              <Route
                key={index}
                path="/reference"
                children={<HamletDataTables />}
              />
            ))}
          </Switch>
        </div>
      </div>
  );
}

const Reference = () => {
  const [dataType, setDataType] = useState("component");

  //const handleUpdate = (event) => setDataType(event.target.value);

  return (
    <Layout id="HamletComponents">
      <HamletRefRouter />
    </Layout>
  );
};

export default Reference;
