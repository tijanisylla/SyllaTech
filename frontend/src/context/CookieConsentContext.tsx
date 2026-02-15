import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CookieConsentStatus = 'accepted' | 'rejected' | null;

const STORAGE_KEY = 'syllatech-cookie-consent';

interface CookieConsentContextType {
  consent: CookieConsentStatus;
  hasAnalyticsConsent: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consent, setConsentState] = useState<CookieConsentStatus>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved === 'accepted' || saved === 'rejected' ? saved : null) as CookieConsentStatus;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (consent) {
        localStorage.setItem(STORAGE_KEY, consent);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [consent]);

  const acceptAll = () => setConsentState('accepted');
  const rejectAll = () => setConsentState('rejected');
  const openSettings = () => {
    // Could expand to a modal with per-category toggles; for now no-op
  };

  const hasAnalyticsConsent = consent === 'accepted';

  return (
    <CookieConsentContext.Provider
      value={{ consent, hasAnalyticsConsent, acceptAll, rejectAll, openSettings }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};
