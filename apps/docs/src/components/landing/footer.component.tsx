"use client";

import { ArrowRight, Container, Github } from "lucide-react";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
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

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/abdullahmia/compooss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                >
                  GitHub
                  <ArrowRight size={11} className="text-zinc-600" />
                </a>
              </li>
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

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Compooss. Free and open-source
            under MIT License.
          </p>
          <p className="text-xs text-zinc-600">
            Built by{" "}
            <a
              href="https://abdullah.iam.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Abdullah Mia
            </a>
          </p>
          <p className="text-xs text-zinc-700">
            Not affiliated with MongoDB, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
