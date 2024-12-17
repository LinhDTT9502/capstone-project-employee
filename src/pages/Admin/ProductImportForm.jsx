import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { CategorySelect } from '../../components/Product/CategorySelect';
import { BrandSelect } from '../../components/Product/BrandSelect';
import { SportSelect } from '../../components/Product/SportSelect';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    categoryId: 0,
    brandId: 0,
    sportId: 0,
    productCode: "",
    mainImage: null,
    productImages: [],
    quantity: 2147483647,
    productName: "",
    listedPrice: 2147483647,
    isRent: true,
    price: 2147483647,
    rentPrice: 2147483647,
    size: "",
    description: "",
    color: "",
    condition: 0,
    height: 0,
    length: 0,
    width: 0,
    weight: 0,
    offers: "",
    discount: 0,
  });

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [productImagesPreview, setProductImagesPreview] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      loading: true,
    }));

    setProductImagesPreview(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));

    setTimeout(() => {
      setProductImagesPreview(prev =>
        prev.map(img => ({ ...img, loading: false }))
      );
    }, 1000);
  };

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, mainImage: null }));
    setMainImagePreview(null);
  };

  const removeProductImage = (index) => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
    setProductImagesPreview(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Đăng sản phẩm</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Product Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productName">
                  Tên sản phẩm
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  id="productName"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CategorySelect/>
                </div>
                <div>
                    <BrandSelect/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SportSelect/>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productCode">
                    Mã sản phẩm
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="productCode"
                    name="productCode"
                    type="text"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                    Số lượng
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="listedPrice">
                    Giá niêm yết
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="listedPrice"
                    name="listedPrice"
                    type="number"
                    value={formData.listedPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                    Giá mua
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rentPrice">
                    Giá thuê
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="rentPrice"
                    name="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
                    Kích thước
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="size"
                    name="size"
                    type="text"
                    value={formData.size}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">
                    Màu sắc
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="color"
                    name="color"
                    type="text"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="condition">
                    Tình trạng
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="condition"
                    name="condition"
                    type="number"
                    value={formData.condition}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="isRent">
                    Duyệt thuê
                  </label>
                  <div className='flex'>
                  <p>Đơn hàng được thuê</p>
                  <input
                    className="mt-1"
                    id="isRent"
                    name="isRent"
                    type="checkbox"
                    checked={formData.isRent}
                    onChange={handleInputChange}
                  />
                </div></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                    Chiều cao
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="length">
                    Độ dài
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="length"
                    name="length"
                    type="number"
                    value={formData.length}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="width">
                    Độ rộng
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="width"
                    name="width"
                    type="number"
                    value={formData.width}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                    Khối lượng
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="offers">
                  Khuyến mãi
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  id="offers"
                  name="offers"
                  type="text"
                  value={formData.offers}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount">
                  Giảm giá
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh sản phẩm đại diện
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {mainImagePreview ? (
                    <div className="relative">
                      <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="max-h-48 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="main-image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="main-image-upload"
                            name="main-image-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleMainImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đăng ảnh sản phẩm
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="gallery-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="gallery-upload"
                          name="gallery-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleProductImagesUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 mt-4">
                {productImagesPreview.map((img, index) => (
                  <div key={index} className="relative">
                    <div className="group aspect-w-10 aspect-h-7 block overflow-hidden rounded-lg bg-gray-100">
                      {img.loading ? (
                        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-blue-500 animate-spin absolute inset-0 m-auto" />
                      ) : (
                        <>
                          <img
                            src={img.url}
                            alt={`Product ${index + 1}`}
                            className="h-20 w-20 object-cover pointer-events-none"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                            onClick={() => removeProductImage(index)}
                          >
                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-blue-500"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
