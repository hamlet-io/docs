import React from "react";
import Layout from "@theme/Layout";
import HamletComponents from '@site/src/components/HamletComponents';

const HamletComponentReference = () => {
  return (
    <Layout id="HamletComponents">
      <div className="container">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletComponents />
          </div>
          <div className="col col--1" />
        </div>
      </div>
    </Layout>
  );
};

export default HamletComponentReference;
