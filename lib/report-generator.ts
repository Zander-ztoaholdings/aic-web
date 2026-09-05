import { jsPDF } from 'jspdf';
import { AssessmentResult } from '@/lib/scoring';
import type { AwareAnalysis } from '@/lib/aware-analysis';
import { TIER_MEANING, RIGHTS } from '@/app/data/requirements-data';

const MARGIN = 20;
const RIGHT_EDGE = 190;
const WIDTH = RIGHT_EDGE - MARGIN;
const PAGE_BOTTOM = 268;

export async function generatePDFReport(
    result: AssessmentResult,
    organizationName: string = 'Your Organization',
    analysis?: AwareAnalysis
) {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    let y = 30;

    /** Start a new page when the next block would run off this one. */
    const ensure = (needed: number) => {
        if (y + needed > PAGE_BOTTOM) {
            doc.addPage();
            y = 25;
        }
    };

    const heading = (text: string, size = 14) => {
        ensure(16);
        doc.setFont('serif', 'bold');
        doc.setFontSize(size);
        doc.setTextColor(26, 26, 26);
        doc.text(text, MARGIN, y);
        y += size * 0.6;
    };

    const body = (text: string, size = 10, colour: [number, number, number] = [60, 60, 60]) => {
        doc.setFont('serif', 'normal');
        doc.setFontSize(size);
        doc.setTextColor(...colour);
        const lines = doc.splitTextToSize(text, WIDTH) as string[];
        for (const line of lines) {
            ensure(6);
            doc.text(line, MARGIN, y);
            y += size * 0.5;
        }
    };

    // ── Header ───────────────────────────────────────────────────────────────
    doc.setFont('serif', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(26, 26, 26);
    doc.text('AIC.', MARGIN, y);

    doc.setFontSize(10);
    doc.setFont('mono', 'bold');
    doc.setTextColor(201, 146, 10);
    doc.text('AI INTEGRITY CERTIFICATION', MARGIN, y + 6);
    y += 24;

    doc.setFont('serif', 'bold');
    doc.setFontSize(21);
    doc.setTextColor(26, 26, 26);
    doc.text('AIC Aware — Self-Declared Integrity Snapshot', MARGIN, y, { maxWidth: WIDTH });
    y += 13;

    doc.setFontSize(11);
    doc.setFont('serif', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text(`Prepared for: ${organizationName}`, MARGIN, y);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, MARGIN, y + 5.5);
    y += 16;

    // ── Not-verified disclaimer ──────────────────────────────────────────────
    // This document is the output of a free, self-declared tool. It must never
    // read like an audit finding, because it is not one.
    doc.setFillColor(252, 248, 235);
    doc.setDrawColor(224, 224, 224);
    doc.rect(MARGIN, y, WIDTH, 17, 'FD');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(
        'Self-declared and not independently verified. Every answer behind this report is Tier D evidence\nunder the AIC standard. It confers neither AIC Assessed nor AIC Certified status, and is not listed\non the AIC public registry.',
        MARGIN + 4,
        y + 5.5
    );
    y += 27;

    // ── Score ────────────────────────────────────────────────────────────────
    doc.setFillColor(250, 248, 244);
    doc.rect(MARGIN, y, WIDTH, 38, 'F');
    doc.setDrawColor(224, 224, 224);
    doc.rect(MARGIN, y, WIDTH, 38, 'S');

    doc.setFontSize(9);
    doc.setFont('mono', 'bold');
    doc.setTextColor(150, 150, 150);
    doc.text('SELF-DECLARED INTEGRITY SCORE', MARGIN + 8, y + 11);

    doc.setFontSize(40);
    doc.setFont('mono', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(`${result.integrityScore}/100`, MARGIN + 8, y + 29);

    if (result.tier.name === 'Tier 1') doc.setTextColor(196, 30, 58);
    else if (result.tier.name === 'Tier 2') doc.setTextColor(255, 140, 66);
    else doc.setTextColor(44, 95, 45);
    doc.setFont('serif', 'bold');
    doc.setFontSize(15);
    doc.text(result.tier.title, RIGHT_EDGE - 8, y + 29, { align: 'right' });
    y += 47;

    body(result.tier.desc, 10);
    y += 6;

    body(
        'This score is not comparable to a certification score. The certified scale is computed from evidence weighted across 44 requirements; this one is computed from your own answers about yourself.',
        8.5,
        [130, 130, 130]
    );
    y += 8;

    // ── Indicated Division ───────────────────────────────────────────────────
    if (analysis) {
        heading(`Indicated Division: ${analysis.indication.division} — ${analysis.indication.name}`, 15);
        y += 3;
        body(analysis.indication.rationale);
        y += 4;
        if (analysis.indication.caveat) {
            body(analysis.indication.caveat, 9.5, [130, 130, 130]);
            y += 4;
        }
        body(
            `${analysis.applicableCount} of the 44 published requirements apply at this Division. Indicative only — the Division is confirmed at audit against your actual system inventory.`,
            9.5,
            [130, 130, 130]
        );
        y += 10;
    }

    // ── Category breakdown ───────────────────────────────────────────────────
    heading('Category Breakdown');
    y += 4;
    Object.values(result.categoryScores).forEach((cat) => {
        ensure(13);
        doc.setFontSize(9.5);
        doc.setFont('mono', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text(cat.name, MARGIN, y);
        doc.setFont('mono', 'normal');
        doc.text(`${cat.score}%`, RIGHT_EDGE, y, { align: 'right' });

        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(1);
        doc.line(MARGIN, y + 2.5, RIGHT_EDGE, y + 2.5);
        doc.setDrawColor(26, 26, 26);
        doc.line(MARGIN, y + 2.5, MARGIN + (WIDTH * (cat.score / 100)), y + 2.5);
        y += 11;
    });
    y += 6;

    // ── Gap register ─────────────────────────────────────────────────────────
    if (analysis) {
        const { gaps } = analysis;
        heading(
            gaps.length === 0
                ? 'Gap Register — no requirement-level gaps raised'
                : `Gap Register — ${gaps.length} requirement${gaps.length === 1 ? '' : 's'} at risk`,
            15
        );
        y += 3;

        if (gaps.length === 0) {
            body(
                'Nothing in your answers points at a specific requirement failing. That is a good starting position and it is not a pass — an audit tests the controls rather than your account of them.'
            );
            y += 8;
        } else {
            body(
                `Requirement codes below are from the published AIC standard, filtered to those applying at Division ${analysis.indication.division}. Each was raised by a specific answer you gave.`,
                9.5,
                [130, 130, 130]
            );
            y += 8;

            for (const { requirement: r, triggeredBy } of gaps) {
                ensure(30);
                doc.setFont('mono', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(26, 26, 26);
                doc.text(r.code, MARGIN, y);

                doc.setFont('mono', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(140, 140, 140);
                doc.text(
                    `${RIGHTS[r.right].name}${r.flagship ? '  ·  FLAGSHIP' : ''}  ·  Evidence tier ${r.tier}`,
                    MARGIN + 16,
                    y
                );
                y += 5.5;

                doc.setFont('serif', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(40, 40, 40);
                for (const line of doc.splitTextToSize(r.text, WIDTH) as string[]) {
                    ensure(6);
                    doc.text(line, MARGIN, y);
                    y += 4.6;
                }
                y += 1.5;

                doc.setFontSize(8.5);
                doc.setTextColor(120, 120, 120);
                for (const line of doc.splitTextToSize(`Evidence required: ${r.evidence}`, WIDTH) as string[]) {
                    ensure(6);
                    doc.text(line, MARGIN, y);
                    y += 4.2;
                }
                for (const line of doc.splitTextToSize(`Raised by: ${triggeredBy.join(' · ')}`, WIDTH) as string[]) {
                    ensure(6);
                    doc.text(line, MARGIN, y);
                    y += 4.2;
                }

                y += 3;
                ensure(4);
                doc.setDrawColor(235, 235, 235);
                doc.setLineWidth(0.3);
                doc.line(MARGIN, y, RIGHT_EDGE, y);
                y += 6;
            }
        }
    }

    // ── Why this is not certification ────────────────────────────────────────
    heading('Why this is not certification', 15);
    y += 3;
    body(
        'The standard grades evidence in four tiers and weights each accordingly. Everything in this report sits in the bottom one.'
    );
    y += 5;
    (['A', 'B', 'C', 'D'] as const).forEach((t) => {
        ensure(11);
        doc.setFont('mono', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(t === 'D' ? 201 : 26, t === 'D' ? 146 : 26, t === 'D' ? 10 : 26);
        doc.text(`Tier ${t}  ×${TIER_MEANING[t].weight}`, MARGIN, y);
        doc.setFont('serif', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        const suffix = t === 'D' ? '  <- every answer in this assessment' : '';
        const lines = doc.splitTextToSize(TIER_MEANING[t].desc + suffix, WIDTH - 32) as string[];
        for (const [i, line] of lines.entries()) {
            if (i > 0) ensure(5);
            doc.text(line, MARGIN + 32, y);
            y += 4.4;
        }
        y += 2.5;
    });
    y += 4;
    body(
        'An AIC Certified audit replaces attestation with operational data: your actual override records, your actual adverse communications, your actual disaggregated outcomes. That is the difference between saying a control exists and showing that it ran.'
    );

    // ── Footer on every page ─────────────────────────────────────────────────
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
        doc.setPage(p);
        doc.setFontSize(7.5);
        doc.setFont('mono', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, 275, RIGHT_EDGE, 275);
        doc.text('AIC AWARE SELF-DECLARATION — NOT AN AUDIT FINDING', MARGIN, 280);
        doc.text(`${p} / ${pages}`, RIGHT_EDGE, 280, { align: 'right' });
        doc.text('zander@ztoaholdings.com | aiccertified.cloud | 15 Smit Street, Johannesburg, Gauteng, 2000', MARGIN, 284);
    }

    doc.save(`AIC-Aware-Snapshot-${organizationName.replace(/\s+/g, '-')}.pdf`);
}
