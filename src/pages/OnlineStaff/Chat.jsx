import React, { useState, useEffect } from "react";
import { fetchCustomerChat, fetchListChat } from "../../services/Coordinator/ChatService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import axios from "axios";

const Chat = () => {
    const [chatSessions, setChatSessions] = useState([]); // List of chat sessions
    const [selectedChat, setSelectedChat] = useState(null); // Selected chat session
    const [message, setMessage] = useState(""); // Input message
    const [chatContent, setChatContent] = useState([]); // Store chat content
    const [imageFile, setImageFile] = useState(null); // Store the selected image
    const user = useSelector(selectUser); // Get the current user from the Redux store

    // Fetch chat sessions
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetchListChat();
                setChatSessions(response);

                // If there are chat sessions, set the first one as the selected chat
                if (response && response.length > 0) {
                    setSelectedChat(response[0]);
                    fetchChatContent(response[0].chatSessionId); // Fetch chat content for the first session
                }
            } catch (error) {
                console.error("Error fetching chat sessions:", error);
            }
        };
        fetchChats();
    }, []);

    // Fetch messages for the selected chat
    const fetchChatContent = async (chatSessionId) => {
        try {
            const response = await fetchCustomerChat(chatSessionId); // Fetch the full chat content
            const formattedMessages = response.map((message) => ({
                senderId: message.senderId,
                senderName: message.senderName,
                message: message.content,
                timestamp: message.timestamp,
            }));
            setChatContent(formattedMessages); // Set chat content to the state
        } catch (error) {
            console.error("Error fetching chat content:", error);
        }
    };

    // Select a chat and fetch its messages
    const handleSelectChat = async (chatSession) => {
        setSelectedChat(chatSession);
        fetchChatContent(chatSession.chatSessionId); // Fetch chat content for the selected chat
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        // Prepare the request data
        const token = localStorage.getItem("token");
        const chatSessionId = selectedChat.chatSessionId;
        const senderRole = "Coordinator";
        const receiverRole = "Customer";
        const messageContent = message.trim();

        const formData = new FormData();
        formData.append("message", messageContent);
        formData.append("chatSessionId", chatSessionId);
        formData.append("senderRole", senderRole);
        formData.append("receiverRole", receiverRole);
      
        if (imageFile) {
          formData.append("imageFile", imageFile);
        }

        try {
            const response = await axios.post(
                `https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Chat/send-message`,
                formData,
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "accept": "*/*",
                  },
                  params: {
                    chatSessionId,
                    senderRole,
                    receiverRole,
                    message: messageContent,
                  },
                }
              );
              
            if (response) {
                fetchChatContent(chatSessionId); // Fetch updated chat content after sending the message
                setMessage(""); // Clear the message input
                setImageFile(null); // Clear the selected image
            } else {
                console.error("Failed to send message:", response.status);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Handle image file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Chat List */}
            <div className="w-1/5 bg-gray-100 p-4 border-r border-gray-300">
                <h2 className="text-lg font-semibold mb-4">Chats</h2>
                <ul>
                    {chatSessions.map((session) => (
                        <li
                            key={session.chatSessionId}
                            className={`p-2 mb-2 rounded-lg cursor-pointer ${selectedChat?.chatSessionId === session.chatSessionId
                                    ? "bg-gray-300"
                                    : "bg-transparent"
                                }`}
                            onClick={() => handleSelectChat(session)}
                        >
                            <span className="font-semibold">{session.customerName}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Content */}
            <div className="w-4/5 p-4 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="flex justify-between border-b pb-2 mb-4">
                            <h3 className="text-lg font-semibold">{selectedChat.customerName}</h3>
                            <span className="text-sm text-gray-500">Chat ID: {selectedChat.chatSessionId}</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-auto mb-4">
                            {chatContent.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 flex ${chat.senderId == user.UserId ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`p-3 rounded-lg max-w-3/4 ${chat.senderId == user.UserId
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-300 text-black"
                                            }`}
                                    >
                                        <p>{chat.message}</p>
                                        {/* {chat.imageUrl&&<img src={chat.imageUrl}/> } */}
                                        
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Box */}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                                className="flex-1 p-2 border rounded-lg mr-2"
                            />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="mr-2"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Gửi
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-lg text-gray-500">Chọn KH để xem tin nhắn</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
