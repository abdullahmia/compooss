import fs from "fs/promises";
import path from "path";
import { Connection } from "../types";

export class ConnectionStore {
  private file: string;
  private isWriting = false;
  private writeQueue: Array<() => void> = [];

  constructor(filePath?: string) {
    this.file =
      filePath ?? path.join(process.cwd(), "data", "connections.json");
  }

  private async acquireLock(): Promise<void> {
    if (!this.isWriting) {
      this.isWriting = true;
      return;
    }

    await new Promise<void>((resolve) => this.writeQueue.push(resolve));
  }

  private releaseLock(): void {
    const next = this.writeQueue.shift();
    if (next) next();
    else this.isWriting = false;
  }

  private async ensureFile(): Promise<void> {
    const dir = path.dirname(this.file);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(this.file);
    } catch {
      await fs.writeFile(this.file, "[]", "utf-8");
    }
  }

  async readAll(): Promise<Connection[]> {
    await this.ensureFile();

    const raw = await fs.readFile(this.file, "utf-8");

    try {
      return JSON.parse(raw) as Connection[];
    } catch {
      return [];
    }
  }

  async findById(id: string): Promise<Connection | null> {
    const all = await this.readAll();
    return all.find((c) => c.id === id) ?? null;
  }

  async save(conn: Connection): Promise<void> {
    await this.acquireLock();

    try {
      const all = await this.readAll();
      const rest = all.filter((c) => c.id !== conn.id);

      await fs.writeFile(
        this.file,
        JSON.stringify([...rest, conn], null, 2),
        "utf-8",
      );
    } finally {
      this.releaseLock();
    }
  }

  async touch(id: string): Promise<void> {
    await this.acquireLock();

    try {
      const all = await this.readAll();

      const updated = all.map((c) =>
        c.id === id ? { ...c, lastUsedAt: new Date().toISOString() } : c,
      );

      await fs.writeFile(this.file, JSON.stringify(updated, null, 2), "utf-8");
    } finally {
      this.releaseLock();
    }
  }

  async delete(id: string): Promise<void> {
    await this.acquireLock();

    try {
      const all = await this.readAll();
      const filtered = all.filter((c) => c.id !== id);

      await fs.writeFile(this.file, JSON.stringify(filtered, null, 2), "utf-8");
    } finally {
      this.releaseLock();
    }
  }
}

export const connectionStore = new ConnectionStore();
