import { 
    getAllSports, 
    getSportDetails, 
    addSport, 
    editSport, 
    removeSport 
} from "../api/apiSport";

// Fetch all sports
export const fetchSports = async () => {
    try {
        const response = await getAllSports();
        const filteredSports = response.data.data.$values.filter(sport => sport.status === true);
        return filteredSports; 
    } catch (error) {
        console.error("Error fetching sports:", error);
        throw error;
    }
};

// Fetch sport details by ID
export const fetchSportDetails = async (sportId) => {
    try {
        const response = await getSportDetails(sportId);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching sport details for ID ${sportId}:`, error);
        throw error;
    }
};

// Add a new sport
export const createSport = async (sportData) => {
    try {
        const response = await addSport(sportData);
        return response.data; 
    } catch (error) {
        console.error("Error adding new sport:", error);
        throw error;
    }
};

// Edit an existing sport
export const updateSport = async (sportId, sportData) => {
    try {
        const response = await editSport(sportId, sportData);
        return response.data;
    } catch (error) {
        console.error(`Error updating sport with ID ${sportId}:`, error);
        throw error;
    }
};

// Remove a sport by ID
export const deleteSport = async (sportId) => {
    try {
        const response = await removeSport(sportId);
        return response.data;
    } catch (error) {
        console.error(`Error removing sport with ID ${sportId}:`, error);
        throw error;
    }
};
