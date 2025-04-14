"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./_components/Loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/profile");
  }, [router]);

  return <Loading />;
}