import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SearchBar from '../../components/Admin/SearchBar';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEditorContent(product.description || ""); // Set initial content in the editor
  };

  const handleSaveDescription = async () => {
    if (!selectedProduct) return;

    const productCode = selectedProduct.productCode;
    const description = editorContent; // Get content from the editor

    try {
      const response = await fetch(
        `https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Product/edit-description-of-product/${productCode}?description=${encodeURIComponent(description)}`,
        {
          method: 'PUT',
          headers: {
            'Accept': '*/*',
          },
        }
      );

      if (response.ok) {
        toast.success("chỉnh sửa mô tả thành công!");
      } else {
        toast.error("Chỉnh sửa mô tả thất bại!");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("An error occurred while updating the description.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className='bg-white border border-gray-300 shadow-md rounded-lg p-6'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Mô tả sản phẩm</h3>
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          <SearchBar onSelect={handleSelectProduct} />
        </div>

        {/* Add TinyMCE Editor */}
        {selectedProduct && (
          <div className="mt-6">
            <Editor
              apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn" // Optional: if you're using TinyMCE Cloud
              value={editorContent}
              onEditorChange={(content, editor) => {
                setEditorContent(content); // Update editor content on change
              }}
              init={{
                height: 1000,
                menubar: false,
                plugins: 'link image code',
                toolbar: 'undo redo | bold italic | link image | code',
              }}
            />
          </div>
        )}

        {/* Save button */}
        {selectedProduct && (
          <div className="mt-4">
            <button
              onClick={handleSaveDescription}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
