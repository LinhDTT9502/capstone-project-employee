import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useRef } from 'react';

const RichTextEditor = () => {
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

  const logContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      console.log('Editor Content:', content);
    }
  };

  return (
    <>  <button
      onClick={logContent}
      style={{
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Log Editor Content
    </button>
      {/* TinyMCE Editor */}
      <Editor
        apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn"
        onInit={(evt, editor) => (editorRef.current = editor)}
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
        initialValue={`
          <h3 class="non-editable">Tiêu đề</h3>
          <div class="myclass editable">Nhập tiêu đề</div>
          <hr>
          <div class="myclass editable">Nhập phụ đề</div>
  
          <hr>
  
          &nbsp;
  
        `}
      />

    </>
  );
};

export default RichTextEditor;
