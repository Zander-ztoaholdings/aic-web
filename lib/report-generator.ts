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
    doc.text('AIC Aware — Self-Declared Integrity Snapshot', margin, y, { maxWidth: 170 });

    y += 14;
    doc.setFontSize(12);
    doc.setFont('serif', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text(`Prepared for: ${organizationName}`, margin, y);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y + 6);

    y += 16;

    // Not-verified disclaimer — this document is the output of a free,
    // anonymous, self-declared tool. It must never read like an audit
    // finding, because it isn't one: AIC Assessed and AIC Certified are
    // separate, verified statuses reached only through an independent audit.
    doc.setFillColor(252, 248, 235);
    doc.setDrawColor(224, 224, 224);
    doc.rect(margin, y, 170, 16, 'FD');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(
        'This is a self-declared result, not independently verified. It does not carry AIC Assessed or\nAIC Certified status and is not listed on the AIC public registry.',
        margin + 4,
        y + 6.5
    );

    y += 26;

    // Integrity Score Box
    doc.setFillColor(250, 248, 244); // Paper color
    doc.rect(margin, y, 170, 40, 'F');
    doc.setDrawColor(224, 224, 224);
    doc.rect(margin, y, 170, 40, 'S');

    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(150, 150, 150);
    doc.text('SELF-DECLARED INTEGRITY SCORE', margin + 10, y + 12);

    doc.setFontSize(48);
    doc.setFont('mono', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`${result.integrityScore}/100`, margin + 10, y + 30);

    y += 55;

    // Tier Recommendation
    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(150, 150, 150);
    doc.text('INDICATIVE RISK LEVEL', margin, y);

    y += 8;
    doc.setFontSize(18);
    doc.setFont('serif', 'bold');

    if (result.tier.name === 'Tier 1') doc.setTextColor(196, 30, 58); // Critical — red
    else if (result.tier.name === 'Tier 2') doc.setTextColor(255, 140, 66); // Elevated — orange
    else doc.setTextColor(44, 95, 45); // Standard — green

    doc.text(`${result.tier.title}`, margin, y);

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
        '4. Move from self-declared to independently verified: schedule an AIC Certified audit.'
    ];

    steps.forEach(step => {
        const lines = doc.splitTextToSize(step, 170);
        doc.text(lines, margin, y);
        y += 7 * lines.length;
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('mono', 'normal');
    doc.setTextColor(150, 150, 150);
    const footerY = 280;
    doc.line(margin, footerY - 5, 190, footerY - 5);
    doc.text('AI INTEGRITY CERTIFICATION (AIC) | AIC AWARE SELF-DECLARATION — NOT AN AUDIT FINDING', margin, footerY);
    doc.text('zander@ztoaholdings.com | aiccertified.cloud | 15 Smit Street, Johannesburg, Gauteng, 2000', margin, footerY + 4);

    // Download the PDF
    doc.save(`AIC-Aware-Snapshot-${organizationName.replace(/\s+/g, '-')}.pdf`);
}
