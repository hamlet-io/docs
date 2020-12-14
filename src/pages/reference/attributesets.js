import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTableComponents from '@site/src/components/DataTables';

const HamletAttributeSetsReferenceSchema = () => {
  return (
    <Layout id="HamletAttributeSetsReference">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTableComponents type="attributeset" version="latest" />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletAttributeSetsReferenceSchema;
