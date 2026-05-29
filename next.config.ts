import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/chapters/:chapterId", destination: "/ds/chapters/:chapterId", permanent: true },
      { source: "/lessons/:lessonId", destination: "/ds/lessons/:lessonId", permanent: true },
      { source: "/chat", destination: "/ds/chat", permanent: true },
      { source: "/practice/:id", destination: "/ds/practice/:id", permanent: true },
    ];
  },
};

export default nextConfig;
