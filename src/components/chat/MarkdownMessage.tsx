"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h3: ({ children }) => <h3 className="font-semibold mt-3 mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="font-medium mt-2 mb-1">{children}</h4>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          code: ({ children, className }) => {
            if (className || (typeof children === "string" && children.includes("\n"))) {
              const codeStr = String(children).replace(/\n$/, "");
              return <CodeBlock code={codeStr} />;
            }
            return <code className="px-1 py-0.5 bg-background/50 rounded text-xs font-mono">{children}</code>;
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 my-2 opacity-80 italic">{children}</blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5 my-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5 my-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="w-full text-xs border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-current/20">{children}</thead>,
          th: ({ children }) => <th className="text-left p-1.5 font-medium">{children}</th>,
          td: ({ children }) => <td className="p-1.5 border-b border-current/10">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
