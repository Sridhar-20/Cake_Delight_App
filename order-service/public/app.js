const API_BASE_URL = "/api/orders";

// Catalog Service is running on port 5001.
const CATALOG_API_URL =
    "http://localhost:5001/api/catalog/cakes";


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const orderTableBody =
    document.getElementById("orderTableBody");

const apiResponse =
    document.getElementById("apiResponse");

const resultCount =
    document.getElementById("resultCount");

const serviceStatus =
    document.getElementById("serviceStatus");

const statusDot =
    document.getElementById("statusDot");

const orderItems =
    document.getElementById("orderItems");

const orderTotal =
    document.getElementById("orderTotal");

const orderModal =
    document.getElementById("orderModal");

const statusModal =
    document.getElementById("statusModal");


// ==========================================================
// BASKET DOM ELEMENTS
// ==========================================================

const basketCakeSelect =
    document.getElementById("basketCakeSelect");

const basketQuantity =
    document.getElementById("basketQuantity");

const basketContainer =
    document.getElementById("basketContainer");

const basketTotal =
    document.getElementById("basketTotal");

const cakeCatalogContainer =
    document.getElementById("cakeCatalogContainer");


// ==========================================================
// NOTIFICATION SERVICE
// ==========================================================

const NOTIFICATION_API_URL =
    "http://localhost:5003/api/notifications";

const notificationPopupContainer =
    document.getElementById(
        "notificationPopupContainer"
    );

let notificationPollingTimer = null;

let notificationCustomerEmail = "";

// Notifications that have already been displayed.
let seenNotificationIds = new Set();

// Order IDs for which we already displayed an
// immediate ORDER_PLACED popup.
//
// This prevents the polling mechanism from displaying
// the same ORDER_PLACED notification again.
let immediatelyNotifiedOrderIds = new Set();


// ==========================================================
// API REQUEST
// ==========================================================

async function apiRequest(url, options = {}) {

    try {

        const response = await fetch(url, {

            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }

        });


        const data =
            await response.json();


        showApiResponse(data);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "API request failed"
            );

        }


        return data;

    } catch (error) {

        showApiResponse({

            success: false,

            message: error.message

        });


        throw error;

    }

}


// ==========================================================
// DISPLAY API RESPONSE
// ==========================================================

function showApiResponse(data) {

    apiResponse.textContent =
        JSON.stringify(
            data,
            null,
            2
        );

}


// ==========================================================
// CHECK ORDER SERVICE HEALTH
// ==========================================================

async function checkServiceHealth() {

    try {

        const response =
            await fetch("/health");


        if (!response.ok) {

            throw new Error();

        }


        serviceStatus.textContent =
            "Service Online";

        statusDot.style.background =
            "#087443";


    } catch (error) {

        serviceStatus.textContent =
            "Service Offline";

        statusDot.style.background =
            "#b42318";

    }

}


// ==========================================================
// LOAD CAKES FROM CATALOG SERVICE
// ==========================================================

// ==========================================================
// LOAD CAKES FROM CATALOG SERVICE
// ==========================================================

async function loadCakes() {

    try {

        const response =
            await fetch(
                CATALOG_API_URL
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load cakes"
            );
        }


        const cakes =
            data.data?.cakes || [];


        // ==================================================
        // OLD BASKET SELECT
        // ==================================================

        if (basketCakeSelect) {

            basketCakeSelect.innerHTML = `
                <option value="">
                    Select Cake
                </option>
            `;


            cakes
                .filter(
                    cake =>
                        cake.isAvailable &&
                        cake.stock > 0
                )
                .forEach(
                    (cake) => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            cake._id;


                        option.dataset.price =
                            cake.price;


                        option.dataset.stock =
                            cake.stock;


                        option.textContent =
                            `${cake.name} - ₹${cake.price} (Stock: ${cake.stock})`;


                        basketCakeSelect.appendChild(
                            option
                        );

                    }
                );

        }


        // ==================================================
        // NEW CAKE CARD CATALOG
        // ==================================================

        renderCakeCatalog(cakes);


    } catch (error) {

        console.error(
            "Catalog Service error:",
            error
        );


        if (basketCakeSelect) {

            basketCakeSelect.innerHTML = `
                <option value="">
                    Unable to load cakes
                </option>
            `;

        }


        if (cakeCatalogContainer) {

            cakeCatalogContainer.innerHTML = `
                <div class="cake-error">

                    Unable to load cakes from
                    Catalog Service.

                </div>
            `;

        }

    }

}

