"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "pt";
const LanguageContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "en",
  setLocale: () => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
