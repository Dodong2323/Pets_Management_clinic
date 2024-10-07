"use client"; // Ensure this is at the very top

import React, { useState } from 'react';
import NavBar from './NavBar';
import HomeSection from './HomeSection';
import PetsSection from './PetsSection';
import OwnersSection from './OwnersSection';
import VetsSection from './VetsSection';
import MedicinesSection from './MedicinesSection';
import AppointmentsSection from './AppointmentsSection';
import ReportsSection from './ReportsSection';
import SettingsSection from './SettingsSection';


const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('Home'); // State to manage active section

  // Function to render the active section content
  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HomeSection />;
      case 'Pets':
        return <PetsSection />;
      case 'Owners':
        return <OwnersSection />;
      case 'Vets':
        return <VetsSection />;
      case 'Medicines':
        return <MedicinesSection />;
      case 'Appointments':
        return <AppointmentsSection />;
      case 'Reports':
        return <ReportsSection />;
      case 'Settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex">
      {/* Navigation Bar */}
      <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-[#405D72]">
          <span role="img" aria-label="paw" className="text-4xl mr-2">🐾</span>
          {activeSection} Section
        </h1>
        {/* Render Active Section */}
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
