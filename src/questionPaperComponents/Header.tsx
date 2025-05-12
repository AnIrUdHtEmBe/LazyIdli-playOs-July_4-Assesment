import React, { useContext } from "react";
import { Calendar, FileText } from "lucide-react";
import { DataContext } from "../store/DataContext";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const assignment = JSON.parse(
    localStorage.getItem("assessmentDetails") || "{}"
  );
  const context = useContext(DataContext);

  if (!context) return <div>Loading...</div>;

  const { selectComponent } = context;

  return (
    <header className="bg-white z-10 w-full">
      {/* Top row with icon and title */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-4 sm:px-10">
        <FileText size={48} className="text-gray-800 " />
        <h1 className="text-xl sm:text-2xl md:text-[32px] font-normal text-gray-800 text-center sm:text-left">
          Assessment {assignment?.id ?? ""}
        </h1>
      </div>
      <div className="flex ml-12 gap-3">
        <Calendar></Calendar>
        <h2>Last Assessed : 15/24/35</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center flex-wrap gap-6 sm:gap-10 font-normal text-sm sm:text-base px-2 py-3">
        <span
          className={`cursor-pointer ${
            selectComponent === "Q&A" ? "border-b-4 border-black" : ""
          } text-xl`}
        >
          Questions
        </span>
        <span
          className={`cursor-pointer ${
            selectComponent === "responses" ? "border-b-4 border-black" : ""
          } text-xl`}
        >
          Responses
        </span>
        <span className="cursor-pointer text-xl">Settings</span>
      </div>
    </header>
  );
};

export default Header;
