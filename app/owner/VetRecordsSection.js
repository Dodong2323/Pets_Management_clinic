"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const VetRecordsSection = () => {
  const [vetRecords, setVetRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVetRecords = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/vet_records.php');
        setVetRecords(res.data.vetRecords || []);
      } catch (error) {
        console.error('Error fetching veterinary records:', error);
        setError('Failed to fetch veterinary records.');
      } finally {
        setLoading(false);
      }
    };

    fetchVetRecords();
  }, []);

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost/pet_management_system/api/delete_vet_record.php?id=${recordId}`);
      setVetRecords(vetRecords.filter(record => record.RecordID !== recordId));
      toast.success('Record deleted successfully!', { duration: 1200 });
    } catch (error) {
      console.error('Error deleting veterinary record:', error);
      toast.error('Failed to delete record!', { duration: 1200 });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Veterinary Records</h2>
      {vetRecords.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Record ID</th>
                <th className="py-3 px-4 text-left">Pet ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vetRecords.map((record) => (
                <tr key={record.RecordID} className="border-b">
                  <td className="py-3 px-4">{record.RecordID}</td>
                  <td className="py-3 px-4">{record.PetID}</td>
                  <td className="py-3 px-4">{record.Date}</td>
                  <td className="py-3 px-4">{record.Description}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(record.RecordID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No veterinary records found.</p>
      )}
    </div>
  );
};

export default VetRecordsSection;
