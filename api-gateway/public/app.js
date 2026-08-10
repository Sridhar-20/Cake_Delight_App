// ==========================================================
// CAKE DELIGHT - UNIFIED FRONTEND
// ==========================================================


// ==========================================================
// API BASE URL
// ==========================================================

const API_BASE_URL = "api";


// ==========================================================
// CUSTOMER
// ==========================================================

let customerEmail =
    localStorage.getItem("cakeDelightCustomerEmail") || "";


// ==========================================================
// API HELPER
// ==========================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(options.headers || {})
                    },

                    ...options
                }
            );


        const contentType =
            response.headers.get(
                "content-type"
            );


        const data =
            contentType &&
            contentType.includes("application/json")

                ? await response.json()

                : await response.text();


        if (!response.ok) {

            const message =
                typeof data === "object"
                    ? data.message
                    : data;

            throw new Error(
                message ||
                `Request failed: ${response.status}`
            );

        }


        return data;

    } catch (error) {

        console.error(
            "API Request Error:",
            error
        );

        throw error;

    }

}


// ==========================================================
// NAVIGATION
// ==========================================================

function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    buttons.forEach(button => {

        if (
            button
                .getAttribute("onclick")
                ?.includes(
                    `'${sectionId}'`
                )
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    if (sectionId === "cakes") {

        loadCakes();

    }


    if (sectionId === "basket") {

        loadBasket();

    }


    if (sectionId === "orders") {

        loadOrders();

    }


    if (sectionId === "notifications") {

        loadNotifications();

    }

}


// ==========================================================
// TOAST
// ==========================================================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3000);

}


// ==========================================================
// LOAD CAKES
// ==========================================================

async function loadCakes() {

    const container =
        document.getElementById("cakesContainer");

    container.innerHTML = `
        <div class="loading">
            Loading cakes...
        </div>
    `;

    try {

        // ==================================================
        // LOAD CAKES
        // ==================================================

        const cakeResult =
            await apiRequest("/catalog/cakes");

        console.log(
            "Catalog response:",
            cakeResult
        );

        const cakes =
            cakeResult?.data?.cakes || [];

        if (cakes.length === 0) {

            container.innerHTML = `
                <div class="loading">
                    No cakes available.
                </div>
            `;

            return;
        }


        // ==================================================
        // LOAD ALL RATINGS
        // ==================================================

        let ratings = [];

        try {

            const ratingResult =
                await apiRequest("/ratings");

            console.log(
                "Ratings response:",
                ratingResult
            );

            ratings =
                ratingResult?.data || [];

        } catch (ratingError) {

            console.error(
                "Failed to load ratings:",
                ratingError
            );

            // Catalog should still work
            // even if Rating Service is unavailable.
            ratings = [];
        }


        // ==================================================
        // RENDER CAKES
        // ==================================================

        container.innerHTML =
            cakes
                .map(cake =>
                    createCakeCard(
                        cake,
                        ratings
                    )
                )
                .join("");


    } catch (error) {

        console.error(
            "Failed to load cakes:",
            error
        );

        container.innerHTML = `
            <div class="loading">

                <strong>
                    Unable to load cakes
                </strong>

                <br><br>

                ${escapeHtml(
                    error.message
                )}

            </div>
        `;

    }
}

// ==========================================================
// CREATE CAKE CARD
// ==========================================================

function createCakeCard(cake,ratings = []) {

    const cakeId = cake._id;

    // ==================================================
    // CAKE RATINGS
    // ==================================================

    const cakeRatings =
        ratings.filter(
            rating =>
                rating.cakeId === cakeId
        );

    const ratingCount =
        cakeRatings.length;

    const averageRating =
        ratingCount > 0
            ? cakeRatings.reduce(
                (sum, rating) =>
                    sum + Number(rating.rating || 0),
                0
            ) / ratingCount
            : 0;

    const roundedRating =
        Math.round(averageRating);

    const stars =
        "★".repeat(roundedRating) +
        "☆".repeat(5 - roundedRating);

    const image =
        cake.imageUrl ||
        "https://via.placeholder.com/500x300?text=Cake";


    const availability =
        cake.isAvailable && cake.stock > 0;


    return `

        <article class="cake-card">


            <div class="cake-image">

                <img
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(cake.name)}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="cake-content">


                <div class="cake-category">

                    ${escapeHtml(
                        cake.category || "Cake"
                    )}

                </div>


                <h3>

                    ${escapeHtml(
                        cake.name
                    )}

                </h3>


                <p class="cake-description">

                    ${escapeHtml(
                        cake.description ||
                        "Delicious freshly prepared cake."
                    )}

                </p>


                <div class="cake-info">

                    <span class="stock">

                        ${availability
                            ? `${cake.stock} available`
                            : "Out of stock"
                        }

                    </span>

                </div>


                <!-- ==================================================
                    RATING SUMMARY
                    ================================================== -->

                <div class="cake-rating-summary">

                    <span class="rating-stars">
                        ${stars}
                    </span>

                    ${
                        ratingCount > 0
                            ? `
                                <span class="rating-score">
                                    ${averageRating.toFixed(1)} / 5
                                </span>

                                <span class="rating-count">
                                    (${ratingCount}
                                    ${ratingCount === 1
                                        ? "review"
                                        : "reviews"})
                                </span>
                            `
                            : `
                                <span class="rating-count">
                                    No reviews yet
                                </span>
                            `
                    }

                </div>


                <div class="cake-footer">


                    <span class="price">

                        ₹${Number(
                            cake.price
                        ).toLocaleString("en-IN")}

                    </span>


                    <button
                        class="primary-btn"
                        ${!availability ? "disabled" : ""}
                        onclick="addCakeToBasket('${cakeId}')"
                    >

                        ${availability
                            ? "Add to Basket"
                            : "Out of Stock"
                        }
                    
                   </button>
                    


                </div>


                <div class="cake-rating-actions">

                    <button
                        type="button"
                        class="secondary-btn"
                        onclick="viewCakeReviews('${cakeId}')"
                    >
                        ⭐ View Reviews
                    </button>

                    <button
                        type="button"
                        class="secondary-btn"
                        onclick="openRatingForm(
                            '${cakeId}',
                            '${escapeHtml(cake.name)}'
                        )"
                    >
                        ✍️ Rate This Cake
                    </button>



            </div>

        </article>

    `;
}

// ==========================================================
// VIEW CAKE REVIEWS
// ==========================================================

async function viewCakeReviews(cakeId) {

    try {

        const result =
            await apiRequest(
                `/ratings/cake/${cakeId}`
            );

        console.log(
            "Cake ratings response:",
            result
        );

        const ratings =
            result?.data || [];


        if (ratings.length === 0) {

            alert(
                "No reviews available for this cake yet."
            );

            return;
        }


        const reviews =
            ratings
                .map(rating => {

                    const stars =
                        "★".repeat(
                            Number(rating.rating)
                        ) +
                        "☆".repeat(
                            5 - Number(rating.rating)
                        );

                    const date =
                        rating.createdAt
                            ? new Date(
                                rating.createdAt
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "";


                    return `
                        <div class="review-item">

                            <div class="review-header">

                                <span class="review-stars">
                                    ${stars}
                                </span>

                                <span class="review-date">
                                    ${date}
                                </span>

                            </div>

                            <p class="review-text">
                                ${escapeHtml(
                                    rating.review ||
                                    "No review provided."
                                )}
                            </p>

                            <p class="review-customer">
                                — ${escapeHtml(
                                    rating.customerEmail
                                )}
                            </p>

                        </div>
                    `;

                })
                .join("");


        const average =
            ratings.reduce(
                (sum, rating) =>
                    sum +
                    Number(rating.rating || 0),
                0
            ) / ratings.length;


        alert(
            `Average Rating: ${average.toFixed(1)} / 5\n\n` +
            ratings
                .map(
                    rating =>
                        `${"★".repeat(
                            Number(rating.rating)
                        )}${"☆".repeat(
                            5 - Number(rating.rating)
                        )}\n` +
                        `${rating.review || ""}\n` +
                        `— ${rating.customerEmail}`
                )
                .join("\n\n")
        );

    } catch (error) {

        console.error(
            "Failed to load cake reviews:",
            error
        );

        showToast(
            error.message ||
            "Unable to load reviews."
        );

    }
}

// ==========================================================
// OPEN RATING FORM
// ==========================================================

function openRatingForm(cakeId, cakeName) {

    const email =
        document
            .getElementById("customerEmail")
            ?.value
            ?.trim();


    if (!email) {

        showToast(
            "Please enter your customer email first."
        );

        return;
    }


    const rating =
        prompt(
            `Rate ${cakeName}\n\n` +
            `Enter a rating from 1 to 5:`
        );


    if (rating === null) {
        return;
    }


    const ratingNumber =
        Number(rating);


    if (
        !Number.isInteger(ratingNumber) ||
        ratingNumber < 1 ||
        ratingNumber > 5
    ) {

        showToast(
            "Rating must be a number from 1 to 5."
        );

        return;
    }


    const review =
        prompt(
            "Write your review:"
        );


    if (review === null) {
        return;
    }


    submitRating(
        cakeId,
        email,
        ratingNumber,
        review
    );
}

// ==========================================================
// SUBMIT RATING
// ==========================================================

async function submitRating(
    cakeId,
    customerEmail,
    rating,
    review
) {

    try {

        const result =
            await apiRequest(
                "/ratings",
                {
                    method: "POST",

                    body: JSON.stringify({

                        cakeId,

                        customerEmail,

                        rating,

                        review

                    })
                }
            );


        console.log(
            "Rating created:",
            result
        );


        showToast(
            "Thank you! Your rating was submitted successfully. ⭐"
        );


        // Refresh cakes so the
        // average rating changes immediately.
        await loadCakes();


    } catch (error) {

        console.error(
            "Submit rating failed:",
            error
        );


        showToast(
            error.message ||
            "Unable to submit rating."
        );

    }
}


// ==========================================================
// ADD CAKE TO BASKET
// ==========================================================

async function addCakeToBasket(cakeId) {

    const emailInput =
        document.getElementById("customerEmail");


    if (!emailInput) {

        console.error(
            "customerEmail input not found"
        );

        showToast(
            "Customer email field is missing."
        );

        return;
    }


    const customerEmail =
        emailInput.value.trim();


    if (!customerEmail) {

        showToast(
            "Please enter your customer email first."
        );

        showSection("home");

        return;
    }


    try {

        const result =
            await apiRequest(
                "/orders/basket",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customerEmail:
                            customerEmail,

                        cakeId:
                            cakeId,

                        quantity: 1

                    })
                }
            );


        console.log(
            "Add to basket response:",
            result
        );


        // Show success message
        showToast(
            "Cake added to basket successfully!"
        );


        // Refresh basket
        await loadBasket();


        // Refresh basket count
        await updateBasketCount();


    } catch (error) {

        console.error(
            "Add to basket failed:",
            error
        );


        showToast(
            error.message ||
            "Unable to add cake to basket."
        );

    }
}


