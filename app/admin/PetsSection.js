import React, { useEffect, useState } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'sonner';

const PetsSection = () => {
  const [formData, setFormData] = useState({
    pet_id: '',
    pet_name: '',
    species_id: '',
    breed_id: '',
    date_of_birth: '',
    owner_id: '',
  });

  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredPets, setFilteredPets] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // New state for editing

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const url = secureLocalStorage.getItem('url') + "pets.php";
        const formData = new FormData();
        formData.append("operation", "getalldetails");
        const response = await axios.post(url, formData);
        const res = response.data;
        console.log("fetchDetails", res);
        setSpecies(res.getSpeciesDetails);
        setBreeds(res.getBreedDetails);
        setOwners(res.getOwnerDetails);
        toast.success('Data fetched successfully!', { duration: 1200 });
      } catch (error) {
        console.error('Error fetching details:', error);
        toast.error('Error fetching details');
        setError('Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    secureLocalStorage.setItem('url', 'http://localhost/pet_management_system/api/');
    fetchPets();
    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openModal = (pet = null) => {
    if (pet) {
      // If a pet is passed, set form data and set editing mode
      setFormData({
        pet_id: pet.pet_id,
        pet_name: pet.pet_name,
        species_id: pet.species_id,
        breed_id: pet.breed_id,
        date_of_birth: pet.date_of_birth,
        owner_id: pet.owner_id,
      });
      setIsEditing(true); // Set editing mode
    } else {
      resetForm();
      setIsEditing(false); // Not editing
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(isEditing ? 'Updating pet...' : 'Adding pet...');

    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";

      const petData = {
        pet_name: formData.pet_name,
        species_id: formData.species_id,
        breed_id: formData.breed_id,
        date_of_birth: formData.date_of_birth,
        owner_id: formData.owner_id,
        pet_id: isEditing ? formData.pet_id : undefined, // Include pet_id only if editing
      };

      console.log("petData to be sent:", JSON.stringify(petData));

      const formDataToSend = new FormData();
      formDataToSend.append('json', JSON.stringify(petData));
      formDataToSend.append('operation', isEditing ? 'updatePets' : 'addPets'); // Change operation based on editing mode

      const res = await axios.post(url, formDataToSend);
      toast.dismiss(loadingToast);

      console.log('Backend Response:', res.data);

      if (res.data > 0) {
        toast.success(isEditing ? 'Pet updated successfully!' : 'Pet added successfully!');
        setModalOpen(false);
        fetchPets();
      } else {
        toast.error("Failed to " + (isEditing ? "update" : "add") + " pet!");
        console.log("Response Data: ", JSON.stringify(res.data));
      }

    } catch (error) {
      toast.error("Network error!", { description: error.message });
      console.error('Error adding/updating pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";
      const formData = new FormData();
      formData.append("operation", "getPetDetails");
      console.log("Fetching pets from URL:", url);
      const res = await axios.post(url, formData);
      console.log('Fetch Pets Response:', res.data);
      setFilteredPets(res.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const deletePet = async (petId) => {
    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";
      const res = await axios.post(url, new FormData().append('operation', 'deletePet').append('pet_id', petId));
      console.log('Delete Response:', res.data);

      if (res.data > 0) {
        toast.success('Pet deleted successfully!', { duration: 1200 });
        fetchPets();
      } else {
        toast.error('Failed to delete pet!', { duration: 1200 });
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Error deleting pet', { duration: 1200 });
    }
  };

  const resetForm = () => {
    setFormData({
      pet_id: '',
      pet_name: '',
      species_id: '',
      breed_id: '',
      date_of_birth: '',
      owner_id: '',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Pet Management</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => openModal()} // Open modal for adding pet
          className="bg-[#405D72] text-white px-4 py-2 rounded hover:bg-[#334e63] transition"
        >
          Add Pet
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Pet Name</th>
            <th className="border border-gray-300 p-2">Species</th>
            <th className="border border-gray-300 p-2">Breed</th>
            <th className="border border-gray-300 p-2">Owner</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPets && filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <tr key={pet.pet_id}>
                <td className="border border-gray-300 p-2">{pet.pet_name}</td>
                <td className="border border-gray-300 p-2">{pet.species_name}</td>
                <td className="border border-gray-300 p-2">{pet.breed_name}</td>
                <td className="border border-gray-300 p-2">{pet.FullName}</td>
                <td className="border border-gray-300 p-2">{pet.pet_status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => openModal(pet)} // Pass pet data to modal for editing
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePet(pet.pet_id)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center border border-gray-300 p-2">
                No pets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add/Edit Pet Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Pet' : 'Add Pet'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="pet_name" className="block text-sm font-medium mb-2">Pet Name</label>
                <input
                  type="text"
                  name="pet_name"
                  value={formData.pet_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="species_id" className="block text-sm font-medium mb-2">Species</label>
                <select
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                >
                  <option value="">Select Species</option>
                  {species.map((spec) => (
                    <option key={spec.species_id} value={spec.species_id}>
                      {spec.species_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="breed_id" className="block text-sm font-medium mb-2">Breed</label>
                <select
                  name="breed_id"
                  value={formData.breed_id}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                >
                  <option value="">Select Breed</option>
                  {breeds.map((breed) => (
                    <option key={breed.breed_id} value={breed.breed_id}>
                      {breed.breed_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="date_of_birth" className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="owner_id" className="block text-sm font-medium mb-2">Owner</label>
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map((owner) => (
                    <option key={owner.owner_id} value={owner.owner_id}>
                      {owner.FullName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#405D72] text-white px-4 py-2 rounded hover:bg-[#334e63] transition"
              >
                {isEditing ? 'Update Pet' : 'Add Pet'}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsSection;
