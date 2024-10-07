"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    notification: false,
    privacy: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/settings.php');
        setSettings(res.data.settings || {});
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);

    try {
      await axios.post('http://localhost/pet_management_system/api/update_settings.php', updatedSettings);
      toast.success('Settings updated successfully!', { duration: 1200 });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings!', { duration: 1200 });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Settings</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span>Notifications</span>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={settings.notification}
              onChange={() => handleToggle('notification')}
              className="form-checkbox"
            />
            <span className="ml-2">Enabled</span>
          </label>
        </div>
        <div className="flex justify-between items-center">
          <span>Privacy Mode</span>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={settings.privacy}
              onChange={() => handleToggle('privacy')}
              className="form-checkbox"
            />
            <span className="ml-2">Enabled</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
