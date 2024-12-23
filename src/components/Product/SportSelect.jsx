import { useState, useEffect } from "react";
import { fetchSports } from "../../services/sportService";

export function SportSelect({ isEdit, sport, setSport }) {
  const [sports, setSports] = useState([]);

  const loadSports = async () => {
    try {
      const fetchedSports = await fetchSports();
      setSports(fetchedSports);
      // Set the first sport as the default selected option
      if (fetchedSports.length > 0 && !sport) {
        setSport(fetchedSports[0].id); // Set the first sport if sport is not provided
      }
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
        disabled={!isEdit} // Disable if isEdit is false
      >
        <option value="" disabled>
          Chọn môn thể thao
        </option>
        {sports.map((sportItem) => (
          <option key={sportItem.id} value={sportItem.id}>
            {sportItem.name}
          </option>
        ))}
      </select>
    </div>
  );
}
