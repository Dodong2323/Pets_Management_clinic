"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdoptionSection = () => {
  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const res = await axios.get('http://localhost/pet_management_system/api/adoptions.php');
        setAdoptions(res.data.adoptions || []);
      } catch (error) {
        console.error('Error fetching adoptions:', error);
        setAdoptions([]);
      }
    };

    fetchAdoptions();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Adoptions</h2>
      {adoptions.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-[#758694] text-white">
                <th className="py-3 px-4 text-left">Adoption ID</th>
                <th className="py-3 px-4 text-left">Pet ID</th>
                <th className="py-3 px-4 text-left">Owner ID</th>
                <th className="py-3 px-4 text-left">Adoption Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((adoption) => (
                <tr key={adoption.AdoptionID} className="border-b">
                  <td className="py-3 px-4">{adoption.AdoptionID}</td>
                  <td className="py-3 px-4">{adoption.PetID}</td>
                  <td className="py-3 px-4">{adoption.OwnerID}</td>
                  <td className="py-3 px-4">{adoption.AdoptionDate}</td>
                  <td className="py-3 px-4">{adoption.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No adoptions found.</p>
      )}
    </div>
  );
};

export default AdoptionSection;