// ==========================================================
// LOAD CUSTOMER BASKET
// ==========================================================

async function loadBasket() {

    const customerEmail =
        document.getElementById("customerEmail")
            .value
            .trim();


    const basketContainer =
        document.getElementById(
            "basketContainer"
        );


    if (!customerEmail) {

        basketContainer.innerHTML = `
            <p>
                Enter customer email to load basket.
            </p>
        `;

        return;
    }


    basketContainer.innerHTML = `
        <p>
            Loading basket...
        </p>
    `;


    try {

        const result =
            await apiRequest(
                `/orders/basket/${encodeURIComponent(
                    customerEmail
                )}`
            );


        console.log(
            "Basket response:",
            result
        );


        const basket =
            result?.data;


        if (
            !basket ||
            !basket.items ||
            basket.items.length === 0
        ) {

            basketContainer.innerHTML = `
                <div class="empty-basket">

                    <h3>
                        Your basket is empty 🛒
                    </h3>

                    <p>
                        Add a cake from the catalog.
                    </p>

                </div>
            `;

            updateBasketTotal(0);

            return;
        }


        renderBasket(basket);


    } catch (error) {

        console.error(
            "Load basket failed:",
            error
        );


        basketContainer.innerHTML = `
            <div class="error-message">

                Unable to load basket.

                <br>

                ${escapeHtml(
                    error.message
                )}

            </div>
        `;

    }
}

