import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

beforeEach(() => localStorage.clear());

describe('LanguageContext', () => {
  it('returns English string for known key', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('nav.home')).toBe('Home');
  });

  it('returns Amharic string after toggle', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.toggleLang());
    expect(result.current.t('nav.home')).toBe('መነሻ');
  });

  it('falls back to key for unknown translation', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t('unknown.key.xyz')).toBe('unknown.key.xyz');
  });

  it('starts in English by default', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.lang).toBe('en');
  });
});
