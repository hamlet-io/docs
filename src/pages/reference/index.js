import React, { useState } from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import HamletDataTables from "@site/src/components/DataTables";
import { schema } from "@site/src/components/HamletJsonSchema";

const routes = [
  {
    path: "/reference/attributeset/link",
  },
  {
    path: "/reference/component/baseline",
  },
  {
    path: "/reference/data",
  },
];

function HamletRefRouter() {
  return (
    <Router>
      <div className="row row-no-gutters sidebarContainer">
        <div className="col col--2">
          <div style={{ display: "flex" }}>
            <div
              style={{
                padding: "10px",
                width: "100%",
                background: "#f0f0f0",
              }}
            >
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <br />
                <h2>Attribute Sets</h2>
                {Object.keys(schema.attributeset).map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link
                        to={`/reference?type=attributeset&instance=${instance}`}
                      >
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Components</h2>
                {Object.keys(schema.component).map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link
                        to={`/reference?type=component&instance=${instance}`}
                      >
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
                <br />
                <h2>Reference Data</h2>
                {Object.keys(schema.reference).map((instance) => (
                  <React.Fragment>
                    <li>
                      <Link
                        to={`/reference?type=reference&instance=${instance}`}
                      >
                        {instance}
                      </Link>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col col--9">
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path="/reference"
                children={<HamletDataTables />}
              />
            ))}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

const HamletComponentsSchema = () => {
  const [dataType, setDataType] = useState("component");

  const handleUpdate = (event) => setDataType(event.target.value);

  return (
    <Layout id="HamletComponents">
      <HamletRefRouter />
    </Layout>
  );
};

export default HamletComponentsSchema;
