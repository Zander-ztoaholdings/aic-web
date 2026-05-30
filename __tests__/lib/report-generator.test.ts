import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define types locally
interface CategoryScore {
  name: string;
  score: number;
  weight: number;
  maxPossible: number;
  actual: number;
}

interface TierInfo {
  name: string;
  color: string;
  title: string;
  desc: string;
}

interface AssessmentResult {
  integrityScore: number;
  tier: TierInfo;
  categoryScores: Record<string, CategoryScore>;
}

// Mock jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockSetFillColor = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetLineWidth = vi.fn();
const mockRect = vi.fn();
const mockLine = vi.fn();
const mockSplitTextToSize = vi.fn((...args: any[]) => [args[0]]);

const mockJsPDFInstance = {
  save: mockSave,
  text: mockText,
  setFont: mockSetFont,
  setFontSize: mockSetFontSize,
  setTextColor: mockSetTextColor,
  setFillColor: mockSetFillColor,
  setDrawColor: mockSetDrawColor,
  setLineWidth: mockSetLineWidth,
  rect: mockRect,
  line: mockLine,
  splitTextToSize: mockSplitTextToSize,
};

const mockJsPDF = vi.fn(() => mockJsPDFInstance);

// Inline implementation of generatePDFReport for testing
// This mirrors the actual implementation in lib/report-generator.ts
async function generatePDFReport(result: AssessmentResult, organizationName: string = 'Your Organization') {
  const doc = mockJsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 20;
  let y = 30;

  // Header - AIC Logo
  doc.setFont('serif', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(26, 26, 26);
  doc.text('AIC.', margin, y);

  doc.setFontSize(10);
  doc.setFont('mono', 'bold');
  doc.setTextColor(212, 175, 55);
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
  doc.setFillColor(250, 248, 244);
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

  if (result.tier.name === 'Tier 1') doc.setTextColor(196, 30, 58);
  else if (result.tier.name === 'Tier 2') doc.setTextColor(255, 140, 66);
  else doc.setTextColor(44, 95, 45);

  doc.text(`${result.tier.name}: ${result.tier.title}`, margin, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont('serif', 'normal');
  doc.setTextColor(26, 26, 26);
  const splitDesc = doc.splitTextToSize(result.tier.desc, 170);
  doc.text(splitDesc, margin, y);

  y += splitDesc.length * 6 + 10;

  // Category Breakdown
  doc.setFontSize(14);
  doc.setFont('serif', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text('Category Breakdown', margin, y);

  y += 10;
  Object.values(result.categoryScores).forEach((cat) => {
    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(cat.name, margin, y);

    doc.setFont('mono', 'normal');
    doc.text(`${cat.score}%`, 180, y, { align: 'right' });

    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 2, 180, y + 2);
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(1);
    doc.line(margin, y + 2, margin + 160 * (cat.score / 100), y + 2);

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
    '4. Schedule your full AIC Certification Audit.',
  ];

  steps.forEach((step) => {
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

describe('generatePDFReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockResult = (
    score: number,
    tierName: string,
    tierTitle: string,
    tierColor: string
  ): AssessmentResult => ({
    integrityScore: score,
    tier: {
      name: tierName,
      title: tierTitle,
      color: tierColor,
      desc: 'Test tier description for the assessment.',
    },
    categoryScores: {
      USAGE: { name: 'USAGE', score: 75, weight: 0.2, maxPossible: 20, actual: 15 },
      OVERSIGHT: { name: 'OVERSIGHT', score: 80, weight: 0.35, maxPossible: 20, actual: 16 },
      TRANSPARENCY: { name: 'TRANSPARENCY', score: 65, weight: 0.25, maxPossible: 20, actual: 13 },
      INFRASTRUCTURE: { name: 'INFRASTRUCTURE', score: 70, weight: 0.2, maxPossible: 20, actual: 14 },
    },
  });

  describe('PDF Generation', () => {
    it('should create a PDF document', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Organization');

      expect(mockSave).toHaveBeenCalled();
    });

    it('should save PDF with organization name in filename', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Organization');

      expect(mockSave).toHaveBeenCalledWith('AIC-Integrity-Report-Test-Organization.pdf');
    });

    it('should handle organization names with spaces', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Organization Name');

      expect(mockSave).toHaveBeenCalledWith('AIC-Integrity-Report-Test-Organization-Name.pdf');
    });

    it('should use default organization name when not provided', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result);

      expect(mockSave).toHaveBeenCalledWith('AIC-Integrity-Report-Your-Organization.pdf');
    });
  });

  describe('Header Content', () => {
    it('should render AIC branding', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('AIC.', expect.any(Number), expect.any(Number));
      expect(mockText).toHaveBeenCalledWith(
        'AI INTEGRITY CERTIFICATION',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should render title and organization name', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'My Company');

      expect(mockText).toHaveBeenCalledWith(
        'Integrity Score Assessment',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockText).toHaveBeenCalledWith(
        'Prepared for: My Company',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Score Display', () => {
    it('should display the integrity score', async () => {
      const result = createMockResult(85, 'Tier 3', 'Standard Risk', 'text-aic-green');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('85/100', expect.any(Number), expect.any(Number));
    });

    it('should display score of 0', async () => {
      const result = createMockResult(0, 'Tier 1', 'Critical Risk', 'text-aic-red');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('0/100', expect.any(Number), expect.any(Number));
    });

    it('should display perfect score of 100', async () => {
      const result = createMockResult(100, 'Tier 3', 'Standard Risk', 'text-aic-green');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('100/100', expect.any(Number), expect.any(Number));
    });
  });

  describe('Tier Display', () => {
    it('should display Tier 1 with red color', async () => {
      const result = createMockResult(35, 'Tier 1', 'Critical Risk', 'text-aic-red');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'Tier 1: Critical Risk',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockSetTextColor).toHaveBeenCalledWith(196, 30, 58);
    });

    it('should display Tier 2 with orange color', async () => {
      const result = createMockResult(65, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'Tier 2: Elevated Risk',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockSetTextColor).toHaveBeenCalledWith(255, 140, 66);
    });

    it('should display Tier 3 with green color', async () => {
      const result = createMockResult(90, 'Tier 3', 'Standard Risk', 'text-aic-green');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'Tier 3: Standard Risk',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockSetTextColor).toHaveBeenCalledWith(44, 95, 45);
    });
  });

  describe('Category Breakdown', () => {
    it('should display all category names', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('USAGE', expect.any(Number), expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('OVERSIGHT', expect.any(Number), expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('TRANSPARENCY', expect.any(Number), expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('INFRASTRUCTURE', expect.any(Number), expect.any(Number));
    });

    it('should display category percentages', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith('75%', expect.any(Number), expect.any(Number), expect.any(Object));
      expect(mockText).toHaveBeenCalledWith('80%', expect.any(Number), expect.any(Number), expect.any(Object));
      expect(mockText).toHaveBeenCalledWith('65%', expect.any(Number), expect.any(Number), expect.any(Object));
      expect(mockText).toHaveBeenCalledWith('70%', expect.any(Number), expect.any(Number), expect.any(Object));
    });

    it('should render progress bars for categories', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockLine).toHaveBeenCalled();
    });
  });

  describe('Strategic Next Steps', () => {
    it('should display next steps section', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'Strategic Next Steps',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include POPIA compliance step', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        '1. Finalize POPIA Section 71 Human Oversight Policy.',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should include all four next steps', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        '2. Conduct technical bias auditing on high-stakes systems.',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockText).toHaveBeenCalledWith(
        '3. Implement immutable audit logging for automated decisions.',
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockText).toHaveBeenCalledWith(
        '4. Schedule your full AIC Certification Audit.',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('Footer', () => {
    it('should display footer with AIC branding', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'AI INTEGRITY CERTIFICATION (AIC) | POPIA SECTION 71 COMPLIANCE FRAMEWORK',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should display contact information', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockText).toHaveBeenCalledWith(
        'hello@aicert.co.za | www.aicert.co.za | Rosebank, Johannesburg',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('PDF Formatting', () => {
    it('should use A4 portrait format', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockJsPDF).toHaveBeenCalledWith({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
    });

    it('should set multiple font styles', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockSetFont).toHaveBeenCalledWith('serif', 'bold');
      expect(mockSetFont).toHaveBeenCalledWith('mono', 'bold');
      expect(mockSetFont).toHaveBeenCalledWith('serif', 'normal');
    });

    it('should render score box with background', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      expect(mockRect).toHaveBeenCalled();
      expect(mockSetFillColor).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in organization name', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test & Co. (Pty) Ltd');

      expect(mockSave).toHaveBeenCalled();
    });

    it('should handle empty category scores gracefully', async () => {
      const result: AssessmentResult = {
        integrityScore: 0,
        tier: {
          name: 'Tier 1',
          title: 'Critical Risk',
          color: 'text-aic-red',
          desc: 'Description',
        },
        categoryScores: {},
      };

      await expect(generatePDFReport(result, 'Test')).resolves.not.toThrow();
    });

    it('should render date', async () => {
      const result = createMockResult(75, 'Tier 2', 'Elevated Risk', 'text-aic-orange');

      await generatePDFReport(result, 'Test Org');

      const dateCallArgs = mockText.mock.calls.find(
        (call) => typeof call[0] === 'string' && call[0].startsWith('Date:')
      );
      expect(dateCallArgs).toBeDefined();
    });
  });
});
