/* =========================================================
   Atlante del corpo — logica dell'interfaccia
   ========================================================= */
(function () {
  /* ---- DA PERSONALIZZARE ---------------------------------
     nome: come ti chiamano i tuoi atleti nel messaggio
     whatsapp: il tuo numero con prefisso, solo cifre (es. "393331234567").
     Se lo lasci vuoto, WhatsApp chiederà a chi inviare il riepilogo. */
  const COACH = { nome: "coach", whatsapp: "" };
  /* -------------------------------------------------------- */

  const PTS = POINTS.LIST, BY = POINTS.BY_ID, LAY = POINTS.LAYERS, REG = POINTS.REGIONS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("atlante." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("atlante." + k, JSON.stringify(v)); } catch (e) { /* niente */ } },
  };
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const BASE_VB = [0, 40, 400, 924];

  const saved = store.get("profilo", null);
  const state = {
    sex: saved ? saved.sex : null, age: saved ? saved.age : 35, height: saved ? saved.height : 175,
    layer: "muscoli", view: "f", focus: null, vb: BASE_VB.slice(), quiz: null, result: null,
  };

  /* =================== 1. SETUP =================== */
  const setupEl = $("#setup"), appEl = $("#app");
  function putSvg(el, sex, layer) {
    el.innerHTML = Anatomy.build(sex, "f");
    const svg = el.querySelector("svg");
    svg.setAttribute("data-layer", layer || "none");
    return svg;
  }
  putSvg($("#figM"), "m", "muscoli"); putSvg($("#figF"), "f", "muscoli");

  function buildRuler() {
    const r = $("#ruler");
    let h = "";
    for (let cm = 0; cm <= 210; cm += 30) h += `<span style="bottom:${(cm / 210) * 100}%">${cm}</span>`;
    h += `<div class="mark" id="rulerMark"><b></b></div>`;
    r.innerHTML = h;
  }
  function updateMeasures() {
    $("#ageOut").textContent = state.age + " anni";
    $("#heightOut").textContent = state.height + " cm";
    const mark = $("#rulerMark");
    if (mark) { mark.style.bottom = (state.height / 210) * 100 + "%"; mark.querySelector("b").textContent = state.height + " cm"; }
    const sc = $("#rulerFig .scaler");
    if (sc) sc.style.height = (state.height / 210) * (924 / 904) * 100 + "%";
  }
  function chooseSex(sex) {
    state.sex = sex;
    $$(".sex-card").forEach((c) => c.classList.toggle("on", c.dataset.sex === sex));
    $("#stepMeasures").hidden = false;
    $("#rulerFig").innerHTML = `<div class="scaler"></div>`;
    putSvg($("#rulerFig .scaler"), sex);
    buildRuler(); updateMeasures();
    setTimeout(() => $("#stepMeasures").scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  }
  $$(".sex-card").forEach((c) => c.addEventListener("click", () => chooseSex(c.dataset.sex)));
  $("#age").addEventListener("input", (e) => { state.age = +e.target.value; updateMeasures(); });
  $("#height").addEventListener("input", (e) => { state.height = +e.target.value; updateMeasures(); });
  $("#backSex").addEventListener("click", () => { $("#stepMeasures").hidden = true; $("#stepSex").scrollIntoView({ behavior: "smooth" }); });
  // dopo la scelta del corpo si entra nel 3D: prima la pelle, poi gli strati
  $("#startBtn").addEventListener("click", () => { startApp(); enter3D(true); });
  $("#age").value = state.age; $("#height").value = state.height;
  if (state.sex) chooseSex(state.sex);

  function startApp() {
    store.set("profilo", { sex: state.sex, age: state.age, height: state.height });
    setupEl.hidden = true; appEl.hidden = false;
    stopSportBg(); stopHero3D();
    renderProfile(); buildLayerNav(); renderBody(); showHint();
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get("punto") && BY[h.get("punto")]) setTimeout(() => focusPoint(h.get("punto"), h.get("lato") || "r"), 250);
  }
  function showSetup() {
    closeFocus(true);
    appEl.hidden = true; setupEl.hidden = false;
    if (state.sex) chooseSex(state.sex);
    leave3D(); startSportBg(); startHero3D();
  }
  $("#homeBtn").addEventListener("click", showSetup);
  $("#profileChip").addEventListener("click", showSetup);
  function renderProfile() {
    const sx = state.sex === "f" ? "Donna" : "Uomo";
    $("#profileChip").innerHTML = `<span class="pc-long">${sx} · ${state.age} anni · ${state.height} cm</span><span class="pc-short">${sx[0]} · ${state.age} · ${state.height}</span>`;
  }

  /* =================== 2. CORPO =================== */
  let svg = null;
  function buildLayerNav() {
    $("#layers").innerHTML = Object.entries(LAY).map(([k, l]) => `<button class="layer-btn${k === state.layer ? " on" : ""}" data-layer="${k}" style="--c:${l.color}" aria-label="${esc(l.label)}"><i></i><span class="l-long">${l.label}</span><span class="l-short">${l.short || l.label}</span></button>`).join("");
    $$("#layers .layer-btn").forEach((b) => b.addEventListener("click", () => setLayer(b.dataset.layer)));
  }
  function setLayer(layer, keepFocus) {
    if (!keepFocus && state.focus) closeFocus();
    state.layer = layer;
    $$("#layers .layer-btn").forEach((b) => b.classList.toggle("on", b.dataset.layer === layer));
    if (svg) svg.setAttribute("data-layer", layer);
    if (mode3d) sync3DLayer();
    const on = $("#layers .layer-btn.on"); if (on && on.scrollIntoView) on.scrollIntoView({ inline: "nearest", block: "nearest" });
    renderHots(); renderLegend();
  }
  function renderBody() {
    $("#bodyHolder").innerHTML = Anatomy.build(state.sex, state.view);
    svg = $("#bodyHolder svg");
    svg.setAttribute("data-layer", state.layer);
    setVB(state.vb);
    renderHots(); renderLegend(); highlight();
    syncViewBtns();
  }
  function syncViewBtns() { $$("[data-view]").forEach((b) => b.classList.toggle("on", mode3d ? b.dataset.view === "3d" : b.dataset.view === state.view)); }
  function setVB(vb) {
    state.vb = vb;
    if (!svg) return;
    svg.setAttribute("viewBox", vb.map((n) => n.toFixed(2)).join(" "));
    scaleHots();
    $("#stage").classList.toggle("zoomed", !state.focus && vb[2] < BASE_VB[2] * .97);
  }
  // Con lo zoom manuale i punti luminosi restano piccoli invece di ingrandirsi
  function scaleHots() {
    if (!svg || state.focus) return;
    const k = Math.max(.3, Math.min(1, state.vb[2] / BASE_VB[2]));
    $$(".hot", svg).forEach((h) => {
      const t = h.getAttribute("transform").replace(/ scale\([^)]*\)/, "");
      h.setAttribute("transform", k < .99 ? `${t} scale(${k.toFixed(3)})` : t);
    });
  }

  function setView(view, then) {
    if (view === state.view) { then && then(); return; }
    const holder = $("#bodyHolder");
    holder.classList.add("flip-out");
    setTimeout(() => {
      state.view = view; renderBody();
      holder.classList.remove("flip-out"); holder.classList.add("flip-in");
      requestAnimationFrame(() => requestAnimationFrame(() => { holder.classList.remove("flip-in"); then && then(); }));
    }, 380);
  }
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.view === "3d") { enter3D(); return; }
    if (mode3d) leave3D();
    setView(b.dataset.view); syncViewBtns();
  }));

  const sidesOf = (p) => (p.central ? ["c"] : ["r", "l"]);
  function posOf(p, side, xy) {
    let [x, y] = xy || p.at;
    if (side === "l") x = 400 - x;
    return Anatomy.place(state.sex, x, y);
  }
  function sideLabel(p, side) {
    if (side === "c") return "";
    const screenRight = side === "r";
    const personLeft = p.view === "f" ? screenRight : !screenRight;
    return personLeft ? "Lato sinistro" : "Lato destro";
  }

  function renderHots() {
    if (!svg) return;
    const g = svg.querySelector(".hots");
    const pts = PTS.filter((p) => p.layer === state.layer && p.view === state.view);
    g.innerHTML = pts.map((p) => sidesOf(p).map((side) => {
      const [x, y] = posOf(p, side);
      return `<g class="hot" data-id="${p.id}" data-side="${side}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(p.name)}"><circle class="hh" r="11"/><circle class="hr" r="5"/><circle class="hc" r="3.4"/></g>`;
    }).join("")).join("") + `<g class="pins"></g><g class="marks"></g>`;
    highlight(); scaleHots(); renderMark();
  }

  function renderLegend() {
    const l = LAY[state.layer];
    const pts = PTS.filter((p) => p.layer === state.layer && p.view === state.view);
    const other = PTS.filter((p) => p.layer === state.layer && p.view !== state.view).length;
    $("#layerLegend").style.setProperty("--c", l.color);
    $("#layerLegend").innerHTML = `<h4><i></i>${l.label}</h4><p>${l.desc}</p>
      <ul>${pts.map((p) => `<li><button data-id="${p.id}">${esc(p.name)}</button></li>`).join("")}</ul>
      ${other ? `<p style="margin-top:8px">+ ${other} punti nella vista ${state.view === "f" ? "dal retro" : "di fronte"}</p>` : ""}`;
    $$("#layerLegend button").forEach((b) => b.addEventListener("click", () => focusPoint(b.dataset.id, "r")));
  }

  /* ---- interazione sul corpo ---- */
  const tip = $("#tooltip");
  function svgPoint(evt) {
    const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function pointFromStructure(el) {
    const s = el.dataset.s;
    return PTS.find((p) => p.layer === state.layer && p.view === state.view && p.parts.includes(s));
  }
  $("#bodyHolder").addEventListener("mousemove", (e) => {
    if (!svg || state.focus) { tip.classList.remove("on"); return; }
    const hot = e.target.closest(".hot"), st = e.target.closest(".st");
    let p = null;
    if (hot) p = BY[hot.dataset.id]; else if (st) p = pointFromStructure(st);
    if (p) {
      tip.innerHTML = `${esc(p.name)}<small>${esc(p.sub)}</small>`;
      tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px";
      tip.classList.add("on");
    } else tip.classList.remove("on");
  });
  $("#bodyHolder").addEventListener("mouseleave", () => tip.classList.remove("on"));
  $("#bodyHolder").addEventListener("click", (e) => {
    if (!svg) return;
    if (gestMoved) { gestMoved = false; return; } // era un trascinamento o uno zoom, non un tocco
    tip.classList.remove("on");
    const hot = e.target.closest(".hot");
    if (hot) { focusPoint(hot.dataset.id, hot.dataset.side); return; }
    const c = svgPoint(e);
    if (state.focus) { placeMark(c); return; } // nel consulto un tocco segna il punto esatto
    const st = e.target.closest(".st");
    let p = st ? pointFromStructure(st) : null;
    if (!p) { // il punto caldo più vicino
      let best = null, bd = 70;
      PTS.filter((q) => q.layer === state.layer && q.view === state.view).forEach((q) => sidesOf(q).forEach((side) => {
        const [x, y] = posOf(q, side); const d = Math.hypot(x - c.x, y - c.y);
        if (d < bd) { bd = d; best = { q, side }; }
      }));
      if (best) { focusPoint(best.q.id, best.side); return; }
      return;
    }
    const side = p.central ? "c" : c.x >= 200 ? "r" : "l";
    focusPoint(p.id, side);
  });
  $("#bodyHolder").addEventListener("keydown", (e) => {
    const hot = e.target.closest && e.target.closest(".hot");
    if (hot && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); focusPoint(hot.dataset.id, hot.dataset.side); }
  });

  /* ---- zoom manuale: rotella, due dita, trascinamento, pulsanti ---- */
  const MIN_W = 70;
  const ptrs = new Map();
  let gest = null, gestMoved = false;
  const zoomLevel = (vb) => Math.max(vb[2] / BASE_VB[2], vb[3] / BASE_VB[3]);
  function clampPan(vb) {
    const [x, y, w, h] = vb;
    const cx = Math.min(400, Math.max(0, x + w / 2));
    const cy = Math.min(BASE_VB[1] + BASE_VB[3], Math.max(BASE_VB[1], y + h / 2));
    return [cx - w / 2, cy - h / 2, w, h];
  }
  // ingrandisce (f < 1) o rimpicciolisce (f > 1) attorno al punto px,py del disegno
  function calcZoom(vb, px, py, f) {
    const [x, y, w, h] = vb;
    const z = zoomLevel(vb);
    if (z * f >= .995) { if (!state.focus) return BASE_VB.slice(); f = 1 / z; }
    if (w * f < MIN_W) f = MIN_W / w;
    return clampPan([px - (px - x) * f, py - (py - y) * f, w * f, h * f]);
  }
  function zoomAt(px, py, f) { setVB(calcZoom(state.vb, px, py, f)); }
  function zoomCenter(f) {
    stopZoom(); hideHint();
    const [x, y, w, h] = state.vb;
    zoomTo(() => calcZoom(state.vb, x + w / 2, y + h / 2, f), 360, { burst: false });
  }
  const holder = $("#bodyHolder");
  holder.addEventListener("pointerdown", (e) => {
    if (!svg || e.button > 0) return;
    stopZoom();
    hideHint();
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) { gestMoved = false; gest = { x: e.clientX, y: e.clientY, vb: state.vb.slice() }; }
    else if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      gest = { d: Math.hypot(a.x - b.x, a.y - b.y), vb: state.vb.slice(), mid: svgPoint({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }) };
      gestMoved = true;
    }
  });
  holder.addEventListener("pointermove", (e) => {
    if (!gest || !ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size >= 2 && gest.d) {
      const [a, b] = [...ptrs.values()];
      stopZoom();
      setVB(gest.vb.slice());
      zoomAt(gest.mid.x, gest.mid.y, gest.d / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)));
    } else if (ptrs.size === 1 && gest.x != null) {
      const dx = e.clientX - gest.x, dy = e.clientY - gest.y;
      if (!gestMoved && Math.hypot(dx, dy) < 8) return;
      if (!state.focus && zoomLevel(gest.vb) > .97) return; // corpo intero: niente da spostare
      gestMoved = true;
      const s = svg.getScreenCTM().a || 1;
      stopZoom();
      setVB(clampPan([gest.vb[0] - dx / s, gest.vb[1] - dy / s, gest.vb[2], gest.vb[3]]));
    }
  });
  const endPtr = (e) => {
    ptrs.delete(e.pointerId);
    if (!ptrs.size) gest = null;
    else if (ptrs.size === 1) { const [p] = [...ptrs.values()]; gest = { x: p.x, y: p.y, vb: state.vb.slice() }; }
  };
  holder.addEventListener("pointerup", endPtr);
  holder.addEventListener("pointercancel", endPtr);
  holder.addEventListener("wheel", (e) => {
    if (!svg) return;
    e.preventDefault(); hideHint();
    const p = svgPoint(e);
    stopZoom();
    zoomAt(p.x, p.y, Math.exp(Math.max(-60, Math.min(60, e.deltaY * (e.deltaMode ? 16 : 1))) * .004));
  }, { passive: false });
  $("#zIn").addEventListener("click", () => zoomCenter(.62));
  $("#zOut").addEventListener("click", () => zoomCenter(1 / .62));
  $("#zReset").addEventListener("click", () => zoomTo(() => BASE_VB, 600));

  // suggerimento iniziale: sparisce al primo gesto o dopo qualche secondo
  let hintTimer = 0;
  function hideHint() { $("#stageHint").classList.add("gone"); clearTimeout(hintTimer); }
  function showHint() {
    const touch = window.matchMedia && matchMedia("(pointer: coarse)").matches;
    $("#stageHint").innerHTML = touch ? `Tocca un <span class="dot"></span> punto · due dita per ingrandire` : `Tocca un <span class="dot"></span> punto luminoso o una struttura · rotella per ingrandire`;
    $("#stageHint").classList.remove("gone");
    clearTimeout(hintTimer); hintTimer = setTimeout(hideHint, 8000);
  }

  /* ---- zoom animato ----
     Invece di ridisegnare il corpo a ogni fotogramma (lento), si anima una
     trasformazione accelerata dalla scheda grafica e alla fine si fissa la
     nuova inquadratura: veloce e senza scatti. */
  let zoomRaf = 0, zoomAnim = null;
  const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function stopZoom() {
    cancelAnimationFrame(zoomRaf);
    if (zoomAnim) { const z = zoomAnim; zoomAnim = null; z.commit(); }
  }
  function zoomTo(targetFn, dur = 620, opts = {}) {
    stopZoom();
    if (!svg) return;
    const to = targetFn();
    const rect = svg.getBoundingClientRect(), ctm = svg.getScreenCTM();
    if (reduceMotion() || !svg.animate || !ctm || rect.width < 2) { setVB(to); return; }
    const k2 = Math.min(rect.width / to[2], rect.height / to[3]), s = k2 / ctm.a;
    const tc = { x: to[0] + to[2] / 2, y: to[1] + to[3] / 2 };
    const cur = { x: ctm.a * tc.x + ctm.e - rect.left, y: ctm.d * tc.y + ctm.f - rect.top };
    const tx = rect.width / 2 - s * cur.x, ty = rect.height / 2 - s * cur.y;
    if (Math.abs(s - 1) < .01 && Math.hypot(tx, ty) < 1) { setVB(to); return; }
    const zoomIn = s > 1.05;
    svg.style.transformOrigin = "0 0"; svg.style.willChange = "transform";
    const anim = svg.animate([{ transform: "translate(0px,0px) scale(1)" }, { transform: `translate(${tx}px,${ty}px) scale(${s})` }],
      { duration: dur, easing: zoomIn ? "cubic-bezier(.16,1,.3,1)" : "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    if (zoomIn && opts.burst !== false) burst(rect.left + cur.x, rect.top + cur.y, opts.color);
    const commit = () => { anim.cancel(); svg.style.willChange = ""; setVB(to); opts.done && opts.done(); };
    zoomAnim = { commit };
    anim.onfinish = () => { if (zoomAnim && zoomAnim.commit === commit) { zoomAnim = null; commit(); } };
  }
  // onda luminosa sul punto verso cui si ingrandisce
  function burst(x, y, color) {
    if (reduceMotion()) return;
    const b = document.createElement("div");
    b.className = "zoom-burst"; b.style.left = x + "px"; b.style.top = y + "px";
    if (color) b.style.setProperty("--bc", color);
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
  function focusBox(p, side) {
    const [cx, cy] = posOf(p, side === "c" ? "r" : side, p.central ? [p.at[0], p.at[1]] : null);
    const rect = svg.getBoundingClientRect();
    const ar = rect.width / Math.max(1, rect.height);
    const both = state.focus && state.focus.both && !p.central;
    let h = p.zoom * 1.3, w = h * ar;
    const minW = both ? Math.abs(cx - 200) * 2 + p.zoom * .7 : p.zoom * .8;
    if (w < minW) { w = minW; h = w / ar; }
    const x = p.central || both ? 200 : cx;
    return [x - w / 2, cy - h / 2, w, h];
  }

  /* ---- selezione ---- */
  function highlight() {
    if (!svg) return;
    svg.classList.toggle("focus", !!state.focus);
    $$(".sel, .peel", svg).forEach((e) => e.classList.remove("sel", "peel"));
    const unscale = (h) => h.getAttribute("transform").replace(/ scale\([^)]*\)/, "");
    $$(".hot", svg).forEach((h) => { h.classList.remove("on"); h.setAttribute("transform", unscale(h)); });
    if (!state.focus) return;
    const p = BY[state.focus.id], side = state.focus.side, both = !!state.focus.both;
    const g = svg.querySelector(".L-" + p.layer);
    const match = (el) => both || side === "c" || el.dataset.side === "c" || el.dataset.side === side;
    p.parts.forEach((s) => $$(`[data-s="${s}"]`, g).forEach((el) => match(el) && el.classList.add("sel")));
    (p.peel || []).forEach((s) => $$(`.L-muscoli [data-s="${s}"]`, svg).forEach((el) => match(el) && el.classList.add("peel")));
    const k = (p.zoom / 520).toFixed(2);
    $$(".hot", svg).forEach((h) => {
      const on = h.dataset.id === p.id && (both || side === "c" || h.dataset.side === side);
      h.classList.toggle("on", on);
      if (on) h.setAttribute("transform", unscale(h) + ` scale(${k})`);
    });
  }
  function setPin(xy) {
    if (!svg || !state.focus) return;
    const g = svg.querySelector(".pins");
    if (!xy) { g.innerHTML = ""; return; }
    const p = BY[state.focus.id];
    const side = state.focus.side === "l" ? "l" : "r";
    let [x, y] = xy;
    if (side === "l" && !p.central) x = 400 - x;
    [x, y] = Anatomy.place(state.sex, x, y);
    const s = p.zoom / 260;
    g.innerHTML = `<g class="pin" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})"><circle class="pr" r="7"/><circle class="pc" r="4"/></g>`;
  }

  function focusPoint(id, side) {
    const p = BY[id]; if (!p) return;
    if (mode3d) leave3D();
    side = p.central ? "c" : side || "r";
    $("#finder").hidden = true; $("#findBtn").setAttribute("aria-expanded", "false");
    const go = () => {
      state.focus = { id, side, both: false, mark: null, mark3d: pendingMark3d };
      pendingMark3d = null;
      state.quiz = { i: 0, answers: {}, done: false };
      state.result = null;
      appEl.classList.add("focus");
      $("#panel").hidden = false; $("#backBtn").hidden = false;
      renderPanel();
      highlight(); setPin(null); renderMark();
      zoomTo(() => focusBox(p, side), 640, { color: LAY[p.layer].color });
      try { history.replaceState(null, "", `#punto=${id}${side !== "c" ? "&lato=" + side : ""}`); } catch (e) { /* file:// */ }
    };
    if (p.layer !== state.layer) setLayer(p.layer, true);
    if (p.view !== state.view) setView(p.view, go); else go();
  }
  function closeFocus(silent) {
    if (!state.focus) return;
    state.focus = null;
    appEl.classList.remove("focus");
    $("#panel").hidden = true; $("#backBtn").hidden = true;
    highlight(); setPin(null); renderMark();
    if (!silent) zoomTo(() => BASE_VB, 520); else { stopZoom(); setVB(BASE_VB.slice()); }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* niente */ }
  }
  $("#backBtn").addEventListener("click", () => closeFocus());

  /* ---- lato scelto: sinistro, destro o entrambi ---- */
  let pendingMark3d = null; // punto segnato nel 3D, passato al consulto che si apre
  // lato della persona ("l"/"r") -> lato dello schermo nella vista del punto
  const screenSide = (p, ps) => (p.view === "f" ? (ps === "l" ? "r" : "l") : (ps === "l" ? "l" : "r"));
  const personSide = (p, ss) => (ss === "c" ? "c" : p.view === "f" ? (ss === "r" ? "l" : "r") : ss);
  function setFocusSide(ps) {
    const F = state.focus, p = BY[F.id];
    if (!F || p.central) return;
    F.both = ps === "b";
    if (!F.both) F.side = screenSide(p, ps);
    F.mark = null; renderMark();
    highlight(); setPin(null);
    zoomTo(() => focusBox(p, F.side), 520, { color: LAY[p.layer].color });
    $$("#panel .side-pick button").forEach((b) => b.classList.toggle("on", b.dataset.ps === (F.both ? "b" : personSide(p, F.side))));
    renderMarkInfo();
    if (state.result) { state.result = evaluate(); renderVerdict(); }
    try { history.replaceState(null, "", `#punto=${p.id}${F.both ? "" : "&lato=" + F.side}`); } catch (e) { /* niente */ }
  }

  /* ---- punto esatto segnato sul corpo ---- */
  function renderMark() {
    if (!svg) return;
    const g = svg.querySelector(".marks"); if (!g) return;
    const F = state.focus;
    if (!F || !F.mark) { g.innerHTML = ""; return; }
    const p = BY[F.id], s = (Math.min(F.markZoom || p.zoom, p.zoom) / 300).toFixed(3);
    g.innerHTML = `<g class="mark" transform="translate(${F.mark.x.toFixed(1)} ${F.mark.y.toFixed(1)}) scale(${s})">
      <circle class="mk-wave" r="9"/><circle class="mk-ring" r="9"/><path class="mk-cross" d="M-15 0h-6M15 0h6M0 -15v-6M0 15v6"/><circle class="mk-dot" r="3.6"/></g>`;
  }
  // descrive dove cade il punto sulla struttura evidenziata e dà un consiglio legato alla posizione
  function describeMark(p, pt) {
    const sel = $$(".L-" + p.layer + " .sel", svg);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    sel.forEach((el) => { try { const b = el.getBBox(); if (b.width + b.height < 1) return; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); } catch (e) { /* niente */ } });
    if (x0 > x1) return { txt: "Punto segnato", tip: "" };
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    const fy = (pt.y - y0) / h, fx = (pt.x - x0) / w;
    const fuori = fx < -.35 || fx > 1.35 || fy < -.25 || fy > 1.25;
    const vert = fy < .28 ? "parte alta" : fy > .72 ? "parte bassa" : "parte centrale";
    // interno/esterno rispetto alla linea centrale del corpo
    const cx = (x0 + x1) / 2, d0 = Math.abs(cx - 200), d1 = Math.abs(pt.x - 200);
    const oriz = p.central ? (Math.abs(pt.x - 200) < 6 ? "al centro" : (pt.x > 200) === (p.view === "f") ? "spostato a sinistra" : "spostato a destra")
      : Math.abs(d1 - d0) < w * .15 ? "al centro" : d1 < d0 ? "verso l'interno" : "verso l'esterno";
    const end = fy < .2 || fy > .8;
    const TIP = {
      muscoli: end ? "Vicino a dove il muscolo diventa tendine: qui si localizzano più spesso tendinopatie e piccoli strappi. Meglio carichi lenti e progressivi che lo stretching forzato."
        : "Nel ventre del muscolo: più spesso contratture, indolenzimento o stiramenti. Calore, automassaggio leggero e movimento dolce aiutano.",
      tendini: end ? "Vicino all'attacco sull'osso (inserzione): evita per ora di allungare forte il tendine e di comprimerlo (per esempio inginocchiarti o appoggiarti sopra)."
        : "Nel corpo del tendine: risponde bene al carico progressivo e lento, mantenendo il dolore sotto 3 su 10 anche il giorno dopo.",
      nervi: "Lungo un nervo il punto in cui senti il sintomo non è sempre quello in cui il nervo è irritato: se c'è formicolio, guarda anche più in alto (collo o schiena).",
      ossa: "Su ossa e articolazioni: se il dolore è proprio sulla linea dell'articolazione pensa a cartilagine o menisco; se è sull'osso e fa male premendo dopo tanto carico, va escluso un sovraccarico osseo.",
      linfatico: "Se senti un linfonodo in quel punto annota quanto è grande e se è morbido o duro. Se dura più di 2–3 settimane, o è duro e non si muove, fallo vedere.",
    }[p.layer];
    return fuori ? { txt: "Un po' fuori dalla struttura evidenziata", tip: "Il punto non cade sulla struttura evidenziata: il dolore può venire da una struttura vicina. Prova un altro strato (muscoli, tendini, nervi) o cerca la zona." }
      : { txt: `${cap1(vert)}, ${oriz}`, tip: TIP };
  }
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function placeMark(pt) {
    const F = state.focus, p = BY[F.id];
    F.mark = { x: pt.x, y: pt.y, ...describeMark(p, pt) };
    // zoom ravvicinato sul punto
    const rect = svg.getBoundingClientRect(), ar = rect.width / Math.max(1, rect.height);
    const cur = state.vb, h = Math.max(70, Math.min(cur[3], p.zoom * .75)), w = h * ar;
    F.markZoom = h;
    renderMark();
    zoomTo(() => clampPan([pt.x - w / 2, pt.y - h / 2, w, h]), 560, { color: "#ff7a2b" });
    renderMarkInfo();
    if (state.result) { state.result = evaluate(); renderVerdict(); }
  }
  function renderMarkInfo() {
    const box = $("#markInfo"); if (!box || !state.focus) return;
    const F = state.focus, M = F.mark;
    const m3 = F.mark3d ? `<p class="mk-3d">Segnato nel 3D: <b>${esc(F.mark3d.name)}</b>${F.mark3d.where ? " · " + esc(F.mark3d.where) : ""}</p>` : "";
    box.innerHTML = M ? `<div class="mark-card on"><span class="mk-ic"></span><div><b>Punto segnato: ${esc(M.txt)}</b>${M.tip ? `<p>${esc(M.tip)}</p>` : ""}${m3}
        <div class="mk-act"><button class="link-btn" id="mkZoom" type="button">Rivedi il punto</button><button class="link-btn" id="mkClear" type="button">Togli il segno</button></div></div></div>`
      : `<div class="mark-card"><span class="mk-ic"></span><div><b>Segna il punto esatto</b><p>Tocca sul corpo il punto preciso che fa male: lo ingrandisco, lo segno e lo aggiungo al riepilogo.</p>${m3}</div></div>`;
    const c = $("#mkClear"); if (c) c.addEventListener("click", () => { F.mark = null; renderMark(); renderMarkInfo(); zoomTo(() => focusBox(BY[F.id], F.side), 520); });
    const z = $("#mkZoom"); if (z) z.addEventListener("click", () => placeMark({ x: M.x, y: M.y }));
  }

  /* =================== 3. RICERCA =================== */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let regionFilter = null;
  function renderFinder() {
    $("#regions").innerHTML = Object.entries(REG).map(([k, v]) => `<button class="chip${regionFilter === k ? " on" : ""}" data-r="${k}">${v}</button>`).join("");
    $$("#regions .chip").forEach((c) => c.addEventListener("click", () => { regionFilter = regionFilter === c.dataset.r ? null : c.dataset.r; renderFinder(); }));
    const q = norm($("#search").value.trim());
    const list = PTS.filter((p) => {
      if (regionFilter && p.region !== regionFilter) return false;
      if (!q) return true;
      const hay = norm([p.name, p.sub, REG[p.region], LAY[p.layer].label, ...p.problemi.map((x) => x[0]), ...Object.values(p.ipotesi).map((h) => h[0])].join(" "));
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
    $("#finderList").innerHTML = list.length ? list.map((p) => `<button class="find-item" data-id="${p.id}" style="--c:${LAY[p.layer].color}"><i></i><span><b>${esc(p.name)}</b><small>${LAY[p.layer].label} · ${REG[p.region]}</small></span></button>`).join("")
      : `<p class="find-empty">Nessun risultato. Prova con un'altra parola o scegli una zona.</p>`;
    $$("#finderList .find-item").forEach((b) => b.addEventListener("click", () => focusPoint(b.dataset.id, "r")));
  }
  $("#findBtn").addEventListener("click", () => {
    const f = $("#finder"); f.hidden = !f.hidden;
    $("#findBtn").setAttribute("aria-expanded", String(!f.hidden));
    if (!f.hidden) { renderFinder(); $("#search").focus(); }
  });
  $("#finderClose").addEventListener("click", () => { $("#finder").hidden = true; $("#findBtn").setAttribute("aria-expanded", "false"); });
  $("#search").addEventListener("input", renderFinder);

  /* =================== 4. PANNELLO =================== */
  const GEN = [
    { id: "pain", type: "pain", q: "Quanto è forte il fastidio adesso, da 0 a 10?" },
    { id: "durata", q: "Da quanto tempo ce l'hai?", a: [["Da pochi giorni", {}, { v: "acuto" }], ["Da 1 a 6 settimane", {}, { v: "sub" }], ["Da più di 3 mesi", {}, { v: "cronico" }], ["Va e viene da tempo", {}, { v: "ricorrente" }]] },
    { id: "quando", q: "Quando senti di più il dolore?", a: [
      ["Sotto sforzo: mentre mi alleno, lavoro o faccio un gesto preciso", {}, { v: "sforzo" }],
      ["In una posizione ferma: seduto, in piedi, sdraiato…", {}, { v: "statico" }],
      ["In tutti e due i casi", {}, { v: "entrambi" }],
      ["Sempre, anche a riposo e senza muovermi", {}, { v: "riposo", flag: "giallo", note: "Un dolore presente sempre, anche a riposo, indica un'irritazione più attiva: merita una valutazione." }]] },
    { id: "sforzo", multi: true, show: (v) => ["sforzo", "entrambi"].includes(v("quando")), q: "Con quale tipo di sforzo? (puoi sceglierne più di uno)", a: [
      ["Corsa o camminata veloce", {}, { v: "corsa" }], ["Salti e atterraggi", {}, { v: "salti" }],
      ["Sollevare pesi o carichi (squat, stacchi, panca)", {}, { v: "pesi" }], ["Braccia sopra la testa o lanci (pallavolo, tennis, nuoto)", {}, { v: "sopra" }],
      ["Scatti, calci e cambi di direzione", {}, { v: "scatti" }], ["Prese e gesti ripetuti della mano (attrezzi, arrampicata, mouse)", {}, { v: "prese" }],
      ["Scale, salite o discese", {}, { v: "scale" }], ["Piegarmi o girare il busto", {}, { v: "torsioni" }]] },
    { id: "fase", show: (v) => ["sforzo", "entrambi"].includes(v("quando")), q: "In che momento dello sforzo compare?", a: [
      ["All'inizio, poi scaldandomi passa", {}, { v: "inizio" }], ["Cresce durante e mi costringe a fermarmi", {}, { v: "durante" }],
      ["Dopo: la sera o il giorno seguente", {}, { v: "dopo" }],
      ["Una fitta improvvisa in un gesto preciso", {}, { v: "fitta", flag: "giallo", note: "Una fitta improvvisa durante un gesto può indicare una piccola lesione: evita quel gesto per qualche giorno." }]] },
    { id: "statico", multi: true, show: (v) => ["statico", "entrambi"].includes(v("quando")), q: "In quale posizione ferma fa male? (puoi sceglierne più di una)", a: [
      ["Seduto a lungo (scrivania, auto)", {}, { v: "seduto" }], ["In piedi fermo", {}, { v: "piedi" }],
      ["Sdraiato o di notte", {}, { v: "notte" }], ["Dormendo su quel lato", {}, { v: "lato" }],
      ["Piegato in avanti (lavarmi, allacciare le scarpe)", {}, { v: "piegato" }], ["Al computer o guardando il telefono", {}, { v: "computer" }],
      ["Al risveglio, poi muovendomi migliora", {}, { v: "risveglio" }], ["Con le braccia alzate o appoggiate a lungo", {}, { v: "braccia" }]] },
    { id: "dominante", show: (v, p) => !p.central && state.focus && !state.focus.both, q: "Il lato che fa male è quello che usi di più?", a: [
      ["Sì: è la mia mano o gamba dominante, il lato di tiro o di battuta", {}, { v: "dom" }],
      ["No, è il lato che uso meno", {}, { v: "nondom" }], ["Non saprei, li uso in modo simile", {}, { v: "nd" }]] },
    { id: "trauma", q: "È iniziato con un trauma (caduta, colpo, distorsione)?", a: [["No", {}, { v: "no" }], ["Sì, ma lieve", {}, { v: "lieve" }], ["Sì: gonfiore o livido subito, oppure non riuscivo a caricare", {}, { v: "forte", flag: "rosso", note: "Dopo un trauma importante è meglio escludere fratture o lesioni con una visita." }]] },
    { id: "allarme", multi: true, q: "Hai anche uno di questi segnali?", a: [["Febbre o brividi", {}, { flag: "rosso" }], ["Dolore forte di notte che non cambia con la posizione", {}, { flag: "rosso" }], ["Formicolio o perdita di forza che peggiora", {}, { flag: "rosso" }], ["Calo di peso senza motivo", {}, { flag: "rosso" }], ["Zona gonfia, calda e arrossata", {}, { flag: "rosso" }], ["Nessuno di questi", {}, { none: true }]] },
  ];
  const LEVEL = {
    1: { t: "Verde · puoi gestirlo", todo: ["Inizia con gli esercizi qui sotto, una volta al giorno.", "Usa i rimedi indicati nei momenti di fastidio.", "Se in 2 settimane non migliora, parlane con me."] },
    2: { t: "Giallo · attenzione", todo: ["Fai gli esercizi in versione leggera, senza superare un dolore di 3 su 10.", "Usa i rimedi per 3–5 giorni e riduci i gesti che lo peggiorano.", "Se in 7–10 giorni non migliora, o peggiora, fatti vedere da un fisioterapista o dal medico."] },
    3: { t: "Rosso · senti un medico", todo: ["Prima di allenare questa zona, fatti visitare da un medico.", "Nel frattempo usa i rimedi e tieni la zona a riposo relativo.", "Porta con te questo riepilogo: aiuta a spiegare cosa senti."] },
    4: { t: "Urgente", todo: ["Contatta subito il medico, la guardia medica o il 112.", "Non allenarti e non aspettare che passi da solo."] },
  };
  const ICONS = {
    ghiaccio: ["#9fe3ff", '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 2 3-2M9 20l3-2 3 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'],
    calore: ["#ffb35c", '<path d="M8 21c-2-3 2-5 0-8s2-6 0-9M14 21c-2-3 2-5 0-8s2-6 0-9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'],
    pomata: ["#c7b8ff", '<path d="M7 3h7l3 4v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM7 9h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>'],
    riposo: ["#8de0b5", '<path d="M3 18h18M5 18v-6h14v6M7 12V8h5v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>'],
    tape: ["#ff9f8f", '<path d="M4 16 16 4l4 4L8 20zM9 11l4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>'],
    tutore: ["#ffd66b", '<rect x="6" y="3" width="12" height="18" rx="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 9h12M6 15h12" stroke="currentColor" stroke-width="2"/>'],
    massaggio: ["#7fd3ff", '<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 12h2M19 12h2M12 3v2M12 19v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
    postura: ["#b5f07a", '<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 7v8M8 22l4-7 4 7M7 10h10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'],
    farmacia: ["#9fe3ff", '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'],
  };

  // domande del punto + domande generali (alcune compaiono solo in base alle risposte precedenti)
  function questions(p) {
    const A = (state.quiz && state.quiz.answers) || {};
    const v = (id) => A[id] && A[id].v;
    return p.domande.map((d, i) => Object.assign({ id: "q" + i }, d)).concat(GEN.filter((q) => !q.show || q.show(v, p)));
  }
  // valori scelti in una domanda a scelta multipla
  const multiVals = (id) => { const a = state.quiz.answers[id], q = GEN.find((x) => x.id === id); return a && a.sel ? a.sel.map((i) => q.a[i][2].v) : []; };

  /* ---- consigli su misura: sforzo, posizione ferma, lato ---- */
  const ADV_SFORZO = {
    corsa: ["Corsa", "Per 1–2 settimane riduci i chilometri del 30–50% e togli ripetute e salite; preferisci terreni piani e morbidi. Accorcia un po' il passo aumentando la cadenza e controlla le scarpe (dopo 600–800 km vanno cambiate)."],
    salti: ["Salti", "Togli per ora salti e pliometria. Rientra con saltelli bassi a due piedi su superficie morbida, poi su un piede, solo quando non fanno male il giorno dopo. Atterra morbido, ginocchio in linea con il piede."],
    pesi: ["Pesi e carichi", "Abbassa i carichi del 30–40% e lavora lento (3 secondi in discesa) solo nel tratto di movimento che non fa male. Controlla la tecnica: schiena neutra, carico vicino al corpo, niente rimbalzi."],
    sopra: ["Braccia sopra la testa e lanci", "Limita per ora i gesti sopra la spalla e i lanci. Rinforza i muscoli delle scapole e la rotazione esterna della spalla; nel riscaldamento fai mobilità di spalla e torace."],
    scatti: ["Scatti e cambi di direzione", "Per ora corri solo in linea retta e a ritmo costante. Reintroduci scatti, calci e cambi di direzione per gradi (prima al 50%, poi al 75%) quando i gesti di prova non fanno male."],
    prese: ["Prese e gesti ripetuti", "Alterna le prese (più larghe, con ganci o magnesite), fai pause ogni 20–30 minuti e allunga l'avambraccio tra una serie e l'altra. Al lavoro: impugnature più grosse e polso dritto."],
    scale: ["Scale e discese", "In discesa il carico su ginocchio e caviglia cresce molto: riduci per ora discese e scale ripetute, scendi un gradino alla volta partendo con il lato sano e rinforza quadricipite e glutei."],
    torsioni: ["Piegarsi e girarsi", "Evita per ora torsioni veloci o sotto carico. Quando ti pieghi usa le anche, come in un inchino, e non la schiena; tieni i pesi vicino al corpo."],
  };
  const ADV_FASE = {
    inizio: "Il dolore che passa scaldandosi è tipico dei tendini: non fermarti del tutto, ma allunga il riscaldamento a 10–15 minuti e tieni il dolore sotto 3 su 10, anche il giorno dopo.",
    durante: "Se il dolore cresce durante l'attività hai trovato la tua soglia: fermati prima di arrivarci e riparti più leggero. Se cresce sempre, anche a carichi bassi, fatti valutare.",
    dopo: "Il dolore la sera o il giorno dopo vuol dire che il carico è stato troppo: riducilo del 30% e poi aumentalo di non più del 10% a settimana.",
    fitta: "Dopo una fitta improvvisa evita per qualche giorno il gesto che l'ha provocata. Se restano dolore, gonfiore o debolezza, fatti vedere.",
  };
  const ADV_STATICO = {
    seduto: ["Seduto a lungo", "Alzati ogni 30–40 minuti per 2 minuti. Sedia con schienale, piedi a terra, ginocchia appena più basse delle anche; in auto avvicina il sedile e appoggia bene la schiena."],
    piedi: ["In piedi fermo", "Non stare immobile: sposta il peso, fai qualche passo, appoggia un piede su un rialzo alternando i lati. Scarpe comode e ammortizzate aiutano."],
    notte: ["Di notte", "Se il dolore ti sveglia, cerca una posizione comoda con cuscini di sostegno. Se è forte e non cambia con nessuna posizione, fatti vedere."],
    lato: ["Dormire su quel lato", "Evita di dormire sul lato che fa male. Sull'altro fianco metti un cuscino tra le ginocchia (anca e ginocchio) oppure abbraccia un cuscino (spalla)."],
    piegato: ["Piegarsi in avanti", "Quando ti pieghi, piega anche ginocchia e anche e tieni la schiena dritta; per allacciare le scarpe appoggia il piede su un rialzo."],
    computer: ["Computer e telefono", "Schermo all'altezza degli occhi, avambracci appoggiati, polsi dritti, telefono all'altezza del viso. Ogni 45 minuti fai 2 minuti di movimento di collo e spalle."],
    risveglio: ["Al risveglio", "La rigidità del mattino che migliora muovendoti risponde bene al movimento: fai gli esercizi dolci appena alzato, dopo una doccia calda. Se dura più di un'ora, parlane con il medico."],
    braccia: ["Braccia alzate o appoggiate", "Evita di tenere a lungo le braccia sollevate o appoggiate su un bordo duro; fai pause e lascia pendere le braccia rilassate per qualche secondo."],
  };
  function advice(p) {
    const A = state.quiz.answers, v = (id) => A[id] && A[id].v, out = [];
    multiVals("sforzo").forEach((k) => ADV_SFORZO[k] && out.push({ g: "Sotto sforzo", t: ADV_SFORZO[k][0], d: ADV_SFORZO[k][1] }));
    if (ADV_FASE[v("fase")]) out.push({ g: "Sotto sforzo", t: "Quando compare", d: ADV_FASE[v("fase")] });
    const F = state.focus, ps = F.both ? "b" : personSide(p, F.side);
    const lato = ps === "l" ? "sinistro" : ps === "r" ? "destro" : "";
    const altro = ps === "l" ? "destro" : "sinistro";
    multiVals("statico").forEach((k) => {
      if (!ADV_STATICO[k]) return;
      let d = ADV_STATICO[k][1];
      if (k === "lato" && lato) d = `Evita di dormire sul fianco ${lato}: dormi sul ${altro} o sulla schiena. Sul fianco ${altro} metti un cuscino tra le ginocchia (anca e ginocchio) oppure abbraccia un cuscino (spalla).`;
      out.push({ g: "In posizione", t: ADV_STATICO[k][0], d });
    });
    if (!p.central) {
      if (ps === "b") out.push({ g: "Lato", t: "Su entrambi i lati", d: "Il dolore da tutti e due i lati fa pensare a cause generali: carico di allenamento, postura, scarpe o abitudini. Se le articolazioni sono gonfie e rigide al mattino da entrambi i lati, parlane con il medico." });
      else {
        const dom = v("dominante");
        if (dom === "dom") out.push({ g: "Lato", t: `Lato ${lato}, quello che usi di più`, d: "Il sovraccarico viene spesso dai gesti ripetuti: dove puoi alterna il lato (borsa, mouse, gamba d'appoggio) e riduci per un po' i gesti ripetuti con questo lato." });
        else if (dom === "nondom") out.push({ g: "Lato", t: `Lato ${lato}, quello che usi meno`, d: "Spesso fa male perché compensa o è più debole: rinforzalo in modo specifico, con esercizi su un lato solo." });
        out.push({ g: "Lato", t: "Confronta i due lati", d: `Fai gli esercizi prima con il lato sano e poi con il ${lato}: usa il lato sano come riferimento per ampiezza e forza, senza forzare il lato dolente.` });
      }
    }
    if (F.mark && F.mark.tip) out.push({ g: "Punto segnato", t: F.mark.txt, d: F.mark.tip });
    return out;
  }

  function renderPanel() {
    const p = BY[state.focus.id], side = state.focus.side, l = LAY[p.layer];
    const sl = sideLabel(p, side);
    const exs = p.esercizi.map((id) => EXERCISES[id]).filter(Boolean);
    $("#panel").innerHTML = `
      <div class="p-head">
        <div class="p-head__row">
          <div class="p-head__titles">
            <span class="tag" style="--c:${l.color};color:${l.color}"><i></i>${l.label} · ${REG[p.region]}</span>
            <h2>${esc(p.name)}</h2>
            <div class="p-sub">${esc(p.sub)}</div>
            ${p.central ? "" : `<div class="side-pick" role="group" aria-label="Lato che fa male"><span>Lato:</span>${[["l", "Sinistro"], ["r", "Destro"], ["b", "Entrambi"]].map(([k, t]) => `<button type="button" data-ps="${k}" class="${(state.focus.both ? "b" : personSide(p, side)) === k ? "on" : ""}">${t}</button>`).join("")}</div>`}
          </div>
          <button class="icon-btn" id="panelClose" aria-label="Chiudi">×</button>
        </div>
        <nav class="p-steps">
          <a href="#s-anat">1 · Anatomia</a><a href="#s-prob">2 · Problemi</a><a href="#s-quiz">3 · Domande</a><a href="#s-esito">4 · Esito e rimedi</a><a href="#s-ex">5 · Esercizi</a>
        </nav>
      </div>
      <div class="p-body">
        <section class="p-sec" id="s-anat">
          <h3><span class="n">1</span>Dove si trova e a cosa serve</h3>
          <div class="two-col">
            <div class="info-card"><h4>Dove si trova</h4><p>${esc(p.dove)}</p></div>
            <div class="info-card"><h4>A cosa serve</h4><p>${esc(p.funzione)}</p></div>
          </div>
        </section>
        <section class="p-sec" id="s-prob">
          <h3><span class="n">2</span>Problemi più frequenti</h3>
          <div class="probs">${p.problemi.map((x, i) => `<div class="prob"><span class="ic">${i + 1}</span><div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div></div>`).join("")}</div>
        </section>
        <section class="p-sec" id="s-quiz">
          <h3><span class="n">3</span>Capiamo meglio il tuo caso</h3>
          <div id="markInfo"></div>
          <p style="color:var(--muted)">Rispondi a qualche domanda: ti aiuto a capire dove si trova esattamente il problema e cosa fare.</p>
          <div class="quiz" id="quiz"></div>
        </section>
        <section class="p-sec" id="s-esito">
          <h3><span class="n">4</span>Esito e rimedi</h3>
          <div id="verdict"></div>
          <h4 style="margin:18px 0 10px">Rimedi utili</h4>
          <div class="remedies">${p.rimedi.map(([ic, t, d]) => { const I = ICONS[ic] || ICONS.farmacia; return `<div class="remedy" style="--rc:${I[0]}"><span class="ri"><svg viewBox="0 0 24 24">${I[1]}</svg></span><b>${esc(t)}</b><p>${esc(d)}</p></div>`; }).join("")}</div>
          <h4 style="margin:18px 0 10px">Quando andare dal medico</h4>
          <div class="doctor"><ul>${p.medico.map((m) => `<li>${esc(m)}</li>`).join("")}</ul></div>
        </section>
        <section class="p-sec" id="s-ex">
          <h3><span class="n">5</span>Esercizi consigliati</h3>
          <div id="exLock"></div>
          <div class="ex-grid">${exs.map((ex, i) => `<button class="ex-card" data-i="${i}"><span class="ex-card__fig">${Mannequin.still(ex, state.sex)}</span><span class="ex-card__body"><b>${esc(ex.name)}</b><small>${esc(ex.dose)} · ${esc(ex.level)}</small></span></button>`).join("")}</div>
          <div class="actions" style="margin-top:20px">
            <button class="btn btn--primary btn--small" id="shareBtn">Invia il riepilogo al ${esc(COACH.nome)}</button>
            <button class="btn btn--ghost btn--small" id="copyBtn">Copia riepilogo</button>
            <button class="btn btn--ghost btn--small" id="printBtn">Stampa / PDF</button>
          </div>
          <p class="disc">Queste informazioni sono una guida generale e non sostituiscono la visita di un medico o di un fisioterapista. In caso di dubbio, chiedi sempre a un professionista.</p>
        </section>
      </div>`;
    $("#panel").scrollTop = 0;
    $("#panelClose").addEventListener("click", () => closeFocus());
    $$("#panel .ex-card").forEach((b) => b.addEventListener("click", () => openExercise(exs, +b.dataset.i)));
    $("#shareBtn").addEventListener("click", share);
    $("#copyBtn").addEventListener("click", copySummary);
    $("#printBtn").addEventListener("click", () => window.print());
    $$(".p-steps a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); $(a.getAttribute("href")).scrollIntoView({ behavior: "smooth", block: "start" }); }));
    $$("#panel .side-pick button").forEach((b) => b.addEventListener("click", () => setFocusSide(b.dataset.ps)));
    renderMarkInfo(); renderQuiz(); renderVerdict();
  }

  /* ---- questionario ---- */
  function renderQuiz() {
    if (!state.focus) return;
    const p = BY[state.focus.id], qs = questions(p), Q = state.quiz;
    const box = $("#quiz");
    if (Q.done) {
      box.innerHTML = `<div class="quiz__count">Questionario completato</div><p class="quiz__q" style="font-size:1rem">Grazie! Trovi l'esito qui sotto.</p><div class="quiz__nav"><button class="link-btn" id="qRedo">Rifai le domande</button><button class="btn btn--ghost btn--small" id="qSee">Vedi l'esito ↓</button></div>`;
      $("#qRedo").addEventListener("click", () => { state.quiz = { i: 0, answers: {}, done: false }; state.result = null; setPin(null); renderQuiz(); renderVerdict(); });
      $("#qSee").addEventListener("click", () => $("#s-esito").scrollIntoView({ behavior: "smooth" }));
      return;
    }
    const q = qs[Q.i], ans = Q.answers[q.id];
    let body = "";
    if (q.type === "pain") {
      const v = ans ? ans.v : 3;
      body = `<div class="pain"><div class="pain__val"><span id="painVal">${v}</span><small id="painTxt">${painTxt(v)}</small></div>
        <input type="range" id="painRange" min="0" max="10" value="${v}"><div class="pain__scale"><span>0 · nessun dolore</span><span>5</span><span>10 · insopportabile</span></div></div>`;
    } else {
      body = `<div class="opts">${q.a.map((o, i) => {
        const sel = ans && (q.multi ? ans.sel.includes(i) : ans.sel === i);
        return `<button class="opt${sel ? " sel" : ""}" data-i="${i}" style="animation-delay:${i * 50}ms">${q.multi ? '<span class="box"></span>' : ""}<span>${esc(o[0])}</span>${o[2] && o[2].pin ? '<span class="pinic">● sul corpo</span>' : ""}</button>`;
      }).join("")}</div>`;
    }
    const isLast = Q.i === qs.length - 1;
    const needNext = q.type === "pain" || q.multi || (ans && ans.note);
    box.innerHTML = `<div class="quiz__bar"><i style="width:${(Q.i / qs.length) * 100}%"></i></div>
      <div class="quiz__count">Domanda ${Q.i + 1} di ${qs.length}</div>
      <p class="quiz__q">${esc(q.q)}</p>${body}
      <div id="qNote">${ans && ans.note ? `<div class="answer-note">${esc(ans.note)}</div>` : ""}</div>
      <div class="quiz__nav">
        <span>${Q.i > 0 ? '<button class="link-btn" id="qBack">← Indietro</button>' : '<button class="link-btn" id="qSkip">Salta le domande</button>'}</span>
        ${needNext ? `<button class="btn btn--primary btn--small" id="qNext">${isLast ? "Vedi l'esito" : "Avanti →"}</button>` : ""}
      </div>`;
    if (q.type === "pain") {
      const r = $("#painRange");
      const upd = () => { $("#painVal").textContent = r.value; $("#painTxt").textContent = painTxt(+r.value); Q.answers.pain = { v: +r.value }; };
      r.addEventListener("input", upd); upd();
    } else {
      $$("#quiz .opt").forEach((b) => b.addEventListener("click", () => choose(q, +b.dataset.i)));
    }
    const nx = $("#qNext"); if (nx) nx.addEventListener("click", next);
    const bk = $("#qBack"); if (bk) bk.addEventListener("click", () => { Q.i--; renderQuiz(); });
    const sk = $("#qSkip"); if (sk) sk.addEventListener("click", () => { Q.done = true; finish(); });
  }
  function painTxt(v) { return v === 0 ? "nessun dolore" : v <= 3 ? "lieve" : v <= 5 ? "moderato" : v <= 7 ? "forte" : "molto forte"; }
  function choose(q, i) {
    const Q = state.quiz, o = q.a[i], ex = o[2] || {};
    if (q.multi) {
      const cur = Q.answers[q.id] ? Q.answers[q.id].sel.slice() : [];
      let sel;
      if (ex.none) sel = [i];
      else { const noneIdx = q.a.findIndex((x) => x[2] && x[2].none); sel = cur.filter((x) => x !== noneIdx); sel = sel.includes(i) ? sel.filter((x) => x !== i) : sel.concat(i); }
      Q.answers[q.id] = { sel };
      renderQuiz(); return;
    }
    Q.answers[q.id] = { sel: i, note: ex.note || "", v: ex.v };
    if (ex.pin) setPin(ex.pin);
    if (ex.note) { renderQuiz(); return; }
    renderQuiz();
    setTimeout(next, 380);
  }
  function next() {
    const Q = state.quiz, qs = questions(BY[state.focus.id]);
    if (Q.i < qs.length - 1) { Q.i++; renderQuiz(); }
    else { Q.done = true; finish(); }
  }
  function finish() {
    state.result = evaluate();
    renderQuiz(); renderVerdict();
    setTimeout(() => $("#s-esito").scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  function evaluate() {
    const p = BY[state.focus.id], qs = questions(p), A = state.quiz.answers;
    const score = {}; Object.keys(p.ipotesi).forEach((k) => (score[k] = 0));
    let level = 0; const notes = [];
    const flagLv = { giallo: 2, rosso: 3, urgente: 4 };
    qs.forEach((q) => {
      const a = A[q.id]; if (!a || q.type === "pain") return;
      const sels = q.multi ? a.sel : [a.sel];
      sels.forEach((i) => {
        const o = q.a[i]; if (!o) return;
        Object.entries(o[1] || {}).forEach(([k, v]) => { if (k in score) score[k] += v; });
        const ex = o[2] || {};
        if (ex.flag) level = Math.max(level, flagLv[ex.flag]);
        if (ex.note && !notes.some((n) => n.t === ex.note)) notes.push({ t: ex.note, w: !!ex.flag });
      });
    });
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
    const best = ranked[0] && ranked[0][1] > 0 ? ranked[0][0] : null;
    const second = ranked[1] && ranked[1][1] > 0 && ranked[1][1] >= ranked[0][1] * .6 ? ranked[1][0] : null;
    const hyp = best ? p.ipotesi[best] : null;
    level = Math.max(level, hyp ? hyp[1] : 1);
    const pain = A.pain ? A.pain.v : null;
    if (pain != null && pain >= 8) { level = Math.max(level, 2); notes.push({ t: "Il dolore è molto forte: riduci l'attività e, se non cala in pochi giorni, fatti vedere.", w: true }); }
    const dur = A.durata && A.durata.v;
    if (dur === "cronico" || dur === "ricorrente") { level = Math.max(level, 2); notes.push({ t: "Il disturbo dura da tempo: una valutazione da un fisioterapista ti aiuta a impostare un percorso mirato.", w: false }); }
    const allQ = GEN.find((q) => q.id === "allarme");
    if (A.allarme && A.allarme.sel.some((i) => allQ.a[i][2].flag)) { level = Math.max(level, 3); notes.push({ t: "Hai segnalato almeno un segnale d'allarme: va sempre valutato da un medico.", w: true }); }
    // età e sesso
    if (p.eta && p.eta.over && state.age >= p.eta.over[0]) notes.push({ t: p.eta.over[1], w: false, i: true });
    if (p.eta && p.eta.under && state.age <= p.eta.under[0]) notes.push({ t: p.eta.under[1], w: false, i: true });
    if (p.sesso && p.sesso[state.sex]) notes.push({ t: p.sesso[state.sex], w: false, i: true });
    if (state.age >= 65) notes.push({ t: "Dopo i 65 anni procedi in modo graduale: meglio poco ogni giorno che tanto ogni tanto.", w: false, i: true });
    if (state.age < 16) notes.push({ t: "Sei in crescita: fai gli esercizi con un adulto e parlane con il medico se il dolore dura.", w: false, i: true });
    return { level, best, hyp, second: second ? p.ipotesi[second] : null, notes, pain, dur, adv: advice(p) };
  }

  function renderVerdict() {
    const box = $("#verdict"), lock = $("#exLock");
    const R = state.result;
    if (!R) {
      box.innerHTML = `<div class="info-card"><p>Rispondi alle domande qui sopra per vedere un esito personalizzato. Intanto ecco i rimedi più utili per questa zona.</p></div>`;
      lock.innerHTML = ""; return;
    }
    const L = LEVEL[R.level];
    const title = R.hyp ? R.hyp[0] : "Quadro non ancora chiaro";
    const desc = R.hyp ? R.hyp[2] : "Dalle risposte non emerge un'ipotesi precisa: segui i consigli generali e, se il fastidio continua, fatti valutare.";
    box.innerHTML = `<div class="verdict l${R.level}">
      <span class="light"><i></i>${L.t}</span>
      <h4>${esc(title)}</h4><p>${esc(desc)}</p>
      ${R.second ? `<p class="alt">Da considerare anche: <b>${esc(R.second[0])}</b></p>` : ""}
      <ol class="todo">${L.todo.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      ${R.notes.length ? `<ul class="notes">${R.notes.map((n) => `<li class="${n.i ? "info" : ""}">${esc(n.t)}</li>`).join("")}</ul>` : ""}
    </div>
    ${R.adv && R.adv.length ? `<h4 style="margin:18px 0 10px">Consigli per il tuo caso</h4><div class="adv">${R.adv.map((a) => `<div class="adv-card" data-g="${esc(a.g)}"><span class="adv-g">${esc(a.g)}</span><b>${esc(a.t)}</b><p>${esc(a.d)}</p></div>`).join("")}</div>` : ""}`;
    lock.innerHTML = R.level >= 3 ? `<div class="locked"><p><b>Prima di fare esercizi su questa zona, fatti vedere da un medico.</b> Gli esercizi qui sotto sono indicativi per dopo la visita.</p></div>` : "";
  }

  /* ---- riepilogo e condivisione ---- */
  function summary() {
    const p = BY[state.focus.id], R = state.result;
    const sl = sideLabel(p, state.focus.side);
    const exs = p.esercizi.map((id) => EXERCISES[id]).filter(Boolean).map((e) => e.name);
    const dur = { acuto: "da pochi giorni", sub: "da 1–6 settimane", cronico: "da più di 3 mesi", ricorrente: "va e viene" };
    const latoTxt = state.focus.both ? "entrambi i lati" : sl ? sl.toLowerCase() : "";
    const lines = [
      `Ciao ${COACH.nome}! Ho fatto il consulto sull'Atlante del corpo.`,
      `• Zona: ${p.name}${latoTxt ? " (" + latoTxt + ")" : ""}`,
      `• Profilo: ${state.sex === "f" ? "donna" : "uomo"}, ${state.age} anni, ${state.height} cm`,
    ];
    if (state.focus.mark) lines.push(`• Punto preciso: ${state.focus.mark.txt.toLowerCase()}`);
    if (state.focus.mark3d) lines.push(`• Segnato nel 3D: ${state.focus.mark3d.name}${state.focus.mark3d.where ? ", " + state.focus.mark3d.where : ""}`);
    if (R) {
      if (R.pain != null) lines.push(`• Dolore: ${R.pain}/10${R.dur ? ", " + dur[R.dur] : ""}`);
      const A = state.quiz.answers, v = (id) => A[id] && A[id].v;
      const qq = { sforzo: "sotto sforzo", statico: "in posizione ferma", entrambi: "sotto sforzo e in posizione ferma", riposo: "sempre, anche a riposo" }[v("quando")];
      if (qq) lines.push(`• Quando: ${qq}`);
      const sf = multiVals("sforzo").map((k) => ADV_SFORZO[k][0].toLowerCase());
      if (sf.length) lines.push(`• Sforzi che lo provocano: ${sf.join(", ")}${v("fase") ? " (" + { inizio: "all'inizio, poi passa", durante: "cresce durante", dopo: "dopo, la sera o il giorno seguente", fitta: "fitta improvvisa" }[v("fase")] + ")" : ""}`);
      const st = multiVals("statico").map((k) => ADV_STATICO[k][0].toLowerCase());
      if (st.length) lines.push(`• Posizioni che fanno male: ${st.join(", ")}`);
      if (v("dominante")) lines.push(`• Lato: ${{ dom: "quello che usa di più", nondom: "quello che usa meno", nd: "uso simile dei due lati" }[v("dominante")]}`);
      lines.push(`• Esito: ${R.hyp ? R.hyp[0] : "non chiaro"} — ${LEVEL[R.level].t}`);
    }
    lines.push(`• Esercizi suggeriti: ${exs.join(", ")}`);
    lines.push(location.href.split("#")[0] + `#punto=${p.id}${state.focus.side !== "c" ? "&lato=" + state.focus.side : ""}`);
    return lines.join("\n");
  }
  function share() {
    const txt = encodeURIComponent(summary());
    const url = COACH.whatsapp ? `https://wa.me/${COACH.whatsapp}?text=${txt}` : `https://wa.me/?text=${txt}`;
    window.open(url, "_blank", "noopener");
  }
  function copySummary() {
    const t = summary();
    const done = () => { const b = $("#copyBtn"); b.textContent = "Copiato ✓"; setTimeout(() => (b.textContent = "Copia riepilogo"), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, () => prompt("Copia il testo:", t));
    else prompt("Copia il testo:", t);
  }

  /* =================== 5. ESERCIZI =================== */
  let player = null, exList = [], exIdx = 0, lastFocus = null;
  function openExercise(list, i) {
    exList = list; exIdx = i; lastFocus = document.activeElement;
    $("#exModal").hidden = false;
    loadExercise();
    $("#exClose").focus();
  }
  function loadExercise() {
    const ex = exList[exIdx];
    if (player) player.destroy();
    player = Mannequin.create($("#exAnim"), ex, state.sex, ({ label, phase, reps, n }) => {
      $("#exPhase").innerHTML = `<em>Fase ${phase + 1}/${n}</em>${esc(label)}`;
      $("#exReps").textContent = `Ripetizione ${reps + 1}`;
    });
    $("#exPlay").textContent = player.isPlaying() ? "❚❚" : "▶";
    $$(".speed button").forEach((b) => b.classList.toggle("on", b.dataset.speed === "1"));
    $("#exPrev").disabled = exList.length < 2; $("#exNext").disabled = exList.length < 2;
    $("#exInfo").innerHTML = `
      <span class="tag"><i></i>Esercizio ${exIdx + 1} di ${exList.length}</span>
      <h3 id="exTitle">${esc(ex.name)}</h3>
      <div class="ex-meta"><span class="dose">${esc(ex.dose)}</span><span>${esc(ex.level)}</span><span>${esc(ex.target)}</span></div>
      <ol class="ex-steps">${ex.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="ex-box ok"><h5>Consigli</h5><ul>${ex.tips.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div class="ex-box no"><h5>Da evitare</h5><ul>${ex.avoid.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <p style="font-size:13px;color:var(--muted);margin:14px 0 6px">Durante l'esercizio ascolta il dolore:</p>
      <div class="pain-rule"><span style="background:#46d996">0–3 · ok</span><span style="background:#ffc94d">4–5 · riduci</span><span style="background:#ff5a5a">6+ · fermati</span></div>`;
  }
  function closeExercise() {
    if (player) { player.destroy(); player = null; }
    $("#exModal").hidden = true;
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $("#exClose").addEventListener("click", closeExercise);
  $("#exModal").addEventListener("click", (e) => { if (e.target.id === "exModal") closeExercise(); });
  $("#exPlay").addEventListener("click", () => { const on = player.toggle(); $("#exPlay").textContent = on ? "❚❚" : "▶"; $("#exPlay").setAttribute("aria-label", on ? "Pausa" : "Riproduci"); });
  $("#exPrev").addEventListener("click", () => { exIdx = (exIdx - 1 + exList.length) % exList.length; loadExercise(); });
  $("#exNext").addEventListener("click", () => { exIdx = (exIdx + 1) % exList.length; loadExercise(); });
  $$(".speed button").forEach((b) => b.addEventListener("click", () => { player.setSpeed(+b.dataset.speed); $$(".speed button").forEach((x) => x.classList.toggle("on", x === b)); }));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#sportModal").hidden) closeSport();
    else if (!$("#exModal").hidden) closeExercise();
    else if (!$("#finder").hidden) $("#finder").hidden = true;
    else if (state.focus) closeFocus();
  });
  window.addEventListener("resize", () => { if (state.focus && svg) setVB(focusBox(BY[state.focus.id], state.focus.side)); });

  /* =================== 6. SPORT: MUSCOLI IN AZIONE =================== */
  const SP = Sport.SPORTS.corsa;
  let bgRunners = [], sportView = null, sportLast = null, sportPhase = 0, sportMus = null;
  let sportCam = "gamba", sportMode = "step";

  // corridori che attraversano il fondo della schermata iniziale, comparendo e scomparendo
  function startSportBg() {
    const bg = $("#sportBg");
    if (!bg || bgRunners.length) return;
    const lanes = [
      { s: 1, dur: 14, delay: -2, op: .5, sp: 1, sex: "m" },
      { s: .7, dur: 19, delay: -9, op: .28, sp: .92, sex: "f" },
      { s: .85, dur: 16.5, delay: -14, op: .38, sp: 1.06, sex: "m" },
    ];
    bg.innerHTML = lanes.map((l) => `<button class="sport-lane" type="button" style="--s:${l.s};--dur:${l.dur}s;--delay:${l.delay}s;--op:${l.op}" aria-label="Guarda i muscoli nella corsa"><span class="sport-fig"></span></button>`).join("");
    $$(".sport-fig", bg).forEach((el, i) => bgRunners.push(Sport.runner(el, lanes[i].sex, { offset: i * 260, speed: lanes[i].sp })));
    $$(".sport-lane", bg).forEach((b) => b.addEventListener("click", openSport));
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) bgRunners.forEach((r) => r.pause());
  }
  function stopSportBg() { bgRunners.forEach((r) => r.destroy()); bgRunners = []; $("#sportBg").innerHTML = ""; }

  function openSport() {
    sportLast = document.activeElement;
    $("#sportModal").hidden = false;
    bgRunners.forEach((r) => r.pause());
    $("#sportLegend").innerHTML = Object.values(Sport.STATI).map((s) => `<span><i style="background:${s.color}"></i>${s.t}</span>`).join("");
    $("#sportPhases").innerHTML = SP.phases.map((p, i) => `<button data-ph="${i}" title="${esc(p.name)}" aria-label="Fase ${i + 1}: ${esc(p.name)}">${i + 1}</button>`).join("");
    $$("#sportPhases button").forEach((b) => b.addEventListener("click", () => { sportView.goPhase(+b.dataset.ph); syncSportPlay(); }));
    sportMus = null;
    sportView = Sport.viewer($("#sportAnim"), state.sex || "m", { camera: sportCam, mode: sportMode, onPhase: (i) => { sportPhase = i; renderSportInfo(); } });
    $$(".sport-cam button").forEach((b) => b.classList.toggle("on", b.dataset.cam === sportCam));
    $$("[data-smode]").forEach((b) => b.classList.toggle("on", b.dataset.smode === sportMode));
    syncSportPlay();
    $("#sportClose").focus();
  }
  function closeSport() {
    if (sportView) { sportView.destroy(); sportView = null; }
    $("#sportModal").hidden = true;
    bgRunners.forEach((r) => r.play());
    sportLast && sportLast.focus && sportLast.focus();
  }
  function syncSportPlay() {
    const on = sportView && sportView.isPlaying();
    $("#sportPlay").textContent = on ? "❚❚" : "▶";
    $("#sportPlay").setAttribute("aria-label", on ? "Pausa" : "Riproduci");
  }
  function renderSportInfo() {
    const ph = SP.phases[sportPhase];
    $$("#sportPhases button").forEach((b) => b.classList.toggle("on", +b.dataset.ph === sportPhase));
    const order = { c: 0, e: 1, s: 2 };
    const mus = Object.entries(ph.mus).sort((a, b) => order[a[1]] - order[b[1]]);
    const sel = sportMus && Sport.MUSCOLI[sportMus];
    const selState = sportMus && ph.mus[sportMus];
    $("#sportInfo").innerHTML = `
      <span class="tag"><i></i>Muscoli in azione · ${esc(SP.name)} · fase ${sportPhase + 1} di ${SP.phases.length}</span>
      <h3 id="sportTitle">${esc(ph.name)}</h3>
      <p class="sport-desc">${esc(ph.desc)}</p>
      <div class="mus-list">${mus.map(([m, s]) => { const M = Sport.MUSCOLI[m], S = Sport.STATI[s];
        return `<button class="mus-card${sportMus === m ? " on" : ""}" data-m="${m}" style="--mc:${S.color}"><span class="mus-state"><i></i>${esc(S.t)}</span><b>${esc(M.name)}</b><small>${esc(S.d)}</small></button>`; }).join("")}</div>
      ${sel ? `<div class="mus-detail" style="--mc:${selState ? Sport.STATI[selState].color : "var(--line-2)"}">
        <h4>${esc(sel.name)}</h4>
        <p><b>Nella corsa:</b> ${esc(sel.role)}</p>
        <p><b>Cosa rischia:</b> ${esc(sel.risk)}</p>
        <button class="btn btn--small btn--primary" id="sportToPoint" type="button">Apri nell'atlante →</button>
      </div>` : `<p class="sport-hint">Tocca un muscolo per sapere cosa fa nella corsa e cosa rischia.</p>`}
      <p class="sport-intro">${esc(SP.intro)}</p>`;
    $$("#sportInfo .mus-card").forEach((b) => b.addEventListener("click", () => {
      sportMus = sportMus === b.dataset.m ? null : b.dataset.m;
      if (sportMus && sportView.isPlaying()) { sportView.toggle(); syncSportPlay(); } // ferma per leggere
      renderSportInfo();
    }));
    const go = $("#sportToPoint");
    if (go) go.addEventListener("click", () => {
      const id = Sport.MUSCOLI[sportMus].point;
      closeSport();
      if (appEl.hidden) { if (!state.sex) state.sex = "m"; startApp(); setTimeout(() => focusPoint(id, "r"), 300); }
      else focusPoint(id, "r");
    });
  }
  $("#sportCta").addEventListener("click", openSport);
  $("#sportBtn").addEventListener("click", openSport);
  $("#sportClose").addEventListener("click", closeSport);
  $("#sportModal").addEventListener("click", (e) => { if (e.target.id === "sportModal") closeSport(); });
  $("#sportPlay").addEventListener("click", () => { sportView.toggle(); syncSportPlay(); });
  $$(".sport-cam button").forEach((b) => b.addEventListener("click", () => {
    sportCam = b.dataset.cam; sportView.setCamera(sportCam);
    $$(".sport-cam button").forEach((x) => x.classList.toggle("on", x === b));
  }));
  $$("[data-smode]").forEach((b) => b.addEventListener("click", () => {
    sportMode = b.dataset.smode; sportView.setMode(sportMode); syncSportPlay();
    $$("[data-smode]").forEach((x) => x.classList.toggle("on", x === b));
  }));

  /* =================== 7. CORPO IN 3D =================== */
  let mode3d = false, v3d = null, hero3d = null;
  const with3D = (fn) => { if (window.Viewer3D) fn(); else window.addEventListener("viewer3d-ready", fn, { once: true }); };
  const fail3D = (box) => { box.innerHTML = `<p class="v3d-loading">Il 3D non è disponibile su questo dispositivo o senza connessione. Usa le viste Fronte e Retro.</p>`; };

  function startHero3D() {
    if (hero3d || setupEl.hidden) return;
    with3D(() => {
      if (hero3d || setupEl.hidden) return;
      const box = $("#hero3dStage");
      hero3d = Viewer3D.create(box, { mode: "hero", onReady: () => box.classList.add("ready"), onError: () => fail3D(box) });
    });
  }
  function stopHero3D() { if (hero3d) { hero3d.destroy(); hero3d = null; } }

  // first = arrivo dalla schermata iniziale: la pelle si vede piena e poi diventa trasparente
  function enter3D(first) {
    if (mode3d) return;
    mode3d = true;
    if (state.focus) closeFocus(true);
    $("#finder").hidden = true;
    $("#stage").classList.add("is3d");
    $("#v3dHolder").hidden = false; $("#v3dCredit").hidden = false; $("#v3dCard").hidden = true;
    syncViewBtns(); hideHint();
    with3D(() => {
      if (!mode3d || v3d) return;
      const box = $("#v3dHolder");
      v3d = Viewer3D.create(box, {
        layer: state.layer, start: first ? "pelle" : "strati",
        onReady: () => {
          box.classList.add("ready"); sync3DLayer();
          // all'ingresso si vede la pelle, poi si apre sullo strato scelto
          setTimeout(() => v3d && v3d.reveal(true), first ? 1600 : 0);
        },
        onMuscles: () => sync3DLayer(),
        onError: () => fail3D(box),
        onPick: show3DCard,
      });
      if (first) v3d.reveal(false);
    });
    sync3DLayer();
  }
  function leave3D() {
    if (!mode3d) return;
    mode3d = false;
    if (v3d) { v3d.destroy(); v3d = null; }
    $("#v3dHolder").classList.remove("ready"); $("#v3dHolder").innerHTML = `<p class="v3d-loading">Carico il corpo in 3D…</p>`;
    $("#v3dHolder").hidden = true; $("#v3dNote").hidden = true; $("#v3dCard").hidden = true; $("#v3dCredit").hidden = true;
    $("#stage").classList.remove("is3d");
    syncViewBtns();
  }
  function sync3DLayer() {
    if (v3d) v3d.setLayer(state.layer);
    const note = $("#v3dNote");
    const msg = state.layer === "muscoli" && v3d && !v3d.hasMuscles() ? "Carico i muscoli in 3D…"
      : { nervi: "Nervi principali disegnati sullo scheletro reale: tocca un nervo per il suo nome e il consulto.", tendini: "Tendini e legamenti principali: tocca una struttura per il suo nome e il consulto.", linfatico: "Linfonodi e vasi linfatici principali: tocca un gruppo per il suo nome e il consulto." }[state.layer] || "";
    note.hidden = !msg; note.textContent = msg;
    if (msg && state.layer !== "muscoli") { clearTimeout(note._t); note._t = setTimeout(() => (note.hidden = true), 6000); }
  }
  function show3DCard(info) {
    const card = $("#v3dCard");
    if (!info) { card.hidden = true; return; }
    const p = info.point && BY[info.point];
    const lato = info.side === "l" ? "lato sinistro" : info.side === "r" ? "lato destro" : "";
    // lato della persona -> lato dello schermo nella vista 2D del punto
    const screen = p && !p.central ? (info.side === "l" ? (p.view === "f" ? "r" : "l") : (p.view === "f" ? "l" : "r")) : "r";
    card.innerHTML = `<button class="icon-btn v3d-card__x" aria-label="Chiudi">×</button>
      <span class="tag"><i></i>${({ muscoli: "Muscoli", nervi: "Nervi", tendini: "Tendini e legamenti", linfatico: "Sistema linfatico" })[info.kind] || "Ossa e articolazioni"}${lato ? " · " + lato : ""}</span>
      <h4>${esc(info.it)}</h4><small>${info.where ? "📍 Punto segnato: " + esc(info.where) : esc(info.en)}</small>
      ${p ? `<p>Legato a: <b>${esc(p.name)}</b> · ${esc(p.sub)}</p><button class="btn btn--small btn--primary" type="button" data-go>Apri il consulto →</button>` : `<p>Per questa struttura non c'è ancora un consulto guidato.</p>`}`;
    card.hidden = false;
    $(".v3d-card__x", card).addEventListener("click", () => { card.hidden = true; v3d && v3d.clear(); });
    const go = $("[data-go]", card);
    if (go) go.addEventListener("click", () => { pendingMark3d = { name: info.it, where: info.where || "" }; focusPoint(p.id, screen); });
  }

  // apertura diretta da link condiviso (es. #punto=achille&lato=r) se il profilo è già salvato
  if (saved && location.hash.includes("punto=")) startApp();
  if (!setupEl.hidden) { startSportBg(); startHero3D(); }
})();
