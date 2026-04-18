import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PRODUCT_IMAGE } from "../types/product";
import { getReviewsByProduct, createReview } from "../services/reviewService";
import useToast from "../hooks/useToast";

function ProductCard({ product, onAddToCart, disabled = false }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);

  const {
    id,
    name,
    price,
    category,
    categoryName,
    imageUrl,
    discount,
    rating,
    averageRating,
    reviewsCount,
    totalReviews,
    stock,
    deliveryTimeInDays,
  } = product || {};

  // LOAD PREVIEW REVIEW
  useEffect(() => {
    if (!id) return;

    getReviewsByProduct(id)
      .then((data) =>
        setReviews(Array.isArray(data) ? data.slice(0, 1) : [])
      )
      .catch(() => setReviews([]));
  }, [id]);

  const productRating = Math.max(
    0,
    Math.min(5, Number(averageRating ?? rating ?? 0))
  );

  const productReviewsCount =
    Number(reviewsCount ?? totalReviews ?? 0) || 0;

  const finalPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  const isOutOfStock = stock <= 0;

  // ⭐ AUTO RATE ON CLICK
  const handleRate = async (star) => {
    try {
      setRatingValue(star);

      await createReview({
        productId: id,
        rating: star,
        comment: "",
      });

      addToast?.({
        variant: "success",
        message: "Rating submitted",
      });

      const updated = await getReviewsByProduct(id);
      setReviews(updated.slice(0, 1));

    } catch (err) {
      addToast?.({
        variant: "error",
        message: err.message || "Failed to rate product",
      });
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">

      {/* IMAGE */}
      <div style={{ height: 220, background: "#f8f9fa" }}>
        <img
          src={imageUrl || DEFAULT_PRODUCT_IMAGE}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div className="card-body d-flex flex-column">

        <small className="text-muted">
          {categoryName || category}
        </small>

        <h6 className="fw-bold">{name}</h6>

        {/* ⭐ STARS (AUTO RATE) */}
        <div className="mb-2">
          <div className="d-flex gap-1 align-items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRate(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "1.3rem",
                  color:
                    star <= (ratingValue || productRating)
                      ? "#ffc107"
                      : "#ddd",
                }}
              >
                ★
              </span>
            ))}

            <small className="text-muted">
              ({productReviewsCount})
            </small>
          </div>
        </div>

        {/* PRICE */}
        <div className="fw-bold text-success">
          ${finalPrice.toFixed(2)}
        </div>

        {/* STOCK */}
        <small className="text-muted mb-2">
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </small>

        {/* ACTIONS */}
        <div className="mt-auto d-flex gap-2">

          <button
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={() => navigate(`/buyer/product/${id}`)}
          >
            View
          </button>

          <button
            className="btn btn-success btn-sm flex-fill"
            disabled={isOutOfStock || disabled}
            onClick={() => onAddToCart?.(id)}
          >
            Order
          </button>

        </div>

        {/* REVIEWS */}
        <button
          className="btn btn-link btn-sm mt-2"
          onClick={() => navigate(`/buyer/product/${id}#reviews`)}
        >
          See all reviews →
        </button>
      </div>
    </div>
  );
}

export default ProductCard;