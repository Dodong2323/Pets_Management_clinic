import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState([]); // State to hold appointments
  const [owners, setOwners] = useState([]); // State to hold owners
  const [pets, setPets] = useState([]); // State to hold pets
  const [selectedOwner, setSelectedOwner] = useState(''); // State to track selected owner
  const [newAppointment, setNewAppointment] = useState({
    client: '',
    pet: '',
    vet: '',
    service: '',
    time: '',
    date: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    // Fetch appointments on component mount
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost/pet_management_system/api/appointments.php', {
          params: { operation: 'listAppointments' },
        });
        console.log("Appointments response:", response.data); // Log the response for debugging
        if (response.data.success) {
          setAppointments(response.data.data); // Update appointments state
        } else {
          console.error('Error fetching appointments:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    // Fetch owners for dropdown
    const fetchOwners = async () => {
      try {
        const response = await axios.post('http://localhost/pet_management_system/api/owners.php', {
          operation: 'listOwners',
        });
        console.log("Owners response:", response.data); // Log the response for debugging
        if (response.data.success) {
          setOwners(response.data.data); // Update owners state
        } else {
          console.error('Error fetching owners:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };

    fetchAppointments(); // Call fetch appointments
    fetchOwners(); // Call fetch owners
  }, []);

  // Fetch pets based on selected owner
  const fetchPets = async (ownerId) => {
    try {
      const response = await axios.get('http://localhost/pet_management_system/api/pets.php', {
        params: {
          operation: 'fetchPets',
          owner: ownerId,
        },
      });
      if (response.data.success) {
        setPets(response.data.data); // Update pets state
      } else {
        console.error('Error fetching pets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching pets:', error.response ? error.response.data : error.message);
    }
  };

  const handleOwnerChange = (e) => {
    const ownerId = e.target.value;
    setSelectedOwner(ownerId);
    setNewAppointment((prev) => ({ ...prev, client: ownerId })); // Set client in newAppointment
    fetchPets(ownerId); // Fetch pets for the selected owner
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/pet_management_system/api/appointments.php', {
        operation: 'createAppointment',
        appointment: newAppointment,
      });
      if (response.data.success) {
        console.log('Appointment created successfully:', response.data.message);
        // Optionally, refetch appointments or update the state to show the new appointment
        setAppointments(prev => [...prev, response.data.appointment]); // Update appointments state
      } else {
        console.error('Failed to create appointment:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
    setIsModalOpen(false); // Close modal
    setNewAppointment({ client: '', pet: '', vet: '', service: '', time: '', date: '' }); // Reset form
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Admin - Appointment Schedule</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Scheduled Appointments</h3>
        <table className="min-w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Vet</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? ( // Check if appointments array is not empty
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b">
                  <td className="px-4 py-2">{appointment.client}</td>
                  <td className="px-4 py-2">{appointment.pet}</td>
                  <td className="px-4 py-2">{appointment.vet}</td>
                  <td className="px-4 py-2">{appointment.service}</td>
                  <td className="px-4 py-2">{appointment.time}</td>
                  <td className="px-4 py-2">
                    <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2">Complete</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No appointments scheduled.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => setIsModalOpen(true)} className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Add New Appointment
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Appointment</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Client:</label>
                <select
                  name="client"
                  value={newAppointment.client}
                  onChange={handleOwnerChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="" disabled>Select a Client</option>
                  {owners.map(owner => (
                    <option key={owner.owner_id} value={owner.owner_id}>
                      {owner.FullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Pet:</label>
                <select
                  name="pet"
                  value={newAppointment.pet}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="" disabled>Select a Pet</option>
                  {pets.map(pet => (
                    <option key={pet.pet_id} value={pet.pet_id}>
                      {pet.pet_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Vet:</label>
                <input
                  type="text"
                  name="vet"
                  value={newAppointment.vet}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Service:</label>
                <input
                  type="text"
                  name="service"
                  value={newAppointment.service}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Time:</label>
                <input
                  type="time"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={newAppointment.date}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add Appointment
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
