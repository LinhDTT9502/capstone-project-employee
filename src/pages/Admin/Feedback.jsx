import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  Spinner,
  Dialog,
  Input,
} from "@material-tailwind/react";
import {
  fetchAllFeedbacks,
  removeFeedback,
  fetchFeedbackById,
} from "../../services/feedbackService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListAllFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]); // State for filtered feedbacks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllFeedbacks();
      if (response) {
        const reversedFeedbacks = response.slice().reverse();
        setFeedbackData(reversedFeedbacks);
        setFilteredFeedbacks(reversedFeedbacks);
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

  // Filter feedbacks based on the search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = feedbackData.filter(
      (feedback) =>
        feedback.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        feedback.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        feedback.content?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbackData]);

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này không?")) {
      try {
        await removeFeedback(id);
        setFeedbackData((prevData) =>
          prevData.filter((feedback) => feedback.id !== id)
        );
        setFilteredFeedbacks((prevData) =>
          prevData.filter((feedback) => feedback.id !== id)
        );
        toast.success("Xóa phản hồi thành công!", { position: "top-right" });
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error("Xóa phản hồi thất bại!", { position: "top-right" });
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
    <><ToastContainer />
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex justify-between items-center p-4">
          <Typography variant="h4"
           color="blue-gray"
           className="p-4 text-center"
           > 
            Quản lý <span className="text-orange-500">[Phản Hồi]</span> ({filteredFeedbacks.length})
          </Typography>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Tìm kiếm phản hồi"
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
                  <th className="p-4 border-b">Tên</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Nội dung</th>
                  <th className="p-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback, index) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{feedback.fullName}</td>
                    <td className="p-4 border-b">{feedback.email}</td>
                    <td className="p-4 border-b truncate max-w-xs">
                      {feedback.content}
                    </td>
                    <td className="p-4 border-b space-x-2 flex gap-2">
                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        className="flex items-center gap-2 px-2 py-2"
                        onClick={() => handleViewFeedback(feedback.id)}
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm	" />
                      </Button>
                      <Button
                        size="md"
                        color="red"
                        variant="text"
                        className="flex items-center gap-2 px-2 py-2"
                        onClick={() => handleDeleteFeedback(feedback.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm	" />
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
              Chi tiết phản hồi
            </Typography>
            <Typography variant="h6" className="mb-2">
              Tên: {selectedFeedback.fullName || "N/A"}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Email: {selectedFeedback.email || "N/A"}
            </Typography>
            {/* <Typography variant="h6" className="mb-2">
              Số điện thoại: {selectedFeedback.phoneNumber || "N/A"}
            </Typography> */}
            <Typography variant="h6" className="mb-2">
              Ngày tạo:{" "}
              {new Date(selectedFeedback.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Typography>
            <Typography variant="h6" className="mb-2">
              Nội dung:
            </Typography>
            <Typography className="p-2 bg-gray-100 border rounded">
              {selectedFeedback.content || "N/A"}
            </Typography>
            <div className="mt-4 flex justify-end">
              <Button color="red" onClick={handleCloseModal}>
                Đóng
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div></>
  );
};

export default ListAllFeedback;
