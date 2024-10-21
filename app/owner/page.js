"use client"; // Ensure this is at the very top

import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import HomeSection from './HomeSection';
import ServicesSection from './ServicesSection';
import AppointmentsSection from './AppointmentsSection';
import AdoptionSection from './AdoptionSection';
import MypetsSection from './MypetsSection';
import SettingsSection from './SettingsSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const OwnerPage = () => {
  const [activeSection, setActiveSection] = useState('Home');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setCurrentPage(1);
    localStorage.setItem('activeSection', section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HomeSection />;
      case 'Services':
        return <ServicesSection currentPage={currentPage} setTotalPages={setTotalPages} />;
      case 'Appointments':
        return <AppointmentsSection currentPage={currentPage} setTotalPages={setTotalPages} />;
      case 'Adoption':
        return <AdoptionSection currentPage={currentPage} setTotalPages={setTotalPages} />;
      case 'My Pets':
        return <MypetsSection currentPage={currentPage} setTotalPages={setTotalPages} />;
      case 'Settings':
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <NavBar activeSection={activeSection} setActiveSection={handleSetActiveSection} />
      <main className="flex-1 md:ml-64 p-8 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-grow">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            <span className="text-4xl mr-2" role="img" aria-label="paw">🐾</span>
            {activeSection === 'Adoption' ? 'Pets for Adoption' : `${activeSection}`}
          </h1>
          <div className="bg-white shadow-lg rounded-lg p-6 flex-grow overflow-hidden">
            {renderSection()}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerPage;
