import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
} from "../../api/Blog/apiBlog";
import { useRef } from 'react';
import axios from "axios";
import BlogActions from "../../components/Admin/BlogActions";
import ConfirmDeleteBlogModal from "../../components/Admin/ConfirmDeleteBlogModal";
import ChangeBlogStatusButton from "../../components/Admin/ChangeBlogStatusButton";
import { Button, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState([]);
  const [isConfirmDeleteBlogModalOpen, setIsConfirmDeleteBlogModalOpen] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlog();
        setBlogs(response.data.data.$values);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs.");
      }
    };
    setIsReload(false);
    fetchBlogs();
  }, [isReload]);

console.log(blogs);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-full">
      <div className="flex-grow border-l-2">
        <div className="container p-4 mx-auto">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" className="p-4 text-center">
              Danh sách <span className="text-orange-500">[Bài viết]</span> ({blogs.length})
            </Typography>
            <Button
              onClick={() => navigate(`/content-staff/create-blog`)}
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
              Tạo mới
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Ảnh bìa
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Tiêu đề phụ
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.$id} className="border-b">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {blog.blogId}
                    </td>
                    <td className="px-6 py-4">
                      {blog.coverImgPath && (
                        <img
                          src={blog.coverImgPath}
                          alt={blog.title}
                          className="object-contain w-56 rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {blog.subTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div
                        className="prose-sm prose line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(blog.createAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <ChangeBlogStatusButton
                        blog={blog}
                        isActive={blog.status}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <BlogActions
                        blog={blog}
                        onEdit={() => navigate(`/content-staff/update-blog/${blog.blogId}`)}
                        onDelete={() => {
                          setSelectedBlog(blog);
                          setIsConfirmDeleteBlogModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
                    }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Blog Modal */}
      {isConfirmDeleteBlogModalOpen && selectedBlog && (
        <ConfirmDeleteBlogModal
          isOpen={isConfirmDeleteBlogModalOpen}
          onClose={() => setIsConfirmDeleteBlogModalOpen(false)}
          blog={selectedBlog}
          setIsReload={setIsReload}
        />
      )}
    </div>
  );
};

export default Blogs;
