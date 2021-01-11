import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTables from '@site/src/components/DataTables';

const HamletReferenceDataSchema = () => {
  return (
    <Layout id="HamletReferenceData">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTables type="reference" />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletReferenceDataSchema;
