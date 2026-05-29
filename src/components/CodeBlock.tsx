"use client";

import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "c" }: CodeBlockProps) {
  const trimmed = code.replace(/^\n+|\n+$/g, "");

  return (
    <Highlight theme={themes.oneDark} code={trimmed} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="rounded-lg border border-border overflow-x-auto my-4 text-[13px] leading-6"
          style={{ ...style, padding: "1rem", background: "var(--color-muted)" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="table-row">
              <span className="table-cell pr-4 text-right select-none opacity-40 text-xs w-8">
                {i + 1}
              </span>
              <span className="table-cell">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
