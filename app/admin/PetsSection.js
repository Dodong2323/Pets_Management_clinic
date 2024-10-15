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
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [filteredPets, setFilteredPets] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const url = secureLocalStorage.get('url', 'http://localhost/pet_management_system/api/pets.php');
        
        // Fetch species, breeds, and owners in parallel
        const [speciesRes, breedsRes, ownersRes] = await Promise.all([
          axios.post(url, new FormData().append('operation', 'getSpeciesDetails')),
          axios.post(url, new FormData().append('operation', 'getBreedDetails')),
          axios.post(url, new FormData().append('operation', 'getOwnersDetails')) // New API call for owners
        ]);

        console.log('Species Response:', speciesRes.data); // Log species response
        console.log('Breeds Response:', breedsRes.data);   // Log breeds response
        console.log('Owners Response:', ownersRes.data);   // Log owners response

        setSpecies(speciesRes.data);
        setBreeds(breedsRes.data);
        setOwners(ownersRes.data);

        toast.success('Data fetched successfully!', { duration: 1200 });
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const editPet = (pet) => {
    setFormData({
      pet_id: pet.pet_id,
      pet_name: pet.pet_name,
      species_id: pet.species_id,
      breed_id: pet.breed_id,
      date_of_birth: pet.date_of_birth,
      owner_id: pet.owner_id,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = secureLocalStorage.getItem('url', 'http://localhost/pet_management_system/api/pets.php');
      const operation = formData.pet_id ? 'updatePets' : 'addPets';
      const res = await axios.post(url, {
        operation,
        ...formData,
      });

      console.log('Submit Response:', res.data); // Log submit response

      if (res.data > 0) {
        toast.success(`Pet ${operation === 'addPets' ? 'added' : 'updated'} successfully!`, { duration: 1200 });
        resetForm();
        setModalOpen(false);
        fetchPets(); // Call to refresh pet list after addition or update
      } else {
        toast.error('Failed to save pet!', { duration: 1200 });
      }
    } catch (error) {
      console.error('Error submitting pet data:', error);
      toast.error('Error submitting pet data', { duration: 1200 });
    }
  };

  const fetchPets = async () => {
    try {
      const url = secureLocalStorage.getItem('url', 'http://localhost/pet_management_system/api/pets.php');
      const res = await axios.post(url, new FormData().append('operation', 'getPetsDetails'));

      console.log('Fetch Pets Response:', res.data); // Log fetch pets response

      setFilteredPets(res.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleAdoption = () => {
    // Implement adoption logic here, possibly making an API call
    setAdoptionModalOpen(false);
  };

  const deletePet = async (petId) => {
    try {
      const url = secureLocalStorage.getItem('url', 'http://localhost/pet_management_system/api/pets.php');
      const res = await axios.post(url, new FormData().append('operation', 'deletePet').append('pet_id', petId));

      console.log('Delete Response:', res.data); // Log delete response

      if (res.data > 0) {
        toast.success('Pet deleted successfully!', { duration: 1200 });
        fetchPets(); // Refresh pets list after deletion
      } else {
        toast.error('Failed to delete pet!', { duration: 1200 });
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Error deleting pet', { duration: 1200 });
    }
  };

  const openAdoptionModal = (pet) => {
    setSelectedPet(pet);
    setAdoptionModalOpen(true);
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
          onClick={openModal}
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
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <tr key={pet.pet_id}>
                <td className="border border-gray-300 p-2">{pet.pet_name}</td>
                <td className="border border-gray-300 p-2">{pet.species_name}</td>
                <td className="border border-gray-300 p-2">{pet.breed_name}</td>
                <td className="border border-gray-300 p-2">{pet.owner_name}</td>
                <td className="border border-gray-300 p-2">{pet.pet_status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => editPet(pet)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePet(pet.pet_id)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openAdoptionModal(pet)}
                    className="text-green-600 hover:underline ml-2"
                  >
                    Adopt
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
            <h2 className="text-2xl font-semibold mb-4">
              {formData.pet_id ? 'Edit Pet' : 'Add Pet'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="pet_name">
                  Pet Name
                </label>
                <input
                  className="border border-gray-300 p-2 w-full"
                  type="text"
                  name="pet_name"
                  value={formData.pet_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="species_id">
                  Species
                </label>
                <select
                  className="border border-gray-300 p-2 w-full"
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Species</option>
                  {species.map((species) => (
                    <option key={species.species_id} value={species.species_id}>
                      {species.species_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="breed_id">
                  Breed
                </label>
                <select
                  className="border border-gray-300 p-2 w-full"
                  name="breed_id"
                  value={formData.breed_id}
                  onChange={handleInputChange}
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
                <label className="block mb-2" htmlFor="owner_id">
                  Owner
                </label>
                <select
                  className="border border-gray-300 p-2 w-full"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners.map((owner) => (
                    <option key={owner.owner_id} value={owner.owner_id}>
                      {owner.owner_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="date_of_birth">
                  Date of Birth
                </label>
                <input
                  className="border border-gray-300 p-2 w-full"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#405D72] text-white px-4 py-2 rounded hover:bg-[#334e63] transition"
              >
                {formData.pet_id ? 'Update Pet' : 'Add Pet'}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition"
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
