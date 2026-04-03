import { useLanguage } from '../context/LanguageContext';

export const useVoice = () => {
  const { language } = useLanguage();

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const isHindi = language === 'hi';
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.pitch = 1.05; 
      utterance.rate = 0.95;  
      
      const voices = window.speechSynthesis.getVoices();
      
      const validLangVoices = voices.filter(v => 
        v.lang.startsWith(language) || 
        (language === 'mr' && v.lang.startsWith('hi')) 
      );
      
      const premiumIndianFemales = ['Neerja', 'Heera', 'Swara', 'Lekha', 'Veena', 'Google हिन्दी', 'Google Hindi'];
            
      let bestVoice = validLangVoices.find(v => premiumIndianFemales.some(name => v.name.includes(name)));
      
      if (!bestVoice) {
        bestVoice = validLangVoices.find(v => v.lang.includes('IN') && (v.name.toLowerCase().includes('female') || v.name.includes('Google')));
      }
      
      if (!bestVoice) bestVoice = validLangVoices[0];
      if (bestVoice) utterance.voice = bestVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stop };
};