// ==========================================================
// RENDER BASKET
// ==========================================================

function renderBasket(basket) {

    const container =
        document.getElementById(
            "basketContainer"
        );

    const items =
        basket.items || [];

    let total = 0;

    container.innerHTML =
        items
            .map(item => {

                const subtotal =
                    Number(
                        item.subtotal ??
                        (
                            Number(item.price) *
                            Number(item.quantity)
                        )
                    );

                total += subtotal;

                return `

                    <div class="basket-item">

                        <div class="basket-item-info">

                            <h3>
                                ${escapeHtml(
                                    item.cakeName ||
                                    "Cake"
                                )}
                            </h3>

                            <p>
                                ₹${Number(
                                    item.price
                                ).toLocaleString("en-IN")}

                                ×

                                ${item.quantity}
                            </p>

                        </div>


                        <div class="basket-item-subtotal">

                            <strong>
                                ₹${subtotal.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>


                        <div class="basket-item-actions">

                            <button
                                type="button"
                                class="remove-btn"
                                onclick="removeFromBasket('${item.cakeId}')"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");


    updateBasketTotal(total);

    // Update basket count
    updateBasketCount();
}

// ==========================================================
// REMOVE ITEM FROM BASKET
// ==========================================================

async function removeFromBasket(cakeId) {

    const emailInput =
        document.getElementById(
            "customerEmail"
        );


    if (!emailInput) {

        showToast(
            "Customer email field is missing."
        );

        return;
    }


    const customerEmail =
        emailInput.value.trim();


    if (!customerEmail) {

        showToast(
            "Please enter your customer email first."
        );

        showSection("home");

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to remove this cake from your basket?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/orders/basket/${encodeURIComponent(customerEmail)}/${cakeId}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Cake removed from basket successfully!"
        );


        // Reload basket
        await loadBasket();


        // Update basket count
        await updateBasketCount();


    } catch (error) {

        console.error(
            "Remove from basket failed:",
            error
        );


        showToast(
            error.message ||
            "Unable to remove cake from basket."
        );

    }
}


// ==========================================================
// UPDATE BASKET COUNT
// ==========================================================


async function updateBasketCount() {

    const emailInput =
        document.getElementById(
            "customerEmail"
        );


    const countElement =
        document.getElementById(
            "basketCount"
        );


    if (!emailInput || !countElement) {

        return;

    }


    const customerEmail =
        emailInput.value.trim();


    if (!customerEmail) {

        countElement.textContent = "0";

        return;

    }


    try {

        const result =
            await apiRequest(
                `/orders/basket/${encodeURIComponent(
                    customerEmail
                )}`
            );


        const basket =
            result?.data;


        const count =
            basket?.items?.reduce(
                (total, item) => {

                    return (
                        total +
                        Number(
                            item.quantity || 0
                        )
                    );

                },
                0
            ) || 0;


        countElement.textContent =
            count;


    } catch (error) {

        console.error(
            "Failed to update basket count:",
            error
        );

    }

}

// ==========================================================
// UPDATE BASKET TOTAL
// ==========================================================

function updateBasketTotal(total) {

    const totalElement =
        document.getElementById(
            "basketTotal"
        );


    if (totalElement) {

        totalElement.textContent =
            `₹${Number(total).toLocaleString("en-IN")}`;

    }
}

// ==========================================================
// ORDER CREATED POPUP
// ==========================================================

function showOrderCreatedPopup(order) {

    const orderId =
        order?._id || "N/A";

    const totalAmount =
        Number(order?.totalAmount || 0)
            .toLocaleString("en-IN");

    const customerName =
        order?.customerName || "Customer";

    alert(
        `Order placed successfully! 🎉\n\n` +
        `Thank you, ${customerName}!\n\n` +
        `Order ID: ${orderId}\n` +
        `Total Amount: ₹${totalAmount}\n` +
        `Status: ${order?.status || "PLACED"}`
    );
}

// ==========================================================
// CHECKOUT & CREATE ORDER
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


    // ======================================================
    // VALIDATION
    // ======================================================

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


    if (!paymentMethod) {

        alert(
            "Please select payment method."
        );

        return;
    }


    try {

        // ==================================================
        // GET CURRENT BASKET
        // ==================================================

        const basketResult =
            await apiRequest(
                `/orders/basket/${encodeURIComponent(
                    customerEmail
                )}`
            );


        const basket =
            basketResult.data;


        // ==================================================
        // CHECK BASKET
        // ==================================================

        if (
            !basket ||
            !basket.items ||
            basket.items.length === 0
        ) {

            alert(
                "Your basket is empty."
            );

            return;
        }


        // ==================================================
        // CONVERT BASKET ITEMS TO ORDER ITEMS
        // ==================================================

        const items =
            basket.items.map(
                item => ({

                    cakeId:
                        item.cakeId,

                    quantity:
                        item.quantity

                })
            );


        // ==================================================
        // CREATE ORDER REQUEST
        // ==================================================

        const orderData = {

            customerName,

            customerEmail,

            customerPhone,

            items,

            deliveryAddress,

            paymentMethod

        };


        console.log(
            "Creating order:",
            orderData
        );


        // ==================================================
        // CREATE ORDER THROUGH API GATEWAY
        // ==================================================

        const result =
            await apiRequest(
                "/orders",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );


        console.log(
            "Create order response:",
            result
        );


        // ==================================================
        // CREATED ORDER
        // ==================================================

        const createdOrder =
            result.data;


        if (!createdOrder) {

            throw new Error(
                "Order was created but no order data was returned."
            );

        }


        // ==================================================
        // CLEAR BASKET AFTER SUCCESSFUL ORDER
        // ==================================================

        try {

            await apiRequest(
                `/orders/basket/${encodeURIComponent(customerEmail)}`,
                {
                    method: "DELETE"
                }
            );

            console.log(
                "Basket cleared successfully after order."
            );

        } catch (basketError) {

            console.error(
                "Failed to clear basket after order:",
                basketError
            );

            showToast(
                "Order created, but basket could not be cleared."
            );

        }


        // ==================================================
        // REFRESH BASKET
        // ==================================================

        await loadBasket();


        // ==================================================
        // UPDATE BASKET COUNT
        // ==================================================

        await updateBasketCount();


        // ==================================================
        // SUCCESS POPUP
        // ==================================================

        showOrderCreatedPopup(
            createdOrder
        );


        // ==================================================
        // WAIT FOR ORDER NOTIFICATION
        // ==================================================

        await waitForOrderNotification(
            customerEmail,
            createdOrder._id
        );


        // ==================================================
        // REFRESH ORDERS
        // ==================================================

        await loadOrders();


        // ==================================================
        // REFRESH CATALOG
        // ==================================================

        await loadCakes();


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );


        alert(
            error.message ||
            "Unable to create order."
        );

    }

}

// ==========================================================
// LOAD ORDERS
// ==========================================================

async function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );

    if (!container) {
        console.error(
            "ordersContainer not found"
        );
        return;
    }


    // ======================================================
    // CUSTOMER EMAIL
    // ======================================================

    const emailInput =
        document.getElementById(
            "customerEmail"
        );

    const customerEmail =
        emailInput
            ? emailInput.value.trim()
            : "";


    if (!customerEmail) {

        container.innerHTML = `
            <div class="empty-state">

                <span>📦</span>

                <h3>
                    No customer selected
                </h3>

                <p>
                    Enter your customer email
                    to view your orders.
                </p>

            </div>
        `;

        return;
    }


    // ======================================================
    // LOADING
    // ======================================================

    container.innerHTML = `
        <div class="loading">
            Loading your orders...
        </div>
    `;


    try {

        // ==================================================
        // GET ALL ORDERS THROUGH API GATEWAY
        // ==================================================

        const result =
            await apiRequest(
                "/orders"
            );


        console.log(
            "Orders response:",
            result
        );


        // ==================================================
        // GET ORDERS FROM RESPONSE
        // ==================================================

        let orders =
            result?.data?.orders ||
            result?.data ||
            [];


        // Make sure orders is an array

        if (!Array.isArray(orders)) {
            orders = [];
        }


        // ==================================================
        // SHOW ONLY CURRENT CUSTOMER'S ORDERS
        // ==================================================

        orders =
            orders.filter(
                order =>
                    order.customerEmail
                        ?.toLowerCase()
                        === customerEmail.toLowerCase()
            );


        // ==================================================
        // NO ORDERS
        // ==================================================

        if (orders.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <span>📦</span>

                    <h3>
                        No orders found
                    </h3>

                    <p>
                        You have not placed any orders yet.
                    </p>

                    <button
                        class="primary-btn"
                        onclick="showSection('cakes')"
                    >
                        Browse Cakes
                    </button>

                </div>
            `;

            return;
        }


        // ==================================================
        // RENDER ORDERS
        // ==================================================

        container.innerHTML =
            orders
                .map(
                    order =>
                        createOrderCard(order)
                )
                .join("");


    } catch (error) {

        console.error(
            "Load orders failed:",
            error
        );


        container.innerHTML = `
            <div class="error-message">

                <strong>
                    Unable to load orders
                </strong>

                <br><br>

                ${escapeHtml(
                    error.message ||
                    "Something went wrong."
                )}

            </div>
        `;

    }

}

