"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Database, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(39,39,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />

      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.07] blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 top-1/2 h-[350px] w-[350px] rounded-full bg-teal-500/[0.05] blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 inline-flex items-center gap-2.5"
        >
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
        </motion.a>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-6"
        >
          <span className="animate-gradient bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-[120px] font-extrabold leading-none tracking-tighter text-transparent md:text-[160px]">
            404
          </span>
          {/* Glow behind the number */}
          <div className="animate-glow-pulse absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-32 w-64 rounded-full bg-emerald-500/20 blur-[80px]" />
          </div>
        </motion.div>

        {/* Terminal-style message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/60 px-5 py-3 backdrop-blur"
        >
          <Terminal size={14} className="shrink-0 text-emerald-400/60" />
          <code className="font-mono text-sm text-zinc-400">
            <span className="text-emerald-400/70">db</span>.pages.
            <span className="text-zinc-300">findOne</span>(&#123; path &#125;)
            <span className="ml-2 text-zinc-600">// null</span>
          </code>
        </motion.div>

        {/* Heading & description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Document not found
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist in this
            collection. It may have been moved or deleted.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <a
            href="/"
            className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Home
          </a>
          <a
            href="/#features"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white"
          >
            <Database size={14} />
            Explore Features
          </a>
        </motion.div>

        {/* Floating decorative badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pointer-events-none mt-16 flex items-center justify-center gap-4"
        >
          {["admin", "local", "config"].map((db, i) => (
            <motion.div
              key={db}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
              className="rounded-lg border border-zinc-800/40 bg-zinc-900/50 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="font-mono text-xs text-zinc-600">{db}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
