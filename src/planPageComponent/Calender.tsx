import React, { useState } from 'react';
import { Trash2, Plus, ArrowRight } from 'lucide-react';


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Calendar() {
  const [weeks, setWeeks] = useState<number[][]>(
    Array.from({ length: 4 }, () => Array(7).fill(null))
  );
  const [planName, setPlanName] = useState('');

  const addWeek = () => setWeeks([...weeks, Array(7).fill(null)]);
  const removeWeek = (index: number) => {
    const newWeeks = [...weeks];
    newWeeks.splice(index, 1);
    setWeeks(newWeeks);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-1/2 l max-w-[900px]">
      <input
        type="text"
        placeholder="Plan Name"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
        className="text-xl font-semibold w-full mb-4 border-b outline-none pb-1"
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-black text-center text-sm">
          <thead>
            <tr>
              <th className="border border-black bg-gray-100 w-[80px]"></th>
              {days.map((day) => (
                <th key={day} className="border border-black py-2 px-1 font-semibold bg-gray-100">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIdx) => (
              <tr key={weekIdx}>
                <td className="border border-black font-bold bg-gray-50">
                  Week {weekIdx + 1}
                  
                </td>
                {week.map((_, dayIdx) => (
                  <td key={dayIdx} className="border border-black h-[60px]"></td>
                ))}
                {weekIdx > 0 && (
                    <button onClick={() => removeWeek(weekIdx)} className="ml-2 text-red-500">
                      <Trash2 size={14} />
                    </button>
                )}
                
              </tr>
                
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addWeek}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          <Plus size={16} />
          Add Week
        </button>

        <button className="flex items-center gap-2">
          Confirm <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
