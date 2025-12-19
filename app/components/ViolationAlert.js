'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { AlertTriangle, X, Volume2, Speaker, Phone } from 'lucide-react';

export default function ViolationAlertFIXED() {
  const { showAlert, alertMessage, alertViolationType, setShowAlert, selectedLanguage, getTranslatedText } = useSafety();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [speechPermissionGranted, setSpeechPermissionGranted] = useState(false);
  const [speechError, setSpeechError] = useState(null);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('=== VIOLATION ALERT VOICES ===');
      const indonesianVoice = voices.find(v => v.lang.includes('id-ID'));
      const hindiVoice = voices.find(v => v.lang.includes('hi-IN'));
      const englishVoice = voices.find(v => v.lang.includes('en-US') && v.default);
      
      console.log('Indonesian voice:', indonesianVoice ? indonesianVoice.name : 'NOT FOUND');
      console.log('Hindi voice:', hindiVoice ? hindiVoice.name : 'NOT FOUND');
      console.log('English voice:', englishVoice ? englishVoice.name : 'NOT FOUND');
      console.log('=== END VIOLATION ALERT VOICES ===');
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const playAlertSound = () => {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // 800 Hz tone
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Play a second beep after 200ms
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        osc2.frequency.value = 800;
        osc2.type = 'sine';

        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
      }, 200);
    } catch (error) {
      console.log('Audio playback not supported:', error);
    }
  };

  const extractWorkerInfo = (message) => {
    // Extract worker name from alert message
    const workerMatch = message.match(/Worker:\s*([A-Za-z]+)/);
    return workerMatch ? workerMatch[1] : 'Unknown';
  };

  const callWorker = () => {
    const workerName = extractWorkerInfo(alertMessage);
    setIsCalling(true);
    
    // Simulate calling the worker
    console.log(`Calling worker: ${workerName}`);
    
    // Simulate call duration
    setTimeout(() => {
      setIsCalling(false);
      console.log(`Call ended with worker: ${workerName}`);
    }, 3000);
  };

  // SIMPLIFIED SPEECH FUNCTION WITH MALE VOICES AND URGENCY
  const speakAlertMessage = (message) => {
    console.log('🚨 VIOLATION ALERT SPEAK:', message, 'LANG:', selectedLanguage);
    
    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech not supported');
      setSpeechError('Speech not supported');
      return;
    }

    // Grant permission on user interaction
    setSpeechPermissionGranted(true);
    setSpeechError(null);

    try {
      // Cancel any previous speech
      window.speechSynthesis.cancel();
      
      // Select text based on language and violation type
      let textToSpeak = message;
      
      if (selectedLanguage === 'malay') {
        if (alertViolationType === 'UNHOOKED HARNESS') {
          textToSpeak = 'AMARAN! TALI SAFETY TIDAK DIKUKUH! BAHAYA! PASTIKAN TALI SAFETY DIKUKUH SEKARANG!';
        } else if (alertViolationType === 'NO HELMET') {
          textToSpeak = 'AMARAN! HELMET TIDAK DIPAKAI! RISIKO KEPALA CEDERA! PAKAI HELMET SEKARANG!';
        } else if (alertViolationType === 'UNAUTHORIZED ACCESS') {
          textToSpeak = 'AMARAN! AKSES TANPA IZIN! KAWASAN TERHAD! KELUAR DARI KAWASAN INI SEKARANG!';
        }
      } else if (selectedLanguage === 'rojak') {
        if (alertViolationType === 'UNHOOKED HARNESS') {
          textToSpeak = 'WOI! TALI SAFETY LEPAS! BAHAYA GILA! IKAT BALIK SEKARANG JANGAN BIARKAN!';
        } else if (alertViolationType === 'NO HELMET') {
          textToSpeak = 'EH! PAKAI HELMET LA! KEPALA BOLEH PECAH! PAKAI SEKARANG JUGA!';
        } else if (alertViolationType === 'UNAUTHORIZED ACCESS') {
          textToSpeak = 'HEI! SIAPA KAU MASUK SINI? KAWASAN LARANG! KELUAR CEPAT DARI SINI!';
        }
      } else if (selectedLanguage === 'bengali') {
        if (alertViolationType === 'UNHOOKED HARNESS') {
          textToSpeak = 'সতর্কতা! নিরাপত্তা বেল্ট খোলা! বিপদ! এখনই নিরাপত্তা বেল্ট বাঁধুন!';
        } else if (alertViolationType === 'NO HELMET') {
          textToSpeak = 'সতর্কতা! হেলমেট নেই! মাথার আঘাতের ঝুঁকি! এখনই হেলমেট পরুন!';
        } else if (alertViolationType === 'UNAUTHORIZED ACCESS') {
          textToSpeak = 'সতর্কতা! অননুমোদিত প্রবেশ! সীমাবদ্ধ এলাকা! এখনই এখান থেকে বেরিয়ে যান!';
        }
      }
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // SIMPLE LANGUAGE MAPPING
      if (selectedLanguage === 'malay' || selectedLanguage === 'rojak') {
        utterance.lang = 'id-ID'; // Indonesian for Malay
      } else if (selectedLanguage === 'bengali') {
        utterance.lang = 'hi-IN'; // Hindi for Bengali
      } else {
        utterance.lang = 'en-US'; // English
      }
      
      // URGENT SETTINGS - Even more aggressive for alerts
      utterance.rate = 1.6; // Much faster for urgency
      utterance.pitch = 0.6; // Much lower pitch for male voice sound
      utterance.volume = 1.0; // Maximum volume
      
      // FORCE MALE VOICE SELECTION
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      console.log('=== AVAILABLE VOICES FOR MALE SELECTION ===');
      voices.forEach((v, i) => {
        console.log(`${i+1}. ${v.name} (${v.lang})`);
      });
      
      if (selectedLanguage === 'malay' || selectedLanguage === 'rojak') {
        // Force Microsoft David (English male) for Indonesian text - works better
        selectedVoice = voices.find(v => v.name.includes('Microsoft David')) ||
                       voices.find(v => v.name.includes('Google')) ||
                       voices.find(v => v.lang.includes('id-ID'));
        console.log('Malay/Rojak selected voice:', selectedVoice?.name);
      } else if (selectedLanguage === 'bengali') {
        // Force Microsoft David for Hindi text - more reliable
        selectedVoice = voices.find(v => v.name.includes('Microsoft David')) ||
                       voices.find(v => v.name.includes('Google')) ||
                       voices.find(v => v.lang.includes('hi-IN'));
        console.log('Bengali selected voice:', selectedVoice?.name);
      } else {
        // Force Microsoft David for English
        selectedVoice = voices.find(v => v.name.includes('Microsoft David')) ||
                       voices.find(v => v.name.includes('Microsoft Mark')) ||
                       voices.find(v => v.name.includes('Google')) ||
                       voices.find(v => v.lang.includes('en-US') && v.default);
        console.log('English selected voice:', selectedVoice?.name);
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Alert Voice (Male):', selectedVoice.name);
      } else {
        console.log('⚠️ Using default voice for alert');
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('✅ Alert speech started (URGENT)');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('✅ Alert speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (e) => {
        console.error('❌ Alert speech error:', e.error);
        setIsSpeaking(false);
        setSpeechError('Alert speech failed: ' + e.error);
      };
      
      // Speak!
      window.speechSynthesis.speak(utterance);
      console.log('🚨 Speaking URGENT alert...');
      
    } catch (error) {
      console.error('❌ Alert speech error:', error);
      setIsSpeaking(false);
      setSpeechError('Alert speech error: ' + error.message);
    }
  };

  useEffect(() => {
    if (showAlert) {
      // Play alert sound immediately
      playAlertSound();
      
      // Speak immediately with popup - grant permission automatically for alerts
      setSpeechPermissionGranted(true);
      setSpeechError(null);
      
      // Small delay to ensure popup is visible, then speak immediately
      setTimeout(() => {
        speakAlertMessage(alertMessage);
      }, 100);
      
      // Auto-hide after 6 seconds for all languages
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 6000);

      return () => {
        clearTimeout(timer);
        // Stop any ongoing speech when component unmounts
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [showAlert, setShowAlert, alertMessage, selectedLanguage]);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          exit={{ 
            scale: 0, 
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          className="alert-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
        >
          <div className="bg-red-600 border-4 border-red-400 rounded-lg shadow-2xl min-w-[400px] max-w-[600px] animate-vibrate">
            {/* Alert Header */}
            <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">SAFETY VIOLATION</h2>
                  <p className="text-red-200 text-sm">Immediate Action Required</p>
                </div>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="p-2 hover:bg-red-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Alert Content */}
            <div className="px-6 py-4 bg-red-600">
              <div className="flex items-start space-x-3">
                <Volume2 className="w-6 h-6 text-white mt-1 animate-pulse" />
                <div className="flex-1">
                  <p className="text-white text-lg font-semibold leading-relaxed">
                    {alertMessage}
                  </p>
                  {speechError && (
                    <p className="text-yellow-300 text-sm mt-2">
                      {speechError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Alert Footer */}
            <div className="bg-red-700 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">LIVE ALERT</span>
                {isSpeaking && (
                  <div className="flex items-center space-x-1 text-yellow-300">
                    <Speaker className="w-3 h-3 animate-pulse" />
                    <span className="text-xs">Speaking...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={callWorker}
                  disabled={isCalling}
                  className={`p-2 rounded transition-colors flex items-center space-x-1 ${
                    isCalling
                      ? 'bg-green-600 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  title={isCalling ? 'Calling...' : 'Call Worker'}
                >
                  <Phone className={`w-4 h-4 text-white ${isCalling ? 'animate-pulse' : ''}`} />
                  <span className="text-white text-xs">
                    {isCalling ? 'Calling...' : 'Call'}
                  </span>
                </button>
                <button
                  onClick={() => speakAlertMessage(alertMessage)}
                  className="p-1 hover:bg-red-600 rounded transition-colors"
                  title={speechPermissionGranted ? "Repeat Message" : "Click to Enable Speech"}
                >
                  <Speaker className={`w-4 h-4 text-white ${isSpeaking ? 'animate-pulse' : ''}`} />
                </button>
                <div className="text-white text-sm">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Pulsing Border Effect */}
            <div className="absolute inset-0 border-4 border-red-400 rounded-lg pointer-events-none">
              <motion.div
                className="absolute inset-0 border-4 border-red-300 rounded-lg"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}