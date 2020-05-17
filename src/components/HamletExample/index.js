import React, { useState, useEffect } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Highlight, { defaultProps } from "prism-react-renderer";

import "./styles.css";

function HamletExample({ codeblocks }) {

  let labels = [];
  codeblocks.map((codeblock) => {
    labels.push({ label: codeblock.label, value: codeblock.type });
    return labels;
  });

  return (
    <Tabs defaultValue="json" values={labels}>
      {codeblocks.map((codeblock) => {
        return (
          <TabItem value={codeblock.type}>
            <Highlight
              {...defaultProps}
              code={codeblock.value}
              language={codeblock.type}
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
          </TabItem>
        );
      })}
    </Tabs>
  );
}

export default HamletExample;
