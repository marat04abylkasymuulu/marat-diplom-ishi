import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveMapLink } from '../utils/api';
import { looksLikeResolvableMapShareUrl, openStreetMapEmbedSrc, sanitizeMapEmbedSrc } from '../utils/mapEmbeds';

/**
 * @param {{ google_maps_embed_url?: string, two_gis_embed_url?: string, latitude?: string|number|null, longitude?: string|number|null }} branch
 */
export default function BranchMapTabs({ branch }) {
  const { t } = useTranslation();
  const gRaw = (branch?.google_maps_embed_url || '').trim();
  const tRaw = (branch?.two_gis_embed_url || '').trim();
  const gEmb = sanitizeMapEmbedSrc(gRaw);
  const tEmb = sanitizeMapEmbedSrc(tRaw);

  const [resolved, setResolved] = useState({
    g: null,
    tg: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const needGoogle = gRaw && !gEmb && looksLikeResolvableMapShareUrl(gRaw);
    const needTwo = tRaw && !tEmb && looksLikeResolvableMapShareUrl(tRaw);

    if (!needGoogle && !needTwo) {
      setResolved({ g: null, tg: null, loading: false, error: null });
      return () => {
        cancelled = true;
      };
    }

    setResolved({ g: null, tg: null, loading: true, error: null });

    (async () => {
      const next = { g: null, tg: null, loading: false, error: null };
      try {
        if (needGoogle) {
          const { data } = await resolveMapLink(gRaw);
          next.g = { lat: data.latitude, lon: data.longitude };
        }
        if (needTwo) {
          const { data } = await resolveMapLink(tRaw);
          next.tg = { lat: data.latitude, lon: data.longitude };
        }
      } catch {
        next.error = 'resolve_failed';
      }
      if (!cancelled) setResolved(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [branch?.id, gRaw, tRaw, gEmb, tEmb]);

  const googleSrc = gEmb || (resolved.g ? openStreetMapEmbedSrc(resolved.g.lat, resolved.g.lon) : null);
  const twoSrc = tEmb || (resolved.tg ? openStreetMapEmbedSrc(resolved.tg.lat, resolved.tg.lon) : null);
  const coordOsm =
    !googleSrc && !twoSrc ? openStreetMapEmbedSrc(branch?.latitude, branch?.longitude) : null;

  const tabs = [];
  if (googleSrc) {
    tabs.push({
      id: 'google',
      label: gEmb ? 'Google Maps' : t('contacts.map_google_location'),
      src: googleSrc,
    });
  }
  if (twoSrc) {
    tabs.push({
      id: '2gis',
      label: tEmb ? '2GIS' : t('contacts.map_2gis_location'),
      src: twoSrc,
    });
  }
  if (coordOsm) tabs.push({ id: 'osm', label: t('contacts.map_openstreetmap'), src: coordOsm });

  const tabKey = `${googleSrc || ''}|${twoSrc || ''}|${coordOsm || ''}`;

  const [pickedTab, setPickedTab] = useState(null);
  useEffect(() => {
    setPickedTab(null);
  }, [tabKey]);

  const activeTabId =
    pickedTab && tabs.some((x) => x.id === pickedTab) ? pickedTab : (tabs[0]?.id ?? '');
  const current = tabs.find((x) => x.id === activeTabId) || tabs[0];

  const needResolve =
    (gRaw && !gEmb && looksLikeResolvableMapShareUrl(gRaw)) ||
    (tRaw && !tEmb && looksLikeResolvableMapShareUrl(tRaw));

  if (needResolve && resolved.loading) {
    return (
      <div className="flex min-h-[14rem] items-center justify-center rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-slate-100/80">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">{t('contacts.map_resolving')}</p>
        </div>
      </div>
    );
  }

  if (tabs.length === 0) {
    const showResolveHint = needResolve && resolved.error;
    return (
      <div className="record-map-fallback flex min-h-[14rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/90 bg-gradient-to-br from-slate-100/90 via-white to-sky-50/40 p-6 text-center">
        <p className="text-sm font-medium text-slate-600">{t('contacts.map_placeholder_title')}</p>
        <p className="max-w-md text-xs leading-relaxed text-slate-500">{t('contacts.map_placeholder_help')}</p>
        {showResolveHint ? (
          <p className="max-w-md text-xs font-medium text-amber-700">{t('contacts.map_resolve_failed')}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/5">
      {tabs.length > 1 ? (
        <div className="flex border-b border-slate-200 bg-slate-50/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPickedTab(tab.id)}
              className={`flex-1 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide transition-colors md:text-sm ${
                current.id === tab.id
                  ? 'bg-white text-primary shadow-[inset_0_-2px_0_0_var(--color-secondary)]'
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative aspect-[16/10] w-full bg-slate-100">
        <iframe
          title={current.label}
          src={current.src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
