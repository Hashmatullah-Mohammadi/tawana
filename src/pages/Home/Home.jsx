import "./Home.css";
import MouseNetwork from "../../components/MouseNetwork/MouseNetwork";
const stats = [
  { number: "10+", label: "Courses", icon: "graduation" },
  { number: "500+", label: "Students", icon: "users" },
  { number: "95%", label: "Success Rate", icon: "award" },
];

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <MouseNetwork />
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-glow hero-glow-top" aria-hidden="true" />
        <div className="hero-glow hero-glow-bottom" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-brand-dot" />
              <span className="hero-brand">TAWANA TECHNOLOGY</span>
              <span className="hero-eyebrow-divider" />
              <span className="hero-brand-tagline">LEARN · BUILD · LEAD</span>
            </div>

            <h1 className="hero-title">Your Future Starts With Technology.</h1>

            <p className="hero-description">
              Join Tawana Technology to learn practical skills, gain real
              experience, and prepare for the opportunities of the digital
              world.
            </p>

            <div className="hero-actions">
              <a href="/courses" className="hero-btn hero-btn-primary">
                <span>Explore Courses</span>
                <span className="hero-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>

              <a href="/services" className="hero-btn hero-btn-secondary">
                <span>Our Services</span>
                <span className="hero-play" aria-hidden="true">
                  ▶
                </span>
              </a>
            </div>

            {/* <div className="hero-stats">
              {stats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <div className="hero-stat-icon" aria-hidden="true">
                    {stat.icon === "graduation" && "♧"}
                    {stat.icon === "users" && "♙"}
                    {stat.icon === "award" && "✧"}
                  </div>

                  <div className="hero-stat-info">
                    <strong>{stat.number}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div> */}

            <div className="hero-bottom-note">
              <span className="hero-note-mark" />
              <p>
                Practical Learning <i>·</i> Expert Guidance
                <i>·</i> Real Opportunities
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-orbit hero-orbit-one" />
            <div className="hero-image-orbit hero-orbit-two" />

            <div className="hero-image-frame">
              <img
                className="hero-image"
                src="/images/home/hero.webp"
                alt="Technology learning and digital skills at Tawana Technology"
                fetchPriority="high"
              />
            </div>

            <div className="hero-floating-label">
              <span className="hero-floating-dot" />
              <div>
                <strong>Learn by Doing</strong>
                <span>Skills for the real world</span>
              </div>
            </div>

            <span className="hero-decoration hero-decoration-one" />
            <span className="hero-decoration hero-decoration-two" />
            <span className="hero-decoration hero-decoration-three" />
          </div>

          <div className="hero-scroll-indicator" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
