import nextConfig from "eslint-config-next";
import nextTypescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [...nextConfig, ...nextTypescriptConfig, {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    // Use @/lib/logger instead of console directly.
    // The logger/logger.client.ts file is the sole exception (it wraps console internally).
    "no-console": "error",
  },
}, {
  files: ["src/lib/logger/logger.client.ts"],
  rules: {
    "no-console": "off",
  },
}];

export default eslintConfig;
