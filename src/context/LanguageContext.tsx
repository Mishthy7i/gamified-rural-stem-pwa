import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'landing.title': 'STEM Connect',
    'landing.subtitle': 'Embark on your scientific journey today!',
    'landing.selectRole': 'Select your role to continue',
    'role.student': 'Continue as Student',
    'role.teacher': 'Continue as Teacher',
    'common.loading': 'Loading...',
    'auth.login': 'Login to Your Account',
    'auth.signup': 'Create an Account',
    'auth.google': 'Continue with Google',
  },
  hi: {
    'landing.title': 'स्टेम कनेक्ट',
    'landing.subtitle': 'आज ही अपनी वैज्ञानिक यात्रा शुरू करें!',
    'landing.selectRole': 'आगे बढ़ने के लिए अपनी भूमिका चुनें',
    'role.student': 'छात्र के रूप में जारी रखें',
    'role.teacher': 'शिक्षक के रूप में जारी रखें',
    'common.loading': 'लोड हो रहा है...',
    'auth.login': 'अपने खाते में प्रवेश करें',
    'auth.signup': 'खाता बनाएं',
    'auth.google': 'Google के साथ जारी रखें',
  },
  mr: {
    'landing.title': 'स्टेम कनेक्ट',
    'landing.subtitle': 'आजच तुमचा वैज्ञानिक प्रवास सुरू करा!',
    'landing.selectRole': 'पुढे जाण्यासाठी तुमची भूमिका निवडा',
    'role.student': 'विद्यार्थी म्हणून सुरू ठेवा',
    'role.teacher': 'शिक्षक म्हणून सुरू ठेवा',
    'common.loading': 'लोड होत आहे...',
    'auth.login': 'लॉगिन करा',
    'auth.signup': 'खाते तयार करा',
    'auth.google': 'Google सह सुरू ठेवा',
  },
  pa: {
    'landing.title': 'ਸਟੈਮ ਕਨੈਕਟ',
    'landing.subtitle': 'ਅੱਜ ਹੀ ਆਪਣੀ ਵਿਗਿਆਨਕ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ!',
    'landing.selectRole': 'ਅੱਗੇ ਵਧਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    'role.student': 'ਵਿਦਿਆਰਥੀ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ',
    'role.teacher': 'ਅਧਿਆਪਕ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ',
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'auth.login': 'ਲਾਗਿਨ ਕਰੋ',
    'auth.signup': 'ਖਾਤਾ ਬਣਾਓ',
    'auth.google': 'ਗੂਗਲ ਨਾਲ ਜਾਰੀ ਰੱਖੋ',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
