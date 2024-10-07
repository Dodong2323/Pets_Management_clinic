import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VeterinariansSection = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/veterinarians.php');
        setVets(res.data.veterinarians || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
        setError('Failed to fetch veterinarians.');
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  if (loading) {
    return <p className="text-gray-700">Loading veterinarians...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Veterinarians</h2>
      {vets.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Vet ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Specialization</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vets.map((vet, index) => (
                <tr key={vet.VetID} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-3 px-4">{vet.VetID}</td>
                  <td className="py-3 px-4">{vet.Name}</td>
                  <td className="py-3 px-4">{vet.Specialization}</td>
                  <td className="py-3 px-4">{vet.Contact}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700">No veterinarians available.</p>
      )}
    </div>
  );
};

export default VeterinariansSection;
