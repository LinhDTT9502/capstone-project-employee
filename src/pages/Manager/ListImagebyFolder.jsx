import { useState, useEffect } from "react";
import { fetchAllImagesInFolder } from "../../services/Manager/imageManagementService";
import { useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddImageModal from "../../components/Admin/AddImageModal";
import ConfirmDeleteImageModal from "../../components/Admin/ConfirmDeleteImageModal";

const ListImagebyFolder = () => {
    const { folderName } = useParams(); // Get folderName from URL params
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmDeleteImage, setIsConfirmDeleteImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
                const imageData = await fetchAllImagesInFolder(folderName);
                setImages(imageData); // Assuming the response is an array of image objects
                console.log(imageData);

                setIsLoading(false);
            } catch (error) {
                toast.error("Error fetching images", { position: "top-right" });
                setIsLoading(false);
            }
        };

        fetchImages();
        setIsReload(false);
    }, [folderName, isReload]);

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Copied to clipboard!", { position: "top-right" });
        }).catch((error) => {
            toast.error("Failed to copy URL", { position: "top-right" });
        });
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Danh sách hình ảnh trong thư mục: {folderName}</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Tải lên hình ảnh
                </Button>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <p>Đang tải danh sách hình ảnh...</p>
            ) : images.length === 0 ? (
                <p>Không có hình ảnh nào trong thư mục này.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center justify-center p-4 shadow-md rounded-lg hover:bg-gray-300 shadow-lg transition cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="w-full h-full mb-2 hover:bg-gray-300">
                                <img
                                    src={image} // Assuming each image has a 'url' field
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded"
                                />
                                {/* Buttons (hidden by default and shown on hover) */}
                                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Copy URL Button */}
                                    <Button
                                        size="md"
                                        color="gray"
                                        variant="text"
                                        className="flex items-center gap-2 px-2 py-2"
                                        onClick={() => handleCopyUrl(image)}
                                    >
                                        <FontAwesomeIcon icon={faCopy} className="text-sm" />
                                    </Button>
                                    {/* Delete Button */}
                                    <Button
                                        size="md"
                                        color="red"
                                        variant="text"
                                        className="flex items-center gap-2 px-2 py-2"
                                        onClick={() => {
                                            setIsConfirmDeleteImage(image);
                                            setSelectedImage(image);
                                        }
                                        }
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            )}
            {/* Add images Modal */}
            {isAddModalOpen && (
                <AddImageModal
                    folderName={folderName}
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    setIsReload={setIsReload}
                />
            )}

            {/* Confirm Delete Image Modal */}
            {isConfirmDeleteImage && (
                <ConfirmDeleteImageModal
                    folderName={folderName}
                    isOpen={isConfirmDeleteImage}
                    onClose={() => setIsConfirmDeleteImage(false)}
                    image={selectedImage}
                    setIsReload={setIsReload}
                />
            )}
        </div>
    );
};

export default ListImagebyFolder;
