"use client";

import { api } from "~/trpc/react";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "Gator Hack V" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="stagger flex flex-col items-center gap-4 text-center">
        <span className="font-[var(--font-display)] text-sm uppercase tracking-[0.3em] text-accent">
          Gator Hack V
        </span>
        <h1 className="font-[var(--font-display)] text-4xl font-bold sm:text-6xl">
          Starter scaffold is live
        </h1>
        <p className="max-w-md text-foreground/70">
          {hello.data ? hello.data.greeting : "Loading from the tRPC API..."}
        </p>
      </div>
    </main>
  );
}
