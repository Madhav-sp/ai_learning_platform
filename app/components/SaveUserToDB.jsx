"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
export default function SaveUserToDB() {
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    async function saveUser() {
      await fetch("/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
    }
    saveUser();
  }, [user]);
  return null;
}