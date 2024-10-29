import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VetsSection = () => {
  const [vets, setVets] = useState([]);
  const [users, setUsers] = useState([]); // State for users
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vet_id: null,
    user_id: '',
    license_number: '',
    specialization: '',
    years_of_experience: '',
    availability: 'Active', // Default to Active
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Map veterinarian data to form structure
  const mapVetData = (vet) => ({
    vet_id: vet.vet_id || null,
    user_id: vet.user_id || '',
    license_number: vet.license_number || '',
    specialization: vet.specialization || '',
    years_of_experience: vet.years_of_experience || '',
    availability: vet.availability || 'Active',
  });

  // Fetch veterinarians from the server
  const fetchVets = async () => {
    try {
      const url = localStorage.getItem("url") + "veterinarians.php";
      const formData = new FormData();
      formData.append("operation", "listVeterinarians");
      const res = await axios.post(url, formData);
      console.log("Fetch Veterinarians Response:", res.data);
      if (res.data !== 0 && Array.isArray(res.data)) {
        const mappedVets = res.data.map(mapVetData);
        setVets(mappedVets);
      } else {
        setVets([]);
      }
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
      setVets([]);
    }
  };

  // Fetch users for the user dropdown
  const fetchUsers = async () => {
    try {
      const url = localStorage.getItem("url") + "users.php";
      const formData = new FormData();
      formData.append("operation", "listUsers");
      const res = await axios.post(url, formData);
      if (res.data !== 0) {
        setUsers(res.data); // Set the users for the dropdown
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("url") !== "http://localhost/pet_management_system/api/") {
      localStorage.setItem("url", "http://localhost/pet_management_system/api/");
    }
    fetchVets();
    fetchUsers(); // Fetch users when the component loads
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating/updating a veterinarian
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = localStorage.getItem("url") + "veterinarians.php";
      const jsonData = {
        user_id: formData.user_id,
        license_number: formData.license_number,
        specialization: formData.specialization,
        years_of_experience: formData.years_of_experience,
        availability: formData.availability,
      }
      if (formData.vet_id) {
        jsonData.id = formData.vet_id;
      }
      const formPayload = new FormData();
      formPayload.append("operation", formData.vet_id ? 'updateVeterinarian' : 'createVeterinarian');
      formPayload.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formPayload);
      if (response.data === 1) {
        fetchVets(); // Refresh the vets list
        setModalOpen(false); // Close the modal after submission
      } else {
        alert('Failed to save veterinarian. Please try again.');
      }
    } catch (error) {
      console.error('Error saving veterinarian:', error);
      alert('An error occurred while saving the veterinarian. Please try again.');
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      vet_id: null,
      user_id: '',
      license_number: '',
      specialization: '',
      years_of_experience: '',
      availability: 'Active',
    });
  };

  // Open modal for adding a veterinarian
  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing a veterinarian
  const editVet = (vet) => {
    const mappedVet = mapVetData(vet);
    setFormData(mappedVet);
    setModalOpen(true);
  };

  // Delete a veterinarian
  const deleteVet = async (vet_id) => {
    if (window.confirm("Are you sure you want to delete this veterinarian?")) {
      try {
        const url = localStorage.getItem("url") + "veterinarians.php";
        const formData = new FormData();
        formData.append("operation", "deleteVeterinarian");
        formData.append("json", JSON.stringify({ vet_id }));
        const response = await axios.post(url, formData);
        if (response.data === 1) {
          fetchVets(); // Refresh the vets list after deletion
        } else {
          alert("Failed to delete veterinarian");
        }
      } catch (error) {
        console.error("Error deleting veterinarian:", error);
        alert("An error occurred while deleting the veterinarian. Please try again.");
      }
    }
  };

  // Filter veterinarians based on search term
  const filteredVets = vets.filter((vet) =>
    vet.license_number.includes(searchTerm) ||
    users.find(user => user.user_id === vet.user_id)?.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Veterinarians</h2>
      <input
        type="text"
        placeholder="Search by License or Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded w-full px-4 py-2 mb-4"
      />
      <button onClick={openModal} className="bg-[#405D72] text-white px-4 py-2 rounded mb-4">
        Add Veterinarian
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">License Number</th>
              <th className="border px-4 py-2">Specialization</th>
              <th className="border px-4 py-2">Years of Experience</th>
              <th className="border px-4 py-2">Availability</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVets.length === 0 ? (
              <tr>
                <td colSpan="6" className="border text-center py-4">No veterinarians found</td>
              </tr>
            ) : (
              filteredVets.map((vet, index) => {
                const user = users.find(u => u.user_id === vet.user_id) || {};
                return (
                  <tr key={index} value={vet.vet_id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{user.first_name} {user.last_name}</td>
                    <td className="border px-4 py-2">{vet.license_number}</td>
                    <td className="border px-4 py-2">{vet.specialization}</td>
                    <td className="border px-4 py-2">{vet.years_of_experience}</td>
                    <td className="border px-4 py-2">{vet.availability}</td>
                    <td className="border px-4 py-2">
                      <button onClick={() => editVet(vet)} className="text-blue-500">Edit</button>
                      <button onClick={() => deleteVet(vet.vet_id)} className="text-red-500 ml-2">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Veterinarian Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Veterinarian Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">User</label>
                <select name="user_id" value={formData.user_id} onChange={handleInputChange} required className="border rounded w-full px-3 py-2">
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Years of Experience</label>
                <input
                  type="text"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                  required
                  className="border rounded w-full px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Availability</label>
                <select name="availability" value={formData.availability} onChange={handleInputChange} className="border rounded w-full px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="text-gray-500 px-4 py-2 mr-2">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetsSection;
