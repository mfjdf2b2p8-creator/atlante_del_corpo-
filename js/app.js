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
  $("#startBtn").addEventListener("click", startApp);
  $("#age").value = state.age; $("#height").value = state.height;
  if (state.sex) chooseSex(state.sex);

  function startApp() {
    store.set("profilo", { sex: state.sex, age: state.age, height: state.height });
    setupEl.hidden = true; appEl.hidden = false;
    renderProfile(); buildLayerNav(); renderBody();
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get("punto") && BY[h.get("punto")]) setTimeout(() => focusPoint(h.get("punto"), h.get("lato") || "r"), 250);
  }
  function showSetup() {
    closeFocus(true);
    appEl.hidden = true; setupEl.hidden = false;
    if (state.sex) chooseSex(state.sex);
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
    $("#layers").innerHTML = Object.entries(LAY).map(([k, l]) => `<button class="layer-btn${k === state.layer ? " on" : ""}" data-layer="${k}" style="--c:${l.color}"><i></i><span>${l.label}</span></button>`).join("");
    $$("#layers .layer-btn").forEach((b) => b.addEventListener("click", () => setLayer(b.dataset.layer)));
  }
  function setLayer(layer, keepFocus) {
    if (!keepFocus && state.focus) closeFocus();
    state.layer = layer;
    $$("#layers .layer-btn").forEach((b) => b.classList.toggle("on", b.dataset.layer === layer));
    if (svg) svg.setAttribute("data-layer", layer);
    const on = $("#layers .layer-btn.on"); if (on && on.scrollIntoView) on.scrollIntoView({ inline: "nearest", block: "nearest" });
    renderHots(); renderLegend();
  }
  function renderBody() {
    $("#bodyHolder").innerHTML = Anatomy.build(state.sex, state.view);
    svg = $("#bodyHolder svg");
    svg.setAttribute("data-layer", state.layer);
    setVB(state.vb);
    renderHots(); renderLegend(); highlight();
    $$(".seg-toggle button").forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
  }
  function setVB(vb) { state.vb = vb; if (svg) svg.setAttribute("viewBox", vb.map((n) => n.toFixed(2)).join(" ")); }

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
  $$(".seg-toggle button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

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
    }).join("")).join("") + `<g class="pins"></g>`;
    highlight();
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
    tip.classList.remove("on");
    const hot = e.target.closest(".hot");
    if (hot) { focusPoint(hot.dataset.id, hot.dataset.side); return; }
    if (state.focus) return;
    const st = e.target.closest(".st");
    const c = svgPoint(e);
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

  /* ---- zoom animato ---- */
  let zoomRaf = 0;
  function zoomTo(targetFn, dur = 1000) {
    cancelAnimationFrame(zoomRaf);
    const from = state.vb.slice(), t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), k = ease(t);
      const to = targetFn();
      setVB(from.map((v, i) => v + (to[i] - v) * k));
      if (t < 1) zoomRaf = requestAnimationFrame(step);
    };
    zoomRaf = requestAnimationFrame(step);
  }
  function focusBox(p, side) {
    const [cx, cy] = posOf(p, side === "c" ? "r" : side, p.central ? [p.at[0], p.at[1]] : null);
    const rect = svg.getBoundingClientRect();
    const ar = rect.width / Math.max(1, rect.height);
    let h = p.zoom * 1.3, w = h * ar;
    if (w < p.zoom * .8) { w = p.zoom * .8; h = w / ar; }
    const x = p.central ? 200 : cx;
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
    const p = BY[state.focus.id], side = state.focus.side;
    const g = svg.querySelector(".L-" + p.layer);
    const match = (el) => side === "c" || el.dataset.side === "c" || el.dataset.side === side;
    p.parts.forEach((s) => $$(`[data-s="${s}"]`, g).forEach((el) => match(el) && el.classList.add("sel")));
    (p.peel || []).forEach((s) => $$(`.L-muscoli [data-s="${s}"]`, svg).forEach((el) => match(el) && el.classList.add("peel")));
    const k = (p.zoom / 520).toFixed(2);
    $$(".hot", svg).forEach((h) => {
      const on = h.dataset.id === p.id && (side === "c" || h.dataset.side === side);
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
    side = p.central ? "c" : side || "r";
    $("#finder").hidden = true; $("#findBtn").setAttribute("aria-expanded", "false");
    const go = () => {
      state.focus = { id, side };
      state.quiz = { i: 0, answers: {}, done: false };
      state.result = null;
      appEl.classList.add("focus");
      $("#panel").hidden = false; $("#backBtn").hidden = false;
      renderPanel();
      highlight(); setPin(null);
      zoomTo(() => focusBox(p, side), 1100);
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
    highlight(); setPin(null);
    if (!silent) zoomTo(() => BASE_VB, 900); else setVB(BASE_VB.slice());
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* niente */ }
  }
  $("#backBtn").addEventListener("click", () => closeFocus());

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

  function questions(p) { return p.domande.map((d, i) => Object.assign({ id: "q" + i }, d)).concat(GEN); }

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
            <div class="p-sub">${esc(p.sub)}${sl ? `<span class="side-pill">${sl}</span>` : ""}</div>
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
    renderQuiz(); renderVerdict();
  }

  /* ---- questionario ---- */
  function renderQuiz() {
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
    if (A.allarme && A.allarme.sel.some((i) => GEN[3].a[i][2].flag)) { level = Math.max(level, 3); notes.push({ t: "Hai segnalato almeno un segnale d'allarme: va sempre valutato da un medico.", w: true }); }
    // età e sesso
    if (p.eta && p.eta.over && state.age >= p.eta.over[0]) notes.push({ t: p.eta.over[1], w: false, i: true });
    if (p.eta && p.eta.under && state.age <= p.eta.under[0]) notes.push({ t: p.eta.under[1], w: false, i: true });
    if (p.sesso && p.sesso[state.sex]) notes.push({ t: p.sesso[state.sex], w: false, i: true });
    if (state.age >= 65) notes.push({ t: "Dopo i 65 anni procedi in modo graduale: meglio poco ogni giorno che tanto ogni tanto.", w: false, i: true });
    if (state.age < 16) notes.push({ t: "Sei in crescita: fai gli esercizi con un adulto e parlane con il medico se il dolore dura.", w: false, i: true });
    return { level, best, hyp, second: second ? p.ipotesi[second] : null, notes, pain, dur };
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
    </div>`;
    lock.innerHTML = R.level >= 3 ? `<div class="locked"><p><b>Prima di fare esercizi su questa zona, fatti vedere da un medico.</b> Gli esercizi qui sotto sono indicativi per dopo la visita.</p></div>` : "";
  }

  /* ---- riepilogo e condivisione ---- */
  function summary() {
    const p = BY[state.focus.id], R = state.result;
    const sl = sideLabel(p, state.focus.side);
    const exs = p.esercizi.map((id) => EXERCISES[id]).filter(Boolean).map((e) => e.name);
    const dur = { acuto: "da pochi giorni", sub: "da 1–6 settimane", cronico: "da più di 3 mesi", ricorrente: "va e viene" };
    const lines = [
      `Ciao ${COACH.nome}! Ho fatto il consulto sull'Atlante del corpo.`,
      `• Zona: ${p.name}${sl ? " (" + sl.toLowerCase() + ")" : ""}`,
      `• Profilo: ${state.sex === "f" ? "donna" : "uomo"}, ${state.age} anni, ${state.height} cm`,
    ];
    if (R) {
      if (R.pain != null) lines.push(`• Dolore: ${R.pain}/10${R.dur ? ", " + dur[R.dur] : ""}`);
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
    if (!$("#exModal").hidden) closeExercise();
    else if (!$("#finder").hidden) $("#finder").hidden = true;
    else if (state.focus) closeFocus();
  });
  window.addEventListener("resize", () => { if (state.focus && svg) setVB(focusBox(BY[state.focus.id], state.focus.side)); });

  // apertura diretta da link condiviso (es. #punto=achille&lato=r) se il profilo è già salvato
  if (saved && location.hash.includes("punto=")) startApp();
})();
