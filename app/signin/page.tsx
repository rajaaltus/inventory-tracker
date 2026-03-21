"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryVerticalEndIcon } from "lucide-react";

import { LoginForm, type AuthFlow } from "@/components/login-form";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<AuthFlow>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleFlow = () => {
    setFlow((f) => (f === "signIn" ? "signUp" : "signIn"));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("flow", flow);
    void signIn("password", formData)
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
      .then(() => {
        router.push("/dashboard");
      });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-foreground"
            aria-label="Back to home"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" aria-hidden />
            </div>
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">Asset Tracker</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              flow={flow}
              onToggleFlow={handleToggleFlow}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div
        className="relative hidden overflow-hidden bg-muted lg:block"
        aria-hidden
      >
        <Image src="/login-bg.jpg" alt="" fill className="object-cover" />
        {/* <div className="pointer-events-none absolute inset-0 bg-primary/10" />
        <div className="pointer-events-none absolute inset-0 bg-accent/40" />
        <div className="absolute inset-8 flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card p-8 shadow-sm">
          <Image src="/convex.svg" alt="" width={72} height={72} />
          <div className="h-px w-24 bg-border" />
          <Image
            src="/nextjs-icon-light-background.svg"
            alt=""
            width={72}
            height={72}
            className="dark:hidden"
          />
          <Image
            src="/nextjs-icon-dark-background.svg"
            alt=""
            width={72}
            height={72}
            className="hidden dark:block"
          />
        </div> */}
      </div>
    </div>
  );
}
