import api from '../../utils/api';

export const createBlog = (formData) => {
	return api.post(`/Blog/create-blog`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};
export const createProduct = (formData) => {
	return api.post(`/Product/import-product`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};
export const getAllBlog = () => {
	return api.get(`/Blog/get-all-blogs`, {
		headers: {
			accept: '*/*',
		},
	});
};

export const deleteBlog = async (id) => {
	try {
		const response = await api.delete(`/Blog/delete-blog/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting combo:', error);
		throw error;
	}
};

export const updateBlog = (blogId, formData) => {
	return api.put(`/Blog/edit-blog/${blogId}`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};
