import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { getChildCommentsByParentCommentId, getCommentsById } from '../../services/Coordinator/CommentService';
import { fetchAProductByProductCode, fetchProductColor } from '../../services/productService';
import ReplyComment from './ReplyComment';

const CommentDetailModal = ({ open, onClose, commentId }) => {
  const [commentDetail, setCommentDetail] = useState(null);
  const [childComments, setChildComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);


  const fetchComments = async () => {
    if (open && commentId) {
      try {
        setLoading(true);

        const parentComment = await getCommentsById(commentId);
        setCommentDetail(parentComment);

        const childComments = await getChildCommentsByParentCommentId(commentId);
        setChildComments(childComments);

        if (parentComment && childComments) {
          const productData = await fetchAProductByProductCode(parentComment.productCode);
          console.log(productData);
          setProduct(productData[0]);
        }

      } catch (err) {
        setError('Failed to fetch comment details', err);
      } finally {
        setLoading(false);
      }
    };
  }

  useEffect(() => {
    fetchComments();
  }, [open, commentId]);

  useEffect(() => {
    fetchComments();
    setReplyingTo(null);
  }, [isReload]);

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>
        Chi tiết bình luận
      </DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <ul>
              <li key={product.productId} className="mb-2">
                <div className="flex items-center gap-4">
                  <img src={product.imgAvatarPath} alt={product.productName} className="w-16 h-16 object-cover rounded-lg" />

                  <div>
                    <p className="text-orange-500">
                      <strong>
                        {product.productName || "Unknown Product"}
                        <span className='text-black'> - </span>
                        {product.productCode}
                      </strong>
                    </p>
                    <p>
                      {product.color} - {product.size} - {product.condition}%
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <p><strong>Khách hàng:</strong> {commentDetail?.fullName}</p>
            <p><strong>Email:</strong> {commentDetail?.email}</p>
            <p><strong>Ngày bình luận:</strong> {new Date(commentDetail.createdAt).toLocaleString()}</p>

            <div key={commentDetail.id} className={`pl-2 mt-6`}>
              <div className="bg-white rounded-lg shadow-sm p-4 transition duration-300 ease-in-out hover:shadow-md">
                <div className="flex space-x-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                      {commentDetail.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">{commentDetail.fullName}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(commentDetail.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{commentDetail.content}</p>
                  </div>
                </div>
                {/* Child comments */}
                <div className="mt-4 w-full">
                  {childComments.length > 0 ? (
                    childComments.map((child) => (
                      <div
                        key={child.id}
                        className="ml-8 bg-gray-100 rounded-lg shadow-sm p-4 mt-4 transition duration-300 ease-in-out hover:shadow-md"
                      >
                        <div className="flex space-x-4 items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                              {child.fullName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-800">{child.fullName}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(child.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-2">{child.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm mt-4">Không có phản hồi nào.</p>
                  )}
                </div>

                <div className="mt-3 flex items-center space-x-4">

                  {commentDetail.parentCommentId === 0 && (
                    <div className=''>
                      <button
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium transition duration-300 ease-in-out"
                        onClick={() => setReplyingTo(replyingTo === commentDetail.id ? null : commentDetail.id)}
                      >
                        Trả lời
                      </button>
                    </div>

                  )}
                  {replyingTo === commentDetail.id && commentDetail.parentCommentId === 0 && (
                    <div className="mt-4 w-full">
                      <ReplyComment
                        productCode={commentDetail.productCode}
                        parentCommentId={commentDetail.id}
                        setIsReload={setIsReload}
                      // onReplySuccess={() => {
                      //   setReplyingTo(null);
                      //   fetchComments();
                      // }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogBody>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">

      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={onClose} className='ml-2'>Đóng</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CommentDetailModal;
