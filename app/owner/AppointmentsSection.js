import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    pet_id: '',
    ServiceID: '',
    AppointmentDate: '',
    AppointmentTime: '',
    ReasonForVisit: '',
    Status: 'Pending'
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const jsonData = {
        UserID: secureLocalStorage.getItem('userId')
      }
      const url = secureLocalStorage.getItem('url') + "appointments.php";
      const formData = new FormData();
      formData.append('operation', 'getAppointmentByUser');
      formData.append('json', JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  const fetchPets = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";
      const formData = new FormData();
      formData.append('operation', 'ownerpets');
      formData.append('UserID', secureLocalStorage.getItem('userId'));
      const res = await axios.post(url, formData);
      setPets(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
    }
  };

  const fetchServices = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "services.php";
      const formData = new FormData();
      formData.append('operation', 'getServiceDetails');
      const res = await axios.post(url, formData);
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    try {
      const url = secureLocalStorage.getItem('url') + "appointments.php";
      const appointmentData = {
        ...newAppointment,
        UserID: secureLocalStorage.getItem('userId'),
        vet_id: null // This will be assigned by the admin later
      };
      console.log('Appointment data being sent:', appointmentData);
  
      const formData = new FormData();
      formData.append('operation', 'createAppointment');
      formData.append('json', JSON.stringify(appointmentData));
  
      console.log('FormData being sent:', Object.fromEntries(formData));
  
      const res = await axios.post(url, formData);
      console.log('Server response:', res);
  
      if (res.data === 1) {
        alert('Appointment request submitted successfully! Waiting for admin approval.');
        fetchAppointments();
        setNewAppointment({
          pet_id: '',
          ServiceID: '',
          AppointmentDate: '',
          AppointmentTime: '',
          ReasonForVisit: '',
          Status: 'Pending'
        });
        setModalOpen(false);
      } else {
        console.error('Server response indicates failure:', res.data);
        alert('Failed to submit appointment request. Server response: ' + JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error submitting appointment request:', error);
      console.error('Error response:', error.response);
      alert('An error occurred. Please try again. Error: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Request Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vet</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.AppointmentID}>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.pet_name}</td>
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
                <td className="px-6 py-4 whitespace-nowrap">{appointment.vet_name || 'Not assigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Request Appointment</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={submitAppointment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Pet</label>
                <select
                  name="pet_id"
                  value={newAppointment.pet_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a pet</option>
                  {pets.map(pet => (
                    <option key={pet.pet_id} value={pet.pet_id}>{pet.pet_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  name="ServiceID"
                  value={newAppointment.ServiceID}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.ServiceID} value={service.ServiceID}>{service.ServiceName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="AppointmentDate"
                  value={newAppointment.AppointmentDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="AppointmentTime"
                  value={newAppointment.AppointmentTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                <textarea
                  name="ReasonForVisit"
                  value={newAppointment.ReasonForVisit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Appointment Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
