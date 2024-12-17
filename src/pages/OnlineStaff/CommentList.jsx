import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderDetailModal from './OrderDetailModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getCommentList } from '../../services/Coordinator/CommentService';
import CommentDetailModal from './CommentDetailModal';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [sortComment, setSortComment] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 30;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentList();
        // const pendingOrders = data.filter(comment => comment.branchId === null);
        setComments(data);

      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    console.log(comments);

  }, [reload]);

  const handleOpenModal = (commentId) => {
    setSelectedCommentId(commentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setReload(prev => !prev);
    setSelectedCommentId(null);
    setModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSortComment(e.target.value);
    const sortedComments = [...comments].sort((a, b) => {
      if (e.target.value === 'earliest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setComments(sortedComments);

  };

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const currentOrders = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
    </div>
  ); if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm bình luận..."
            className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:border-blue-400"
          />
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400"
            onChange={handleSortChange}
            value={sortComment}
          >
            <option value="latest">Bình luận cũ nhất</option>
            <option value="earliest">Bình luận mới nhất</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">

        <span className="text-gray-600 text-xs">
          {Math.min((currentPage - 1) * commentsPerPage + 1, comments.length)}-
          {Math.min(currentPage * commentsPerPage, comments.length)} của {comments.length} đơn hàng
        </span>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-700 hover:text-gray-700 text-xs w-5"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-700 text-xs hover:text-gray-700 w-5"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Orders Table */}
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">#</th>
            <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Nội dung</th>
            <th className="text-left p-4 font-semibold text-gray-600">Sản phẩm</th>
            <th className="text-left p-4 font-semibold text-gray-600">Ngày bình luận</th>
            <th className="text-left p-4 font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((comment, index) => (
            <tr key={comment.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-4">{(currentPage - 1) * commentsPerPage + index + 1}</td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">{comment.fullName}</span>
                  <span className="text-sm text-gray-500">{comment.email}</span>
                </div>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {comment.content}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {comment.productName}
                </span>
              </td>
              <td className="p-4">{new Date(comment.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}</td>
              <td className="p-4 space-x-4 flex">
                <button
                  onClick={() => handleOpenModal(comment.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-gray-600 hover:border-gray-400'}`}
        >
          Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'text-gray-600 hover:border-gray-400'}`}
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <CommentDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          commentId={selectedCommentId}
        />
      )}
    </div>
  );
};

export default CommentList;
