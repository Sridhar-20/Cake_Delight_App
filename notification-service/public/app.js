const API_BASE_URL =
    "http://localhost:5003/api/notifications";

const customerEmailInput =
    document.getElementById("customerEmail");

const loadNotificationsBtn =
    document.getElementById("loadNotificationsBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const notificationsContainer =
    document.getElementById("notificationsContainer");

const unreadCount =
    document.getElementById("unreadCount");

const popupContainer =
    document.getElementById("popupContainer");


let currentCustomerEmail = "";

let previousNotificationIds = new Set();

let pollingInterval = null;

let isLoading = false;


// ==========================================================
// LOAD NOTIFICATIONS
// ==========================================================

const loadNotifications = async (
    showNewPopups = false
) => {

    const email =
        customerEmailInput.value.trim();

    if (!email) {

        showMessage(
            "Please enter a customer email."
        );

        return;
    }


    currentCustomerEmail = email;


    // Prevent multiple requests at the same time
    if (isLoading) {
        return;
    }


    isLoading = true;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/customer/${encodeURIComponent(email)}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load notifications"
            );

        }


        const notifications =
            result.data || [];


        displayNotifications(
            notifications,
            showNewPopups
        );


    } catch (error) {

        console.error(
            "Failed to load notifications:",
            error
        );


        showMessage(
            error.message
        );

    } finally {

        isLoading = false;

    }

};


// ==========================================================
// DISPLAY NOTIFICATIONS
// ==========================================================

const displayNotifications = (
    notifications,
    showNewPopups = false
) => {

    notificationsContainer.innerHTML = "";


    if (notifications.length === 0) {

        notificationsContainer.innerHTML = `
            <div class="empty-state">
                No notifications found.
            </div>
        `;


        updateUnreadCount([]);


        return;
    }


    updateUnreadCount(
        notifications
    );


    notifications.forEach(
        (notification) => {

            const card =
                createNotificationCard(
                    notification
                );


            notificationsContainer.appendChild(
                card
            );


            // Show popup only for notifications
            // that were not present during
            // the previous check.

            if (
                showNewPopups &&
                !previousNotificationIds.has(
                    notification._id
                )
            ) {

                showPopup(
                    notification
                );

            }

        }
    );


    // Store currently known notification IDs

    previousNotificationIds =
        new Set(
            notifications.map(
                notification =>
                    notification._id
            )
        );

};


// ==========================================================
// CREATE NOTIFICATION CARD
// ==========================================================

const createNotificationCard = (
    notification
) => {

    const card =
        document.createElement("div");


    card.className =
        `notification-card ${
            notification.isRead
                ? ""
                : "unread"
        }`;


    const date =
        new Date(
            notification.createdAt
        );


    const formattedDate =
        date.toLocaleString();


    const icon =
        getNotificationIcon(
            notification.type
        );


    card.innerHTML = `

        <div class="notification-top">

            <div class="notification-title">

                ${icon}

                ${escapeHtml(
                    notification.title
                )}

            </div>


            ${
                notification.isRead
                    ? ""
                    : `
                        <span class="new-badge">
                            NEW
                        </span>
                    `
            }

        </div>


        <div class="notification-message">

            ${escapeHtml(
                notification.message
            )}

        </div>


        <div class="notification-time">

            ${formattedDate}

        </div>


        <div class="type-badge">

            ${escapeHtml(
                notification.type
            )}

        </div>


        <div class="notification-actions">

            ${
                notification.isRead
                    ? ""
                    : `
                        <button
                            class="read-btn"
                            onclick="markAsRead('${notification._id}')"
                        >
                            ✓ Mark as read
                        </button>
                    `
            }


            <button
                class="delete-btn"
                onclick="deleteNotification('${notification._id}')"
            >
                Delete
            </button>

        </div>

    `;


    return card;

};


// ==========================================================
// UPDATE UNREAD COUNT
// ==========================================================

const updateUnreadCount = (
    notifications
) => {

    const count =
        notifications.filter(
            notification =>
                !notification.isRead
        ).length;


    unreadCount.textContent =
        count;

};


// ==========================================================
// MARK NOTIFICATION AS READ
// ==========================================================

