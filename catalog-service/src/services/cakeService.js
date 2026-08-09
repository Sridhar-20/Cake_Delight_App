const Cake = require("../models/Cake"); // Cake database model.

// Allowed fields for cake sorting.
const ALLOWED_SORT_FIELDS = [
    "name",
    "price",
    "stock",
    "category",
    "createdAt",
    "updatedAt"
];


const createCake = async (cakeData) => { // Creates a new cake.
    const cake = await Cake.create(cakeData);

    return cake;
};


const getAllCakes = async ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
} = {}) => { // Retrieves paginated and sorted cakes.

    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
        ? sortBy
        : "createdAt"; // Uses createdAt for unsupported sort fields.

    const skip = (page - 1) * limit; // Calculates pagination offset.

    const sortDirection = sortOrder === "asc" ? 1 : -1; // MongoDB sort direction.

    const cakes = await Cake.find()
        .sort({ [safeSortBy]: sortDirection })
        .skip(skip)
        .limit(limit);

    const totalCakes = await Cake.countDocuments();

    const totalPages = Math.ceil(totalCakes / limit);

    return {
        cakes,
        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: totalCakes,
            totalPages
        }
    };
};


const getCakeById = async (cakeId) => { // Retrieves a cake by ID.
    const cake = await Cake.findById(cakeId);

    return cake;
};


const updateCake = async (cakeId, cakeData) => { // Updates an existing cake.
    const updatedCake = await Cake.findByIdAndUpdate(
        cakeId,
        cakeData,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedCake;
};


const deleteCake = async (cakeId) => { // Deletes an existing cake.
    const deletedCake = await Cake.findByIdAndDelete(cakeId);

    return deletedCake;
};


const searchCakesByName = async (name) => { // Searches cakes by name.

    const cakes = await Cake.find({
        name: {
            $regex: name,
            $options: "i"
        }
    });

    return cakes;
};


const getCakesByCategory = async (category) => { // Retrieves cakes by category.

    const cakes = await Cake.find({
        category: {
            $regex: `^${category}$`,
            $options: "i"
        }
    });

    return cakes;
};


const getCakesByPriceRange = async (minPrice, maxPrice) => { // Filters cakes by price range.

    const priceQuery = {};

    if (minPrice !== undefined) {
        priceQuery.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
        priceQuery.$lte = maxPrice;
    }

    const cakes = await Cake.find({
        price: priceQuery
    }).sort({ price: 1 });

    return cakes;
};


const getAvailableCakes = async () => { // Retrieves cakes that are available and in stock.

    const cakes = await Cake.find({
        isAvailable: true,
        stock: {
            $gt: 0
        }
    });

    return cakes;
};

const updateCakeStock = async (id, quantity) => { // Updates the stock of a cake after an order is placed.

    const cake = await Cake.findOneAndUpdate(
        {
            _id: id,
            stock: { $gte: quantity }
        },
        {
            $inc: {
                stock: -quantity
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!cake) {
        return null;
    }

    cake.isAvailable = cake.stock > 0;

    await cake.save();

    return cake;
};

const restoreCakeStock = async (id, quantity) => {
    const cake = await Cake.findById(id);

    if (!cake) {
        return null;
    }

    cake.stock += quantity;
    cake.isAvailable = cake.stock > 0;

    await cake.save();

    return cake;
};


module.exports = {
    createCake,
    getAllCakes,
    getCakeById,
    updateCake,
    deleteCake,
    searchCakesByName,
    getCakesByCategory,
    getCakesByPriceRange,
    getAvailableCakes,
    updateCakeStock,
    restoreCakeStock
};