import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { dateArray, strategyArray } from "@/utils/data";

export default function Home() {
  const [selectedView, setSelectedView] = useState("Bullish");
  const [selectedDate, setSelectedDate] = useState(dateArray[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    updateStrategies();
  }, [selectedView, selectedDate]);

  const updateStrategies = () => {
    const viewData = strategyArray.find((item) => item.View === selectedView);
    if (viewData && viewData.Value[selectedDate]) {
      const counts = {};
      viewData.Value[selectedDate].forEach((strategy) => {
        counts[strategy] = (counts[strategy] || 0) + 1;
      });
      setStrategies(
        Object.entries(counts).map(([name, count]) => ({ name, count }))
      );
    } else {
      setStrategies([]);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDropdownOpen(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex space-x-2 overflow-y-scroll">
        {["Bullish", "Bearish", "RangeBound", "Volatile"].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded ${
              selectedView === view
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <div
          onClick={toggleDropdown}
          className="bg-white border rounded p-2 flex justify-between items-center cursor-pointer"
        >
          <span>{selectedDate}</span>
          <ChevronDown
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded mt-1 z-10">
            {dateArray.map((date) => (
              <div
                key={date}
                onClick={() => handleDateSelect(date)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {date}
              </div>
            ))}
          </div>
        )}
      </div>

      {strategies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {strategies.map(({ name, count }) => (
            <div key={name} className="bg-white border rounded p-4 shadow">
              <h3 className="font-bold">{name}</h3>
              <p>
                {count} {count === 1 ? "Strategy" : "Strategies"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No strategies available for {selectedDate}
          </p>
        </div>
      )}
    </div>
  );
}
