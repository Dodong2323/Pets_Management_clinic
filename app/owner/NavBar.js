"use client"; // Ensure this is at the very top

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBriefcase,
  faCalendar,
  faCog,
  faSignOutAlt,
  faClipboardList,
  faHeart,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NavBar = ({ activeSection, setActiveSection }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, [setActiveSection]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeSection');
    toast.success('Logged out successfully!', { duration: 1200 });
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    setIsOpen(false); // Close mobile menu after selection
  };

  // Function to determine if a button is active
  const isActive = (section) => activeSection === section;

  // Navigation items
  const navItems = [
    { name: 'Home', icon: faHome },
    { name: 'Services', icon: faBriefcase },
    { name: 'Appointments', icon: faCalendar },
    { name: 'Adoption', icon: faHeart },
    { name: 'My Pets', icon: faClipboardList },
    { name: 'Settings', icon: faCog },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#405D72] text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Navigation bar */}
      <nav className={`fixed top-0 left-0 h-full bg-[#405D72] text-white w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-pink-600 flex items-center">
              <span role="img" aria-label="dog" className="text-3xl mr-2">🐶</span>
              Owner Dashboard
            </h1>
            <ul className="space-y-4">
              {/* Navigation Buttons */}
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleSetActiveSection(item.name)}
                    className={`flex items-center space-x-3 px-6 py-3 w-full text-left rounded-lg transition duration-300 ${
                      isActive(item.name) ? 'bg-[#758694]' : 'hover:bg-[#758694]'
                    }`}
                    aria-current={isActive(item.name) ? 'page' : undefined}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout Button at the bottom */}
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-6 py-3 bg-pink-600 hover:bg-pink-500 transition duration-300 rounded-lg w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
