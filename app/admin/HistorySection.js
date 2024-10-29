import React, { useState, useEffect } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faPaw } from '@fortawesome/free-solid-svg-icons';

const HistorySection = () => {
  const [history, setHistory] = useState([]);
  const [approvedAdoptions, setApprovedAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchHistory();
    fetchApprovedAdoptions();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const formData = new FormData();
      formData.append('operation', 'ApproveList');
      const res = await axios.post(url, formData);
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      } else {
        setError('Unexpected data format received for history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to fetch history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedAdoptions = async () => {
    try {
      const url = secureLocalStorage.getItem('url') + "adoptions.php";
      const formData = new FormData();
      formData.append('operation', 'ApproveList');
      const res = await axios.post(url, formData);
      if (Array.isArray(res.data)) {
        setApprovedAdoptions(res.data);
      } else {
        setError('Unexpected data format received for approved adoptions');
      }
    } catch (error) {
      console.error('Error fetching approved adoptions:', error);
      setError('Failed to fetch approved adoptions. Please try again later.');
    }
  };
  console.log('Approved Adoptions:', approvedAdoptions);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const filteredHistory = history.filter(item => 
    (item.action?.toLowerCase().includes(filter.toLowerCase()) || false) ||
    (item.details?.toLowerCase().includes(filter.toLowerCase()) || false)
  ).filter(item => {
    if (dateRange.start && dateRange.end) {
      const itemDate = new Date(item.timestamp);
      return itemDate >= new Date(dateRange.start) && itemDate <= new Date(dateRange.end);
    }
    return true;
  });

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">System History</h2>
      
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="filter" className="sr-only">Filter</label>
          <div className="relative">
            <input
              type="text"
              id="filter"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by action or details"
              value={filter}
              onChange={handleFilterChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md p-2"
          />
          <span>to</span>
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">System Actions</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredHistory.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{item.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.action}</td>
                <td className="px-6 py-4">{item.details}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Approved Adoptions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shelter</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedAdoptions.map((adoption, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{adoption.pet_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{adoption.UserID}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{adoption.Status}</td>
                  <td className="px-6 py-4">{adoption.Reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{adoption.Shelter || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
