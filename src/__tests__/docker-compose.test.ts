import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("docker-compose wiring", () => {
  const composePath = path.join(process.cwd(), "docker-compose.yml");
  const contents = fs.readFileSync(composePath, "utf-8");

  it("defines both mongo and compooss services", () => {
    expect(contents).toMatch(/services:/);
    expect(contents).toMatch(/\bmongo:/);
    expect(contents).toMatch(/\bcompooss:/);
  });

  it("configures MONGO_URI via environment variables", () => {
    expect(contents).toMatch(/MONGO_URI=/);
  });

  it("exposes the compooss HTTP port", () => {
    expect(contents).toMatch(/8080:3000/);
  });
});

