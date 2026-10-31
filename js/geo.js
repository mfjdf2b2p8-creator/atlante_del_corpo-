/* Utilità geometriche: curve morbide (Catmull-Rom), specchiatura, deformazione femminile */
window.G = (function () {
  const CX = 200;
  const f = (n) => Math.round(n * 10) / 10;

  // Curva morbida che passa per tutti i punti. Un punto [x,y,0] diventa uno spigolo.
  function cr(pts, closed = true, k = 1) {
    const n = pts.length;
    if (n < 2) return "";
    const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const t1 = p1[2] === 0 ? 0 : k / 6, t2 = p2[2] === 0 ? 0 : k / 6;
      const c1 = [p1[0] + (p2[0] - p0[0]) * t1, p1[1] + (p2[1] - p0[1]) * t1];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t2, p2[1] - (p3[1] - p1[1]) * t2];
      d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
    }
    return d + (closed ? "Z" : "");
  }

  // Mezza sagoma (dal centro in alto al centro in basso, lato destro) -> sagoma intera simmetrica
  function sym(half) {
    const m = half.slice(1, -1).reverse().map(([x, y, c]) => [2 * CX - x, y, c]);
    return half.concat(m);
  }
  const mir = (pts) => pts.map(([x, y, c]) => [2 * CX - x, y, c]);
  const mx = (x) => 2 * CX - x;

  function lerpTab(tab, y) {
    if (y <= tab[0][0]) return tab[0][1];
    for (let i = 1; i < tab.length; i++) {
      if (y <= tab[i][0]) {
        const [y0, v0] = tab[i - 1], [y1, v1] = tab[i];
        return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0);
      }
    }
    return tab[tab.length - 1][1];
  }

  // Proporzioni femminili: spalle più strette, vita sottile, bacino più largo
  const F_TORSO = [[150, .9], [186, .88], [206, .87], [240, .9], [282, .95], [330, .9], [372, .84], [410, .93], [445, 1.03], [470, 1.045], [500, 1.04]];
  const F_LEG = [[470, 1.045], [520, 1.035], [600, 1.01], [690, .985], [800, .965], [960, .95]];
  const TORSO_X = [[186, 226], [206, 284], [220, 292], [262, 280], [310, 270], [372, 258], [430, 268], [458, 277], [500, 283], [540, 283], [600, 277], [700, 260]];
  const ARM_AXIS = [[205, 284], [380, 297], [490, 318], [585, 330]];

  function warpF(x, y) {
    const dx = x - CX, ax = Math.abs(dx), s = Math.sign(dx) || 1;
    if (y < 168) return [CX + dx * 0.94, 114 + (y - 114) * 0.95];
    let r;
    if (y < 480) r = lerpTab(F_TORSO, y);
    else if (y < 500) { const t = (y - 480) / 20; r = lerpTab(F_TORSO, y) * (1 - t) + lerpTab(F_LEG, y) * t; }
    else r = lerpTab(F_LEG, y);
    let tor = CX + dx * r;
    if (y < 168 + 14) { // raccordo testa-collo
      const t = (y - 168) / 14, hx = CX + dx * 0.94;
      tor = hx * (1 - t) + tor * t;
    }
    if (y > 196 && y < 600) {
      const tb = lerpTab(TORSO_X, y) - CX;
      const w = Math.max(0, Math.min(1, (ax - tb) / 14));
      if (w > 0) {
        const axis = lerpTab(ARM_AXIS, y) - CX;
        const shift = (284 - CX) * (1 - 0.87);
        const armX = CX + s * (axis + (ax - axis) * 0.87 - shift);
        return [tor * (1 - w) + armX * w, y];
      }
    }
    return [tor, y];
  }

  return { CX, cr, sym, mir, mx, f, lerpTab, warpF };
})();
