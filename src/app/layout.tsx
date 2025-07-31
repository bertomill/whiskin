import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Whiskin",
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
  // PWA metadata for better mobile experience and "Add to Home Screen" functionality
  manifest: '/manifest.json',
  // Theme color that matches our app's branding for mobile browsers
  themeColor: '#E74C3C',
  // Additional PWA-related metadata
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Whiskin',
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
        {/* Standard favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA manifest - enables "Add to Home Screen" functionality */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA-specific meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Whiskin" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#E74C3C" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Service worker registration script - enables offline functionality */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful');
                    })
                    .catch(function(error) {
                      console.log('ServiceWorker registration failed: ', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <SessionProvider>
          {children}
          {/* Add to Home Screen component - shows install prompt on mobile */}
          <AddToHomeScreen />
        </SessionProvider>
      </body>
    </html>
  );
}
