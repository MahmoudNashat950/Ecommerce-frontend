import React from "react";

/**
 * ProductCardSkeleton
 * Animated skeleton loader for product cards
 */
export function ProductCardSkeleton() {
    return (
        <div className="product-card shadow-sm bg-white skeleton-loading">
            <div className="product-card-img skeleton-placeholder" style={{ height: "200px" }} />
            <div className="product-card-body p-3">
                <div className="skeleton-text skeleton-title mb-2" style={{ width: "80%" }} />
                <div className="skeleton-text skeleton-subtitle mb-3" style={{ width: "60%" }} />
                <div className="skeleton-text mb-3" style={{ width: "40%" }} />
                <div className="skeleton-text mb-2" style={{ width: "100%" }} />
                <div className="d-flex gap-2">
                    <div className="skeleton-text flex-grow-1" style={{ height: "36px" }} />
                    <div className="skeleton-text flex-grow-1" style={{ height: "36px" }} />
                </div>
            </div>
        </div>
    );
}

/**
 * ProductCardSkeletonGrid
 * Multiple product card skeletons in a grid
 */
export function ProductCardSkeletonGrid({ count = 8 }) {
    return (
        <div className="row g-4">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="col-lg-3 col-md-4 col-sm-6">
                    <ProductCardSkeleton />
                </div>
            ))}
        </div>
    );
}

/**
 * OrderCardSkeleton
 * Animated skeleton loader for order cards
 */
export function OrderCardSkeleton() {
    return (
        <div className="card mb-3 shadow-sm border-0 rounded-3 skeleton-loading">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="skeleton-text skeleton-title" style={{ width: "150px" }} />
                    <div className="skeleton-text" style={{ width: "100px", height: "24px" }} />
                </div>
                <div className="skeleton-text mb-3" style={{ width: "200px" }} />
                <div className="mb-3">
                    <div className="skeleton-text mb-2" style={{ width: "100%", height: "6px" }} />
                </div>
                <div className="skeleton-text mb-2" style={{ width: "100%" }} />
                <div className="skeleton-text" style={{ width: "60%" }} />
            </div>
        </div>
    );
}

/**
 * OrderCardSkeletonList
 * Multiple order card skeletons
 */
export function OrderCardSkeletonList({ count = 3 }) {
    return (
        <div>
            {Array.from({ length: count }).map((_, idx) => (
                <OrderCardSkeleton key={idx} />
            ))}
        </div>
    );
}

/**
 * ProductDetailsSkeleton
 * Skeleton loader for product details page
 */
export function ProductDetailsSkeleton() {
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-5 mb-4">
                    <div className="skeleton-placeholder" style={{ height: "400px", borderRadius: "12px" }} />
                </div>
                <div className="col-md-7">
                    <div className="skeleton-text skeleton-title mb-3" style={{ width: "70%" }} />
                    <div className="skeleton-text mb-4" style={{ width: "50%" }} />
                    <div className="skeleton-text mb-2" style={{ width: "100%" }} />
                    <div className="skeleton-text mb-4" style={{ width: "60%" }} />
                    <div className="d-flex gap-2 mb-4">
                        <div className="skeleton-text flex-grow-1" style={{ height: "48px" }} />
                        <div className="skeleton-text flex-grow-1" style={{ height: "48px" }} />
                    </div>
                    <div className="mt-5 pt-4 border-top">
                        <div className="skeleton-text skeleton-title mb-3" style={{ width: "40%" }} />
                        <div className="skeleton-text mb-2" style={{ width: "100%" }} />
                        <div className="skeleton-text mb-2" style={{ width: "100%" }} />
                        <div className="skeleton-text" style={{ width: "70%" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
