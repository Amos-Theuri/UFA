import "../styles/style.css";
import armBand from "../assets/merch_1.png";
import noteBook from "../assets/merch_2.png";
import Scarf from "../assets/merch_3.png";
import Hoodie from "../assets/merch_4.png";
import Umbrella from "../assets/merch_5.png";
import Cap from "../assets/merch_6.png";
import Tshirt from "../assets/merch_7.png";
import Polo from "../assets/merch_8.png";
import Shirt from "../assets/merch_9.png";

export default function Merchendise() {
  return (
    <>
      <h1>Buy our products</h1>
      <section id="products">
        <div className="productCards">
          <div className="product">
            <div className="productWrapper">
              <img src={armBand} alt="" />
            </div>
            <p>Arm Band</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={noteBook} alt="" className="productImg" />
            </div>
            <p>Notebook</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Scarf} alt="" />
            </div>
            <p>Scarf</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Hoodie} alt="" className="productImg" />
            </div>
            <p>Hooded Sweater</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Umbrella} alt="" className="productImg" />
            </div>
            <p>Umbrella</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Cap} alt="" className="productImg" />
            </div>
            <p>Caps</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Tshirt} alt="" className="productImg" />
            </div>
            <p>T-shirt</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Polo} alt="" className="productImg" />
            </div>
            <p>Polo T-shirts</p>
          </div>
          <div className="product">
            <div className="productWrapper">
              <img src={Shirt} alt="" className="productImg" />
            </div>
            <p>Shirts</p>
          </div>
        </div>
      </section>
    </>
  );
}
