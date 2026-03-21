"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
}) {
  const data = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);
  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">
          Reactive client-loaded data
        </h2>
        <code className="overflow-x-auto rounded-lg border border-border bg-card p-4">
          <pre className="text-sm text-muted-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </code>
      </div>
      <Button
        className="mx-auto"
        onClick={() => {
          void addNumber({ value: Math.floor(Math.random() * 10) });
        }}
      >
        Add a random number
      </Button>
    </>
  );
}
