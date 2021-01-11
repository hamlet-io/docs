import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletDataTables from '@site/src/components/DataTables';

const HamletComponentsSchema = () => {
  return (
    <Layout id="HamletComponents">
      <HamletDataTables type="component" />
    </Layout>
  );
};

export default HamletComponentsSchema;