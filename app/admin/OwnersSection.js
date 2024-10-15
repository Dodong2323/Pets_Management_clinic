import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnersSection = () => {
  const [owners, setOwners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [petModalOpen, setPetModalOpen] = useState(false); // State for pet info modal
  const [formData, setFormData] = useState({
    owner_id: null,
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    contact_number: '',
    email: '',
    owner_address: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [pets, setPets] = useState([]); // State for pets of the selected owner
  const [selectedOwner, setSelectedOwner] = useState(null); // State to keep track of selected owner

  // Utility function to map backend owner data to frontend formData structure
  const mapOwnerData = (owner) => ({
    owner_id: owner.owner_id || null,
    first_name: owner.First_name || '',
    middle_name: owner.Middle_name || '',
    last_name: owner.Last_name || '',
    age: owner.Age || '',
    contact_number: owner.Contact_number || '',
    email: owner.Email_address || '',
    owner_address: owner.owner_address || '',
  });

  // Fetch owners from the server using POST
  const fetchOwners = async () => {
    try {
      const url = localStorage.getItem("url") + "owners.php";
      const formData = new FormData();
      formData.append("operation", "listOwners");
      const res = await axios.post(url, formData);
      console.log("Response data:", res.data);
      if (res.data !== 0) {
        const mappedOwners = res.data.map(mapOwnerData);
        setOwners(mappedOwners);
      }
    } catch (error) {
      console.error("GetData error:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("url") !== "http://localhost/pet_management_system/api/") {
      localStorage.setItem("url", "http://localhost/pet_management_system/api/");
    }
    fetchOwners();
  }, []);

  // Fetch pets for a specific owner  
  const fetchPets = async (ownerId) => {
    try {
      const url = localStorage.getItem("url") + "owners.php";
      const formData = new FormData();
      formData.append("operation", "listPetsByOwner");
      formData.append("owner_id", ownerId);
      const response = await axios.post(url, formData);
      if (response.data.success) {
        setPets(response.data.data);
      } else {
        console.error("Failed to fetch pets:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating/updating an owner
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = localStorage.getItem("url") + "owners.php";
      const jsonData = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        age: formData.age,
        contact_number: formData.contact_number,
        email: formData.email,
        owner_address: formData.owner_address
      }
      const formPayload = new FormData();
      formPayload.append("operation", formData.owner_id ? 'updateOwner' : 'createOwner');
      formPayload.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, formPayload);
      console.log("Response data ni add owner:", response.data);

      if (response.data === 1) {
        fetchOwners(); // Refresh the owner list
        setModalOpen(false); // Close the modal after submission
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert('An error occurred while saving the owner. Please try again.');
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      owner_id: null,
      first_name: '',
      middle_name: '',
      last_name: '',
      age: '',
      contact_number: '',
      email: '',
      owner_address: '',
    });
  };

  // Open modal for adding an owner
  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing an owner
  const editOwner = (owner) => {
    const mappedOwner = mapOwnerData(owner);
    setFormData(mappedOwner);
    setModalOpen(true);
  };

  // Open modal to show pets of the selected owner
  const showPets = (owner) => {
    fetchPets(owner.owner_id);
    setSelectedOwner(owner);
    setPetModalOpen(true);
  };

  // Delete an owner
  const deleteOwner = async (owner_id) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      try {
        const url = localStorage.getItem("url") + "owners.php";
        const formData = new FormData();
        formData.append("operation", "deleteOwner");
        formData.append("owner_id", owner_id);
        const response = await axios.post(url, formData);
        if (response.data.success) {
          fetchOwners(); // Refresh the owner list after deletion
        } else {
          alert("Failed to delete owner");
        }
      } catch (error) {
        console.error("Error deleting owner:", error);
      }
    }
  };

  // Filter owners based on search term
  const filteredOwners = owners.filter((owner) =>
    owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.contact_number.includes(searchTerm)
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Owners</h2>
      <input
        type="text"
        placeholder="Search by Name or Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded w-full px-4 py-2 mb-4"
      />
      <button onClick={openModal} className="bg-[#405D72] text-white px-4 py-2 rounded mb-4">
        Add Owner
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Middle Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Age</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan="7" className="border text-center py-4">No owners found</td>
              </tr>
            ) : (
              filteredOwners.map((owner, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{owner.first_name}</td>
                  <td className="border px-4 py-2">{owner.middle_name}</td>
                  <td className="border px-4 py-2">{owner.last_name}</td>
                  <td className="border px-4 py-2">{owner.age}</td>
                  <td className="border px-4 py-2">{owner.email}</td>
                  <td className="border px-4 py-2">{owner.contact_number}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => editOwner(owner)} className="text-blue-500">Edit</button>
                    <button onClick={() => deleteOwner(owner.owner_id)} className="text-red-500 ml-2">Delete</button>
                    <button onClick={() => showPets(owner)} className="text-green-500 ml-2">View Pets</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Owner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Owner Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Middle Name</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact Number</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input type="text" name="owner_address" value={formData.owner_address} onChange={handleInputChange} required className="border rounded w-full px-3 py-2" />
              </div>
              <button type="submit" className="bg-[#405D72] text-white px-4 py-2 rounded">{formData.owner_id ? 'Update Owner' : 'Add Owner'}</button>
              <button type="button" onClick={() => setModalOpen(false)} className="ml-2 text-red-500">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Pet Modal */}
      {petModalOpen && selectedOwner && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Pets of {selectedOwner.first_name} {selectedOwner.last_name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Pet Name</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="border text-center py-4">No pets found</td>
                    </tr>
                  ) : (
                    pets.map((pet, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{pet.name}</td>
                        <td className="border px-4 py-2">{pet.type}</td>
                        <td className="border px-4 py-2">
                          <button className="text-red-500">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => setPetModalOpen(false)} className="mt-4 bg-[#405D72] text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersSection;
