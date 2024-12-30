import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { replyComment } from '../../services/Coordinator/CommentService';

const ReplyComment = ({ productCode, parentCommentId, setIsReload }) => {

  const [content, setContent] = useState('');

  const handleReply = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    const token = localStorage.getItem('token');
    console.log(productCode, parentCommentId, token);

    if (!token) {
      toast.error('Vui lòng đăng nhập để trả lời!');
      return;
    }

    try {
      var response = await replyComment(productCode, parentCommentId, content, token)
      console.log(response);
      setContent('')
    } catch (err) {
      console.error("Gửi phản hồi thất bại.");
    } finally {
      setIsReload(true)
    }


    // axios
    //   .post(
    //     `https://capstone-project-703387227873.asia-southeast1.run.app/api/Comment/reply-comment/${productCode}?parentCommentId=${parentCommentId}`,
    //     { content },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //       },
    //     }
    //   )
    //   .then(() => {
    //     setContent('');
    //     onReplySuccess();
    //   })
    //   .catch((error) => {
    //     console.error('Error replying to comment:', error);
    //     toast.error('Đã xảy ra lỗi khi phản hồi. Vui lòng thử lại sau.');
    //   });
  };

  return (
    <div className="mt-4 space-y-2">
      <textarea
        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Nhập nội dung phản hồi..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={handleReply}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Gửi phản hồi
        </button>
      </div>
    </div>

  );
};

export default ReplyComment;
