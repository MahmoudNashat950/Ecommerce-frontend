import React from "react";

function LoadingSkeleton({ count = 3 }) {
    return (
        <div className="row g-4">
            {Array.from({ length: count }).map((_, index) => (
                <div className="col-12 col-sm-6 col-xl-4" key={index}>
                    <div className="skeleton-card">
                        <div className="skeleton skeleton-image mb-3" />
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-text" />
                        <div className="skeleton skeleton-text w-75" />
                        <div className="d-flex gap-2 mt-3">
                            <div className="skeleton skeleton-button" />
                            <div className="skeleton skeleton-button w-50" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LoadingSkeleton;
