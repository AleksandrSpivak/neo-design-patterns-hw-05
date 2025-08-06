import { ReportAdapter } from "./ReportAdapter";
import { JsonReportAdapter } from "./JsonReportAdapter";
import { CsvReportAdapter } from "./CsvReportAdapter";
import { XmlReportAdapter } from "./XmlReportAdapter";
import { AnalyzerFacade } from "./AnalyzerFacade";
import * as fs from "fs";
import * as path from "path";

export class ReportManager {
  private static readonly REPORTS_DIR = "reports";
  private adapter: ReportAdapter;
  private fileExtension: string;
  private facade: AnalyzerFacade;

  constructor(format: string = "json") {
    [this.adapter, this.fileExtension] = this.getAdapter(format);
    this.facade = new AnalyzerFacade(this.adapter);
  }

  generateReport(targetPath: string): void {
    try {
      // Перевіряємо, чи існує цільова директорія
      if (!fs.existsSync(targetPath)) {
        console.error(`Error: Directory "${targetPath}" does not exist.`);
        return;
      }

      // Перевіряємо, чи це справді директорія
      const stats = fs.statSync(targetPath);
      if (!stats.isDirectory()) {
        console.error(`Error: "${targetPath}" is not a directory.`);
        return;
      }

      // Переконуємося, що директорія reports існує
      this.ensureReportsDirectory();

      // Викликаємо генерацію звіту через фасад
      const reportContent = this.facade.generateReport(targetPath);

      // Зберігаємо звіт у файл з ім'ям, що містить часову мітку
      const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
      const fileName = `report-${timestamp}.${this.fileExtension}`;
      const filePath = path.join(ReportManager.REPORTS_DIR, fileName);

      fs.writeFileSync(filePath, reportContent, "utf8");

      // Повідомляємо про успіх у консоль
      console.log(`Report generated successfully: ${filePath}`);

    } catch (error) {
      // Обробляємо можливі помилки та повідомляємо про них користувача
      console.error(`Error generating report: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private ensureReportsDirectory(): void {
    try {
      if (!fs.existsSync(ReportManager.REPORTS_DIR)) {
        fs.mkdirSync(ReportManager.REPORTS_DIR, { recursive: true });
      }
    } catch (error) {
      throw new Error(`Failed to create reports directory: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private getAdapter(format: string): [ReportAdapter, string] {
    const normalizedFormat = format.toLowerCase();
    
    switch (normalizedFormat) {
      case "json":
        return [new JsonReportAdapter(), "json"];
      case "csv":
        return [new CsvReportAdapter(), "csv"];
      case "xml":
        return [new XmlReportAdapter(), "xml"];
      default:
        console.error(`Error: Unsupported format "${format}". Using JSON as default. Supported formats: json, csv, xml`);
        return [new JsonReportAdapter(), "json"];
    }
  }
}
