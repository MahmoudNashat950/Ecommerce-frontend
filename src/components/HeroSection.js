import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

function HeroSection({
  heroImage,
  featuredProducts = [],
  categoryCount = 0,
  productCount = 0,
}) {
  return (
    <section className="relative isolate flex min-h-screen items-end overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div
        className="absolute inset-0 hero-zoom bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,217,255,0.18),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0.28),rgba(5,5,5,0.86)_55%,rgba(5,5,5,0.98))]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:36px_36px] opacity-20" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_360px] lg:items-end">
        <div className="page-fade-up max-w-3xl">
          <span className="glass-chip mb-6">
            Elite sportswear. Precision engineered.
          </span>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
            UNLEASH YOUR PERFORMANCE
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/[0.72] sm:text-lg">
            High-velocity footwear, performance layers, and athlete-first gear
            built for training sessions, match days, and every rep in between.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link className="premium-button btn-ripple" to="/products">
              Shop Now
            </Link>
            <Link className="premium-button-secondary btn-ripple" to="/categories">
              Explore Collections
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { label: "Curated products", value: String(productCount) },
              { label: "Collections", value: String(categoryCount) },
              { label: "Validated visuals", value: "100%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/[0.45]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-fade-up lg:justify-self-end">
          <div className="rounded-[2rem] border border-white/10 bg-black/[0.35] p-5 shadow-glass backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/[0.45]">
                  Spotlight
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Velocity Edit
                </h2>
              </div>
              <span className="rounded-full border border-pulse/[0.3] bg-pulse/10 px-3 py-1 text-xs font-medium text-pulse">
                New
              </span>
            </div>

            <div className="space-y-4">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <div
                  key={product.id}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3 transition duration-500 hover:border-electric/50 hover:bg-white/[0.08]"
                >
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.05]">
                    <ProductImage
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      fallbackSrc={product.placeholderImage}
                      src={product.images[0]}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/[0.35]">
                      0{index + 1}
                    </p>
                    <p className="truncate text-sm font-medium text-white">
                      {product.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