// ==========================================================
// RENDER CAKE CATALOG
// ==========================================================

function renderCakeCatalog(cakes) {

    if (!cakeCatalogContainer) {
        return;
    }


    cakeCatalogContainer.innerHTML = "";


    const availableCakes =
        cakes.filter(
            cake =>
                cake.isAvailable &&
                Number(cake.stock) > 0
        );


    if (availableCakes.length === 0) {

        cakeCatalogContainer.innerHTML = `
            <div class="cake-empty">

                No cakes are currently available.

            </div>
        `;

        return;
    }


    availableCakes.forEach(
        (cake) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "cake-card";


            const stock =
                Number(cake.stock);


            const stockClass =
                stock <= 5
                    ? "low-stock"
                    : "";


            const imageUrl =
                cake.image ||
                cake.imageUrl ||
                cake.imageURL ||
                "";


            const imageHtml =
                imageUrl
                    ? `
                        <img
                            src="${escapeHtml(imageUrl)}"
                            alt="${escapeHtml(cake.name)}"
                        >
                    `
                    : `
                        <div class="cake-placeholder">
                            🎂
                        </div>
                    `;


            card.innerHTML = `

                <div class="cake-image">

                    ${imageHtml}

                </div>


                <div class="cake-info">

                    <div class="cake-name">

                        ${escapeHtml(cake.name)}

                    </div>


                    <div class="cake-description">

                        ${escapeHtml(
                            cake.description ||
                            "Delicious Cake Delight cake."
                        )}

                    </div>


                    <div class="cake-price">

                        ₹${Number(cake.price)}

                    </div>


                    <div
                        class="cake-stock ${stockClass}"
                    >

                        ${
                            stock <= 5
                                ? `Only ${stock} left`
                                : `${stock} available`
                        }

                    </div>


                    <div class="cake-card-actions">

                        <input
                            type="number"
                            class="cake-quantity"
                            id="quantity-${cake._id}"
                            min="1"
                            max="${stock}"
                            value="1"
                        >


                        <button
                            type="button"
                            class="add-cake-btn"
                            onclick="addCakeCardToBasket('${cake._id}')"
                        >

                            + Add to Basket

                        </button>

                    </div>

                </div>

            `;


            cakeCatalogContainer.appendChild(
                card
            );

        }
    );

}

// ==========================================================
// ADD CAKE CARD TO BASKET
// ==========================================================

async function addCakeCardToBasket(
    cakeId
) {

    const quantityInput =
        document.getElementById(
            `quantity-${cakeId}`
        );


    const quantity =
        Number(
            quantityInput?.value
        );


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        alert(
            "Quantity must be at least 1."
        );

        return;
    }


    // Set the selected cake in the existing hidden select.

    if (basketCakeSelect) {

        basketCakeSelect.value =
            cakeId;

    }


    // Set the quantity in the existing hidden input.

    if (basketQuantity) {

        basketQuantity.value =
            quantity;

    }


    // Reuse the existing basket API function.

    await addToBasket();


    // Reset card quantity after successful add.

    if (quantityInput) {

        quantityInput.value = 1;

    }

}



// ==========================================================
// POPULATE CAKE SELECT
// ==========================================================

