/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 * @property {number} deliveryTimeInDays
 * @property {string} category
 * @property {string | null} imageUrl
 * @property {number | null} discount
 * @property {number | null} Rating
 * @property {number | null} ReviewsCount
 */

export const DEFAULT_PRODUCT_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3e%3crect width='640' height='480' fill='%23f4f1ea'/%3e%3crect x='80' y='90' width='480' height='300' rx='24' fill='%23e2dacb'/%3e%3ccircle cx='220' cy='210' r='42' fill='%23c9b898'/%3e%3cpath d='M160 330l92-88 72 70 52-48 104 66H160z' fill='%23a58d68'/%3e%3ctext x='50%25' y='430' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%2366522d'%3eNo image available%3c/text%3e%3c/svg%3e";

/**
 * @param {Partial<Product> | null | undefined} product
 * @returns {Product | null}
 */
export const normalizeProduct = (product) => {
  if (!product) return null;

  // ================= SAFELY NORMALIZE RATING =================
  // Handle both lowercase (rating) and uppercase (Rating) from backend
  let rating = null;
  if (product.rating !== null && product.rating !== undefined) {
    const numRating = Number(product.rating);
    rating = !isNaN(numRating) ? numRating : null;
  } else if (product.Rating !== null && product.Rating !== undefined) {
    const numRating = Number(product.Rating);
    rating = !isNaN(numRating) ? numRating : null;
  }

  // ================= SAFELY NORMALIZE REVIEWS COUNT =================
  let reviewsCount = 0;
  if (product.reviewsCount !== null && product.reviewsCount !== undefined) {
    const numCount = Number(product.reviewsCount);
    reviewsCount = !isNaN(numCount) ? numCount : 0;
  } else if (product.ReviewsCount !== null && product.ReviewsCount !== undefined) {
    const numCount = Number(product.ReviewsCount);
    reviewsCount = !isNaN(numCount) ? numCount : 0;
  }

  return {
    id: Number(product.id ?? 0),
    name: product.name ?? "",
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    deliveryTimeInDays: Number(product.deliveryTimeInDays ?? 0),

    category: product.category ?? product.categoryName ?? "",

    imageUrl: product.imageUrl ?? null,

    discount:
      product.discount === null || product.discount === undefined
        ? 0
        : Number(product.discount),

    // ✅ NORMALIZED RATING (handles both casing)
    rating: rating,

    // ✅ NORMALIZED REVIEWS COUNT
    reviewsCount: reviewsCount,
  };
};

/**
 * @param {unknown} products
 * @returns {Product[]}
 */
export const normalizeProductList = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .map((product) => normalizeProduct(product))
    .filter(Boolean);
};
