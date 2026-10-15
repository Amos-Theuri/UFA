// src/Pages/Merchendise.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import {
  getMerchandise,
  subscribeToMerchandise,
  fetchMerchandiseFromSupabase
} from "../services/merchandiseService";
import { resolveMerchImage } from "../lib/assetResolvers";
import armBand from "../assets/merch_1.png";
import "../styles/style.css";

export default function Merchendise() {
  const [products, setProducts] = useState(() => getMerchandise());

  useEffect(() => {
    fetchMerchandiseFromSupabase().then((latest) => {
      if (latest && latest.length > 0) {
        setProducts(latest);
      }
    });

    const unsubscribe = subscribeToMerchandise((updated) => {
      setProducts(updated);
    });
    return unsubscribe;
  }, []);

  const activeProducts = products.filter((p) => p.isActive !== false);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="text-content">
            <div className="hero-badge">
              <ShoppingBag size={16} />
              <span>Official Association Store</span>
            </div>
            <h1>
              Wear the Pride of <span className="gradient-text">UFA Kenya</span>
            </h1>
            <p>
              Support our nationwide youth initiatives with official Unique Focus Association branded apparel, accessories, and executive merchandise.
            </p>
            <div className="hero-actions">
              <a href="#merch-section" className="btn-primary">
                <span>Browse Products</span>
                <ArrowRight size={18} />
              </a>
              <Link to="/Contact" className="btn-secondary">
                <span>Bulk / Custom Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section id="merch-section">
        <div className="section-head">
          <div className="badge-pill">Quality Merchandise</div>
          <h2 className="section-title">Official UFA Products</h2>
          <p className="section-subtitle">
            Every purchase directly supports our youth empowerment programs, mentorship hubs, and community outreach.
          </p>
        </div>

        {activeProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <p>Our merchandise catalogue is currently being refreshed. Please check back shortly.</p>
          </div>
        ) : (
          <div className="products-grid">
            {activeProducts.map((item) => {
              const imgSrc = resolveMerchImage(item);
              return (
                <article key={item.id} className="product-card">
                  <div className="product-image-box">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = armBand;
                      }}
                    />
                    {item.badge && <span className="product-badge">{item.badge}</span>}
                  </div>

                  <div className="product-details">
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-desc">{item.desc}</p>
                    <Link
                      to="/Contact"
                      className="product-order-btn"
                      aria-label={`Order or inquire about ${item.name}`}
                    >
                      <MessageSquare size={16} />
                      <span>Order / Inquire</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-content">
            <h2>Need Custom or Chapter Bulk Orders?</h2>
            <p>
              We provide custom batches for county chapters, institutional partners, and special youth conference delegations.
            </p>
            <Link to="/Contact" className="btn-primary">
              <Sparkles size={18} />
              <span>Contact Merchandise Desk</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
