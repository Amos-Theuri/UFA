import ftImg from "../assets/featImg.png";
import "../styles/style.css";

import { Phone, Send } from "lucide";
export default function Contact() {
  return (
    <>
      <section className="hero-section">
        <div className="text-content">
          <h1>Empowering Your Proffesional Excellence</h1>
          <p>
            The Unique Focus Association connects visionary leaders, fostering
            innovation and excellence across industries. We build the foundation
            for professional growth and community impact.
          </p>
        </div>

        <div className="image-content">
          <img src={ftImg} alt="Ufa members" width="715" height="477" />
        </div>
      </section>

      <section className="contact">
        <div className="phone">
          <h3>Our Official Telephone</h3>
          <ul id="numbers">
            <li>
              <img src={Phone} alt="" /> 0113508789
            </li>
            <li>0759984343</li>
            <li> 0795312147</li>
          </ul>
        </div>
        <div className="email">
          <h3>Our official email</h3>
          <p>uniquefocusassociation@gmail.com</p>
        </div>
        <div className="socials">facebook</div>
      </section>
    </>
  );
}
