import React, { useEffect, useState } from "react";
import { Button, Typography, Card, Spinner, Dialog } from "@material-tailwind/react";
import { fetchAllFeedbacks, removeFeedback, fetchFeedbackById } from "../../services/feedbackService";

const ListAllFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchFeedbackData = async () => {
    try {
      const response = await fetchAllFeedbacks();
      if (response) {
        setFeedbackData(response);
      } else {
        setError("Không thể lấy dữ liệu");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này không?")) {
        try {
            await removeFeedback(id);
            setFeedbackData((prevData) => prevData.filter((feedback) => feedback.id !== id));
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    }
};

  const handleViewFeedback = async (id) => {
    try {
      const feedback = await fetchFeedbackById(id);
      setSelectedFeedback(feedback);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching feedback details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <Typography variant="h4" color="blue-gray" className="p-4">
          Danh sách phản hồi
        </Typography>

        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <Typography variant="h6" color="red" className="text-center p-4">
            {error}
          </Typography>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b">#</th>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Địa chỉ email</th>
                  <th className="p-4 border-b">Nội dung</th>
                  <th className="p-4 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData.map((feedback, index) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{feedback.fullName}</td>
                    <td className="p-4 border-b">{feedback.email}</td>
                    <td className="p-4 border-b truncate max-w-xs">{feedback.content}</td>
                    <td className="p-4 border-b flex gap-2">
                      <Button size="sm" color="blue" onClick={() => handleViewFeedback(feedback.id)}>
                        Xem chi tiết
                      </Button>
                      <Button size="sm" color="red" onClick={() => handleDeleteFeedback(feedback.id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isModalOpen && selectedFeedback && (
        <Dialog open={isModalOpen} handler={handleCloseModal} size="lg">
          <div className="p-4">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Feedback Details
            </Typography>
            <Typography variant="h6" className="mb-2">
              Name: {selectedFeedback.fullName || "N/A"}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Email: {selectedFeedback.email || "N/A"}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Số điện thoại: {selectedFeedback.phoneNumber || "N/A"}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Ngày tạo: {new Date(selectedFeedback.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Content:
            </Typography>
            <Typography className="p-2 bg-gray-100 border rounded">
              {selectedFeedback.content || "N/A"}
            </Typography>
            <div className="mt-4 flex justify-end">
              <Button color="red" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ListAllFeedback;
