"use client"; // Ensure this is at the very top

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faBriefcase, // Updated icon for Services
  faCalendar,
  faCog,
  faSignOutAlt,
  faClipboardList,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const NavBar = ({ activeSection, setActiveSection }) => {
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
    { name: 'Veterinarians', icon: faUser },
    { name: 'Services', icon: faBriefcase }, // Updated item name and icon
    { name: 'Appointments', icon: faCalendar },
    { name: 'Adoption', icon: faHeart },
    { name: 'My Pets', icon: faClipboardList }, // Updated item name
    { name: 'Settings', icon: faCog },
  ];

  return (
    <nav className="bg-[#405D72] text-white w-full md:w-1/4 min-h-screen flex flex-col justify-between">
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
                onClick={() => setActiveSection(item.name)}
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
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-6 py-3 bg-pink-600 hover:bg-pink-500 transition duration-300 rounded-lg w-full text-left"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
