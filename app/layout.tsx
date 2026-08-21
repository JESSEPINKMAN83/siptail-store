import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SipTail — Hydrate Your Dog on Every Walk",
  description: "Portable pet water bottles for active dogs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-gray-100 mt-20 py-10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SipTail. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
