'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { 
  X, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  AlertTriangle,
  Calendar,
  CheckCircle,
  Square
} from 'lucide-react';

export default function SiteManagementModal() {
  const { 
    sites, 
    addSite, 
    updateSite, 
    deleteSite, 
    workers,
    showSiteModal, 
    setShowSiteModal 
  } = useSafety();
  
  const [activeTab, setActiveTab] = useState('list');
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    projectType: '',
    client: '',
    supervisor: '',
    status: 'active',
    area: '',
    description: '',
    hazards: [],
    startDate: '',
    expectedCompletion: '',
    scannedMap: null
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      projectType: '',
      client: '',
      supervisor: '',
      status: 'active',
      area: '',
      description: '',
      hazards: [],
      startDate: '',
      expectedCompletion: '',
      scannedMap: null
    });
    setEditingSite(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHazardToggle = (hazard) => {
    setFormData(prev => ({
      ...prev,
      hazards: prev.hazards.includes(hazard)
        ? prev.hazards.filter(h => h !== hazard)
        : [...prev.hazards, hazard]
    }));
  };

  const handleMapUpload = () => {
    // Simulate Z.AI CCTV scanning process
    setFormData(prev => ({
      ...prev,
      scannedMap: {
        processed: true,
        aiAnalysis: "Site map is scanned and uploaded by AI integrated CCTV. Key areas and hazards have been automatically identified.",
        scanTime: new Date().toLocaleString(),
        confidence: 98.5,
        detectedHazards: prev.hazards.length,
        scanId: `SCAN-${Date.now()}`
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const siteData = {
      ...formData,
      workersCount: editingSite ? editingSite.workersCount : 0,
      lastInspection: new Date().toISOString().split('T')[0]
    };
    
    if (editingSite) {
      updateSite(editingSite.id, siteData);
    } else {
      addSite(siteData);
    }
    
    resetForm();
    setActiveTab('list');
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      location: site.location,
      projectType: site.projectType || '',
      client: site.client || '',
      supervisor: site.supervisor,
      status: site.status,
      area: site.area,
      description: site.description,
      hazards: site.hazards || [],
      startDate: site.startDate || '',
      expectedCompletion: site.expectedCompletion || '',
      scannedMap: site.scannedMap || null
    });
    setActiveTab('form');
  };

  const handleDelete = (siteId) => {
    if (confirm('Are you sure you want to delete this site?')) {
      deleteSite(siteId);
    }
  };

  const availableHazards = [
    'Working at Height',
    'Crane Operations',
    'Concrete Pouring',
    'Marine Construction',
    'Heavy Machinery',
    'Welding',
    'Chemical Storage',
    'Forklift Operation',
    'Electrical Work',
    'Excavation',
    'Confined Space',
    'Hot Work'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getWorkersCount = (siteName) => {
    return workers.filter(worker => worker.siteAssigned === siteName).length;
  };

  if (!showSiteModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowSiteModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-surface border border-dark-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-construction-yellow" />
              <div>
                <h2 className="text-xl font-bold text-white">Site Management</h2>
                <p className="text-sm text-gray-400">Manage construction sites</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSiteModal(false);
                resetForm();
                setActiveTab('list');
              }}
              className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-dark-border">
            <button
              onClick={() => {
                setActiveTab('list');
                resetForm();
              }}
              className={`flex-1 py-3 px-4 font-semibold transition-colors ${
                activeTab === 'list'
                  ? 'text-construction-yellow border-b-2 border-construction-yellow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Site List ({sites.length})
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 px-4 font-semibold transition-colors ${
                activeTab === 'form'
                  ? 'text-construction-yellow border-b-2 border-construction-yellow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {editingSite ? 'Edit Site' : 'Add New Site'}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'list' && (
              <div className="space-y-4">
                {sites.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No sites added yet</p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="mt-4 px-4 py-2 bg-construction-yellow text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Add First Site
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {sites.map((site) => (
                      <motion.div
                        key={site.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-bg border border-dark-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{site.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(site.status)}`}>
                                {site.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 mb-3">{site.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300 mb-3">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-construction-yellow" />
                                <span>{site.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-construction-yellow" />
                                <span>{getWorkersCount(site.name)} Workers</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Square className="w-4 h-4 text-construction-yellow" />
                                <span>{site.area}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-construction-yellow" />
                                <span>Supervisor: {site.supervisor}</span>
                              </div>
                              {site.projectType && (
                                <div className="flex items-center space-x-2">
                                  <Building className="w-4 h-4 text-construction-yellow" />
                                  <span>{site.projectType}</span>
                                </div>
                              )}
                              {site.client && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-400">Client:</span>
                                  <span>{site.client}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-construction-yellow" />
                                <span>Last Inspection: {site.lastInspection}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {site.hazards.map((hazard, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-red-400/20 text-red-400 rounded flex items-center space-x-1"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{hazard}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(site)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(site.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Kuala Lumpur Tower Project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Jalan Tun Razak, KL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                    >
                      <option value="">Select Project Type</option>
                      <option value="High-rise Building">High-rise Building</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Mega Construction Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Site Supervisor *
                    </label>
                    <input
                      type="text"
                      name="supervisor"
                      value={formData.supervisor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Chong Wei Ming"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-construction-yellow transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expected Completion
                    </label>
                    <input
                      type="date"
                      name="expectedCompletion"
                      value={formData.expectedCompletion}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-construction-yellow transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Area *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., 15000 sqm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Potential Hazards
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableHazards.map((hazard) => (
                      <label
                        key={hazard}
                        className="flex items-center space-x-2 p-2 bg-dark-bg border border-dark-border rounded-lg cursor-pointer hover:border-construction-yellow transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.hazards.includes(hazard)}
                          onChange={() => handleHazardToggle(hazard)}
                          className="w-4 h-4 text-construction-yellow bg-dark-bg border-dark-border rounded focus:ring-construction-yellow"
                        />
                        <span className="text-sm text-gray-300">{hazard}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Z.AI CCTV Map Scan
                  </label>
                  <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-construction-yellow transition-colors">
                    {formData.scannedMap ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto bg-construction-yellow/20 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-construction-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Z.AI Scanned
                          </div>
                        </div>
                        <div className="text-left space-y-2">
                          <p className="text-sm text-green-400">{formData.scannedMap.aiAnalysis}</p>
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>📅 Scan Time: {formData.scannedMap.scanTime}</p>
                            <p>🎯 Confidence: {formData.scannedMap.confidence}%</p>
                            <p>⚠️ Hazards Detected: {formData.scannedMap.detectedHazards}</p>
                            <p>🆔 Scan ID: {formData.scannedMap.scanId}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, scannedMap: null}))}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove Scan
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto bg-construction-yellow/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-construction-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 mb-2">
                            Trigger Z.AI integrated CCTV scan
                          </p>
                          <p className="text-xs text-gray-500">
                            AI will automatically scan and analyze the current site map from CCTV feeds
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleMapUpload}
                          className="px-4 py-2 bg-construction-yellow text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block"
                        >
                          🎥 Start AI Scan
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-construction-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    {editingSite ? 'Update Site' : 'Add Site'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('list');
                    }}
                    className="flex-1 py-2 px-4 bg-dark-bg text-white font-semibold border border-dark-border rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}