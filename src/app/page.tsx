"use client"

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <UserButton />
    </main>
  );
}