function populateCakeSelect(
    select,
    cakes
) {

    select.innerHTML = `

        <option value="">
            Select Cake
        </option>

    `;


    cakes
        .filter(
            cake =>
                cake.isAvailable &&
                cake.stock > 0
        )
        .forEach((cake) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cake._id;


            option.dataset.price =
                cake.price;


            option.dataset.stock =
                cake.stock;


            option.textContent =
                `${cake.name} - ₹${cake.price} (Stock: ${cake.stock})`;


            select.appendChild(option);

        });


    select.addEventListener(
        "change",
        updateOrderTotals
    );

}


// ==========================================================
// ADD ORDER ITEM
// ==========================================================

function addOrderItem() {

    const item =
        document.createElement("div");


    item.className =
        "order-item";


    item.innerHTML = `

        <div class="item-grid">

            <div>

                <label>Cake</label>

                <select
                    class="cake-select"
                    required
                >

                    <option value="">
                        Loading cakes...
                    </option>

                </select>

            </div>


            <div>

                <label>Quantity</label>

                <input
                    type="number"
                    class="quantity-input"
                    min="1"
                    value="1"
                    required
                >

            </div>


            <div>

                <label>Price</label>

                <input
                    type="text"
                    class="price-display"
                    value="₹0"
                    readonly
                >

            </div>


            <div>

                <label>Subtotal</label>

                <input
                    type="text"
                    class="subtotal-display"
                    value="₹0"
                    readonly
                >

            </div>


            <div class="remove-container">

                <button
                    type="button"
                    class="remove-btn"
                    onclick="removeOrderItem(this)"
                >
                    Remove
                </button>

            </div>


        </div>

    `;


    orderItems.appendChild(item);


    loadCakes();


    const quantityInput =
        item.querySelector(
            ".quantity-input"
        );


    quantityInput.addEventListener(
        "input",
        updateOrderTotals
    );

}


// ==========================================================
// REMOVE ORDER ITEM
// ==========================================================

function removeOrderItem(button) {

    const items =
        document.querySelectorAll(
            ".order-item"
        );


    if (items.length === 1) {

        alert(
            "At least one cake is required."
        );

        return;

    }


    button
        .closest(".order-item")
        .remove();


    updateOrderTotals();

}


// ==========================================================
// UPDATE ORDER TOTAL
// ==========================================================

function updateOrderTotals() {

    let total = 0;


    const items =
        document.querySelectorAll(
            ".order-item"
        );


    items.forEach((item) => {

        const select =
            item.querySelector(
                ".cake-select"
            );


        const quantityInput =
            item.querySelector(
                ".quantity-input"
            );


        const priceDisplay =
            item.querySelector(
                ".price-display"
            );


        const subtotalDisplay =
            item.querySelector(
                ".subtotal-display"
            );


        const option =
            select.options[
                select.selectedIndex
            ];


        if (
            !option ||
            !option.dataset.price
        ) {

            priceDisplay.value =
                "₹0";


            subtotalDisplay.value =
                "₹0";


            return;

        }


        const price =
            Number(
                option.dataset.price
            );


        const quantity =
            Number(
                quantityInput.value
            ) || 0;


        const subtotal =
            price * quantity;


        priceDisplay.value =
            `₹${price}`;


        subtotalDisplay.value =
            `₹${subtotal}`;


        total += subtotal;

    });


    orderTotal.textContent =
        `₹${total}`;

}



// ==========================================================
// IMMEDIATE ORDER SUCCESS POPUP
// ==========================================================

function showOrderCreatedPopup(order) {

    if (!notificationPopupContainer) {
        return;
    }


    const popup =
        document.createElement("div");


    popup.className =
        "notification-popup";


    popup.innerHTML = `

        <div class="notification-popup-header">

            <strong>
                🎉 Order Placed Successfully
            </strong>

            <button
                type="button"
                class="notification-popup-close"
            >
                ✕
            </button>

        </div>


        <div class="notification-popup-message">

            Your cake order has been placed successfully.

            <br><br>

            <strong>
                Order ID:
            </strong>

            ${escapeHtml(order._id)}

            <br>

            <strong>
                Total:
            </strong>

            ₹${order.totalAmount}

        </div>

    `;


    popup
        .querySelector(
            ".notification-popup-close"
        )
        .addEventListener(
            "click",
            () => popup.remove()
        );


    notificationPopupContainer.appendChild(
        popup
    );


    setTimeout(
        () => {

            if (popup.parentElement) {

                popup.remove();

            }

        },
        5000
    );

}


