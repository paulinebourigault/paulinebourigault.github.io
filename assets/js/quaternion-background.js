// Small "hypersphere" quaternion widget in the top-right corner.
//
// We sample a handful of Hopf fibers (great circles on S^3), apply the unit
// quaternion rotation in 4D by left multiplication, then stereographically
// project from S^3 to R^3 (using north pole (0,0,0,1)), then perspective
// project to 2D. The result is a rotating Hopf-style configuration of
// interlocking circles — the canonical visualization of the 3-sphere.
document.addEventListener("DOMContentLoaded", function () {
  const SIZE = 160;
  const canvas = document.createElement("canvas");
  canvas.id = "quaternion-canvas";
  const dpr = window.devicePixelRatio || 1;
  canvas.width = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.cssText =
    "position: fixed; top: 70px; right: 20px; width: " +
    SIZE +
    "px; height: " +
    SIZE +
    "px; z-index: 5; pointer-events: none;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // 4D quaternion algebra (treat 4D vectors as quaternions q = w + xi + yj + zk).
  function qMul(a, b) {
    return {
      w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
      x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    };
  }

  function fromAxisAngle(ax, ay, az, ang) {
    const h = ang / 2;
    const s = Math.sin(h);
    return { w: Math.cos(h), x: ax * s, y: ay * s, z: az * s };
  }

  // Hopf fiber over base point (theta, phi) on S^2, parameterized by t.
  // Returns a unit quaternion on S^3.
  function hopfFiber(theta, phi, t) {
    const a = Math.cos(theta / 2);
    const b = Math.sin(theta / 2);
    const u = t + phi / 2;
    const v = t - phi / 2;
    return {
      w: a * Math.cos(u),
      x: a * Math.sin(u),
      y: b * Math.cos(v),
      z: b * Math.sin(v),
    };
  }

  // Stereographic projection S^3 -> R^3 from north pole (w,x,y,z) = (0,0,0,1).
  // We map (w,x,y,z) -> (w, x, y) / (1 - z).  When z ~ 1 the point goes to
  // infinity; we clip to a max radius so it stays inside the canvas.
  const STEREO_CLIP = 6;
  function stereo(p) {
    const d = 1 - p.z;
    if (Math.abs(d) < 1e-3) return null;
    return { x: p.w / d, y: p.x / d, z: p.y / d };
  }

  // Sample base points on S^2 (theta in (0, pi), phi in [0, 2pi)).
  // Six fibers gives a clear, uncluttered hypersphere.
  const FIBERS = [];
  const baseAngles = [
    [Math.PI / 3, 0],
    [Math.PI / 3, (2 * Math.PI) / 3],
    [Math.PI / 3, (4 * Math.PI) / 3],
    [(2 * Math.PI) / 3, Math.PI / 3],
    [(2 * Math.PI) / 3, Math.PI],
    [(2 * Math.PI) / 3, (5 * Math.PI) / 3],
  ];
  baseAngles.forEach(([theta, phi], i) => {
    FIBERS.push({ theta: theta, phi: phi, index: i });
  });

  const STEPS = 80;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const VIEW_SCALE = 22; // R^3 -> canvas pixels
  const PERSPECTIVE = 6;

  // Fixed normalized rotation axis used to drive the animation.
  const axis = (function () {
    const a = { x: 0.4, y: 0.6, z: 0.7 };
    const L = Math.hypot(a.x, a.y, a.z);
    return { x: a.x / L, y: a.y / L, z: a.z / L };
  })();

  // Grey-blue shades for the fibers.
  const shades = [
    "rgba(30, 64, 110, ALPHA)",
    "rgba(55, 90, 130, ALPHA)",
    "rgba(80, 110, 145, ALPHA)",
    "rgba(105, 130, 160, ALPHA)",
    "rgba(95, 115, 145, ALPHA)",
    "rgba(70, 100, 135, ALPHA)",
  ];

  let angle = 0;

  function project2D(p3) {
    const persp = PERSPECTIVE / (PERSPECTIVE + p3.z);
    return {
      x: cx + p3.x * VIEW_SCALE * persp,
      y: cy - p3.y * VIEW_SCALE * persp,
      depth: p3.z,
      scale: persp,
    };
  }

  function drawFiber(fiber, q) {
    const pts = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * 2 * Math.PI;
      const p4 = hopfFiber(fiber.theta, fiber.phi, t);
      const rotated = qMul(q, p4); // left-multiply: rotates S^3 in 4D
      const p3 = stereo(rotated);
      if (!p3) {
        pts.push(null);
        continue;
      }
      const r = Math.hypot(p3.x, p3.y, p3.z);
      if (r > STEREO_CLIP) {
        pts.push(null);
        continue;
      }
      pts.push(project2D(p3));
    }

    const baseColor = shades[fiber.index % shades.length];
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    // Draw segment-by-segment so we can shade by depth and break across gaps.
    let prev = null;
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i];
      if (!cur || !prev) {
        prev = cur;
        continue;
      }
      // Skip huge jumps (where the curve wrapped around infinity).
      const jump = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      if (jump > SIZE * 0.5) {
        prev = cur;
        continue;
      }
      const avgScale = (cur.scale + prev.scale) / 2;
      const alpha = 0.25 + 0.55 * Math.max(0, Math.min(1, avgScale - 0.6));
      ctx.strokeStyle = baseColor.replace("ALPHA", alpha.toFixed(3));
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(cur.x, cur.y);
      ctx.stroke();
      prev = cur;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    angle += 0.005;
    const q = fromAxisAngle(axis.x, axis.y, axis.z, angle);

    // Sort fibers back-to-front by their average projected depth so
    // foreground rings draw over background ones.
    const ordered = FIBERS.map((f) => {
      // Cheap depth proxy: project a single point.
      const p4 = hopfFiber(f.theta, f.phi, 0);
      const r = qMul(q, p4);
      const p = stereo(r);
      return { f: f, depth: p ? p.z : 0 };
    });
    ordered.sort((a, b) => a.depth - b.depth);
    ordered.forEach((o) => drawFiber(o.f, q));

    requestAnimationFrame(draw);
  }

  draw();

  // Hide on narrow screens.
  function updateVisibility() {
    canvas.style.display = window.innerWidth < 768 ? "none" : "block";
  }
  updateVisibility();
  window.addEventListener("resize", updateVisibility);
});
