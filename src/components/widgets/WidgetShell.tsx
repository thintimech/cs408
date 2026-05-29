"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function WidgetShell({ title, description, children }: WidgetShellProps) {
  return (
    <Card className="border-t-[3px] overflow-hidden" style={{ borderTopColor: "var(--subject-color)" } as React.CSSProperties}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
