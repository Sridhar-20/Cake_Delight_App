// ==========================================================
// CONFIGURATION
// ==========================================================

const RATING_API =
    "http://localhost:5004/api/ratings";

const CATALOG_API =
    "http://localhost:5001/api/catalog/cakes";

// ==========================================================
// GLOBAL DATA
// ==========================================================

let cakes = [];

let ratings = [];


// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkRatingService();

        loadCakes();

        setupCharacterCounters();

    }
);


// ==========================================================
// CHECK RATING SERVICE
// ==========================================================

async function checkRatingService() {

    const statusDot =
        document.getElementById("statusDot");

    const serviceStatus =
        document.getElementById("serviceStatus");


    try {

        const response =
            await fetch(
                RATING_API
            );


        if (response.ok) {

            statusDot.style.background =
                "#087443";

            serviceStatus.textContent =
                "Rating Service Online";

        } else {

            statusDot.style.background =
                "#b42318";

            serviceStatus.textContent =
                "Rating Service Error";

        }

    } catch (error) {

        statusDot.style.background =
            "#b42318";

        serviceStatus.textContent =
            "Rating Service Offline";

    }

}


// ==========================================================
// LOAD CAKES FROM CATALOG SERVICE
// ==========================================================

async function loadCakes() {

    const cakeSelect =
        document.getElementById("cakeSelect");

    const ratingCakeFilter =
        document.getElementById(
            "ratingCakeFilter"
        );


    try {

        cakeSelect.innerHTML = `
            <option value="">
                Loading cakes...
            </option>
        `;


        ratingCakeFilter.innerHTML = `
            <option value="">
                Loading cakes...
            </option>
        `;


        const response =
            await fetch(
                CATALOG_API
            );


        const result =
            await response.json();


        console.log(
            "Catalog Service Response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load cakes"
            );

        }


        // ==================================================
        // IMPORTANT
        // Catalog Service response:
        //
        // {
        //     success: true,
        //     data: {
        //         cakes: [...]
        //     }
        // }
        // ==================================================

        cakes =
            result.data?.cakes || [];


        populateCakeSelects();


    } catch (error) {

        console.error(
            "Load cakes error:",
            error
        );


        cakeSelect.innerHTML = `
            <option value="">
                Unable to load cakes
            </option>
        `;


        ratingCakeFilter.innerHTML = `
            <option value="">
                Unable to load cakes
            </option>
        `;


        showNotification(
            "Catalog Service Error",
            error.message ||
            "Unable to load cakes.",
            "error"
        );

    }

}


// ==========================================================
// POPULATE CAKE DROPDOWNS
// ==========================================================

function populateCakeSelects() {

    const cakeSelect =
        document.getElementById(
            "cakeSelect"
        );

    const ratingCakeFilter =
        document.getElementById(
            "ratingCakeFilter"
        );


    cakeSelect.innerHTML = `
        <option value="">
            Select a cake
        </option>
    `;


    ratingCakeFilter.innerHTML = `
        <option value="">
            Select a cake
        </option>
    `;


    if (!cakes.length) {

        cakeSelect.innerHTML = `
            <option value="">
                No cakes available
            </option>
        `;


        ratingCakeFilter.innerHTML = `
            <option value="">
                No cakes available
            </option>
        `;

        return;

    }


    cakes.forEach(
        cake => {

            const cakeId =
                cake._id;


            const cakeName =
                cake.name ||
                "Unnamed Cake";


            const price =
                cake.price !== undefined
                    ? ` - ₹${cake.price}`
                    : "";


            // ==============================================
            // CREATE OPTION FOR RATING FORM
            // ==============================================

            const ratingOption =
                document.createElement(
                    "option"
                );


            ratingOption.value =
                cakeId;


            ratingOption.textContent =
                `${cakeName}${price}`;


            cakeSelect.appendChild(
                ratingOption
            );


            // ==============================================
            // CREATE OPTION FOR RATING FILTER
            // ==============================================

            const filterOption =
                document.createElement(
                    "option"
                );


            filterOption.value =
                cakeId;


            filterOption.textContent =
                cakeName;


            ratingCakeFilter.appendChild(
                filterOption
            );

        }
    );

}


// ==========================================================
// CREATE RATING
// ==========================================================

