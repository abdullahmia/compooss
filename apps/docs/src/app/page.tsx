"use client";

import { AnimatedSection } from "@/components/animated-section";
import { CodeBlock } from "@/components/code-block";
import { FeatureCard } from "@/components/feature-card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Container,
  Database,
  Eye,
  FileJson,
  Grid3X3,
  Layers,
  LayoutGrid,
  Minus,
  Plug2,
  Search,
  Shield,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Why Compooss", href: "#why-compooss" },
  { label: "Installation", href: "#installation" },
  { label: "Usage", href: "#usage" },
  { label: "Roadmap", href: "#roadmap" },
];

const FEATURES = [
  {
    icon: <Database size={20} />,
    title: "Database Management",
    description:
      "List, create, and drop MongoDB databases from a visual admin panel. Get real-time stats on document counts, storage size, and indexes at a glance.",
  },
  {
    icon: <Layers size={20} />,
    title: "Collection Explorer",
    description:
      "Navigate MongoDB collections with an expandable sidebar. Instantly view document count, storage size, index count, and average document size per collection.",
  },
  {
    icon: <Search size={20} />,
    title: "Query & Filter Documents",
    description:
      "Run MongoDB queries with native filter syntax. Sort, paginate, and explore documents without switching to the terminal or writing scripts.",
  },
  {
    icon: <Eye size={20} />,
    title: "Multiple View Modes",
    description:
      "Switch between list, JSON, and table views to inspect your MongoDB data. Choose the best format for your data exploration and debugging workflow.",
  },
  {
    icon: <FileJson size={20} />,
    title: "Full Document CRUD",
    description:
      "Create, read, update, and delete MongoDB documents with an intuitive Monaco-powered editor. Supports JSON validation and syntax highlighting.",
  },
  {
    icon: <Grid3X3 size={20} />,
    title: "Index Management",
    description:
      "Create, drop, hide, and inspect indexes with full support for unique, compound, text, geospatial, TTL, partial, and hashed indexes. View usage statistics at a glance.",
  },
  {
    icon: <LayoutGrid size={20} />,
    title: "Schema Analysis",
    description:
      "Analyze collection schema from sampled documents: view detected fields, type distribution, frequency, value distributions, nested and array structures, and missing or inconsistent fields. Refresh on demand.",
  },
  {
    icon: <Layers size={20} />,
    title: "Aggregation Pipelines",
    description:
      "Build MongoDB aggregation pipelines visually with stage templates, drag-and-drop stages, per-stage previews, text mode editing, saved pipelines, and view creation from pipelines.",
  },
  {
    icon: <Terminal size={20} />,
    title: "MongoDB Shell",
    description:
      "Run ad-hoc MongoDB commands from an embedded shell panel. Execute CRUD operations, aggregation pipelines, admin commands, and JavaScript scripts with autocomplete, syntax highlighting, and session persistence.",
  },
  {
    icon: <Plug2 size={20} />,
    title: "Multiple Connections",
    description:
      "Save, edit, and switch between MongoDB connection profiles from a dedicated connection page. Supports authentication (SCRAM, X.509, LDAP, Kerberos), TLS/SSL, color-coded profiles, favorites, and test-before-connect.",
  },
  {
    icon: <Shield size={20} />,
    title: "Built-In Safety Guards",
    description:
      "System databases (admin, local, config) are automatically read-only. Prevent accidental destructive operations on critical MongoDB data.",
  },
  {
    icon: <Container size={20} />,
    title: "Docker Native Deployment",
    description:
      "Ships as a lightweight Docker image you can add to any docker-compose.yml. One service definition, no external dependencies, instant setup.",
  },
  {
    icon: <Zap size={20} />,
    title: "Instant Startup",
    description:
      "Built on Next.js with standalone output for a minimal container footprint. Starts in seconds with zero configuration required.",
  },
  {
    icon: <LayoutGrid size={20} />,
    title: "Modern Developer UI",
    description:
      "Clean, dark-themed interface built with Tailwind CSS and shadcn/ui. Designed to feel native to modern development workflows.",
  },
];

// Subset of core product features to highlight in the main grid
const CORE_FEATURES = [
  FEATURES[0], // Database Management
  FEATURES[1], // Collection Explorer
  FEATURES[4], // Full Document CRUD
  FEATURES[8], // MongoDB Shell
  FEATURES[9], // Multiple Connections
  FEATURES[12], // Modern Developer UI
];

type ComparisonValue = "yes" | "no" | "partial" | string;