// ==========================================================
// CREATE ORDER CARD
// ==========================================================

function createOrderCard(order) {

    const orderId =
        order._id || "N/A";


    const status =
        order.status || "UNKNOWN";


    const totalAmount =
        Number(
            order.totalAmount || 0
        );


    const orderDate =
        order.createdAt
            ? new Date(
                order.createdAt
            ).toLocaleString("en-IN")
            : "N/A";


    const items =
        order.items || [];


    const itemsHtml =
        items.length > 0

            ? items
                .map(
                    item => {

                        const subtotal =
                            Number(
                                item.subtotal ??
                                (
                                    Number(item.price || 0) *
                                    Number(item.quantity || 0)
                                )
                            );


                        return `
                            <div class="order-item">

                                <div>
                                    <strong>
                                        ${escapeHtml(
                                            item.cakeName ||
                                            "Cake"
                                        )}
                                    </strong>

                                    <p>
                                        ₹${Number(
                                            item.price || 0
                                        ).toLocaleString("en-IN")}
                                        ×
                                        ${item.quantity || 0}
                                    </p>

                                </div>


                                <strong>
                                    ₹${subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>
                        `;

                    }
                )
                .join("")

            : `
                <p>
                    No items found.
                </p>
            `;


    return `

        <article class="order-card">

            <div class="order-card-header">

                <div>

                    <p class="section-label">
                        ORDER
                    </p>

                    <h3>
                        #${escapeHtml(orderId)}
                    </h3>

                </div>


                <span
                    class="order-status status-${String(
                        status
                    ).toLowerCase()}"
                >
                    ${escapeHtml(status)}
                </span>

            </div>


            <div class="order-date">

                📅 ${escapeHtml(orderDate)}

            </div>


            <div class="order-items">

                ${itemsHtml}

            </div>


            <div class="order-details">

                <div>

                    <span>
                        Payment Method
                    </span>

                    <strong>
                        ${escapeHtml(
                            order.paymentMethod ||
                            "N/A"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Delivery Address
                    </span>

                    <strong>
                        ${escapeHtml(
                            order.deliveryAddress ||
                            "N/A"
                        )}
                    </strong>

                </div>

            </div>


            <div class="order-total">

                <span>
                    Total Amount
                </span>

                <strong>
                    ₹${totalAmount.toLocaleString(
                        "en-IN"
                    )}
                </strong>

            </div>

        </article>

    `;
}


