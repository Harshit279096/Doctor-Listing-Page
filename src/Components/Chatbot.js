import React, { useState } from 'react';
import './Chatbot.css';

const symptomMap = {
  fever: 'General Physician',
  cold: 'General Physician',
  cough: 'General Physician',
  headache: 'General Physician',
  stomachache: 'General Physician',
  sleep: 'General Physician',
  migraine: 'Neurologist',
  dizziness: 'Neurologist',
  toothache: 'Dentist',
  teeth: 'Dentist',
  mouth: 'General Physician',
  ulcer:'General Physician',
  tooth: 'Dentist',
  teethpain: 'Dentist',
  toothpain: 'Dentist',
  gum: 'Dentist',
  eye: 'Ophthalmologist',
  eyes: 'Ophthalmologist',
  vision: 'Ophthalmologist',
  pregnancy: 'Gynaecologist and Obstetrician',
  period: 'Gynaecologist and Obstetrician',
  menstrual: 'Gynaecologist and Obstetrician',
  skin: 'Dermatologist',
  rash: 'Dermatologist',
  acne: 'Dermatologist',
  allergy: 'Allergist',
  asthma: 'Pulmonologist',
  breathlessness: 'Pulmonologist',
  chestpain: 'Cardiologist',
  heart: 'Cardiologist',
  jointpain: 'Orthopedist',
  arthritis: 'Orthopedist',
  bone: 'Orthopedist',
  backpain: 'Orthopedist',
  muscle: 'Orthopedist',
  bloodpressure: 'Cardiologist',
  hypertension: 'Cardiologist',
  cholesterol: 'Cardiologist',
  diabetes: 'Endocrinologist',
  thyroid: 'Endocrinologist',
  depression: 'Psychiatrist',
  anxiety: 'Psychiatrist',
  homeopathy: 'Homeopath',
  homeopath: 'Homeopath',

  ayurveda: 'Ayurveda',

  digestive: 'Gastroenterologist',
  stomach: 'Gastroenterologist',

  liver: 'Hepatologist',
  kidney: 'Nephrologist',
  ear: 'ENT Specialist',
  nose: 'ENT Specialist',
  throat: 'ENT Specialist',
};

// Simple translation dictionary (English-Hindi)
const translations = {
  en: {
    welcome: "Hi! 👋 What is your preferred language? (English/Hindi)",
    askName: "Great! What is your name?",
    greetUser: (name) => `Nice to meet you, ${name}! 😊 What symptoms are you experiencing?`,
    unknownSymptom: (name) => `Sorry ${name}, I couldn't recognize the symptom. Please try describing it differently.`,
    specialistSuggest: (name, specialist) => `Based on your symptoms, ${name}, you should consult a ${specialist}.`,
    noDoctor: (specialist) => `I suggest seeing a ${specialist}, but I couldn't find any nearby doctors right now.`,
    recommended: "Here are some recommended doctors:"
  },
  hi: {
    welcome: "नमस्ते! 👋 कृपया अपनी पसंदीदा भाषा बताएं (English/Hindi)",
    askName: "शानदार! आपका नाम क्या है?",
    greetUser: (name) => `आपसे मिलकर खुशी हुई, ${name}! 😊 आप किस लक्षण का अनुभव कर रहे हैं?`,
    unknownSymptom: (name) => `माफ़ कीजिए ${name}, मैं इस लक्षण को समझ नहीं पाया। कृपया अलग तरीके से बताएं।`,
    specialistSuggest: (name, specialist) => `${name}, आपके लक्षणों के आधार पर आपको ${specialist} से मिलना चाहिए।`,
    noDoctor: (specialist) => `आपको ${specialist} से मिलना चाहिए, लेकिन पास में कोई डॉक्टर नहीं मिला।`,
    recommended: "यहां कुछ सिफारिश किए गए डॉक्टर हैं:"
  }
};

const Chatbot = ({ doctors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0); // 0: language, 1: name, 2: symptoms
  const [language, setLanguage] = useState('en');
  const [patientName, setPatientName] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: translations['en'].welcome }
  ]);
  const [input, setInput] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = input.trim();
    const newMessages = [...messages, { from: 'user', text: userMessage }];

    if (chatStep === 0) {
      const selectedLang = userMessage.toLowerCase().includes("hindi") ? "hi" : "en";
      setLanguage(selectedLang);
      newMessages.push({ from: 'bot', text: translations[selectedLang].askName });
      setChatStep(1);

    } else if (chatStep === 1) {
      setPatientName(userMessage);
      newMessages.push({ from: 'bot', text: translations[language].greetUser(userMessage) });
      setChatStep(2);

    } else if (chatStep === 2) {
      const symptomKeys = Object.keys(symptomMap);
      const matchedSymptom = symptomKeys.find(sym => userMessage.toLowerCase().includes(sym));

      if (matchedSymptom) {
        const specialist = symptomMap[matchedSymptom];

        let matchedDoctors = doctors.filter(doc =>
          Array.isArray(doc.specialities) &&
          doc.specialities.some(s => s?.name?.toLowerCase() === specialist.toLowerCase())
        );

        if (matchedDoctors.length === 0) {
          matchedDoctors = doctors.filter(doc =>
            Array.isArray(doc.specialities) &&
            doc.specialities.some(s => s?.name?.toLowerCase().includes(specialist.toLowerCase()))
          );
        }

        newMessages.push({ from: 'bot', text: translations[language].specialistSuggest(patientName, specialist) });

        if (matchedDoctors.length > 0) {
          newMessages.push({ from: 'bot', text: translations[language].recommended });
          matchedDoctors.slice(0, 3).forEach(doc => {
            const locality = doc.clinic?.address?.locality || 'Location unknown';
            const city = doc.clinic?.address?.city || '';
            newMessages.push({
              from: 'bot',
              text: `👨‍⚕️ ${doc.name} - ${locality}${city ? ', ' + city : ''}`
            });
          });
        } else {
          newMessages.push({ from: 'bot', text: translations[language].noDoctor(specialist) });
        }

      } else {
        newMessages.push({ from: 'bot', text: translations[language].unknownSymptom(patientName) });
      }
    }

    setMessages(newMessages);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-header">Dr. Wise</div>
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'hi' ? "यहां टाइप करें..." : "Type here..."}
            />
            <button onClick={handleSend}>{language === 'hi' ? "भेजें" : "Send"}</button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="chatbot-help-text">Hey! May I help you?</div>
      )}

      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;