import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ShambaSmart: ML for Kenyan farmers", template: "%s | ShambaSmart" },
  description: "Crop recommendation and yield prediction powered by machine learning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
        <footer className="border-t border-leaf-100 py-6 text-center text-xs text-leaf-900/60">
          ShambaSmart · SWE2020C Machine Learning and Big Data · Group 1 · USIU-Africa
        </footer>
      </body>
    </html>
  );
}
