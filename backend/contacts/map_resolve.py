"""
Resolve public map share links to latitude/longitude (server-side only).

Short links (https://maps.app.goo.gl/..., https://go.2gis.com/...) are followed
with per-hop host checks, then coordinates are parsed from the final URL.
"""

from __future__ import annotations

import re
import ssl
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse, unquote
from urllib.request import HTTPRedirectHandler, HTTPSHandler, Request, build_opener

# Hosts allowed for the *initial* URL.
ALLOWED_START_HOSTS = frozenset(
    {
        "maps.app.goo.gl",
        "goo.gl",
        "www.google.com",
        "google.com",
        "maps.google.com",
        "2gis.ru",
        "2gis.kg",
        "2gis.kz",
        "2gis.uz",
        "2gis.ae",
        "2gis.com",
        "www.2gis.ru",
        "www.2gis.kg",
        "go.2gis.com",
        "link.2gis.com",
    }
)

MAX_REDIRECTS = 8
MAX_READ_BYTES = 64 * 1024
USER_AGENT = "RecordEducationMapResolver/1.1 (+https://github.com/alidin000/record-education)"


class MapResolveError(Exception):
    pass


def _norm_host(host: str) -> str:
    h = (host or "").lower().split("@")[-1]
    if ":" in h:
        h = h.split(":")[0]
    if h.startswith("www."):
        return h[4:]
    return h


def _host_in_set(host: str, allowed: frozenset[str]) -> bool:
    h = _norm_host(host)
    if h in allowed:
        return True
    return any(h.endswith("." + a) for a in allowed)


def _redirect_host_allowed(host: str) -> bool:
    """Hosts allowed on any redirect hop or final URL."""
    h = _norm_host(host)
    if h in ALLOWED_START_HOSTS:
        return True
    if h.endswith(".goo.gl") or h == "goo.gl":
        return True
    if "google." in h or h == "google.com" or h.endswith(".google.com"):
        return True
    if "gstatic.com" in h or "googleusercontent.com" in h:
        return True
    if "2gis." in h or h.endswith("2gis.com") or h == "2gis.com":
        return True
    return False


def _parse_google_lat_lon(url: str) -> tuple[float, float] | None:
    decoded = unquote(url.replace("\\u0026", "&"))

    m = re.search(r"!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)", decoded)
    if m:
        lat, lon = float(m.group(1)), float(m.group(2))
        if _valid_lat_lon(lat, lon):
            return lat, lon

    for m in re.finditer(r"@(-?\d+\.?\d+),(-?\d+\.?\d+)(?:,|\?|/|$)", decoded):
        lat, lon = float(m.group(1)), float(m.group(2))
        if _valid_lat_lon(lat, lon):
            return lat, lon

    m = re.search(r"(?:[?&]center=|[?&]ll=)(-?\d+\.?\d*)[,%2C]+(-?\d+\.?\d*)", decoded, re.I)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        if _valid_lat_lon(a, b):
            return a, b
        if _valid_lat_lon(b, a):
            return b, a

    m = re.search(r"[?&]q=(-?\d+\.?\d*)[+,%2C]+(-?\d+\.?\d*)", decoded, re.I)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        if _valid_lat_lon(a, b):
            return a, b
        if _valid_lat_lon(b, a):
            return b, a

    return None


def _parse_2gis_lat_lon(url: str) -> tuple[float, float] | None:
    decoded = unquote(url)

    m = re.search(r"[?&]m=(-?\d+\.?\d*)[,%2C]+(-?\d+\.?\d*)", decoded, re.I)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        if _is_kgish_lonlat(a, b):
            return b, a
        if _is_kgish_lonlat(b, a):
            return a, b
        if _valid_lat_lon(a, b):
            return a, b
        if _valid_lat_lon(b, a):
            return b, a

    m = re.search(r"(?:[/|])(-?\d+\.?\d+),(-?\d+\.?\d+)(?:/|$|\?)", decoded)
    if m:
        a, b = float(m.group(1)), float(m.group(2))
        if _is_kgish_lonlat(a, b):
            return b, a
        if _is_kgish_lonlat(b, a):
            return a, b

    return None


def _valid_lat_lon(lat: float, lon: float) -> bool:
    return -90 <= lat <= 90 and -180 <= lon <= 180 and abs(lat) > 0.01 and abs(lon) > 0.01


def _is_kgish_lonlat(lon: float, lat: float) -> bool:
    return 60 < lon < 90 and 35 < lat < 55


class _GuardedRedirectHandler(HTTPRedirectHandler):
    max_redirections = MAX_REDIRECTS

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        p = urlparse(newurl)
        host = p.netloc
        if not _redirect_host_allowed(host):
            raise MapResolveError(f"Redirect blocked: {_norm_host(host)}")
        return Request(newurl, headers={"User-Agent": USER_AGENT}, method="GET")


def resolve_map_share_url(url: str) -> dict:
    raw = (url or "").strip()
    if not raw.startswith("https://"):
        raise MapResolveError("Only https:// links are supported")

    parsed = urlparse(raw)
    if parsed.scheme != "https" or not parsed.netloc:
        raise MapResolveError("Invalid URL")

    if not _host_in_set(parsed.netloc, ALLOWED_START_HOSTS):
        raise MapResolveError("Host not allowed for map link resolution")

    # Coordinates already in URL (e.g. /maps/@lat,lon or !3d!4d) — no HTTP fetch needed.
    coords = _parse_google_lat_lon(raw)
    if coords is not None:
        lat, lon = coords
        return {
            "latitude": round(lat, 6),
            "longitude": round(lon, 6),
            "final_url": raw,
            "source": "google",
        }
    coords = _parse_2gis_lat_lon(raw)
    if coords is not None:
        lat, lon = coords
        return {
            "latitude": round(lat, 6),
            "longitude": round(lon, 6),
            "final_url": raw,
            "source": "2gis",
        }

    ctx = ssl.create_default_context()
    https_handler = HTTPSHandler(context=ctx)
    opener = build_opener(_GuardedRedirectHandler(), https_handler)
    req = Request(raw, headers={"User-Agent": USER_AGENT}, method="GET")

    try:
        with opener.open(req, timeout=15) as resp:  # noqa: S310
            final_url = resp.geturl() or raw
            resp.read(MAX_READ_BYTES)
    except MapResolveError:
        raise
    except HTTPError as e:
        raise MapResolveError(f"HTTP error: {e.code}") from e
    except URLError as e:
        raise MapResolveError("Could not fetch URL") from e

    fp = urlparse(final_url)
    if not _redirect_host_allowed(fp.netloc):
        raise MapResolveError("Final URL host not allowed")

    coords = _parse_google_lat_lon(final_url)
    source = "google"
    if coords is None:
        coords = _parse_2gis_lat_lon(final_url)
        source = "2gis"
    if coords is None:
        raise MapResolveError("Could not parse coordinates from resolved URL")

    lat, lon = coords
    return {
        "latitude": round(lat, 6),
        "longitude": round(lon, 6),
        "final_url": final_url,
        "source": source,
    }
