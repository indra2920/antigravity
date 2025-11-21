import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YAYASAN DARULHUDA",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${outfit.className} bg-slate-50 text-slate-800`} suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 pb-20 md:pb-0 relative max-w-md mx-auto md:max-w-full bg-white md:bg-transparent min-h-screen shadow-2xl md:shadow-none overflow-hidden">
            {children}
          </main>

          {/* Mobile Bottom Nav */}
          <div className="md:hidden fixed bottom-0 w-full z-50 max-w-md mx-auto left-0 right-0">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
