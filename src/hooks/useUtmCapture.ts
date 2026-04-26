'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'gclid',
  'gad_source',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
] as const;

const SESSION_KEY = 'torobox_utm';
const LOCAL_KEY = 'torobox_utm_persist';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

type Key = (typeof TRACKING_KEYS)[number];
export type UtmData = Partial<Record<Key, string>>;

interface StoredUtm {
  data: UtmData;
  ts: number;
}

function readStored(raw: string | null): UtmData {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StoredUtm | UtmData;
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'ts' in parsed) {
      return (parsed as StoredUtm).data || {};
    }
    return parsed as UtmData;
  } catch {
    return {};
  }
}

export function useUtmCapture() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utms: UtmData = {};
    let found = false;

    for (const key of TRACKING_KEYS) {
      const val = params.get(key);
      if (val) {
        utms[key] = val;
        found = true;
      }
    }

    if (!found) return;

    const payload: StoredUtm = { data: utms, ts: Date.now() };
    const serialized = JSON.stringify(payload);
    try {
      sessionStorage.setItem(SESSION_KEY, serialized);
    } catch {}
    try {
      localStorage.setItem(LOCAL_KEY, serialized);
    } catch {}
  }, [pathname]);

  const getUtmData = useCallback((): UtmData => {
    if (typeof window === 'undefined') return {};

    try {
      const session = readStored(sessionStorage.getItem(SESSION_KEY));
      if (Object.keys(session).length > 0) return session;
    } catch {}

    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredUtm;
        if (parsed?.ts && Date.now() - parsed.ts < TTL_MS) {
          return parsed.data || {};
        }
      }
    } catch {}

    return {};
  }, []);

  return { getUtmData };
}
