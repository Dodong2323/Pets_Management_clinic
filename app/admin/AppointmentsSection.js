"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const url = 'http://localhost/pet_management_system/api/appointments.php';
        const formData = new FormData();
        formData.append('operation', 'listAppointments');
        const res = await axios.post(url, formData);
        console.log("response sa fetch appointment:", res.data);
        if (res.data !== 0) {
          setAppointments(res.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const url = 'http://localhost/pet_management_system/api/appointments.php';
      const formData = new FormData();
      formData.append('operation', newStatus === 'Completed' ? 'completeAppointment' : 'cancelAppointment');
      formData.append('appointment_id', appointmentId);
      const response = await axios.post(url, formData);
      console.log(`Appointment ${newStatus.toLowerCase()}:`, response.data);

      // Update the status in the local state instead of removing the appointment
      setAppointments(prev => prev.map(appt => 
        appt.id === appointmentId ? { ...appt, Status: newStatus } : appt
      ));
    } catch (error) {
      console.error(`Error updating appointment status:`, error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      appointment.First_name.toLowerCase().includes(searchStr) ||
      appointment.Last_name.toLowerCase().includes(searchStr) ||
      appointment.pet_name.toLowerCase().includes(searchStr) ||
      appointment.user_firstname.toLowerCase().includes(searchStr) ||
      appointment.user_lastname.toLowerCase().includes(searchStr) ||
      appointment.ServiceName.toLowerCase().includes(searchStr) ||
      (appointment.vet_name && appointment.vet_name.toLowerCase().includes(searchStr));
    
    const matchesClientFilter = clientFilter === '' || 
      `${appointment.First_name} ${appointment.Last_name}`.toLowerCase().includes(clientFilter.toLowerCase());

    return matchesSearch && matchesClientFilter;
  });

  const uniqueClients = [...new Set(appointments.map(a => `${a.First_name} ${a.Last_name}`))].sort();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      case 'scheduled':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Admin - Appointment Schedule</h2>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by client, pet, vet, or service"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
        >
          <option value="">All Clients</option>
          {uniqueClients.map((client, index) => (
            <option key={index} value={client}>{client}</option>
          ))}
        </select>
      </div>

      <div className="mb-8">  
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Scheduled Appointments</h3>
        <table className="min-w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Vet Name</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2">{appointment.First_name + ' ' + appointment.Last_name}</td>
                  <td className="px-4 py-2">{appointment.pet_name}</td>
                  <td className="px-4 py-2">
                    {appointment.vet_name || appointment.user_firstname + ' ' + appointment.user_lastname}
                  </td>
                  <td className="px-4 py-2">{appointment.ServiceName}</td>
                  <td className="px-4 py-2">{appointment.AppointmentDate + ' ' + appointment.AppointmentTime}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getStatusColor(appointment.Status)}`}>
                        {appointment.Status || 'Scheduled'}
                      </span>
                      {appointment.Status?.toLowerCase() === 'scheduled' && (
                        <div className="flex space-x-2">
                          <button
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleStatusUpdate(appointment.id, 'Completed')}
                          >
                            Mark Complete
                          </button>
                          <button
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleStatusUpdate(appointment.id, 'Canceled')}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsSection;