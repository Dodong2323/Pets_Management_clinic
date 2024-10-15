import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [formData, setFormData] = useState({
    ServiceID: null,
    ServiceName: '',
    Description: '',
    Price: '',
    Duration: '',
  });

  // Fetch services from the server using POST
  const fetchServices = async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset any previous errors
    try {
      const response = await axios.post('http://localhost/pet_management_system/api/services.php', {
        operation: 'getServiceDetails',
      });
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        setError(response.data.message); // Set error message
      }
    } catch (error) {
      setError("Error fetching services: " + error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    } 
  };

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true during submission
    setError(null); // Reset any previous errors
    try {
      const response = await axios.post('http://localhost/pet_management_system/api/services.php', {
        operation: formData.ServiceID ? 'updateService' : 'addService',
        ...formData,
      });

      if (response.data.success) {
        fetchServices(); // Refresh the service list
        setModalOpen(false); // Close the modal after submission
      } else {
        setError(response.data.message); // Set error message
      }
    } catch (error) {
      setError("An error occurred while saving the service: " + error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false after submission
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
      setLoading(true); // Set loading to true during deletion
      setError(null); // Reset any previous errors
      try {
        const response = await axios.post('http://localhost/pet_management_system/api/services.php', {
          operation: 'deleteService',
          ServiceID,
        });
        if (response.data.success) {
          fetchServices(); // Refresh the service list after deletion
        } else {
          setError("Failed to delete service: " + response.data.message); // Set error message
        }
      } catch (error) {
        setError("Error deleting service: " + error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false after deletion
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-[#405D72] mb-6">Services</h2>
      <button onClick={openModal} className="bg-[#405D72] text-white px-4 py-2 rounded mb-4">
        Add Service
      </button>
      {loading && <p>Loading services...</p>} {/* Loading message */}
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Service Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Duration (minutes)</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="border text-center py-4">No services found</td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.ServiceID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{service.ServiceName}</td>
                  <td className="border px-4 py-2">{service.Description}</td>
                  <td className="border px-4 py-2">{service.Price}</td>
                  <td className="border px-4 py-2">{service.Duration}</td>
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
                  min="0" // Ensure price is non-negative
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
                  min="0" // Ensure duration is non-negative
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
