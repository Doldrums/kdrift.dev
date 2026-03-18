export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight for relay
    if (request.method === 'OPTIONS' && url.pathname === '/relay/amplitude') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Proxy to Amplitude
    if (request.method === 'POST' && url.pathname === '/relay/amplitude') {
      const body = await request.text();
      const response = await fetch('https://api2.amplitude.com/2/httpapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
