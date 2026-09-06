import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import heroImg from "../assets/hero.png";
import "../styles/style.css";
import logoImg from "../assets/logo.png";
import partnerImage from "../assets/partner.jpeg";

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="text-content">
          <h1>Unique Focus Association</h1>
          <p>
            We foster youth networking and mentorship,career development and job
            readiness. Championing health awareness, social well being and
            environmental conversation.
          </p>
          <a href="#" className="btnLink">
            JOIN UFA
          </a>
        </div>

        <div className="image-content">
          <img src={heroImg} alt="Ufa members" width="715" height="477" />
        </div>
      </section>

      <section id="about">
        <div className="abtImg">
          <img
            src={logoImg}
            alt="ufa image"
            width="500px"
            height="500px"
            className="abtPic"
          />
        </div>
        <div className="abtText">
          <h2>The UFA Vision</h2>
          <p>
            Unique Focus Association of Kenya (UFA) is a youth-focused
            organization committed to empowering young people and communities
            through leadership development, mentorship, skills development,
            advocacy, networking, and community initiatives. We believe that
            every young person has unique potential and, with the right
            opportunities and support, can become a positive force for change.
          </p>
          <Link to="/About" className="linkBtn">
            <span className="lrnMore">Learn More</span>
          </Link>
        </div>
      </section>

      <section id="Values">
        <div className="valueHead">
          <h2>Our Principals</h2>
          <p>The foundation of our association's commitment to excellence</p>
        </div>
        <div className="valueItems">
          <div className="principals">
            <h3>Youth Networking and Mentorship</h3>
            <p>
              Networking and interaction is at the core of our foundation. That
              is why we are building a national network of high value members
              and menrors to achieve this milestone
            </p>
          </div>
          <div className="principals">
            <h3>Professional Growth</h3>
            <p>
              Mentorship is a key pillar in our association and is the key
              driving factor for growth and development of our members and
              associates
            </p>
          </div>
          <div className="principals">
            <h3>Strategic Innovation</h3>
            <p>
              We always aim to bring monumental change to our community through
              our innovative solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="partners">
        <h2>Our Partners</h2>
        <div className="partnerCard">
          <a
            href="https://www.purposelife.co.ke/"
            className="partnerLink"
            target="_blank"
            rel="noreferrer"
          >
            <img src={partnerImage} alt="purpose life" className="partnerImg" />
            <p>Purpose Life Leadership Hub</p>
          </a>
        </div>
      </section>

      <section id="ctaSection">
        <div id="ctaText">
          <h3>Ready to Elavate Your Focus</h3>
          <p>
            Join the Unique Focus Association today and become a part of a
            community driving excellence and innovation
          </p>
          <a href="#" className="ctaBtn">
            Become a Member
          </a>
        </div>
      </section>
    </>
  );
}
