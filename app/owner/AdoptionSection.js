"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHeart, faHome, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AdoptionSection = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAdoptions, setPendingAdoptions] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [adoptionReason, setAdoptionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6; // Adjust this number as needed

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const url = secureLocalStorage.getItem('url') + "petAdoption.php";
      console.log('API URL:', url);
      const formData = new FormData();
      formData.append('operation', 'getAllPetAdoptions');
      console.log('Operation:', formData.get('operation'));
      const res = await axios.post(url, formData);
      console.log('API Response:', res.data);
      
      if (Array.isArray(res.data)) {
        setPets(res.data);
        const pendingCount = res.data.filter(pet => pet.status === 'Pending').length;
        setPendingAdoptions(pendingCount);
      } else {
        setError('Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to fetch pets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setModalOpen(true);
  };

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const userId = secureLocalStorage.getItem('userId');
      console.log('User ID:', userId);

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const adoptionData = {
        petId: selectedPet.petId,
        UserID: userId,
        Status: 'Pending',
        Reason: adoptionReason
      };

      console.log('Adoption data:', adoptionData);

      const formData = new FormData();
      formData.append('operation', 'requestAdoption');
      formData.append('json', JSON.stringify(adoptionData));

      console.log('Sending adoption request:', adoptionData);

      const res = await axios.post(url, formData);
      console.log('Server response:', res.data);

      if (res.data === 1) {
        alert('Adoption request submitted successfully!');
        setModalOpen(false);
        fetchPets();
      } else {
        alert('Failed to submit adoption request. Server response: ' + JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  // Get current pets
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(pets.length / petsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Pets for Adoption</h2>
        {pendingAdoptions > 0 && (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            <span>{pendingAdoptions} pending adoption{pendingAdoptions > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading pets...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : currentPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPets.map((pet) => (
            <PetCard key={pet.petId} pet={pet} onAdopt={handleAdoptClick} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No pets available for adoption at the moment.</p>
      )}

      {/* Navigation buttons */}
      {currentPage < Math.ceil(pets.length / petsPerPage) && (
        <button 
          onClick={nextPage}
          className="absolute top-0 right-0 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
      {currentPage > 1 && (
        <button 
          onClick={prevPage}
          className="absolute bottom-0 left-0 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}

      {/* Adoption Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Adopt {selectedPet?.petName}</h3>
            <form onSubmit={handleAdoptSubmit}>
              <textarea
                value={adoptionReason}
                onChange={(e) => setAdoptionReason(e.target.value)}
                placeholder="Please provide a reason for adoption"
                className="w-full p-2 mb-4 border rounded"
                rows="4"
                required
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PetCard = ({ pet, onAdopt }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{pet.petName || 'Unnamed Pet'}</h3>
      <p className="text-sm text-gray-600 mb-2">{pet.breed_name}, {pet.age} years old</p>
      <p className="text-sm text-gray-500 mb-2">{pet.description || 'No description available'}</p>
      <p className="text-sm text-gray-600 mb-4">
        <FontAwesomeIcon icon={faHome} className="mr-2" />
        Shelter: {pet.Shelter || 'Not specified'}
      </p>
      {pet.status !== 'Pending' && (
        <button 
          onClick={() => onAdopt(pet)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faHeart} className="mr-2" />
          Adopt Me
        </button>
      )}
    </div>
  </div>
);

export default AdoptionSection;
