/* =========================================================
   SPORT: il gesto atletico scomposto in fasi, con lo stato
   dei muscoli della gamba in primo piano (A) in ogni fase.
   Stati: c = si contrae (si accorcia), e = lavora allungandosi
   (frena, contrazione eccentrica), s = si allunga.
   Usa il manichino degli esercizi (vista di lato).
   ========================================================= */
window.Sport = (function () {
  const STATI = {
    c: { t: "Si contrae", d: "si accorcia e spinge", color: "#ff5a3c" },
    e: { t: "Frena allungandosi", d: "lavora mentre si allunga (eccentrico)", color: "#ffb23f" },
    s: { t: "Si allunga", d: "viene messo in allungamento", color: "#46b6ff" },
  };

  // muscoli della gamba: nome, ruolo nella corsa, rischio, punto dell'atlante collegato
  const MUSCOLI = {
    quad: { name: "Quadricipite", point: "quadricipite", role: "Estende il ginocchio e assorbe l'impatto quando il piede tocca terra.", risk: "Sovraccarico del tendine rotuleo e della rotula, soprattutto in discesa e con passi troppo lunghi." },
    ham: { name: "Ischiocrurali", point: "ischiocrurali", role: "Frenano la gamba che si distende in avanti ed estendono l'anca in appoggio.", risk: "Stiramenti nella fase di gamba tesa in avanti, tipici degli scatti." },
    calf: { name: "Polpaccio e tendine d'Achille", point: "polpaccio", role: "Sono una molla: si caricano in appoggio e restituiscono energia nella spinta.", risk: "Tendinopatia d'Achille e strappi del polpaccio quando aumenti in fretta chilometri o velocità." },
    glute: { name: "Glutei", point: "gluteo-medio", role: "Estendono l'anca e tengono il bacino in asse sulla gamba d'appoggio.", risk: "Se sono deboli il ginocchio cade verso l'interno: bandelletta ileotibiale e dolore al ginocchio." },
    hipflex: { name: "Flessori dell'anca", point: "flessori-anca", role: "Portano avanti la coscia nella fase di volo.", risk: "Si accorciano stando seduti a lungo e tirano la zona lombare." },
    tib: { name: "Tibiale anteriore", point: "tibiale-anteriore", role: "Alza la punta del piede in volo e accompagna la pianta a terra all'appoggio.", risk: "Periostite tibiale (dolore lungo la tibia) se aumenti troppo in fretta i chilometri." },
  };

  /* ---------------- CORSA ---------------- */
  // 4 pose per la gamba A; le altre 4 si ottengono scambiando gambe e braccia
  const HALF = [
    { p: [0, 89], lA: { h: 22, k: 4, f: 8 }, lB: { h: -10, k: -100, f: -25 }, aA: { s: -38, e: 48 }, aB: { s: 34, e: 118 } },
    { p: [0, 86.5], lA: { h: 8, k: -28, f: 0 }, lB: { h: 28, k: -62, f: -12 }, aA: { s: -5, e: 75 }, aB: { s: 5, e: 85 } },
    { p: [0, 87], lA: { h: -30, k: -38, f: -35 }, lB: { h: 55, k: -5, f: 4 }, aA: { s: 34, e: 118 }, aB: { s: -38, e: 48 } },
    { p: [0, 93], lA: { h: -14, k: -95, f: -28 }, lB: { h: 40, k: 12, f: 10 }, aA: { s: 28, e: 110 }, aB: { s: -32, e: 52 } },
  ];
  const swap = (q) => ({ p: q.p, lA: q.lB, lB: q.lA, aA: q.aB, aB: q.aA });
  const POSES = HALF.concat(HALF.map(swap)).map((q) => Object.assign({ t: 9, n: -6, h: 0 }, q));

  const CORSA = {
    id: "corsa", name: "Corsa", cycle: 720,
    intro: "Ogni passo di corsa dura meno di un secondo. Rallenta il movimento e guarda la gamba in primo piano: in rosso i muscoli che si accorciano e spingono, in giallo quelli che frenano allungandosi, in azzurro quelli che si allungano.",
    phases: [
      { name: "Contatto del piede", mus: { quad: "e", ham: "c", glute: "c", tib: "e", calf: "c" },
        desc: "Il piede tocca terra poco davanti al corpo. Il quadricipite frena il ginocchio che si piega, il tibiale accompagna la pianta a terra, glutei e ischiocrurali tengono ferma l'anca." },
      { name: "Appoggio intermedio", mus: { quad: "e", calf: "e", glute: "c", hipflex: "s" },
        desc: "Il corpo passa sopra il piede: è il momento di massimo carico, 2–3 volte il peso del corpo. Polpaccio e tendine d'Achille si allungano sotto carico come una molla." },
      { name: "Spinta", mus: { calf: "c", quad: "c", glute: "c", hipflex: "e" },
        desc: "Polpaccio, quadricipite e gluteo si accorciano e spingono via il corpo. L'anca resta dietro: i flessori dell'anca si allungano e si caricano come un elastico." },
      { name: "Stacco e volo", mus: { hipflex: "c", quad: "s", tib: "c", ham: "c" },
        desc: "Il piede si stacca. I flessori dell'anca iniziano a tirare avanti la coscia, il tallone sale e il quadricipite (retto femorale) si allunga." },
      { name: "Recupero, tallone alto", mus: { hipflex: "c", quad: "s", tib: "c" },
        desc: "Mentre l'altra gamba appoggia, questa si ripiega sotto il gluteo: più è raccolta, meno energia serve per portarla avanti." },
      { name: "Recupero, coscia avanti", mus: { hipflex: "c", glute: "s", tib: "c" },
        desc: "I flessori dell'anca portano avanti il ginocchio; il tibiale tiene su la punta del piede per non inciampare." },
      { name: "Ginocchio alto", mus: { hipflex: "c", ham: "s", glute: "s", tib: "c" },
        desc: "La coscia è in alto davanti: gluteo e ischiocrurali cominciano ad allungarsi." },
      { name: "Gamba tesa in avanti", mus: { ham: "e", quad: "c", glute: "e", tib: "c" },
        desc: "La gamba si distende prima di toccare terra. Gli ischiocrurali la frenano allungandosi: è il momento in cui avvengono più spesso gli stiramenti." },
    ],
  };
  CORSA.phases.forEach((ph, i) => (ph.pose = POSES[i]));

  const SPORTS = { corsa: CORSA };

  // nomi dei muscoli per il manichino (gamba in primo piano)
  const hiName = (m) => (m === "glute" || m === "hipflex" ? m : m + "A");
  const hiList = (mus) => Object.entries(mus).map(([m, s]) => hiName(m) + ":" + s);

  function prep(sport, sex) {
    return Mannequin.prepareExercise({ view: "side", base: sport.phases[0].pose, k: sport.phases.map((p) => ({ pose: p.pose, d: 1, hold: 0 })) }, sex);
  }
  // posa nel tempo u (0..1 del ciclo), interpolazione lineare continua
  function poseAt(pr, u) {
    const n = pr.ks.length, x = (((u % 1) + 1) % 1) * n, i = Math.floor(x), f = x - i;
    return { pose: Mannequin.interp(pr.ks[i].pose, pr.ks[(i + 1) % n].pose, f), phase: f < .5 ? i : (i + 1) % n, idx: i, frac: f };
  }

  /* ------------- motore condiviso di animazione ------------- */
  const live = new Set();
  let raf = 0, lastT = 0;
  function tick(ts) {
    const dt = lastT ? Math.min(64, ts - lastT) : 16; lastT = ts;
    live.forEach((r) => { if (!r.el.isConnected) live.delete(r); else r.step(dt); });
    raf = live.size ? requestAnimationFrame(tick) : 0;
    if (!raf) lastT = 0;
  }
  function start(r) { live.add(r); if (!raf) raf = requestAnimationFrame(tick); }

  /* ------------- corridore decorativo (sfondo) ------------- */
  function runner(container, sex, opts = {}) {
    const sport = SPORTS[opts.sport || "corsa"], pr = prep(sport, sex), D = Mannequin.defs();
    container.innerHTML = `<svg class="mq-svg sport-runner" style="${D.vars}" viewBox="-62 -196 124 204" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${D.html}<ellipse class="mq-shadow" cx="0" cy="0" rx="26" ry="3"/><g class="fig"></g></svg>`;
    const g = container.querySelector(".fig");
    let time = opts.offset || 0;
    const r = {
      el: container,
      step(dt) {
        if (r.paused) return;
        time += dt * (opts.speed || 1);
        const { pose } = poseAt(pr, time / sport.cycle);
        g.innerHTML = Mannequin.figure(Mannequin.solve(pose, "side", sex), { hi: [] }, 0);
      },
      paused: false,
    };
    r.step(0); start(r);
    return { pause() { r.paused = true; }, play() { r.paused = false; }, destroy() { live.delete(r); container.innerHTML = ""; } };
  }

  /* ------------- visore con zoom sul movimento ------------- */
  // camera: "corpo" (figura intera), "gamba" (segue la gamba), "piede" (caviglia e polpaccio)
  function viewer(container, sex, opts = {}) {
    const sport = SPORTS[opts.sport || "corsa"], pr = prep(sport, sex), D = Mannequin.defs();
    container.innerHTML = `<svg class="mq-svg sport-view" style="${D.vars}" viewBox="-80 -200 160 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${D.html}
      <g class="track"></g><ellipse class="mq-shadow" cx="0" cy="0" rx="28" ry="3"/><g class="fig"></g></svg>`;
    const svg = container.querySelector("svg"), g = container.querySelector(".fig"), track = container.querySelector(".track");
    const N = sport.phases.length, MOVE = 520, HOLD = 2100, PER = MOVE + HOLD;
    // modalità: "step" = fase per fase (si ferma su ogni fase), "slow" = rallentatore, "real" = velocità reale
    let mode = opts.mode || "step", time = 0, stepT = 0, travel = 0, playing = true, cam = opts.camera || "gamba", lastPhase = -1, hold = null;
    let vb = [-80, -200, 160, 210];
    const easeIO = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    function currentU() {
      if (hold != null) return hold;
      if (mode === "step") { const i = Math.floor(stepT / PER) % N, loc = stepT % PER; return (i + easeIO(Math.min(1, loc / MOVE))) / N; }
      return time / sport.cycle;
    }
    const target = (sk) => {
      const r = container.getBoundingClientRect(), ar = r.width > 10 && r.height > 10 ? r.width / r.height : 4 / 3;
      let cx, cy, h;
      if (cam === "corpo") { cx = 0; cy = -95; h = 205; }
      else if (cam === "piede") { cx = (sk.kneeA[0] + sk.ankleA[0] * 2) / 3; cy = -(sk.kneeA[1] + sk.ankleA[1] * 2) / 3; h = 62; }
      else { cx = (sk.P[0] + sk.kneeA[0] + sk.ankleA[0]) / 3; cy = -(sk.P[1] + sk.kneeA[1] + sk.ankleA[1]) / 3 - 4; h = 138; }
      const w = h * ar;
      return [cx - w / 2, cy - h / 2, w, h];
    };
    function draw(snap) {
      const { pose, phase } = poseAt(pr, currentU());
      const sk = Mannequin.solve(pose, "side", sex);
      const ph = sport.phases[phase];
      const pulse = (0.72 + 0.2 * Math.sin(performance.now() / 240)).toFixed(2);
      g.innerHTML = Mannequin.figure(sk, { hi: hiList(ph.mus) }, pulse);
      // pista che scorre per dare l'idea dell'avanzamento
      const off = -((travel * .16) % 24);
      let t = "";
      for (let x = -240; x < 240; x += 24) t += `<rect class="track-mark" x="${(x + off).toFixed(1)}" y="1.2" width="12" height="1.4" rx=".7"/>`;
      track.innerHTML = `<line class="pr-floorline" x1="-400" x2="400" y1="0" y2="0"/>${t}`;
      const tv = target(sk), k = snap ? 1 : .1;
      vb = vb.map((v, i) => v + (tv[i] - v) * k);
      svg.setAttribute("viewBox", vb.map((v) => v.toFixed(2)).join(" "));
      if (phase !== lastPhase) { lastPhase = phase; opts.onPhase && opts.onPhase(phase, ph); }
    }
    const r = {
      el: container,
      step(dt) {
        if (playing && hold == null) {
          if (mode === "step") { const moving = stepT % PER < MOVE; stepT += dt; travel += moving ? dt * (sport.cycle / N / MOVE) : 0; }
          else { const k = mode === "slow" ? .2 : 1; time += dt * k; travel += dt * k; }
        }
        draw(false);
      },
    };
    draw(true); start(r);
    // allinea i due orologi alla fase i, così si riparte da lì
    const syncTo = (u) => { const i = Math.round(u * N) % N; stepT = (((i - 1) + N) % N) * PER + MOVE; time = u * sport.cycle; };
    return {
      setMode(m) { syncTo(currentU()); hold = null; mode = m; playing = true; },
      toggle() { if (hold != null) { syncTo(hold); hold = null; } playing = !playing; return playing; },
      isPlaying: () => playing,
      setCamera(c) { cam = c; },
      goPhase(i) { playing = false; hold = i / N; syncTo(hold); },
      destroy() { live.delete(r); container.innerHTML = ""; },
    };
  }

  return { SPORTS, STATI, MUSCOLI, runner, viewer };
})();
