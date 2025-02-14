import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react"; 
import Loader from "../components/Loader"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/theme-provider"
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ethiolost and Found ",
  description: "Discover a world of lost and found treasures! Whether you are searching for a lost item or want to help reunite others with their belongings, you are in the right place.",
 keywords: [
    "Lost iteam",
    "Ethiopia lost and found",
    "Ethhiopia",
    "Found iteam",
    
  ],
  openGraph: {
    title: "Ethiolost and Found ",
  description: "Discover a world of lost and found treasures! Whether you are searching for a lost item or want to help reunite others with their belongings, you are in the right place.",
    images: [
      {
        url: "https://ethio-lost-and-found.vercel.app/metaimage.png",
        width: 800,
        height: 600,
        alt: "Ethiolost and Found",
      }
    ],
  },
  alternates: {
    canonical: "https://ethio-lost-and-found.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
        >
       
        <Suspense fallback={<Loader />}> 
      
          <Navbar />
          {children}
          <Footer />
        </Suspense>
        </ThemeProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
  