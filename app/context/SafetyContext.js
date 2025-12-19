'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SafetyContext = createContext();

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider = ({ children }) => {
  const [complianceScore, setComplianceScore] = useState(92);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [incidentLogs, setIncidentLogs] = useState([
    {
      id: 1,
      type: 'near_miss',
      title: 'Near Miss: Scaffolding Instability',
      location: 'Kuala Lumpur Tower Project',
      time: '10:30 AM',
      severity: 'medium',
      status: 'pending_review',
      description: 'Scaffolding section showed signs of instability but was secured before any accident occurred.',
      potentialCost: 75000,
      costSaved: 75000,
      date: '2024-12-19',
      reportedBy: 'System'
    },
    {
      id: 2,
      type: 'violation',
      title: 'PPE Violation: No Helmet',
      location: 'Penang Bridge Expansion',
      time: '09:45 AM',
      severity: 'high',
      status: 'resolved',
      description: 'Worker found without safety helmet in restricted area. Issue resolved immediately.',
      date: '2024-12-19',
      reportedBy: 'Siti Aishah'
    },
    {
      id: 3,
      type: 'inspection',
      title: 'Equipment Inspection Passed',
      location: 'Johor Bahru Industrial Park',
      time: '08:15 AM',
      severity: 'low',
      status: 'completed',
      description: 'Routine equipment inspection completed successfully. All equipment in good condition.',
      date: '2024-12-19',
      reportedBy: 'Raj Kumar'
    },
    {
      id: 4,
      type: 'near_miss',
      title: 'Crane Load Nearly Dropped',
      location: 'Kuala Lumpur Tower Project',
      time: '11:45 AM',
      severity: 'high',
      status: 'pending_review',
      description: 'Crane load slipped but safety mechanisms prevented complete drop. No injuries or damage.',
      potentialCost: 150000,
      costSaved: 150000,
      date: '2024-12-19',
      reportedBy: 'Ahmed Rahman'
    },
    {
      id: 5,
      type: 'violation',
      title: 'Unauthorized Access Restricted Area',
      location: 'Penang Bridge Expansion',
      time: '08:30 AM',
      severity: 'medium',
      status: 'active',
      description: 'Unauthorized personnel found in restricted construction zone. Removed and escorted out.',
      date: '2024-12-19',
      reportedBy: 'Security Team'
    }
  ]);

  const [activeZones] = useState(3);
  const [currentPersona, setCurrentPersona] = useState('manager');
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [redZoneActive, setRedZoneActive] = useState(false);
  const [currentIncidentAlert, setCurrentIncidentAlert] = useState(null);

  // Language Settings State
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Permit Management State
  const [permits, setPermits] = useState([
    {
      id: 1,
      type: 'Hot Work',
      location: 'Zone A - Building 2',
      requester: 'John Smith',
      expiry: '2 hours',
      status: 'active',
      issuedAt: '2024-12-19 10:00 AM',
      approvedBy: 'Chong Wei Ming',
      site: 'Kuala Lumpur Tower Project',
      description: 'Welding and cutting operations on level 3',
      riskLevel: 'medium',
      requirements: ['Fire Extinguisher', 'Fire Watch', 'Safety Screens']
    },
    {
      id: 2,
      type: 'Confined Space',
      location: 'Zone B - Basement',
      requester: 'Mike Johnson',
      expiry: '4 hours',
      status: 'pending',
      issuedAt: '2024-12-19 09:30 AM',
      approvedBy: null,
      site: 'Kuala Lumpur Tower Project',
      description: 'Maintenance work in underground water tank',
      riskLevel: 'high',
      requirements: ['Gas Monitor', 'Ventilation', 'Rescue Team', 'Harness']
    },
    {
      id: 3,
      type: 'Electrical Work',
      location: 'Zone C - Panel Room',
      requester: 'David Lee',
      expiry: '1 hour',
      status: 'active',
      issuedAt: '2024-12-19 11:00 AM',
      approvedBy: 'Chong Wei Ming',
      site: 'Kuala Lumpur Tower Project',
      description: 'Panel upgrade and maintenance',
      riskLevel: 'low',
      requirements: ['Lockout/Tagout', 'Insulated Tools', 'PPE']
    }
  ]);

  // Worker and Site Management State
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: 'Ahmed Rahman',
      employeeId: 'WRK-2024-0892',
      role: 'Construction Worker',
      department: 'Structural Works',
      phone: '+6012-345-6789',
      email: 'ahmed.rahman@safesite.ai',
      certifications: ['PPE Certified', 'Height Safety', 'First Aid'],
      status: 'active',
      siteAssigned: 'Kuala Lumpur Tower Project',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Michael Tan',
      employeeId: 'WRK-2024-0893',
      role: 'Electrician',
      department: 'Electrical',
      phone: '+6012-345-6790',
      email: 'michael.tan@safesite.ai',
      certifications: ['Electrical Safety', 'Confined Space'],
      status: 'active',
      siteAssigned: 'Johor Bahru Industrial Park',
      joinDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Raj Kumar',
      employeeId: 'WRK-2024-0894',
      role: 'Crane Operator',
      department: 'Heavy Machinery',
      phone: '+6012-345-6791',
      email: 'raj.kumar@safesite.ai',
      certifications: ['Crane Operation', 'Rigging', 'Signal Person'],
      status: 'on_leave',
      siteAssigned: 'Penang Bridge Expansion',
      joinDate: '2023-11-10'
    },
    {
      id: 4,
      name: 'Chong Wei Ming',
      employeeId: 'WRK-2024-0895',
      role: 'Site Supervisor',
      department: 'Management',
      phone: '+6017-234-5678',
      email: 'chong.wei@safesite.ai',
      certifications: ['Supervisor Cert', 'Safety Management', 'First Aid'],
      status: 'active',
      siteAssigned: 'Kuala Lumpur Tower Project',
      joinDate: '2024-01-10'
    },
    {
      id: 5,
      name: 'Siti Aishah binti Omar',
      employeeId: 'WRK-2024-0896',
      role: 'Safety Officer',
      department: 'Safety',
      phone: '+6019-345-6789',
      email: 'siti.aishah@safesite.ai',
      certifications: ['Safety Officer Cert', 'Risk Assessment', 'Environmental Management'],
      status: 'active',
      siteAssigned: 'Penang Bridge Expansion',
      joinDate: '2024-03-01'
    }
  ]);

  const [sites, setSites] = useState([
    {
      id: 1,
      name: 'Kuala Lumpur Tower Project',
      location: 'Jalan Tun Razak, KL',
      projectType: 'High-rise Building',
      client: 'Mega Construction Corp',
      supervisor: 'Chong Wei Ming',
      status: 'active',
      workersCount: 25,
      area: '15000 sqm',
      description: '60-story commercial tower with shopping complex',
      hazards: ['Working at Height', 'Crane Operations', 'Concrete Pouring'],
      lastInspection: '2024-12-18',
      startDate: '2024-01-15',
      expectedCompletion: '2025-12-31'
    },
    {
      id: 2,
      name: 'Penang Bridge Expansion',
      location: 'George Town, Penang',
      projectType: 'Infrastructure',
      client: 'Public Works Department',
      supervisor: 'Siti Aishah binti Omar',
      status: 'active',
      workersCount: 18,
      area: '50000 sqm',
      description: 'Bridge expansion and reinforcement project',
      hazards: ['Marine Construction', 'Heavy Machinery', 'Welding'],
      lastInspection: '2024-12-17',
      startDate: '2024-03-01',
      expectedCompletion: '2026-06-30'
    },
    {
      id: 3,
      name: 'Johor Bahru Industrial Park',
      location: 'Tebrau, Johor Bahru',
      projectType: 'Industrial',
      client: 'Southern Manufacturing Sdn Bhd',
      supervisor: 'Raj Kumar',
      status: 'maintenance',
      workersCount: 7,
      area: '25000 sqm',
      description: 'Manufacturing facility and warehouse complex',
      hazards: ['Chemical Storage', 'Forklift Operation', 'Electrical Work'],
      lastInspection: '2024-12-15',
      startDate: '2023-11-01',
      expectedCompletion: '2025-03-31'
    }
  ]);

  // Mock user database
  const mockUsers = [
    {
      id: 1,
      username: 'manager',
      password: 'manager123',
      role: 'manager',
      name: 'John Smith',
      email: 'john.smith@safesite.ai'
    },
    {
      id: 2,
      username: 'supervisor',
      password: 'supervisor123',
      role: 'supervisor',
      name: 'Ahmed Rahman',
      email: 'ahmed.rahman@safesite.ai'
    },
    {
      id: 3,
      username: 'worker',
      password: 'worker123',
      role: 'worker',
      name: 'Michael Tan',
      email: 'michael.tan@safesite.ai'
    }
  ];

  const login = (username, password, role) => {
    const user = mockUsers.find(u =>
      u.username === username &&
      u.password === password &&
      u.role === role
    );
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentPersona(role);
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPersona('manager');
  };

  // Worker Management Functions
  const addWorker = (workerData) => {
    const newWorker = {
      id: workers.length + 1,
      ...workerData,
      employeeId: `WRK-2024-${String(workers.length + 892).padStart(4, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setWorkers([...workers, newWorker]);
    return { success: true, worker: newWorker };
  };

  const updateWorker = (workerId, updatedData) => {
    setWorkers(workers.map(worker =>
      worker.id === workerId ? { ...worker, ...updatedData } : worker
    ));
    return { success: true };
  };

  const deleteWorker = (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
    return { success: true };
  };

  // Site Management Functions
  const addSite = (siteData) => {
    const newSite = {
      id: sites.length + 1,
      ...siteData,
      workersCount: 0,
      status: 'active',
      lastInspection: new Date().toISOString().split('T')[0]
    };
    setSites([...sites, newSite]);
    return { success: true, site: newSite };
  };

  const updateSite = (siteId, updatedData) => {
    setSites(sites.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ));
    return { success: true };
  };

  const deleteSite = (siteId) => {
    setSites(sites.filter(site => site.id !== siteId));
    return { success: true };
  };

  const addIncident = (incident) => {
    const newIncident = {
      id: incidentLogs.length + 1,
      ...incident,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      reportedBy: currentUser?.name || 'System'
    };
    setIncidentLogs([newIncident, ...incidentLogs]);
    
    // Trigger alert for managers if user is not a manager
    if (currentUser?.role !== 'manager') {
      setCurrentIncidentAlert(newIncident);
    }
  };

  const triggerIncidentAlert = (incident) => {
    setCurrentIncidentAlert(incident);
  };

  const dismissIncidentAlert = () => {
    setCurrentIncidentAlert(null);
  };

  const updateComplianceScore = (newScore) => {
    setComplianceScore(Math.max(0, Math.min(100, newScore)));
  };

  const reviewIncident = (incidentId) => {
    const incident = incidentLogs.find(log => log.id === incidentId);
    setSelectedIncident(incident);
    setShowModal(true);
  };

  const getTranslatedText = (violationType, language) => {
    const translations = {
      'UNHOOKED HARNESS': {
        english: 'WARNING: Unhooked Safety Harness',
        malay: 'AMARAN: Tali pinggang keselamatan tidak dipasang',
        rojak: 'WARNING: Unhooked Safety Harness! AMARAN: Tali pinggang keselamatan tidak dipasang!',
        bengali: 'সতর্কতা: সুরক্ষা হারনেস খোলা আছে'
      },
      'NO HELMET': {
        english: 'WARNING: No Safety Helmet Worn',
        malay: 'AMARAN: Tidak memakai topi keselamatan',
        rojak: 'WARNING: No Helmet! AMARAN: Tak pakai topi keselamatan!',
        bengali: 'সতর্কতা: সুরক্ষা হেলমেট পরা হয়নি'
      },
      'UNAUTHORIZED ACCESS': {
        english: 'WARNING: Unauthorized Access to Restricted Area',
        malay: 'AMARAN: Akses tanpa kebenaran ke kawasan terhad',
        rojak: 'WARNING: Unauthorized Access! AMARAN: Masuk kawasan larang tanpa izin!',
        bengali: 'সতর্কতা: সীমাবদ্ধ এলাকায় অননুমোদিত প্রবেশ'
      }
    };

    return translations[violationType]?.[language] || translations[violationType]?.english || `WARNING: ${violationType}`;
  };

  const triggerViolationAlert = (workerName, violationType) => {
    const translatedMessage = getTranslatedText(violationType, selectedLanguage);
    const displayMessage = `${translatedMessage} (Worker: ${workerName})`;
    
    setAlertMessage(displayMessage);
    setShowAlert(true);
    
    // Update compliance score
    updateComplianceScore(complianceScore - 2);
    
    // Add incident log
    addIncident({
      type: 'violation',
      title: violationType,
      location: 'Kuala Lumpur Tower Project',
      severity: 'high',
      status: 'active'
    });

    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const simulateAIScan = (area) => {
    setScanResult(null);
    
    // Simulate scanning delay
    setTimeout(() => {
      const results = {
        'hot_work': {
          status: 'approved',
          message: 'Z.AI: Fire Extinguisher Detected. Permit Approved.',
          confidence: 98
        },
        'confined_space': {
          status: 'warning',
          message: 'Z.AI: Gas Levels Elevated. Additional Ventilation Required.',
          confidence: 85
        },
        'electrical': {
          status: 'approved',
          message: 'Z.AI: All Safety Measures in Place. Work Authorized.',
          confidence: 95
        }
      };
      
      setScanResult(results[area] || results['hot_work']);
    }, 2000);
  };

  const simulateRedZone = () => {
    setRedZoneActive(true);
    
    // Add critical incident
    addIncident({
      type: 'danger',
      title: 'Worker Entered Restricted Red Zone',
      location: 'Red Zone - High Risk Area',
      severity: 'critical',
      status: 'active'
    });

    // Stop alert after 3 seconds
    setTimeout(() => {
      setRedZoneActive(false);
    }, 3000);
  };

  // Permit Management Functions
  const approvePermit = (permitId) => {
    setPermits(permits.map(permit =>
      permit.id === permitId
        ? {
            ...permit,
            status: 'active',
            approvedBy: currentUser?.name || 'System',
            approvedAt: new Date().toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              month: 'short',
              day: 'numeric'
            })
          }
        : permit
    ));

    // Add incident log for permit approval
    addIncident({
      type: 'permit',
      title: `Permit Approved: ${permits.find(p => p.id === permitId)?.type}`,
      location: permits.find(p => p.id === permitId)?.location || 'Unknown Location',
      severity: 'low',
      status: 'completed',
      description: `${permits.find(p => p.id === permitId)?.type} permit has been approved and is now active.`
    });

    return { success: true };
  };

  const rejectPermit = (permitId, reason = 'Safety requirements not met') => {
    setPermits(permits.map(permit =>
      permit.id === permitId
        ? { ...permit, status: 'rejected', rejectedBy: currentUser?.name || 'System', rejectedReason: reason }
        : permit
    ));

    // Add incident log for permit rejection
    addIncident({
      type: 'permit',
      title: `Permit Rejected: ${permits.find(p => p.id === permitId)?.type}`,
      location: permits.find(p => p.id === permitId)?.location || 'Unknown Location',
      severity: 'medium',
      status: 'completed',
      description: `${permits.find(p => p.id === permitId)?.type} permit has been rejected. Reason: ${reason}`
    });

    return { success: true };
  };

  const extendPermit = (permitId, additionalHours = 2) => {
    setPermits(permits.map(permit =>
      permit.id === permitId
        ? { ...permit, expiry: `${additionalHours + 2} hours` }
        : permit
    ));

    // Add incident log for permit extension
    addIncident({
      type: 'permit',
      title: `Permit Extended: ${permits.find(p => p.id === permitId)?.type}`,
      location: permits.find(p => p.id === permitId)?.location || 'Unknown Location',
      severity: 'low',
      status: 'completed',
      description: `${permits.find(p => p.id === permitId)?.type} permit has been extended by ${additionalHours} hours.`
    });

    return { success: true };
  };

  const completePermit = (permitId) => {
    setPermits(permits.map(permit =>
      permit.id === permitId
        ? { ...permit, status: 'completed', completedAt: new Date().toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
          })}
        : permit
    ));

    // Add incident log for permit completion
    addIncident({
      type: 'permit',
      title: `Permit Completed: ${permits.find(p => p.id === permitId)?.type}`,
      location: permits.find(p => p.id === permitId)?.location || 'Unknown Location',
      severity: 'low',
      status: 'completed',
      description: `${permits.find(p => p.id === permitId)?.type} permit has been completed successfully.`
    });

    return { success: true };
  };

  const addPermit = (permitData) => {
    const newPermit = {
      id: permits.length + 1,
      ...permitData,
      status: 'pending',
      issuedAt: new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      }),
      approvedBy: null,
      approvedAt: null
    };
    setPermits([...permits, newPermit]);
    
    // Add incident log for new permit request
    addIncident({
      type: 'permit',
      title: `New Permit Request: ${permitData.type}`,
      location: permitData.location || 'Unknown Location',
      severity: 'low',
      status: 'pending_review',
      description: `New ${permitData.type} permit request submitted by ${permitData.requester}.`
    });

    return { success: true, permit: newPermit };
  };

  const value = {
    complianceScore,
    incidentLogs,
    activeZones,
    currentPersona,
    setCurrentPersona,
    showModal,
    setShowModal,
    selectedIncident,
    reviewIncident,
    showAlert,
    setShowAlert,
    alertMessage,
    triggerViolationAlert,
    scanResult,
    simulateAIScan,
    redZoneActive,
    simulateRedZone,
    addIncident,
    updateComplianceScore,
    isAuthenticated,
    currentUser,
    login,
    logout,
    mockUsers,
    // Worker Management
    workers,
    addWorker,
    updateWorker,
    deleteWorker,
    showWorkerModal,
    setShowWorkerModal,
    // Site Management
    sites,
    addSite,
    updateSite,
    deleteSite,
    showSiteModal,
    setShowSiteModal,
    // Incident Alert System
    currentIncidentAlert,
    triggerIncidentAlert,
    dismissIncidentAlert,
    // Permit Management
    permits,
    approvePermit,
    rejectPermit,
    extendPermit,
    completePermit,
    addPermit,
    // Language Settings
    selectedLanguage,
    setSelectedLanguage,
    getTranslatedText
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};