"use client";

import { useSession } from "next-auth/react";
import TodosPage from "@/components/TodosPage";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center">

      {/* Navbar */}
      <Navbar session={session} />

      {/* Main Content */}
      <div className="mt-6">
        {session ? (
          <TodosPage />

        ) : (
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-center mb-6">
            Please log in to view your tasks.
          </h1>
        )}

      </div>
    </div>
  );
}
