// src/app/(front-end)/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { publicRoutes } from "@/middleware";
import { usePathname } from "next/navigation";
import LeftBar from "./_components/LeftBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chatgram",
  description: "A chat application",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = publicRoutes.includes(pathname || "");
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex h-screen w-screen">
          {!isAuthPage && <LeftBar />}
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
