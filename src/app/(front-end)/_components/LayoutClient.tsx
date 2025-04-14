"use client";
import { usePathname } from "next/navigation";
import LeftBar from "./LeftBar";
import { publicRoutes } from "@/middleware";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = publicRoutes.includes(pathname)

  return (
    <div className="flex h-screen w-screen">
      {!isAuthPage && <LeftBar />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 