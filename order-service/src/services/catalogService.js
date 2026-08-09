const CATALOG_SERVICE_URL =
    process.env.CATALOG_SERVICE_URL;

const getCakeById = async (cakeId) => {
    const response = await fetch(
        `${CATALOG_SERVICE_URL}/api/catalog/cakes/${cakeId}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Catalog Service returned status ${response.status}`
        );
    }

    const result = await response.json();

    return result.data;
};

const reduceCakeStock = async (cakeId, quantity) => {
    const response = await fetch(
        `${CATALOG_SERVICE_URL}/api/catalog/cakes/${cakeId}/stock`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantity
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(
            result.message || "Unable to update cake stock"
        );

        error.statusCode = response.status;

        throw error;
    }

    return result.data;
};


const restoreCakeStock = async (cakeId, quantity) => {
    const response = await fetch(
        `${CATALOG_SERVICE_URL}/api/catalog/cakes/${cakeId}/stock/restore`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantity
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(
            result.message ||
            "Unable to restore cake stock"
        );

        error.statusCode = response.status;

        throw error;
    }

    return result.data;
};

module.exports = {
    getCakeById,
    reduceCakeStock,
    restoreCakeStock
};