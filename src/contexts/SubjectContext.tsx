"use client";

import { createContext, useContext } from "react";
import { SubjectConfig, SubjectId, subjects } from "@/data/subjects";

const SubjectContext = createContext<SubjectConfig | null>(null);

export function SubjectProvider({
  subjectId,
  children,
}: {
  subjectId: SubjectId;
  children: React.ReactNode;
}) {
  const config = subjects[subjectId];
  return (
    <SubjectContext.Provider value={config}>
      <div style={{ "--subject-color": config.color } as React.CSSProperties}>
        {children}
      </div>
    </SubjectContext.Provider>
  );
}

export function useSubject(): SubjectConfig {
  const ctx = useContext(SubjectContext);
  if (!ctx) {
    throw new Error("useSubject must be used within a SubjectProvider");
  }
  return ctx;
}
