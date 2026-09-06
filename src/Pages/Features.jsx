import ftImg from "../assets/featImg.png";
import "../styles/style.css";

export default function Features() {
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

      <section id="services">
        <div>
          <h2>Primary Service Areas</h2>
          <p>
            Core pillars designed to support every stage of your proffesional
            journey
          </p>
        </div>
        <div className="serviceCards">
          <div className="cardItems">
            <h3>Professional Development</h3>
            <p>
              Continous Learning through accredited workshops, skill-building
              seminars and industry recognized certifiation programs.
            </p>
            <li className="cardList">
              <ul>Monthly Skills Workshop</ul>
              <ul>UFA Certification Tracks</ul>
              <ul>Leadership Training</ul>
            </li>
          </div>
          <div className="cardItems">
            <h3>Networking Events</h3>
            <p>
              Connect with peers, industry leaders and potential partners
              through our highly curated calender of events.
            </p>
            <li className="cardList">
              <ul>Annual UFA Symposium</ul>
              <ul>Quaterly Excecutive Mixes</ul>
              <ul>Regional Chapter Meetings</ul>
            </li>
          </div>
          <div className="cardItems">
            <h3>Industry Research</h3>
            <p>
              Access exclusive data, market trends and authorotative whitepapers
              to stay ahead in a rapidily evolving landscape.
            </p>
            <li className="cardList">
              <ul>UFA Quaterly Journal</ul>
              <ul>Annual Market Reports</ul>
              <ul>Data Library Access</ul>
            </li>
          </div>
          <div className="cardItems">
            <h3>Career Advocacy</h3>
            <p>
              Resources and support dedicated to advancing your career
              trajectory,from finding new opportunities to personalized
              guidance.
            </p>
            <li className="cardList">
              <ul>Exclusive Job Board</ul>
              <ul>1-on-1 Mentorship Programs</ul>
              <ul>Resume & Portfolio Reviews</ul>
            </li>
          </div>
        </div>
      </section>
    </>
  );
}
