import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react"; 
import Loader from "../components/Loader"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReactNode } from "react";


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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
       
        <Suspense fallback={<Loader />}> {/* Fallback is the Loader */}
      
          <Navbar />
          {children}
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
