import React, { useState, useEffect } from "react";
import { fetchAllFolders } from "../../services/Manager/imageManagementService";
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddFolderModal from "../../components/Admin/AddFolderModal";
import { useNavigate } from "react-router-dom";

const ManageImageFolder = () => {
    const [folders, setFolders] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                setIsLoading(true);
                const folderData = await fetchAllFolders();

                // Transform the array of folder names into an array of objects
                const transformedFolders = folderData.map((folderName, index) => ({
                    id: index, // Generate a unique ID using the index
                    name: folderName, // Use the folder name from the API
                    image: "/assets/images/default-folder.jpg", // Correct path to the image
                }));

                setFolders(transformedFolders);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching folders:", error);
                setIsLoading(false);
            }
        };

        fetchFolders();
    }, [isReload]);

    const handleSelectFolder = (folder) => {
        console.log("Selected folder:", folder);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Danh sách thư mục</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />{" "}
                    Tạo thư mục
                </Button>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <p>Đang tải danh sách thư mục...</p>
            ) : folders.length === 0 ? (
                <p>Không có thư mục nào tồn tại.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className="flex flex-col items-center justify-center p-4 bg-gray-100 shadow-md rounded-lg hover:shadow-lg transition cursor-pointer"
                            onClick={() => navigate(`/manager/manage-image-folder/${folder.name}`)}
                        >
                            {/* Folder Image */}
                            <div className="w-24 h-24 mb-2">
                                <img
                                    src={folder.image} // Correct image path
                                    alt={folder.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            {/* Folder Name */}
                            <p className="text-sm font-medium text-gray-700 text-center">
                                {folder.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Folder Modal */}
            {isAddModalOpen && (
                <AddFolderModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    setIsReload={setIsReload}
                />
            )}
        </div>

    );
};

export default ManageImageFolder;
