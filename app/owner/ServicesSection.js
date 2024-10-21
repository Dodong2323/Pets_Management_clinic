import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import secureLocalStorage from 'react-secure-storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCut, faBath, faStethoscope, faSyringe, faTooth, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6; // Adjust this number as needed

  const fetchServices = async () => {
    setLoading(true);
    try {
      const url = secureLocalStorage.getItem("url") + "services.php";
      const formData = new FormData();
      formData.append("operation", "getServiceDetails");
      const res = await axios.post(url, formData);

      if (res.data != 0) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      toast.error("Network error!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getServiceIcon = (serviceName) => {
    switch (serviceName.toLowerCase()) {
      case 'grooming': return faCut;
      case 'bathing': return faBath;
      case 'checkup': return faStethoscope;
      case 'vaccination': return faSyringe;
      case 'dental cleaning': return faTooth;
      default: return faPaw;
    }
  };

  // Get current services
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(services.length / servicesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-semibold text-[#FF69B4] mb-6">Our Services</h2>
      {loading && <p className="text-center text-[#FF69B4]">Loading services...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentServices.map((service, index) => (
          <div key={index} className="bg-[#FFF0F5] rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={getServiceIcon(service.ServiceName)} className="text-3xl text-[#FF69B4] mr-4" />
              <h3 className="text-xl font-semibold text-[#FF69B4]">{service.ServiceName}</h3>
            </div>
            <p className="text-gray-600 mb-4">{service.Description}</p>
            <p className="text-[#FF69B4] font-bold">Price: ${service.Price}</p>
          </div>
        ))}
      </div>
      {services.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">No services found</p>
      )}
      
      {/* Next button (top right) */}
      {currentPage < Math.ceil(services.length / servicesPerPage) && (
        <button 
          onClick={nextPage}
          className="absolute top-4 right-4 px-3 py-2 rounded bg-[#FF69B4] hover:bg-[#FF1493] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}

      {/* Previous button (bottom left) */}
      {currentPage > 1 && (
        <button 
          onClick={prevPage}
          className="absolute bottom-4 left-4 px-3 py-2 rounded bg-[#FF69B4] hover:bg-[#FF1493] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
    </div>
  );
};

export default ServicesSection;
