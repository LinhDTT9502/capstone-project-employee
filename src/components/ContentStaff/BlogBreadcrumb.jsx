import React from "react";
import { Link, useParams } from "react-router-dom";

const BlogBreadcrumb = () => {
    const { folderName } = useParams(); // Dynamic folder name from URL params

    return (
        <nav className="flex items-center space-x-2 text-gray-600">
            {/* Intermediate Folder (e.g., Seb) */}
            <Link to="/manager/manage-image-folder" className="text-blue-500 hover:underline">
                Thư mục ảnh
            </Link>
            <span className="text-gray-400">›</span>

            {/* Current Folder */}
            <span className="font-semibold text-gray-800">{folderName}</span>
        </nav>
    );
};

export default BlogBreadcrumb;
