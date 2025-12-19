'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import LiveCCTV from './LiveCCTV';
import {
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  Zap,
  Eye,
  Upload,
  Settings,
  Globe,
  Video,
  X
} from 'lucide-react';

export default function SiteSupervisorApp() {
  const {
    simulateAIScan,
    scanResult,
    triggerViolationAlert,
    permits,
    approvePermit,
    rejectPermit,
    extendPermit,
    completePermit,
    selectedLanguage,
    setSelectedLanguage
  } = useSafety();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showPermitActions, setShowPermitActions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);

  // Translations for supervisor page
  const translations = {
    english: {
      siteSupervisor: 'Site Supervisor',
      realTimeSafetyManagement: 'Real-time Safety Management',
      zaiActive: 'Z.AI Active',
      settings: 'Settings',
      activePermits: 'Active Permits',
      hotWork: 'Hot Work',
      confinedSpace: 'Confined Space',
      electricalWork: 'Electrical Work',
      checkHotWorkArea: 'Check Hot Work Area',
      scanConfinedSpace: 'Scan Confined Space',
      inspectElectricalPanel: 'Inspect Electrical Panel',
      scanning: 'Scanning...',
      zaiSafetyScan: 'Z.AI Safety Scan',
      alertEngine: 'Alert Engine',
      unhookedHarness: 'Unhooked Harness',
      noHelmet: 'No Helmet',
      unauthorizedAccess: 'Unauthorized Access',
      test: 'TEST',
      liveCctvMonitoring: 'Live CCTV Monitoring',
      realTimeSiteSurveillance: 'Real-time site surveillance',
      live: 'LIVE',
      approve: 'Approve',
      reject: 'Reject',
      extend: 'Extend',
      complete: 'Complete',
      details: 'Details',
      permitDetails: 'Permit Details',
      location: 'Location',
      requester: 'Requester',
      status: 'Status',
      timeRemaining: 'Time Remaining',
      riskLevel: 'Risk Level',
      description: 'Description',
      safetyRequirements: 'Safety Requirements',
      approvedBy: 'Approved By',
      languageSettings: 'Language Settings',
      selectLanguage: 'Select Language',
      english: 'English',
      bahasaMelayu: 'Bahasa Melayu',
      bahasaRojak: 'Bahasa Rojak',
      saveClose: 'Save & Close',
      calling: 'Calling...',
      callWorker: 'Call Worker',
      repeatMessage: 'Repeat Message'
    },
    malay: {
      siteSupervisor: 'Penyelia Tapak',
      realTimeSafetyManagement: 'Pengurusan Keselamatan Masa Nyata',
      zaiActive: 'Z.AI Aktif',
      settings: 'Tetapan',
      activePermits: 'Permit Aktif',
      hotWork: 'Kerja Panas',
      confinedSpace: 'Ruang Terhad',
      electricalWork: 'Kerja Elektrik',
      checkHotWorkArea: 'Semak Kawasan Kerja Panas',
      scanConfinedSpace: 'Imbas Ruang Terhad',
      inspectElectricalPanel: 'Periksa Panel Elektrik',
      scanning: 'Mengimbas...',
      zaiSafetyScan: 'Imbasan Keselamatan Z.AI',
      alertEngine: 'Enjin Amaran',
      unhookedHarness: 'Tali Keledar Tidak Dikait',
      noHelmet: 'Tiada Topi Keselamatan',
      unauthorizedAccess: 'Akses Tanpa Kebenaran',
      test: 'UJI',
      liveCctvMonitoring: 'Pemantauan CCTV Langsung',
      realTimeSiteSurveillance: 'Pengawasan tapak masa nyata',
      live: 'LANGSUNG',
      approve: 'Lulus',
      reject: 'Tolak',
      extend: 'Panjang',
      complete: 'Selesai',
      details: 'Butiran',
      permitDetails: 'Butiran Permit',
      location: 'Lokasi',
      requester: 'Pemohon',
      status: 'Status',
      timeRemaining: 'Masa Berbaki',
      riskLevel: 'Tahap Risiko',
      description: 'Keterangan',
      safetyRequirements: 'Keperluan Keselamatan',
      approvedBy: 'Diluluskan Oleh',
      languageSettings: 'Tetapan Bahasa',
      selectLanguage: 'Pilih Bahasa',
      english: 'English',
      bahasaMelayu: 'Bahasa Melayu',
      bahasaRojak: 'Bahasa Rojak',
      saveClose: 'Simpan & Tutup',
      calling: 'Memanggil...',
      callWorker: 'Panggil Pekerja',
      repeatMessage: 'Ulangi Mesej'
    },
    rojak: {
      siteSupervisor: 'Site Supervisor / Penyelia Tapak',
      realTimeSafetyManagement: 'Real-time Safety Management / Pengurusan Keselamatan Masa Nyata',
      zaiActive: 'Z.AI Active / Z.AI Aktif',
      settings: 'Settings / Tetapan',
      activePermits: 'Active Permits / Permit Aktif',
      hotWork: 'Hot Work / Kerja Panas',
      confinedSpace: 'Confined Space / Ruang Terhad',
      electricalWork: 'Electrical Work / Kerja Elektrik',
      checkHotWorkArea: 'Check Hot Work Area / Semak Kawasan Kerja Panas',
      scanConfinedSpace: 'Scan Confined Space / Imbas Ruang Terhad',
      inspectElectricalPanel: 'Inspect Electrical Panel / Periksa Panel Elektrik',
      scanning: 'Scanning... / Mengimbas...',
      zaiSafetyScan: 'Z.AI Safety Scan / Imbasan Keselamatan Z.AI',
      alertEngine: 'Alert Engine / Enjin Amaran',
      unhookedHarness: 'Unhooked Harness / Tali Keledar Tidak Dikait',
      noHelmet: 'No Helmet / Tiada Topi Keselamatan',
      unauthorizedAccess: 'Unauthorized Access / Akses Tanpa Kebenaran',
      test: 'TEST / UJI',
      liveCctvMonitoring: 'Live CCTV Monitoring / Pemantauan CCTV Langsung',
      realTimeSiteSurveillance: 'Real-time site surveillance / Pengawasan tapak masa nyata',
      live: 'LIVE / LANGSUNG',
      approve: 'Approve / Lulus',
      reject: 'Reject / Tolak',
      extend: 'Extend / Panjang',
      complete: 'Complete / Selesai',
      details: 'Details / Butiran',
      permitDetails: 'Permit Details / Butiran Permit',
      location: 'Location / Lokasi',
      requester: 'Requester / Pemohon',
      status: 'Status / Status',
      timeRemaining: 'Time Remaining / Masa Berbaki',
      riskLevel: 'Risk Level / Tahap Risiko',
      description: 'Description / Keterangan',
      safetyRequirements: 'Safety Requirements / Keperluan Keselamatan',
      approvedBy: 'Approved By / Diluluskan Oleh',
      languageSettings: 'Language Settings / Tetapan Bahasa',
      selectLanguage: 'Select Language / Pilih Bahasa',
      english: 'English',
      bahasaMelayu: 'Bahasa Melayu',
      bahasaRojak: 'Bahasa Rojak',
      saveClose: 'Save & Close / Simpan & Tutup',
      calling: 'Calling... / Memanggil...',
      callWorker: 'Call Worker / Panggil Pekerja',
      repeatMessage: 'Repeat Message / Ulangi Mesej'
    }
  };

  const t = translations[selectedLanguage] || translations.english;

  const handleAIScan = (area) => {
    setIsScanning(true);
    setScanProgress(0);
    simulateAIScan(area);
    
    // Simulate progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handlePermitAction = (permit, action) => {
    switch (action) {
      case 'approve':
        approvePermit(permit.id);
        break;
      case 'reject':
        rejectPermit(permit.id, 'Safety requirements not fully met');
        break;
      case 'extend':
        extendPermit(permit.id, 2);
        break;
      case 'complete':
        completePermit(permit.id);
        break;
    }
    setShowPermitActions(false);
    setSelectedPermit(null);
  };

  const openPermitActions = (permit) => {
    setSelectedPermit(permit);
    setShowPermitActions(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'expired': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="mobile-frame">
        <div className="mobile-content bg-dark-surface">
          {/* Header */}
          <div className="bg-construction-yellow text-black p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">{t.siteSupervisor}</h1>
                <p className="text-xs opacity-80">{t.realTimeSafetyManagement}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                  title={t.settings}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">{t.zaiActive}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Safety Feed - Active Permits */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-white font-semibold mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.activePermits}
              </h2>
              
              <div className="space-y-2">
                {permits.map((permit) => (
                  <motion.div
                    key={permit.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border ${getStatusColor(permit.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{permit.type}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-black/20">
                        {permit.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 mb-1">{permit.location}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs opacity-60">By: {permit.requester}</span>
                      <span className="text-xs opacity-60 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {permit.expiry}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 mt-2">
                      {permit.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handlePermitAction(permit, 'approve')}
                            className="flex-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors"
                          >
                            {t.approve}
                          </button>
                          <button
                            onClick={() => handlePermitAction(permit, 'reject')}
                            className="flex-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors"
                          >
                            {t.reject}
                          </button>
                        </>
                      )}
                      {permit.status === 'active' && (
                        <>
                          <button
                            onClick={() => handlePermitAction(permit, 'extend')}
                            className="flex-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30 transition-colors"
                          >
                            {t.extend}
                          </button>
                          <button
                            onClick={() => handlePermitAction(permit, 'complete')}
                            className="flex-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded hover:bg-yellow-500/30 transition-colors"
                          >
                            {t.complete}
                          </button>
                        </>
                      )}
                      <button
                       onClick={() => openPermitActions(permit)}
                       className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded hover:bg-gray-500/30 transition-colors"
                     >
                       {t.details}
                     </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Scan Simulation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-white font-semibold mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.zaiSafetyScan}
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleAIScan('hot_work')}
                  disabled={isScanning}
                  className="w-full p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-construction-yellow transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-construction-yellow" />
                      <span className="text-sm font-semibold">{t.checkHotWorkArea}</span>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </button>

                <button
                  onClick={() => handleAIScan('confined_space')}
                  disabled={isScanning}
                  className="w-full p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-construction-yellow transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-construction-yellow" />
                      <span className="text-sm font-semibold">{t.scanConfinedSpace}</span>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </button>

                <button
                  onClick={() => handleAIScan('electrical')}
                  disabled={isScanning}
                  className="w-full p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-construction-yellow transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-construction-yellow" />
                      <span className="text-sm font-semibold">{t.inspectElectricalPanel}</span>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </div>

              {/* Scan Progress */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <div className="p-3 bg-dark-bg rounded-lg border border-construction-yellow/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Upload className="w-4 h-4 text-construction-yellow animate-pulse" />
                        <span className="text-sm text-construction-yellow">{t.scanning}</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-2">
                        <motion.div
                          className="bg-construction-yellow h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${scanProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scan Result */}
              <AnimatePresence>
                {scanResult && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-3 p-3 rounded-lg border ${
                      scanResult.status === 'approved' 
                        ? 'bg-green-400/10 border-green-400/30' 
                        : 'bg-yellow-400/10 border-yellow-400/30'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {scanResult.status === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm text-white font-semibold mb-1">
                          {scanResult.status === 'approved' ? t.approve + 'd' : 'Action Required'}
                        </p>
                        <p className="text-xs text-gray-300">{scanResult.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Confidence: {scanResult.confidence}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Alert Engine */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-white font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-construction-yellow" />
                {t.alertEngine}
              </h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => triggerViolationAlert('Rahman', 'UNHOOKED HARNESS')}
                  className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">{t.unhookedHarness}</span>
                    </div>
                    <span className="text-xs text-red-400 opacity-60">{t.test}</span>
                  </div>
                </button>
                
                <button
                  onClick={() => triggerViolationAlert('Ahmed', 'NO HELMET')}
                  className="w-full p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <span className="text-sm font-semibold text-orange-400">{t.noHelmet}</span>
                    </div>
                    <span className="text-xs text-orange-400 opacity-60">{t.test}</span>
                  </div>
                </button>
                
                <button
                  onClick={() => triggerViolationAlert('Siti', 'UNAUTHORIZED ACCESS')}
                  className="w-full p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">{t.unauthorizedAccess}</span>
                    </div>
                    <span className="text-xs text-yellow-400 opacity-60">{t.test}</span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Live CCTV - Prominent Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setShowCCTV(true)}
                className="w-full p-6 bg-gradient-to-r from-construction-yellow to-yellow-400 text-black rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-black/20 rounded-lg">
                      <Video className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold">{t.liveCctvMonitoring}</h3>
                      <p className="text-sm opacity-80">{t.realTimeSiteSurveillance}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-black/20 rounded-full">
                      <span className="text-sm font-semibold">{t.live}</span>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Permit Details Modal */}
      <AnimatePresence>
        {showPermitActions && selectedPermit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPermitActions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-surface rounded-lg p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t.permitDetails}</h3>
                <button
                  onClick={() => setShowPermitActions(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">{t.permitType || 'Permit Type'}</p>
                  <p className="text-sm font-semibold text-white">{selectedPermit.type}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">{t.location}</p>
                  <p className="text-sm text-white">{selectedPermit.location}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">{t.requester}</p>
                  <p className="text-sm text-white">{selectedPermit.requester}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">{t.status}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPermit.status)}`}>
                    {selectedPermit.status.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">{t.timeRemaining}</p>
                  <p className="text-sm text-white flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedPermit.expiry}
                  </p>
                </div>

                {selectedPermit.description && (
                  <div>
                    <p className="text-xs text-gray-400">{t.description}</p>
                    <p className="text-sm text-white">{selectedPermit.description}</p>
                  </div>
                )}

                {selectedPermit.riskLevel && (
                  <div>
                    <p className="text-xs text-gray-400">{t.riskLevel}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      selectedPermit.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                      selectedPermit.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedPermit.riskLevel.toUpperCase()}
                    </span>
                  </div>
                )}

                {selectedPermit.requirements && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">{t.safetyRequirements}</p>
                    <div className="space-y-1">
                      {selectedPermit.requirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs text-white">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPermit.approvedBy && (
                  <div>
                    <p className="text-xs text-gray-400">{t.approvedBy}</p>
                    <p className="text-sm text-white">{selectedPermit.approvedBy}</p>
                    {selectedPermit.approvedAt && (
                      <p className="text-xs text-gray-400">{selectedPermit.approvedAt}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex gap-2 mt-4">
                {selectedPermit.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handlePermitAction(selectedPermit, 'approve')}
                      className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      {t.approve}
                    </button>
                    <button
                      onClick={() => handlePermitAction(selectedPermit, 'reject')}
                      className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      {t.reject}
                    </button>
                  </>
                )}
                {selectedPermit.status === 'active' && (
                  <>
                    <button
                      onClick={() => handlePermitAction(selectedPermit, 'extend')}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      {t.extend} +2h
                    </button>
                    <button
                      onClick={() => handlePermitAction(selectedPermit, 'complete')}
                      className="flex-1 px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                    >
                      {t.complete}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Language Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-surface rounded-lg p-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-construction-yellow" />
                  {t.languageSettings}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300 mb-3">
                  Select your preferred language for interface, alerts and notifications:
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedLanguage('english')}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      selectedLanguage === 'english'
                        ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                        : 'bg-dark-bg border-dark-border text-gray-300 hover:border-construction-yellow/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🇬🇧</span>
                        <div className="text-left">
                          <p className="font-semibold">{t.english}</p>
                          <p className="text-xs opacity-70">Default language</p>
                        </div>
                      </div>
                      {selectedLanguage === 'english' && (
                        <div className="w-4 h-4 bg-construction-yellow rounded-full" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedLanguage('malay')}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      selectedLanguage === 'malay'
                        ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                        : 'bg-dark-bg border-dark-border text-gray-300 hover:border-construction-yellow/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🇲🇾</span>
                        <div className="text-left">
                          <p className="font-semibold">{t.bahasaMelayu}</p>
                          <p className="text-xs opacity-70">Bahasa kebangsaan</p>
                        </div>
                      </div>
                      {selectedLanguage === 'malay' && (
                        <div className="w-4 h-4 bg-construction-yellow rounded-full" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedLanguage('rojak')}
                    className={`w-full p-3 rounded-lg border transition-all ${
                      selectedLanguage === 'rojak'
                        ? 'bg-construction-yellow/20 border-construction-yellow text-construction-yellow'
                        : 'bg-dark-bg border-dark-border text-gray-300 hover:border-construction-yellow/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🇲🇾🇬🇧</span>
                        <div className="text-left">
                          <p className="font-semibold">{t.bahasaRojak}</p>
                          <p className="text-xs opacity-70">English + Malay mix</p>
                        </div>
                      </div>
                      {selectedLanguage === 'rojak' && (
                        <div className="w-4 h-4 bg-construction-yellow rounded-full" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="mt-4 p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <p className="text-sm text-white">
                    {selectedLanguage === 'english' && 'WARNING: Unhooked Safety Harness'}
                    {selectedLanguage === 'malay' && 'AMARAN: Tali pinggang keselamatan tidak dipasang'}
                    {selectedLanguage === 'rojak' && 'Woi Rahman! Tali safety tak pasang lagi ke? Alamak, gila bahaya weh! Cepat pasang la!'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 bg-construction-yellow text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
                >
                  {t.saveClose}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Live CCTV Modal */}
        <AnimatePresence>
          {showCCTV && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50"
              onClick={() => setShowCCTV(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowCCTV(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  
                  {/* CCTV Component */}
                  <LiveCCTV />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}