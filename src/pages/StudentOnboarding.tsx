import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { fetchDistinctSchoolsFromClasses } from "../services/schools";
import { Mic, MicOff, ArrowRight } from "lucide-react";
import "./Onboarding.css";

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
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [nearbySchools, setNearbySchools] = useState<string[]>([]);
  const [teacherSchools, setTeacherSchools] = useState<string[]>([]);
  const [teacherSchoolsLoading, setTeacherSchoolsLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [manualSchool, setManualSchool] = useState("");
  const [isManualSchool, setIsManualSchool] = useState(false);
  const [locating, setLocating] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

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

  useEffect(() => {
    if (step !== 2) return;
    let cancelled = false;
    (async () => {
      setTeacherSchoolsLoading(true);
      try {
        const list = await fetchDistinctSchoolsFromClasses();
        if (!cancelled) setTeacherSchools(list);
      } catch (e) {
        console.error("Failed to load schools from teachers", e);
        if (!cancelled) setTeacherSchools([]);
      } finally {
        if (!cancelled) setTeacherSchoolsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step]);

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
    navigate("/dashboard/student");
  };

  const findNearbySchools = () => {
    setLocating(true);

    const fallbackSchools = [
      "Asha Public School (Local)",
      "Govt. Inter College (Local)",
      "Stem Academy (Local)",
    ];

    if (!navigator.geolocation) {
      setNearbySchools(fallbackSchools);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const query = `https://nominatim.openstreetmap.org/search?format=json&q=school&lat=${latitude}&lon=${longitude}&limit=5`;
          const res = await fetch(query);
          const data = await res.json();
          if (data && data.length > 0) {
            const schoolsList = data.map(
              (e: any) => e.display_name.split(",")[0]
            );
            setNearbySchools(schoolsList);
          } else {
            setNearbySchools(fallbackSchools);
          }
        } catch (err) {
          setNearbySchools(fallbackSchools);
        }
        setLocating(false);
      },
      () => {
        setLocating(false);
        setNearbySchools(fallbackSchools);
      }
    );
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card card-gamified">
        <h2>{t("onboarding.student.title")}</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="form-step animate-slide-up">
            <h3>{t("onboarding.student.step1.headline")}</h3>
            <div className="input-with-mic">
              <input
                type="text"
                placeholder={t("onboarding.student.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="button"
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={toggleMic}
              >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            </div>

            <input
              type="number"
              placeholder={t("onboarding.student.agePlaceholder")}
              value={age}
              onChange={(e) => {
                const val = e.target.value;
                if (
                  val === "" ||
                  (parseInt(val) >= 0 && parseInt(val) <= 100)
                ) {
                  setAge(val);
                }
              }}
              className="mt-4 w-full"
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-4 w-full select-input"
            >
              <option value="">
                {t("onboarding.student.genderPlaceholder")}
              </option>
              <option value="male">
                {t("onboarding.student.gender.male")}
              </option>
              <option value="female">
                {t("onboarding.student.gender.female")}
              </option>
              <option value="other">
                {t("onboarding.student.gender.other")}
              </option>
            </select>

            <button
              className="btn-primary mt-6"
              onClick={handleNext}
              disabled={
                !name || !age || parseInt(age) < 3 || parseInt(age) > 100
              }
            >
              {t("onboarding.student.next")} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step animate-slide-up">
            <h3>{t("onboarding.student.step2.headline")}</h3>

            {!isManualSchool ? (
              <>
                <p
                  className="text-secondary text-sm mb-2 font-medium"
                  style={{ color: "var(--accent-primary, #6366f1)" }}
                >
                  Schools from teachers
                </p>
                {teacherSchoolsLoading ? (
                  <p className="text-secondary text-sm mb-4">
                    {t("common.loading")}
                  </p>
                ) : teacherSchools.length === 0 ? (
                  <p className="text-secondary text-sm mb-4">
                    No schools registered yet. Use Find nearby or enter your
                    school manually.
                  </p>
                ) : null}

                <p className="text-secondary text-sm mb-4">
                  {t("onboarding.student.step2.sub")}
                </p>

                <button
                  className="btn-secondary w-full mb-4"
                  onClick={findNearbySchools}
                  disabled={locating}
                >
                  {locating
                    ? t("onboarding.student.locating")
                    : t("onboarding.student.findNearby")}
                </button>

                {(teacherSchools.length > 0 || nearbySchools.length > 0) && (
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full select-input mb-4"
                  >
                    <option value="">— Choose a school —</option>
                    {teacherSchools.length > 0 && (
                      <optgroup label="Schools from teachers">
                        {teacherSchools.map((school) => (
                          <option key={`t-${school}`} value={school}>
                            {school}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {nearbySchools.length > 0 && (
                      <optgroup label="Nearby (OpenStreetMap)">
                        {nearbySchools.map((school) => (
                          <option key={`n-${school}`} value={school}>
                            {school}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                )}

                <p
                  className="text-sm mt-4 cursor-pointer text-blue-500 switch-btn"
                  onClick={() => {
                    setIsManualSchool(true);
                    setSelectedSchool("");
                  }}
                >
                  {t("onboarding.student.manualPrompt")}
                </p>
              </>
            ) : (
              <>
                <p className="text-secondary text-sm mb-4">
                  {t("onboarding.student.manualHeadline")}
                </p>

                <div className="input-with-mic mb-4">
                  <input
                    type="text"
                    placeholder={t("onboarding.student.manualPlaceholder")}
                    value={manualSchool}
                    onChange={(e) => setManualSchool(e.target.value)}
                  />
                  <button
                    type="button"
                    className={`mic-btn ${isListening ? "listening" : ""}`}
                    onClick={toggleMic}
                  >
                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                </div>

                <p
                  className="text-sm mt-4 cursor-pointer text-blue-500 switch-btn"
                  onClick={() => {
                    setIsManualSchool(false);
                    setSelectedSchool("");
                  }}
                >
                  {t("onboarding.student.backToLocation")}
                </p>
              </>
            )}

            <div className="flex-between mt-6">
              <button
                className="btn-secondary"
                onClick={() => {
                  setSelectedSchool("Skipped");
                  setManualSchool("Skipped");
                  handleNext();
                }}
              >
                {t("onboarding.student.skip")}
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!isManualSchool ? !selectedSchool : !manualSchool}
              >
                {t("onboarding.student.continue")}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step animate-slide-up">
            <h3>{t("onboarding.student.step3.headline")}</h3>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full select-input"
            >
              <option value="">
                {t("onboarding.student.classPlaceholder")}
              </option>
              <option value="Class 5">{t("onboarding.student.class5")}</option>
              <option value="Class 6">{t("onboarding.student.class6")}</option>
              <option value="Class 7">{t("onboarding.student.class7")}</option>
            </select>

            <button
              className="btn-primary mt-6 w-full"
              onClick={handleComplete}
              disabled={!selectedClass}
            >
              {t("onboarding.student.finish")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOnboarding;
