import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ProductDetailsSkeleton } from "../components/LoadingSkeletons";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import StarRating from "../components/StarRating";

import {
  getProductById,
  deleteProduct,
} from "../services/productService";

import {
  getReviewsByProduct,
  getReviewSummary,
  createReview,
} from "../services/reviewService";

import { DEFAULT_PRODUCT_IMAGE } from "../types/product";
import { getToken } from "../utils/auth";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  // ================= ROLE =================
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsSeller(payload.role === "Seller");
      setIsBuyer(payload.role === "Buyer");
    } catch {
      setIsSeller(false);
      setIsBuyer(false);
    }
  }, []);

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const productRes = await getProductById(id);
      setProduct(productRes);

      const reviewsRes = await getReviewsByProduct(id);
      setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);

      const summaryRes = await getReviewSummary(id);
      setSummary(summaryRes || { totalReviews: 0, averageRating: 0 });
    } catch {
      addToast({
        variant: "error",
        message: "Failed to load product details",
      });
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteProduct(id);

      addToast({
        variant: "success",
        message: "Product deleted",
      });

      navigate("/seller/products");
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Delete failed",
      });
    }
  };

  // ================= SUBMIT REVIEW =================
  const handleReview = async () => {
    if (!ratingValue) {
      addToast({
        variant: "warning",
        message: "Please select a rating",
      });
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        productId: Number(id),
        rating: Number(ratingValue),
        comment: comment.trim(),
      });

      setRatingValue(0);
      setComment("");

      await fetchData();

      addToast({
        variant: "success",
        message: "Review submitted successfully",
      });
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Failed to submit review",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ================= PRICE =================
  const price = Number(product?.price || 0);
  const finalPrice =
    product?.discount > 0
      ? price - (price * product.discount) / 100
      : price;

  // ================= RATING =================
  const rating =
    Number(summary?.averageRating ?? product?.rating ?? 0) || 0;

  const totalReviews =
    Number(summary?.totalReviews ?? reviews.length ?? 0);

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center py-5">
          <h4>Product Not Found</h4>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/products")}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">

      {/* PRODUCT */}
      <div className="card p-4 mb-4">
        <div className="row g-4">

          <div className="col-md-5">
            <img
              src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="col-md-7">
            <h2>{product.name}</h2>

            <h4 className="text-success">
              ${finalPrice.toFixed(2)}
            </h4>

            <div className="d-flex align-items-center gap-2 mb-3">
              <StarRating value={rating} readOnly />
              <b>{rating.toFixed(1)}</b>
              <span className="text-muted">
                ({totalReviews})
              </span>
            </div>

            <p>Stock: {product.stock}</p>
            <p>Delivery: {product.deliveryTimeInDays} days</p>

            {isSeller && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/seller/edit/${id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REVIEW FORM (BEST UX) */}
      {isBuyer && (
        <div className="card p-4 mb-4">
          <h4>Write a Review</h4>

          {/* STAR RATING */}
          <StarRating
            value={ratingValue}
            onChange={(v) => setRatingValue(Number(v))}
            size="lg"
          />

          {/* COMMENT */}
          <textarea
            className="form-control mt-3"
            rows="3"
            placeholder="Write your comment (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className="btn btn-success mt-3"
            disabled={!ratingValue || submitting}
            onClick={handleReview}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="card p-4">
        <h4>Reviews ({reviews.length})</h4>

        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="border-bottom py-3"
            >
              <StarRating value={r.rating} readOnly />

              <p className="mb-1">
                {r.comment || "No comment"}
              </p>

              <small className="text-muted">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleString()
                  : ""}
              </small>
            </div>
          ))
        )}
      </div>

      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
}

export default ProductDetails;