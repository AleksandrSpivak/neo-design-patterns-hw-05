import { ReportAdapter } from './ReportAdapter';
import { DirectoryReport } from './DirectoryReport';

export class CsvReportAdapter implements ReportAdapter {
    export(report: DirectoryReport): string {
        const lines: string[] = [];
        
        // Основна статистика
        lines.push("Metric,Value");
        lines.push(`Total Files,${report.files}`);
        lines.push(`Total Directories,${report.directories}`);
        lines.push(`Total Size (bytes),${report.totalSize}`);
        lines.push(""); // Порожній рядок для розділення
        
        // Статистика розширень
        lines.push("Extension,Count");
        
        // Сортуємо розширення за кількістю (спадання)
        const sortedExtensions = Object.entries(report.extensions)
            .sort(([,a], [,b]) => b - a);
        
        for (const [extension, count] of sortedExtensions) {
            lines.push(`"${extension}",${count}`);
        }
        
        return lines.join("\n");
    }
}
