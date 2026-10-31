/* =========================================================
   Manichino animato per gli esercizi.
   Coordinate "mondo" in cm circa, y verso l'alto, pavimento y=0.
   Angoli degli arti: 0 = verso il basso, positivo = verso +x.
   Angoli del busto: 0 = verticale, positivo = inclinato verso +x.
   ========================================================= */
window.Mannequin = (function () {
  const L = { l1: 22, l2: 28, neck: 7, ua: 29, fa: 25, hand: 9, th: 43, sh: 42, ank: 7, toe: 17, heel: 5 };
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const ldir = (a) => [Math.sin(rad(a)), -Math.cos(rad(a))];
  const tdir = (t) => [Math.sin(rad(t)), Math.cos(rad(t))];
  const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
  const lerp = (a, b, t) => a + (b - a) * t;
  const angOf = (v) => deg(Math.atan2(v[0], -v[1]));
  const f1 = (n) => Math.round(n * 10) / 10;

  const DEF = {
    side: { p: [0, 92], t: 0, n: 0, h: 0, sh: 0, bel: 0, aA: { s: 6, e: 12, w: 0 }, aB: { s: -4, e: 4, w: 0 }, lA: { h: 0, k: 0, f: 0 }, lB: { h: 0, k: 0, f: 0 } },
    front: { p: [0, 92], t: 0, n: 0, h: 0, sh: 0, bel: 0, aA: { s: -8, e: -5, w: 0 }, aB: { s: 8, e: 5, w: 0 }, lA: { h: 0, k: 0, f: 0 }, lB: { h: 0, k: 0, f: 0 } },
  };

  function ik(A, T, l1, l2, b) {
    const dx = T[0] - A[0], dy = T[1] - A[1];
    const d = Math.hypot(dx, dy);
    const dd = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, d));
    const th = Math.atan2(dy, dx);
    const ca = (l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd);
    const al = Math.acos(Math.max(-1, Math.min(1, ca)));
    const a1 = th + (b || 1) * al;
    const J = [A[0] + l1 * Math.cos(a1), A[1] + l1 * Math.sin(a1)];
    const e = Math.atan2(T[1] - J[1], T[0] - J[0]);
    return [J, [J[0] + l2 * Math.cos(e), J[1] + l2 * Math.sin(e)]];
  }

  /* ---------- risoluzione dello scheletro ---------- */
  function solve(pose, view, sex) {
    const sc = pose.sc || {};
    const t = pose.t, t2 = pose.t2 == null ? t : pose.t2;
    const d1 = tdir(t), d2 = tdir(t2);
    const P = pose.p;
    const M = add(P, d1, L.l1);
    const S = add(M, d2, L.l2);
    const fr1 = [d1[1], -d1[0]], fr2 = [d2[1], -d2[0]];
    const shBase = add(S, d2, -4 + (pose.sh || 0));
    const fe = sex === "f";
    const sk = { P, M, S, d1, d2, fr1, fr2, view, sex, bel: pose.bel || 0, sc };
    if (view === "side") { sk.shA = sk.shB = shBase; sk.hipA = sk.hipB = P; }
    else {
      const lat1 = [-d1[1], d1[0]], lat2 = [-d2[1], d2[0]];
      const sw = fe ? 16 : 18, hw = fe ? 9.5 : 9;
      sk.shA = add(shBase, lat2, sw); sk.shB = add(shBase, lat2, -sw);
      sk.hipA = add(P, lat1, hw); sk.hipB = add(P, lat1, -hw);
      sk.lat1 = lat1; sk.lat2 = lat2;
    }
    // collo e testa
    const nd = tdir(t2 + (pose.n || 0));
    sk.neckEnd = add(S, nd, L.neck);
    sk.hd = tdir(t2 + (pose.n || 0) + (pose.h || 0));
    sk.hf = [sk.hd[1], -sk.hd[0]];
    sk.head = add(sk.neckEnd, sk.hd, 9);
    sk.chest = add(add(S, d2, -13), fr2, view === "side" ? 6 : 0);
    sk.belly = add(add(M, d1, -6), fr1, view === "side" ? 9 + sk.bel : 0);

    const refs = () => ({
      kneeA: sk.kneeA, kneeB: sk.kneeB, ankleA: sk.ankleA, ankleB: sk.ankleB, soleA: sk.soleA, soleB: sk.soleB,
      handA: sk.handA, handB: sk.handB, wristA: sk.wristA, wristB: sk.wristB, head: sk.head, chest: sk.chest,
      belly: sk.belly, hip: P, S, shoulderA: sk.shA, shoulderB: sk.shB,
    });
    const target = (to) => {
      if (typeof to[0] === "string") { const r = refs()[to[0]]; return r ? [r[0] + (to[1] || 0), r[1] + (to[2] || 0)] : [0, 0]; }
      return to;
    };

    // gambe
    ["A", "B"].forEach((X) => {
      const g = pose["l" + X], H = sk["hip" + X];
      const lt = L.th * (sc["thigh" + X] || 1), ls = L.sh * (sc["shin" + X] || 1);
      let K, An;
      if (g.to) { [K, An] = ik(H, target(g.to), lt, ls, g.b == null ? 1 : g.b); }
      else { K = add(H, ldir(g.h), lt); An = add(K, ldir(g.k), ls); }
      sk["knee" + X] = K; sk["ankle" + X] = An;
      sk["thAng" + X] = angOf([K[0] - H[0], K[1] - H[1]]);
      sk["shAng" + X] = angOf([An[0] - K[0], An[1] - K[1]]);
      const f = g.f || 0;
      const u = [Math.cos(rad(f)), Math.sin(rad(f))], up = [-Math.sin(rad(f)), Math.cos(rad(f))];
      sk["foot" + X] = { u, up, toe: add(add(An, u, L.toe), up, -L.ank), heel: add(add(An, u, -L.heel), up, -L.ank) };
      sk["sole" + X] = add(add(An, u, 6), up, -L.ank);
    });
    // braccia (A prima di B per permettere a B di raggiungere la mano di A)
    ["A", "B"].forEach((X) => {
      const a = pose["a" + X], Sh = sk["sh" + X];
      const lu = L.ua * (sc["uarm" + X] || 1), lf = L.fa * (sc["farm" + X] || 1);
      let E, W;
      if (a.to) { [E, W] = ik(Sh, target(a.to), lu, lf, a.b == null ? -1 : a.b); }
      else { E = add(Sh, ldir(a.s), lu); W = add(E, ldir(a.e), lf); }
      const fa = angOf([W[0] - E[0], W[1] - E[1]]);
      const ha = a.wa != null ? a.wa : fa + (a.w || 0);
      sk["elbow" + X] = E; sk["wrist" + X] = W;
      sk["hand" + X] = add(W, ldir(ha), L.hand * (sc["hand" + X] || 1));
      sk["uaAng" + X] = angOf([E[0] - Sh[0], E[1] - Sh[1]]);
      sk["faAng" + X] = fa; sk["haAng" + X] = ha;
    });
    return sk;
  }

  /* ---------- normalizzazione e interpolazione ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function merge(base, o) {
    const r = clone(base);
    Object.keys(o || {}).forEach((k) => {
      if (o[k] && typeof o[k] === "object" && !Array.isArray(o[k]) && r[k] && typeof r[k] === "object" && !Array.isArray(r[k])) {
        // un arto in modalità "to" sostituisce gli angoli
        const switchToAngles = r[k].to && (o[k].s != null || o[k].h != null);
        r[k] = o[k].to || switchToAngles ? clone(o[k]) : Object.assign(r[k], clone(o[k]));
      } else r[k] = clone(o[k]);
    });
    return r;
  }
  // risolve i riferimenti (es. 'kneeA') in coordinate e ricava gli angoli di ogni arto
  function prepare(pose, view, sex) {
    const sk = solve(pose, view, sex);
    const q = clone(pose);
    ["A", "B"].forEach((X) => {
      const a = q["a" + X];
      if (a.to) a.to = [sk["wrist" + X][0], sk["wrist" + X][1]];
      a._s = sk["uaAng" + X]; a._e = sk["faAng" + X]; a._w = sk["haAng" + X] - sk["faAng" + X];
      const g = q["l" + X];
      if (g.to) g.to = [sk["ankle" + X][0], sk["ankle" + X][1]];
      g._h = sk["thAng" + X]; g._k = sk["shAng" + X];
    });
    return q;
  }
  const angLerp = (a, b, t) => { let d = b - a; while (d > 180) d -= 360; while (d < -180) d += 360; return a + d * t; };
  function interp(A, B, t) {
    const r = { p: [lerp(A.p[0], B.p[0], t), lerp(A.p[1], B.p[1], t)] };
    ["t", "n", "h", "sh", "bel"].forEach((k) => (r[k] = lerp(A[k] || 0, B[k] || 0, t)));
    const ta2 = A.t2 == null ? A.t : A.t2, tb2 = B.t2 == null ? B.t : B.t2;
    r.t2 = lerp(ta2, tb2, t);
    r.sc = {};
    const keys = new Set([...Object.keys(A.sc || {}), ...Object.keys(B.sc || {})]);
    keys.forEach((k) => (r.sc[k] = lerp((A.sc || {})[k] ?? 1, (B.sc || {})[k] ?? 1, t)));
    ["A", "B"].forEach((X) => {
      const a = A["a" + X], b = B["a" + X];
      if (a.to && b.to) r["a" + X] = { to: [lerp(a.to[0], b.to[0], t), lerp(a.to[1], b.to[1], t)], b: t < .5 ? a.b : b.b, w: angLerp(a._w, b._w, t) };
      else r["a" + X] = { s: angLerp(a._s, b._s, t), e: angLerp(a._e, b._e, t), w: angLerp(a._w, b._w, t) };
      if (a.wa != null && b.wa != null) r["a" + X].wa = angLerp(a.wa, b.wa, t);
      const g = A["l" + X], h = B["l" + X];
      if (g.to && h.to) r["l" + X] = { to: [lerp(g.to[0], h.to[0], t), lerp(g.to[1], h.to[1], t)], b: t < .5 ? g.b : h.b };
      else r["l" + X] = { h: angLerp(g._h, h._h, t), k: angLerp(g._k, h._k, t) };
      r["l" + X].f = angLerp(g.f || 0, h.f || 0, t);
    });
    return r;
  }
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ---------- disegno ---------- */
  const X = (p) => f1(p[0]);
  const Y = (p) => f1(-p[1]);
  function capsule(a, b, r1, r2, cls, extra = "") {
    const dx = b[0] - a[0], dy = -(b[1] - a[1]);
    const len = Math.hypot(dx, dy) || 0.001;
    const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
    const A = [X(a), Y(a)], B = [X(b), Y(b)];
    const p1 = [A[0] + nx * r1, A[1] + ny * r1], p2 = [B[0] + nx * r2, B[1] + ny * r2];
    const p3 = [B[0] - nx * r2, B[1] - ny * r2], p4 = [A[0] - nx * r1, A[1] - ny * r1];
    const sw = nx * uy - ny * ux > 0 ? 1 : 0;
    const F = (p) => `${f1(p[0])},${f1(p[1])}`;
    return `<path class="${cls}" ${extra} d="M${F(p1)}L${F(p2)}A${r2},${r2} 0 0 ${sw} ${F(p3)}L${F(p4)}A${r1},${r1} 0 0 ${sw} ${F(p1)}Z"/>`;
  }
  function smooth(pts, cls, extra = "") {
    const s = pts.map((p) => [X(p), Y(p)]);
    return `<path class="${cls}" ${extra} d="${G.cr(s, true)}"/>`;
  }

  function torsoPts(sk) {
    const { P, M, S, d1, d2, fr1, fr2, bel, sex, view } = sk;
    const fe = sex === "f";
    if (view === "side") {
      const pts = [
        add(add(P, d1, -8), fr1, 5),
        add(add(P, d1, 3), fr1, 8.5 + bel * .5),
        add(add(M, d1, -4), fr1, 9 + bel),
        add(add(M, d2, 8), fr2, fe ? 9 : 10),
        add(add(S, d2, -12), fr2, fe ? 13 : 12),
        add(add(S, d2, -3), fr2, 7.5),
        add(add(S, d2, 2), fr2, 3),
        add(add(S, d2, 2), fr2, -4),
        add(add(S, d2, -6), fr2, -10),
        add(add(S, d2, -18), fr2, -9.5),
        add(M, fr1, -6.5),
        add(add(P, d1, 5), fr1, fe ? -12 : -11),
        add(add(P, d1, -4), fr1, fe ? -12.5 : -10.5),
        add(add(P, d1, -10), fr1, -3),
      ];
      return pts;
    }
    const { lat1, lat2 } = sk;
    const side = (s) => [
      add(add(P, d1, -6), lat1, s * (fe ? 15.5 : 14)),
      add(add(P, d1, 5), lat1, s * (fe ? 15 : 13.5)),
      add(M, lat1, s * (fe ? 10.5 : 12.5)),
      add(add(S, d2, -14), lat2, s * (fe ? 13 : 15.5)),
      add(add(S, d2, -4), lat2, s * (fe ? 17 : 20)),
      add(add(S, d2, 1), lat2, s * 6),
    ];
    const a = side(1), b = side(-1).reverse();
    return [add(P, d1, -11), ...a, ...b];
  }

  // forme di evidenziazione dei muscoli al lavoro
  function hiShapes(name, sk, pulse) {
    const out = [];
    const side = sk.view === "side";
    const m = name.match(/^([a-zA-Z]+?)(A|B)?$/);
    const base = m[1], which = m[2] ? [m[2]] : ["A", "B"];
    const cap = (a, b, r) => out.push(capsule(a, b, r, r * .85, "hl", `opacity="${pulse}"`));
    const circ = (c, r) => out.push(`<circle class="hl" opacity="${pulse}" cx="${X(c)}" cy="${Y(c)}" r="${r}"/>`);
    const along = (p, q, t0, t1, off, frontSign) => {
      const v = [q[0] - p[0], q[1] - p[1]];
      const len = Math.hypot(v[0], v[1]) || 1;
      const u = [v[0] / len, v[1] / len];
      const n = [-u[1] * frontSign, u[0] * frontSign];
      const o = side ? off : 0;
      return [add(add(p, v, t0), n, o), add(add(p, v, t1), n, o)];
    };
    const legSeg = (Xs, t0, t1, off, which) => {
      const H = sk["hip" + Xs], K = sk["knee" + Xs], A = sk["ankle" + Xs];
      return which === "thigh" ? along(H, K, t0, t1, off, 1) : along(K, A, t0, t1, off, 1);
    };
    const armSeg = (Xs, t0, t1, off, which) => {
      const Sh = sk["sh" + Xs], E = sk["elbow" + Xs], W = sk["wrist" + Xs];
      return which === "ua" ? along(Sh, E, t0, t1, off, 1) : along(E, W, t0, t1, off, 1);
    };
    const { P, M, S, d1, d2, fr1, fr2 } = sk;
    which.forEach((W) => {
      switch (base) {
        case "quad": { const [a, b] = legSeg(W, .18, .78, 2.8, "thigh"); cap(a, b, 4.2); break; }
        case "ham": { const [a, b] = legSeg(W, .18, .8, -2.8, "thigh"); cap(a, b, 4); break; }
        case "adductor": { const [a, b] = legSeg(W, .1, .55, 0, "thigh"); cap(a, b, 3.6); break; }
        case "calf": { const [a, b] = legSeg(W, .1, .55, -1.8, "shin"); cap(a, b, 3.8); break; }
        case "tib": { const [a, b] = legSeg(W, .1, .7, 1.6, "shin"); cap(a, b, 2.4); break; }
        case "foot": { const f = sk["foot" + W]; cap(f.heel, f.toe, 2.2); break; }
        case "biceps": { const [a, b] = armSeg(W, .2, .8, 1.6, "ua"); cap(a, b, 3); break; }
        case "triceps": { const [a, b] = armSeg(W, .2, .85, -1.6, "ua"); cap(a, b, 3); break; }
        case "forearm": case "forearmExt": { const [a, b] = armSeg(W, .1, .65, 0, "fa"); cap(a, b, 2.8); break; }
        case "delt": circ(sk["sh" + W], 5.6); break;
        case "rotator": circ(side ? add(sk["sh" + W], fr2, -4) : sk["sh" + W], 4.6); break;
        case "nerveArm": out.push(`<path class="hln" opacity="${pulse}" d="M${X(sk["sh" + W])},${Y(sk["sh" + W])}L${X(sk["elbow" + W])},${Y(sk["elbow" + W])}L${X(sk["wrist" + W])},${Y(sk["wrist" + W])}L${X(sk["hand" + W])},${Y(sk["hand" + W])}"/>`); break;
        case "nerveLeg": { const off = side ? -3 : 0; const H = add(sk["hip" + W], fr1, off), K = add(sk["knee" + W], [0, 0]), A = sk["ankle" + W];
          out.push(`<path class="hln" opacity="${pulse}" d="M${X(add(P, fr1, -6))},${Y(add(P, fr1, -6))}L${X(H)},${Y(H)}L${X(K)},${Y(K)}L${X(A)},${Y(A)}"/>`); break; }
        case "glute": if (side) { if (W === "A") cap(add(add(P, fr1, -7), d1, 3), add(add(P, fr1, -7), d1, -4), 6); } else circ(add(sk["hip" + W], d1, 2), 6.5); break;
        case "abductor": if (side) { if (W === "A") circ(add(add(P, d1, 5), fr1, -3), 5.5); } else circ(add(add(sk["hip" + W], d1, 5), sk.lat1, W === "A" ? 4 : -4), 5); break;
        case "hipflex": if (side) { if (W === "A") cap(add(add(P, fr1, 5), d1, 6), add(add(P, fr1, 6), d1, -5), 3.6); } else circ(add(sk["hip" + W], d1, -2), 4.5); break;
      }
    });
    if (which.length === 2 || base) {
      switch (base) {
        case "abs": cap(add(add(P, d1, 4), fr1, side ? 6 : 0), add(add(M, d2, 8), fr2, side ? 6 : 0), side ? 4.6 : 7); break;
        case "obl": cap(add(P, d1, 5), add(M, d2, 6), side ? 5 : 8); break;
        case "lumbar": cap(add(add(P, d1, 3), fr1, side ? -6 : 0), add(add(M, d1, 3), fr1, side ? -6 : 0), side ? 4.6 : 6); break;
        case "chest": cap(add(add(S, d2, -9), fr2, side ? 7 : 0), add(add(S, d2, -18), fr2, side ? 7 : 0), side ? 5 : 11); break;
        case "upperback": cap(add(add(S, d2, -6), fr2, side ? -6.5 : 0), add(add(S, d2, -18), fr2, side ? -6.5 : 0), side ? 5 : 10); break;
        case "lats": cap(add(add(S, d2, -14), fr2, side ? -5 : 0), add(add(M, d2, 2), fr2, side ? -5 : 0), side ? 5 : 11); break;
        case "neck": cap(S, sk.neckEnd, 3.6); break;
        case "trap": if (side) circ(add(add(S, d2, -2), fr2, -4), 5); else { which.forEach((W) => cap(add(S, d2, 1), sk["sh" + W], 3.6)); } break;
      }
    }
    return out.join("");
  }

  function figure(sk, ex, pulse) {
    const side = sk.view === "side";
    const fe = sk.sex === "f";
    const hi = ex.hi || [];
    const hiFor = (filter) => hi.filter(filter).map((h) => hiShapes(h, sk, pulse)).join("");
    const limbHi = (X) => hiFor((h) => /(A|B)$/.test(h) ? h.endsWith(X) && !/^(abs|obl|lumbar|chest|upperback|lats|neck|trap)/.test(h) : !/^(abs|obl|lumbar|chest|upperback|lats|neck|trap)/.test(h) && X === "A");
    const r = fe ? .92 : 1;
    const leg = (Xs, cls) => {
      const H = sk["hip" + Xs], K = sk["knee" + Xs], A = sk["ankle" + Xs], ft = sk["foot" + Xs];
      let s = capsule(H, K, 7.2 * r, 5.2 * r, cls) + capsule(K, A, 5 * r, 3.4 * r, cls);
      if (side) s += smooth([ft.heel, add(ft.heel, ft.up, 4), add(A, ft.up, 2), add(ft.toe, ft.up, 2.6), ft.toe, add(ft.toe, ft.u, -3)], cls);
      else { const v = [A[0] - K[0], A[1] - K[1]], l = Math.hypot(v[0], v[1]) || 1; s += capsule(A, add(A, [v[0] / l, v[1] / l], 7), 3.6, 4.4, cls); }
      return s;
    };
    const arm = (Xs, cls) => {
      const Sh = sk["sh" + Xs], E = sk["elbow" + Xs], W = sk["wrist" + Xs], Hd = sk["hand" + Xs];
      return capsule(Sh, E, 4.6 * r, 3.8 * r, cls) + capsule(E, W, 3.6 * r, 2.6 * r, cls) + capsule(W, Hd, 2.6, 2.2, cls);
    };
    const head = () => {
      const c = sk.head, hd = sk.hd, hf = side ? sk.hf : [0, 0];
      let s = capsule(sk.S, sk.neckEnd, 4.2 * r, 3.8 * r, "seg torso");
      if (fe) {
        s += side ? smooth([add(add(c, hf, -9), hd, 6), add(add(c, hf, -15), hd, 1), add(add(c, hf, -16), hd, -9), add(add(c, hf, -12), hd, -6), add(add(c, hf, -9), hd, -1)], "hair")
                  : smooth([add(c, hd, 11.5), add(add(c, [-hd[1], hd[0]], 11), hd, 2), add(add(c, [-hd[1], hd[0]], 10.5), hd, -6), add(add(c, [hd[1], -hd[0]], 10.5), hd, -6), add(add(c, [hd[1], -hd[0]], 11), hd, 2)], "hair");
      }
      s += `<circle class="seg head" cx="${X(c)}" cy="${Y(c)}" r="${fe ? 9.6 : 10}"/>`;
      if (side) {
        const nose = add(add(c, hf, 9.6), hd, -1);
        s += smooth([add(add(c, hf, 8.5), hd, 1.5), add(nose, hf, 1.8), add(add(c, hf, 8.4), hd, -3)], "seg head");
        const eye = add(add(c, hf, 5.6), hd, 1.6);
        s += `<circle class="eye" cx="${X(eye)}" cy="${Y(eye)}" r="1"/>`;
      }
      return s;
    };
    let out = "";
    if (side) {
      out += arm("B", "seg far") + hiFor((h) => h.endsWith("B") && /^(biceps|triceps|delt|forearm|rotator|nerveArm)/.test(h));
      out += leg("B", "seg far") + hiFor((h) => /B$/.test(h) && /^(quad|ham|calf|tib|foot|adductor|nerveLeg)/.test(h));
      out += smooth(torsoPts(sk), "seg torso");
      out += hiFor((h) => /^(abs|obl|lumbar|chest|upperback|lats|neck|trap|glute|abductor|hipflex)/.test(h));
      out += head();
      out += leg("A", "seg near") + hiFor((h) => /^(quad|ham|calf|tib|foot|adductor|nerveLeg)/.test(h) && !/B$/.test(h));
      out += arm("A", "seg near") + hiFor((h) => /^(biceps|triceps|delt|forearm|rotator|nerveArm)/.test(h) && !/B$/.test(h));
    } else {
      out += leg("B", "seg near") + leg("A", "seg near");
      out += hiFor((h) => /^(quad|ham|calf|tib|foot|adductor|nerveLeg|glute|abductor|hipflex)/.test(h));
      out += smooth(torsoPts(sk), "seg torso");
      out += hiFor((h) => /^(abs|obl|lumbar|chest|upperback|lats|trap)/.test(h));
      out += head() + hiFor((h) => /^neck/.test(h));
      out += arm("B", "seg near") + arm("A", "seg near");
      out += hiFor((h) => /^(biceps|triceps|delt|forearm|rotator|nerveArm)/.test(h));
    }
    return out;
  }

  /* ---------- attrezzi ---------- */
  function propPoint(sk, ref) { return typeof ref === "string" ? sk[ref] : ref; }
  function props(sk, ex, layer) {
    let s = "";
    (ex.props || []).forEach((p) => {
      const front = p.type === "band" || p.type === "db" || p.type === "strap";
      if ((layer === "front") !== front) return;
      switch (p.type) {
        case "mat": s += `<rect class="pr-mat" x="${p.x0}" y="-1.6" width="${p.x1 - p.x0}" height="1.6" rx=".8"/>`; break;
        case "box": s += `<rect class="pr-box" x="${p.x}" y="${-p.h}" width="${p.w}" height="${p.h}" rx="1.5"/>`; break;
        case "step": s += `<rect class="pr-box" x="${p.x}" y="${-p.h}" width="${p.w}" height="${p.h}" rx="1.2"/><rect class="pr-edge" x="${p.x}" y="${-p.h}" width="${p.w}" height="1.6"/>`; break;
        case "chair": {
          const { x, w, h } = p;
          s += `<rect class="pr-box" x="${x}" y="${-h}" width="${w}" height="4" rx="1.5"/>`;
          s += `<rect class="pr-leg" x="${x + 1}" y="${-h + 3}" width="2.4" height="${h - 3}"/><rect class="pr-leg" x="${x + w - 3.4}" y="${-h + 3}" width="2.4" height="${h - 3}"/>`;
          if (p.back) s += `<rect class="pr-box" x="${x}" y="${-h - p.back}" width="3.4" height="${p.back}" rx="1.4"/>`;
          break;
        }
        case "table": {
          const { x, w, h } = p;
          s += `<rect class="pr-box" x="${x}" y="${-h}" width="${w}" height="3.4" rx="1"/>`;
          s += `<rect class="pr-leg" x="${x + 2}" y="${-h + 3}" width="2.4" height="${h - 3}"/><rect class="pr-leg" x="${x + w - 4.4}" y="${-h + 3}" width="2.4" height="${h - 3}"/>`;
          break;
        }
        case "wall": s += `<rect class="pr-wall" x="${p.x}" y="-210" width="${p.w || 6}" height="210"/>`; break;
        case "wallbg": s += `<rect class="pr-wallbg" x="-60" y="-200" width="120" height="200" rx="2"/>`; break;
        case "post": s += `<rect class="pr-wall" x="${p.x}" y="-210" width="4" height="210"/>`; break;
        case "ball": s += `<circle class="pr-ball" cx="${p.x}" cy="${-p.y}" r="${p.r}"/>`; break;
        case "band": { const a = propPoint(sk, p.from), b = propPoint(sk, p.to);
          s += `<path class="pr-band" d="M${X(a)},${Y(a)}L${X(b)},${Y(b)}"/><circle class="pr-anchor" cx="${X(b)}" cy="${Y(b)}" r="1.6"/>`; break; }
        case "strap": { const a = propPoint(sk, p.from), b = propPoint(sk, p.to);
          s += `<path class="pr-strap" d="M${X(a)},${Y(a)}L${X(b)},${Y(b)}"/>`; break; }
        case "db": {
          const c = propPoint(sk, p.at);
          const W = sk["wrist" + p.at.slice(-1)], v = [c[0] - W[0], c[1] - W[1]], l = Math.hypot(v[0], v[1]) || 1;
          const n = [-v[1] / l, v[0] / l];
          const m = add(W, v, .55);
          const a = add(m, n, -6), b = add(m, n, 6);
          s += `<path class="pr-dbbar" d="M${X(a)},${Y(a)}L${X(b)},${Y(b)}"/>` + capsule(add(a, n, -1.5), add(a, n, 1.5), 3.6, 3.6, "pr-db") + capsule(add(b, n, -1.5), add(b, n, 1.5), 3.6, 3.6, "pr-db");
          break;
        }
      }
    });
    return s;
  }

  /* ---------- player ---------- */
  let mqN = 0;
  const MQ_IDS = ["mgNear", "mgFar", "mgTorso", "mgShadow", "mgGlow"];
  function defs() {
    const pre = "mq" + (++mqN) + "-";
    const vars = MQ_IDS.map((n) => `--${n}:url(#${pre}${n})`).join(";");
    return { vars, html: `<defs>
      <linearGradient id="mgNear" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9bedc"/><stop offset="1" stop-color="#5f7699"/></linearGradient>
      <linearGradient id="mgFar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d6f8c"/><stop offset="1" stop-color="#34425a"/></linearGradient>
      <linearGradient id="mgTorso" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9cbe6"/><stop offset="1" stop-color="#6a81a6"/></linearGradient>
      <radialGradient id="mgShadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <filter id="mgGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`.replace(/id="(mg\w+)"/g, `id="${pre}$1"`) };
  }

  function prepareExercise(ex, sex) {
    const view = ex.view || "side";
    const base = DEF[view];
    let prev = merge(base, ex.base || {});
    const ks = ex.k.map((k) => {
      const pose = merge(prev, k.pose || {});
      prev = pose;
      return { pose: prepare(pose, view, sex), raw: pose, d: k.d || 1200, hold: k.hold == null ? 400 : k.hold, label: k.label || "" };
    });
    return { view, ks };
  }

  function fitBox(ex, prep, sex) {
    if (ex.focus) { const [x0, y0, x1, y1] = ex.focus; return [x0, -y1, x1 - x0, y1 - y0]; }
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const grow = (p, r = 0) => { if (!p) return; x0 = Math.min(x0, p[0] - r); x1 = Math.max(x1, p[0] + r); y0 = Math.min(y0, p[1] - r); y1 = Math.max(y1, p[1] + r); };
    prep.ks.forEach((k, i) => {
      [0, .5].forEach((tt) => {
        const nxt = prep.ks[(i + 1) % prep.ks.length];
        const sk = solve(tt ? interp(k.pose, nxt.pose, tt) : interp(k.pose, k.pose, 0), prep.view, sex);
        ["P", "S", "head", "kneeA", "kneeB", "ankleA", "ankleB", "handA", "handB", "elbowA", "elbowB", "shA", "shB"].forEach((n) => grow(sk[n], n === "head" ? 12 : 7));
        grow(sk.footA.toe, 3); grow(sk.footB.toe, 3); grow(sk.footA.heel, 3);
      });
    });
    (ex.props || []).forEach((p) => {
      if (p.type === "box" || p.type === "step" || p.type === "chair" || p.type === "table") { grow([p.x, 0]); grow([p.x + p.w, p.h + (p.back || 0)]); }
      if (p.type === "wall" || p.type === "post") { grow([p.x - 4, 0]); grow([p.x + 8, 0]); }
      if (p.type === "band" && Array.isArray(p.to)) grow(p.to, 3);
    });
    y0 = Math.min(y0, -2);
    const pad = 10;
    x0 -= pad; x1 += pad; y1 += pad; y0 -= 4;
    let w = x1 - x0, h = y1 - y0;
    const ar = 4 / 3;
    if (w / h < ar) { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; }
    else { const nh = w / ar; y1 += (nh - h); h = nh; }
    return [x0, -y1, w, h];
  }

  function create(container, ex, sex, onUpdate) {
    const prep = prepareExercise(ex, sex);
    const vb = fitBox(ex, prep, sex);
    const D = defs();
    container.innerHTML = `<svg class="mq-svg" style="${D.vars}" viewBox="${vb.map(f1).join(" ")}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${D.html}
      <g class="mq-floor"><rect x="${vb[0] - 50}" y="0" width="${vb[2] + 100}" height="${vb[3]}" class="pr-floor"/><line x1="${vb[0] - 50}" x2="${vb[0] + vb[2] + 50}" y1="0" y2="0" class="pr-floorline"/></g>
      <g class="mq-back"></g><ellipse class="mq-shadow" cx="0" cy="0" rx="30" ry="3"/><g class="mq-fig"></g><g class="mq-front"></g></svg>`;
    const gBack = container.querySelector(".mq-back"), gFig = container.querySelector(".mq-fig"), gFront = container.querySelector(".mq-front"), shadow = container.querySelector(".mq-shadow");
    const n = prep.ks.length;
    const segs = [];
    let total = 0;
    for (let i = 0; i < n; i++) {
      const to = (i + 1) % n;
      const d = prep.ks[to].d, hold = prep.ks[to].hold;
      segs.push({ from: i, to, start: total, d, hold });
      total += d + hold;
    }
    let time = 0, playing = true, speed = 1, last = 0, raf = 0, lastPhase = -1, reps = 0, lastCycle = 0;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function poseAt(tm) {
      if (n === 1) return { pose: prep.ks[0].pose, phase: 0 };
      const tt = ((tm % total) + total) % total;
      for (const s of segs) {
        if (tt < s.start + s.d + s.hold) {
          const local = tt - s.start;
          const k = local >= s.d ? 1 : ease(local / s.d);
          return { pose: interp(prep.ks[s.from].pose, prep.ks[s.to].pose, k), phase: s.to };
        }
      }
      return { pose: prep.ks[0].pose, phase: 0 };
    }
    function draw() {
      const { pose, phase } = poseAt(time);
      const sk = solve(pose, prep.view, sex);
      const pulse = (0.55 + 0.35 * Math.sin(time / 260)).toFixed(2);
      gBack.innerHTML = props(sk, ex, "back");
      gFig.innerHTML = figure(sk, ex, pulse);
      gFront.innerHTML = props(sk, ex, "front");
      const fx = (sk.ankleA[0] + sk.ankleB[0] + sk.P[0]) / 3;
      shadow.setAttribute("cx", f1(fx));
      const cyc = Math.floor(time / total);
      if (cyc !== lastCycle) { lastCycle = cyc; reps++; }
      if (phase !== lastPhase || onUpdate) { lastPhase = phase; onUpdate && onUpdate({ label: prep.ks[phase].label, phase, reps, n }); }
    }
    function loop(ts) {
      if (!last) last = ts;
      const dt = Math.min(64, ts - last); last = ts;
      if (playing) time += dt * speed;
      draw();
      raf = requestAnimationFrame(loop);
    }
    if (reduce) { playing = false; time = segs[0] ? segs[0].d : 0; }
    raf = requestAnimationFrame(loop);
    return {
      play() { playing = true; }, pause() { playing = false; }, toggle() { playing = !playing; return playing; },
      isPlaying: () => playing, setSpeed(s) { speed = s; }, restart() { time = 0; reps = 0; lastCycle = 0; },
      destroy() { cancelAnimationFrame(raf); container.innerHTML = ""; },
      frameAt(i) { time = i < segs.length ? segs[(i - 1 + n) % n].start + segs[(i - 1 + n) % n].d : 0; playing = false; draw(); },
    };
  }

  // anteprima statica (miniatura) di un esercizio
  function still(ex, sex, kIndex) {
    const prep = prepareExercise(ex, sex);
    const vb = fitBox(ex, prep, sex);
    const k = prep.ks[Math.min(kIndex == null ? prep.ks.length - 1 : kIndex, prep.ks.length - 1)];
    const sk = solve(k.pose, prep.view, sex);
    const D = defs();
    return `<svg class="mq-svg" style="${D.vars}" viewBox="${vb.map(f1).join(" ")}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${D.html}
      <rect x="${vb[0] - 50}" y="0" width="${vb[2] + 100}" height="${vb[3]}" class="pr-floor"/><line x1="${vb[0] - 50}" x2="${vb[0] + vb[2] + 50}" y1="0" y2="0" class="pr-floorline"/>
      ${props(sk, ex, "back")}<g>${figure(sk, ex, .8)}</g>${props(sk, ex, "front")}</svg>`;
  }

  return { create, still, solve };
})();
