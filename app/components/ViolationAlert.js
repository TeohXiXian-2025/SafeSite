'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { AlertTriangle, X, Volume2, Speaker, Phone } from 'lucide-react';

export default function ViolationAlert() {
  const { showAlert, alertMessage, alertViolationType, setShowAlert, selectedLanguage, getTranslatedText } = useSafety();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isCalling, setIsCalling] = useState(false);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Enhanced voice logging for debugging
      console.log('=== VOICE DEBUGGING INFO ===');
      console.log('Browser:', navigator.userAgent);
      console.log('Platform:', navigator.platform);
      console.log('Total voices available:', voices.length);
      console.log('All voices:');
      voices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - Default: ${voice.default}`);
      });
      
      // Log preferred voices for each language
      const malayVoices = voices.filter(v => v.lang.includes('ms') || v.lang.includes('id'));
      const englishVoices = voices.filter(v => v.lang.includes('en'));
      
      console.log('Malay/Indonesian voices:', malayVoices.map(v => v.name));
      console.log('English voices:', englishVoices.map(v => v.name));
      console.log('=== END VOICE DEBUGGING ===');
    };

    loadVoices();
    
    // Voices might load asynchronously, so listen for the event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
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

  // Removed the complex Malay audio alert system to prevent language switching issues
  // Now using unified TTS approach for all languages

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

  // Simple test function for debugging speech
  const testSpeech = () => {
    console.log('=== SPEECH TEST ===');
    console.log('Speech synthesis supported:', 'speechSynthesis' in window);
    console.log('Available voices:', window.speechSynthesis.getVoices().length);
    console.log('Current language:', selectedLanguage);
    
    if ('speechSynthesis' in window) {
      const testUtterance = new SpeechSynthesisUtterance('Test speech. This is a test.');
      testUtterance.lang = selectedLanguage === 'malay' || selectedLanguage === 'rojak' ? 'ms-MY' : 'en-US';
      testUtterance.rate = 1.0;
      testUtterance.pitch = 1.0;
      
      testUtterance.onstart = () => console.log('Test speech started');
      testUtterance.onend = () => console.log('Test speech ended');
      testUtterance.onerror = (e) => console.error('Test speech error:', e);
      
      window.speechSynthesis.speak(testUtterance);
    }
    console.log('=== END SPEECH TEST ===');
  };

  const speakAlertMessage = (message) => {
    console.log('ViolationAlert - speakAlertMessage called with:', message);
    console.log('ViolationAlert - selectedLanguage:', selectedLanguage);
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech immediately
      window.speechSynthesis.cancel();
      
      // Speak immediately without complex timing
      speakAlertMessageInternal(message, selectedLanguage, alertViolationType);
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const speakAlertMessageInternal = (message, language, violationType) => {
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance();
        
        // Configure based on language parameter (not selectedLanguage state)
        if (language === 'malay') {
          // For Malay, use the same message as displayed to ensure consistency
          // Extract the violation type and use the proper Malay translation
          let malayMessage = message;
          
          // If the message is in English, translate it to Malay based on violation type
          if (message.includes('WARNING:') || message.includes('Unhooked') || message.includes('Unauthorized')) {
            const workerMatch = message.match(/Worker:\s*([A-Za-z\s]+)/);
            const workerName = workerMatch ? workerMatch[1].trim() : 'Unknown';
            
            if (alertViolationType === 'UNHOOKED HARNESS') {
              malayMessage = 'AMARAN: Tali pinggang keselamatan tidak dipasang. (Worker: ' + workerName + ')';
            } else if (alertViolationType === 'NO HELMET') {
              malayMessage = 'AMARAN: Topi keselamatan tidak dipakai. (Worker: ' + workerName + ')';
            } else if (alertViolationType === 'UNAUTHORIZED ACCESS') {
              malayMessage = 'AMARAN: Akses tanpa kebenaran ke kawasan terhad. (Worker: ' + workerName + ')';
            }
          }
          
          utterance.text = malayMessage;
          utterance.lang = 'ms-MY';
          utterance.rate = 0.95; // Slightly adjusted for better clarity
          utterance.pitch = 1.05; // More natural pitch
      } else if (language === 'rojak') {
        // For Bahasa Rojak, override with natural Malaysian-style urgent speech
        // Extract worker name from the message
        const workerMatch = message.match(/Worker:\s*([A-Za-z\s]+)/);
        const workerName = workerMatch ? workerMatch[1].trim() : 'Rahman';
        
        // Create different messages based on violation type with authentic Malaysian slang
        let rojakMessage = '';
        if (alertViolationType === 'UNHOOKED HARNESS') {
          rojakMessage = `Woi ${workerName}! Tali safety tak pasang lagi ke? Alamak, gila bahaya weh! Cepat pasang la, nanti terjun dari atas! Jangan gila-gila dah!`;
        } else if (alertViolationType === 'NO HELMET') {
          rojakMessage = `Eh ${workerName}! Topi kepala tak pakai pulak? Kau nak mampus ke? Kepala kau hancur nanti kalau kena batu! Cepat pakai, jangan bodoh!`;
        } else if (alertViolationType === 'UNAUTHORIZED ACCESS') {
          rojakMessage = `Hei ${workerName}! Apa hal kau masuk sini? Ini kawasan privet la weh! Keluar cepat sebelum aku panggil guard! Jangan jaga muka je!`;
        } else {
          // Default message for other violations
          rojakMessage = `Woi ${workerName}! Perhatian sikit la! Bahaya gila kat sini! Jangan jadi hero, ikut je peraturan!`;
        }
        
        utterance.text = rojakMessage;
        utterance.lang = 'ms-MY';
        utterance.rate = 1.05; // Slightly slower for better comprehension
        utterance.pitch = 1.1; // More natural but still urgent
        utterance.volume = 1.0;
        
        console.log('ViolationAlert - Rojak message (working version):', rojakMessage);
        console.log('ViolationAlert - Violation type:', alertViolationType);
      } else {
        // English
        utterance.text = message;
        utterance.lang = 'en-US';
        utterance.rate = 1.1; // Slightly slower for better clarity
        utterance.pitch = 1.1; // More natural pitch
      }
      
      utterance.volume = 1.0;
      
      // Get available voices
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      let preferredVoice;
      
      if (language === 'malay' || language === 'rojak') {
        // For Malay and Rojak, try Malay/Indonesian voices first
        preferredVoice = voices.find(voice =>
          voice.lang.includes('ms') ||
          voice.lang.includes('id') ||
          voice.name.includes('Malay') ||
          voice.name.includes('Indonesian') ||
          voice.name.includes('Malaysia')
        );
        
        // If no Malay voice, try high-quality English voices that work well across platforms
        if (!preferredVoice) {
          preferredVoice = voices.find(voice =>
            (voice.lang.includes('en-US') || voice.lang.includes('en-GB')) &&
            (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Siri'))
          ) || voices.find(voice => voice.lang.includes('en') && voice.default);
        }
      } else {
        // For English, prioritize cross-platform compatible voices
        preferredVoice = voices.find(voice =>
          (voice.name.includes('Google') && voice.lang.includes('en')) ||
          (voice.name.includes('Microsoft') && voice.lang.includes('en')) ||
          (voice.name.includes('Siri') && voice.lang.includes('en')) ||
          voice.name.includes('Karen') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Zira')
        ) || voices.find(voice => voice.lang.includes('en') && voice.default);
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name, 'Language:', preferredVoice.lang, 'Selected Language:', language);
      } else {
        console.log('No preferred voice found, using default');
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('Speech started for', language, ':', utterance.text);
        console.log('Speech settings - lang:', utterance.lang, 'rate:', utterance.rate, 'pitch:', utterance.pitch);
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('Speech completed for', language);
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('Speech error for', language, ':', event);
        console.error('Error details:', event.error, event.message);
        setIsSpeaking(false);
        // Retry once if there's an error
        if (!event.hasRetried) {
          event.hasRetried = true;
          setTimeout(() => {
            console.log('Retrying speech for', language);
            window.speechSynthesis.speak(utterance);
          }, 500);
        }
      };
      
      // Simple speech execution without complex timing
      console.log('About to speak:', utterance.text);
      console.log('Voice being used:', utterance.voice ? utterance.voice.name : 'default');
      window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (showAlert) {
      // Play alert sound
      playAlertSound();
      
      // Speak the alert message
      speakAlertMessage(alertMessage);
      
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
                  title="Repeat Message"
                >
                  <Speaker className={`w-4 h-4 text-white ${isSpeaking ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={testSpeech}
                  className="p-1 hover:bg-red-600 rounded transition-colors"
                  title="Test Speech"
                >
                  <Volume2 className="w-4 h-4 text-white" />
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