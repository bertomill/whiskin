import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Random Meal Selector",
  description: "Discover your next delicious meal from your Notion collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
