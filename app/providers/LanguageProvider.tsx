import { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import { i18n } from '../../i18n';

type Language = 'es' | 'en';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'es',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const systemLang =
    Localization.getLocales()[0]?.languageCode === 'en' ? 'en' : 'es';

  const [lang, setLangState] = useState<Language>(systemLang);

  useEffect(() => {
    i18n.locale = lang;
  }, [lang]);

  function setLang(newLang: Language) {
    setLangState(newLang);
    i18n.locale = newLang;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
