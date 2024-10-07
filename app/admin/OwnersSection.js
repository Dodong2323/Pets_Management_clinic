import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnersSection = () => {
  const [owners, setOwners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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

  // Fetch owners from the server
  const fetchOwners = async () => {
    try {
      const response = await axios.get('http://localhost/pet_management_system/api/pets.php', {
        params: { operation: 'listOwners' },
      });
      console.log("Fetch Owners Response:", response.data); // Log the response
      if (response.data.success) {
        setOwners(response.data.data);
      } else {
        console.error("Failed to fetch owners:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Input Changed: ${name} = ${value}`); // Log input changes
  };

  // Handle form submission for creating/updating an owner
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting form for createOwner...', ownerData);

    try {
        const response = await axios.post('http://localhost/pet_management_system/api/pets.php', {
            operation: 'createOwner',
            ...ownerData,
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
            console.log('Owner created successfully!');
            // Handle success, maybe reset form or update UI
        } else {
            console.error('Failed to save owner:', response.data.message);
            alert(`Error: ${response.data.message}`); // Notify user
        }
    } catch (error) {
        console.error('Error occurred while saving owner:', error);
        alert('An error occurred while saving the owner. Please try again.'); // Notify user
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
    console.log("Form reset"); // Log form reset
  };

  // Open modal for adding an owner
  const openModal = () => {
    resetForm();
    setModalOpen(true);
    console.log("Modal opened for adding owner"); // Log modal open
  };

  // Open modal for editing an owner
  const editOwner = (owner) => {
    setFormData(owner);
    setModalOpen(true);
    console.log("Modal opened for editing owner:", owner); // Log modal open for editing
  };

  // Delete an owner
  const deleteOwner = async (owner_id) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      console.log("Deleting owner with ID:", owner_id); // Log delete action
      try {
        const response = await axios.post('http://localhost/pet_management_system/api/pets.php', {
          operation: 'deleteOwner',
          owner_id,
        });
        console.log("Delete Owner Response:", response.data); // Log the response
        if (response.data.success) {
          console.log("Owner deleted successfully!"); // Log success message
        } else {
          console.error("Failed to delete owner:", response.data.message);
        }
        fetchOwners();
      } catch (error) {
        console.error("Error deleting owner:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Owners</h2>
      <button onClick={openModal} className="bg-[#405D72] text-white px-4 py-2 rounded mb-4">
        Add Owner
      </button>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Owner ID</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.owner_id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{owner.owner_id}</td>
              <td className="border px-4 py-2">{owner.First_name}</td>
              <td className="border px-4 py-2">{owner.Last_name}</td>
              <td className="border px-4 py-2">{owner.Email_address}</td>
              <td className="border px-4 py-2">{owner.Contact_number}</td>
              <td className="border px-4 py-2">
                <button onClick={() => editOwner(owner)} className="text-blue-500">Edit</button>
                <button onClick={() => deleteOwner(owner.owner_id)} className="text-red-500 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{formData.owner_id ? 'Edit Owner' : 'Add Owner'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="owner_id" value={formData.owner_id || ''} />
              <div className="mb-4">
                <label className="block mb-1">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Middle Name</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} required className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Contact Number</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} required className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="border rounded w-full px-2 py-1" />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Owner Address</label>
                <input type="text" name="owner_address" value={formData.owner_address} onChange={handleInputChange} className="border rounded w-full px-2 py-1" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-[#405D72] text-white px-4 py-2 rounded">{formData.owner_id ? 'Update Owner' : 'Add Owner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersSection;