// ==========================================================
// GET ALL ORDERS
// ==========================================================

async function getAllOrders() {

    try {

        const data =
            await apiRequest(
                API_BASE_URL
            );


        displayOrders(
            data.data || []
        );


    } catch (error) {

        displayOrders([]);

    }

}


// ==========================================================
// DISPLAY ORDERS
// ==========================================================

function displayOrders(orders) {

    orderTableBody.innerHTML =
        "";


    resultCount.textContent =
        `${orders.length} order${
            orders.length === 1
                ? ""
                : "s"
        }`;


    if (orders.length === 0) {

        orderTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                >

                    No orders found.

                </td>

            </tr>

        `;

        return;

    }


    orders.forEach((order) => {

        const row =
            document.createElement("tr");


        const itemNames =
            order.items
                .map(
                    item =>
                        `${escapeHtml(
                            item.cakeName
                        )} × ${item.quantity}`
                )
                .join("<br>");


        const createdAt =
            new Date(
                order.createdAt
            ).toLocaleString();


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    order.customerName
                )}
            </td>


            <td>
                ${escapeHtml(
                    order.customerPhone
                )}
            </td>


            <td>
                ${itemNames}
            </td>


            <td>
                ₹${order.totalAmount}
            </td>


            <td>
                ${escapeHtml(
                    order.paymentMethod
                )}
            </td>


            <td>

                <span
                    class="status status-${order.status}"
                >
                    ${formatStatus(
                        order.status
                    )}
                </span>

            </td>


            <td>
                ${createdAt}
            </td>


            <td>

                <button
                    class="action-btn view-btn"
                    onclick='viewOrder(${JSON.stringify(order)})'
                >
                    View
                </button>


                ${
                    order.status !== "DELIVERED" &&
                    order.status !== "CANCELLED"

                    ?

                    `

                    <button
                        class="action-btn status-btn"
                        onclick="openStatusModal('${order._id}', '${order.status}')"
                    >
                        Status
                    </button>

                    `

                    :

                    ""
                }


                ${
                    order.status !== "DELIVERED" &&
                    order.status !== "CANCELLED"

                    ?

                    `

                    <button
                        class="action-btn cancel-btn"
                        onclick="cancelOrder('${order._id}')"
                    >
                        Cancel
                    </button>

                    `

                    :

                    ""
                }

            </td>

        `;


        orderTableBody.appendChild(row);

    });

}


// ==========================================================
// GET ORDER BY ID
// ==========================================================

async function getOrderById() {

    const id =
        document
            .getElementById(
                "orderIdSearch"
            )
            .value
            .trim();


    if (!id) {

        alert(
            "Please enter an order ID."
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                `${API_BASE_URL}/${id}`
            );


        if (data.data) {

            displayOrders([
                data.data
            ]);

        }


    } catch (error) {

        displayOrders([]);

    }

}


// ==========================================================
// FILTER ORDERS BY STATUS
// ==========================================================

async function filterOrdersByStatus() {

    const status =
        document
            .getElementById(
                "statusFilter"
            )
            .value;


    if (!status) {

        await getAllOrders();

        return;

    }


    try {

        const data =
            await apiRequest(
                API_BASE_URL
            );


        const orders =
            data.data || [];


        const filtered =
            orders.filter(
                order =>
                    order.status === status
            );


        displayOrders(filtered);


    } catch (error) {

        displayOrders([]);

    }

}


