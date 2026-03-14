import nextConfig from "eslint-config-next";
import nextTypescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [...nextConfig, ...nextTypescriptConfig];

export default eslintConfig;