async function createRating() {

    const customerEmail =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    const cakeId =
        document.getElementById(
            "cakeSelect"
        ).value;


    const rating =
        document.getElementById(
            "rating"
        ).value;


    const review =
        document.getElementById(
            "review"
        ).value.trim();


    // ------------------------------------------------------
    // CLIENT VALIDATION
    // ------------------------------------------------------

    if (!customerEmail) {

        showNotification(
            "Validation Error",
            "Please enter customer email.",
            "error"
        );

        return;

    }


    if (!isValidEmail(customerEmail)) {

        showNotification(
            "Validation Error",
            "Please enter a valid email address.",
            "error"
        );

        return;

    }


    if (!cakeId) {

        showNotification(
            "Validation Error",
            "Please select a cake.",
            "error"
        );

        return;

    }


    if (!rating) {

        showNotification(
            "Validation Error",
            "Please select a rating.",
            "error"
        );

        return;

    }


    if (!review) {

        showNotification(
            "Validation Error",
            "Please write a review.",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                RATING_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        cakeId: cakeId,

                        customerEmail:
                            customerEmail,

                        rating:
                            Number(rating),

                        review:
                            review

                    })

                }
            );


        const result =
            await response.json();


        displayApiResponse(
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to create rating"
            );

        }


        showNotification(
            "Rating Submitted",
            "Your rating has been submitted successfully.",
            "success"
        );


        clearRatingForm();


        // Automatically load ratings for the selected cake

        document.getElementById(
            "ratingCakeFilter"
        ).value = cakeId;


        await loadRatingsByCake();


    } catch (error) {

        console.error(
            "Create rating error:",
            error
        );


        showNotification(
            "Error",
            error.message ||
            "Failed to create rating.",
            "error"
        );

    }

}


// ==========================================================
// LOAD ALL RATINGS
// ==========================================================

async function loadAllRatings() {

    try {

        const response =
            await fetch(
                RATING_API
            );


        const result =
            await response.json();


        displayApiResponse(
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load ratings"
            );

        }


        ratings =
            Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                    ? result
                    : [];


        renderRatings(
            ratings
        );


    } catch (error) {

        console.error(
            "Load ratings error:",
            error
        );


        showNotification(
            "Error",
            error.message ||
            "Failed to load ratings.",
            "error"
        );

    }

}


// ==========================================================
// LOAD RATINGS
// ==========================================================

async function loadRatings() {

    await loadAllRatings();

}


// ==========================================================
// LOAD RATINGS BY CAKE
// ==========================================================

async function loadRatingsByCake() {

    const cakeId =
        document.getElementById(
            "ratingCakeFilter"
        ).value;


    if (!cakeId) {

        showNotification(
            "Select Cake",
            "Please select a cake first.",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${RATING_API}/cake/${cakeId}`
            );


        const result =
            await response.json();


        displayApiResponse(
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load cake ratings"
            );

        }


        ratings =
            Array.isArray(result.data)
                ? result.data
                : Array.isArray(result)
                    ? result
                    : [];


        renderRatings(
            ratings
        );


    } catch (error) {

        console.error(
            "Load cake ratings error:",
            error
        );


        showNotification(
            "Error",
            error.message ||
            "Failed to load cake ratings.",
            "error"
        );

    }

}


// ==========================================================
// RENDER RATINGS
// ==========================================================

function renderRatings(
    ratingList
) {

    const container =
        document.getElementById(
            "ratingsContainer"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    resultCount.textContent =
        `${ratingList.length} rating${ratingList.length === 1 ? "" : "s"}`;


    if (!ratingList.length) {

        container.innerHTML = `
            <div class="empty-state">
                No ratings found.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    ratingList.forEach(
        rating => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "rating-card";


            const ratingId =
                rating._id ||
                rating.id;


            const stars =
                getStars(
                    rating.rating
                );


            const customerEmail =
                rating.customerEmail ||
                "Unknown customer";


            const review =
                rating.review ||
                "No review";


            const createdAt =
                formatDate(
                    rating.createdAt
                );


            card.innerHTML = `

                <div class="rating-card-header">

                    <div>

                        <div class="rating-customer">

                            ${escapeHtml(
                                customerEmail
                            )}

                        </div>

                        <div class="rating-date">

                            ${createdAt}

                        </div>

                    </div>


                    <div class="rating-stars">

                        ${stars}

                    </div>

                </div>


                <div class="rating-review">

                    ${escapeHtml(
                        review
                    )}

                </div>


                <div class="rating-actions">

                    <button
                        type="button"
                        class="rating-action-btn edit-btn"
                        onclick="openEditModal('${ratingId}')"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="rating-action-btn delete-btn"
                        onclick="deleteRating('${ratingId}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================================
// OPEN EDIT MODAL
// ==========================================================

function openEditModal(
    ratingId
) {

    const rating =
        ratings.find(
            item =>
                (item._id || item.id) ===
                ratingId
        );


    if (!rating) {

        showNotification(
            "Error",
            "Rating not found.",
            "error"
        );

        return;

    }


    document.getElementById(
        "editRatingId"
    ).value =
        ratingId;


    document.getElementById(
        "editRating"
    ).value =
        rating.rating;


    document.getElementById(
        "editReview"
    ).value =
        rating.review || "";


    updateEditReviewCount();


    document.getElementById(
        "editRatingModal"
    ).style.display =
        "flex";

}


// ==========================================================
// CLOSE EDIT MODAL
// ==========================================================

function closeEditModal() {

    document.getElementById(
        "editRatingModal"
    ).style.display =
        "none";

}


// ==========================================================
// UPDATE RATING
// ==========================================================

async function updateRating() {

    const ratingId =
        document.getElementById(
            "editRatingId"
        ).value;


    const rating =
        document.getElementById(
            "editRating"
        ).value;


    const review =
        document.getElementById(
            "editReview"
        ).value.trim();


    if (!rating) {

        showNotification(
            "Validation Error",
            "Please select a rating.",
            "error"
        );

        return;

    }


    if (!review) {

        showNotification(
            "Validation Error",
            "Please enter a review.",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${RATING_API}/${ratingId}`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        rating:
                            Number(rating),

                        review:
                            review

                    })

                }
            );


        const result =
            await response.json();


        displayApiResponse(
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update rating"
            );

        }


        showNotification(
            "Rating Updated",
            "Your rating has been updated successfully.",
            "success"
        );


        closeEditModal();


        await reloadCurrentRatings();


    } catch (error) {

        console.error(
            "Update rating error:",
            error
        );


        showNotification(
            "Error",
            error.message ||
            "Failed to update rating.",
            "error"
        );

    }

}


