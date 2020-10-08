import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTableComponents from '@site/src/components/DataTables';

const HamletMetaReferenceSchema = () => {
  return (
    <Layout id="HamletMetaReference">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTableComponents type="metaparameter" version="latest" />
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletMetaReferenceSchema;
