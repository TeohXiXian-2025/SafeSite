'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import { 
  X, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function WorkerManagementModal() {
  const {
    workers,
    addWorker,
    updateWorker,
    deleteWorker,
    sites,
    showWorkerModal,
    setShowWorkerModal
  } = useSafety();
  
  const [activeTab, setActiveTab] = useState('list');
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    email: '',
    certifications: [],
    siteAssigned: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      certifications: [],
      siteAssigned: ''
    });
    setEditingWorker(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationToggle = (cert) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingWorker) {
      updateWorker(editingWorker.id, formData);
    } else {
      addWorker(formData);
    }
    
    resetForm();
    setActiveTab('list');
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      role: worker.role,
      department: worker.department,
      phone: worker.phone,
      email: worker.email,
      certifications: worker.certifications,
      siteAssigned: worker.siteAssigned
    });
    setActiveTab('form');
  };

  const handleDelete = (workerId) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      deleteWorker(workerId);
    }
  };

  const availableCertifications = [
    'PPE Certified',
    'Height Safety',
    'First Aid',
    'Electrical Safety',
    'Confined Space',
    'Crane Operation',
    'Rigging',
    'Signal Person',
    'Welding',
    'Scaffolding'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'on_leave': return 'text-yellow-400 bg-yellow-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (!showWorkerModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowWorkerModal(false)}
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
              <User className="w-6 h-6 text-construction-yellow" />
              <div>
                <h2 className="text-xl font-bold text-white">Worker Management</h2>
                <p className="text-sm text-gray-400">Manage your workforce</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowWorkerModal(false);
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
              Worker List ({workers.length})
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 px-4 font-semibold transition-colors ${
                activeTab === 'form'
                  ? 'text-construction-yellow border-b-2 border-construction-yellow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {editingWorker ? 'Edit Worker' : 'Add New Worker'}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'list' && (
              <div className="space-y-4">
                {workers.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No workers added yet</p>
                    <button
                      onClick={() => setActiveTab('form')}
                      className="mt-4 px-4 py-2 bg-construction-yellow text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Add First Worker
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {workers.map((worker) => (
                      <motion.div
                        key={worker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-bg border border-dark-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{worker.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(worker.status)}`}>
                                {worker.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-construction-yellow" />
                                <span>{worker.employeeId}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-construction-yellow" />
                                <span>{worker.role}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-construction-yellow" />
                                <span>{worker.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-construction-yellow" />
                                <span>{worker.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-construction-yellow" />
                                <span>Joined: {worker.joinDate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-construction-yellow" />
                                <span>{worker.siteAssigned}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {worker.certifications.map((cert, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-construction-yellow/20 text-construction-yellow rounded"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEdit(worker)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(worker.id)}
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="Enter worker's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Construction Worker, Electrician"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="e.g., Structural Works, Electrical"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="worker@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-construction-yellow transition-colors"
                      placeholder="+6012-345-6789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assigned Site *
                    </label>
                    <select
                      name="siteAssigned"
                      value={formData.siteAssigned}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-construction-yellow transition-colors"
                    >
                      <option value="">Select a site</option>
                      {sites.filter(site => site.status === 'active').map((site) => (
                        <option key={site.id} value={site.name}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certifications
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableCertifications.map((cert) => (
                      <label
                        key={cert}
                        className="flex items-center space-x-2 p-2 bg-dark-bg border border-dark-border rounded-lg cursor-pointer hover:border-construction-yellow transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert)}
                          onChange={() => handleCertificationToggle(cert)}
                          className="w-4 h-4 text-construction-yellow bg-dark-bg border-dark-border rounded focus:ring-construction-yellow"
                        />
                        <span className="text-sm text-gray-300">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-construction-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    {editingWorker ? 'Update Worker' : 'Add Worker'}
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