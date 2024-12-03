import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const useOrderNotification = (onNotificationReceived) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const options = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
        };

        // Create a new SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://capstone-project-703387227873.asia-southeast1.run.app/notificationHub", options)
            .withAutomaticReconnect()  // Enable automatic reconnect
            .build();

        setConnection(newConnection);
        

        // Cleanup function
        return () => {
            if (newConnection && newConnection.state !== signalR.HubConnectionState.Disconnected) {
                newConnection.stop();
            }
        };
    }, []);  // Only run once

    useEffect(() => {
        if (connection) {
            const startConnection = async () => {
                if (connection.state !== signalR.HubConnectionState.Disconnected) {
                    console.log("SignalR is already connected or connecting");
                    return;
                }

                try {
                    await connection.start();
                    console.log("SignalR Connected");

                    // Listen for notifications
                    connection.on("ReceiveMessage", (message) => {
                        console.log("Notification received:", message);
                        onNotificationReceived(message);
                    });

                    // Reconnection handler
                    connection.onreconnected(() => {
                        console.log("SignalR Reconnected");
                    });

                    // Connection close handler
                    connection.onclose((error) => {
                        console.error("SignalR Disconnected", error);
                    });

                } catch (err) {
                    console.error("Error connecting to SignalR", err);
                }
            };

            startConnection();
        }

        return () => {
            if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
                connection.off("ReceiveMessage");
                connection.off("ReceiveMessage");
                connection.stop();
            }
        };
    }, [connection, onNotificationReceived]);  // Re-run when the connection changes

};

export default useOrderNotification;


// import { HubConnectionBuilder } from '@microsoft/signalr';

// class useOrderNotification {
//     constructor() {
//         this.connection = new HubConnectionBuilder()
//             .withUrl('https://capstone-project-703387227873.asia-southeast1.run.app/notificationHub', {
//                 accessTokenFactory: () => localStorage.getItem('token') // Assume JWT token is stored in localStorage
//             })
//             .build();
//     }

//     // Initialize the connection
//     async startConnection() {
//         try {
//             await this.connection.start();
//             console.log("SignalR connection established.");
//             this.setUpListeners();
//         } catch (err) {
//             console.error("Error while starting connection: ", err);
//         }
//     }

//     // Set up listeners for notifications
//     setUpListeners() {
//         this.connection.on("ReceiveOrderCreated", (message) => {
//             console.log("New Order Created: ", message);
//             // Show the notification to the admin, for example using a toast or alert
//         });

//         this.connection.on("ReceiveOrderRejected", (message) => {
//             console.log("Order Rejected: ", message);
//             // Show the notification to the admin
//         });

//         this.connection.on("ReceiveNotification", (message) => {
//             console.log("Notification: ", message);
//             // Show the notification to the user, e.g., rental expiration
//         });
//     }

//     // Stop the connection (if needed)
//     stopConnection() {
//         this.connection.stop();
//     }
// }

// export default new useOrderNotification();
