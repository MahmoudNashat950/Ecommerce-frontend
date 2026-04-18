import React from "react";

function PromoCarousel() {
  return (
    <div id="promoCarousel" className="carousel slide mb-5 rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="hero-slide bg-light d-flex align-items-center justify-content-between p-5" style={{ minHeight: "320px" }}>
            <div>
              <h1 className="display-6 fw-bold">Shop the latest deals</h1>
              <p className="lead text-muted">Discover top brands, exclusive discounts and fast delivery.</p>
              <button className="btn btn-primary btn-lg">Explore Offers</button>
            </div>
            <div className="hero-image bg-white rounded-4 d-flex align-items-center justify-content-center" style={{ width: "320px", height: "240px" }}>
              <span className="text-muted">Banner Image</span>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="hero-slide bg-white d-flex align-items-center justify-content-between p-5" style={{ minHeight: "320px" }}>
            <div>
              <h1 className="display-6 fw-bold">Fresh arrivals every day</h1>
              <p className="lead text-muted">Find the products you love with clean, fast shopping.</p>
              <button className="btn btn-outline-primary btn-lg">Shop Now</button>
            </div>
            <div className="hero-image bg-light rounded-4 d-flex align-items-center justify-content-center" style={{ width: "320px", height: "240px" }}>
              <span className="text-muted">Fresh Collection</span>
            </div>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default PromoCarousel;
