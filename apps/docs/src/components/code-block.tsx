"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "yaml", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950"
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-500">
              {filename}
            </span>
          </div>
          <span className="font-mono text-xs text-zinc-600">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
          <code className="text-zinc-300">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/80 text-zinc-400 opacity-0 backdrop-blur transition-all hover:border-zinc-600 hover:text-zinc-200 group-hover:opacity-100"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </motion.div>
  );
}
