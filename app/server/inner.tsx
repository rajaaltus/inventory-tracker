"use client";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-6 shadow-sm">
      <h2 className="text-xl font-bold text-foreground">
        Reactive Client Component
      </h2>
      <p className="text-sm text-muted-foreground">
        This component will display real-time data from Convex once query and
        mutation functions are implemented.
      </p>
    </div>
  );
}
