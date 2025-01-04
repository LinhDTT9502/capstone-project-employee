import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SearchBar from '../../components/Admin/SearchBar';
import { CategorySelect } from '../../components/Product/CategorySelect';
import { fetchCategoryDetails } from '../../services/categoryService';
import { toast } from 'react-toastify';
import { filterProductsByCategory } from '../../services/productService';

const EditOffer = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEditorContent(product.offers || ""); // Set initial content in the editor
  };

  const setEditContent = async () => {
    const productByCategoryId = (await filterProductsByCategory(category))[0]

    if (productByCategoryId) {
      setEditorContent(productByCategoryId.offers);
    } else {
      setEditorContent("");
    }
  };

  useEffect(() => {
    setEditContent();
  }, [category])


  const handleSaveDescription = async () => {
    if (!category) return;

    const description = editorContent; // Get content from the editor

    try {
      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/Product/edit-offers-of-product/${category}?offers=${encodeURIComponent(description)}`,
        {
          method: 'PUT',
          headers: {
            'Accept': '*/*',
          },
        }
      );

      if (response.ok) {
        toast.success("Chỉnh sửa ưu đãi thành công!");
      } else {
        toast.error("Chỉnh sửa ưu đãi thất bại!");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Chỉnh sửa ưu đãi thất bại!");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className='bg-white border border-gray-300 shadow-md rounded-lg p-6'>
        <h2 className="text-lg font-medium text-gray-700 mb-2">Chỉnh sửa ưu đãi</h2>
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          <CategorySelect
            isEdit={true}
            category={category}
            setCategory={setCategory}
          />
        </div>
        {/* Add TinyMCE Editor */}
        {category && (
          <div className="mt-4">
            <Editor
              apiKey="u74lje0qicu4h6bnpu49iv1jx1p4e5gcx647nobevxo6kbmn" // Optional: if you're using TinyMCE Cloud
              value={editorContent}
              onEditorChange={(content, editor) => {
                setEditorContent(content); // Update editor content on change
              }}
              init={{
                height: 500,
                menubar: false,
                plugins: 'link image code',
                toolbar: 'undo redo | bold italic | link image | code',
              }}
            />
          </div>
        )}

        {/* Save button */}
        {category && (
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
