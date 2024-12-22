import { useState, useEffect } from "react";
import { fetchSports } from "../../services/sportService";

export function SportSelect({ sport, setSport }) {
  const [sports, setSports] = useState([]);

  const loadSports = async () => {
    try {
      const fetchedSports = await fetchSports();
      setSports(fetchedSports);
      // Set the first sport as the default selected option
      if (fetchedSports.length > 0 && !sport) {
        setSport(sport);

      }
    } catch (error) {
      console.error("Failed to fetch sport:", error);
    }
  };
  useEffect(() => {

    loadSports();
  }, [sport, setSport]);

  console.log();


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
