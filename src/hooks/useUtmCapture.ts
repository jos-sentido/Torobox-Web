'use client';

import { useEffect, useCallback } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'] as const;
const STORAGE_KEY = 'torobox_utm';

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
}

export function useUtmCapture() {
  // On mount, capture UTMs from URL and persist in sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utms: UtmData = {};
    let found = false;

    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) {
        utms[key] = val;
        found = true;
      }
    }

    // Only overwrite if we found new UTMs in the current URL
    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
    }
  }, []);

  const getUtmData = useCallback((): UtmData => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  return { getUtmData };
}
