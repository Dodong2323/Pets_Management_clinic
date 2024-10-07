"use client"; // Ensure this is at the very top

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchedulesSection = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/schedules.php');
        setSchedules(res.data.schedules || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setError('Failed to fetch schedules.');
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading) {
    return <p className="text-gray-700">Loading schedules...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Schedules</h2>
      {schedules.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Schedule ID</th>
                <th className="py-3 px-4 text-left">Client Name</th>
                <th className="py-3 px-4 text-left">Pet Name</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.ScheduleID} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-3 px-4">{schedule.ScheduleID}</td>
                  <td className="py-3 px-4">{schedule.ClientName}</td>
                  <td className="py-3 px-4">{schedule.PetName}</td>
                  <td className="py-3 px-4">{schedule.Date}</td>
                  <td className="py-3 px-4">{schedule.Time}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700">No schedules available.</p>
      )}
    </div>
  );
};

export default SchedulesSection;
