"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Database,
  Search,
  Table,
  Shield,
  Container,
  Terminal,
  Layers,
  Zap,
  Eye,
  Code2,
  ChevronRight,
  Github,
  ArrowRight,
  Check,
  FileJson,
  LayoutGrid,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { FeatureCard } from "@/components/feature-card";
import { CodeBlock } from "@/components/code-block";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
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

const DOCKER_COMPOSE_CODE = `services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"

  compooss:
    image: abdullahmia/compooss:latest
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017
    depends_on:
      - mongo`;

const DOCKER_RUN_CODE = `# Connect to MongoDB running on your host machine
docker run -p 3000:3000 \\
  -e MONGO_URI=mongodb://host.docker.internal:27017 \\
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
    title: "Configure your MongoDB connection",
    description:
      "Set the MONGO_URI environment variable to point to your MongoDB instance. Works with any standard MongoDB connection string, including replica sets and authentication.",
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
        className="sticky top-0 z-50 border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
              <Database size={16} className="text-emerald-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Compooss
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/abdullahmia/compooss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
          >
            <Github size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pb-20 pt-20 md:pt-32">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                v1.1.0 — Now with improved loading states
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
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
                Compooss is a free, self-hosted MongoDB admin panel that runs as
                a single Docker container. Browse databases, query documents,
                manage collections, and explore your data — no signup, no cloud,
                no configuration files.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
              >
                <a
                  href="#installation"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Get Started
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="https://github.com/abdullahmia/compooss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white"
                >
                  <Github size={16} />
                  View on GitHub
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

            {/* Hero Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto mt-16 max-w-5xl"
            >
              <div className="animate-glow-pulse absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 border-b border-zinc-800/60 bg-zinc-900/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 font-mono text-xs text-zinc-500">
                    Compooss — mongodb://localhost:27017
                  </span>
                </div>
                <Image
                  src="/preview.png"
                  alt="Compooss MongoDB GUI screenshot — database browser, collection explorer, and document viewer running inside Docker"
                  width={1920}
                  height={1080}
                  className="w-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 md:py-32">
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
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} index={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section id="installation" className="relative pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-16 text-center">
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
                        MONGO_URI
                      </code>
                      <p className="text-sm text-zinc-400">
                        MongoDB connection string. Also supports{" "}
                        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
                          MONGODB_URI
                        </code>{" "}
                        as an alias.
                      </p>
                    </div>
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

      {/* Usage / How it works */}
      <section id="usage" className="relative py-24 md:py-32">
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
                  "Masked connection strings",
                  "System DB read-only protection",
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
      <section id="roadmap" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Roadmap
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              What&apos;s coming next
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Compooss is actively maintained and growing. Upcoming features
              will make it the most capable self-hosted MongoDB GUI for
              Docker-based development.
            </p>
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Layers size={20} />,
                title: "Aggregations",
                description:
                  "Visual pipeline builder and runner for complex aggregation queries.",
              },
              {
                icon: <Table size={20} />,
                title: "Schema Analysis",
                description:
                  "Explore and validate your collection schemas with visual tools.",
              },
              {
                icon: <Zap size={20} />,
                title: "Index Management",
                description:
                  "View, create, and manage collection indexes for optimal performance.",
              },
              {
                icon: <Shield size={20} />,
                title: "Validation Rules",
                description:
                  "Define and manage document validation rules with a visual editor.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/50 text-zinc-500">
                  {item.icon}
                </div>
                <h3 className="mb-1 text-base font-semibold text-zinc-300">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500">{item.description}</p>
                <div className="mt-3 inline-flex rounded-full bg-zinc-800/50 px-2.5 py-0.5 text-xs text-zinc-500">
                  Coming soon
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-900 p-10 text-center md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                  Ready to manage your MongoDB data?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                  Add one service to your docker-compose.yml and get a
                  full-featured, open-source MongoDB GUI running in seconds.
                  Free forever, MIT licensed.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="#installation"
                    className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    Get Started Now
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                  <a
                    href="https://hub.docker.com/r/abdullahmia/compooss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
                  >
                    <Container size={16} />
                    Docker Hub
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/40 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                <Database size={14} className="text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-300">
                Compooss
              </span>
            </div>
            <p className="text-sm text-zinc-600">
              Free and open-source MongoDB GUI — MIT License.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/abdullahmia/compooss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                GitHub
              </a>
              <a
                href="https://hub.docker.com/r/abdullahmia/compooss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Docker Hub
              </a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-zinc-700">
            Compooss is an open-source MongoDB database management GUI for
            Docker. Not affiliated with MongoDB, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
