import * as fs from 'fs';
import * as path from 'path';
import { DirectoryReport } from './DirectoryReport';

export class DirectoryAnalyzer {
    analyze(dirPath: string): DirectoryReport {
        const report: DirectoryReport = {
            files: 0,
            directories: 0,
            totalSize: 0,
            extensions: {}
        };

        this.analyzeDirectory(dirPath, report);
        return report;
    }

    private analyzeDirectory(dirPath: string, report: DirectoryReport): void {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    report.directories++;
                    this.analyzeDirectory(fullPath, report);
                } else if (entry.isFile()) {
                    report.files++;
                    
                    // Отримуємо розмір файлу
                    try {
                        const stats = fs.statSync(fullPath);
                        report.totalSize += stats.size;
                    } catch (error) {
                        // Ігноруємо помилки отримання розміру файлу
                    }

                    // Отримуємо розширення файлу
                    const extension = path.extname(entry.name);
                    const extensionKey = extension || "(no extension)";
                    report.extensions[extensionKey] = (report.extensions[extensionKey] || 0) + 1;
                }
            }
        } catch (error) {
            // Ігноруємо помилки читання директорії (немає доступу тощо)
            console.warn(`Warning: Cannot access directory ${dirPath}`);
        }
    }
}
