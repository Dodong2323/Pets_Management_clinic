import React, { useState } from 'react';

// Modal Component for Adoption Data Entry
const AdoptionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to handle form submission goes here
    console.log('Adoption data submitted');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Adoption Data Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Pet Name:</label>
            <input type="text" className="border border-gray-300 p-2 rounded w-full" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Pet Type:</label>
            <input type="text" className="border border-gray-300 p-2 rounded w-full" required />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#24C6DC] text-white py-1 px-2 rounded hover:bg-[#1EA7C4] transition mr-2 text-sm">
              Submit
            </button>
            <button onClick={onClose} className="bg-gray-300 text-gray-700 py-1 px-2 rounded hover:bg-gray-400 transition text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component to display available pets for adoption
const AvailablePets = () => {
  const availablePets = [
    { id: 1, name: 'Buddy', type: 'Dog' },
    { id: 2, name: 'Mittens', type: 'Cat' },
    { id: 3, name: 'Charlie', type: 'Dog' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Pets for Adoption</h2>
      <ul>
        {availablePets.map((pet) => (
          <li key={pet.id} className="border p-2 mb-2 rounded shadow">
            {pet.name} - {pet.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Component to display pets with owners
const PetsWithOwners = () => {
  const petsWithOwners = [
    { id: 1, name: 'Max', type: 'Dog', owner: 'Alice' },
    { id: 2, name: 'Luna', type: 'Cat', owner: 'Bob' },
    { id: 3, name: 'Rocky', type: 'Dog', owner: 'Charlie' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pets with Owners</h2>
      <ul>
        {petsWithOwners.map((pet) => (
          <li key={pet.id} className="border p-2 mb-2 rounded shadow">
            {pet.name} - {pet.type} (Owner: {pet.owner})
          </li>
        ))}
      </ul>
    </div>
  );
};

const PetsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // State to manage which section to show

  const petCategories = [
    {
      id: 1,
      name: 'Adoption',
      imageUrl: '/images/adoption.png', // Replace with actual image URLs
      bgColor: 'bg-[#24C6DC]', // Blue background for Adoption
    },
    {
      id: 2,
      name: 'List of Pets',
      imageUrl: '/images/list_of_pets.png', // Replace with actual image URLs
      bgColor: 'bg-[#FFAB7C]', // Orange background for List of Pets
    },
  ];

  const handleAddPet = () => {
    setIsModalOpen(true);
  };

  const handleCategoryClick = (category) => {
    if (category.name === 'Adoption') {
      setActiveSection('availablePets');
    } else if (category.name === 'List of Pets') {
      setActiveSection('petsWithOwners');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddPet}
          className="bg-[#24C6DC] text-white font-semibold py-1 px-2 rounded hover:bg-[#1EA7C4] transition text-sm"
        >
          Add Pet
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {petCategories.map((pet) => (
          <div
            key={pet.id}
            onClick={() => handleCategoryClick(pet)}
            className={`relative rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition cursor-pointer ${pet.bgColor} p-2`} // Add padding here to make it smaller
            style={{
              backgroundImage: `url(${pet.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '150px', // Adjust height for smaller button
            }}
          >
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold z-10 text-center">{pet.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Render the appropriate section based on the active section */}
      {activeSection === 'availablePets' && <AvailablePets />}
      {activeSection === 'petsWithOwners' && <PetsWithOwners />}

      {/* Modal for Adoption Data Entry */}
      <AdoptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PetsSection;
