import * as amplitude from '@amplitude/unified';

export function initAnalytics() {
  amplitude.initAll('d8c9e9b38574250b38e77552d315463c', {
    analytics: {
      autocapture: true,
      serverUrl: 'https://kdrift.dev/relay/amplitude-events',
    },
    sessionReplay: {
      sampleRate: 1,
      configServerUrl: 'https://kdrift.dev/relay/amplitude-sr-cfg',
      trackServerUrl: 'https://kdrift.dev/relay/amplitude-sr-track',
    },
  });
}
