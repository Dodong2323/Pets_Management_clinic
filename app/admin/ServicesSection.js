'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FaSearch } from 'react-icons/fa';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ServiceID: null,
    ServiceName: '',
    Description: '',
    Price: '',
    Duration: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterName, setFilterName] = useState('');

  // Fetch services from the server using POST
  const fetchServices = async () => {
    // setLoading(true); // Changed to setLoading
    try {
      const url = secureLocalStorage.getItem("url") + "services.php";
      const formData = new FormData();
      formData.append("operation", "getServiceDetails");
      const res = await axios.post(url, formData);
      
      console.log("Fetch Services Response:", res.data); // Debugging output

      // Check if response data is valid
      if (res.data != 0) { // Ensure data structure is correct
        setServices(res.data); // Assuming res.data.data is the correct path to the services array
      } else {
        setServices([]);
      }
    } catch (error) {
      toast.error("Network error!");
      console.log(error);
    } finally {
      setLoading(false); // Changed to setLoading
    }
  };

  // Fetch services when the component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating/updating a service
  // Handle form submission for creating/updating a service
const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const response = await axios.post('http://localhost/pet_management_system/api/services.php', {
      operation: formData.ServiceID ? 'updateService' : 'addService',
      ...formData,
      UpdatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    if (response.data.success) {
      fetchServices();  // Fetch services again after successful operation
      setModalOpen(false);  // Close modal immediately after form submission
    } else {
      setError(response.data.message);
    }
  } catch (error) {
    setError("An error occurred while saving the service: " + error.message);
  } finally {
    setLoading(false);  // Ensure loading state is cleared
  }
};


  // Reset form data
  const resetForm = () => {
    setFormData({
      ServiceID: null,
      ServiceName: '',
      Description: '',
      Price: '',
      Duration: '',
    });
  };

  // Open modal for adding a service
  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open modal for editing a service
  const editService = (service) => {
    setFormData(service);
    setModalOpen(true);
  };

  // Delete a service
  const deleteService = async (ServiceID) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost/pet_management_system/api/services.php', {
          operation: 'deleteService',
          ServiceID,
        });
        if (response.data.success) {
          fetchServices();
        } else {
          setError("Failed to delete service: " + response.data.message);
        }
      } catch (error) {
        setError("Error deleting service: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter and search services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.ServiceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = filterName === '' || service.ServiceName === filterName;
    return matchesSearch && matchesName;
  });

  // Get unique service names for the filter dropdown
  const uniqueServiceNames = [...new Set(services.map(service => service.ServiceName))];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Services</h2>
      <div className="flex justify-between items-center mb-4">
        <button onClick={openModal} className="bg-[#405D72] text-white px-4 py-2 rounded">
          Add Service
        </button>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Services</option>
            {uniqueServiceNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      {loading && <p>Loading services...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Service Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Duration (minutes)</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Updated At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="7" className="border text-center py-4">No services found</td>
              </tr>
            ) : (
              filteredServices.map((service, index) => (
                <tr key={index} value={service.ServiceID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{service.ServiceName}</td>
                  <td className="border px-4 py-2">{service.Description}</td>
                  <td className="border px-4 py-2">{service.Price}</td>
                  <td className="border px-4 py-2">{service.Duration}</td>
                  <td className="border px-4 py-2">{service.CreatedAt}</td>
                  <td className="border px-4 py-2">{service.UpdatedAt}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => editService(service)} className="text-blue-500">Edit</button>
                    <button onClick={() => deleteService(service.ServiceID)} className="text-red-500 ml-2">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">{formData.ServiceID ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="ServiceID" value={formData.ServiceID || ''} />
              <div className="mb-4">
                <label className="block mb-1">Service Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="ServiceName"
                  value={formData.ServiceName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter service name"
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Price <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter price"
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Duration (minutes) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="Duration"
                  value={formData.Duration}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter duration"
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <button type="submit" className="bg-[#405D72] text-white px-4 py-2 rounded">
                {loading ? 'Saving...' : 'Save Service'}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="ml-2 border px-4 py-2 rounded">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