interface ComparisonRow {
  feature: string;
  compooss: ComparisonValue;
  compass: ComparisonValue;
  mongoExpress: ComparisonValue;
  studio3t: ComparisonValue;
}

const COMPARISON_TOOLS = [
  { name: "Compooss", highlight: true },
  { name: "MongoDB Compass", highlight: false },
  { name: "Mongo Express", highlight: false },
  { name: "Studio 3T", highlight: false },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Docker-native deployment",
    compooss: "yes",
    compass: "no",
    mongoExpress: "partial",
    studio3t: "no",
  },
  {
    feature: "Zero configuration",
    compooss: "yes",
    compass: "no",
    mongoExpress: "partial",
    studio3t: "no",
  },
  {
    feature: "Web-based (no install)",
    compooss: "yes",
    compass: "no",
    mongoExpress: "yes",
    studio3t: "no",
  },
  {
    feature: "Modern UI / Dark theme",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "yes",
  },
  {
    feature: "Document CRUD",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "yes",
    studio3t: "yes",
  },
  {
    feature: "Index management",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "yes",
  },
  {
    feature: "Schema analysis",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "yes",
  },
  {
    feature: "Aggregation pipeline builder",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "yes",
  },
  {
    feature: "Built-in MongoDB shell",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "partial",
  },
  {
    feature: "Query with MongoDB syntax",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "partial",
    studio3t: "yes",
  },
  {
    feature: "Free & open-source",
    compooss: "yes",
    compass: "partial",
    mongoExpress: "yes",
    studio3t: "no",
  },
  {
    feature: "No signup or cloud required",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "yes",
    studio3t: "no",
  },
  {
    feature: "Multiple connection profiles",
    compooss: "yes",
    compass: "yes",
    mongoExpress: "no",
    studio3t: "yes",
  },
  {
    feature: "System DB read-only protection",
    compooss: "yes",
    compass: "no",
    mongoExpress: "no",
    studio3t: "no",
  },
  {
    feature: "Single-container deployment",
    compooss: "yes",
    compass: "no",
    mongoExpress: "yes",
    studio3t: "no",
  },
];

const DOCKER_COMPOSE_CODE = `services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"

  compooss:
    image: abdullahmia/compooss:latest
    ports:
      - "3000:3000"
    depends_on:
      - mongo`;

const DOCKER_RUN_CODE = `# Run Compooss and connect via the /connect page
docker run -p 3000:3000 \\
  abdullahmia/compooss:latest`;

