import React, { useEffect, useState } from 'react';
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { createBranch } from '../../api/apiBranch';

const AddBranchModal = ({ isOpen, onClose, onAddBranch }) => {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [hotline, setHotline] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!branchName.trim() || !location.trim() || !hotline.trim() || !uploadFile) {
      setErrors({
        branchName: !branchName.trim() ? "Tên chi nhánh là bắt buộc." : "",
        location: !location.trim() ? "Địa điểm là bắt buộc." : "",
        hotline: !hotline.trim() ? "Hotline là bắt buộc." : "",
        branchImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("BranchName", branchName.trim()); 
    formData.append("Location", location.trim());
    formData.append("Hotline", hotline.trim());
    formData.append("ImageURL", uploadFile);
 
    const response = await createBranch(formData);
    console.log(response)
    if(response != null ){
      setBranchName("");
      setLocation("");
      setHotline("");
      setUploadFile(null);
      setErrors({});

    }
  };
  useEffect(() => {
  }, [isOpen, onClose]);
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Chi Nhánh</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
            Tên Chi Nhánh
          </label>
          <input
            type="text"
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.branchName && <p className="text-sm text-red-500">{errors.branchName}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Địa Điểm
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">
            Hotline
          </label>
          <input
            type="text"
            id="hotline"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.hotline && <p className="text-sm text-red-500">{errors.hotline}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.branchImage && <p className="text-sm text-red-500">{errors.branchImage}</p>}
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Thêm
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddBranchModal;