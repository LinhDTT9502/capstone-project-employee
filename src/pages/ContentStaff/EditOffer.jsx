import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SearchBar from '../../components/Admin/SearchBar';

const EditOffer = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEditorContent(product.offers || ""); // Set initial content in the editor
  };

  const handleSaveDescription = async () => {
    if (!selectedProduct) return;

    const categoryID = selectedProduct.categoryID;
    const description = editorContent; // Get content from the editor

    try {
      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/Product/edit-offers-of-product/${categoryID}?offers=${encodeURIComponent(description)}`,
        {
          method: 'PUT',
          headers: {
            'Accept': '*/*',
          },
        }
      );

      if (response.ok) {
        alert("chỉnh sửa ưu đãi thành công!");
        setEditorContent("")
      } else {
        alert("Failed to update description. Please try again.");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      alert("An error occurred while updating the description.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className='bg-white border border-gray-300 shadow-md rounded-lg p-6'>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Nhập kho trực tiếp</h3>
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          <SearchBar onSelect={handleSelectProduct} />
        </div>

        {/* Add TinyMCE Editor */}
        {selectedProduct && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Chỉnh sửa ưu đãi</h4>
            <Editor
              apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn" // Optional: if you're using TinyMCE Cloud
              value={editorContent}
              onEditorChange={(content, editor) => {
                setEditorContent(content); // Update editor content on change
              }}
              init={{
                height: 300,
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

export default EditOffer;