// ==========================================================
// LOAD NOTIFICATIONS
// ==========================================================

async function loadNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );

    if (!container) return;

    const email =
        document.getElementById(
            "customerEmail"
        )?.value?.trim();

    if (!email) {

        container.innerHTML = `
            <div class="empty-state">
                <span>🔔</span>
                <h3>Enter your email</h3>
                <p>
                    Enter your customer email to view notifications.
                </p>
            </div>
        `;

        updateNotificationCount(0);

        return;
    }


    container.innerHTML = `
        <div class="loading">
            Loading notifications...
        </div>
    `;


    try {

        const response =
            await fetch(
                `/api/notifications/customer/${encodeURIComponent(email)}`
            );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to load notifications"
            );

        }


        const notifications =
            result.data || [];


        updateNotificationCount(
            notifications.filter(
                notification =>
                    !notification.isRead
            ).length
        );


        if (notifications.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <span>🔔</span>

                    <h3>No notifications</h3>

                    <p>
                        You don't have any notifications yet.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML =
            notifications
                .map(
                    notification =>
                        createNotificationCard(
                            notification
                        )
                )
                .join("");


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-message">
                Unable to load notifications.
                <br>
                ${error.message}
            </div>
        `;

    }

}


// ==========================================================
// CREATE NOTIFICATION CARD
// ==========================================================

function createNotificationCard(
    notification
) {

    const date =
        notification.createdAt
            ? new Date(
                notification.createdAt
            ).toLocaleString()
            : "";


    const unreadClass =
        notification.isRead
            ? "notification-read"
            : "notification-unread";


    const readLabel =
        notification.isRead
            ? "✓ Read"
            : "● New";


    return `
        <div
            class="notification-card ${unreadClass}"
            data-id="${notification._id}"
        >

            <div class="notification-card-header">

                <div>

                    <span class="notification-type">
                        🔔 ${notification.type
                            ? notification.type.replace(
                                /_/g,
                                " "
                            )
                            : "NOTIFICATION"}
                    </span>

                    <h3>
                        ${notification.title}
                    </h3>

                </div>


                <span class="notification-status">
                    ${readLabel}
                </span>

            </div>


            <p class="notification-message">
                ${notification.message}
            </p>


            <div class="notification-meta">

                <span>
                    📅 ${date}
                </span>

                ${
                    notification.orderId
                        ? `
                            <span>
                                🧾 Order:
                                ${notification.orderId}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="notification-actions">

                ${
                    !notification.isRead
                        ? `
                            <button
                                class="secondary-btn"
                                onclick="markNotificationAsRead('${notification._id}')"
                            >
                                ✓ Mark as Read
                            </button>
                          `
                        : ""
                }


                <button
                    class="danger-btn"
                    onclick="deleteNotification('${notification._id}')"
                >
                    🗑 Delete
                </button>

            </div>

        </div>
    `;
}

// ==========================================================
// MARK NOTIFICATION AS READ
// ==========================================================

async function markNotificationAsRead(
    notificationId
) {

    try {

        const response =
            await fetch(
                `/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH"
                }
            );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to mark notification as read"
            );

        }


        await loadNotifications();


    } catch (error) {

        console.error(
            "Mark notification as read error:",
            error
        );


        alert(
            error.message ||
            "Unable to mark notification as read"
        );

    }

}

// ==========================================================
// DELETE NOTIFICATION
// ==========================================================

async function deleteNotification(
    notificationId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this notification?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `/api/notifications/${notificationId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to delete notification"
            );

        }


        await loadNotifications();


    } catch (error) {

        console.error(
            "Delete notification error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete notification"
        );

    }

}

// ==========================================================
// UPDATE NOTIFICATION COUNT
// ==========================================================

function updateNotificationCount(
    count
) {

    const badge =
        document.getElementById(
            "notificationCount"
        );


    if (!badge) return;


    badge.textContent = count;


    if (count > 0) {

        badge.classList.add(
            "has-notifications"
        );

    } else {

        badge.classList.remove(
            "has-notifications"
        );

    }

}
// ==========================================================
// ORDER NOTIFICATION POPUP
// ==========================================================

function showOrderNotificationPopup(
    notification
) {

    const message = `
🔔 ${notification.title}

${notification.message}
`;


    alert(message);

}
// ==========================================================
// WAIT FOR ORDER NOTIFICATION
// ==========================================================

async function waitForOrderNotification(
    customerEmail,
    orderId
) {

    const maxAttempts = 5;

    const delay = 1000;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        try {

            const response =
                await fetch(
                    `/api/notifications/customer/${encodeURIComponent(customerEmail)}`
                );


            if (!response.ok) {
                throw new Error(
                    "Unable to load notifications"
                );
            }


            const result =
                await response.json();


            if (result.success) {

                const notifications =
                    result.data || [];


                const notification =
                    notifications.find(
                        item =>
                            item.orderId === orderId
                    );


                if (notification) {

                    updateNotificationCount(
                        notifications.filter(
                            item => !item.isRead
                        ).length
                    );


                    showOrderNotificationPopup(
                        notification
                    );


                    return notification;
                }

            }

        } catch (error) {

            console.error(
                "Notification check failed:",
                error
            );

        }


        // Wait before checking again

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    delay
                )
        );

    }


    console.log(
        "Order notification not available yet."
    );

    return null;
}



// ==========================================================
// HTML ESCAPE
// ==========================================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ==========================================================
// INITIALIZATION
// ==========================================================

// document.addEventListener(
//     "DOMContentLoaded",
//     () => {

//         loadCakes();

//         updateBasketCount();

//     }
// );

document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        checkout
    );


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const emailInput =
            document.getElementById(
                "customerEmail"
            );


        if (emailInput) {

            emailInput.addEventListener(
                "change",
                updateBasketCount
            );

        }


        loadCakes();

        updateBasketCount();

    }
);