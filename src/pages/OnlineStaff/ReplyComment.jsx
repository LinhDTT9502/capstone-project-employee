import React, { useState } from 'react';
import axios from 'axios';

const ReplyComment = ({ productCode, parentCommentId, onReplySuccess }) => {
    console.log(productCode, parentCommentId);
    
  const [content, setContent] = useState('');

  const handleReply = () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để trả lời!');
      return;
    }

    axios
      .post(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/Comment/reply-comment/${productCode}?parentCommentId=${parentCommentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(() => {
        setContent('');
        onReplySuccess();
      })
      .catch((error) => {
        console.error('Error replying to comment:', error);
        alert('Đã xảy ra lỗi khi phản hồi. Vui lòng thử lại sau.');
      });
  };

  return (
    <div className="mt-4 space-y-2">
      <textarea
        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Nhập nội dung phản hồi..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleReply}
        className="w-full sm:w-auto mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Gửi phản hồi
      </button>
    </div>
  );
};

export default ReplyComment;
