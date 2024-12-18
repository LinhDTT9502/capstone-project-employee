import { useState, useEffect } from "react";
import { fetchSports } from "../../services/sportService";

export function SportSelect({sport, setSport}) {
  const [sports, setSports] = useState([]);
 
  const loadSports = async () => {
    try {
      const fetchedSports = await fetchSports();
      setSports(fetchedSports);
    } catch (error) {
      console.error("Failed to fetch sport:", error);
    }
  };
  useEffect(() => {
    
    loadSports();
  }, [sport, setSport]);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Môn thể thao
      </label>
      <select
        className="mt-1 p-2 border border-gray-300 rounded w-full"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
      >
        <option value="" disabled>
          Chọn môn thể thao
        </option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </select>
    </div>
  );
}
