import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import abtImg from "../assets/abtHero.png";
import aboutImage from "../assets/abt.png";
import Officials from "../components/Officials";
import "../styles/style.css";

export default function About() {
  return (
    <>
      <section className="hero-section">
        <div className="text-content">
          <h1>Empowering Professionals to Shape the Future</h1>
          <p>
            The Unique Focus Association connects visionary leaders, fostering
            innovation and excellence across industries. We build the foundation
            for professional growth and community impact.
          </p>
        </div>

        <div className="image-content">
          <img src={abtImg} alt="Ufa members" width="715" height="477" />
        </div>
      </section>

      <section id="story">
        <div className="abtImg">
          <img src={aboutImage} alt="ufa image" className="aboutImage" />
        </div>
        <div className="ourStory">
          <p className="storySpan">OUR STORY</p>
          <h2>A Legacy of Excellence.</h2>
          <p>
            Unique Focus Association of Kenya (UFA) was founded in 2025 with a
            vision to connect, empower, and unite young people across Kenya.
            What started as a youth-focused initiative has continued to grow
            into a movement bringing together young leaders from different
            regions, backgrounds, and areas of interest.
          </p>
          <p>
            Since its establishment, UFA has connected and engaged young people
            from Busia and the border region, Siaya, Kisumu, Homa Bay, Kisii,
            Nairobi, Murang’a, Kiambu, Meru, Embu, Kakamega, Nakuru, among many
            other counties. Through leadership, networking, empowerment,
            mentorship, and collaboration, we are creating a strong platform
            where the voices and potential of young people can be recognized and
            developed.
          </p>
          <p>
            Our journey has only just begun. As we continue to grow, our vision
            is to reach and connect young people in all 47 counties of Kenya,
            creating a united national network of focused, empowered, and
            purpose-driven youth committed to making a positive impact in their
            communities and beyond.
          </p>
        </div>
      </section>

      <section className="chapters">
        <div className="chapItems">
          <h2>1000+</h2>
          <p>ACTIVE MEMBERS</p>
        </div>
        <div className="chapItems">
          <h2>1+</h2>
          <p>YEARS OF EXCELLENCE</p>
        </div>
        <div className="chapItems">
          <h2>10+</h2>
          <p>ANNUAL EVENTS</p>
        </div>
        <div className="chapItems">
          <h2>12+</h2>
          <p>COUNTY CHAPTERS</p>
        </div>
      </section>

      <section>
        <Officials />
      </section>

      <section id="corePrincipals">
        <div className="coreHead">
          <p>CORE PRINCIPALS</p>
          <h2>What Drives Us</h2>
        </div>
        <div className="coreItems">
          <div className="principals">
            <h3>Integrity</h3>
            <p>
              We uphold the highest ethical standards in all our endeavors,
              ensuring transparency and trust form the bedrock of our
              association.
            </p>
          </div>
          <div className="principals">
            <h3>Innovation</h3>
            <p>
              We embrace forward-thinking solutions, constantly seeking new ways
              to add value and drive progress within our professional community.
            </p>
          </div>
          <div className="principals">
            <h3>Community</h3>
            <p>
              We believe in the power of collective wisdom. Fostering a
              supportive, inclusive environment is essential to our mutual
              success.
            </p>
          </div>
        </div>
      </section>

      <section id="aboutCta">
        <div className="ctaItems">
          <h2>Ready to be part of our community</h2>
          <p>
            Join Unique Focus Association today and connect with a national
            network of industry leaders
          </p>
          <a href="#" className="btnLink">
            JOIN UFA
          </a>
        </div>
      </section>
    </>
  );
}
