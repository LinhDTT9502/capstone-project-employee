import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSpinner,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CategorySelect } from "../../components/Product/CategorySelect";
import { BrandSelect } from "../../components/Product/BrandSelect";
import { SportSelect } from "../../components/Product/SportSelect";
import SearchBar from "../../components/Admin/SearchBar";
import ImportFileExcel from "./ImportFileExcel";
import TemplateFile from "./TemplateFile";
import { toast, ToastContainer } from "react-toastify";
import { getAllImagesVideosByProductId } from "../../services/imageVideosService";
import { fetchSportDetails } from "../../services/sportService";
import { fetchCategoryDetails } from "../../services/categoryService";
import { getBrandDetails } from "../../services/brandService";

const ImportProduct = () => {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [productImagesPreview, setProductImagesPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sport, setSport] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [isImportDirectly, setIsImportDirectly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromSearch, setIsFromSearch] = useState(false);

  const selectedSport = async () => {
    try {
      const data = await fetchSportDetails(selectedProduct.sportId);
      console.log(data.id);
      setSport(data.id);
    } catch (error) {
      console.error("Failed to fetch sport", error);
    }
  };

  const selectedCategory = async () => {
    try {
      const data = await fetchCategoryDetails(selectedProduct.categoryID);
      console.log(data.id);
      setCategory(data.id);
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  };

  const selectedBrand = async () => {
    try {
      const data = await getBrandDetails(selectedProduct.brandId);
      console.log(data);
      setBrand(data.id);
    } catch (error) {
      console.error("Failed to fetch brand", error);
    }
  };

  console.log(brand);

  useEffect(() => {
    if (selectedProduct) {
      selectedSport();
      selectedCategory();
      selectedBrand();
    }
  }, [selectedProduct]);

  const [formData, setFormData] = useState({
    categoryId: "",
    brandId: "",
    sportId: "",
    productCode: "",
    mainImage: null,
    productImages: [],
    quantity: 0,
    productName: "",
    listedPrice: 0,
    price: 0,
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

  // Update formData when category, brand, or sport changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category,
      brandId: brand,
      sportId: sport,
    }));
  }, [category, brand, sport]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageUpload = (e) => {
    if (isFromSearch) return;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductImagesUpload = (e) => {
    if (isFromSearch) return;
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductImagesPreview((prev) => [...prev, ...previews]);
    console.log(previews);

    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: null }));
    setMainImagePreview(null);
  };

  const removeProductImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
    setProductImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Create a new FormData object for submission
    const formDataToSend = new FormData();
    formDataToSend.append("CategoryId", formData.categoryId);
    formDataToSend.append("BrandId", formData.brandId);
    formDataToSend.append("SportId", formData.sportId);
    formDataToSend.append("ProductCode", formData.productCode);

    // Attach main image
    if (formData.mainImage) {
      formDataToSend.append("MainImage", formData.mainImage);
    }

    // Attach product images
    formData.productImages.forEach((image, index) => {
      formDataToSend.append(`ProductImages`, image);
    });

    // Add remaining fields
    Object.keys(formData).forEach((key) => {
      if (
        key !== "mainImage" &&
        key !== "productImages" &&
        formData[key] !== undefined
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });

    setIsLoading(true); // Show loading modal

    try {
      const response = await fetch(
        "https://capstone-project-703387227873.asia-southeast1.run.app/api/Product/import-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("Nhập kho thành công!");
        setFormData({
          categoryId: "",
          brandId: "",
          sportId: "",
          productCode: "",
          mainImage: null,
          productImages: [],
          quantity: 0,
          productName: "",
          listedPrice: 0,
          price: 0,
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
        setMainImagePreview(null);
        setProductImagesPreview([]);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast.error("Nhập kho thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Xảy ra sự cố.");
    } finally {
      setIsLoading(false); // Hide loading modal
    }
  };
  useEffect(() => {
    if (selectedProduct) {
      console.log(selectedProduct.id);

      getProductImages(selectedProduct.id);
      console.log(productImagesPreview);

      setFormData((prev) => ({
        ...prev,
        categoryId: selectedProduct.categoryID || "",
        brandId: selectedProduct.brandId || "",
        sportId: selectedProduct.sportId || "",
        productCode: selectedProduct.productCode || "",
        productName: selectedProduct.productName || "",
        listedPrice: selectedProduct.listedPrice || "",
        price: selectedProduct.price || "",
        size: selectedProduct.size || "",
        color: selectedProduct.color || "",
        condition: selectedProduct.condition || 0,
        height: selectedProduct.height || 0,
        length: selectedProduct.length || 0,
        width: selectedProduct.width || 0,
        weight: selectedProduct.weight || 0,
      }));

      // Set image previews if needed
      setMainImagePreview(selectedProduct.imgAvatarPath || null);
      setProductImagesPreview(selectedProduct.listImages?.$values || []);
    }
  }, [selectedProduct]);

  const getProductImages = async (productId) => {
    try {
      const data = await getAllImagesVideosByProductId(productId);
      console.log(data);

      // Extract imageUrl and set them to productImagesPreview
      const imageUrls = data.map((item) => item.imageUrl);
      setProductImagesPreview(imageUrls);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelectProduct = (product) => {
    setMainImagePreview(null);
    setProductImagesPreview([]);
  
    setSelectedProduct(product);
    setIsFromSearch(true);
    setMainImagePreview(product.imgAvatarPath || null);
    setProductImagesPreview(product.listImages?.$values || []);
  };
  
  const handleClearSelectedProduct = () => {
    setSelectedProduct(null);
    setIsFromSearch(false);
    setMainImagePreview(null);
    setProductImagesPreview([]);
  };

  const handleResetForm = () => {
    setFormData({
      categoryId: "",
      brandId: "",
      sportId: "",
      productCode: "",
      mainImage: null,
      productImages: [],
      quantity: 0,
      productName: "",
      listedPrice: 0,
      price: 0,
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
    setMainImagePreview(null);
    setProductImagesPreview([]);
    setSelectedProduct(null);
    setIsFromSearch(false);
    setIsImportDirectly(false);
  };
  
  

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Nhập kho từ file Excel
        </h3>
        <button
          onClick={() => setIsImportExcel(!isImportExcel)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500 transition-colors"
        >
          Nhập kho từ file Excel
        </button>
        {isImportExcel && (
          <div className="mt-4 space-y-4">
            <ImportFileExcel />
            <TemplateFile />
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Nhập kho trực tiếp
        </h3>
        <button
          onClick={() => setIsImportDirectly(!isImportDirectly)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Nhập kho trực tiếp
        </button>
        {isImportDirectly && (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 space-y-4">
                <SearchBar onSelect={handleSelectProduct} />
                {selectedProduct && (
    <button
      onClick={handleClearSelectedProduct}
      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Hủy chọn sản phẩm
    </button>
  )}
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Product Information */}
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="productName"
                      >
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <CategorySelect
                          category={category}
                          setCategory={setCategory}
                        />
                      </div>
                      <div>
                        <BrandSelect brand={brand} setBrand={setBrand} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <SportSelect sport={sport} setSport={setSport} />

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="productCode"
                        >
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
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="quantity"
                        >
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
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="price"
                        >
                          Giá bán
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="size"
                        >
                          Size
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
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="color"
                        >
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
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="condition"
                        >
                          Tình trạng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="condition"
                            name="condition"
                            type="number"
                            value={formData.condition}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="height"
                        >
                          Chiều cao
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="height"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="length"
                        >
                          Chiều dài
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="length"
                            name="length"
                            type="number"
                            value={formData.length}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="width"
                        >
                          Chiều rộng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="width"
                            name="width"
                            type="number"
                            value={formData.width}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            mm
                          </span>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          htmlFor="weight"
                        >
                          Khối lượng
                        </label>
                        <div className="relative">
                          <input
                            className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            id="weight"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleInputChange}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            g
                          </span>
                        </div>
                      </div>
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
                            {!isFromSearch && (
                              <button
                                type="button"
                                onClick={removeMainImage}
                                className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className="h-4 w-4"
                                />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1 text-center">
                            {!isFromSearch ? (
                              <>
                                <FontAwesomeIcon
                                  icon={faCloudUploadAlt}
                                  className="mx-auto h-12 w-12 text-gray-400"
                                />
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="main-image-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                  >
                                    <span>Tải ảnh lên</span>
                                    <input
                                      id="main-image-upload"
                                      name="main-image-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleMainImageUpload}
                                    />
                                  </label>
                                  <p className="pl-1">hoặc kéo và thả</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF
                                </p>
                              </>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                Không thể chỉnh sửa ảnh với sản phẩm từ tìm
                                kiếm.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đăng ảnh sản phẩm
                      </label>
                      <div className="mt-1 flex items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative h-40">
                        {/* Nếu không có ảnh nào */}
                        {productImagesPreview.length === 0 ? (
                          <div className="flex flex-col items-center justify-center flex-grow text-center">
                            {!isFromSearch ? (
                              <>
                                <FontAwesomeIcon
                                  icon={faCloudUploadAlt}
                                  className="h-12 w-12 text-gray-400 mb-2"
                                />
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="gallery-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                  >
                                    <span>Tải ảnh</span>
                                    <input
                                      id="gallery-upload"
                                      name="gallery-upload"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                      onChange={handleProductImagesUpload}
                                    />
                                  </label>
                                  <p className="pl-1">hoặc kéo và thả</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF
                                </p>
                              </>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                Không thể chỉnh sửa ảnh với sản phẩm từ tìm
                                kiếm.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            {/* Hiển thị các ảnh đã tải lên */}
                            <div className="flex-grow">
                              <div className="flex gap-2 overflow-x-auto">
                                {productImagesPreview.map((img, index) => (
                                  <div
                                    key={index}
                                    className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden"
                                  >
                                    <img
                                      src={img}
                                      alt={`Product ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                    {!isFromSearch && (
                                      <button
                                        type="button"
                                        className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                                        onClick={() =>
                                          removeProductImage(index)
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faTimes}
                                          className="h-4 w-4"
                                        />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Nút thêm ảnh */}
                            {!isFromSearch && (
                              <label
                                htmlFor="gallery-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ml-4"
                              >
                                <span>Thêm ảnh</span>
                                <input
                                  id="gallery-upload"
                                  name="gallery-upload"
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  onChange={handleProductImagesUpload}
                                />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                <button
    type="button"
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    onClick={handleResetForm}
  >
    Hủy bỏ
  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus:ring-blue-500"
                  >
                    Nhập
                  </button>
                  {/* Loading Modal */}
                  {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-md shadow-lg">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        <p className="text-gray-700 text-lg">Đang xử lý...</p>
                      </div>
                    </div>
                  )}

                  {/* Toast notifications */}
                  <ToastContainer />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportProduct;