// ==========================================================
// VIEW ORDER DETAILS
// ==========================================================

function viewOrder(order) {

    const details =
        document.getElementById(
            "orderDetails"
        );


    const itemsHtml =
        order.items
            .map(
                item => `

                    <div class="detail-item">

                        <strong>
                            ${escapeHtml(
                                item.cakeName
                            )}
                        </strong>

                        <br>

                        Price:
                        ₹${item.price}

                        <br>

                        Quantity:
                        ${item.quantity}

                        <br>

                        Subtotal:
                        ₹${item.subtotal}

                    </div>

                `
            )
            .join("");


    details.innerHTML = `

        <div class="detail-row">

            <span class="detail-label">
                Order ID
            </span>

            <span>
                ${escapeHtml(order._id)}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Customer
            </span>

            <span>
                ${escapeHtml(
                    order.customerName
                )}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Email
            </span>

            <span>
                ${escapeHtml(
                    order.customerEmail
                )}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Phone
            </span>

            <span>
                ${escapeHtml(
                    order.customerPhone
                )}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Address
            </span>

            <span>
                ${escapeHtml(
                    order.deliveryAddress
                )}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Payment
            </span>

            <span>
                ${escapeHtml(
                    order.paymentMethod
                )}
            </span>

        </div>


        <div class="detail-row">

            <span class="detail-label">
                Status
            </span>

            <span
                class="status status-${order.status}"
            >
                ${formatStatus(
                    order.status
                )}
            </span>

        </div>


        <div class="detail-items">

            <h3>
                Items
            </h3>

            <br>

            ${itemsHtml}

        </div>


        <div class="order-total">

            <span>
                Total Amount
            </span>

            <strong>
                ₹${order.totalAmount}
            </strong>

        </div>

    `;


    orderModal.style.display =
        "flex";

}


// ==========================================================
// CLOSE ORDER MODAL
// ==========================================================

function closeOrderModal() {

    orderModal.style.display =
        "none";

}


// ==========================================================
// OPEN STATUS MODAL
// ==========================================================

function openStatusModal(
    orderId,
    currentStatus
) {

    document
        .getElementById(
            "statusOrderId"
        )
        .value = orderId;


    const statusSelect =
        document
            .getElementById(
                "newOrderStatus"
            );


    const transitions = {

        PLACED: [
            "CONFIRMED"
        ],

        CONFIRMED: [
            "PREPARING"
        ],

        PREPARING: [
            "OUT_FOR_DELIVERY"
        ],

        OUT_FOR_DELIVERY: [
            "DELIVERED"
        ]

    };


    statusSelect.innerHTML =
        "";


    const allowed =
        transitions[
            currentStatus
        ] || [];


    allowed.forEach(
        (status) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                status;


            option.textContent =
                formatStatus(
                    status
                );


            statusSelect.appendChild(
                option
            );

        }
    );


    if (allowed.length === 0) {

        alert(
            "No further status transitions are available."
        );

        return;

    }


    statusModal.style.display =
        "flex";

}


// ==========================================================
// UPDATE ORDER STATUS
// ==========================================================

async function updateOrderStatus() {

    const id =
        document
            .getElementById(
                "statusOrderId"
            )
            .value;


    const status =
        document
            .getElementById(
                "newOrderStatus"
            )
            .value;


    try {

        await apiRequest(
            `${API_BASE_URL}/${id}/status`,
            {
                method: "PATCH",

                body:
                    JSON.stringify({
                        status
                    })
            }
        );


        closeStatusModal();


        await getAllOrders();


    } catch (error) {

        // API response already displayed.

    }

}


// ==========================================================
// CANCEL ORDER
// ==========================================================

async function cancelOrder(id) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await apiRequest(
            `${API_BASE_URL}/${id}/cancel`,
            {
                method: "PATCH"
            }
        );


        await getAllOrders();

        await loadCakes();


    } catch (error) {

        // API response already displayed.

    }

}


