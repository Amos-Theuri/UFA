// src/Pages/Merchendise.jsx
import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import armBand from "../assets/merch_1.png";
import noteBook from "../assets/merch_2.png";
import Scarf from "../assets/merch_3.png";
import Hoodie from "../assets/merch_4.png";
import Umbrella from "../assets/merch_5.png";
import Cap from "../assets/merch_6.png";
import Tshirt from "../assets/merch_7.png";
import Polo from "../assets/merch_8.png";
import Shirt from "../assets/merch_9.png";
import "../styles/style.css";

export default function Merchendise() {
  const products = [
    {
      id: "armband",
      name: "UFA Official Arm Band",
      desc: "Premium quality silicone wristband showing solidarity with UFA's national youth movement.",
      image: armBand,
      badge: "Official Gear"
    },
    {
      id: "notebook",
      name: "Executive Hardcover Notebook",
      desc: "Durable branded notebook for leadership workshops, conferences, and daily planning.",
      image: noteBook,
      badge: "Best Seller"
    },
    {
      id: "scarf",
      name: "UFA Commemorative Scarf",
      desc: "Soft woven association scarf designed for summits and formal chapter gatherings.",
      image: Scarf,
      badge: "Official Gear"
    },
    {
      id: "hoodie",
      name: "Heavyweight Hooded Sweater",
      desc: "Ultra-comfortable fleece hoodie featuring high-density embroidered UFA branding.",
      image: Hoodie,
      badge: "Popular"
    },
    {
      id: "umbrella",
      name: "Windproof Executive Umbrella",
      desc: "Heavy-duty full-sized umbrella with reinforced frame and distinctive UFA insignia.",
      image: Umbrella,
      badge: "Essential"
    },
    {
      id: "cap",
      name: "Branded Baseball Caps",
      desc: "Breathable cotton twill caps with adjustable clasp and sharp embroidery.",
      image: Cap,
      badge: "Popular"
    },
    {
      id: "tshirt",
      name: "UFA Premium Cotton T-Shirt",
      desc: "100% breathable organic cotton t-shirt tailored for youth rallies and casual wear.",
      image: Tshirt,
      badge: "Essential"
    },
    {
      id: "polo",
      name: "Classic Embroidered Polo",
      desc: "Smart-casual pique polo shirt suited for county chapter meetings and corporate outreach.",
      image: Polo,
      badge: "Executive"
    },
    {
      id: "shirt",
      name: "Official Long-Sleeve Shirt",
      desc: "High-grade formal button-down shirt designed for leadership delegations and summits.",
      image: Shirt,
      badge: "Official Gear"
    }
  ];

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

        <div className="products-grid">
          {products.map((item) => (
            <article key={item.id} className="product-card">
              <div className="product-image-box">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="product-badge">{item.badge}</span>
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
          ))}
        </div>
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
