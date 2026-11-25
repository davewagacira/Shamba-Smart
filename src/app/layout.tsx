import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "ShambaSmart recommends the crops best suited to your soil and climate, and forecasts the harvest you can expect.";

export const metadata: Metadata = {
  metadataBase: new URL("https://shambasmart-codeverseafrica.vercel.app"),
  title: { default: "ShambaSmart | Plant the right crop. Know your harvest.", template: "%s | ShambaSmart" },
  description,
  openGraph: { title: "ShambaSmart", description, siteName: "ShambaSmart", type: "website", locale: "en_KE" },
};

export const viewport: Viewport = { themeColor: "#2e6526" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
