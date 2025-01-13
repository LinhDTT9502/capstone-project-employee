import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Product';

/**
 * Create a new folder via API
 * @param {string} folderName - Name of the folder to create
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Object>} - Response data from the API
 */
export const createFolderAPI = async (folderName) => {
	try {
		const url = `${API_BASE_URL}/create-folder?folderName=${folderName}`;
		const response = await axios.post(
			url,
			{
				headers: {
					Accept: '*/*',
					'Content-Type': 'application/json',
				},
			}
		);
		return response;
	} catch (error) {
		throw new Error(`Failed to create folder: ${error.message}`);
	}
};

/**
 * Get all folders via API
 * @returns {Promise<Object>} - Response data from the API
 */
export const getAllFoldersAPI = async () => {
	try {
		const url = `${API_BASE_URL}/get-all-folders`;
		const response = await axios.get(url, {
			headers: {
				Accept: '*/*',
			},
		});
		return response;
	} catch (error) {
		throw new Error(`Failed to fetch folders: ${error.message}`);
	}
};

/**
 * Upload images to a specific folder via API
 * @param {string} folderName - ID of the folder to upload images to
 * @param {File[]} images - Array of image files to upload
 * @returns {Promise<Object>} - Response data from the API
 */
export const uploadImagesAPI = async (folderName, images) => {
	try {
		const url = `${API_BASE_URL}/upload-images?folderName=${folderName}`;
		const formData = new FormData();

		// Append each image to the FormData
		images.forEach((image) => {
			formData.append('imageFiles', image);
		});

		const response = await axios.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: '*/*',
			},
		});

		return response;
	} catch (error) {
		throw new Error(`Failed to upload images: ${error.message}`);
	}
};

/**
 * Get all images in a specific folder via API
 * @param {string} folderName - ID of the folder to retrieve images from
 * @returns {Promise<Object>} - Response data from the API
 */
export const getAllImagesInFolderAPI = async (folderName) => {
	try {
		const url = `${API_BASE_URL}/get-all-images-in-folder?folderName=${folderName}`;
		const response = await axios.get(url, {
			headers: {
				Accept: '*/*',
			},
		});
		return response.data.$values;
	} catch (error) {
		throw new Error(`Failed to fetch images in folder: ${error.message}`);
	}
};

/**
 * Delete a specific image in a folder via API
 * @param {string} folderName - ID of the folder containing the image
 * @param {string} imageURL - ID of the image to delete
 * @returns {Promise<Object>} - Response data from the API
 */
export const deleteAnImageInFolderAPI = async (folderName, imageURL) => {
	try {
		const url = `${API_BASE_URL}/delete-an-image-in-folder?folderName=${folderName}&imageUrl=${imageURL}`;
		const response = await axios.delete(url, {
			headers: {
				Accept: '*/*',
			},
		});
		return response.data;
	} catch (error) {
		throw new Error(`Failed to delete image: ${error.message}`);
	}
};

/**
 * Delete a specific image in a folder via API
 * @param {string} folderName - ID of the folder containing the image
 * @returns {Promise<Object>} - Response data from the API
 */
export const deleteAFolderAPI = async (folderName) => {
	try {
		const url = `${API_BASE_URL}/delete-a-folder?folderName=${folderName}`;
		const response = await axios.delete(url, {
			headers: {
				Accept: '*/*',
			},
		});
		return response.data;
	} catch (error) {
		throw new Error(`Failed to delete folder: ${error.message}`);
	}
};