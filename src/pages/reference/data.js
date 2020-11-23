import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTableComponents from '@site/src/components/DataTables';

const HamletReferenceDataSchema = () => {
  return (
    <Layout id="HamletReferenceData">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTableComponents type="reference" version="latest" />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletReferenceDataSchema;
