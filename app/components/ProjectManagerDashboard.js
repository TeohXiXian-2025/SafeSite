'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '../context/SafetyContext';
import IncidentAlert from './IncidentAlert';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  Users,
  Shield,
  UserPlus,
  Building,
  Plus,
  Download,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ProjectManagerDashboard() {
  const {
    complianceScore,
    activeZones,
    incidentLogs,
    reviewIncident,
    workers,
    sites,
    setShowWorkerModal,
    setShowSiteModal,
    updateWorker,
    updateSite,
    currentIncidentAlert,
    dismissIncidentAlert,
    addIncident,
    triggerIncidentAlert
  } = useSafety();
  
  const [selectedSiteForMap, setSelectedSiteForMap] = useState(sites.find(s => s.status === 'active')?.name || '');
  const [selectedSiteForIncidents, setSelectedSiteForIncidents] = useState('all');
  const [showWorkerList, setShowWorkerList] = useState(false);
  const dashboardRef = useRef(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending_review': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  // Status toggle functions
  const toggleWorkerStatus = (status) => {
    const workersToToggle = workers.filter(w => w.status !== status);
    if (workersToToggle.length > 0) {
      if (confirm(`Change ${workersToToggle.length} worker(s) to ${status}?`)) {
        workersToToggle.forEach(worker => {
          updateWorker(worker.id, { status });
        });
      }
    }
  };

  const toggleAllWorkersStatus = (status) => {
    if (confirm(`Set all workers to ${status}?`)) {
      workers.forEach(worker => {
        updateWorker(worker.id, { status });
      });
    }
  };

  const toggleSiteStatus = (status) => {
    const sitesToToggle = sites.filter(s => s.status !== status);
    if (sitesToToggle.length > 0) {
      if (confirm(`Change ${sitesToToggle.length} site(s) to ${status}?`)) {
        sitesToToggle.forEach(site => {
          updateSite(site.id, { status });
        });
      }
    }
  };

  const toggleAllSitesStatus = (status) => {
    if (confirm(`Set all sites to ${status}?`)) {
      sites.forEach(site => {
        updateSite(site.id, { status });
      });
    }
  };

  const showWorkerStatusModal = () => {
    // Show worker management modal
    setShowWorkerModal(true);
  };

  const showSiteStatusModal = () => {
    // Show site management modal
    setShowSiteModal(true);
  };

  const exportToPDF = async () => {
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f0f0f'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Add metadata
      pdf.setProperties({
        title: 'SafeSite AI Dashboard Report',
        subject: 'Construction Safety Dashboard',
        author: 'SafeSite AI System',
        keywords: 'safety, construction, dashboard',
        creator: 'SafeSite AI by YTL AI Labs'
      });
      
      // Save with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      pdf.save(`safesite-dashboard-${timestamp}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const triggerTestIncident = () => {
    const testIncident = {
      type: 'near_miss',
      title: 'Test Incident: Equipment Malfunction',
      description: 'This is a test incident to demonstrate the alert system.',
      location: 'Test Site - Zone A',
      severity: 'high',
      status: 'pending_review',
      potentialCost: 50000, // Potential cost if accident happened
      costSaved: 50000     // Money saved by preventing accident
    };
    
    addIncident(testIncident);
    triggerIncidentAlert(testIncident);
  };

  const generateComplianceReport = () => {
    try {
      const pdf = new jsPDF();
      
      // Set font for better Unicode support
      pdf.setFont('helvetica');
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(255, 184, 0); // Construction yellow
      pdf.text('COMPLIANCE & SAFETY REPORT', 105, 20, { align: 'center' });
      
      // Report Metadata
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
      pdf.text('SafeSite AI - YTL AI Labs', 105, 35, { align: 'center' });
      
      // Executive Summary
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Executive Summary', 20, 55);
      
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      const summary = `This report provides a comprehensive overview of safety compliance and performance across all active construction sites. The overall compliance score of 91.7% indicates excellent adherence to safety protocols and regulations.`;
      const splitSummary = pdf.splitTextToSize(summary, 170);
      pdf.text(splitSummary, 20, 65);
      
      let currentY = 65 + (splitSummary.length * 5) + 10;
      
      // Compliance Metrics
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Compliance Metrics', 20, currentY);
      
      currentY += 10;
      
      const metrics = [
        { name: 'PPE Compliance', score: complianceScore, status: 'Excellent' },
        { name: 'Safety Training', score: 88, status: 'Good' },
        { name: 'Equipment Inspection', score: 95, status: 'Excellent' },
        { name: 'Incident Response Time', score: 92, status: 'Excellent' },
        { name: 'Hazard Reporting', score: 85, status: 'Good' }
      ];
      
      metrics.forEach((metric, index) => {
        pdf.setFontSize(10);
        pdf.setTextColor(200, 200, 200);
        pdf.text(`${index + 1}. ${metric.name}: ${metric.score}% (${metric.status})`, 20, currentY + (index * 8));
      });
      
      currentY += (metrics.length * 8) + 15;
      
      // Incident Analysis
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Incident Analysis', 20, currentY);
      
      currentY += 10;
      
      const totalIncidents = incidentLogs.length;
      const nearMisses = incidentLogs.filter(i => i.type === 'near_miss').length;
      const violations = incidentLogs.filter(i => i.type === 'violation').length;
      const totalCostSaved = incidentLogs
        .filter(i => i.type === 'near_miss')
        .reduce((sum, i) => sum + (i.costSaved || 0), 0);
      
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(`Total Incidents: ${totalIncidents}`, 20, currentY);
      pdf.text(`Near Misses: ${nearMisses}`, 20, currentY + 8);
      pdf.text(`Violations: ${violations}`, 20, currentY + 16);
      pdf.text(`Total Cost Saved (Near Misses): RM ${totalCostSaved.toLocaleString()}`, 20, currentY + 24);
      
      currentY += 40;
      
      // Recommendations
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Recommendations', 20, currentY);
      
      currentY += 10;
      
      const recommendations = [
        'Continue regular PPE inspections to maintain high compliance rate',
        'Increase safety training frequency to improve overall score',
        'Implement additional hazard identification programs',
        'Enhance incident reporting system for faster response times',
        'Conduct monthly safety audits to ensure continuous improvement'
      ];
      
      recommendations.forEach((rec, index) => {
        pdf.setFontSize(9);
        pdf.setTextColor(200, 200, 200);
        const splitRec = pdf.splitTextToSize(`${index + 1}. ${rec}`, 170);
        pdf.text(splitRec, 20, currentY + (index * 12));
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('This report is automatically generated by SafeSite AI system.', 105, 280, { align: 'center' });
      pdf.text('For questions or concerns, contact safety management team.', 105, 285, { align: 'center' });
      
      // Save with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      pdf.save(`compliance-report-${timestamp}.pdf`);
      
    } catch (error) {
      console.error('Error generating compliance report:', error);
      alert('Failed to generate compliance report. Please try again.');
    }
  };

  const exportIncidentToPDF = async (incident) => {
    try {
      const pdf = new jsPDF();
      
      // Set font for better Unicode support
      pdf.setFont('helvetica');
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(255, 184, 0); // Construction yellow
      pdf.text('INCIDENT REPORT', 105, 20, { align: 'center' });
      
      // Incident Details
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Incident Details:', 20, 40);
      
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(`Title: ${incident.title}`, 20, 50);
      pdf.text(`Type: ${incident.type.replace('_', ' ').toUpperCase()}`, 20, 60);
      pdf.text(`Severity: ${incident.severity.toUpperCase()}`, 20, 70);
      pdf.text(`Location: ${incident.location}`, 20, 80);
      pdf.text(`Time: ${incident.time}`, 20, 90);
      pdf.text(`Date: ${incident.date || new Date().toISOString().split('T')[0]}`, 20, 100);
      pdf.text(`Status: ${incident.status.replace('_', ' ').toUpperCase()}`, 20, 110);
      
      if (incident.reportedBy) {
        pdf.text(`Reported By: ${incident.reportedBy}`, 20, 120);
      }
      
      // Description
      if (incident.description) {
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Description:', 20, 140);
        
        pdf.setFontSize(10);
        pdf.setTextColor(200, 200, 200);
        const splitDescription = pdf.splitTextToSize(incident.description, 170);
        pdf.text(splitDescription, 20, 150);
      }
      
      // Cost Analysis for Near Miss
      if (incident.type === 'near_miss') {
        const costSaved = incident.costSaved || Math.floor(Math.random() * 100000) + 10000;
        const potentialCost = incident.potentialCost || costSaved;
        
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Cost Analysis:', 20, 180);
        
        pdf.setFontSize(10);
        pdf.setTextColor(200, 200, 200);
        pdf.text(`Potential Cost if Accident Occurred: RM ${potentialCost.toLocaleString()}`, 20, 190);
        pdf.setTextColor(0, 255, 0); // Green for savings
        pdf.text(`Cost Saved by Prevention: RM ${costSaved.toLocaleString()}`, 20, 200);
        
        // Add visual emphasis
        pdf.setDrawColor(255, 184, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(15, 175, 180, 35);
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generated by SafeSite AI - YTL AI Labs', 105, 280, { align: 'center' });
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
      
      // Save with incident details
      const incidentTitle = incident.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      pdf.save(`incident-${incidentTitle}-${timestamp}.pdf`);
      
    } catch (error) {
      console.error('Error generating incident PDF:', error);
      alert('Failed to generate incident PDF. Please try again.');
    }
  };

  return (
    <div className="p-8" ref={dashboardRef}>
      {/* Header with Real-time Ticker */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Project Manager Dashboard</h1>
        
        {/* Real-time Ticker */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4 overflow-hidden">
          <div className="flex items-center space-x-8 animate-pulse-slow">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-construction-yellow" />
              <span className="text-construction-yellow font-semibold">
                {complianceScore}% PPE Compliance
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">
                {sites.length} Active Sites
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                {workers.length} Total Workers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">
                98% Safety Score Today
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Export and Test Controls */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <button
          onClick={exportToPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-construction-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Dashboard as PDF</span>
        </button>
        
        <button
          onClick={triggerTestIncident}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Test Incident Alert</span>
        </button>
      </motion.div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* ROI Tracking Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              ROI Tracking
            </h3>
            <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">+12.5%</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Safety Investment</span>
                <span className="text-white">RM 250,000</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Cost Saved</span>
                <span className="text-green-400">RM 425,000</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-dark-border">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Net ROI</span>
                <span className="text-xl font-bold text-green-400">70%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">RM 175,000 net savings</p>
            </div>
          </div>
        </motion.div>

        {/* Risk Analytics Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-400" />
              Risk Analytics
            </h3>
            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">Medium</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Critical Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white text-sm font-semibold">2</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">High Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-white text-sm font-semibold">5</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Medium Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-sm font-semibold">8</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Low Risk</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm font-semibold">12</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-dark-border">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Risk Score</span>
                <span className="text-xl font-bold text-yellow-400">6.2</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of 10 (Lower is better)</p>
            </div>
          </div>
        </motion.div>

        {/* Compliance Report Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-surface border border-dark-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-construction-yellow" />
              Compliance Report
            </h3>
            <button
              onClick={generateComplianceReport}
              className="text-xs text-construction-yellow hover:text-yellow-300 font-semibold"
            >
              Generate PDF
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">PPE Compliance</span>
                <span className="text-white">{complianceScore}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-construction-yellow h-2 rounded-full" style={{ width: `${complianceScore}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Safety Training</span>
                <span className="text-white">88%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Equipment Inspection</span>
                <span className="text-white">95%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-dark-border">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Overall Score</span>
                <span className="text-xl font-bold text-construction-yellow">91.7%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Excellent Performance</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Management Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-dark-surface border border-dark-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Worker Management</h3>
                  <p className="text-sm text-gray-400">{workers.length} Total Workers</p>
                </div>
              </div>
              <button
                onClick={() => setShowWorkerModal(true)}
                className="p-2 bg-construction-yellow rounded-lg text-black hover:bg-yellow-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleWorkerStatus('active')}>
                <p className="text-2xl font-bold text-green-400">
                  {workers.filter(w => w.status === 'active').length}
                </p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleWorkerStatus('on_leave')}>
                <p className="text-2xl font-bold text-yellow-400">
                  {workers.filter(w => w.status === 'on_leave').length}
                </p>
                <p className="text-xs text-gray-400">On Leave</p>
              </div>
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleWorkerStatus('inactive')}>
                <p className="text-2xl font-bold text-red-400">
                  {workers.filter(w => w.status === 'inactive').length}
                </p>
                <p className="text-xs text-gray-400">Inactive</p>
              </div>
            </div>
            
            {/* Individual Worker Status Toggle */}
            <div className="mt-4 pt-4 border-t border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Individual Worker Status:</p>
                <button
                  onClick={() => setShowWorkerList(!showWorkerList)}
                  className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 rounded hover:bg-gray-600/30 transition-colors"
                >
                  {showWorkerList ? 'Hide' : 'Show'} Workers
                </button>
              </div>
              
              {showWorkerList && (
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {workers.map((worker) => (
                    <div key={worker.id} className="flex items-center justify-between p-2 bg-dark-bg/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          worker.status === 'active' ? 'bg-green-400' :
                          worker.status === 'on_leave' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-xs text-white">{worker.name}</span>
                        <span className="text-xs text-gray-400">({worker.role})</span>
                      </div>
                      <select
                        value={worker.status}
                        onChange={(e) => updateWorker(worker.id, { status: e.target.value })}
                        className="text-xs bg-dark-border text-white px-2 py-1 rounded focus:outline-none focus:border-construction-yellow"
                      >
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Worker Status Toggle */}
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-xs text-gray-400 mb-2">Quick Actions:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => showWorkerStatusModal()}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Manage Workers
                </button>
                <button
                  onClick={() => toggleAllWorkersStatus('active')}
                  className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                >
                  Activate All
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-surface border border-dark-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Site Management</h3>
                  <p className="text-sm text-gray-400">{sites.length} Total Sites</p>
                </div>
              </div>
              <button
                onClick={() => setShowSiteModal(true)}
                className="p-2 bg-construction-yellow rounded-lg text-black hover:bg-yellow-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleSiteStatus('active')}>
                <p className="text-2xl font-bold text-green-400">
                  {sites.filter(s => s.status === 'active').length}
                </p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleSiteStatus('maintenance')}>
                <p className="text-2xl font-bold text-yellow-400">
                  {sites.filter(s => s.status === 'maintenance').length}
                </p>
                <p className="text-xs text-gray-400">Maintenance</p>
              </div>
              <div className="cursor-pointer hover:bg-dark-bg/50 p-2 rounded-lg transition-colors" onClick={() => toggleSiteStatus('inactive')}>
                <p className="text-2xl font-bold text-red-400">
                  {sites.filter(s => s.status === 'inactive').length}
                </p>
                <p className="text-xs text-gray-400">Inactive</p>
              </div>
            </div>
            
            {/* Quick Site Status Toggle */}
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-xs text-gray-400 mb-2">Quick Actions:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => showSiteStatusModal()}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Manage Sites
                </button>
                <button
                  onClick={() => toggleAllSitesStatus('active')}
                  className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                >
                  Activate All Sites
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Digital Twin Map */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-construction-yellow" />
                Digital Twin - Site Overview
              </h2>
              
              {/* Site Selector for Map */}
              <select
                value={selectedSiteForMap}
                onChange={(e) => setSelectedSiteForMap(e.target.value)}
                className="bg-dark-bg border border-dark-border text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-construction-yellow"
              >
                {sites.filter(site => site.status === 'active').map(site => (
                  <option key={site.id} value={`${site.name} - ${site.id}`}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Simulated Site Map */}
            <div className="relative bg-dark-bg rounded-lg p-8 h-96 overflow-hidden">
              {selectedSiteForMap && (() => {
                const siteName = selectedSiteForMap.split(' - ')[0];
                const site = sites.find(s => s.name === siteName);
                const siteWorkers = workers.filter(w => w.assignedSite === siteName);
                
                if (!site) return null;
                
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-white mb-4">{siteName}</h3>
                    
                    {site.projectType === 'High-rise Building' && (
                      /* High-rise Building Site Map */
                      <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                        {/* Site Boundary */}
                        <rect x="20" y="20" width="360" height="260" fill="#1a1a1a" stroke="#FFB800" strokeWidth="2" rx="8"/>
                        
                        {/* Building Foundation */}
                        <rect x="150" y="180" width="100" height="80" fill="#333" stroke="#666" strokeWidth="1"/>
                        <text x="200" y="225" fill="#FFB800" textAnchor="middle" fontSize="10">FOUNDATION</text>
                        
                        {/* Building Structure */}
                        <rect x="160" y="100" width="80" height="80" fill="#444" stroke="#888" strokeWidth="1"/>
                        <rect x="170" y="110" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="190" y="110" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="210" y="110" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="170" y="130" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="190" y="130" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="210" y="130" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="170" y="150" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="190" y="150" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        <rect x="210" y="150" width="15" height="15" fill="#4A90E2" opacity="0.7"/>
                        
                        {/* Crane */}
                        <line x1="260" y1="100" x2="290" y2="60" stroke="#FFB800" strokeWidth="3"/>
                        <circle cx="290" cy="60" r="4" fill="#FFB800"/>
                        <line x1="287" y1="60" x2="287" y2="80" stroke="#FFB800" strokeWidth="2"/>
                        
                        {/* Hazard Areas */}
                        <rect x="50" y="40" width="60" height="40" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="3"/>
                        <text x="80" y="65" fill="#ff0000" textAnchor="middle" fontSize="8" fontWeight="bold">CRANE ZONE</text>
                        
                        <rect x="290" y="180" width="70" height="40" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="3"/>
                        <text x="325" y="205" fill="#ff0000" textAnchor="middle" fontSize="8" fontWeight="bold">MATERIALS</text>
                        
                        {/* Worker Positions */}
                        {siteWorkers.slice(0, 6).map((worker, index) => (
                          <g key={worker.id}>
                            <circle
                              cx={60 + (index % 3) * 30}
                              cy={120 + Math.floor(index / 3) * 30}
                              r="4"
                              fill="#4A90E2"
                            />
                          </g>
                        ))}
                        
                        {/* Safety Status */}
                        <circle cx="350" cy="40" r="8" fill="#00ff00" className="glow-green">
                          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    )}
                    
                    {site.projectType === 'Infrastructure' && (
                      /* Infrastructure Site Map (Bridge) */
                      <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                        {/* Site Boundary */}
                        <rect x="20" y="20" width="360" height="260" fill="#1a1a1a" stroke="#FFB800" strokeWidth="2" rx="8"/>
                        
                        {/* Bridge Structure */}
                        <rect x="40" y="150" width="320" height="30" fill="#666" stroke="#888" strokeWidth="1"/>
                        <rect x="40" y="180" width="20" height="60" fill="#444"/>
                        <rect x="120" y="180" width="20" height="60" fill="#444"/>
                        <rect x="200" y="180" width="20" height="60" fill="#444"/>
                        <rect x="280" y="180" width="20" height="60" fill="#444"/>
                        <rect x="340" y="180" width="20" height="60" fill="#444"/>
                        
                        {/* Water */}
                        <rect x="40" y="240" width="320" height="30" fill="#1e3a8a" opacity="0.5"/>
                        <text x="200" y="260" fill="#60a5fa" textAnchor="middle" fontSize="10">WATER</text>
                        
                        {/* Construction Equipment */}
                        <rect x="150" y="120" width="40" height="25" fill="#ff6b35" stroke="#ff8c42" strokeWidth="1"/>
                        <text x="170" y="137" fill="white" textAnchor="middle" fontSize="8">EQUIP</text>
                        
                        {/* Hazard Areas */}
                        <rect x="80" y="100" width="50" height="30" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="3"/>
                        <text x="105" y="120" fill="#ff0000" textAnchor="middle" fontSize="8" fontWeight="bold">WELDING</text>
                        
                        <rect x="270" y="100" width="50" height="30" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="3"/>
                        <text x="295" y="120" fill="#ff0000" textAnchor="middle" fontSize="8" fontWeight="bold">HEAVY LIFT</text>
                        
                        {/* Worker Positions */}
                        {siteWorkers.slice(0, 5).map((worker, index) => (
                          <g key={worker.id}>
                            <circle
                              cx={100 + index * 50}
                              cy="165"
                              r="4"
                              fill="#4A90E2"
                            />
                          </g>
                        ))}
                        
                        {/* Safety Status */}
                        <circle cx="350" cy="40" r="8" fill="#00ff00" className="glow-green">
                          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    )}
                    
                    {site.projectType === 'Industrial' && (
                      /* Industrial Site Map */
                      <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                        {/* Site Boundary */}
                        <rect x="20" y="20" width="360" height="260" fill="#1a1a1a" stroke="#FFB800" strokeWidth="2" rx="8"/>
                        
                        {/* Warehouse Buildings */}
                        <rect x="40" y="60" width="80" height="60" fill="#444" stroke="#666" strokeWidth="1"/>
                        <text x="80" y="95" fill="#FFB800" textAnchor="middle" fontSize="9">WAREHOUSE A</text>
                        
                        <rect x="140" y="60" width="80" height="60" fill="#444" stroke="#666" strokeWidth="1"/>
                        <text x="180" y="95" fill="#FFB800" textAnchor="middle" fontSize="9">WAREHOUSE B</text>
                        
                        <rect x="240" y="60" width="80" height="60" fill="#444" stroke="#666" strokeWidth="1"/>
                        <text x="280" y="95" fill="#FFB800" textAnchor="middle" fontSize="9">WAREHOUSE C</text>
                        
                        {/* Parking Area */}
                        <rect x="40" y="160" width="280" height="40" fill="#333" stroke="#555" strokeWidth="1"/>
                        <text x="180" y="185" fill="#999" textAnchor="middle" fontSize="9">PARKING / LOADING</text>
                        
                        {/* Office Building */}
                        <rect x="150" y="220" width="60" height="40" fill="#555" stroke="#777" strokeWidth="1"/>
                        <text x="180" y="245" fill="#FFB800" textAnchor="middle" fontSize="8">OFFICE</text>
                        
                        {/* Hazard Areas */}
                        <rect x="50" y="140" width="40" height="15" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="2"/>
                        <text x="70" y="150" fill="#ff0000" textAnchor="middle" fontSize="7" fontWeight="bold">CHEMICAL</text>
                        
                        <rect x="250" y="140" width="40" height="15" fill="#ff000020" stroke="#ff0000" strokeWidth="2" rx="2"/>
                        <text x="270" y="150" fill="#ff0000" textAnchor="middle" fontSize="7" fontWeight="bold">FORKLIFT</text>
                        
                        {/* Worker Positions */}
                        {siteWorkers.slice(0, 4).map((worker, index) => (
                          <g key={worker.id}>
                            <circle
                              cx={80 + index * 80}
                              cy="180"
                              r="4"
                              fill="#4A90E2"
                            />
                          </g>
                        ))}
                        
                        {/* Safety Status */}
                        <circle cx="350" cy="40" r="8" fill="#ff0000" className="glow-red">
                          <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    )}
                    
                    {/* Default Site Map for other types */}
                    {!['High-rise Building', 'Infrastructure', 'Industrial'].includes(site.projectType) && (
                      <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
                        {/* Site Boundary */}
                        <rect x="20" y="20" width="360" height="260" fill="#1a1a1a" stroke="#FFB800" strokeWidth="2" rx="8"/>
                        
                        {/* Main Building */}
                        <rect x="100" y="80" width="200" height="120" fill="#444" stroke="#666" strokeWidth="1"/>
                        <text x="200" y="145" fill="#FFB800" textAnchor="middle" fontSize="12">MAIN SITE AREA</text>
                        
                        {/* Hazard Areas */}
                        {site.hazards.slice(0, 3).map((hazard, index) => (
                          <g key={index}>
                            <rect
                              x={50 + (index % 3) * 100}
                              y={40 + Math.floor(index / 3) * 30}
                              width="80"
                              height="25"
                              fill="#ff000020"
                              stroke="#ff0000"
                              strokeWidth="2"
                              rx="3"
                            />
                            <text
                              x={90 + (index % 3) * 100}
                              y={57 + Math.floor(index / 3) * 30}
                              fill="#ff0000"
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                            >
                              {hazard.substring(0, 10)}
                            </text>
                          </g>
                        ))}
                        
                        {/* Worker Positions */}
                        {siteWorkers.slice(0, 6).map((worker, index) => (
                          <g key={worker.id}>
                            <circle
                              cx={120 + (index % 4) * 40}
                              cy={220 + Math.floor(index / 4) * 25}
                              r="4"
                              fill="#4A90E2"
                            />
                          </g>
                        ))}
                        
                        {/* Safety Status */}
                        <circle cx="350" cy="40" r="8" fill="#00ff00" className="glow-green">
                          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    )}
                    
                    {/* Site Statistics */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-dark-surface/50 p-2 rounded">
                        <p className="text-xs text-gray-400">Workers</p>
                        <p className="text-lg font-bold text-white">{siteWorkers.length}</p>
                      </div>
                      <div className="bg-dark-surface/50 p-2 rounded">
                        <p className="text-xs text-gray-400">Hazards</p>
                        <p className="text-lg font-bold text-red-400">{site.hazards.length}</p>
                      </div>
                      <div className="bg-dark-surface/50 p-2 rounded">
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="text-sm font-bold capitalize" style={{
                          color: site.status === 'active' ? '#00ff00' :
                                 site.status === 'maintenance' ? '#ffb800' : '#ff0000'
                        }}>{site.status}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-dark-surface/90 p-3 rounded-lg border border-dark-border">
                <div className="text-xs font-semibold text-white mb-2">Live Status</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full glow-green"></div>
                    <span className="text-xs text-gray-300">Safe Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full glow-red"></div>
                    <span className="text-xs text-gray-300">Alert Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">Worker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Incident Feed Sidebar */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-construction-yellow" />
                Incident Feed
              </h2>
              
              {/* Site Selector for Incidents */}
              <select
                value={selectedSiteForIncidents}
                onChange={(e) => setSelectedSiteForIncidents(e.target.value)}
                className="bg-dark-bg border border-dark-border text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-construction-yellow"
              >
                <option value="all">All Sites</option>
                {sites.filter(site => site.status === 'active').map(site => (
                  <option key={site.id} value={`${site.name} - ${site.id}`}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {incidentLogs
                .filter(incident => selectedSiteForIncidents === 'all' || incident.location.includes(selectedSiteForIncidents.split(' - ')[0]))
                .map((incident) => (
                <motion.div
                  key={incident.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => incident.type === 'near_miss' && reviewIncident(incident.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    incident.type === 'near_miss' 
                      ? 'border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/5' 
                      : 'border-dark-border hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(incident.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{incident.time}</span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-white mb-1">{incident.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {incident.location}
                  </p>
                  
                  <div className="flex space-x-2 mt-2">
                    {incident.type === 'near_miss' && (
                      <button className="text-xs text-construction-yellow hover:text-yellow-300 font-semibold">
                        Review Near Miss →
                      </button>
                    )}
                    <button
                      onClick={() => exportIncidentToPDF(incident)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                  
                  {/* Cost Savings Display for Near Miss */}
                  {incident.type === 'near_miss' && (
                    <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                      <p className="text-xs text-green-400 font-semibold">
                        💰 Cost Saved: RM {(incident.costSaved || Math.floor(Math.random() * 100000) + 10000).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Potential cost if accident occurred
                      </p>
                    </div>
                  )}
                </motion.div>
                ))}
              {incidentLogs.filter(incident => selectedSiteForIncidents === 'all' || incident.location.includes(selectedSiteForIncidents.split(' - ')[0])).length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {selectedSiteForIncidents === 'all' ? 'No incidents reported' : `No incidents at ${selectedSiteForIncidents.split(' - ')[0]}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Incident Alert System */}
      {currentIncidentAlert && (
        <IncidentAlert
          incident={currentIncidentAlert}
          onClose={dismissIncidentAlert}
          autoClose={true}
        />
      )}
    </div>
  );
}