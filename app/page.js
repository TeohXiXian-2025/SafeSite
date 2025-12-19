'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from './context/SafetyContext';
import {
  Building2,
  HardHat,
  User,
  AlertTriangle,
  Shield,
  Activity,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import ProjectManagerDashboard from './components/ProjectManagerDashboard';
import SiteSupervisorApp from './components/SiteSupervisorApp';
import WorkerDigitalPassport from './components/WorkerDigitalPassport';
import IncidentModal from './components/IncidentModal';
import ViolationAlert from './components/ViolationAlert';
import LoginPage from './components/LoginPage';
import WorkerManagementModal from './components/WorkerManagementModal';
import SiteManagementModal from './components/SiteManagementModal';

export default function Home() {
  const {
    currentPersona,
    setCurrentPersona,
    redZoneActive,
    isAuthenticated,
    currentUser,
    logout
  } = useSafety();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const personas = [
    {
      id: 'manager',
      name: 'Project Manager',
      icon: Building2,
      description: 'Overview & Analytics'
    },
    {
      id: 'supervisor',
      name: 'Site Supervisor',
      icon: HardHat,
      description: 'On-site Management'
    },
    {
      id: 'worker',
      name: 'Worker Passport',
      icon: User,
      description: 'Personal Safety'
    }
  ];

  const renderCurrentView = () => {
    switch (currentPersona) {
      case 'manager':
        return <ProjectManagerDashboard />;
      case 'supervisor':
        return <SiteSupervisorApp />;
      case 'worker':
        return <WorkerDigitalPassport />;
      default:
        return <ProjectManagerDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-dark-bg ${redZoneActive ? 'red-zone-alert' : ''}`}>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-80 bg-dark-surface border-r border-dark-border z-40"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-construction-yellow rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SafeSite AI</h1>
                <p className="text-xs text-gray-400">Powered by YTL AI Cloud</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 bg-dark-bg rounded-lg border border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="space-y-2">
            {/* Only show current user's role */}
            {personas.filter(persona => persona.id === currentPersona).map((persona) => {
              const Icon = persona.icon;
              return (
                <div
                  key={persona.id}
                  className={`w-full flex items-center space-x-4 p-4 rounded-lg bg-construction-yellow text-black`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{persona.name}</div>
                    <div className="text-xs text-black/70">
                      {persona.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-dark-bg rounded-lg border border-dark-border">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-construction-yellow" />
              <span className="text-sm font-semibold text-white">System Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">AI Engine</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Database</span>
                <span className="text-green-400">Synced</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Last Update</span>
                <span className="text-gray-300">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed left-4 top-4 z-50 p-2 bg-construction-yellow rounded-lg text-black lg:hidden ${sidebarOpen ? 'hidden' : ''}`}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPersona}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Components */}
      <IncidentModal />
      <ViolationAlert />
      <WorkerManagementModal />
      <SiteManagementModal />
    </div>
  );
}