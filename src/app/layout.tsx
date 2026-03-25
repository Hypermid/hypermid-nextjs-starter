import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HyperMid Swap - Cross-Chain Token Swap",
  description:
    "Swap tokens across 11+ blockchains with the best rates. Powered by HyperMid.",
  icons: {
    icon: "/hypermid-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface antialiased">
        {children}
      </body>
    </html>
  );
}
