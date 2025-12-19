'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { AlertTriangle, X, Volume2, Speaker, Phone } from 'lucide-react';

export default function ViolationAlert() {
  const { showAlert, alertMessage, setShowAlert, selectedLanguage, getTranslatedText } = useSafety();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isCalling, setIsCalling] = useState(false);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
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

  const speakAlertMessage = (message) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance();
      
      // Configure based on selected language
      if (selectedLanguage === 'malay') {
        // For Malay, use simple Malay text
        let malayMessage = 'Amaran keselamatan.';
        if (message.includes('tali pinggang')) {
          malayMessage = 'Amaran. Tali pinggang keselamatan tidak dipasang. Sila pasang tali pinggang.';
        } else if (message.includes('topi')) {
          malayMessage = 'Amaran. Topi keselamatan tidak dipakai. Sila pakai topi.';
        } else if (message.includes('akses')) {
          malayMessage = 'Amaran. Akses tanpa kebenaran. Sila keluar dari kawasan.';
        }
        
        utterance.text = malayMessage;
        utterance.lang = 'ms-MY';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
      } else if (selectedLanguage === 'rojak') {
        utterance.text = message;
        utterance.lang = 'en-MY';
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
      } else {
        // English
        utterance.text = message;
        utterance.lang = 'en-US';
        utterance.rate = 1.2;
        utterance.pitch = 1.2;
      }
      
      utterance.volume = 1.0;
      
      // Get available voices
      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      let preferredVoice;
      
      if (selectedLanguage === 'malay') {
        // Try Malay/Indonesian voices first
        preferredVoice = voices.find(voice =>
          voice.lang.includes('ms') ||
          voice.lang.includes('id') ||
          voice.name.includes('Malay') ||
          voice.name.includes('Indonesian')
        );
        // Fallback to any English voice if no Malay voice
        if (!preferredVoice) {
          preferredVoice = voices.find(voice =>
            voice.lang.includes('en') &&
            (voice.name.includes('Female') || voice.name.includes('Microsoft'))
          );
        }
      } else {
        // For English and Rojak, use clear English voices
        preferredVoice = voices.find(voice =>
          voice.name.includes('Female') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Karen') ||
          voice.name.includes('Zira') ||
          voice.name.includes('Microsoft Hazel') ||
          voice.name.includes('Microsoft Zira') ||
          (voice.lang.includes('en') && voice.name.includes('Microsoft'))
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Using voice:', preferredVoice.name, 'Language:', preferredVoice.lang, 'Selected Language:', selectedLanguage);
      } else {
        console.log('No preferred voice found, using default');
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('Speech started for', selectedLanguage, ':', utterance.text);
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('Speech completed for', selectedLanguage);
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('Speech error for', selectedLanguage, ':', event);
        setIsSpeaking(false);
      };
      
      // Speak the message
      window.speechSynthesis.speak(utterance);
    }
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