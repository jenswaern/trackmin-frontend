"use client";

import Login from "@/components/Login";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="border rounded p-6 w-80">
        <Login />
      </div>
    </main>
  );
}