// ==========================================================
// DELETE RATING
// ==========================================================

async function deleteRating(
    ratingId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this rating?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${RATING_API}/${ratingId}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.json();


        displayApiResponse(
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete rating"
            );

        }


        showNotification(
            "Rating Deleted",
            "The rating has been deleted successfully.",
            "success"
        );


        await reloadCurrentRatings();


    } catch (error) {

        console.error(
            "Delete rating error:",
            error
        );


        showNotification(
            "Error",
            error.message ||
            "Failed to delete rating.",
            "error"
        );

    }

}


// ==========================================================
// RELOAD CURRENT RATINGS
// ==========================================================

async function reloadCurrentRatings() {

    const cakeId =
        document.getElementById(
            "ratingCakeFilter"
        ).value;


    if (cakeId) {

        await loadRatingsByCake();

    } else {

        await loadAllRatings();

    }

}


// ==========================================================
// CLEAR RATING FORM
// ==========================================================

function clearRatingForm() {

    document.getElementById(
        "cakeSelect"
    ).value = "";


    document.getElementById(
        "rating"
    ).value = "";


    document.getElementById(
        "review"
    ).value = "";


    updateReviewCount();

}


// ==========================================================
// CHARACTER COUNTERS
// ==========================================================

function setupCharacterCounters() {

    const review =
        document.getElementById(
            "review"
        );


    const editReview =
        document.getElementById(
            "editReview"
        );


    if (review) {

        review.addEventListener(
            "input",
            updateReviewCount
        );

    }


    if (editReview) {

        editReview.addEventListener(
            "input",
            updateEditReviewCount
        );

    }

}


// ==========================================================
// REVIEW CHARACTER COUNT
// ==========================================================

function updateReviewCount() {

    const review =
        document.getElementById(
            "review"
        );


    const counter =
        document.getElementById(
            "reviewCount"
        );


    if (review && counter) {

        counter.textContent =
            review.value.length;

    }

}


// ==========================================================
// EDIT REVIEW CHARACTER COUNT
// ==========================================================

function updateEditReviewCount() {

    const review =
        document.getElementById(
            "editReview"
        );


    const counter =
        document.getElementById(
            "editReviewCount"
        );


    if (review && counter) {

        counter.textContent =
            review.value.length;

    }

}


// ==========================================================
// API RESPONSE
// ==========================================================

function displayApiResponse(
    data
) {

    const responseElement =
        document.getElementById(
            "apiResponse"
        );


    responseElement.textContent =
        JSON.stringify(
            data,
            null,
            2
        );

}


// ==========================================================
// POPUP NOTIFICATION
// ==========================================================

function showNotification(
    title,
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "notificationPopupContainer"
        );


    const popup =
        document.createElement(
            "div"
        );


    popup.className =
        `notification-popup ${type}`;


    popup.innerHTML = `

        <div class="notification-popup-header">

            <strong>
                ${escapeHtml(title)}
            </strong>


            <button
                type="button"
                class="notification-popup-close"
            >
                ×
            </button>

        </div>


        <div class="notification-popup-message">

            ${escapeHtml(message)}

        </div>

    `;


    const closeButton =
        popup.querySelector(
            ".notification-popup-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            popup.remove();

        }
    );


    container.appendChild(
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
// EMAIL VALIDATION
// ==========================================================

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// ==========================================================
// STAR DISPLAY
// ==========================================================

function getStars(
    rating
) {

    const numericRating =
        Number(rating) || 0;


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= numericRating
                ? "⭐"
                : "☆";

    }


    return stars;

}


// ==========================================================
// DATE FORMAT
// ==========================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "Date unavailable";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleString();

}


// ==========================================================
// HTML ESCAPING
// ==========================================================

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================================

window.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "editRatingModal"
            );


        if (
            event.target === modal
        ) {

            closeEditModal();

        }

    }
);