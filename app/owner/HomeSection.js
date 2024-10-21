import React from 'react';

const HomeSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to Your Pet Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="My Pets" count={3} icon="🐶" />
        <DashboardCard title="Upcoming Appointments" count={2} icon="📅" />
        <DashboardCard title="Available Services" count={5} icon="💉" />
      </div>
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-700">Remember to schedule your pet's annual check-up!</p>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-3xl font-bold text-blue-600">{count}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

export default HomeSection;
