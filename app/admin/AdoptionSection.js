"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';

const AdoptionSection = () => {
  const [pets, setPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAdoptions, setPendingAdoptions] = useState(0);
  const [newPet, setNewPet] = useState({
    petName: '',
    species_id: '',
    breed_id: '',
    age: '',
    gender: '',
    colour: '',
    description: ''
  });

  useEffect(() => {
    fetchPets();
    fetchAdoptionRequests();
    fetchSpeciesAndBreeds();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const url = secureLocalStorage.getItem('url') + "petAdoption.php";
      const formData = new FormData();
      formData.append('operation', 'getAllPetAdoptions');
      const res = await axios.post(url, formData);
      
      if (Array.isArray(res.data)) {
        setPets(res.data);
        // Count pending adoptions
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

  const fetchAdoptionRequests = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const formData = new FormData();
      formData.append('operation', 'PendingAdoptionRequests');
      const res = await axios.post(url, formData);
      
      console.log('Adoption Requests Response:', res.data);

      if (Array.isArray(res.data)) {
        setAdoptionRequests(res.data);
        setPendingAdoptions(res.data.length);
      } else {
        console.error('Unexpected adoption requests data format:', res.data);
        setAdoptionRequests([]);
        setPendingAdoptions(0);
      }
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      setAdoptionRequests([]);
      setPendingAdoptions(0);
    }
  };

  const handleApprove = async (requestId) => {
    await updateToApproved(requestId);
  };

  const handleReview = async (requestId) => {
    await updateToReview(requestId);
  };

  const updateToApproved = async (requestId) => {
    try {
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const updateData = {
        AdoptionID: requestId,
        Status: 'Approved'
      };

      const formData = new FormData();
      formData.append('operation', 'updateToAproved');
      formData.append('json', JSON.stringify(updateData));

      const res = await axios.post(url, formData);
      
      if (res.data === 1) {
        alert('Adoption request approved successfully');
        fetchAdoptionRequests(); // Refresh the adoption requests
        fetchPets(); // Refresh the pets list
      } else {
        alert('Failed to approve adoption request');
      }
    } catch (error) {
      console.error('Error approving adoption request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const updateToReview = async (requestId) => {
    try {
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const updateData = {
        AdoptionID: requestId,
        Status: 'Under Review'
      };

      const formData = new FormData();
      formData.append('operation', 'updateToReview');
      formData.append('json', JSON.stringify(updateData));

      const res = await axios.post(url, formData);
      
      if (res.data === 1) {
        alert('Adoption request set to review successfully');
        fetchAdoptionRequests(); // Refresh the adoption requests
        fetchPets(); // Refresh the pets list
      } else {
        alert('Failed to set adoption request to review');
      }
    } catch (error) {
      console.error('Error setting adoption request to review:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const fetchSpeciesAndBreeds = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "pets.php";
      
      // Fetch species
      const speciesFormData = new FormData();
      speciesFormData.append('operation', 'getSpeciesDetails');
      const speciesRes = await axios.post(url, speciesFormData);
      console.log('Species Response:', speciesRes.data);
      setSpecies(Array.isArray(speciesRes.data) ? speciesRes.data : []);

      // Fetch breeds
      const breedFormData = new FormData();
      breedFormData.append('operation', 'getBreedDetails');
      const breedRes = await axios.post(url, breedFormData);
      console.log('Breed Response:', breedRes.data);
      setBreeds(Array.isArray(breedRes.data) ? breedRes.data : []);
    } catch (error) {
      console.error('Error fetching species and breeds:', error);
      setSpecies([]);
      setBreeds([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPet(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = secureLocalStorage.getItem('url') + "petAdoption.php";
      const formData = new FormData();
      formData.append('operation', 'addPetAdoption');
      formData.append('json', JSON.stringify({
        ...newPet,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      }));
      const res = await axios.post(url, formData);
      if (res.data === 1) {
        alert('Pet added successfully');
        setModalOpen(false);
        fetchPets();
      } else {
        alert('Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      alert('Error adding pet');
    }
  };

  if (loading) return <p>Loading pets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#405D72]">Pet Adoption Management</h2>
        {pendingAdoptions > 0 && (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            <span>{pendingAdoptions} pending adoption request{pendingAdoptions > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Pending Adoption Requests Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Pending Adoption Requests</h3>
        {adoptionRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Pet ID</th>
                  <th className="py-2 px-4 border-b text-left">User ID</th>
                  <th className="py-2 px-4 border-b text-left">Shelter</th>
                  <th className="py-2 px-4 border-b text-left">Reason</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adoptionRequests.map((request) => (
                  <tr key={request.AdoptionID} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{request.petId}</td>
                    <td className="py-2 px-4 border-b">{request.UserID}</td>
                    <td className="py-2 px-4 border-b">{request.Shelter || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{request.Reason}</td>
                    <td className="py-2 px-4 border-b">{request.Status}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleApprove(request.AdoptionID)}
                        className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:bg-green-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleReview(request.AdoptionID)}
                        className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faSearch} className="mr-1" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No pending adoption requests at the moment.</p>
        )}
      </div>

      {/* Existing Pets for Adoption Section */}
      <h3 className="text-xl font-semibold mb-4">Pets Available for Adoption</h3>
      <button 
        onClick={() => setModalOpen(true)}
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
      >
        Add New Pet for Adoption
      </button>
      {pets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Pet Name</th>
                <th className="py-2 px-4 border-b text-left">Species</th>
                <th className="py-2 px-4 border-b text-left">Breed</th>
                <th className="py-2 px-4 border-b text-left">Age</th>
                <th className="py-2 px-4 border-b text-left">Gender</th>
                <th className="py-2 px-4 border-b text-left">Color</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.petId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{pet.petName || 'Unnamed Pet'}</td>
                  <td className="py-2 px-4 border-b">{pet.species_name || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{pet.breed_name || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{pet.age || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{pet.gender || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{pet.colour || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">{pet.description || 'No description'}</td>
                  <td className="py-2 px-4 border-b">{pet.status || 'Unknown'}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600 transition duration-300">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pets available for adoption at the moment.</p>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Pet for Adoption</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="petName"
                value={newPet.petName}
                onChange={handleInputChange}
                placeholder="Pet Name"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <select
                name="species_id"
                value={newPet.species_id}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Species</option>
                {species.map(s => (
                  <option key={s.species_id} value={s.species_id}>{s.species_name}</option>
                ))}
              </select>
              <select
                name="breed_id"
                value={newPet.breed_id}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Breed</option>
                {breeds.map(b => (
                  <option key={b.breed_id} value={b.breed_id}>{b.breed_name}</option>
                ))}
              </select>
              <input
                type="number"
                name="age"
                value={newPet.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <select
                name="gender"
                value={newPet.gender}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                name="colour"
                value={newPet.colour}
                onChange={handleInputChange}
                placeholder="Color"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newPet.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 mb-2 border rounded"
                required
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded mr-2 hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionSection;
