"use client";

import Link from "next/link";
import {
  Monitor,
  Users,
  Upload,
  LayoutDashboard,
  ArrowRight,
  Package,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

/* ─── Navigation ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2.5">
          <Package className="size-5 text-primary" strokeWidth={2.2} />
          <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
            AssetTracker
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-xs text-muted-foreground font-medium">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#overview" className="hover:text-foreground transition-colors">
            Overview
          </a>
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/signin">
            <Button size="sm" variant="outline" className="text-xs h-8 px-4">
              Sign in
              <ArrowRight className="size-3 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 px-6">
      <div className="absolute inset-0 -z-10 bg-muted/40" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-primary/5" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 border border-border rounded-full px-3.5 py-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Internal Tool
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-balance text-foreground">
          Track every asset.
          <br />
          <span className="text-muted-foreground">Know who has what.</span>
        </h1>
        <p className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto">
          A lightweight inventory system for hardware and software licenses
          assigned to your team.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="text-sm h-11 px-6">
              Get started
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg" className="text-sm h-11 px-6 text-muted-foreground">
              Learn more
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  {
    icon: Users,
    title: "Asset-to-Employee Linking",
    description:
      "Assign laptops, monitors, and licenses to team members with relational data you can query instantly.",
  },
  {
    icon: Upload,
    title: "Receipt & Photo Uploads",
    description:
      "Attach purchase receipts or equipment photos directly to any asset record using built-in file storage.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description:
      "See available vs. assigned inventory at a glance. Filter by type, status, or employee.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Conditionally render views based on user roles — admins manage, employees view their own assets.",
  },
];

function Features() {
  const { ref, visible } = useInView();

  return (
    <section id="features" ref={ref} className="px-6 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
            Capabilities
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Everything you need, nothing you don&rsquo;t
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`group border-border bg-card transition-all duration-500 hover:border-primary/25 hover:shadow-sm ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 size-9 rounded-lg bg-primary/8 flex items-center justify-center mt-0.5 group-hover:bg-primary/12 transition-colors">
                    <f.icon
                      className="size-4 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold mb-1.5 text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats / Overview ─── */
function Stats() {
  const { ref, visible } = useInView();

  const items = [
    { value: "Real-time", label: "Sync across all devices" },
    { value: "Relational", label: "Assets linked to employees" },
    { value: "File Storage", label: "Receipts & photos attached" },
  ];

  return (
    <section id="overview" ref={ref} className="px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-2xl border border-border bg-muted/50 p-8 sm:p-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 text-center">
            {items.map((item, i) => (
              <div
                key={item.label}
                className={`${
                  i < items.length - 1
                    ? "sm:border-r sm:border-border"
                    : ""
                }`}
              >
                <p className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  const { ref, visible } = useInView();

  return (
    <section ref={ref} className="px-6 py-16 sm:py-24">
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Monitor className="size-8 text-primary mx-auto mb-5" strokeWidth={1.5} />
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Ready to organize your inventory?
        </h2>
        <p className="text-muted-foreground text-sm mt-3 max-w-sm mx-auto">
          Sign in to start tracking assets, uploading receipts, and managing
          your team&rsquo;s equipment.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button size="lg" className="text-sm h-11 px-8">
              Open Dashboard
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="size-3.5 text-primary" strokeWidth={2.2} />
          <span className="font-heading font-medium text-muted-foreground">
            AssetTracker
          </span>
        </div>
        <p>Built with Next.js & Convex</p>
      </div>
    </footer>
  );
}
