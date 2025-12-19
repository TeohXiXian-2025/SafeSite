'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Volume2, VolumeX, Speaker } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export default function IncidentAlert({ incident, onClose, autoClose = true }) {
  const { selectedLanguage, getTranslatedText } = useSafety();
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play alert sound and read out message when component mounts
  useEffect(() => {
    if (!isMuted && incident) {
      playAlertSound();
      speakAlertMessage(incident);
    }

    // Auto-close after 10 seconds if autoClose is true
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [incident, isMuted, autoClose]);

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

  const speakAlertMessage = (incident) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance();
      
      // Get translated message based on selected language
      const urgencyPrefix = incident.severity === 'critical' ?
        (selectedLanguage === 'malay' ? 'KECemasan! KECemasan!' :
         selectedLanguage === 'rojak' ? 'EMERGENCY! KECemasan!' : 'EMERGENCY! EMERGENCY!') :
        incident.severity === 'high' ?
        (selectedLanguage === 'malay' ? 'AMARAN! AMARAN!' :
         selectedLanguage === 'rojak' ? 'WARNING! AMARAN!' : 'WARNING! WARNING!') :
        (selectedLanguage === 'malay' ? 'PERHATIAN!' :
         selectedLanguage === 'rojak' ? 'ATTENTION! PERHATIAN!' : 'ATTENTION!');
      
      const safetyAlert = selectedLanguage === 'malay' ? 'Amaran Keselamatan!' :
                        selectedLanguage === 'rojak' ? 'Safety Alert! Amaran Keselamatan!' : 'Safety Alert!';
      
      const severity = selectedLanguage === 'malay' ? 'Keterukan' :
                      selectedLanguage === 'rojak' ? 'Severity / Keterukan' : 'Severity';
      
      const location = selectedLanguage === 'malay' ? 'Lokasi' :
                     selectedLanguage === 'rojak' ? 'Location / Lokasi' : 'Location';
      
      const takeAction = selectedLanguage === 'malay' ? 'Ambil tindakan segera!' :
                       selectedLanguage === 'rojak' ? 'Take immediate action! Ambil tindakan segera!' : 'Take immediate action!';
      
      const message = `${urgencyPrefix} ${safetyAlert} ${incident.title}. ${severity}: ${incident.severity.toUpperCase()}. ${location}: ${incident.location}. ${takeAction}`;
      
      utterance.text = message;
      
      // Set language based on selection
      if (selectedLanguage === 'malay') {
        utterance.lang = 'ms-MY'; // Malay
      } else if (selectedLanguage === 'rojak') {
        utterance.lang = 'en-MY'; // Malaysian English for mixed language
      } else {
        utterance.lang = 'en-MY'; // Malaysian English
      }
      
      utterance.rate = 1.3; // Faster for urgency
      utterance.pitch = 1.2; // Higher pitch for emergency tone
      utterance.volume = 1.0; // Maximum volume
      
      // Select appropriate voice based on language
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice;
      
      if (selectedLanguage === 'malay') {
        // Try to find Malay voice
        preferredVoice = voices.find(voice =>
          voice.lang.includes('ms') || voice.lang.includes('Malay')
        );
      }
      
      // Fallback to English voice if no specific language voice found
      if (!preferredVoice) {
        preferredVoice = voices.find(voice =>
          voice.name.includes('Female') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Karen') ||
          voice.name.includes('Zira') ||
          voice.lang.includes('en')
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Event handlers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Speak the message
      window.speechSynthesis.speak(utterance);
    }
  };

  const repeatMessage = () => {
    if (incident && !isMuted) {
      speakAlertMessage(incident);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Stop any ongoing speech when muting
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    } else if (incident) {
      // Resume speaking if unmuting
      speakAlertMessage(incident);
    }
  };

  const handleClose = () => {
    // Stop any ongoing speech when closing
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/90';
      case 'high': return 'border-orange-500 bg-orange-500/90';
      case 'medium': return 'border-yellow-500 bg-yellow-500/90';
      case 'low': return 'border-blue-500 bg-blue-500/90';
      default: return 'border-gray-500 bg-gray-500/90';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (!incident || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className={`fixed top-4 right-4 z-50 max-w-md border-2 rounded-lg shadow-2xl ${getSeverityColor(incident.severity)}`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <AlertTriangle className={`w-6 h-6 ${getSeverityTextColor(incident.severity)}`} />
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-lg">NEW INCIDENT ALERT</h3>
                <p className={`text-sm font-semibold ${getSeverityTextColor(incident.severity)}`}>
                  {incident.severity.toUpperCase()} SEVERITY
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={repeatMessage}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                title="Repeat Message"
                disabled={isMuted}
              >
                <Speaker className={`w-4 h-4 ${isMuted ? 'text-gray-600' : 'text-construction-yellow'} ${isSpeaking ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={handleClose}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Incident Details */}
          <div className="space-y-2 mb-3">
            <h4 className="font-semibold text-white">{incident.title}</h4>
            <p className="text-sm text-gray-300">{incident.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>📍 {incident.location}</span>
              <span>🕐 {incident.time}</span>
              <span>👤 {incident.reportedBy || 'System'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="flex-1 px-3 py-2 bg-construction-yellow text-black font-semibold rounded hover:bg-yellow-400 transition-colors text-sm"
            >
              Acknowledge & Review
            </button>
            <button
              onClick={repeatMessage}
              disabled={isMuted}
              className={`px-3 py-2 font-semibold rounded transition-colors text-sm ${
                isMuted
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSpeaking ? 'Speaking...' : 'Repeat Alert'}
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-500 transition-colors text-sm"
            >
              Dismiss
            </button>
          </div>
          
          {/* Voice Status Indicator */}
          {isSpeaking && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-construction-yellow">
              <Speaker className="w-3 h-3 animate-pulse" />
              <span>ILMU AI is speaking...</span>
            </div>
          )}

          {/* Progress Bar (auto-close timer) */}
          {autoClose && (
            <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 10, ease: 'linear' }}
                className="h-full bg-construction-yellow"
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}