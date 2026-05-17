/** Allow only known map CDNs in iframes (mitigate javascript: / open redirects). */
export function sanitizeMapEmbedSrc(url) {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u.startsWith('https://')) return null;
  const lower = u.toLowerCase();

  // Google: normal /maps/place or /maps/@ links are NOT valid iframe src (often blank / X-Frame).
  const isGoogleMapsHost = lower.includes('google.com/maps') || lower.includes('maps.google.com');
  if (isGoogleMapsHost) {
    if (/\bmaps\/embed\b/i.test(lower) || /[?&]output=embed\b/i.test(lower)) {
      return u;
    }
    return null;
  }

  const twoGisEmbed =
    /widgets\.2gis\.|widget\.2gis\.|catalog\.api\.2gis\./i.test(lower) ||
    (lower.includes('2gis') && /\bembed\b/i.test(lower));
  if (twoGisEmbed) return u;

  if (lower.includes('googleusercontent.com') || lower.includes('maps.gstatic.com')) {
    return u;
  }

  return null;
}

export function openStreetMapEmbedSrc(lat, lon) {
  const la = parseFloat(String(lat));
  const lo = parseFloat(String(lon));
  if (Number.isNaN(la) || Number.isNaN(lo)) return null;
  const d = 0.015;
  const bbox = `${lo - d},${la - d},${lo + d},${la + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${la},${lo}`;
}

/**
 * True if the URL is likely a share link we can send to /api/resolve-map-link/
 * (not already an iframe embed src).
 */
export function looksLikeResolvableMapShareUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u.startsWith('https://')) return false;
  const lower = u.toLowerCase();
  // Already an embeddable iframe src (do not send to resolver).
  if (/\bmaps\/embed\b/i.test(lower) || /[?&]output=embed\b/i.test(lower)) return false;
  if (/widgets\.2gis\.|widget\.2gis\.|catalog\.api\.2gis\./i.test(lower)) return false;
  if (/maps\.gstatic\.com|googleusercontent\.com/i.test(lower)) return false;
  try {
    const host = new URL(u).hostname.toLowerCase();
    if (host === 'maps.app.goo.gl' || host === 'goo.gl') return true;
    if (host === 'go.2gis.com' || host === 'link.2gis.com') return true;
    // Full Google Maps browse URLs (/place, /@, /search) — resolve to coordinates, not iframe src.
    if (host === 'www.google.com' || host === 'google.com' || host === 'maps.google.com') {
      if (/\/maps\//i.test(lower) && !/\bmaps\/embed\b/i.test(lower) && !/[?&]output=embed\b/i.test(lower)) {
        return true;
      }
    }
    if (host.endsWith('2gis.kg') || host.endsWith('2gis.ru') || host.endsWith('2gis.kz') || host.endsWith('2gis.uz')) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
