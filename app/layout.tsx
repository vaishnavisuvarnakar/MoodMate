import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoodMate — Your wellness companion",
  description: "Track your mood, habits, and journal. Talk to your AI companion.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
