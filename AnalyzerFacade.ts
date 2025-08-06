import { DirectoryAnalyzer } from './DirectoryAnalyzer';
import { ReportAdapter } from './ReportAdapter';

export class AnalyzerFacade {
    private analyzer: DirectoryAnalyzer;
    private adapter: ReportAdapter;

    constructor(adapter: ReportAdapter) {
        this.analyzer = new DirectoryAnalyzer();
        this.adapter = adapter;
    }

    generateReport(path: string): string {
        // 1. Аналіз директорії за допомогою DirectoryAnalyzer.analyze()
        const report = this.analyzer.analyze(path);
        
        // 2. Передача результату адаптеру для перетворення у потрібний формат
        const formattedReport = this.adapter.export(report);
        
        // 3. Повернення рядка, який містить сформований звіт
        return formattedReport;
    }
}
