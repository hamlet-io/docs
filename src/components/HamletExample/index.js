import React, { useState, useEffect } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Highlight, { defaultProps } from "prism-react-renderer";

import "./styles.css";

const examplejson = {
    Tiers: {
      tiername: {
        Components: {
          componentname: {},
        },
      },
    },
  };

function HamletExample() {
  return (
    <Tabs
      defaultValue="json"
      values={[
        { label: "JSON", value: "json" },
        { label: "YAML", value: "yaml" },
      ]}
    >
      <TabItem value="json">
        <Highlight {...defaultProps} code="" language="json">
          {(highlight) => <pre>{JSON.stringify(examplejson, null, 2)}</pre>}
        </Highlight>
      </TabItem>
      <TabItem value="yaml">
        <Highlight {...defaultProps} code="" language="yaml">
          {(highlight) => (
            <pre>{JSON.stringify({ test: "test3" }, null, 2)}</pre>
          )}
        </Highlight>
      </TabItem>
    </Tabs>
  );
}

export default HamletExample;
