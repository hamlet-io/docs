import React from "react";
import { Highlight } from "prism-react-renderer";

import "./styles.css";

export default function HamletExample({ codeblock }) {
  return (
      <Highlight
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
