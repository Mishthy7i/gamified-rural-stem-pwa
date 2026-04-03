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
    'dashboard.welcome': 'Welcome',
    'dashboard.class': 'Class',
    'dashboard.school': 'School',
    'dashboard.recommended': 'Recommended for You 🎯',
    'dashboard.noClasses': 'No teachers from your school have signed up yet!',
    'dashboard.joinClass': 'Join Class',
    'dashboard.haveCode': 'Have a code from your teacher?',
    'dashboard.enterCode': 'Enter Code (e.g. MATH BY XYZ)',
    'dashboard.selfLearning': 'Self Learning Mode 🚀',
    'dashboard.startAdventure': 'Start Adventure',
    'teacher.dashboard': 'Teacher Dashboard 👨‍🏫',
    'teacher.noClasses': 'No Classes Found',
    'teacher.noClassesDesc': 'You have not generated any active classrooms yet.',
    'teacher.generateCode': 'Generate a Code',
    'teacher.classroomCode': 'Classroom Code',
    'teacher.enrolled': 'Enrolled Students',
    'teacher.noStudents': 'No students have joined using this code yet.',
    'teacher.unknown': 'Unknown',
    'teacher.level1': 'Level 1',
    'map.welcome': "Hi {name}! Welcome to your learning journey. Let's begin!",
    'map.friend': 'Friend',
    'map.clickAudio': '🔊 Click me to hear it out loud!',
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
    'dashboard.welcome': 'स्वागत है',
    'dashboard.class': 'कक्षा',
    'dashboard.school': 'विद्यालय',
    'dashboard.recommended': 'आपके लिए अनुशंसित 🎯',
    'dashboard.noClasses': 'आपके स्कूल के किसी भी शिक्षक ने अभी तक कोड साझा नहीं किया है।',
    'dashboard.joinClass': 'कक्षा में जुड़ें',
    'dashboard.haveCode': 'आपके शिक्षक का कोड है?',
    'dashboard.enterCode': 'कोड दर्ज करें',
    'dashboard.selfLearning': 'स्व-शिक्षा विधा 🚀',
    'dashboard.startAdventure': 'यात्रा शुरू करें',
    'teacher.dashboard': 'शिक्षक डैशबोर्ड 👨‍🏫',
    'teacher.noClasses': 'कोई कक्षा नहीं मिली',
    'teacher.noClassesDesc': 'आपने अभी तक कोई सक्रिय कक्षा नहीं बनाई है।',
    'teacher.generateCode': 'कोड जनरेट करें',
    'teacher.classroomCode': 'कक्षा का कोड',
    'teacher.enrolled': 'नामित दर्ज छात्र',
    'teacher.noStudents': 'अभी तक किसी भी छात्र ने इस कोड का उपयोग करके प्रवेश नहीं लिया है।',
    'teacher.unknown': 'अज्ञात',
    'teacher.level1': 'स्तर 1',
    'map.welcome': "नमस्ते {name}! आपकी सीखने की यात्रा में आपका स्वागत है। चलिए शुरू करते हैं!",
    'map.friend': 'दोस्त',
    'map.clickAudio': '🔊 इसे सुनने के लिए मुझे क्लिक करें!',
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
    'dashboard.welcome': 'स्वागत आहे',
    'dashboard.class': 'वर्ग',
    'dashboard.school': 'शाळा',
    'dashboard.recommended': 'तुमच्यासाठी शिफारस केलेले 🎯',
    'dashboard.noClasses': 'तुमच्या शाळेतील कोणत्याही शिक्षकाने अद्याप साइन अप केले नाही!',
    'dashboard.joinClass': 'वर्गात सामील व्हा',
    'dashboard.haveCode': 'तुमच्या शिक्षकाकडून कोड आहे का?',
    'dashboard.enterCode': 'कोड प्रविष्ट करा',
    'dashboard.selfLearning': 'स्वत: शिकण्याची मोड 🚀',
    'dashboard.startAdventure': 'प्रवास सुरू करा',
    'teacher.dashboard': 'शिक्षक डॅशबोर्ड 👨‍🏫',
    'teacher.noClasses': 'कोणतेही वर्ग आढळले नाहीत',
    'teacher.noClassesDesc': 'तुम्ही अद्याप कोणतेही सक्रिय वर्ग तयार केलेले नाहीत.',
    'teacher.generateCode': 'कोड तयार करा',
    'teacher.classroomCode': 'वर्ग कोड',
    'teacher.enrolled': 'नोंदणीकृत विद्यार्थी',
    'teacher.noStudents': 'या कोडचा वापर करून अद्याप कोणत्याही विद्यार्थ्याने प्रवेश घेतलेला नाही.',
    'teacher.unknown': 'अज्ञात',
    'teacher.level1': 'पातळी 1',
    'map.welcome': "नमस्कार {name}! तुमच्या शिकण्याच्या प्रवासात स्वागत आहे. चला सुरू करूया!",
    'map.friend': 'मित्रा',
    'map.clickAudio': '🔊 हे ऐकण्यासाठी माझ्यावर क्लिक करा!',
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
    'dashboard.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ',
    'dashboard.class': 'ਜਮਾਤ',
    'dashboard.school': 'ਸਕੂਲ',
    'dashboard.recommended': 'ਤੁਹਾਡੇ ਲਈ ਸਿਫਾਰਸ਼ 🎯',
    'dashboard.noClasses': 'ਤੁਹਾਡੇ ਸਕੂਲ ਦੇ ਕਿਸੇ ਵੀ ਅਧਿਆਪਕ ਨੇ ਅਜੇ ਤੱਕ ਸਾਈਨ ਅੱਪ ਨਹੀਂ ਕੀਤਾ ਹੈ!',
    'dashboard.joinClass': 'ਕਲਾਸ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    'dashboard.haveCode': 'ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਅਧਿਆਪਕ ਦਾ ਕੋਡ ਹੈ?',
    'dashboard.enterCode': 'ਕੋਡ ਦਰਜ ਕਰੋ',
    'dashboard.selfLearning': 'ਸਵੈ-ਸਿੱਖਣ ਮੋਡ 🚀',
    'dashboard.startAdventure': 'ਸਫ਼ਰ ਸ਼ੁਰੂ ਕਰੋ',
    'teacher.dashboard': 'ਅਧਿਆਪਕ ਡੈਸ਼ਬੋਰਡ 👨‍🏫',
    'teacher.noClasses': 'ਕੋਈ ਕਲਾਸ ਨਹੀਂ ਮਿਲੀ',
    'teacher.noClassesDesc': 'ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕੋਈ ਸਰਗਰਮ ਕਲਾਸ ਨਹੀਂ ਬਣਾਈ ਹੈ।',
    'teacher.generateCode': 'ਕੋਡ ਬਣਾਓ',
    'teacher.classroomCode': 'ਕਲਾਸ ਕੋਡ',
    'teacher.enrolled': 'ਦਾਖਲ ਵਿਦਿਆਰਥੀ',
    'teacher.noStudents': 'ਅਜੇ ਤੱਕ ਕਿਸੇ ਵਿਦਿਆਰਥੀ ਨੇ ਇਸ ਕੋਡ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦਾਖਲਾ ਨਹੀਂ ਲਿਆ ਹੈ।',
    'teacher.unknown': 'ਅਣਜਾਣ',
    'teacher.level1': 'ਲੈਵਲ 1',
    'map.welcome': "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ {name}! ਤੁਹਾਡੀ ਸਿੱਖਣ ਦੀ ਯਾਤਰਾ ਵਿੱਚ ਸੁਆਗਤ ਹੈ। ਆਓ ਸ਼ੁਰੂ ਕਰੀਏ!",
    'map.friend': 'ਦੋਸਤ',
    'map.clickAudio': '🔊 ਇਸ ਨੂੰ ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣਨ ਲਈ ਮੈਨੂੰ ਕਲਿੱਕ ਕਰੋ!',
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
