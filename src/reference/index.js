import React, { useState } from 'react';
import Layout from "@theme/Layout";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import HamletDataTables from '@site/src/components/DataTables';

const routes = [
  {
    path: "/reference/attributeset/link",
  },
  {
    path: "/reference/component/baseline",
  },
  {
    path: "/reference/data",
  }
]

function HamletRefRouter() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "40%",
            background: "#f0f0f0"
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <h2>Attribute Sets</h2>
            <li>
              <Link to="/reference/attributeset/link">Link</Link>
            </li>
            <h2>Components</h2> 
            <li>
              <Link to="/reference/component/baseline" >Baseline</Link>
            </li>
            <h2>Reference Data</h2>
            <li>
              <Link to="/reference/data">Reference Data</Link>
            </li>
          </ul>
        </div>
      </div>
      <Switch>
            {routes.map((route, index) => (
              <Route key={index} path="/reference/:type/:instance" children={<HamletDataTables />} />
            ))}
        </Switch>
    </Router>
  );
}

const HamletComponentsSchema = () => {

  const [dataType, setDataType] = useState('component');

  const handleUpdate = event => setDataType(event.target.value);

  return (
      <Layout id="HamletComponents">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletRefRouter />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletComponentsSchema;
