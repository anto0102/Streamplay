import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streamplay | Streaming",
  description: "Experience the best of cinema with Streamplay.",
  icons: {
    icon: '/favicon.ico',
  },
};

import { LanguageProvider } from "@/components/LanguageContext";
import { FavoritesProvider } from "@/components/FavoritesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-primary selection:text-white`}>
        <LanguageProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
