"use client";

import { useState } from "react";
import { useSubject } from "@/contexts/SubjectContext";
import { widgetRegistry } from "@/components/widgets";

export default function ToolsPage() {
  const config = useSubject();
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const tools = Object.entries(widgetRegistry).filter(([, w]) => w.subject === config.id);

  if (activeWidget) {
    const widget = widgetRegistry[activeWidget];
    if (widget) {
      const Widget = widget.component;
      return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <button
            onClick={() => setActiveWidget(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; 返回工具列表
          </button>
          <Widget />
        </div>
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">互动工具</h1>
        <p className="text-sm text-muted-foreground mt-1">动手实践，加深理解</p>
      </div>

      {tools.length === 0 && (
        <p className="text-sm text-muted-foreground">该科目暂无可用工具。</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map(([key, widget]) => (
          <button
            key={key}
            onClick={() => setActiveWidget(key)}
            className="text-left rounded-lg border border-border p-4 hover:border-[var(--subject-color)] hover:shadow-sm transition-all group"
          >
            <h3 className="font-medium text-sm group-hover:text-[var(--subject-color)] transition-colors">
              {widget.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
