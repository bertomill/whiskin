import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MealBoost",
  description: "Discover your next delicious meal from your Notion collection",
  icons: {
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MealBoost" />
      </head>
      <body>{children}</body>
    </html>
  );
}
