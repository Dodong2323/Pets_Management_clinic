import React, { useEffect, useState } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faEdit, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PetsSection = () => {
  const [formData, setFormData] = useState({
    pet_id: '',
    pet_name: '',
    species_id: '',
    breed_id: '',
    date_of_birth: '',
  });
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredPets, setFilteredPets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6; // Adjust this number as needed

  useEffect(() => {
    fetchDetails();
    fetchOwnerPets();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const url = secureLocalStorage.getItem('url') + "pets.php";
      const formData = new FormData();
      formData.append("operation", "getalldetails");
      const response = await axios.post(url, formData);
      const res = response.data;
      setSpecies(res.getSpeciesDetails);
      setBreeds(res.getBreedDetails);
      toast.success('Data fetched successfully!', { duration: 1200 });
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Error fetching details');
      setError('Error fetching details');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerPets = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";
      const formData = new FormData();
      formData.append("operation", "ownerpets");
      formData.append("UserID", secureLocalStorage.getItem('userId'));
      const res = await axios.post(url, formData);
      console.log('Owner pets response:', res.data);
      setFilteredPets(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching owner pets:', error);
      setFilteredPets([]);
      toast.error('Error fetching your pets');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (pet = null) => {
    if (pet) {
      setFormData({
        pet_id: pet.pet_id,
        pet_name: pet.pet_name,
        species_id: pet.species_id,
        breed_id: pet.breed_id,
        date_of_birth: pet.date_of_birth,
      });
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
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
        ...formData,
        UserID: secureLocalStorage.getItem('userId'),
      };
      const formDataToSend = new FormData();
      formDataToSend.append('json', JSON.stringify(petData));
      formDataToSend.append('operation', isEditing ? 'updatePets' : 'addPets');
      const res = await axios.post(url, formDataToSend);
      toast.dismiss(loadingToast);
      if (res.data > 0) {
        toast.success(isEditing ? 'Pet updated successfully!' : 'Pet added successfully!');
        setModalOpen(false);
        fetchOwnerPets();
      } else {
        toast.error("Failed to " + (isEditing ? "update" : "add") + " pet!");
      }
    } catch (error) {
      toast.error("Network error!", { description: error.message });
      console.error('Error adding/updating pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pet_id: '',
      pet_name: '',
      species_id: '',
      breed_id: '',
      date_of_birth: '',
    });
  };

  // Get current pets for pagination
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredPets.length / petsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold mb-4 text-[#FF69B4]">My Furry Friends</h1>

      {/* Add Pet button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => openModal()}
          className="bg-[#FF69B4] text-white p-4 rounded-full hover:bg-[#FF1493] transition-colors duration-300 shadow-lg"
          title="Add Pet"
        >
          <FontAwesomeIcon icon={faPaw} className="text-2xl" />
        </button>
      </div>

      {loading && <p className="text-center text-[#FF69B4]">Loading your pets...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {currentPets.length > 0 ? (
          currentPets.map((pet) => (
            <div key={pet.pet_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-[#FFC0CB] p-4 flex items-center">
                <FontAwesomeIcon icon={faPaw} className="text-3xl text-white mr-3" />
                <h3 className="text-xl font-semibold text-white">{pet.pet_name}</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600"><span className="font-semibold">Species:</span> {pet.species_name}</p>
                <p className="text-gray-600"><span className="font-semibold">Breed:</span> {pet.breed_name}</p>
                <p className="text-gray-600"><span className="font-semibold">Birthday:</span> {pet.date_of_birth}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openModal(pet)}
                    className="text-[#4CAF50] hover:text-[#45a049]"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No pets found. Add your furry friend!</p>
        )}
      </div>

      {/* Pagination buttons */}
      {currentPage < Math.ceil(filteredPets.length / petsPerPage) && (
        <button 
          onClick={nextPage}
          className="absolute top-4 right-20 px-3 py-2 rounded-full bg-[#FF69B4] hover:bg-[#FF1493] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
      {currentPage > 1 && (
        <button 
          onClick={prevPage}
          className="absolute bottom-4 left-4 px-3 py-2 rounded-full bg-[#FF69B4] hover:bg-[#FF1493] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}

      {/* Modal for Add/Edit Pet */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#FFF0F5] p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-[#FF69B4] hover:text-[#FF1493] transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
            <h2 className="text-2xl mb-4 text-[#FF69B4] font-bold">{isEditing ? 'Edit Pet' : 'Add Pet'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Pet Name</label>
                <input
                  type="text"
                  name="pet_name"
                  value={formData.pet_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Species</label>
                <select
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Species</option>
                  {species.map((s) => (
                    <option key={s.species_id} value={s.species_id}>
                      {s.species_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Breed</label>
                <select
                  name="breed_id"
                  value={formData.breed_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Breed</option>
                  {breeds.map((b) => (
                    <option key={b.breed_id} value={b.breed_id}>
                      {b.breed_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF69B4] text-white rounded-md hover:bg-[#FF1493] transition-colors duration-300"
                >
                  {isEditing ? 'Update Pet' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsSection;
