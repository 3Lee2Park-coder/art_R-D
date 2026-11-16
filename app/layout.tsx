import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RestArt",
  description: "전시와 관람 기록",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Suspense fallback={<div className="min-h-dvh bg-white" data-ready="false" />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
