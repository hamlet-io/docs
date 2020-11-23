import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTableComponents from '@site/src/components/DataTables';

const HamletComponentsSchema = () => {
  return (
    <Layout id="HamletComponents">
      <HamletDataTableComponents type="component" version="latest" />
    </Layout>
  );
};

export default HamletComponentsSchema;