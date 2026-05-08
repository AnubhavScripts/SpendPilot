'use client';

import { useEffect, useCallback } from 'react';
import type { SpendFormData } from '@/types';

const STORAGE_KEY = 'spendpilot_form_v1';

export function useFormPersistence() {
  const save = useCallback((data: SpendFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, []);

  const load = useCallback((): SpendFormData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SpendFormData;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently fail
    }
  }, []);

  return { save, load, clear };
}
