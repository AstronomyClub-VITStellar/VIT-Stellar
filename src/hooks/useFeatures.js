import { useContext } from 'react';
import { FeaturesContext } from '@/context/featuresContext';

// Returns { status, features, announcement }.
//   features.festSponsor / .festPoc / .boardApplication / .domainSelection  (booleans)
//   announcement = { show, icon, text, href }
// Unlike deadlines, these are never null: they start from the defaults in
// config/features.js and config/announcement.js, then Supabase overrides them.
export function useFeatures() {
  const ctx = useContext(FeaturesContext);
  if (!ctx) throw new Error('useFeatures must be used inside <FeaturesProvider>');
  return ctx;
}