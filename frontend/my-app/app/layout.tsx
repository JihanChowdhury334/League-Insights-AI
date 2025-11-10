import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rift Rewind — Your Season, Your Story",
  description: "Relive your League of Legends season with AI-powered insights, beautiful visualizations, and a personalized wrapped-style recap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen">
          {/* Global Background */}
          <div className="fixed inset-0 -z-10">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/rift-bg.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/30 to-slate-950/80" />
          </div>
          
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
