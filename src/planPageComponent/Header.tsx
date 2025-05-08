import React, { useContext } from 'react';
import { FileText } from "lucide-react";
import { DataContext } from '../store/DataContext';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const assignment = JSON.parse(localStorage.getItem("assessmentDetails") || '{}');

  const context = useContext(DataContext);
  if (!context) {
    return <div>Loading...</div>;
  }

  const { selectComponent } = context;

  return (
    <header className="bg-white shadow-sm z-10 w-full">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 px-4 sm:px-10 py-4">
        <FileText size={28} className="text-gray-800" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Plan Creation {assignment?.id ?? ''}
        </h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:gap-10 gap-2 font-semibold px-4 py-2">
        <button
          className={`pb-1 sm:pb-2 ${selectComponent === 'planCreation' ? "border-b-2 border-blue-500" : ""}`}
        >
          Plan Creator
        </button>
        <button className="pb-1 sm:pb-2">All Plans</button>
      </div>
    </header>
  );
};

export default Header;
