'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import QRCode from 'qrcode';
import {
  QrCode,
  Book,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  User,
  Shield,
  Zap,
  Phone,
  MessageCircle,
  MapPin,
  Settings,
  X,
  Globe,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function WorkerDigitalPassport() {
  const {
    simulateRedZone,
    redZoneActive,
    selectedLanguage,
    setSelectedLanguage,
    addPermit,
    permits,
    currentUser,
    workers,
    sites
  } = useSafety();
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [speechPermissionGranted, setSpeechPermissionGranted] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [permitForm, setPermitForm] = useState({
    type: 'Hot Work',
    location: '',
    description: '',
    duration: '2 hours',
    riskLevel: 'medium'
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const workerInfo = {
    name: 'Ahmed Rahman',
    id: 'WRK-2024-0892',
    role: 'Construction Worker',
    department: 'Structural Works',
    certifications: ['PPE Certified', 'Height Safety', 'First Aid'],
    complianceScore: 98,
    phone: '+6012-345-6789',
    emergencyContact: '+6012-987-6543',
    siteAssigned: 'Kuala Lumpur Tower Project'
  };

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
      
      // Debug voice availability
      console.log('=== WORKER PASSPORT VOICE DEBUG ===');
      const malayVoices = voices.filter(v => v.lang.includes('ms') || v.lang.includes('id'));
      console.log('Malay/Indonesian voices available:', malayVoices.length);
      malayVoices.forEach(v => console.log(`- ${v.name} (${v.lang})`));
      const bestVoice = selectBestMalayVoice(voices);
      console.log('Best Malay voice selected:', bestVoice ? `${bestVoice.name} (${bestVoice.lang})` : 'None');
      console.log('=== END WORKER PASSPORT VOICE DEBUG ===');
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
      setSpeechError('Click the red zone button to enable speech alerts');
    } else {
      console.log('Running on HTTP - speech synthesis should work automatically');
      setSpeechPermissionGranted(true);
    }

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Generate QR Code on component mount only once
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          workerId: workerInfo.id,
          name: workerInfo.name,
          role: workerInfo.role,
          site: workerInfo.siteAssigned,
          timestamp: new Date().toISOString()
        });
        
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQRCode();
  }, []); // Empty dependency array - run only once

  // Translations for all UI text
  const translations = {
    english: {
      digitalPassport: 'Digital Passport',
      scanForVerification: 'Scan for Verification',
      workerInfo: 'Worker Information',
      role: 'Role',
      department: 'Department',
      phone: 'Phone',
      emergency: 'Emergency',
      certifications: 'Certifications',
      sopLibrary: 'SOP Library',
      ladderSafety: 'Ladder Safety',
      craneOperations: 'Crane Operations',
      electricalSafety: 'Electrical Safety',
      chemicalHandling: 'Chemical Handling',
      quickActions: 'Quick Actions',
      emergencyCall: 'Emergency Call',
      supervisorContact: 'Supervisor Contact',
      siteMap: 'Site Map',
      redZoneAlert: 'Red Zone Alert',
      playing: 'Playing...',
      paused: 'Paused',
      speaking: 'Speaking...',
      settings: 'Settings',
      language: 'Language',
      selectLanguage: 'Select Language',
      english: 'English',
      malay: 'Bahasa Melayu',
      bengali: 'বাংলা (Bengali)',
      close: 'Close',
      save: 'Save',
      requestPermit: 'Request Permit',
      permitType: 'Permit Type',
      location: 'Location',
      description: 'Description',
      duration: 'Duration',
      riskLevel: 'Risk Level',
      submitRequest: 'Submit Request',
      hotWork: 'Hot Work',
      confinedSpace: 'Confined Space',
      electricalWork: 'Electrical Work',
      workingAtHeight: 'Working at Height',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      myPermits: 'My Permits',
      pending: 'Pending',
      active: 'Active',
      completed: 'Completed',
      rejected: 'Rejected'
    },
    malay: {
      digitalPassport: 'Pasport Digital',
      scanForVerification: 'Imbas untuk Pengesahan',
      workerInfo: 'Maklumat Pekerja',
      role: 'Peranan',
      department: 'Jabatan',
      phone: 'Telefon',
      emergency: 'Kecemasan',
      certifications: 'Sijil',
      sopLibrary: 'Pustaka SOP',
      ladderSafety: 'Keselamatan Tangga',
      craneOperations: 'Operasi Kren',
      electricalSafety: 'Keselamatan Elektrik',
      chemicalHandling: 'Pengendalian Kimia',
      quickActions: 'Tindakan Pantas',
      emergencyCall: 'Panggilan Kecemasan',
      supervisorContact: 'Hubungi Penyelia',
      siteMap: 'Peta Tapak',
      redZoneAlert: 'Amaran Zon Merah',
      playing: 'Dimainkan...',
      paused: 'Dijeda',
      speaking: 'Bercakap...',
      settings: 'Tetapan',
      language: 'Bahasa',
      selectLanguage: 'Pilih Bahasa',
      english: 'English',
      malay: 'Bahasa Melayu',
      bengali: 'বাংলা (Bengali)',
      close: 'Tutup',
      save: 'Simpan',
      requestPermit: 'Mohon Permit',
      permitType: 'Jenis Permit',
      location: 'Lokasi',
      description: 'Keterangan',
      duration: 'Tempoh',
      riskLevel: 'Tahap Risiko',
      submitRequest: 'Hantar Permohonan',
      hotWork: 'Kerja Panas',
      confinedSpace: 'Ruang Terhad',
      electricalWork: 'Kerja Elektrik',
      workingAtHeight: 'Kerja di Ketinggian',
      low: 'Rendah',
      medium: 'Sederhana',
      high: 'Tinggi',
      myPermits: 'Permit Saya',
      pending: 'Menunggu',
      active: 'Aktif',
      completed: 'Selesai',
      rejected: 'Ditolak'
    },
    bengali: {
      digitalPassport: 'ডিজিটাল পাসপোর্ট',
      scanForVerification: 'যাচাইয়ের জন্য স্ক্যান করুন',
      workerInfo: 'কর্মী তথ্য',
      role: 'ভূমিকা',
      department: 'বিভাগ',
      phone: 'ফোন',
      emergency: 'জরুরি',
      certifications: 'সার্টিফিকেশন',
      sopLibrary: 'SOP লাইব্রেরি',
      ladderSafety: 'সিঁড়ি নিরাপত্তা',
      craneOperations: 'ক্রেন অপারেশন',
      electricalSafety: 'বৈদ্যুতিক নিরাপত্তা',
      chemicalHandling: 'রাসায়নিক পরিচালনা',
      quickActions: 'দ্রুত পদক্ষেপ',
      emergencyCall: 'জরুরি কল',
      supervisorContact: 'সুপারভাইজার যোগাযোগ',
      siteMap: 'সাইট ম্যাপ',
      redZoneAlert: 'রেড জোন সতর্কতা',
      playing: 'চলছে...',
      paused: 'বিরতি',
      speaking: 'কথা বলছে...',
      settings: 'সেটিংস',
      language: 'ভাষা',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      english: 'English',
      malay: 'Bahasa Melayu',
      bengali: 'বাংলা',
      close: 'বন্ধ করুন',
      save: 'সংরক্ষণ করুন',
      requestPermit: 'পারমিট অনুরোধ করুন',
      permitType: 'পারমিটের ধরন',
      location: 'অবস্থান',
      description: 'বর্ণনা',
      duration: 'সময়কাল',
      riskLevel: 'ঝুঁকির স্তর',
      submitRequest: 'অনুরোধ জমা দিন',
      hotWork: 'গরম কাজ',
      confinedSpace: 'সীমিত স্থান',
      electricalWork: 'বৈদ্যুতিক কাজ',
      workingAtHeight: 'উচ্চতায় কাজ',
      low: 'নিম্ন',
      medium: 'মাঝারি',
      high: 'উচ্চ',
      myPermits: 'আমার পারমিট',
      pending: 'অপেক্ষমান',
      active: 'সক্রিয়',
      completed: 'সম্পন্ন',
      rejected: 'প্রত্যাখ্যাত'
    },
    rojak: {
      digitalPassport: 'Digital Passport / Pasport Digital',
      scanForVerification: 'Scan for Verification / Imbas untuk Pengesahan',
      workerInfo: 'Worker Information / Maklumat Pekerja',
      role: 'Role / Peranan',
      department: 'Department / Jabatan',
      phone: 'Phone / Telefon',
      emergency: 'Emergency / Kecemasan',
      certifications: 'Certifications / Sijil',
      sopLibrary: 'SOP Library / Pustaka SOP',
      ladderSafety: 'Ladder Safety / Keselamatan Tangga',
      craneOperations: 'Crane Operations / Operasi Kren',
      electricalSafety: 'Electrical Safety / Keselamatan Elektrik',
      chemicalHandling: 'Chemical Handling / Pengendalian Kimia',
      quickActions: 'Quick Actions / Tindakan Pantas',
      emergencyCall: 'Emergency Call / Panggilan Kecemasan',
      supervisorContact: 'Supervisor Contact / Hubungi Penyelia',
      siteMap: 'Site Map / Peta Tapak',
      redZoneAlert: 'Red Zone Alert / Amaran Zon Merah',
      playing: 'Playing... / Dimainkan...',
      paused: 'Paused / Dijeda',
      speaking: 'Speaking... / Bercakap...',
      settings: 'Settings / Tetapan',
      language: 'Language / Bahasa',
      selectLanguage: 'Select Language / Pilih Bahasa',
      english: 'English',
      malay: 'Bahasa Melayu',
      bengali: 'বাংলা (Bengali)',
      rojak: 'Bahasa Rojak',
      close: 'Close / Tutup',
      save: 'Save / Simpan',
      requestPermit: 'Request Permit / Mohon Permit',
      permitType: 'Permit Type / Jenis Permit',
      location: 'Location / Lokasi',
      description: 'Description / Keterangan',
      duration: 'Duration / Tempoh',
      riskLevel: 'Risk Level / Tahap Risiko',
      submitRequest: 'Submit Request / Hantar Permohonan',
      hotWork: 'Hot Work / Kerja Panas',
      confinedSpace: 'Confined Space / Ruang Terhad',
      electricalWork: 'Electrical Work / Kerja Elektrik',
      workingAtHeight: 'Working at Height / Kerja di Ketinggian',
      low: 'Low / Rendah',
      medium: 'Medium / Sederhana',
      high: 'High / Tinggi',
      myPermits: 'My Permits / Permit Saya',
      pending: 'Pending / Menunggu',
      active: 'Active / Aktif',
      completed: 'Completed / Selesai',
      rejected: 'Rejected / Ditolak'
    },
    malayPlusEnglish: {
      digitalPassport: 'Pasport Digital',
      scanForVerification: 'Imbas untuk Pengesahan',
      workerInfo: 'Maklumat Pekerja',
      role: 'Peranan',
      department: 'Jabatan',
      phone: 'Telefon',
      emergency: 'Kecemasan',
      certifications: 'Sijil',
      sopLibrary: 'Pustaka SOP',
      ladderSafety: 'Keselamatan Tangga',
      craneOperations: 'Operasi Kren',
      electricalSafety: 'Keselamatan Elektrik',
      chemicalHandling: 'Pengendalian Kimia',
      quickActions: 'Tindakan Pantas',
      emergencyCall: 'Panggilan Kecemasan',
      supervisorContact: 'Hubungi Penyelia',
      siteMap: 'Peta Tapak',
      redZoneAlert: 'Amaran Zon Merah',
      playing: 'Dimainkan...',
      paused: 'Dijeda',
      speaking: 'Bercakap...',
      settings: 'Tetapan',
      language: 'Bahasa',
      selectLanguage: 'Pilih Bahasa',
      english: 'English',
      malay: 'Bahasa Melayu',
      bengali: 'বাংলা (Bengali)',
      close: 'Tutup',
      save: 'Simpan',
      requestPermit: 'Mohon Permit',
      permitType: 'Jenis Permit',
      location: 'Lokasi',
      description: 'Keterangan',
      duration: 'Tempoh',
      riskLevel: 'Tahap Risiko',
      submitRequest: 'Hantar Permohonan',
      hotWork: 'Kerja Panas',
      confinedSpace: 'Ruang Terhad',
      electricalWork: 'Kerja Elektrik',
      workingAtHeight: 'Kerja di Ketinggian',
      low: 'Rendah',
      medium: 'Sederhana',
      high: 'Tinggi',
      myPermits: 'Permit Saya',
      pending: 'Menunggu',
      active: 'Aktif',
      completed: 'Selesai',
      rejected: 'Ditolak'
    }
  };

  const t = translations[selectedLanguage] || translations.english;

  const sopCategories = [
    {
      id: 'ladder',
      title: 'Ladder Safety',
      icon: '🪜',
      color: 'bg-blue-500/10 border-blue-500/30',
      audioDuration: 45,
      content: {
        english: 'Always maintain three points of contact when climbing ladders. Inspect ladder before use and ensure it is placed on stable ground.',
        bengali: 'সিঁড়িতে উঠার সময় সর্বদা তিনটি বিন্দুতে যোগাযোগ বজায় রাখুন। ব্যবহারের আগে সিঁড়ি পরিদর্শন করুন এবং নিশ্চিত করুন এটি স্থিতিশীল ভূমিতে রাখা হয়েছে।',
        malay: 'Sentiasa lakukan tiga titik sentuh semasa memanjat tangga. Periksa tangga sebelum digunakan dan pastikan ia diletakkan di atas tanah yang stabil.'
      }
    },
    {
      id: 'crane',
      title: 'Crane Operations',
      icon: '🏗️',
      color: 'bg-yellow-500/10 border-yellow-500/30',
      audioDuration: 60,
      content: {
        english: 'Never exceed load capacity. Ensure all personnel are clear of the swing radius. Use proper hand signals and maintain communication.',
        bengali: 'কখনও লোড ক্ষমতা অতিক্রম করবেন না। নিশ্চিত করুন সমস্ত কর্মী সুইং ব্যাসার্ধ থেকে মুক্ত। সঠিক হাত সংকেত ব্যবহার করুন এবং যোগাযোগ বজায় রাখুন।',
        malay: 'Jangan sekali-kali melebihi kapasiti muatan. Pastikan semua personel berada di luar radius ayunan. Gunakan isyarat tangan yang betul dan kekalkan komunikasi.'
      }
    },
    {
      id: 'electrical',
      title: 'Electrical Safety',
      icon: '⚡',
      color: 'bg-purple-500/10 border-purple-500/30',
      audioDuration: 55,
      content: {
        english: 'Always lock out and tag out electrical equipment before servicing. Use insulated tools and wear appropriate PPE when working with electricity.',
        bengali: 'পরিষেবা দেওয়ার আগে সর্বদা বৈদ্যুতিক সরঞ্জাম লক আউট এবং ট্যাগ আউট করুন। বিদ্যুৎ নিয়ে কাজ করার সময় ইনসুলেটেড সরঞ্জাম ব্যবহার করুন এবং উপযুক্ত PPE পরুন।',
        malay: 'Sentiasa lakukan lock out dan tag out peralatan elektrik sebelum penyelenggaraan. Gunakan alat terpenebat dan pakai PPE yang sesuai semasa bekerja dengan elektrik.'
      }
    },
    {
      id: 'chemicals',
      title: 'Chemical Handling',
      icon: '🧪',
      color: 'bg-green-500/10 border-green-500/30',
      audioDuration: 50,
      content: {
        english: 'Always read SDS before handling chemicals. Use proper ventilation and wear appropriate PPE including gloves and goggles.',
        bengali: 'রাসায়নিক পদার্থ পরিচালনা করার আগে সর্বদা SDS পড়ুন। সঠিক বায়ুচলাচল ব্যবহার করুন এবং গ্লাভস এবং গগলস সহ উপযুক্ত PPE পরুন।',
        malay: 'Sentiasa baca SDS sebelum mengendalikan bahan kimia. Gunakan pengudaraan yang betul dan pakai PPE yang sesuai termasuk sarung tangan dan gogal.'
      }
    }
  ];

  const speakSOPContent = (text, lang = 'en') => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      setSpeechError('Speech synthesis not supported in this browser');
      return;
    }

    // Check if we have permission (user interaction) for HTTPS
    if (window.location.protocol === 'https:' && !speechPermissionGranted) {
      console.log('Speech synthesis requires user interaction on HTTPS');
      setSpeechError('Click any speech button to enable speech');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on parameter
      if (lang === 'bn') {
        utterance.lang = 'bn-IN';
      } else if (lang === 'ms') {
        utterance.lang = 'ms-MY';
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Enhanced voice selection for consistent speech across platforms
      const voices = availableVoices;
      let preferredVoice;
      
      if (lang === 'bn') {
        // Bengali voice selection
        preferredVoice = voices.find(voice =>
          voice.lang.includes('bn') ||
          voice.lang.includes('hi') ||
          voice.name.includes('Bengali') ||
          voice.name.includes('Hindi')
        ) || voices.find(voice => voice.lang.includes('en') && voice.default);
      } else if (lang === 'ms') {
        // Use the same voice selection logic as ViolationAlert
        const bestMalayVoice = selectBestMalayVoice(voices);
        
        if (bestMalayVoice) {
          preferredVoice = bestMalayVoice;
          utterance.lang = bestMalayVoice.lang;
          console.log('Selected Malay voice for SOP:', bestMalayVoice.name, '(', bestMalayVoice.lang, ')');
          
          // Adjust speech parameters for more natural Malaysian accent
          utterance.rate = 0.95; // Slightly slower for clarity
          utterance.pitch = 1.0; // Normal pitch
          utterance.volume = 1.0; // Full volume
        } else {
          // Fallback to English voice
          console.log('No Malay voice found for SOP, using English fallback');
          preferredVoice = voices.find(voice =>
            voice.lang.includes('en-US') &&
            (voice.name.toLowerCase().includes('google') ||
             voice.name.toLowerCase().includes('microsoft'))
          ) || voices.find(voice => voice.default && voice.lang.includes('en'));
          
          if (preferredVoice) {
            utterance.lang = 'en-US';
          }
          
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
        }
        
      } else {
        // English voice selection
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
        console.log('Selected voice for', lang, ':', preferredVoice.name, '(', preferredVoice.lang, ')');
      } else {
        console.log('No suitable voice found for', lang, ', using default');
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeechError(null);
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        setIsSpeaking(false);
        setSpeechError('Speech error: ' + e.error);
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech function error:', error);
      setIsSpeaking(false);
      setSpeechError('Speech error: ' + error.message);
    }
  };

  const handlePlayAudio = (sop) => {
    setSelectedSOP(sop);
    setIsPlaying(true);
    setAudioProgress(0);

    // Speak the content based on selected language
    let textToSpeak = sop.content.english;
    let langToUse = 'en';
    
    if (selectedLanguage === 'malay' || selectedLanguage === 'rojak' || selectedLanguage === 'malayPlusEnglish') {
      textToSpeak = sop.content.malay || sop.content.english;
      langToUse = 'ms';
    } else if (selectedLanguage === 'bengali') {
      textToSpeak = sop.content.bengali;
      langToUse = 'bn';
    }
    
    speakSOPContent(textToSpeak, langToUse);

    // Simulate audio progress
    const interval = setInterval(() => {
      setAudioProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + (100 / sop.audioDuration);
      });
    }, 1000);
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleRedZoneSimulation = () => {
    // Grant permission on user interaction
    setSpeechPermissionGranted(true);
    setSpeechError(null);
    
    // Show visual alert first
    const warningMessages = {
      english: 'RED ZONE ALERT! Evacuate Immediately!',
      malay: 'AMARAN ZON MERAH! Evakuasi Segera!',
      bengali: 'রেড জোন সতর্কতা! অবিলম্বে সরে যান!',
      rojak: 'PERHATIAN! ZON MERAH TU! KELUAR CEPAT! LARI SEKARANG, JANGAN DUK SINI!',
      malayPlusEnglish: 'AMARAN ZON MERAH! Evakuasi Segera! RED ZONE ALERT! Evacuate Immediately!'
    };
    
    const message = warningMessages[selectedLanguage] || warningMessages.english;
    
    // Start speaking after user interaction
    try {
      if ('speechSynthesis' in window) {
        // Cancel any previous speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        
        // Set language based on selection
        if (selectedLanguage === 'malay' || selectedLanguage === 'rojak' || selectedLanguage === 'malayPlusEnglish') {
          utterance.lang = 'ms-MY';
        } else if (selectedLanguage === 'bengali') {
          utterance.lang = 'bn-IN';
        } else {
          utterance.lang = 'en-US';
        }
        
        utterance.rate = 1.4; // Faster for more urgency
        utterance.pitch = 1.3; // Higher pitch for emergency
        utterance.volume = 1.0; // Maximum volume for urgency
        
        // Enhanced voice selection for red zone alerts
        if (selectedLanguage === 'malay' || selectedLanguage === 'rojak' || selectedLanguage === 'malayPlusEnglish') {
          const voices = availableVoices;
          let preferredVoice = null;
          
          // Same priority logic as other functions
          preferredVoice = voices.find(voice =>
            voice.lang.includes('ms-MY') ||
            voice.lang.includes('ms-ID')
          );
          
          if (!preferredVoice) {
            preferredVoice = voices.find(voice =>
              voice.lang.includes('id-ID') ||
              voice.name.toLowerCase().includes('indonesian')
            );
          }
          
          if (!preferredVoice) {
            preferredVoice = voices.find(voice =>
              voice.name.toLowerCase().includes('malay') &&
              voice.name.toLowerCase().includes('google')
            );
          }
          
          if (!preferredVoice) {
            preferredVoice = voices.find(voice =>
              voice.name.toLowerCase().includes('malay') &&
              voice.name.toLowerCase().includes('microsoft')
            );
          }
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
            console.log('Selected red zone voice:', preferredVoice.name);
          }
        }
        
        utterance.onstart = () => {
          console.log('Red zone alert speech started');
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          console.log('Red zone alert speech ended');
          setIsSpeaking(false);
        };
        utterance.onerror = (e) => {
          console.error('Red zone alert speech error:', e);
          setIsSpeaking(false);
          setSpeechError('Speech error: ' + e.error);
        };
        
        // Speak after user interaction
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Speech not available:', error);
      setSpeechError('Speech not available: ' + error.message);
    }
    
    // Show browser alert immediately after starting speech
    alert(message);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setShowSettings(false);
  };

  const handleEmergencyCall = () => {
    window.open(`tel:${workerInfo.emergencyContact}`);
  };

  const handleSupervisorContact = () => {
    // Find supervisor for current worker's site
    const supervisor = workers.find(w =>
      w.role === 'Site Supervisor' &&
      w.siteAssigned === workerInfo.siteAssigned
    );
    if (supervisor) {
      window.open(`tel:${supervisor.phone}`);
    }
  };

  const handleSiteMap = () => {
    // Open maps with site location (simulated)
    const site = sites.find(s => s.name === workerInfo.siteAssigned);
    if (site) {
      window.open(`https://maps.google.com/?q=${site.location}`);
    }
  };

  const handlePermitSubmit = () => {
    const newPermit = {
      ...permitForm,
      requester: workerInfo.name,
      site: workerInfo.siteAssigned
    };
    
    addPermit(newPermit);
    setShowPermitModal(false);
    setPermitForm({
      type: 'Hot Work',
      location: '',
      description: '',
      duration: '2 hours',
      riskLevel: 'medium'
    });
  };

  const getWorkerPermits = () => {
    return permits.filter(permit => permit.requester === workerInfo.name);
  };

  return (
    <div className={`min-h-screen bg-dark-bg flex items-center justify-center p-4`}>
      <div className="mobile-frame">
        <div className="mobile-content bg-dark-surface">
          {/* Header */}
          <div className="bg-construction-yellow text-black p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">{t.digitalPassport}</h1>
                <p className="text-xs opacity-80">{workerInfo.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-1 hover:bg-black/10 rounded transition-colors"
                  title={t.settings}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">{workerInfo.complianceScore}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Worker Info Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-bg border border-dark-border rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-construction-yellow rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{workerInfo.name}</h2>
                  <p className="text-xs text-gray-400">{workerInfo.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">{t.role}:</span>
                  <span className="text-white ml-1">{workerInfo.role}</span>
                </div>
                <div>
                  <span className="text-gray-400">{t.department}:</span>
                  <span className="text-white ml-1">{workerInfo.department}</span>
                </div>
                <div>
                  <span className="text-gray-400">{t.phone}:</span>
                  <span className="text-white ml-1">{workerInfo.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400">{t.emergency}:</span>
                  <span className="text-white ml-1 text-red-400">{workerInfo.emergencyContact}</span>
                </div>
              </div>
              
              {/* Certifications */}
              <div className="mt-3 pt-3 border-t border-dark-border">
                <p className="text-gray-400 text-xs mb-2">{t.certifications}:</p>
                <div className="flex flex-wrap gap-1">
                  {workerInfo.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-construction-yellow/20 text-construction-yellow text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* QR Code Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-bg border border-dark-border rounded-lg p-6 text-center"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                <QrCode className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.scanForVerification}
              </h3>
              
              {/* Generated QR Code */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-lg shadow-lg">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Worker QR Code"
                    className="w-full h-full rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <div className="text-gray-400 text-xs text-center">Generating QR Code...</div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-3">ID: {workerInfo.id}</p>
            </motion.div>

            {/* SOP Library */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Book className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.sopLibrary}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {sopCategories.map((sop) => (
                  <motion.button
                    key={sop.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlayAudio(sop)}
                    className={`p-4 rounded-lg border ${sop.color} hover:border-construction-yellow transition-all`}
                  >
                    <div className="text-2xl mb-2">{sop.icon}</div>
                    <p className="text-xs text-white font-semibold">
                      {selectedLanguage === 'english' ? sop.title :
                       selectedLanguage === 'malay' ?
                       (sop.id === 'ladder' ? t.ladderSafety :
                        sop.id === 'crane' ? t.craneOperations :
                        sop.id === 'electrical' ? t.electricalSafety :
                        t.chemicalHandling) :
                       (sop.id === 'ladder' ? t.ladderSafety :
                        sop.id === 'crane' ? t.craneOperations :
                        sop.id === 'electrical' ? t.electricalSafety :
                        t.chemicalHandling)}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Audio Player */}
            <AnimatePresence>
              {selectedSOP && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-dark-bg border border-dark-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm">{selectedSOP.title}</h4>
                    <button
                      onClick={isPlaying ? handlePauseAudio : () => {
                        setSpeechPermissionGranted(true);
                        setSpeechError(null);
                        handlePlayAudio(selectedSOP);
                      }}
                      className="p-2 bg-construction-yellow rounded-full text-black"
                      title={speechPermissionGranted ? (isPlaying ? "Pause" : "Play") : "Click to enable speech"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Audio Progress Bar */}
                  <div className="w-full bg-dark-border rounded-full h-2 mb-3">
                    <motion.div
                      className="bg-construction-yellow h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${audioProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Volume2 className={`w-4 h-4 text-construction-yellow ${isSpeaking ? 'animate-pulse' : ''}`} />
                      <span className="text-xs text-gray-400">
                        {isPlaying ? (isSpeaking ? t.speaking : t.playing) : t.paused} • {Math.floor((audioProgress / 100) * selectedSOP.audioDuration)}s / {selectedSOP.audioDuration}s
                      </span>
                    </div>
                    {speechError && (
                      <div className="text-xs text-yellow-300 mt-1">
                        {speechError}
                      </div>
                    )}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSpeechPermissionGranted(true);
                          setSpeechError(null);
                          speakSOPContent(selectedSOP.content.english, 'en');
                        }}
                        className="p-1 bg-dark-surface rounded hover:bg-dark-border transition-colors"
                        title="Play in English"
                      >
                        <span className="text-xs text-construction-yellow">EN</span>
                      </button>
                      {selectedSOP.content.bengali && (
                        <button
                          onClick={() => {
                            setSpeechPermissionGranted(true);
                            setSpeechError(null);
                            speakSOPContent(selectedSOP.content.bengali, 'bn');
                          }}
                          className="p-1 bg-dark-surface rounded hover:bg-dark-border transition-colors"
                          title="Play in Bengali"
                        >
                          <span className="text-xs text-construction-yellow">BN</span>
                        </button>
                      )}
                      {selectedSOP.content.malay && (
                        <button
                          onClick={() => {
                            setSpeechPermissionGranted(true);
                            setSpeechError(null);
                            speakSOPContent(selectedSOP.content.malay, 'ms');
                          }}
                          className="p-1 bg-dark-surface rounded hover:bg-dark-border transition-colors"
                          title="Play in Malay"
                        >
                          <span className="text-xs text-construction-yellow">MY</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Bilingual Content */}
                  <div className="space-y-2">
                    <div className="p-2 bg-dark-surface rounded">
                      <p className="text-xs text-gray-300 mb-1">English:</p>
                      <p className="text-xs text-white">{selectedSOP.content.english}</p>
                    </div>
                    {selectedSOP.content.bengali && (
                      <div className="p-2 bg-dark-surface rounded">
                        <p className="text-xs text-gray-300 mb-1">বাংলা (Bengali):</p>
                        <p className="text-xs text-white">{selectedSOP.content.bengali}</p>
                      </div>
                    )}
                    {selectedSOP.content.malay && (
                      <div className="p-2 bg-dark-surface rounded">
                        <p className="text-xs text-gray-300 mb-1">Bahasa Melayu:</p>
                        <p className="text-xs text-white">{selectedSOP.content.malay}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-white font-semibold flex items-center">
                <Zap className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.quickActions}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleEmergencyCall}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <span className="text-xs text-red-400 block">{t.emergencyCall}</span>
                </button>
                
                <button
                  onClick={handleSupervisorContact}
                  className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs text-blue-400 block">{t.supervisorContact}</span>
                </button>
                
                <button
                  onClick={handleSiteMap}
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
                >
                  <MapPin className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <span className="text-xs text-green-400 block">{t.siteMap}</span>
                </button>
                
                <button
                  onClick={handleRedZoneSimulation}
                  className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-all relative"
                  title={speechPermissionGranted ? t.redZoneAlert : "Click to enable speech alerts"}
                >
                  <AlertTriangle className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <span className="text-xs text-orange-400 block">{t.redZoneAlert}</span>
                  {isSpeaking && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Permit Request Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-construction-yellow" />
                  {t.myPermits}
                </h3>
                <button
                  onClick={() => setShowPermitModal(true)}
                  className="px-3 py-1 bg-construction-yellow text-black text-xs rounded-full hover:bg-yellow-400 transition-colors"
                >
                  {t.requestPermit}
                </button>
              </div>
              
              {/* Worker's Permits List */}
              <div className="space-y-2">
                {getWorkerPermits().slice(0, 3).map((permit) => (
                  <div key={permit.id} className="bg-dark-bg border border-dark-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-semibold">{permit.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        permit.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        permit.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        permit.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {permit.status === 'active' ? t.active :
                         permit.status === 'pending' ? t.pending :
                         permit.status === 'completed' ? t.completed : t.rejected}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {permit.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {permit.expiry}
                      </div>
                    </div>
                  </div>
                ))}
                
                {getWorkerPermits().length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    {selectedLanguage === 'english' && 'No permits requested yet'}
                    {selectedLanguage === 'malay' && 'Belum ada permit yang dimohon'}
                    {selectedLanguage === 'bengali' && 'এখনও কোন পারমিট অনুরোধ করা হয়নি'}
                    {selectedLanguage === 'malayPlusEnglish' && 'Belum ada permit yang dimohon'}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Permit Request Modal */}
      <AnimatePresence>
        {showPermitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPermitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-construction-yellow" />
                  {t.requestPermit}
                </h3>
                <button
                  onClick={() => setShowPermitModal(false)}
                  className="p-1 hover:bg-dark-bg rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">{t.permitType}</label>
                  <select
                    value={permitForm.type}
                    onChange={(e) => setPermitForm({...permitForm, type: e.target.value})}
                    className="w-full p-2 bg-dark-bg border border-dark-border rounded text-white text-sm"
                  >
                    <option value="Hot Work">{t.hotWork}</option>
                    <option value="Confined Space">{t.confinedSpace}</option>
                    <option value="Electrical Work">{t.electricalWork}</option>
                    <option value="Working at Height">{t.workingAtHeight}</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">{t.location}</label>
                  <input
                    type="text"
                    value={permitForm.location}
                    onChange={(e) => setPermitForm({...permitForm, location: e.target.value})}
                    placeholder={selectedLanguage === 'english' ? 'Enter work location' :
                               selectedLanguage === 'malay' || selectedLanguage === 'malayPlusEnglish' ? 'Masukkan lokasi kerja' :
                               'কাজের স্থান লিখুন'}
                    className="w-full p-2 bg-dark-bg border border-dark-border rounded text-white text-sm placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">{t.description}</label>
                  <textarea
                    value={permitForm.description}
                    onChange={(e) => setPermitForm({...permitForm, description: e.target.value})}
                    placeholder={selectedLanguage === 'english' ? 'Describe the work to be performed' :
                               selectedLanguage === 'malay' || selectedLanguage === 'malayPlusEnglish' ? 'Huraikan kerja yang akan dilakukan' :
                               'সম্পাদন করার কাজ বর্ণনা করুন'}
                    rows={3}
                    className="w-full p-2 bg-dark-bg border border-dark-border rounded text-white text-sm placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">{t.duration}</label>
                  <select
                    value={permitForm.duration}
                    onChange={(e) => setPermitForm({...permitForm, duration: e.target.value})}
                    className="w-full p-2 bg-dark-bg border border-dark-border rounded text-white text-sm"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="8 hours">8 hours</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">{t.riskLevel}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPermitForm({...permitForm, riskLevel: 'low'})}
                      className={`p-2 rounded text-xs transition-all ${
                        permitForm.riskLevel === 'low'
                          ? 'bg-green-500/20 border border-green-500 text-green-400'
                          : 'bg-dark-bg border border-dark-border text-gray-400 hover:border-green-500/50'
                      }`}
                    >
                      {t.low}
                    </button>
                    <button
                      onClick={() => setPermitForm({...permitForm, riskLevel: 'medium'})}
                      className={`p-2 rounded text-xs transition-all ${
                        permitForm.riskLevel === 'medium'
                          ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
                          : 'bg-dark-bg border border-dark-border text-gray-400 hover:border-yellow-500/50'
                      }`}
                    >
                      {t.medium}
                    </button>
                    <button
                      onClick={() => setPermitForm({...permitForm, riskLevel: 'high'})}
                      className={`p-2 rounded text-xs transition-all ${
                        permitForm.riskLevel === 'high'
                          ? 'bg-red-500/20 border border-red-500 text-red-400'
                          : 'bg-dark-bg border border-dark-border text-gray-400 hover:border-red-500/50'
                      }`}
                    >
                      {t.high}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePermitSubmit}
                  disabled={!permitForm.location || !permitForm.description}
                  className="w-full p-3 bg-construction-yellow text-black rounded font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.submitRequest}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-construction-yellow" />
                  {t.selectLanguage}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-dark-bg rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleLanguageChange('english')}
                  className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLanguage === 'english'
                      ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                      : 'bg-dark-bg border-dark-border text-white hover:border-construction-yellow/50'
                  }`}
                >
                  <span>{t.english}</span>
                  {selectedLanguage === 'english' && (
                    <div className="w-2 h-2 bg-construction-yellow rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => handleLanguageChange('malay')}
                  className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLanguage === 'malay'
                      ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                      : 'bg-dark-bg border-dark-border text-white hover:border-construction-yellow/50'
                  }`}
                >
                  <span>{t.malay}</span>
                  {selectedLanguage === 'malay' && (
                    <div className="w-2 h-2 bg-construction-yellow rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => handleLanguageChange('bengali')}
                  className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLanguage === 'bengali'
                      ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                      : 'bg-dark-bg border-dark-border text-white hover:border-construction-yellow/50'
                  }`}
                >
                  <span>{t.bengali}</span>
                  {selectedLanguage === 'bengali' && (
                    <div className="w-2 h-2 bg-construction-yellow rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => handleLanguageChange('rojak')}
                  className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                    selectedLanguage === 'rojak'
                      ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                      : 'bg-dark-bg border-dark-border text-white hover:border-construction-yellow/50'
                  }`}
                >
                  <span>{t.rojak}</span>
                  {selectedLanguage === 'rojak' && (
                    <div className="w-2 h-2 bg-construction-yellow rounded-full"></div>
                  )}
                </button>

              </div>

              <div className="mt-4 p-3 bg-dark-bg rounded-lg">
                <p className="text-xs text-gray-400">
                  {selectedLanguage === 'english' && 'Change language to translate all text and voice instructions.'}
                  {selectedLanguage === 'malay' && 'Tukar bahasa untuk menterjemah semua teks dan arahan suara.'}
                  {selectedLanguage === 'bengali' && 'সমস্ত পাঠ্য এবং ভয়েস নির্দেশাবলী অনুবাদ করতে ভাষা পরিবর্তন করুন।'}
                  {selectedLanguage === 'rojak' && 'Change language to translate all text and voice instructions. / Tukar bahasa untuk menterjemah semua teks dan arahan suara.'}
                  {selectedLanguage === 'malayPlusEnglish' && 'Tukar bahasa untuk menterjemah semua teks dan arahan suara. Voice instructions will be in Malay with English text.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}