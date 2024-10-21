import React from 'react';

const ReportsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Admin Reports Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard title="Total Pets" count={150} icon="🐾" />
        <ReportCard title="Adoptions This Month" count={12} icon="🏠" />
        <ReportCard title="Pending Appointments" count={8} icon="📅" />
        <ReportCard title="Active Services" count={10} icon="💉" />
        <ReportCard title="Total Owners" count={100} icon="👥" />
        <ReportCard title="Revenue This Month" count="$5,000" icon="💰" />
      </div>
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-700">Tip: Click on any card to view detailed reports.</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton title="Generate Monthly Report" icon="📊" />
          <ActionButton title="View Adoption Trends" icon="📈" />
          <ActionButton title="Analyze Service Usage" icon="🔍" />
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ title, count, icon }) => (
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

const ActionButton = ({ title, icon }) => (
  <button className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300 flex items-center justify-between w-full">
    <span className="font-semibold text-gray-800">{title}</span>
    <span className="text-2xl">{icon}</span>
  </button>
);

export default ReportsSection;
