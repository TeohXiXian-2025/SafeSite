# SafeSite AI - Construction Safety Ecosystem

A comprehensive construction safety platform powered by YTL AI Cloud, featuring multi-persona interfaces for project managers, site supervisors, and workers.

## Features

### 🏗️ Project Manager Dashboard
- Real-time safety compliance ticker
- Digital twin site map with live zone status
- Incident feed with detailed review capabilities
- AI-powered incident analysis with video simulation

### 👷 Site Supervisor Mobile App
- Active permits management
- Z.AI safety scan simulation for different work areas
- Real-time violation alerts with multilingual support
- Camera upload simulation with instant AI analysis

### 📱 Worker Digital Passport
- Personal QR code for quick verification
- SOP library with audio playback in English and Bengali
- Proximity alert simulation for red zones
- Personal safety compliance tracking

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with custom dark theme
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SafetyPlatform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Navigation
- Use the sidebar to switch between three personas:
  - **Project Manager**: Web dashboard with overview and analytics
  - **Site Supervisor**: Mobile-optimized interface for on-site management
  - **Worker Passport**: Personal safety interface

### Key Interactions

#### Project Manager
- Click "Review Near Miss" in the incident feed to open detailed analysis modal
- View live site status on the digital twin map
- Monitor real-time compliance metrics

#### Site Supervisor
- Click "Check Hot Work Area" to simulate AI safety scan
- Click "Trigger Test Violation" to see multilingual alert system
- Monitor active permits and their status

#### Worker Passport
- Click any SOP category to play audio instructions
- Click "Simulate Proximity Alert" to see red zone warning
- Scan QR code for verification (simulated)

## Design System

### Color Scheme
- **Primary**: Construction Yellow (#FFB800)
- **Background**: Dark (#0a0a0a)
- **Surface**: Dark Gray (#1a1a1a)
- **Border**: Medium Gray (#2a2a2a)

### Animations
- Smooth transitions between persona views
- Pulsing effects for active zones
- Vibration effects for alerts
- Progress animations for scans and audio playback

## Project Structure

```
├── app/
│   ├── components/          # React components
│   │   ├── ProjectManagerDashboard.js
│   │   ├── SiteSupervisorApp.js
│   │   ├── WorkerDigitalPassport.js
│   │   ├── IncidentModal.js
│   │   └── ViolationAlert.js
│   ├── context/            # Global state management
│   │   └── SafetyContext.js
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── page.js             # Main page with navigation
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies and scripts
```

## Features Demonstration

### Global State Management
The application uses a centralized state management system that simulates a "Central Database" with:
- Compliance score tracking (starts at 92%)
- Incident logs with different severity levels
- Real-time updates across all persona views

### Multilingual Support
- Safety alerts include English and Malay translations
- Worker SOP includes English and Bengali instructions
- Demonstrates inclusive design for diverse workforce

### Mobile-First Design
- Site Supervisor and Worker interfaces are designed for mobile devices
- Custom mobile frame styling for presentation purposes
- Touch-friendly interactions and gestures

## Future Enhancements

- Real database integration
- Actual camera and QR code scanning
- Push notifications for critical alerts
- Advanced AI analytics
- Multi-language support expansion
- Offline capabilities for field use

## License

This project is part of the YTL AI Labs initiative.

---

**Powered by YTL AI Cloud** 🇲🇾