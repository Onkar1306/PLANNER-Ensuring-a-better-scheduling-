// Sample notifications data (You can fetch this from a database or API in a real scenario)
const notifications = [
    {
        name: "Meeting with John",
        due: "2024-09-30T15:00",
        status: "pending"
    },
    {
        name: "Submit Project Report",
        due: "2024-10-01T09:00",
        status: "done"
    },
    {
        name: "Doctor's Appointment",
        due: "2024-10-01T14:30",
        status: "overdue"
    }
];

// Function to dynamically display notifications
function displayNotifications() {
    const notificationList = document.querySelector('.notification-list');
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');

        const statusClass = notification.status === 'pending' ? 'pending' : 
                            notification.status === 'done' ? 'done' : 
                            'overdue';

        notificationItem.innerHTML = `
            <div class="notification-info">
                <h3 class="task-name">${notification.name}</h3>
                <p class="task-time">Due: ${new Date(notification.due).toLocaleString()}</p>
            </div>
            <div class="notification-status">
                <span class="status-dot ${statusClass}"></span>
                <span class="status-text">${notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}</span>
            </div>
        `;
        notificationList.appendChild(notificationItem);
    });
}

// Call function to render notifications
displayNotifications();
