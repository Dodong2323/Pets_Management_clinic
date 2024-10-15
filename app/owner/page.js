"use client"; // Ensure this is at the very top

import React, { useState } from 'react';
import NavBar from './NavBar';
import HomeSection from './HomeSection';
import VeterinariansSection from './VeterinariansSection';
import MedicationsSection from './ServicesSection';
import AppointmentsSection from './AppointmentsSection';
import AdoptionSection from './AdoptionSection';
import MypetsSection from './MypetsSection'; // Updated import
import SettingsSection from './SettingsSection';

const OwnerPage = () => {
  const [activeSection, setActiveSection] = useState('Home'); // State to manage active section

  // Function to render the active section content
  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HomeSection />;
      case 'Veterinarians':
        return <VeterinariansSection />;
      case 'ServicesSection':
        return <MedicationsSection />;
      case 'Appointments':
        return <AppointmentsSection />;
      case 'Adoption':
        return <AdoptionSection />;
      case 'My Pets': // Updated case name
        return <MypetsSection />; // Updated component
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

export default OwnerPage;
