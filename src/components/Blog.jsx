import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckeditor5/ckeditor5.css";
import HeaderStaff from "../layouts/HeaderStaff";
import SidebarStaff from "../layouts/SidebarStaff";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
} from "../api/Blog/apiBlog";

const Blog = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const user = useSelector(selectUser);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlog();
        setBlogs(response.data.data.$values);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        alert("Failed to fetch blogs.");
      }
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in the title and content!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("content", content);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      if (blogId) {
        await updateBlog(blogId, formData);
        alert("Blog updated successfully.");
      } else {
        await createBlog(formData);
        alert("Blog created successfully.");
      }

      // Reset fields and fetch updated blogs
      setTitle("");
      setSubTitle("");
      setContent("");
      setCoverImage(null);
      setBlogId(null);
      const updatedBlogs = await getAllBlog();
      setBlogs(updatedBlogs.data.data.$values);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save the blog.");
    }
  };

  const handleDeleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteBlog(id);
      alert("Blog deleted successfully.");
      setBlogs(blogs.filter((blog) => blog.blogId !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog.");
    }
  };

  const handleEdit = (id) => {
    const blog = blogs.find((blog) => blog.blogId === id);
    if (blog) {
      setBlogId(id);
      setTitle(blog.title);
      setSubTitle(blog.subTitle);
      setContent(blog.content);
      setCoverImage(null);
    }
  };


  return (
    <>

      <div className="flex h-full">

        <div className="flex-grow border-l-2">
          <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">
              {blogId ? "Edit Blog" : "Create a New Blog"}
            </h1>
            <form onSubmit={handleSubmit} className="mb-6">
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => setContent(editor.getData())}
                config={{
                  height: '500px', // Adjust the height as needed
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="form-file-input"
              />
              <button
                type="submit"
                className="p-3 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {blogId ? "Update Blog" : "Publish Blog"}
              </button>
            </form>

            <h2 className="mb-2 text-xl font-semibold">My Blogs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Blog ID
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Cover Image
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Title
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Subtitle
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Content
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">
                      Actions
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
                            className="object-cover w-20 h-20 rounded-md"
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
                          className="prose-sm prose"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(blog.createAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(blog.blogId)}
                            className="px-4 py-2 text-white transition duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.blogId)}
                            className="px-4 py-2 text-white transition duration-200 bg-red-500 rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
