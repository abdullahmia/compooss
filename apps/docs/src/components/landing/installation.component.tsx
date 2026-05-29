"use client";

import { AnimatedSection } from "@/components/animated-section";
import { CodeBlock } from "@/components/code-block";
import {
  DOCKER_COMPOSE_CODE,
  DOCKER_RUN_CODE,
} from "@/lib/constants/landing.constants";
import { Code2, Container, ShieldCheck, Terminal, Zap } from "lucide-react";
import { useState } from "react";

export const Installation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"compose" | "run">("compose");

  return (
    <section id="installation" className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6">
        <AnimatedSection className="mb-14 text-center">
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

        <AnimatedSection delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/50 shadow-2xl shadow-black/40 backdrop-blur-sm">
            {/* Tab bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-950/60 px-4 py-3">
              <div className="flex items-center gap-1 rounded-lg bg-zinc-800/50 p-1">
                <button
                  onClick={() => setActiveTab("compose")}
                  className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "compose"
                      ? "bg-zinc-700 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Code2 size={12} />
                  Docker Compose
                  {activeTab === "compose" && (
                    <span className="ml-0.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Recommended
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("run")}
                  className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "run"
                      ? "bg-zinc-700 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Terminal size={12} />
                  Docker Run
                </button>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs text-zinc-600">Image:</span>
                <code className="rounded-md border border-zinc-700/50 bg-zinc-800/60 px-2.5 py-1 font-mono text-xs text-zinc-300">
                  abdullahmia/compooss:latest
                </code>
              </div>
            </div>

            {/* Code area */}
            <div className="p-5">
              {activeTab === "compose" ? (
                <CodeBlock
                  code={DOCKER_COMPOSE_CODE}
                  language="yaml"
                  filename="docker-compose.yml"
                />
              ) : (
                <CodeBlock
                  code={DOCKER_RUN_CODE}
                  language="bash"
                  filename="terminal"
                />
              )}
            </div>

            {/* Env vars footer */}
            <div className="border-t border-white/[0.06] bg-zinc-950/40 px-5 py-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                Environment Variables
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3.5 py-2.5">
                  <code className="font-mono text-xs font-semibold text-emerald-400">
                    PORT
                  </code>
                  <span className="text-zinc-700">—</span>
                  <span className="text-xs text-zinc-400">
                    Server port.{" "}
                    <code className="font-mono text-zinc-300">
                      Default: 3000
                    </code>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Trust signals */}
        <AnimatedSection delay={0.2} className="mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: <Zap size={14} />, label: "Zero config" },
              { icon: <ShieldCheck size={14} />, label: "MIT Licensed" },
              { icon: <Container size={14} />, label: "Single container" },
              { icon: <Code2 size={14} />, label: "No signup required" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-zinc-900/30 px-4 py-3 text-sm text-zinc-400"
              >
                <span className="text-emerald-400">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
