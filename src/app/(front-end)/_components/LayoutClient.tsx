// src/app/(front-end)/_components/LayoutClient.tsx
"use client";
import { usePathname } from "next/navigation";
import LeftBar from "./LeftBar";
import { publicRoutes } from "@/middleware";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const isAuthPage = publicRoutes.includes(pathname || "");

  return (
    <div className="flex h-screen w-screen p-20 bg-ice-blue ">
      <div className="flex-1 flex shadow-2xl drop-shadow-2xl">

      {!isAuthPage && <LeftBar />}
      <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}