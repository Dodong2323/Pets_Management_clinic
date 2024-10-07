"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/appointments.php');
        setAppointments(res.data.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Appointments</h2>
      {appointments.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Appointment ID</th>
                <th className="py-3 px-4 text-left">Pet ID</th>
                <th className="py-3 px-4 text-left">Vet ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.AppointmentID} className="border-b">
                  <td className="py-3 px-4">{appointment.AppointmentID}</td>
                  <td className="py-3 px-4">{appointment.PetID}</td>
                  <td className="py-3 px-4">{appointment.VetID}</td>
                  <td className="py-3 px-4">{appointment.Date}</td>
                  <td className="py-3 px-4">{appointment.Time}</td>
                  <td className="py-3 px-4">{appointment.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default AppointmentsSection;
