import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getAllImagesVideosByProductId } from "../../services/imageVideosService";
import { SportSelect } from "../Product/SportSelect";
import { fetchSportDetails } from "../../services/sportService";
import { fetchCategoryDetails } from "../../services/categoryService";
import { getBrandDetails } from "../../services/brandService";
import { CategorySelect } from "../Product/CategorySelect";
import { BrandSelect } from "../Product/BrandSelect";
import { toast } from "react-toastify";

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState(0);
  const [rentPrice, setRentPrice] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [weight, setWeight] = useState(0);
  const [isRent, setIsRent] = useState(false);
  const [productMainImage, setProductMainImage] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [category, setCategory] = useState(0);
  const [brand, setBrand] = useState(0);
  const [sport, setSport] = useState(0);
  const [loading, setLoading] = useState(false);

  const removeMainImage = () => {
    // setFormData((prev) => ({ ...prev, mainImage: null }));
    setProductMainImage(null);
  };

  const removeProductImage = (index) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   productImages: prev.productImages.filter((_, i) => i !== index),
    // }));
    setProductImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setFormData((prev) => ({ ...prev, mainImage: file }));
      setProductMainImage(file);
    }
  };

  const handleProductImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductImages((prev) => [...prev, ...files]);
    console.log(files);

    // setFormData((prev) => ({
    //   ...prev,
    //   productImages: [...prev.productImages, ...files],
    // }));
  };

  const validateProduct = () => {
    const errors = [];

    if (!productName.trim()) errors.push("Product name is required.");
    if (!productCode.trim()) errors.push("Product code is required.");
    if (price <= 0) errors.push("Price must be greater than 0.");
    if (rentPrice <= 0) errors.push("Rent Price must be greater than 0.");
    if (!color.trim()) errors.push("Color is required.");
    if (!size.trim()) errors.push("Size is required.");
    if (condition <= 0) errors.push("Condition must be a positive number.");
    if (height <= 0) errors.push("Height must be greater than 0.");
    if (length <= 0) errors.push("Length must be greater than 0.");
    if (width <= 0) errors.push("Width must be greater than 0.");
    if (weight <= 0) errors.push("Weight must be greater than 0.");
    if (sport <= 0) errors.push("SportId must be greater than 0.");
    if (category <= 0) errors.push("CategoryId must be greater than 0.");
    if (brand <= 0) errors.push("BrandId must be greater than 0.");
    if (!productMainImage) errors.push("Main product image is required.");
    if (productImages.length === 0) errors.push("At least one product image is required.");

    if (errors.length > 0) {
      alert("Validation Errors:\n" + errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateProduct()) return;

    setLoading(true); // Show loading screen

    const payload = {
      productName: productName.trim(),
      productCode: productCode.trim(),
      price: parseFloat(price),
      rentPrice: parseFloat(rentPrice),
      color: color.trim(),
      size: size.trim(),
      condition: parseInt(condition, 10),
      height: parseFloat(height),
      length: parseFloat(length),
      width: parseFloat(width),
      weight: parseFloat(weight),
      sport: sport,
      category: category,
      brand: brand,
      isRent,
    };

    // Add main image to payload
    if (productMainImage instanceof File) {
      payload.mainImage = productMainImage;
    }

    // Add product images to payload
    payload.productImages = productImages.map((image) => {
      return image.file instanceof File ? image.file : image; // Add files or keep existing URLs
    });

    try {
      console.log(payload);
      await onAddProduct(payload);
      onClose(); // Close the modal on success
    } catch (error) {
      toast.error("Thêm sản phẩm thất bại. Vui lòng thử lại!", error); // Handle error
      console.log(error);

    } finally {
      setLoading(false); // Hide loading screen
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
            <span className="text-white ml-4">Đang xử lý...</span>
          </div>
        )}
        <div className="p-6 bg-white rounded shadow-lg h-screen overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Chỉnh Sửa Sản Phẩm</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="flex">
            <div className="mr-2 mt-4 w-1/2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Tên Sản Phẩm
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
            <div className="ml-2 mt-4 w-1/2">
              <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">
                Mã Sản Phẩm
              </label>
              <input
                type="text"
                id="productCode"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex">
            <div className="mr-2 w-1/3 mt-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Giá Bán
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full mt-2 border rounded px-3 py-2"
                />
                <span className="absolute inset-y-0 right-8 flex items-center text-gray-500">
                  ₫
                </span>
              </div>
            </div>
            <div className="w-1/3 mx-2 mt-4">
              <label htmlFor="isRent" className="block text-sm font-medium text-gray-700">
                Có Cho Thuê
              </label>
              <input
                type="checkbox"
                id="isRent"
                checked={isRent}
                onChange={(e) => setIsRent(e.target.checked)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
            <div className="ml-2 w-1/3 mt-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Giá Thuê
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="rentPrice"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(parseFloat(e.target.value) || 0)}
                  disabled={!isRent} // Disable when not in edit mode or when isRent is false
                  className={`w-full mt-2 border rounded px-3 py-2 ${(!isRent) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                <span className="absolute inset-y-0 right-8 flex items-center text-gray-500">
                  ₫
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 w-1/3 mt-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Màu Sắc
              </label>
              <input
                type="text"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
            <div className="mx-2 w-1/3 mt-4">
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
            <div className="ml-2 w-1/3 mt-4">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                Tình Trạng
              </label>
              <input
                type="number"
                id="condition"
                value={condition}
                onChange={(e) => setCondition(parseInt(e.target.value, 10) || 0)}
                className="w-full mt-2 border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-1/4 mr-2 mt-4">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Chiều Cao
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full mt-2 border rounded px-3 py-2"
                />
                <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                  mm
                </span>
              </div>
            </div>
            <div className="w-1/4 mx-2 mt-4">
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Chiều Dài
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="length"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full mt-2 border rounded px-3 py-2"
                />
                <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                  mm
                </span>
              </div>

            </div>
            <div className="w-1/4 mx-2 mt-4">
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                Chiều Rộng
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="width"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  className="w-full mt-2 border rounded px-3 py-2"
                />
                <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                  mm
                </span>
              </div>

            </div>
            <div className="w-1/4 ml-2 mt-4">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Trọng Lượng
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full mt-2 border rounded px-3 py-2"
                />
                <span className="absolute inset-y-0 right-7 flex items-center text-gray-500">
                  g
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/3 mr-2 mt-4">
              <SportSelect
                isEdit={true}
                sport={sport}
                setSport={setSport}
              />
            </div>
            <div className="w-1/3 mx-2 mt-4">
              <CategorySelect
                isEdit={true}
                category={category}
                setCategory={setCategory}
              />
            </div>
            <div className="w-1/3 mx-2 mt-4">

              <BrandSelect
                isEdit={true}
                brand={brand}
                setBrand={setBrand}
              />
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 mt-4 w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh sản phẩm đại diện
              </label>
              <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md">
                {productMainImage ? (
                  <div className="relative">
                    <img
                      src={productMainImage instanceof File ? URL.createObjectURL(productMainImage) : productMainImage}
                      alt="Main product"
                      className="max-h-32 rounded-md"
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
                  </div>
                )}
              </div>
            </div>

            <div className="ml-2 mt-4 w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đăng ảnh sản phẩm
              </label>
              <div className="mt-1 flex items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative h-40">
                {productImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-grow text-center">
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
                    <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-grow">
                      <div className="flex gap-2 overflow-x-auto">
                        {productImages.map((img, index) => (
                          <div
                            key={index}
                            className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden"
                          >
                            <img
                              src={img instanceof File ? URL.createObjectURL(img) : img}
                              alt={`Product ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                              onClick={() => removeProductImage(index)}
                            >
                              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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
                  </div>
                )}
              </div>

            </div>
          </div>



          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faSave} className="mr-1" />
              Thêm
            </button>

          </div>

        </div>
      </div>
    </Dialog>
  );
};

export default AddProductModal;
