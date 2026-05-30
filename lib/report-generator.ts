import { jsPDF } from 'jspdf';
import { AssessmentResult } from '@/lib/scoring';

export async function generatePDFReport(result: AssessmentResult, organizationName: string = 'Your Organization') {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const margin = 20;
    let y = 30;

    // Header - AIC Logo (Simulated)
    doc.setFont('serif', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(26, 26, 26);
    doc.text('AIC.', margin, y);
    
    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(212, 175, 55); // AIC Gold
    doc.text('AI INTEGRITY CERTIFICATION', margin, y + 6);

    y += 25;

    // Title
    doc.setFont('serif', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text('Integrity Score Assessment', margin, y);
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont('serif', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text(`Prepared for: ${organizationName}`, margin, y);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y + 6);

    y += 20;

    // Integrity Score Box
    doc.setFillColor(250, 248, 244); // Paper color
    doc.rect(margin, y, 170, 40, 'F');
    doc.setDrawColor(224, 224, 224);
    doc.rect(margin, y, 170, 40, 'S');

    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(150, 150, 150);
    doc.text('OVERALL INTEGRITY SCORE', margin + 10, y + 12);

    doc.setFontSize(48);
    doc.setFont('mono', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`${result.integrityScore}/100`, margin + 10, y + 30);

    y += 55;

    // Tier Recommendation
    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(150, 150, 150);
    doc.text('RECOMMENDED CLASSIFICATION', margin, y);

    y += 8;
    doc.setFontSize(18);
    doc.setFont('serif', 'bold');
    
    if (result.tier.name === 'Tier 1') doc.setTextColor(196, 30, 58); // AIC Red
    else if (result.tier.name === 'Tier 2') doc.setTextColor(255, 140, 66); // AIC Orange
    else doc.setTextColor(44, 95, 45); // AIC Green
    
    doc.text(`${result.tier.name}: ${result.tier.title}`, margin, y);

    y += 8;
    doc.setFontSize(11);
    doc.setFont('serif', 'normal');
    doc.setTextColor(26, 26, 26);
    const splitDesc = doc.splitTextToSize(result.tier.desc, 170);
    doc.text(splitDesc, margin, y);

    y += (splitDesc.length * 6) + 10;

    // Category Breakdown
    doc.setFontSize(14);
    doc.setFont('serif', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text('Category Breakdown', margin, y);

    y += 10;
    Object.values(result.categoryScores).forEach(cat => {
        doc.setFontSize(10);
        doc.setFont('mono', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text(cat.name, margin, y);
        
        doc.setFont('mono', 'normal');
        doc.text(`${cat.score}%`, 180, y, { align: 'right' });

        // Simple progress bar
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y + 2, 180, y + 2);
        doc.setDrawColor(26, 26, 26);
        doc.setLineWidth(1);
        doc.line(margin, y + 2, margin + (160 * (cat.score / 100)), y + 2);
        
        y += 12;
    });

    y += 10;

    // Next Steps
    doc.setFontSize(14);
    doc.setFont('serif', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text('Strategic Next Steps', margin, y);

    y += 8;
    doc.setFontSize(11);
    doc.setFont('serif', 'normal');
    const steps = [
        '1. Finalize POPIA Section 71 Human Oversight Policy.',
        '2. Conduct technical bias auditing on high-stakes systems.',
        '3. Implement immutable audit logging for automated decisions.',
        '4. Schedule your full AIC Certification Audit.'
    ];

    steps.forEach(step => {
        doc.text(step, margin, y);
        y += 7;
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('mono', 'normal');
    doc.setTextColor(150, 150, 150);
    const footerY = 280;
    doc.line(margin, footerY - 5, 190, footerY - 5);
    doc.text('AI INTEGRITY CERTIFICATION (AIC) | POPIA SECTION 71 COMPLIANCE FRAMEWORK', margin, footerY);
    doc.text('hello@aicert.co.za | www.aicert.co.za | Rosebank, Johannesburg', margin, footerY + 4);

    // Download the PDF
    doc.save(`AIC-Integrity-Report-${organizationName.replace(/\s+/g, '-')}.pdf`);
}
