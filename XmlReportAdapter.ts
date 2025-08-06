import { ReportAdapter } from './ReportAdapter';
import { DirectoryReport } from './DirectoryReport';

export class XmlReportAdapter implements ReportAdapter {
    export(report: DirectoryReport): string {
        const lines: string[] = [];
        
        lines.push('<?xml version="1.0" encoding="UTF-8"?>');
        lines.push('<report>');
        lines.push(`  <files>${report.files}</files>`);
        lines.push(`  <directories>${report.directories}</directories>`);
        lines.push(`  <totalSize>${report.totalSize}</totalSize>`);
        lines.push('  <extensions>');
        
        // Сортуємо розширення за кількістю (спадання)
        const sortedExtensions = Object.entries(report.extensions)
            .sort(([,a], [,b]) => b - a);
        
        for (const [extension, count] of sortedExtensions) {
            // Екрануємо спеціальні символи XML
            const escapedExtension = this.escapeXml(extension);
            lines.push(`    <extension name="${escapedExtension}" count="${count}"/>`);
        }
        
        lines.push('  </extensions>');
        lines.push('</report>');
        
        return lines.join('\n');
    }
    
    private escapeXml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}
