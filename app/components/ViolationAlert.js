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
  const [speechPermissionGranted, setSpeechPermissionGranted] = useState(false);
  const [speechError, setSpeechError] = useState(null);

  // Helper function to select best Malay voice
  const selectBestMalayVoice = (voices) => {
    // Priority 1: Malaysian voices
    let voice = voices.find(v => v.lang.includes('ms-MY') || v.lang.includes('ms-ID'));
    if (voice) return voice;
    
    // Priority 2: Indonesian voices
    voice = voices.find(v => v.lang.includes('id-ID'));
    if (voice) return voice;
    
    // Priority 3: Any Malay/Indonesian voice
    voice = voices.find(v => v.lang.includes('ms') || v.lang.includes('id'));
    if (voice) return voice;
    
    // Priority 4: Google voices with Malay in name
    voice = voices.find(v => v.name.toLowerCase().includes('malay') && v.name.toLowerCase().includes('google'));
    if (voice) return voice;
    
    // Priority 5: Microsoft voices with Malay in name
    voice = voices.find(v => v.name.toLowerCase().includes('malay') && v.name.toLowerCase().includes('microsoft'));
    if (voice) return voice;
    
    return null;
  };

  // Load voices when component mounts and check speech support
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Enhanced voice logging for debugging
      console.log('=== VOICE DEBUGGING INFO ===');
      console.log('Browser:', navigator.userAgent);
      console.log('Platform:', navigator.platform);
      console.log('Protocol:', window.location.protocol);
      console.log('Total voices available:', voices.length);
      console.log('All voices:');
      voices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - Default: ${voice.default} - Local: ${voice.localService}`);
      });
      
      // Log preferred voices for each language
      const malayVoices = voices.filter(v => v.lang.includes('ms') || v.lang.includes('id'));
      const englishVoices = voices.filter(v => v.lang.includes('en'));
      
      console.log('Malay/Indonesian voices:', malayVoices.map(v => `${v.name} (${v.lang})`));
      console.log('English voices:', englishVoices.map(v => `${v.name} (${v.lang})`));
      
      // Test voice selection logic
      console.log('=== TESTING VOICE SELECTION ===');
      const testMalayVoice = selectBestMalayVoice(voices);
      console.log('Best Malay voice selected:', testMalayVoice ? `${testMalayVoice.name} (${testMalayVoice.lang})` : 'None found');
      console.log('=== END VOICE DEBUGGING ===');
    };

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      setSpeechError('Speech synthesis not supported in this browser');
      return;
    }

    // Check if we're on HTTPS (GitHub Pages)
    if (window.location.protocol === 'https:') {
      console.log('Running on HTTPS - speech synthesis requires user interaction');
      setSpeechError('Click the speaker button to enable speech alerts');
    } else {
      console.log('Running on HTTP - speech synthesis should work automatically');
      setSpeechPermissionGranted(true);
    }

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

  // Simple test function for debugging speech - now requires user interaction
  const testSpeech = () => {
    try {
      console.log('=== BASIC SPEECH TEST ===');
      
      if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis NOT supported');
        alert('Speech synthesis not supported in this browser');
        return;
      }
      
      console.log('Speech synthesis supported');
      console.log('Voices available:', window.speechSynthesis.getVoices().length);
      
      // Grant permission on user interaction
      setSpeechPermissionGranted(true);
      setSpeechError(null);
      
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      // Create very simple test utterance
      const testUtterance = new SpeechSynthesisUtterance('Test speech. Hello world.');
      testUtterance.lang = 'en-US';
      testUtterance.rate = 1.0;
      testUtterance.pitch = 1.0;
      testUtterance.volume = 1.0;
      
      testUtterance.onstart = () => {
        console.log('✅ Test speech STARTED successfully');
        setIsSpeaking(true);
      };
      
      testUtterance.onend = () => {
        console.log('✅ Test speech ENDED successfully');
        setIsSpeaking(false);
      };
      
      testUtterance.onerror = (e) => {
        console.error('❌ Test speech FAILED:', e);
        setIsSpeaking(false);
        setSpeechError('Speech test failed: ' + e.error);
      };
      
      // Speak
      window.speechSynthesis.speak(testUtterance);
      console.log('Test speech command sent');
      
    } catch (error) {
      console.error('❌ Speech test error:', error);
      setIsSpeaking(false);
      setSpeechError('Speech test error: ' + error.message);
    }
    
    console.log('=== END BASIC SPEECH TEST ===');
  };

  const speakAlertMessage = (message) => {
    console.log('ViolationAlert - speakAlertMessage called with:', message);
    console.log('ViolationAlert - selectedLanguage:', selectedLanguage);
    console.log('ViolationAlert - speechPermissionGranted:', speechPermissionGranted);
    
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      setSpeechError('Speech synthesis not supported in this browser');
      return;
    }

    // Check if we have permission (user interaction) for HTTPS
    if (window.location.protocol === 'https:' && !speechPermissionGranted) {
      console.log('Speech synthesis requires user interaction on HTTPS');
      setSpeechError('Click the speaker button to enable speech alerts');
      return;
    }
    
    // Cancel any ongoing speech immediately
    window.speechSynthesis.cancel();
    
    // Speak immediately without complex timing
    speakAlertMessageInternal(message, selectedLanguage, alertViolationType);
  };

  const speakAlertMessageInternal = (message, language, violationType) => {
    try {
      console.log('=== SIMPLE SPEECH START ===');
      console.log('Message:', message);
      console.log('Language:', language);
      console.log('Violation Type:', violationType);
      
      // Check if speech synthesis is available
      if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported');
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Simple message selection
      let textToSpeak = message;
      let langToUse = 'en-US';
      
      if (language === 'malay') {
        if (violationType === 'UNHOOKED HARNESS') {
          textToSpeak = 'AMARAN: Tali pinggang keselamatan tidak dipasang';
        } else if (violationType === 'NO HELMET') {
          textToSpeak = 'AMARAN: Topi keselamatan tidak dipakai';
        } else if (violationType === 'UNAUTHORIZED ACCESS') {
          textToSpeak = 'AMARAN: Akses tanpa kebenaran';
        }
        langToUse = 'ms-MY';
      } else if (language === 'rojak') {
        // Malaysian slang optimized for Indonesian TTS compatibility
        if (violationType === 'UNHOOKED HARNESS') {
          textToSpeak = 'Woi! Tali safety tidak terikat lagi! Bahaya sekali! Cepat ikat!';
        } else if (violationType === 'NO HELMET') {
          textToSpeak = 'Eh! Tidak pakai helmet? Bisa jatuh kepala! Pakai sekarang juga!';
        } else if (violationType === 'UNAUTHORIZED ACCESS') {
          textToSpeak = 'Hei! Apa yang kamu lakukan di sini? Kawasan dilarang! Keluar sekarang!';
        }
        langToUse = 'id-ID'; // Use Indonesian for better compatibility
      }
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langToUse;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Simplified and more direct voice selection
      if (language === 'malay' || language === 'rojak') {
        // Always try to use the best available voice, but prioritize clarity
        const bestMalayVoice = selectBestMalayVoice(availableVoices);
        const bestEnglishVoice = availableVoices.find(voice =>
          voice.lang.includes('en-US') &&
          (voice.name.toLowerCase().includes('google') ||
           voice.name.toLowerCase().includes('microsoft'))
        ) || availableVoices.find(voice => voice.default && voice.lang.includes('en'));
        
        // Prefer Malay voice if available, otherwise use best English voice
        const selectedVoice = bestMalayVoice || bestEnglishVoice;
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
          console.log('Selected voice for', language, ':', selectedVoice.name, '(', selectedVoice.lang, ')');
          
          // Adjust parameters based on voice type
          if (bestMalayVoice) {
            utterance.rate = 0.9; // Slower for Malay
            utterance.pitch = 1.0;
          } else {
            utterance.rate = 1.1; // Slightly faster for English with Malaysian words
            utterance.pitch = 1.1; // Slightly higher for urgency
          }
          utterance.volume = 1.0;
        }
        
        // For rojak, use Malaysian slang optimized for Indonesian TTS
        if (language === 'rojak') {
          if (violationType === 'UNHOOKED HARNESS') {
            textToSpeak = 'Woi! Tali safety tidak terikat lagi! Bahaya sekali! Cepat ikat!';
          } else if (violationType === 'NO HELMET') {
            textToSpeak = 'Eh! Tidak pakai helmet? Bisa jatuh kepala! Pakai sekarang juga!';
          } else if (violationType === 'UNAUTHORIZED ACCESS') {
            textToSpeak = 'Hei! Apa yang kamu lakukan di sini? Kawasan dilarang! Keluar sekarang!';
          }
        }
      } else {
        // English voice selection
        const voices = availableVoices;
        let preferredVoice = voices.find(voice =>
          voice.lang.includes('en-US') &&
          (voice.name.toLowerCase().includes('google') ||
           voice.name.toLowerCase().includes('microsoft') ||
           voice.name.toLowerCase().includes('siri'))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log('Selected voice for English:', preferredVoice.name);
        }
      }
      
      // Simple event handlers
      utterance.onstart = () => {
        console.log('Speech started:', textToSpeak);
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        setIsSpeaking(false);
      };
      
      // Speak immediately
      console.log('Speaking now:', textToSpeak);
      window.speechSynthesis.speak(utterance);
      
      console.log('=== SIMPLE SPEECH END ===');
    } catch (error) {
      console.error('Speech function error:', error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      // Play alert sound
      playAlertSound();
      
      // Only speak automatically if we have permission (HTTP or user granted)
      if (speechPermissionGranted) {
        speakAlertMessage(alertMessage);
      }
      
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
  }, [showAlert, setShowAlert, alertMessage, selectedLanguage, speechPermissionGranted]);

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
                  onClick={() => {
                    // Grant permission and speak when user clicks
                    setSpeechPermissionGranted(true);
                    setSpeechError(null);
                    speakAlertMessage(alertMessage);
                  }}
                  className="p-1 hover:bg-red-600 rounded transition-colors"
                  title={speechPermissionGranted ? "Repeat Message" : "Click to Enable Speech"}
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