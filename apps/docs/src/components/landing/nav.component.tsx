"use client";

import { NAV_LINKS } from "@/lib/constants/landing.constants";
import { motion } from "framer-motion";
import { Container, Github } from "lucide-react";
import Image from "next/image";

export const Nav: React.FC = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50"
    >
      <div className="border-b border-white/[0.06] bg-zinc-950/50 backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
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

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/abdullahmia/compooss"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:flex"
            >
              <Github size={15} />
              GitHub
            </a>
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
  );
};