const markAsRead = async (
    notificationId
) => {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/${notificationId}/read`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        isRead: true
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to mark notification as read"
            );

        }


        await loadNotifications(
            false
        );


    } catch (error) {

        console.error(error);

        showMessage(
            error.message
        );

    }

};


// ==========================================================
// DELETE NOTIFICATION
// ==========================================================

const deleteNotification = async (
    notificationId
) => {

    const confirmed =
        confirm(
            "Are you sure you want to delete this notification?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/${notificationId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete notification"
            );

        }


        await loadNotifications(
            false
        );


    } catch (error) {

        console.error(error);

        showMessage(
            error.message
        );

    }

};


// ==========================================================
// SHOW POPUP
// ==========================================================

const showPopup = (
    notification
) => {

    const popup =
        document.createElement("div");


    popup.className =
        "notification-popup";


    const icon =
        getNotificationIcon(
            notification.type
        );


    popup.innerHTML = `

        <div class="popup-header">

            <div class="popup-title">

                ${icon}

                ${escapeHtml(
                    notification.title
                )}

            </div>


            <button
                class="popup-close"
            >
                ✕
            </button>

        </div>


        <div class="popup-message">

            ${escapeHtml(
                notification.message
            )}

        </div>

    `;


    const closeButton =
        popup.querySelector(
            ".popup-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            popup.remove();

        }
    );


    popupContainer.appendChild(
        popup
    );


    // Automatically remove popup
    // after 5 seconds

    setTimeout(
        () => {

            if (popup.parentElement) {

                popup.remove();

            }

        },
        5000
    );

};


// ==========================================================
// SHOW SIMPLE MESSAGE
// ==========================================================

const showMessage = (
    message
) => {

    notificationsContainer.innerHTML = `

        <div class="empty-state">

            ${escapeHtml(message)}

        </div>

    `;

};


// ==========================================================
// NOTIFICATION ICON
// ==========================================================

const getNotificationIcon = (
    type
) => {

    const icons = {

        ORDER_PLACED: "🎉",

        ORDER_CONFIRMED: "✅",

        ORDER_PREPARING: "👨‍🍳",

        ORDER_OUT_FOR_DELIVERY: "🚚",

        ORDER_DELIVERED: "🎂",

        ORDER_CANCELLED: "❌"

    };


    return (
        icons[type] ||
        "🔔"
    );

};


// ==========================================================
// BASIC HTML ESCAPING
// ==========================================================

const escapeHtml = (
    value
) => {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

};


// ==========================================================
// START AUTOMATIC POLLING
// ==========================================================

const startNotificationPolling = () => {

    // Stop an existing polling timer
    // before creating a new one.

    stopNotificationPolling();


    if (!currentCustomerEmail) {
        return;
    }


    console.log(
        "Notification polling started for:",
        currentCustomerEmail
    );


    pollingInterval =
        setInterval(
            () => {

                if (
                    currentCustomerEmail
                ) {

                    loadNotifications(
                        true
                    );

                }

            },
            3000
        );

};


// ==========================================================
// STOP AUTOMATIC POLLING
// ==========================================================

const stopNotificationPolling = () => {

    if (pollingInterval) {

        clearInterval(
            pollingInterval
        );


        pollingInterval =
            null;


        console.log(
            "Notification polling stopped."
        );

    }

};


// ==========================================================
// LOAD BUTTON
// ==========================================================

loadNotificationsBtn.addEventListener(
    "click",
    async () => {

        // Reset previously known notifications
        // because this may be a different customer.

        previousNotificationIds =
            new Set();


        await loadNotifications(
            false
        );


        // Start checking for new notifications
        // every 3 seconds.

        startNotificationPolling();

    }
);


// ==========================================================
// REFRESH BUTTON
// ==========================================================

refreshBtn.addEventListener(
    "click",
    () => {

        if (currentCustomerEmail) {

            loadNotifications(
                false
            );

        } else {

            loadNotifications(
                false
            );

        }

    }
);


// ==========================================================
// ENTER KEY
// ==========================================================

customerEmailInput.addEventListener(
    "keypress",
    async (event) => {

        if (
            event.key === "Enter"
        ) {

            previousNotificationIds =
                new Set();


            await loadNotifications(
                false
            );


            startNotificationPolling();

        }

    }
);


// ==========================================================
// CLEANUP
// ==========================================================

window.addEventListener(
    "beforeunload",
    () => {

        stopNotificationPolling();

    }
);