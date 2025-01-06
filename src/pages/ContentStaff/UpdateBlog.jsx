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
const UpdateBlog = (selectedBlog) => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const user = useSelector(selectUser);
  const [viewImg, setViewImg] = useState('');
  const [images, setImages] = useState([]); // Image list
  const [isOpen, setIsOpen] = useState(false); // Modal visibility
  const [callback, setCallback] = useState(null); // File picker callback
  const [selectedImage, setSelectedImage] = useState(''); // Selected image URL
  const editorRef = useRef(null);

  // Fetch images when opening the modal
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        'https://capstone-project-703387227873.asia-southeast1.run.app/api/Blog/list-images'
      );
      const fetchedImages = response.data.$values || [];
      console.log("API Response:", fetchedImages);

      // Defensive filtering: Ensure all URLs are valid strings
      const validImages = fetchedImages.filter((url) => typeof url === 'string' && url.trim() !== '');
      setImages(validImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const openModal = (cb) => {
    fetchImages();
    setCallback(cb);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (callback && selectedImage) {
      console.log("Inserting Image:", selectedImage);
      callback(selectedImage, { alt: 'Selected Image' });
    }
    setIsOpen(false);
    setSelectedImage('');
  };

  const selectImage = (url) => {
    console.log("Selected Image:", url);
    setSelectedImage(url);
  };

  // Image upload handler
  const handleFileUpload = async (blobInfo) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());

    try {
      const response = await axios.post(
        'https://capstone-project-703387227873.asia-southeast1.run.app/api/Blog/upload-an-image',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

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
    console.log(blog);

    if (blog) {
      setBlogId(id);
      setTitle(blog.title);
      setSubTitle(blog.subTitle);
      setContent(blog.content);
      setViewImg(blog.coverImgPath);

      setCoverImage(null);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-grow border-l-2">
        <div className="container p-4 mx-auto">
          <h1 className="mb-4 text-2xl font-bold">
            {blogId ? "Chỉnh sửa bài viết" : "Tạo một bài viết"}
          </h1>{viewImg && <img src={viewImg} alt="view" className="w-20 h-20 object-contain" />}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col">
              Chọn ảnh bìa
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="form-file-input"
              />
            </div>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tiêu đề phụ"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Editor
              apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn"
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 600,
                menubar: true,
                language_url: '/src/sources/vi/langs/vi.js',
                language: 'vi',
                plugins: 'image code',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image | code',
                content_style: `
              body { font-family:Helvetica,Arial,sans-serif; font-size:16px }
              .myclass { border: 0.1rem solid green; border-radius: 0.8rem; padding: 0.2rem; }
              .non-editable { border-color: red; }
              `,
                noneditable_class: 'non-editable',
                images_upload_handler: handleFileUpload,
                // file_picker_callback: (cb, value, meta) => {
                //   if (meta.filetype === 'image') {
                //     cb('myimage.jpg', { alt: 'My alt text' });
                //   }
                // },
                file_picker_callback: (cb, value, meta) => {
                  if (meta.filetype === 'image') {
                    // Step 1: Fetch the images from API
                    fetch('https://capstone-project-703387227873.asia-southeast1.run.app/api/Blog/list-images') // Replace with your API URL
                      .then((response) => response.json())
                      .then((data) => {
                        // Assuming API returns an array of image URLs
                        const images = data.$values;
                        console.log(images);

                        // Step 2: Open a modal or create a simple UI
                        let modalContent = '<div style="display: flex; flex-wrap: wrap;">';
                        images.forEach((imageUrl) => {
                          modalContent += `
                                  <img src="${imageUrl}" 
                                       alt="Image" 
                                       style="width: 100px; height: 100px; margin: 10px; cursor: pointer;" 
                                       onclick="selectImage('${imageUrl}')" />
                                `;
                        });
                        modalContent += '</div>';

                        // Create a modal dynamically
                        const modal = document.createElement('div');
                        modal.id = 'image-modal';
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        modal.style.display = 'flex';
                        modal.style.justifyContent = 'center';
                        modal.style.alignItems = 'center';
                        modal.style.zIndex = '9999';
                        modal.innerHTML = `
                                <div style="background: white; padding: 20px; border-radius: 8px; max-width: 80%; overflow-y: auto;">
                                  <h3>Chọn ảnh</h3>
                                  ${modalContent}
                                  <button onclick="closeModal()" style="margin-top: 20px;">Đóng</button>
                                </div>
                              `;
                        document.body.appendChild(modal);

                        // Step 3: Define selection logic
                        window.selectImage = (url) => {
                          cb(url, { alt: 'Selected Image' });
                          closeModal();
                        };

                        // Close modal function
                        window.closeModal = () => {
                          document.body.removeChild(modal);
                        };
                      })
                      .catch((error) => {
                        console.error('Error fetching images:', error);
                      });
                  }
                },
              }}
            // initialValue={`
            //   <h3 class="non-editable">Tiêu đề</h3>
            //   <div class="myclass editable">Nhập tiêu đề</div>
            //   <hr>
            //   <div class="myclass editable">Nhập phụ đề</div>

            //   <hr>

            //   &nbsp;

            // `}
            />

            <button
              type="submit"
              className="p-3 text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {blogId ? "Lưu bài viết" : "Tạo bài viết"}
            </button>
          </form>

          <h2 className="mb-2 text-xl font-semibold">Danh sách bài viết</h2>
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
  );
};

export default UpdateBlog;