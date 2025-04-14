"use client";
import { Group } from "../@types/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GroupItem from "./GroupItem";
import SearchBar from "./SearchBar";
import Link from "next/link";

export default function LeftBar() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/group", {
          method: "GET",
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch group data");
        }

        const data = await response.json();
        setGroups(data.groups);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [router]);

  return (
    <div className="flex flex-col bg-foreground border-r border-light-gray">
      <SearchBar handleSetSearchTerm={setSearchTerm} />
      <div className={`flex flex-col overflow-y-auto`}>
        {groups.map((group) => (
          <div key={group.id}>
            {group.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
              <Link href={`/group/${group.id}`} key={group.id}>
                <GroupItem key={group.id} group={group} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
