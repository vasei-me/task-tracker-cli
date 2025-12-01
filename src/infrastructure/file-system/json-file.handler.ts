import * as fs from "fs/promises";
import * as path from "path";

export class JSONFileHandler {
  constructor(private readonly filePath: string) {}

  async read(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // Create directory if doesn't exist
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  async write(data: any[]): Promise<void> {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(this.filePath, jsonData, "utf-8");
  }

  async fileExists(): Promise<boolean> {
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }

  async backup(): Promise<void> {
    const backupPath = `${this.filePath}.backup`;
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      await fs.writeFile(backupPath, data, "utf-8");
    } catch (error) {
      // Silently fail for backup
    }
  }
}
