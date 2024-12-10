import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const RichTextEditor = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  console.log(images);

  // Fetch images from API and cache them
  const fetchImages = async () => {
    if (images.length > 0) return; // Avoid fetching if images are already loaded
    try {
      const response = await axios.get(
        'https://capstone-project-703387227873.asia-southeast1.run.app/api/ImageVideo/get-all-images-in-text-editor'
      );
      setImages(response.data?.$values || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openModal = (cb) => {
    fetchImages();
    setCallback(cb); // Store the callback for selecting the image
    setIsOpen(true);
  };

  const closeModal = () => {
    if (callback && typeof callback === 'function') {
      callback(selectedImage); // Call the callback only if it's a valid function
    }
    setIsOpen(false);
  };
  

  const selectImage = (url) => {
  
      setSelectedImage(url);

  };

  // Handle image uploads
  const handleFileUpload = async (blobInfo, progress) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());

    try {
      const response = await axios.post(
        'https://capstone-project-703387227873.asia-southeast1.run.app/api/ImageVideo/upload-image-in-text-editor',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      const imageUrl = response.data?.$values?.[0] || '';

      if (typeof imageUrl === 'string') {
        return imageUrl; // Return the image URL as a string
      } else {
        throw new Error('Invalid image URL');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  return (
    <>
      <Editor
        apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn"
        init={{
          height: 500,
          menubar: false,
          plugins: 'image code',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image | code',
          images_upload_handler: handleFileUpload,
          file_picker_callback: (callback, value, meta) => {
            console.log(selectedImage);
            
           if (meta.filetype == 'file') {
      callback('mypage.html', { text: 'My text' });
    }

    // Provide image and alt text for the image dialog
    if (meta.filetype == 'image') {
      callback('myimage.jpg', { alt: 'My alt text' });
    }

    // Provide alternative source and posted for the media dialog
    if (meta.filetype == 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
    }
          },    
        }}
      />
      <Button onClick={() => openModal(null)} variant="gradient">
        Open Modal
      </Button>

      <Dialog open={isOpen} handler={closeModal}>
        <DialogHeader>Select an Image</DialogHeader>
        <DialogBody className='max-h-[70vh] overflow-y-auto'>
          {/* Show selected image if available */}
          {selectedImage && (
            <div className="mb-4">
              <img src={selectedImage} alt="Selected" className="w-48 h-auto object-contain" />
            </div>
          )}
          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4 p-4">
            {images.map((image, index) => (
              <div key={index} className="p-2">
                <img
                  src={image}
                  alt={`Image ${index}`}
                  className="w-44 h-auto cursor-pointer"
                  onClick={() => selectImage(image)} // Select image when clicked
                />
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeModal} className="mr-1">
            Close
          </Button>
          <Button variant="gradient" color="green" onClick={closeModal}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default RichTextEditor;
