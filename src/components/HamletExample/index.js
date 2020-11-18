import React, { useState, useEffect } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Highlight, { defaultProps } from "prism-react-renderer";

import "./styles.css";

function HamletExample({ codeblock }) {

  return (
      <Highlight
        {...defaultProps}
        code={codeblock}
        language="json"
        theme={require("../../theme/hamlet")}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
  );
}

export default HamletExample;
