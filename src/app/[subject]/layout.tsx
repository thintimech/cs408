"use client";

import { useParams, notFound } from "next/navigation";
import { SubjectProvider } from "@/contexts/SubjectContext";
import { SubjectSidebar } from "@/components/layout/SubjectSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { subjects, SubjectId } from "@/data/subjects";

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const subjectId = params.subject as string;

  if (!subjects[subjectId as SubjectId]) {
    notFound();
  }

  return (
    <SubjectProvider subjectId={subjectId as SubjectId}>
      <div className="flex min-h-screen">
        <SubjectSidebar />
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </SubjectProvider>
  );
}
