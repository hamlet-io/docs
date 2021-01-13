import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTables from '@site/src/components/DataTables';

const HamletComponentsSchema = () => {
  return (
    <Layout id="HamletComponents">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTables type="component" />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletComponentsSchema;