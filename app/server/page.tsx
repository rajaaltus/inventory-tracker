export default async function ServerPage() {
  return (
    <main className="p-8 flex flex-col gap-6 mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold text-foreground">
        Server-Side Rendering Demo
      </h1>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">
          Placeholder
        </h2>
        <p className="text-sm text-muted-foreground">
          This page will demonstrate server-side data preloading with Convex
          once query functions are added to the backend.
        </p>
      </div>
    </main>
  );
}
