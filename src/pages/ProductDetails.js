import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FlagUserModal from "../components/FlagUserModal";
import { ProductDetailsSkeleton } from "../components/LoadingSkeletons";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import StarRating from "../components/StarRating";
import { getProductById, deleteProduct } from "../services/productService";
import { flagSeller } from "../services/flagService";
import {
  getReviewsByProduct,
  getReviewSummary,
  createReview,
} from "../services/reviewService";
import { DEFAULT_PRODUCT_IMAGE } from "../types/product";
import { getToken, getUserRole } from "../utils/auth";

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
  const [reporting, setReporting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  const sellerName = product?.sellerName || "Seller unavailable";
  const hasSellerId = product?.sellerId !== null && product?.sellerId !== undefined;
  const reportTarget = product
    ? {
        id: product.sellerId,
        name: sellerName,
        role: "seller",
      }
    : null;

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    const role = getUserRole();
    setIsSeller(role === "seller");
    setIsBuyer(role === "buyer");
  }, []);

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

  const handleOpenReportSeller = () => {
    if (!hasSellerId) {
      addToast({
        variant: "error",
        message: "Seller information is not available for this product.",
      });
      return;
    }

    setIsReportModalOpen(true);
  };

  const handleSubmitSellerReport = async (reason) => {
    if (!hasSellerId) {
      addToast({
        variant: "error",
        message: "Seller information is not available for this product.",
      });
      return;
    }

    setReporting(true);

    try {
      await flagSeller(product.sellerId, reason);
      addToast({
        variant: "success",
        message: `${sellerName} reported successfully.`,
      });
      setIsReportModalOpen(false);
    } catch (err) {
      addToast({
        variant: "error",
        message: err.message || "Unable to report this seller.",
      });
    } finally {
      setReporting(false);
    }
  };

  const price = Number(product?.price || 0);
  const finalPrice =
    product?.discount > 0
      ? price - (price * product.discount) / 100
      : price;

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
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
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
            <p className="text-muted mb-3">
              Seller: <span className="fw-semibold text-dark">{sellerName}</span>
            </p>

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

            {isBuyer && (
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleOpenReportSeller}
                  disabled={!hasSellerId}
                >
                  Report Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isBuyer && (
        <div className="card p-4 mb-4">
          <h4>Write a Review</h4>

          <StarRating
            value={ratingValue}
            onChange={(v) => setRatingValue(Number(v))}
            size="lg"
          />

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

      <div className="card p-4">
        <h4>Reviews ({reviews.length})</h4>

        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-bottom py-3"
            >
              <StarRating value={review.rating} readOnly />

              <p className="mb-1">
                {review.comment || "No comment"}
              </p>

              <small className="text-muted">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleString()
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

      <FlagUserModal
        user={reportTarget}
        isOpen={isReportModalOpen}
        loading={reporting}
        onClose={() => {
          if (!reporting) {
            setIsReportModalOpen(false);
          }
        }}
        onSubmit={handleSubmitSellerReport}
        title="Report Seller"
        kicker="Buyer Report"
        description={`Report ${sellerName} for issues related to ${product.name}.`}
        submitLabel="Submit Report"
        showUserId={false}
      />
    </div>
  );
}

export default ProductDetails;