const USAGE_STEPS = [
  {
    step: "01",
    title: "Add to your Docker Compose file",
    description:
      "Drop the Compooss service into your existing docker-compose.yml alongside your MongoDB container. One service definition is all you need.",
  },
  {
    step: "02",
    title: "Connect from the UI",
    description:
      "Open the /connect page in Compooss, enter your MongoDB connection string, and save a connection profile. You can test the connection before using it.",
  },
  {
    step: "03",
    title: "Open and start exploring",
    description:
      "Navigate to localhost:3000 in your browser. Instantly browse databases, run queries, edit documents, and manage your MongoDB data through a visual interface.",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(39,39,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50"
      >
        <div className="border-b border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl backdrop-saturate-150">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            {/* Logo */}
            <a href="#" className="group flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Compooss logo"
                width={32}
                height={32}
                className="h-7 w-7 rounded-md object-cover"
              />
              <span className="text-[15px] font-bold tracking-tight text-white">
                Compooss
              </span>
            </a>

            {/* Center nav links */}
            <div className="hidden items-center md:flex">
              <div className="flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://hub.docker.com/r/abdullahmia/compooss"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:flex"
              >
                <Container size={15} />
                Docker Hub
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-32"
      >
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 30, -30, 0],
              scale: [1, 0.95, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-32 top-40 h-[400px] w-[400px] rounded-full bg-teal-500/[0.05] blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -20, 30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/[0.04] blur-[100px]"
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                v1.7.0 — Now with Multiple Connections
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl"
              >
                Open-Source MongoDB GUI for{" "}
                <span className="animate-gradient bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                  Docker Compose
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
              >
                A free, self-hosted MongoDB admin panel that runs as a single
                Docker container. Browse databases, query documents, manage
                indexes — no signup, no cloud, no config.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
              >
                <a
                  href="#installation"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Get Started
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="https://hub.docker.com/r/abdullahmia/compooss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-7 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white"
                >
                  <Container size={16} />
                  Docker Hub
                </a>
              </motion.div>

              {/* Quick install */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-zinc-800/60 bg-zinc-900/40 px-5 py-2.5 backdrop-blur"
              >
                <Terminal size={14} className="text-zinc-500" />
                <code className="font-mono text-sm text-zinc-300">
                  docker pull abdullahmia/compooss:latest
                </code>
                <ChevronRight size={14} className="text-zinc-600" />
              </motion.div>
            </div>

            {/* Hero Preview with 3D perspective */}
            <div className="hero-preview-wrapper relative mx-auto mt-20 max-w-5xl [perspective:2000px]">
              <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 2 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative [transform-style:preserve-3d]"
              >
                {/* Multi-layer glow */}
                <div className="animate-glow-pulse absolute -inset-8 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 blur-3xl" />
                <div className="animate-glow-pulse absolute -inset-2 rounded-3xl bg-gradient-to-b from-emerald-400/10 via-transparent to-transparent blur-2xl [animation-delay:1.5s]" />

                {/* Browser chrome */}
                <div className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-950 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.7),0_0_40px_-15px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center gap-2 border-b border-zinc-800/60 bg-zinc-900/80 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-green-500/70" />
                    <div className="ml-3 flex flex-1 items-center gap-2 rounded-md bg-zinc-800/50 px-3 py-1">
                      <ShieldCheck size={12} className="text-emerald-400/60" />
                      <span className="font-mono text-xs text-zinc-500">
                        localhost:3000 — Compooss
                      </span>
                    </div>
                  </div>
                  <Image
                    src="/preview.jpeg"
                    alt="Compooss MongoDB GUI screenshot — database browser, collection explorer, and document viewer running inside Docker"
                    width={1920}
                    height={1080}
                    className="w-full"
                    priority
                  />
                </div>

                {/* Floating feature badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="absolute -left-4 top-1/4 z-10 hidden lg:block"
                >
                  <div className="animate-float rounded-xl border border-zinc-700/50 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                        <Database size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          4 Databases
                        </p>
                        <p className="text-[10px] text-zinc-500">Connected</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -right-4 top-1/3 z-10 hidden lg:block"
                >
                  <div className="animate-float rounded-xl border border-zinc-700/50 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur-sm [animation-delay:2s]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                        <Zap size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          Zero Config
                        </p>
                        <p className="text-[10px] text-zinc-500">Just Docker</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute -bottom-3 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
                >
                  <div className="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/90 px-4 py-2 shadow-xl backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-medium text-zinc-300">
                      Open Source & Free Forever
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Reflection */}
              <div
                className="pointer-events-none mt-1 hidden overflow-hidden lg:block"
                style={{ height: "80px" }}
              >
                <div className="relative -scale-y-100 opacity-[0.08] blur-[2px]">
                  <div className="overflow-hidden rounded-2xl border border-zinc-700/50">
                    <Image
                      src="/preview.jpeg"
                      alt=""
                      width={1920}
                      height={1080}
                      className="w-full"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Installation */}
      <section
        id="installation"
        className="relative pt-10 pb-20 md:pt-14 md:pb-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Installation
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Install in seconds with Docker
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Add Compooss to your existing docker-compose.yml or run it as a
              standalone Docker container. No build steps, no dependencies, no
              configuration files needed.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <AnimatedSection>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                    <Code2 size={14} />
                  </div>
                  Docker Compose
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    Recommended
                  </span>
                </h3>
              </AnimatedSection>
              <CodeBlock
                code={DOCKER_COMPOSE_CODE}
                language="yaml"
                filename="docker-compose.yml"
              />
            </div>

            <div>
              <AnimatedSection>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                    <Terminal size={14} />
                  </div>
                  Docker Run
                </h3>
              </AnimatedSection>
              <CodeBlock
                code={DOCKER_RUN_CODE}
                language="bash"
                filename="terminal"
              />

              <AnimatedSection delay={0.2} className="mt-6">
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
                  <h4 className="mb-3 text-sm font-semibold text-zinc-200">
                    Environment Variables
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <code className="mt-0.5 shrink-0 rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-xs text-emerald-400">
                        PORT
                      </code>
                      <p className="text-sm text-zinc-400">
                        Port to run the server on. Defaults to{" "}
                        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
                          3000
                        </code>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Features
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              A complete MongoDB management
              <br />
              tool inside your Docker stack
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Compooss gives developers a fast, visual MongoDB client that fits
              into any Docker Compose workflow — no desktop apps, no cloud
              services, no complex setup.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} index={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Compooss */}
      <section id="why-compooss" className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Why Compooss
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              The MongoDB GUI that fits
              <br />
              your development workflow
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Most MongoDB GUIs are desktop apps that need installation,
              configuration, and often a paid license. Compooss is the only one
              purpose-built for Docker Compose — the way modern developers
              actually work.
            </p>
          </AnimatedSection>

          {/* Comparison table */}
          <AnimatedSection>
            <div className="overflow-hidden rounded-2xl border border-zinc-800/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                      <th className="px-6 py-4 text-sm font-semibold text-zinc-300">
                        Feature
                      </th>
                      {COMPARISON_TOOLS.map((tool) => (
                        <th
                          key={tool.name}
                          className={`px-6 py-4 text-center text-sm font-semibold ${
                            tool.highlight
                              ? "bg-emerald-500/5 text-emerald-400"
                              : "text-zinc-400"
                          }`}
                        >
                          {tool.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-zinc-800/40 transition-colors hover:bg-zinc-900/40 ${
                          i === COMPARISON_ROWS.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="px-6 py-3.5 text-sm text-zinc-300">
                          {row.feature}
                        </td>
                        {(
                          [
                            row.compooss,
                            row.compass,
                            row.mongoExpress,
                            row.studio3t,
                          ] as ComparisonValue[]
                        ).map((value, colIdx) => (
                          <td
                            key={colIdx}
                            className={`px-6 py-3.5 text-center ${
                              colIdx === 0 ? "bg-emerald-500/[0.03]" : ""
                            }`}
                          >
                            {value === "yes" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                                <Check size={14} className="text-emerald-400" />
                              </span>
                            ) : value === "no" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800/50">
                                <X size={14} className="text-zinc-600" />
                              </span>
                            ) : value === "partial" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10">
                                <Minus
                                  size={14}
                                  className="text-yellow-500/60"
                                />
                              </span>
                            ) : (
                              <span className="text-sm text-zinc-400">
                                {value}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-6 border-t border-zinc-800/40 bg-zinc-900/30 px-6 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check size={10} className="text-emerald-400" />
                  </span>
                  <span className="text-xs text-zinc-500">Full support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500/10">
                    <Minus size={10} className="text-yellow-500/60" />
                  </span>
                  <span className="text-xs text-zinc-500">
                    Partial / limited
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800/50">
                    <X size={10} className="text-zinc-600" />
                  </span>
                  <span className="text-xs text-zinc-500">Not supported</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Bottom callout */}
          <AnimatedSection delay={0.2} className="mt-10">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-6 md:p-8">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    Designed for developers, not database admins
                  </h3>
                  <p className="mt-1 max-w-xl text-sm text-zinc-400">
                    Compooss gives you exactly the features you need during
                    development — browse data, debug queries, inspect schemas —
                    without the complexity of enterprise-grade tools you&apos;ll
                    never use locally.
                  </p>
                </div>
                <a
                  href="#installation"
                  className="group flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Get Started
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Usage / How it works */}
      <section id="usage" className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              From zero to MongoDB GUI in three steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              No signup, no cloud dependency, no configuration wizards. Compooss
              connects directly to your MongoDB instance over your Docker
              network.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            {USAGE_STEPS.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <div className="group relative h-full rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 transition-colors hover:border-emerald-500/20">
                  <span className="font-mono text-4xl font-bold text-emerald-500/15 transition-colors group-hover:text-emerald-500/25">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Capabilities list */}
          <AnimatedSection delay={0.3} className="mt-16">
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-8 md:p-10">
              <h3 className="mb-6 text-xl font-bold text-zinc-100">
                MongoDB operations you can perform
              </h3>
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Browse all databases & collections",
                  "Create and drop databases",
                  "Create and drop collections",
                  "Query with MongoDB filter syntax",
                  "Sort and paginate results",
                  "View as list, JSON, or table",
                  "Add new documents",
                  "Edit documents inline",
                  "Delete documents safely",
                  "View collection stats",
                  "Create and drop indexes",
                  "Hide / unhide indexes",
                  "View index usage statistics",
                  "Analyze collection schema from samples",
                  "View field types, frequency & value distributions",
                  "Inspect nested fields and array structures",
                  "Masked connection strings",
                  "System DB read-only protection",
                  "Build aggregation pipelines with stage templates",
                  "Reorder, enable, and disable aggregation stages",
                  "Preview results for individual aggregation stages",
                  "Save and reload aggregation pipelines per collection",
                  "Export aggregation JSON and backend-ready code",
                  "Create MongoDB views directly from aggregation pipelines",
                  "Run ad-hoc MongoDB shell commands in the browser",
                  "Execute JavaScript queries with autocomplete",
                  "Navigate command history and persist shell sessions",
                  "Run CRUD, aggregation, and admin commands from the shell",
                  "Access bulk operations and system collections",
                  "Switch databases with 'use' and run server status commands",
                  "Save and manage multiple connection profiles",
                  "Test connections before saving",
                  "Color-code and label connections for quick identification",
                  "Switch between MongoDB deployments from the top bar",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Roadmap
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              What&apos;s coming next
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Compooss is actively maintained. Here&apos;s what we&apos;re
              building next.
            </p>
          </AnimatedSection>

          {/* Timeline roadmap */}
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-transparent md:left-1/2 md:-translate-x-px" />

            {[
              {
                icon: <LayoutGrid size={18} />,
                title: "Theming Support",
                description:
                  "System-aware theming with dedicated dark and light modes, matching your OS preference automatically.",
                status: "In Progress",
                statusColor: "emerald",
              },
              {
                icon: <Code2 size={18} />,
                title: "Data Export & Import",
                description:
                  "Export collections to JSON or CSV and import data from files directly through the UI.",
                status: "Planned",
                statusColor: "zinc",
              },
              {
                icon: <Eye size={18} />,
                title: "Database Monitoring",
                description:
                  "Live dashboard with real-time server metrics, operation counters, connection pool status, and slow query tracking.",
                status: "Planned",
                statusColor: "zinc",
              },
              {
                icon: <Layers size={18} />,
                title: "Diagram Generation",
                description:
                  "Visualize collection relationships and schema structures as interactive diagrams directly from your database.",
                status: "Planned",
                statusColor: "zinc",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div
                  className={`relative mb-10 flex items-start gap-6 last:mb-0 md:gap-10 ${
                    i % 2 === 0
                      ? "md:flex-row-reverse md:text-right"
                      : "md:flex-row"
                  }`}
                >
                  {/* Dot on the line */}
                  <div className="absolute left-6 top-3 z-10 md:left-1/2">
                    <div className="flex h-3 w-3 -translate-x-1/2 items-center justify-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          item.statusColor === "emerald"
                            ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.4)]"
                            : "border-2 border-zinc-600 bg-zinc-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Spacer for left side on mobile */}
                  <div className="w-12 shrink-0 md:hidden" />

                  {/* Content card */}
                  <div
                    className={`group flex-1 md:w-[calc(50%-2.5rem)] ${
                      i % 2 === 0 ? "md:pr-10" : "md:pl-10"
                    }`}
                  >
                    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 transition-all hover:border-emerald-500/20 hover:bg-zinc-900/80">
                      <div
                        className={`mb-3 flex items-center gap-3 ${
                          i % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[15px] font-semibold text-zinc-100">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p
                        className={`text-sm leading-relaxed text-zinc-400 ${
                          i % 2 === 0 ? "" : ""
                        }`}
                      >
                        {item.description}
                      </p>
                      <div
                        className={`mt-3 flex ${
                          i % 2 === 0 ? "md:justify-end" : ""
                        }`}
                      >
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.statusColor === "emerald"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {item.statusColor === "emerald" && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                          )}
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for opposite side */}
                  <div className="hidden flex-1 md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {/* Brand column */}
            <div>
              <a href="#" className="inline-flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="Compooss logo"
                  width={32}
                  height={32}
                  className="h-7 w-7 rounded-md object-cover"
                />
                <span className="text-[15px] font-bold tracking-tight text-white">
                  Compooss
                </span>
              </a>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                A free, open-source MongoDB GUI that runs as a single Docker
                container. MIT licensed.
              </p>
            </div>

            {/* Product column */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Product
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Installation", href: "#installation" },
                  { label: "Roadmap", href: "#roadmap" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources column */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Resources
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://hub.docker.com/r/abdullahmia/compooss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    Docker Hub
                    <ArrowRight size={11} className="text-zinc-600" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Get started column */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Quick Start
              </h4>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <code className="block font-mono text-xs leading-relaxed text-zinc-400">
                  <span className="text-emerald-400/70">$</span> docker pull
                  <br />
                  <span className="pl-3 text-zinc-300">
                    abdullahmia/compooss
                  </span>
                </code>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} Compooss. Free and open-source
              under MIT License.
            </p>
            <p className="text-xs text-zinc-700">
              Not affiliated with MongoDB, Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
