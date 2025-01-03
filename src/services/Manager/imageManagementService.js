import {
    createFolderAPI,
    getAllFoldersAPI,
    uploadImagesAPI,
    getAllImagesInFolderAPI,
    deleteAnImageInFolderAPI,
} from "../../api/Manager/apiManageImages";

/**
 * Create a new folder
 * @param {string} folderName - Name of the folder to create
 * @returns {Promise<Object>} - Created folder data
 */
export const createFolder = async (folderName) => {
    try {
        console.log(folderName);

        const response = await createFolderAPI(folderName);
        return response; // Return the response as it is from the API
    } catch (error) {
        console.error(`Error creating folder:`, error);
        throw error;
    }
};

/**
 * Fetch all folders
 * @returns {Promise<Object>} - List of all folders
 */
export const fetchAllFolders = async () => {
    try {
        const response = await getAllFoldersAPI();
        return response.data.$values; // Return the response as it is from the API
    } catch (error) {
        console.error(`Error fetching folders:`, error);
        throw error;
    }
};

/**
 * Upload images to a folder
 * @param {string} folderName - ID of the folder to upload images to
 * @param {File[]} images - Array of image files to upload
 * @returns {Promise<Object>} - Response data after uploading images
 */
export const uploadImagesToFolder = async (folderName, images) => {
    try {
        const response = await uploadImagesAPI(folderName, images);
        console.log(response);

        return response; // Return the response as it is from the API
    } catch (error) {
        console.error(`Error uploading images:`, error);
        throw error;
    }
};

/**
 * Fetch all images in a specific folder
 * @param {string} folderName - ID of the folder to retrieve images from
 * @returns {Promise<Object>} - List of all images in the folder
 */
export const fetchAllImagesInFolder = async (folderName) => {
    try {
        const response = await getAllImagesInFolderAPI(folderName);
        console.log(response);

        return response; // Return the response as it is from the API
    } catch (error) {
        console.error(`Error fetching images in folder:`, error);
        throw error;
    }
};

/**
 * Delete a specific image in a folder
 * @param {string} folderName - ID of the folder containing the image
 * @param {string} imageUrl - ID of the image to delete
 * @returns {Promise<Object>} - Response data after deleting the image
 */
export const deleteImageInFolder = async (folderName, imageUrl) => {
    try {
        const response = await deleteAnImageInFolderAPI(folderName, imageUrl);
        return response; // Return the response as it is from the API
    } catch (error) {
        console.error(`Error deleting image:`, error);
        throw error;
    }
};