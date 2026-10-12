import { useEffect, useRef, useState } from "react";
import "./Home.css";

function Home() {
  const canvasRef = useRef(null);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const core = hero?.querySelector(".home-core");
    const ctx = canvas?.getContext("2d");

    if (!canvas || !hero || !core || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationId;
    let countTimer;
    let width = 0,
      height = 0,
      centerX = 0,
      centerY = 0,
      radius = 0;
    let angle = 0,
      lastTime = 0,
      spawn = 0,
      blockedCount = 0;
    let nodes = [],
      threats = [],
      rings = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const coreRect = core.getBoundingClientRect();
      centerX = coreRect.left - rect.left + coreRect.width / 2;
      centerY = coreRect.top - rect.top + coreRect.height / 2;
      radius = coreRect.width / 2;

      nodes = Array.from(
        { length: Math.round((width * height) / 22000) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        }),
      );
    };

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 16.7 || 1, 3);
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        node.x += node.vx * delta;
        node.y += node.vy * delta;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const other = nodes[j];
          const distance = Math.hypot(node.x - other.x, node.y - other.y);
          if (distance < 120) {
            ctx.strokeStyle = `rgba(95, 211, 127, ${0.16 * (1 - distance / 120)})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(95, 211, 127, .5)";
        ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
      }

      for (let i = 1; i <= 3; i += 1) {
        ctx.strokeStyle = `rgba(95, 211, 127, ${0.22 / i})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (1 + i * 0.55), 0, Math.PI * 2);
        ctx.stroke();
      }

      angle += 0.014 * delta;
      if (ctx.createConicGradient) {
        const gradient = ctx.createConicGradient(angle - 1.2, centerX, centerY);
        gradient.addColorStop(0, "rgba(95, 211, 127, 0)");
        gradient.addColorStop(0.19, "rgba(95, 211, 127, .2)");
        gradient.addColorStop(0.191, "rgba(95, 211, 127, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 2.65, 0, Math.PI * 2);
        ctx.fill();
      }

      spawn -= delta;
      if (spawn <= 0) {
        spawn = 26 + Math.random() * 30;
        const direction = Math.random() * Math.PI * 2;
        const distance = Math.max(width, height) * 0.7;
        threats.push({
          x: centerX + Math.cos(direction) * distance,
          y: centerY + Math.sin(direction) * distance,
          speed: 2.2 + Math.random() * 1.8,
          trail: [],
        });
      }

      for (let i = threats.length - 1; i >= 0; i -= 1) {
        const threat = threats[i];
        const dx = centerX - threat.x;
        const dy = centerY - threat.y;
        const distance = Math.hypot(dx, dy) || 1;
        threat.x += (dx / distance) * threat.speed * delta;
        threat.y += (dy / distance) * threat.speed * delta;
        threat.trail.push([threat.x, threat.y]);
        if (threat.trail.length > 14) threat.trail.shift();

        threat.trail.forEach((point, index) => {
          ctx.fillStyle = `rgba(255, 93, 108, ${(index / threat.trail.length) * 0.6})`;
          ctx.fillRect(point[0] - 1.5, point[1] - 1.5, 3, 3);
        });

        ctx.fillStyle = "#ff5d6c";
        ctx.shadowColor = "#ff5d6c";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (distance < radius) {
          rings.push({ x: threat.x, y: threat.y, radius: 3, alpha: 1 });
          threats.splice(i, 1);
          blockedCount += 1;
        }
      }

      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i];
        ring.radius += 1.6 * delta;
        ring.alpha -= 0.035 * delta;
        if (ring.alpha <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(95, 211, 127, ${ring.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(hero);
    window.addEventListener("resize", resizeCanvas);

    if (!reduceMotion) {
      animationId = window.requestAnimationFrame(animate);
      countTimer = window.setInterval(() => setBlocked(blockedCount), 250);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      window.cancelAnimationFrame(animationId);
      window.clearInterval(countTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <main className="home-page">
      <section className="hero" style={{ paddingTop: 100 }}>
        <canvas id="cv" ref={canvasRef} aria-hidden="true" />
        <div className="wrap">
          <div className="hero-copy">
            <span className="badge">
              <i />
              Training center in Kabul
            </span>
            <h1>
              Defend the <em>digital world.</em>
            </h1>
            <p className="lead">
              Cybersecurity, networking and development courses that teach you
              by doing.
            </p>
            <div className="actions">
              <a className="btn" href="#courses">
                View courses
              </a>
              <a className="btn line" href="#contact">
                Our Services
              </a>
            </div>
          </div>
          <div className="col">
            <div className="core home-core">
              <img
                src="/images/home/logo.webp"
                alt="Tawana Technology security illustration"
                width="720"
                height="720"
              />
            </div>
            <div className="wm">TECHNOLOGY</div>
          </div>
        </div>
        <div className="stat" aria-hidden="true">
          Simulation: threats blocked
          <b>{blocked.toLocaleString("en-US")}</b>
        </div>
      </section>
    </main>
  );
}

export default Home;
