'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import {
  Camera,
  CameraOff,
  AlertTriangle,
  Activity,
  Play,
  Pause,
  Settings,
  X,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';

export default function LiveCCTV() {
  const { sites, currentUser } = useSafety();
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [detectionAlerts, setDetectionAlerts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef(null);

  // Mock camera data for different site zones
  const [cameras, setCameras] = useState([
    {
      id: 'CAM-001',
      name: 'Main Entrance',
      location: 'Zone A',
      status: 'online',
      lastUpdate: new Date(),
      detection: 'personnel_detected',
      riskLevel: 'low',
      videoId: 'M2uIkL43yrM'
    },
    {
      id: 'CAM-002',
      name: 'Crane Area',
      location: 'Zone B',
      status: 'online',
      lastUpdate: new Date(),
      detection: 'equipment_movement',
      riskLevel: 'medium',
      videoId: '-KDNFBgHdBc'
    },
    {
      id: 'CAM-003',
      name: 'Scaffolding',
      location: 'Zone C',
      status: 'online',
      lastUpdate: new Date(),
      detection: 'safety_violation',
      riskLevel: 'high',
      videoId: 'ZV3aI8vJUMo'
    },
    {
      id: 'CAM-004',
      name: 'Storage',
      location: 'Zone D',
      status: 'offline',
      lastUpdate: new Date(Date.now() - 300000),
      detection: 'no_detection',
      riskLevel: 'low',
      videoId: null
    }
  ]);

  // Simulate real-time camera status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prevCameras => 
        prevCameras.map(camera => ({
          ...camera,
          lastUpdate: new Date(),
          detection: Math.random() > 0.7 ? 
            ['personnel_detected', 'equipment_movement', 'safety_violation', 'no_detection'][Math.floor(Math.random() * 4)] 
            : camera.detection,
          status: Math.random() > 0.95 ? 'offline' : (camera.status === 'offline' ? 'online' : camera.status)
        }))
      );

      // Generate random alerts
      if (Math.random() > 0.8) {
        const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
        const newAlert = {
          id: Date.now(),
          cameraId: randomCamera ? randomCamera.id : 'UNKNOWN',
          type: ['safety_violation', 'unauthorized_access', 'equipment_malfunction'][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };
        setDetectionAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cameras]);

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'connecting': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="mobile-frame">
        <div className="mobile-content bg-dark-bg h-full flex flex-col">
      {/* Compact Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dark-surface border-b border-dark-border px-3 py-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-construction-yellow rounded">
              <Camera className="w-3 h-3 text-black" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white">CCTV MONITORING</h1>
              <p className="text-xs text-gray-400">
                {cameras.filter(c => c.status === 'online').length}/{cameras.length} ONLINE
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 hover:bg-dark-bg rounded transition-colors"
          >
            <Settings className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        {selectedCamera ? (
          /* Single Camera View */
          <div className="h-full flex flex-col">
            {/* Camera Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 bg-black relative"
            >
              {selectedCamera.status === 'online' && selectedCamera.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedCamera.videoId}?autoplay=1&mute=1&loop=1&playlist=${selectedCamera.videoId}&controls=0&showinfo=0&modestbranding=1&rel=0`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <CameraOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">Camera Offline</p>
                  </div>
                </div>
              )}

              {/* Top Overlay */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className={`w-3 h-3 ${getStatusColor(selectedCamera.status)}`} />
                    <span className="text-white text-xs font-medium">{selectedCamera.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getRiskLevelColor(selectedCamera.riskLevel)}`}>
                      {selectedCamera.riskLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCamera(null)}
                    className="p-1 bg-black/50 rounded text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-12 left-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-xs">REC</span>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleRecording}
                      className={`p-1.5 rounded transition-colors ${
                        isRecording ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                      }`}
                    >
                      {isRecording ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 bg-white/20 text-white rounded transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-white text-xs">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Camera Info Bar */}
            <div className="bg-dark-surface border-t border-dark-border p-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-400">STATUS</p>
                  <p className={`font-semibold ${getStatusColor(selectedCamera.status)}`}>
                    {selectedCamera.status.toUpperCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">DETECTION</p>
                  <p className="text-white font-semibold">
                    {selectedCamera.detection.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">LOCATION</p>
                  <p className="text-white font-semibold">{selectedCamera.location}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Camera Grid View */
          <div className="p-2 space-y-3">
            {/* Camera Grid */}
            <div className="grid grid-cols-2 gap-2">
              {cameras.map((camera) => (
                <motion.button
                  key={camera.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCameraSelect(camera)}
                  className="bg-dark-surface border border-dark-border rounded-lg p-2 text-left transition-all hover:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <Camera className={`w-3 h-3 ${getStatusColor(camera.status)}`} />
                      <span className="text-white text-xs font-medium truncate">{camera.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      camera.status === 'online' ? 'bg-green-400' : 
                      camera.status === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`text-xs ${getStatusColor(camera.status)}`}>
                      {camera.status.toUpperCase()}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getRiskLevelColor(camera.riskLevel)}`}>
                      {camera.riskLevel}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-2">
              <h3 className="text-white font-semibold mb-2 text-xs">QUICK ACTIONS</h3>
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded text-xs transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white'
                      : 'bg-dark-bg text-gray-300 hover:bg-dark-border'
                  }`}
                >
                  {isRecording ? 'STOP' : 'REC'}
                </button>
                <button className="p-2 bg-dark-bg text-gray-300 rounded hover:bg-dark-border transition-colors text-xs">
                  EXPORT
                </button>
                <button className="p-2 bg-dark-bg text-gray-300 rounded hover:bg-dark-border transition-colors text-xs">
                  SCAN
                </button>
                <button className="p-2 bg-construction-yellow text-black rounded hover:bg-yellow-400 transition-colors text-xs font-semibold">
                  SOS
                </button>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-2">
              <h3 className="text-white font-semibold mb-2 text-xs flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1 text-construction-yellow" />
                RECENT ALERTS
              </h3>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {detectionAlerts.length > 0 ? (
                  detectionAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-1.5 rounded border text-xs ${
                        alert.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/10 border-green-500/30 text-green-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs truncate">
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs opacity-75">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs text-center py-2">
                    No alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
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
              className="bg-dark-surface border border-dark-border rounded-lg p-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">CCTV Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-dark-bg rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Video Quality</label>
                  <select className="w-full p-1.5 bg-dark-bg border border-dark-border rounded text-white text-xs">
                    <option>High (1080p)</option>
                    <option>Medium (720p)</option>
                    <option>Low (480p)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">Motion Detection</label>
                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 bg-construction-yellow text-black rounded text-xs">Enabled</button>
                    <button className="px-2 py-1 bg-dark-bg text-gray-400 rounded text-xs">Disabled</button>
                  </div>
                </div>

                <button className="w-full p-1.5 bg-construction-yellow text-black rounded font-semibold hover:bg-yellow-400 transition-colors text-xs">
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}