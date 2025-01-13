import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';

const RichTextEditor = () => {
  const [images, setImages] = useState([]); // List of images
  const [isOpen, setIsOpen] = useState(false); // Modal visibility
  const [callback, setCallback] = useState(null); // File picker callback
  const [selectedImage, setSelectedImage] = useState(''); // Selected image URL
  const editorRef = useRef(null);

  // Fetch images for the modal
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Blog/list-images'
      );
      const fetchedImages = response.data.$values || [];
      setImages(fetchedImages.filter((url) => typeof url === 'string' && url.trim() !== ''));
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
      callback(selectedImage, { alt: 'Selected Image' });
    }
    setIsOpen(false);
    setSelectedImage('');
  };

  const handleFileUpload = async (blobInfo) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());
    try {
      const response = await axios.post(
        'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Blog/upload-an-image',
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
      console.log('Editor Content:', editorRef.current.getContent());
    }
  };

  return (
    <div className="p-4">
      <Button onClick={logContent} className="mb-4">
        Log Editor Content
      </Button>
      <Editor
        apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn"
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          menubar: true,
          language_url: '/src/sources/vi/langs/vi.js',
          language: 'vi',
          plugins: 'image code',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image | code',
          images_upload_handler: handleFileUpload,
          file_picker_callback: (cb) => openModal(cb),
        }}
        initialValue={`<h3 class="non-editable">Tiêu đề</h3><div class="editable">Nhập tiêu đề</div>`}
      />

      <Dialog open={isOpen} handler={setIsOpen} size="xl">
        <DialogHeader>Chọn ảnh từ danh sách</DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
            {images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Available"
                className={`w-full h-24 object-cover rounded cursor-pointer ${selectedImage === url ? 'border-4 border-blue-500' : ''
                  }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
          {images.length === 0 && <p className="text-center text-gray-500 mt-4">Không có ảnh nào.</p>}
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => closeModal()} color="blue" disabled={!selectedImage}>
            Chọn ảnh
          </Button>
          <Button onClick={() => setIsOpen(false)} color="gray" className="ml-2">
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;
