// lib/analytics.ts

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: { action: string, category: string, label: string, value?: number }) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for AIC funnel
export const trackAssessmentStart = () => {
    event({ action: 'assessment_started', category: 'Conversion', label: 'Self-Assessment' });
};

export const trackAssessmentAnswer = (questionId: string) => {
    event({ action: 'assessment_question_answered', category: 'Conversion', label: questionId });
};

export const trackEmailCaptured = (source: string) => {
    event({ action: 'assessment_email_captured', category: 'Lead', label: source });
};

export const trackAssessmentComplete = (tier: string) => {
    event({ action: 'assessment_completed', category: 'Conversion', label: tier });
};

export const trackAlphaApplication = (company: string) => {
    event({ action: 'alpha_application_submitted', category: 'Lead', label: company });
};

export const trackContactForm = (subject: string) => {
    event({ action: 'contact_form_submitted', category: 'Lead', label: subject });
};

export const trackCTAClick = (destination: string) => {
    event({ action: 'cta_clicked', category: 'Engagement', label: destination });
};
