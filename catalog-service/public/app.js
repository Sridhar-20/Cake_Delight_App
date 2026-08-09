const API_BASE_URL = "/api/catalog/cakes"; // Base URL for catalog APIs.

const cakeTableBody = document.getElementById("cakeTableBody"); // Cake table body.
const apiResponse = document.getElementById("apiResponse"); // API response display.
const resultCount = document.getElementById("resultCount"); // Result count display.
const serviceStatus = document.getElementById("serviceStatus"); // Service status text.
const statusDot = document.getElementById("statusDot"); // Service status indicator.
const editModal = document.getElementById("editModal"); // Edit modal.


async function apiRequest(url, options = {}) { // Sends an API request and handles the response.

    try {

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        });

        const data = await response.json();

        showApiResponse(data);

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
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


function showApiResponse(data) { // Displays API response JSON on the page.

    apiResponse.textContent =
        JSON.stringify(data, null, 2);
}


async function checkServiceHealth() { // Checks whether the Catalog Service is running.

    try {

        const response = await fetch("/health");

        if (!response.ok) {
            throw new Error();
        }

        serviceStatus.textContent = "Service Online";
        statusDot.style.background = "#087443";

    } catch (error) {

        serviceStatus.textContent = "Service Offline";
        statusDot.style.background = "#b42318";
    }
}


async function getAllCakes() { // Retrieves all cakes from the Catalog Service.

    try {

        const data = await apiRequest(API_BASE_URL);

        displayCakes(data.data?.cakes || []);

    } catch (error) {

        displayCakes([]);
    }
}


function displayCakes(cakes) { // Displays cakes inside the catalog table.

    cakeTableBody.innerHTML = "";

    resultCount.textContent =
        `${cakes.length} cake${cakes.length === 1 ? "" : "s"}`;

    if (cakes.length === 0) {

        cakeTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No cakes found.
                </td>
            </tr>
        `;

        return;
    }

    cakes.forEach((cake) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(cake.name)}</td>

            <td>${escapeHtml(cake.category)}</td>

            <td>₹${cake.price}</td>

            <td>${cake.stock}</td>

            <td>
                <span class="${cake.isAvailable && cake.stock > 0
                    ? "available"
                    : "unavailable"}">

                    ${cake.isAvailable && cake.stock > 0
                        ? "Available"
                        : "Unavailable"}

                </span>
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick='openEditModal(${JSON.stringify(cake)})'>
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteCake('${cake._id}')">
                    Delete
                </button>

            </td>
        `;

        cakeTableBody.appendChild(row);
    });
}


async function searchCakes() { // Searches cakes by name.

    const name =
        document.getElementById("searchName").value.trim();

    if (!name) {

        alert("Please enter a cake name.");

        return;
    }

    try {

        const data = await apiRequest(
            `${API_BASE_URL}/search?name=${encodeURIComponent(name)}`
        );

        displayCakes(data.data?.cakes || []);

    } catch (error) {

        displayCakes([]);
    }
}


async function filterCategory() { // Filters cakes by category.

    const category =
        document.getElementById("categoryFilter").value.trim();

    if (!category) {

        alert("Please enter a category.");

        return;
    }

    try {

        const data = await apiRequest(
            `${API_BASE_URL}/category/${encodeURIComponent(category)}`
        );

        displayCakes(data.data?.cakes || []);

    } catch (error) {

        displayCakes([]);
    }
}


async function filterPrice() { // Filters cakes using minimum and maximum prices.

    const min =
        document.getElementById("minPrice").value;

    const max =
        document.getElementById("maxPrice").value;

    if (!min && !max) {

        alert("Enter minimum or maximum price.");

        return;
    }

    const params = new URLSearchParams();

    if (min) {
        params.append("min", min);
    }

    if (max) {
        params.append("max", max);
    }

    try {

        const data = await apiRequest(
            `${API_BASE_URL}/filter?${params.toString()}`
        );

        displayCakes(data.data?.cakes || []);

    } catch (error) {

        displayCakes([]);
    }
}


async function getAvailableCakes() { // Retrieves cakes currently available for purchase.

    try {

        const data = await apiRequest(
            `${API_BASE_URL}/available`
        );

        displayCakes(data.data?.cakes || []);

    } catch (error) {

        displayCakes([]);
    }
}


document
    .getElementById("createCakeForm")
    .addEventListener("submit", async (event) => { // Handles cake creation form submission.

        event.preventDefault();

        const cake = {

            name:
                document.getElementById("cakeName").value.trim(),

            description:
                document.getElementById("cakeDescription").value.trim(),

            category:
                document.getElementById("cakeCategory").value.trim(),

            price:
                Number(document.getElementById("cakePrice").value),

            stock:
                Number(document.getElementById("cakeStock").value),

            imageUrl:
                document.getElementById("cakeImageUrl").value.trim(),

            isAvailable:
                document.getElementById("cakeAvailable").checked
        };

        try {

            await apiRequest(API_BASE_URL, {
                method: "POST",
                body: JSON.stringify(cake)
            });

            event.target.reset();

            document.getElementById("cakeAvailable").checked = true;

            await getAllCakes();

        } catch (error) {
            // API error is already displayed.
        }
    });


function openEditModal(cake) { // Opens the edit form with existing cake information.

    document.getElementById("editCakeId").value = cake._id;

    document.getElementById("editCakeName").value = cake.name;

    document.getElementById("editCakeDescription").value =
        cake.description;

    document.getElementById("editCakeCategory").value =
        cake.category;

    document.getElementById("editCakePrice").value =
        cake.price;

    document.getElementById("editCakeStock").value =
        cake.stock;

    document.getElementById("editCakeImageUrl").value =
        cake.imageUrl || "";

    document.getElementById("editCakeAvailable").checked =
        cake.isAvailable;

    editModal.style.display = "flex";
}


function closeEditModal() { // Closes the edit cake modal.

    editModal.style.display = "none";
}


document
    .getElementById("editCakeForm")
    .addEventListener("submit", async (event) => { // Handles cake update form submission.

        event.preventDefault();

        const id =
            document.getElementById("editCakeId").value;

        const cake = {

            name:
                document.getElementById("editCakeName").value.trim(),

            description:
                document.getElementById("editCakeDescription").value.trim(),

            category:
                document.getElementById("editCakeCategory").value.trim(),

            price:
                Number(document.getElementById("editCakePrice").value),

            stock:
                Number(document.getElementById("editCakeStock").value),

            imageUrl:
                document.getElementById("editCakeImageUrl").value.trim(),

            isAvailable:
                document.getElementById("editCakeAvailable").checked
        };

        try {

            await apiRequest(
                `${API_BASE_URL}/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(cake)
                }
            );

            closeEditModal();

            await getAllCakes();

        } catch (error) {
            // API error is already displayed.
        }
    });


async function deleteCake(id) { // Deletes a cake after user confirmation.

    const confirmed =
        confirm("Are you sure you want to delete this cake?");

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `${API_BASE_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        await getAllCakes();

    } catch (error) {
        // API error is already displayed.
    }
}


function escapeHtml(value) { // Prevents HTML injection when displaying text.

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


checkServiceHealth(); // Checks service availability when the page loads.
getAllCakes(); // Loads the catalog when the page opens.