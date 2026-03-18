import * as amplitude from '@amplitude/unified';

export function initAnalytics() {
  amplitude.initAll('d8c9e9b38574250b38e77552d315463c', {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}
