import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { getCommentList } from '../../services/Coordinator/CommentService';
import CommentDetailModal from './CommentDetailModal';
import CommentActions from '../../components/Admin/CommentActions';
import ConfirmDeleteCommentModal from '../../components/Admin/ConfirmDeleteCommentModal';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCommentIds, setExpandedCommentIds] = useState([]); // Track expanded parent comments
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmDeleteCommentModalOpen, setIsConfirmDeleteCommentModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 10;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentList();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
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

  const toggleExpand = (commentId) => {
    console.log(commentId);

    setExpandedCommentIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  // const totalPages = Math.ceil(comments.filter(comment => !comment.parentCommentId).length / commentsPerPage);
  const currentParentComments = comments
    .filter(comment => !comment.parentCommentId)
    .slice(
      (currentPage - 1) * commentsPerPage,
      currentPage * commentsPerPage
    );

  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  // Pagination logic
  const indexOfLastItem = currentPage * commentsPerPage;
  const indexOfFirstItem = indexOfLastItem - commentsPerPage;
  const currentComments = currentParentComments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
  </div>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Table */}
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">#</th>
            <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
            <th className="text-left p-4 pl-10 font-semibold text-gray-600">Nội dung</th>
            <th className="text-left p-4 pl-10 font-semibold text-gray-600">Sản phẩm</th>
            <th className="text-left p-4 pl-10 font-semibold text-gray-600">Ngày bình luận</th>
            <th className="text-left p-4 font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {currentParentComments.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-orange-500 font-bold">
                Hiện tại chưa có bình luận nào
              </td>
            </tr>
          ) : (
            currentParentComments.map((parentComment, index) => (
              <React.Fragment key={parentComment.id}>
                {/* Parent Comment Row */}
                <tr
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(parentComment.id)} // Make the entire row clickable
                >
                  <td className="">
                    {(currentPage - 1) * commentsPerPage + index + 1}
                  </td>
                  <td className="">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {parentComment.fullName}
                      </span>
                      <span className="text-sm text-gray-500">{parentComment.email}</span>
                    </div>
                  </td>
                  <td className="pl-10">
                    <span className={`py-1 rounded-full text-sm font-medium`}>
                      {parentComment.content}
                    </span>
                  </td>
                  <td className="pl-10">
                    <span className={`py-1 rounded-full text-sm font-medium`}>
                      {parentComment.productName}
                    </span>
                  </td>
                  <td className="pl-10">
                    {new Date(parentComment.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4 border-b">
                    <CommentActions
                      comment={parentComment}
                      onView={() => {
                        setSelectedCommentId(parentComment.id);
                        setIsViewModalOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedComment(parentComment);
                        setIsConfirmDeleteCommentModalOpen(true);
                      }}
                    />
                  </td>
                </tr>

                {/* Child Comments */}
                {expandedCommentIds.includes(parentComment.id) && (
                  <>
                    {comments.some(
                      (childComment) =>
                        childComment.parentCommentId === parentComment.id
                    ) ? (
                      comments
                        .filter(
                          (childComment) =>
                            childComment.parentCommentId === parentComment.id
                        )
                        .map((childComment) => (
                          <tr key={childComment.id} className="bg-gray-50">
                            <td className="">↳</td>
                            <td className="">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-700">
                                  {childComment.fullName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {childComment.email}
                                </span>
                              </div>
                            </td>
                            <td className="">{childComment.content}</td>
                            <td className="">{childComment.productName}</td>
                            <td className="">
                              {new Date(childComment.createdAt).toLocaleDateString()}
                            </td>
                            <td className=""></td>
                          </tr>
                        ))
                    ) : (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                          Chưa có bình luận phản hồi
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>



      {/* View Comment Modal */}
      {isViewModalOpen && selectedCommentId && (
        <CommentDetailModal
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          commentId={selectedCommentId}
        />
      )}

      {/* Confirm Delete Product Modal */}
      {isConfirmDeleteCommentModalOpen && selectedComment && (
        <ConfirmDeleteCommentModal
          isOpen={isConfirmDeleteCommentModalOpen}
          onClose={() => setIsConfirmDeleteCommentModalOpen(false)}
          comment={selectedComment}
          setIsReload={setReload}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
          >
            {number + 1}
          </button>
        ))}
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
