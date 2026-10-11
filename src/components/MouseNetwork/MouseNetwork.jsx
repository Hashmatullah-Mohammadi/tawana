import { useEffect, useRef } from "react";
import "./MouseNetwork.css";

function MouseNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let particles = [];
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
    };

    // Circle around the mouse: 200px diameter
    const EFFECT_RADIUS = 100;

    // Settings for each screen size
    const getSettings = () => {
      const screenWidth = window.innerWidth;

      // Mobile
      if (screenWidth <= 480) {
        return {
          count: 250,
          speed: 1,
          connection: 85,
          mouseDistance: 45,
        };
      }

      // Large Mobile / Tablet
      if (screenWidth <= 768) {
        return {
          count: 300,
          speed: 1,
          connection: 90,
          mouseDistance: 50,
        };
      }

      // Tablet / Small Laptop
      if (screenWidth <= 1024) {
        return {
          count: 400,
          speed: 1,
          connection: 100,
          mouseDistance: 55,
        };
      }

      // Desktop
      return {
        count: 500,
        speed: 1,
        connection: 110,
        mouseDistance: 50,
      };
    };

    let settings = getSettings();

    // Resize canvas and recreate particles
    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      settings = getSettings();

      particles = Array.from({ length: settings.count }, () => {
        const angle = Math.random() * Math.PI * 2;

        return {
          x: Math.random() * width,
          y: Math.random() * height,

          // Particle speed is controlled here
          vx: Math.cos(angle) * settings.speed,
          vy: Math.sin(angle) * settings.speed,

          radius: Math.random() * 1.5 + 0.8,
        };
      });
    };

    // Track pointer position relative to the canvas
    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    // Hide the effect when the pointer leaves the Hero
    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Move particles continuously
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off the canvas edges
        if (particle.x <= 0 || particle.x >= width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }

        if (particle.y <= 0 || particle.y >= height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }
      });

      // Clip all drawing to a circle around the pointer
      ctx.save();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, EFFECT_RADIUS, 0, Math.PI * 2);
      ctx.clip();

      // Select particles inside the circular area
      const nearbyParticles = particles.filter((particle) => {
        return (
          Math.hypot(particle.x - mouse.x, particle.y - mouse.y) <=
          EFFECT_RADIUS
        );
      });

      // Draw connections between nearby particles
      for (let i = 0; i < nearbyParticles.length; i++) {
        for (let j = i + 1; j < nearbyParticles.length; j++) {
          const p1 = nearbyParticles[i];
          const p2 = nearbyParticles[j];

          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (distance >= settings.connection) continue;

          const opacity = 0.65 * (1 - distance / settings.connection);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = `rgba(105, 220, 90, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Draw particles inside the circular area
      nearbyParticles.forEach((particle) => {
        const distance = Math.hypot(particle.x - mouse.x, particle.y - mouse.y);

        const opacity = 0.35 + (1 - distance / EFFECT_RADIUS) * 0.65;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(105, 220, 90, ${opacity})`;
        ctx.fill();
      });

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    // Initialize canvas and animation
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(parent);

    window.addEventListener("resize", resizeCanvas);
    parent.addEventListener("pointermove", handlePointerMove);
    parent.addEventListener("pointerleave", handlePointerLeave);

    animate();

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      window.removeEventListener("resize", resizeCanvas);
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="mouse-network" aria-hidden="true" />
  );
}

export default MouseNetwork;