// ==========================================================
// CLOSE STATUS MODAL
// ==========================================================

function closeStatusModal() {

    statusModal.style.display =
        "none";

}


// ==========================================================
// FORMAT STATUS
// ==========================================================

function formatStatus(status) {

    return status
        .replaceAll(
            "_",
            " "
        );

}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// ==========================================================
// IN-APP NOTIFICATIONS
// ==========================================================

async function checkNotifications(
    showInitialNotification = false
) {

    const emailInput =
        document.getElementById(
            "customerEmail"
        );


    if (!emailInput) {

        return;

    }


    const email =
        emailInput.value.trim();


    if (!email) {

        return;

    }


    notificationCustomerEmail =
        email;


    try {

        const response =
            await fetch(
                `${NOTIFICATION_API_URL}/customer/${encodeURIComponent(email)}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load notifications"
            );

        }


        const notifications =
            result.data || [];


        // ==================================================
        // FIRST LOAD
        // ==================================================

        if (
            seenNotificationIds.size === 0 &&
            !showInitialNotification
        ) {

            seenNotificationIds =
                new Set(
                    notifications.map(
                        notification =>
                            notification._id
                    )
                );


            return;

        }


        // ==================================================
        // CHECK FOR NEW NOTIFICATIONS
        // ==================================================

        notifications.forEach(
            (notification) => {

                if (
                    seenNotificationIds.has(
                        notification._id
                    )
                ) {

                    return;

                }


                // ==================================================
                // ORDER PLACED DUPLICATE PREVENTION
                // ==================================================

                if (
                    notification.type ===
                        "ORDER_PLACED" &&
                    notification.orderId &&
                    immediatelyNotifiedOrderIds.has(
                        notification.orderId
                    )
                ) {

                    // We already displayed an immediate
                    // Order UI popup when the order was created.
                    //
                    // Mark this notification as seen so
                    // polling does not display it again.

                    seenNotificationIds.add(
                        notification._id
                    );


                    return;

                }


                // ==================================================
                // NORMAL NOTIFICATION POPUP
                // ==================================================

                showNotificationPopup(
                    notification
                );


                seenNotificationIds.add(
                    notification._id
                );

            }
        );


    } catch (error) {

        console.warn(
            "Notification check failed:",
            error.message
        );

    }

}


// ==========================================================
// NOTIFICATION POPUP
// ==========================================================

function showNotificationPopup(
    notification
) {

    if (!notificationPopupContainer) {

        return;

    }


    const popup =
        document.createElement("div");


    popup.className =
        "notification-popup";


    const icons = {

        ORDER_PLACED: "🎉",

        ORDER_CONFIRMED: "✅",

        ORDER_PREPARING: "👨‍🍳",

        ORDER_OUT_FOR_DELIVERY: "🚚",

        ORDER_DELIVERED: "🎂",

        ORDER_CANCELLED: "❌"

    };


    const icon =
        icons[
            notification.type
        ] || "🔔";


    popup.innerHTML = `

        <div class="notification-popup-header">

            <strong>
                ${icon}
                ${escapeHtml(
                    notification.title
                )}
            </strong>


            <button
                type="button"
                class="notification-popup-close"
            >
                ✕
            </button>

        </div>


        <div class="notification-popup-message">

            ${escapeHtml(
                notification.message
            )}

        </div>

    `;


    popup
        .querySelector(
            ".notification-popup-close"
        )
        .addEventListener(
            "click",
            () => popup.remove()
        );


    notificationPopupContainer.appendChild(
        popup
    );


    setTimeout(
        () => {

            if (popup.parentElement) {

                popup.remove();

            }

        },
        5000
    );

}


// ==========================================================
// START NOTIFICATION POLLING
// ==========================================================

function startNotificationPolling() {

    if (notificationPollingTimer) {

        clearInterval(
            notificationPollingTimer
        );

    }


    checkNotifications(false);


    notificationPollingTimer =
        setInterval(
            () => {

                checkNotifications(true);

            },
            3000
        );

}


// ==========================================================
// CUSTOMER EMAIL CHANGE
// ==========================================================

const customerEmailField =
    document.getElementById(
        "customerEmail"
    );


if (customerEmailField) {

    customerEmailField.addEventListener(
        "change",
        () => {

            seenNotificationIds =
                new Set();


            immediatelyNotifiedOrderIds =
                new Set();


            checkNotifications(false);

        }
    );

}

// ==========================================================
// BASKET
// ==========================================================

async function loadBasket() {

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();

    if (!email) {

        alert(
            "Please enter customer email first."
        );

        return;
    }


    try {

        const result =
            await apiRequest(
                `${API_BASE_URL}/basket/${encodeURIComponent(email)}`
            );


        const basket =
            result.data;


        displayBasket(basket);


    } catch (error) {

        console.error(
            "Load basket error:",
            error
        );

        displayBasket(null);
    }
}


// ==========================================================
// ADD TO BASKET
// ==========================================================
async function addToBasket() {

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();

    const cakeId =
        basketCakeSelect.value;

    const quantity =
        Number(
            basketQuantity.value
        );


    if (!email) {

        alert(
            "Please enter customer email."
        );

        return;
    }


    if (!cakeId) {

        alert(
            "Please select a cake."
        );

        return;
    }


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        alert(
            "Quantity must be at least 1."
        );

        return;
    }


    try {

        await apiRequest(
            `${API_BASE_URL}/basket`,
            {
                method: "POST",

                body: JSON.stringify({

                    customerEmail:
                        email,

                    cakeId,

                    quantity

                })
            }
        );


        basketQuantity.value = 1;


        await loadBasket();


    } catch (error) {

        console.error(
            "Add to basket error:",
            error
        );

    }

}
// ==========================================================
// DISPLAY BASKET
// ==========================================================

function displayBasket(basket) {

    basketContainer.innerHTML = "";


    if (
        !basket ||
        !basket.items ||
        basket.items.length === 0
    ) {

        basketContainer.innerHTML = `
            <div class="basket-empty">
                Your basket is empty.
            </div>
        `;

        basketTotal.textContent = "₹0";

        return;
    }


    basket.items.forEach(
        (item) => {

            const basketItem =
                document.createElement("div");

            basketItem.className =
                "basket-item";


            const subtotal =
                Number(item.price) *
                Number(item.quantity);


            basketItem.innerHTML = `

                <div class="basket-item-info">

                    <strong>
                        ${escapeHtml(
                            item.cakeName
                        )}
                    </strong>

                    <span>
                        ₹${item.price} ×
                        ${item.quantity}
                    </span>

                </div>


                <div class="basket-item-subtotal">

                    ₹${subtotal}

                </div>


                <div class="basket-item-actions">

                    <button
                        type="button"
                        onclick="decreaseBasketItem('${item.cakeId}', ${item.quantity})"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        onclick="increaseBasketItem('${item.cakeId}', ${item.quantity})"
                    >
                        +
                    </button>


                    <button
                        type="button"
                        class="remove-btn"
                        onclick="removeFromBasket('${item.cakeId}')"
                    >
                        Remove
                    </button>

                </div>
            `;


            basketContainer.appendChild(
                basketItem
            );
        }
    );


    basketTotal.textContent =
        `₹${basket.totalAmount || 0}`;
}

// ==========================================================
// INCREASE BASKET ITEM
// ==========================================================

async function increaseBasketItem(
    cakeId,
    currentQuantity
) {

    await updateBasketItem(
        cakeId,
        currentQuantity + 1
    );
}

// ==========================================================
// UPDATE BASKET ITEM
// ==========================================================

async function updateBasketItem(
    cakeId,
    quantity
) {

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();


    if (!email) {

        alert(
            "Please enter customer email."
        );

        return;
    }


    try {

        await apiRequest(
            `${API_BASE_URL}/basket/${encodeURIComponent(email)}/${cakeId}`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    quantity
                })
            }
        );


        await loadBasket();


    } catch (error) {

        console.error(
            "Update basket error:",
            error
        );

    }

}

// ==========================================================
// REMOVE FROM BASKET
// ==========================================================

async function removeFromBasket(
    cakeId
) {

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();


    if (!email) {

        alert(
            "Please enter customer email."
        );

        return;
    }


    try {

        await apiRequest(
            `${API_BASE_URL}/basket/${encodeURIComponent(email)}/${cakeId}`,
            {
                method: "DELETE"
            }
        );


        await loadBasket();


    } catch (error) {

        console.error(
            "Remove basket item error:",
            error
        );

    }

}

// ==========================================================
// CLEAR BASKET
// ==========================================================

async function clearBasket() {

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();


    if (!email) {

        alert(
            "Please enter customer email."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear the basket?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `${API_BASE_URL}/basket/${encodeURIComponent(email)}`,
            {
                method: "DELETE"
            }
        );


        await loadBasket();


    } catch (error) {

        console.error(
            "Clear basket error:",
            error
        );
    }
}

// ==========================================================
// CHECKOUT
// ==========================================================

async function checkout() {

    const customerName =
        document
            .getElementById("customerName")
            .value
            .trim();

    const customerEmail =
        document
            .getElementById("customerEmail")
            .value
            .trim();

    const customerPhone =
        document
            .getElementById("customerPhone")
            .value
            .trim();

    const deliveryAddress =
        document
            .getElementById("deliveryAddress")
            .value
            .trim();

    const paymentMethod =
        document
            .getElementById("paymentMethod")
            .value;


    if (!customerName) {

        alert(
            "Please enter customer name."
        );

        return;
    }


    if (!customerEmail) {

        alert(
            "Please enter customer email."
        );

        return;
    }


    if (!customerPhone) {

        alert(
            "Please enter customer phone."
        );

        return;
    }


    if (!deliveryAddress) {

        alert(
            "Please enter delivery address."
        );

        return;
    }


    try {

        const result =
            await apiRequest(
                `${API_BASE_URL}/checkout/${encodeURIComponent(customerEmail)}`,
                {
                    method: "POST",

                    body: JSON.stringify({

                        customerName,

                        customerPhone,

                        deliveryAddress,

                        paymentMethod

                    })
                }
            );


        const createdOrder =
            result.data;


        // ==================================================
        // SHOW ORDER SUCCESS POPUP
        // ==================================================

        if (createdOrder) {

            if (
                createdOrder._id
            ) {

                immediatelyNotifiedOrderIds.add(
                    createdOrder._id
                );

            }


            showOrderCreatedPopup(
                createdOrder
            );
        }


        // ==================================================
        // CLEAR FORM
        // ==================================================

        document
            .getElementById("customerName")
            .value = "";

        document
            .getElementById("customerPhone")
            .value = "";

        document
            .getElementById("deliveryAddress")
            .value = "";


        // ==================================================
        // REFRESH BASKET
        // ==================================================

        await loadBasket();


        // ==================================================
        // REFRESH ORDERS
        // ==================================================

        await getAllOrders();


        // ==================================================
        // REFRESH CATALOG STOCK
        // ==================================================

        await loadCakes();


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );
    }
}

// ==========================================================
// CUSTOMER EMAIL CHANGE
// ==========================================================

const customerEmailInput =
    document.getElementById(
        "customerEmail"
    );


if (customerEmailInput) {

    customerEmailInput.addEventListener(
        "change",
        () => {

            loadBasket();

        }
    );

}



// ==========================================================
// INITIAL LOAD
// ==========================================================

checkServiceHealth();

getAllOrders();

loadCakes();

// Start notification polling.
startNotificationPolling();


// Add the first order item.
updateOrderTotals();