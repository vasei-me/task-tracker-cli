export interface ExportOptions {
  format: "json" | "csv" | "markdown" | "table";
  outputPath?: string;
  includeHeader?: boolean;
}

export interface ImportOptions {
  format: "json" | "csv";
  filePath: string;
  merge?: boolean;
}

export interface ReportOptions {
  type: "weekly" | "monthly" | "productivity";
  startDate?: Date;
  endDate?: Date;
  output?: "console" | "file";
}
