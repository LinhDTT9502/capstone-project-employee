import * as signalR from '@microsoft/signalr';

let connection;

export function initializeSignalR(token) {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('https://capstone-project-703387227873.asia-southeast1.run.app/notificationHub', {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

    connection.on('ReceiveOrderCreated', (message) => {
        console.log('New order notification:', message);
        displayNotification(message);
    });

    connection.start()
        .then(() => console.log('SignalR connected'))
        .catch((err) => console.error('SignalR connection error:', err));
}

export function displayNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notificationContainer.removeChild(notification);
    }, 5000); // Remove notification after 5 seconds
}
