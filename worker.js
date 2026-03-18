export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy helper: forward request to target URL preserving method/body/headers
    async function proxyTo(targetUrl, allowedMethods = null) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (allowedMethods && !allowedMethods.includes(request.method)) {
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: { 'Content-Type': 'application/json' },
          body,
        });
        const text = await response.text();
        return new Response(text, {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Amplitude analytics events
    if (url.pathname.startsWith('/relay/amplitude-events')) {
      return proxyTo('https://api2.amplitude.com/2/httpapi', ['POST']);
    }

    // Session replay remote config (GET)
    if (url.pathname.startsWith('/relay/amplitude-sr-cfg')) {
      const srCfgUrl = new URL('https://sr-client-cfg.amplitude.com/config');
      // Forward any query params (deviceId, sessionId, etc.)
      url.searchParams.forEach((v, k) => srCfgUrl.searchParams.set(k, v));
      return proxyTo(srCfgUrl.toString(), ['GET']);
    }

    // Session replay track (POST)
    if (url.pathname.startsWith('/relay/amplitude-sr-track')) {
      return proxyTo('https://api-sr.amplitude.com/sessions/v2/track', ['POST']);
    }

    // Legacy path kept for backwards compat
    if (url.pathname.startsWith('/relay/amplitude')) {
      return proxyTo('https://api2.amplitude.com/2/httpapi', ['POST']);
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
