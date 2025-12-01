import * as fs from "fs/promises";
import * as path from "path";

export class JSONFileHandler {
  constructor(private readonly filePath: string) {}

  async read(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async write(data: any[]): Promise<void> {
    const dir = path.dirname(this.filePath);

    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

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
}
