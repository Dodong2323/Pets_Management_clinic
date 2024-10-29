"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCalendarAlt, faUserMd } from '@fortawesome/free-solid-svg-icons';

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState({ date: '', time: '' });
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState('');
  const [vets, setVets] = useState([]);



  const listAllAppointments = async () => {
    try {
      setLoading(true);
      const url = secureLocalStorage.getItem('url') + "appointments.php";
      const formData = new FormData();
      formData.append('operation', 'listAllAppointments');
      const res = await axios.post(url, formData);
      console.log('API Response:', res);
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setError('Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVets = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "veterinarian.php";
      const formData = new FormData();
      formData.append('operation', 'listVeterinarians');
      const res = await axios.post(url, formData);
      console.log("res ni fetch vets", res)
      if (Array.isArray(res.data)) {
        setVets(res.data);
      } else {
        console.error('Unexpected data format received for vets');
      }
    } catch (error) {
      console.error('Error fetching vets:', error);
    }
  };

  const handleApproveClick = (appointment) => {
    setSelectedAppointment(appointment);
    setApproveModalOpen(true);
  };

  const submitApprove = async () => {
    if (!selectedVet) {
      alert('Please select a veterinarian');
      return;
    }

    try {
      const url = secureLocalStorage.getItem('url') + "appointments.php";
      const formData = new FormData();
      formData.append('operation', 'ApproveAppointment');
      formData.append('json', JSON.stringify({
        AppointmentID: selectedAppointment.AppointmentID,
        Status: 'Approved',
        VetID: selectedVet
      }));
      
      const res = await axios.post(url, formData);
      if (res.data === 1) {
        alert('Appointment approved successfully');
        setApproveModalOpen(false);
        setSelectedVet('');
        listAllAppointments(); // Refresh the list after approval
      } else {
        alert('Failed to approve appointment');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const submitReschedule = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "appointments.php";
      const formData = new FormData();
      formData.append('operation', 'rescheduleAppointment');
      formData.append('json', JSON.stringify({
        AppointmentID: selectedAppointment.AppointmentID,
        AppointmentDate: newDateTime.date,
        AppointmentTime: newDateTime.time
      }));
      const res = await axios.post(url, formData);
      if (res.data === 1) {
        alert('Appointment rescheduled successfully');
        setRescheduleModalOpen(false);
        listAllAppointments(); // Refresh the list after rescheduling
      } else {
        alert('Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    listAllAppointments();
    fetchVets();
  }, []);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Appointments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.AppointmentID}>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.AppointmentID}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.pet_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.ServiceName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${appointment.AppointmentDate} ${appointment.AppointmentTime}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appointment.Status === 'Approved' ? 'bg-green-100 text-green-800' :
                    appointment.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.Status !== 'Approved' && (
                    <button
                      onClick={() => handleApproveClick(appointment)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      <FontAwesomeIcon icon={faUserMd} className="mr-1" /> Assign Vet & Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleReschedule(appointment)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Reschedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {approveModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Veterinarian and Approve</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Veterinarian</label>
              <select
                value={selectedVet}
                onChange={(e) => setSelectedVet(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a veterinarian</option>
                {vets.map((vet) => (
                  <option key={vet.VetID} value={vet.VetID}>
                    {vet.vet_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {rescheduleModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Date</label>
              <input
                type="date"
                value={newDateTime.date}
                onChange={(e) => setNewDateTime({...newDateTime, date: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Time</label>
              <input
                type="time"
                value={newDateTime.time}
                onChange={(e) => setNewDateTime({...newDateTime, time: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitReschedule}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
