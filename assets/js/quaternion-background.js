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

  // Create particles - SMALLER SIZE
  const particles = [];
  const numParticles = 60;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 600 - 300,
      },
      basePos: {},
      size: Math.random() * 1.2 + 0.8, // REDUCED: was 2.5 + 1.5, now 1.2 + 0.8 (max 2px)
      hue: Math.random() * 40 + 200,
    });
    particles[i].basePos = { ...particles[i].pos };
  }

  let mouseX = canvas.width / 2;
  let mouseY = canvas.height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;
  let angle = 0;

  window.addEventListener("mousemove", (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  function animate() {
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    // Clear with subtle fade
    ctx.fillStyle = "rgba(33, 37, 41, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    angle += 0.0015;

    const axis = {
      x: (mouseX / canvas.width - 0.5) * 2,
      y: (mouseY / canvas.height - 0.5) * 2,
      z: 0.3,
    };

    const len = Math.sqrt(axis.x ** 2 + axis.y ** 2 + axis.z ** 2);
    axis.x /= len;
    axis.y /= len;
    axis.z /= len;

    const halfAngle = angle / 2;
    const q = new Quaternion(
      Math.cos(halfAngle),
      axis.x * Math.sin(halfAngle),
      axis.y * Math.sin(halfAngle),
      axis.z * Math.sin(halfAngle)
    ).normalize();

    particles.forEach((p, i) => {
      const centered = {
        x: p.basePos.x - canvas.width / 2,
        y: p.basePos.y - canvas.height / 2,
        z: p.basePos.z,
      };

      const rotated = q.rotatePoint(centered);

      p.pos.x = rotated.x + canvas.width / 2;
      p.pos.y = rotated.y + canvas.height / 2;
      p.pos.z = rotated.z;

      const perspective = 800;
      const scale = perspective / (perspective + p.pos.z);
      const x2d = p.pos.x * scale + (canvas.width / 2) * (1 - scale);
      const y2d = p.pos.y * scale + (canvas.height / 2) * (1 - scale);

      // More subtle opacity
      const opacity = 0.4 + scale * 0.6; // Reduced from 0.5 + 0.8

      // Subtle particles
      const particleColor = `hsla(${p.hue}, 75%, 60%, ${opacity})`;

      // Draw particle - SMALLER
      ctx.beginPath();
      ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();

      // Draw connections - MORE SUBTLE
      particles.slice(i + 1).forEach((p2) => {
        const dx = p.pos.x - p2.pos.x;
        const dy = p.pos.y - p2.pos.y;
        const dz = p.pos.z - p2.pos.z;
        const dist3D = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

        if (dist3D < 200) {
          const scale2 = perspective / (perspective + p2.pos.z);
          const x2d2 = p2.pos.x * scale2 + (canvas.width / 2) * (1 - scale2);
          const y2d2 = p2.pos.y * scale2 + (canvas.height / 2) * (1 - scale2);

          // More subtle connections
          const connectionOpacity = (1 - dist3D / 200) * 0.2 * Math.min(scale, scale2); // Reduced from 0.35
          const lineColor = `rgba(150, 170, 200, ${connectionOpacity})`;

          ctx.beginPath();
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(x2d2, y2d2);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.6; // Thinner lines (was 1)
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles.forEach((p) => {
      p.basePos.x = (p.basePos.x / oldWidth) * canvas.width;
      p.basePos.y = (p.basePos.y / oldHeight) * canvas.height;
      p.pos.x = p.basePos.x;
      p.pos.y = p.basePos.y;
    });
  });
});
