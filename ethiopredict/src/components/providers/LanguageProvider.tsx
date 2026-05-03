'use client';

// Re-export the LanguageProvider from context so it can be used in the
// root layout (which is a Server Component) without importing client code directly.
export { LanguageProvider } from '@/context/LanguageContext';
