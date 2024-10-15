// src/Blog.js
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'ckeditor5/ckeditor5.css';
import UploadAdapter from './UploadAdapter';

const Blog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogs, setBlogs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      setBlogs([...blogs, { title, content }]);
      setTitle('');
      setContent('');
    }
  };

  const MyCustomUploadAdapterPlugin = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <CKEditor
  editor={ClassicEditor}
  data={content}
  onChange={(event, editor) => {
    const data = editor.getData();
    setContent(data);
  }}
  className="border mb-4"
/>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Publish Blog
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">My Blogs</h2>
      <ul>
        {blogs.map((blog, index) => (
          <li key={index} className="border p-4 mb-2">
            <h3 className="font-bold">{blog.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;