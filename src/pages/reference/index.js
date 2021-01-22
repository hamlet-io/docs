import React, { useState } from 'react';
import Layout from "@theme/Layout";
import HamletDataTables from '@site/src/components/DataTables';

const HamletComponentsSchema = () => {

  const [dataType, setDataType] = useState('component');

  const handleUpdate = event => setDataType(event.target.value);

  return (
      <Layout id="HamletComponents">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletDataTables type={dataType} />;
          </div>
          <div className="col col--1" />
        </div>
    </Layout>
  );
};

export default HamletComponentsSchema;
