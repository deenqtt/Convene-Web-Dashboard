import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Convene — by deenqtt",
  description: "Convene — meeting management app powered by deenqtt",
  icons: {
    icon: [
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/icon-light.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
