document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.createElement("canvas");
  canvas.id = "quaternion-canvas";
  canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; pointer-events: none;";
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Quaternion class for 3D rotations
  class Quaternion {
    constructor(w, x, y, z) {
      this.w = w;
      this.x = x;
      this.y = y;
      this.z = z;
    }

    multiply(q) {
      return new Quaternion(
        this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
        this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
        this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
        this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
      );
    }

    rotatePoint(p) {
      const qp = new Quaternion(0, p.x, p.y, p.z);
      const qConj = new Quaternion(this.w, -this.x, -this.y, -this.z);
      const result = this.multiply(qp).multiply(qConj);
      return { x: result.x, y: result.y, z: result.z };
    }

    normalize() {
      const len = Math.sqrt(this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2);
      return new Quaternion(this.w / len, this.x / len, this.y / len, this.z / len);
    }
  }

  // Create particles ONLY on left and right sides
  const particles = [];
  const numParticles = 40; // Reduced number
  const sideMargin = 0.25; // Particles in left 25% and right 25%

  for (let i = 0; i < numParticles; i++) {
    // Randomly place in left or right side
    const isLeftSide = Math.random() > 0.5;
    const x = isLeftSide
      ? Math.random() * (canvas.width * sideMargin) // Left side
      : canvas.width * (1 - sideMargin) + Math.random() * (canvas.width * sideMargin); // Right side

    particles.push({
      pos: {
        x: x,
        y: Math.random() * canvas.height,
        z: Math.random() * 400 - 200,
      },
      basePos: {},
      size: Math.random() * 1 + 0.6, // Small particles
      hue: Math.random() * 40 + 200,
      side: isLeftSide ? "left" : "right", // Track which side
    });
    particles[i].basePos = { ...particles[i].pos };
  }

  let angle = 0;

  // NO MOUSE TRACKING - automatic rotation only
  // Fixed rotation axis (no mouse interaction)
  const fixedAxis = {
    x: 0.3,
    y: 0.4,
    z: 0.5,
  };

  // Normalize the fixed axis
  const len = Math.sqrt(fixedAxis.x ** 2 + fixedAxis.y ** 2 + fixedAxis.z ** 2);
  fixedAxis.x /= len;
  fixedAxis.y /= len;
  fixedAxis.z /= len;

  function animate() {
    // Clear with subtle fade
    ctx.fillStyle = "rgba(33, 37, 41, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Slow automatic rotation - NO MOUSE INFLUENCE
    angle += 0.001; // Very slow rotation

    // Create quaternion from FIXED axis-angle (no mouse)
    const halfAngle = angle / 2;
    const q = new Quaternion(
      Math.cos(halfAngle),
      fixedAxis.x * Math.sin(halfAngle),
      fixedAxis.y * Math.sin(halfAngle),
      fixedAxis.z * Math.sin(halfAngle)
    ).normalize();

    particles.forEach((p, i) => {
      // Calculate center for rotation based on which side particle is on
      const centerX =
        p.side === "left"
          ? (canvas.width * sideMargin) / 2 // Center of left margin
          : canvas.width * (1 - sideMargin / 2); // Center of right margin

      const centered = {
        x: p.basePos.x - centerX,
        y: p.basePos.y - canvas.height / 2,
        z: p.basePos.z,
      };

      // Apply quaternion rotation
      const rotated = q.rotatePoint(centered);

      // Move back to side position
      p.pos.x = rotated.x + centerX;
      p.pos.y = rotated.y + canvas.height / 2;
      p.pos.z = rotated.z;

      // Perspective projection
      const perspective = 600;
      const scale = perspective / (perspective + p.pos.z);
      const x2d = p.pos.x * scale + centerX * (1 - scale);
      const y2d = p.pos.y * scale + (canvas.height / 2) * (1 - scale);

      // Subtle opacity
      const opacity = 0.25 + scale * 0.45;

      // Subtle particles
      const particleColor = `hsla(${p.hue}, 70%, 55%, ${opacity})`;

      // Draw particle
      ctx.beginPath();
      ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();

      // Draw connections only within same side and nearby particles
      particles.slice(i + 1).forEach((p2) => {
        // Only connect particles on same side
        if (p.side !== p2.side) return;

        const dx = p.pos.x - p2.pos.x;
        const dy = p.pos.y - p2.pos.y;
        const dz = p.pos.z - p2.pos.z;
        const dist3D = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

        // Shorter connection distance for subtlety
        if (dist3D < 150) {
          const scale2 = perspective / (perspective + p2.pos.z);
          const centerX2 = p2.side === "left" ? (canvas.width * sideMargin) / 2 : canvas.width * (1 - sideMargin / 2);
          const x2d2 = p2.pos.x * scale2 + centerX2 * (1 - scale2);
          const y2d2 = p2.pos.y * scale2 + (canvas.height / 2) * (1 - scale2);

          // Very subtle connections
          const connectionOpacity = (1 - dist3D / 150) * 0.12 * Math.min(scale, scale2);
          const lineColor = `rgba(140, 160, 190, ${connectionOpacity})`;

          ctx.beginPath();
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(x2d2, y2d2);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reposition particles to maintain side placement
    particles.forEach((p) => {
      if (p.side === "left") {
        // Keep in left margin
        p.basePos.x = (p.basePos.x / oldWidth) * canvas.width;
        if (p.basePos.x > canvas.width * sideMargin) {
          p.basePos.x = Math.random() * (canvas.width * sideMargin);
        }
      } else {
        // Keep in right margin
        const oldRightStart = oldWidth * (1 - sideMargin);
        const newRightStart = canvas.width * (1 - sideMargin);
        p.basePos.x = newRightStart + ((p.basePos.x - oldRightStart) / (oldWidth * sideMargin)) * (canvas.width * sideMargin);
      }

      p.basePos.y = (p.basePos.y / oldHeight) * canvas.height;
      p.pos.x = p.basePos.x;
      p.pos.y = p.basePos.y;
    });
  });
});
