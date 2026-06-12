import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/layout/Providers";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmJumnoy - កសិកម្មឌីជីថល",
  description: "Agritech Super App for Cambodian Farmers",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmJumnoy",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
