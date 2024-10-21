"use client"; // Ensure this is at the very top

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faDog,
  faPeopleArrows,
  faUserMd,
  faBriefcase,
  faCalendar,
  faChartBar,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NavBar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!', { duration: 1200 });
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  // Function to determine if a button is active
  const isActive = (section) => activeSection === section;

  // Navigation items
  const navItems = [
    { name: 'Home', icon: faHome },
    { name: 'Pets', icon: faDog },
    { name: 'Owners', icon: faPeopleArrows },
    { name: 'Vets', icon: faUserMd },
    { name: 'Services', icon: faBriefcase },
    { name: 'Appointments', icon: faCalendar },
    { name: 'Reports', icon: faChartBar },
    { name: 'Adoption', icon: faHeart },
    { name: 'Settings', icon: faCog },
  ];

  // Effect to update body class when navbar state changes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('navbar-open');
    } else {
      document.body.classList.remove('navbar-open');
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 bg-[#405D72] text-white p-2 rounded-md"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* NavBar */}
      <nav className={`bg-[#405D72] text-white w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-10`}>
        <div className="p-6 mt-12">
          <h1 className="text-2xl font-bold mb-6 text-pink-600 flex items-center">
            <span role="img" aria-label="dog" className="text-3xl mr-2">🐶</span>
            Admin Dashboard
          </h1>
          <ul className="space-y-4">
            {/* Navigation Buttons */}
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveSection(item.name);
                    setIsOpen(false); // Close navbar on item click
                  }}
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

        {/* Logout button pushed to the bottom */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-3 bg-pink-600 hover:bg-pink-500 transition duration-300 rounded-lg w-full text-left"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
