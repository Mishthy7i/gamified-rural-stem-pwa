import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mic, MicOff, Search, ArrowRight } from 'lucide-react';
import './Onboarding.css';

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const StudentOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  
  const [nearbySchools, setNearbySchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [manualSchool, setManualSchool] = useState('');
  const [isManualSchool, setIsManualSchool] = useState(false);
  const [locating, setLocating] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (step === 1 && !name) setName(transcript);
        else if (step === 2 && isManualSchool) setManualSchool(transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [step, name, isManualSchool]);

  const toggleMic = () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    } else if (recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleNext = () => setStep(step + 1);

  const handleComplete = async () => {
    await updateUserData({
      name,
      school: isManualSchool ? manualSchool : selectedSchool,
      classLevel: selectedClass,
      hasCompletedOnboarding: true,
    });
    navigate('/dashboard/student');
  };

  const findNearbySchools = () => {
    setLocating(true);
    
    const fallbackSchools = ["Asha Public School (Local)", "Govt. Inter College (Local)", "Stem Academy (Local)"];

    if (!navigator.geolocation) {
      setNearbySchools(fallbackSchools);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const query = `https://nominatim.openstreetmap.org/search?format=json&q=school&lat=${latitude}&lon=${longitude}&limit=5`;
        const res = await fetch(query);
        const data = await res.json();
        if (data && data.length > 0) {
          const schoolsList = data.map((e:any) => e.display_name.split(',')[0]);
          setNearbySchools(schoolsList);
        } else {
          setNearbySchools(fallbackSchools);
        }
      } catch (err) {
        setNearbySchools(fallbackSchools);
      }
      setLocating(false);
    }, () => {
      setLocating(false);
      setNearbySchools(fallbackSchools);
    });
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card card-gamified">
        <h2>Student Profile Setup</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="form-step animate-slide-up">
            <h3>Tell us about yourself!</h3>
            <div className="input-with-mic">
              <input 
                type="text" 
                placeholder="What is your name?" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
              <button 
                type="button" 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleMic}
              >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            </div>

            <input 
              type="number" 
              placeholder="Your Age" 
              value={age} 
              onChange={e => setAge(e.target.value)} 
              className="mt-4 w-full"
            />

            <select 
              value={gender} 
              onChange={e => setGender(e.target.value)}
              className="mt-4 w-full select-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <button className="btn-primary mt-6" onClick={handleNext} disabled={!name}>
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step animate-slide-up">
            <h3>Find your School</h3>
            
            {!isManualSchool ? (
              <>
                <p className="text-secondary text-sm mb-4">Click below to find schools near your location automatically.</p>
                
                <button 
                  className="btn-secondary w-full mb-4" 
                  onClick={findNearbySchools}
                  disabled={locating}
                >
                  {locating ? 'Locating...' : 'Find Nearby Schools 📍'}
                </button>

                {nearbySchools.length > 0 && (
                  <select 
                    value={selectedSchool} 
                    onChange={e => setSelectedSchool(e.target.value)}
                    className="w-full select-input mb-4"
                  >
                    <option value="">-- Choose from nearby --</option>
                    {nearbySchools.map((school, i) => (
                      <option key={i} value={school}>{school}</option>
                    ))}
                  </select>
                )}

                <p className="text-sm mt-4 cursor-pointer text-blue-500 switch-btn" onClick={() => setIsManualSchool(true)}>
                  Cannot find your school? Add it manually.
                </p>
              </>
            ) : (
              <>
                <p className="text-secondary text-sm mb-4">You can manually type or use voice to enter your school name.</p>
                
                <div className="input-with-mic mb-4">
                  <input 
                    type="text" 
                    placeholder="Enter School Name" 
                    value={manualSchool} 
                    onChange={e => setManualSchool(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className={`mic-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleMic}
                  >
                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                </div>
                
                <p className="text-sm mt-4 cursor-pointer text-blue-500 switch-btn" onClick={() => setIsManualSchool(false)}>
                  Go back to Location search
                </p>
              </>
            )}

            <div className="flex-between mt-6">
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSelectedSchool('Skipped');
                  setManualSchool('Skipped');
                  handleNext();
                }}
              >
                Skip
              </button>
              <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!isManualSchool ? !selectedSchool : !manualSchool}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step animate-slide-up">
            <h3>Select your Class</h3>
            
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full select-input"
            >
              <option value="">Which class are you in?</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6 (Fractions focus)</option>
              <option value="Class 7">Class 7</option>
            </select>

            <button className="btn-primary mt-6 w-full" onClick={handleComplete} disabled={!selectedClass}>
              Finish & Start Learning 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOnboarding;
