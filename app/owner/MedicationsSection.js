import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicationsSection = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/medications.php');
        setMedications(res.data.medications || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setError('Failed to fetch medications.');
        setLoading(false);
      }
    };
    fetchMedications();
  }, []);

  if (loading) {
    return <p className="text-gray-700">Loading medications...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Medications</h2>
      {medications.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Medication ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Dosage</th>
                <th className="py-3 px-4 text-left">Instructions</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <tr key={med.MedicationID} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-3 px-4">{med.MedicationID}</td>
                  <td className="py-3 px-4">{med.Name}</td>
                  <td className="py-3 px-4">{med.Dosage}</td>
                  <td className="py-3 px-4">{med.Instructions}</td>
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
        <p className="text-gray-700">No medications available.</p>
      )}
    </div>
  );
};

export default MedicationsSection;
