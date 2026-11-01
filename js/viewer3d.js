/* =========================================================
   Corpo in 3D (three.js) con il modello BodyParts3D.
   «BodyParts3D, © The Database Center for Life Science licensed
   under CC Attribution 4.0 International» — modello semplificato
   e convertito per il web.
   Coordinate: metri, Y in alto, la persona guarda verso +Z.
   Il modello è maschile; «Left» = lato sinistro della persona (+X).
   ========================================================= */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const FILES = { pelle: "assets/3d/pelle.glb?v=1", ossa: "assets/3d/ossa.glb?v=1", muscoli: "assets/3d/muscoli.glb?v=1", mappa: "assets/3d/muscoli.json?v=1" };
let MAP = null; // id del muscolo -> nome italiano, lato, punto dell'atlante
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = {};
const load = (k) => (cache[k] ||= new Promise((res, rej) => loader.load(FILES[k], (g) => res(g.scene), undefined, rej)));

/* ---------- nomi in italiano ---------- */
const ORD = { first: "prima", second: "seconda", third: "terza", fourth: "quarta", fifth: "quinta", sixth: "sesta", seventh: "settima", eighth: "ottava", ninth: "nona", tenth: "decima", eleventh: "undicesima", twelfth: "dodicesima" };
const ORDM = { first: "primo", second: "secondo", third: "terzo", fourth: "quarto", fifth: "quinto", sixth: "sesto", seventh: "settimo", eighth: "ottavo", ninth: "nono", tenth: "decimo", eleventh: "undicesimo", twelfth: "dodicesimo" };
const DITA = { thumb: "del pollice", "index finger": "dell'indice", "middle finger": "del medio", "ring finger": "dell'anulare", "little finger": "del mignolo", "big toe": "dell'alluce", "second toe": "del secondo dito", "third toe": "del terzo dito", "fourth toe": "del quarto dito", "little toe": "del mignolo del piede" };
const OSSA = {
  femur: "Femore", tibia: "Tibia", fibula: "Perone (fibula)", patella: "Rotula", humerus: "Omero", radius: "Radio", ulna: "Ulna", scapula: "Scapola", clavicle: "Clavicola",
  "hip bone": "Osso dell'anca (bacino)", sacrum: "Sacro", coccyx: "Coccige", calcaneus: "Calcagno", talus: "Astragalo", "cuboid bone": "Cuboide", "navicular bone": "Navicolare",
  "medial cuneiform bone": "Cuneiforme mediale", "intermediate cuneiform bone": "Cuneiforme intermedio", "lateral cuneiform bone": "Cuneiforme laterale",
  scaphoid: "Scafoide", lunate: "Semilunare", triquetral: "Piramidale", pisiform: "Pisiforme", trapezium: "Trapezio", trapezoid: "Trapezoide", capitate: "Capitato", hamate: "Uncinato",
  mandible: "Mandibola", maxilla: "Mascella", "frontal bone": "Osso frontale", "parietal bone": "Osso parietale", "occipital bone": "Osso occipitale", "temporal bone": "Osso temporale",
  "zygomatic bone": "Osso zigomatico", "nasal bone": "Osso nasale", "sphenoid bone": "Sfenoide", ethmoid: "Etmoide", vomer: "Vomere", "palatine bone": "Osso palatino", "lacrimal bone": "Osso lacrimale",
  "hyoid bone": "Osso ioide", atlas: "Atlante (prima vertebra cervicale)", axis: "Epistrofeo (seconda vertebra cervicale)", manubrium: "Manubrio dello sterno", "body of sternum": "Corpo dello sterno", "xiphoid process": "Processo xifoideo",
  "inferior nasal concha": "Cornetto nasale inferiore",
};
export function italiano(en) {
  let s = en.trim(), lato = "";
  const m = s.match(/^(left|right)\s+/i);
  if (m) { lato = m[1].toLowerCase() === "left" ? "sinistro" : "destro"; s = s.slice(m[0].length); }
  const low = s.toLowerCase();
  let it = OSSA[low];
  let r;
  if (!it && (r = low.match(/^(\w+) (cervical|thoracic|lumbar) vertebra$/))) it = `${cap(ORD[r[1]] || r[1])} vertebra ${{ cervical: "cervicale", thoracic: "toracica", lumbar: "lombare" }[r[2]]}`;
  else if (!it && (r = low.match(/^intervertebral disk(?: of (\w+) (cervical|thoracic|lumbar) vertebra| of axis)?$/))) it = r[1] ? `Disco intervertebrale sotto la ${ORD[r[1]] || r[1]} ${{ cervical: "cervicale", thoracic: "toracica", lumbar: "lombare" }[r[2]]}` : "Disco intervertebrale";
  else if (!it && (r = low.match(/^(\w+) rib$/))) it = `${cap(ORD[r[1]] || r[1])} costa`;
  else if (!it && (r = low.match(/^(\w+) costal cartilage$/))) it = `Cartilagine della ${ORD[r[1]] || r[1]} costa`;
  else if (!it && (r = low.match(/^(\w+) (metacarpal|metatarsal) bone$/))) it = `${cap(ORDM[r[1]] || r[1])} ${r[2] === "metacarpal" ? "metacarpo" : "metatarso"}`;
  else if (!it && (r = low.match(/^(proximal|middle|distal) phalanx of (.+)$/))) it = `Falange ${{ proximal: "prossimale", middle: "intermedia", distal: "distale" }[r[1]]} ${DITA[r[2]] || r[2]}`;
  if (!it) it = cap(s);
  if (lato) {
    const fem = /^(Tibia|Rotula|Scapola|Clavicola|Ulna|Mandibola|Mascella|Falange|Cartilagine|\w+ costa|\w+ vertebra)/.test(it);
    it += " " + (fem ? lato.replace(/o$/, "a") : lato);
  }
  return it;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// osso -> punto dell'atlante con il consulto guidato
const LINKS = [
  [/cervical vertebra|^(left |right )?atlas$|^axis$|disk of (\w+ cervical|axis)/i, "cervicale"],
  [/thoracic vertebra|disk of \w+ thoracic/i, "toracica"],
  [/lumbar vertebra|disk of \w+ lumbar/i, "lombare"],
  [/sacrum|coccyx/i, "sacroiliaca"],
  [/hip bone|femur/i, "anca"],
  [/patella/i, "rotula"],
  [/tibia|fibula/i, "menisco"],
  [/humerus|scapula|clavicle/i, "spalla-rigida"],
  [/mandible|temporal bone/i, "atm"],
  [/costal cartilage|sternum|manubrium|xiphoid/i, "costocondrite"],
  [/big toe|first metatarsal/i, "alluce-valgo"],
  [/metatarsal/i, "frattura-stress"],
  [/calcaneus/i, "fascia-plantare"],
  [/talus|cuneiform|cuboid|navicular/i, "caviglia"],
  [/first metacarpal|trapezium|phalanx of thumb/i, "rizoartrosi"],
  [/metacarpal|phalanx of|scaphoid|lunate|capitate|hamate|triquetral|pisiform|trapezoid/i, "tunnel-carpale"],
];
export const linkFor = (en) => (LINKS.find(([re]) => re.test(en)) || [])[1] || null;

/* ---------- visore ---------- */
export function create(container, opts = {}) {
  const hero = opts.mode === "hero";
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
  renderer.domElement.className = "v3d-canvas";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, .05, 30);
  camera.position.set(0, .95, hero ? 3.5 : 4.4);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, .82, 0);
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.enablePan = !hero; controls.enableZoom = !hero;
  controls.minDistance = .5; controls.maxDistance = 7;
  controls.autoRotate = hero || !!opts.autoRotate; controls.autoRotateSpeed = hero ? 1.6 : .8;
  controls.screenSpacePanning = true;

  scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x1a0f0a, 1.15));
  const key = new THREE.DirectionalLight(0xfff1e0, 2.2); key.position.set(1.6, 2.6, 2.4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6cc6ff, 1.6); rim.position.set(-2, 1.4, -2.2); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffb38a, .5); fill.position.set(-1.5, .4, 1.8); scene.add(fill);
  // pavimento: un'ombra morbida
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.55, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .35 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.075; scene.add(shadow);

  // materiali
  const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xd9a088, roughness: .55, metalness: 0, sheen: .6, sheenColor: new THREE.Color(0xffd2c0), clearcoat: .15, transparent: true, opacity: 1 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x7fc4ff, roughness: .25, metalness: 0, transparent: true, opacity: .14, depthWrite: false, side: THREE.FrontSide });
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xefe3c8, roughness: .62, metalness: 0 });
  const cartMat = new THREE.MeshStandardMaterial({ color: 0x9fc3dc, roughness: .5 });
  const selMat = new THREE.MeshStandardMaterial({ color: 0xffb35c, emissive: 0xff6a2b, emissiveIntensity: .55, roughness: .45 });
  const hovMat = new THREE.MeshStandardMaterial({ color: 0xfff1cf, emissive: 0x6cc6ff, emissiveIntensity: .25, roughness: .5 });

  const muscleMat = new THREE.MeshPhysicalMaterial({ color: 0xb23a2e, roughness: .48, metalness: 0, sheen: .5, sheenColor: new THREE.Color(0xff9a80), clearcoat: .25, clearcoatRoughness: .5 });
  const muscleSel = new THREE.MeshStandardMaterial({ color: 0xffa04a, emissive: 0xff5a1f, emissiveIntensity: .5, roughness: .45 });
  const muscleHov = new THREE.MeshStandardMaterial({ color: 0xe0624e, emissive: 0x6cc6ff, emissiveIntensity: .18, roughness: .5 });

  const groups = {};
  let skin = null, reveal = hero || opts.start === "pelle" ? 0 : 1, revealTarget = reveal, layer = opts.layer || "ossa";
  const picks = { ossa: [], muscoli: [] };
  // prepara un gruppo di parti cliccabili (ossa o muscoli)
  function addGroup(key, src, info) {
    const g = src.clone(true);
    g.traverse((o) => {
      if (!o.isMesh) return;
      const node = o.userData && o.userData.name ? o : o.parent && o.parent.userData && o.parent.userData.name ? o.parent : o;
      const en = node.userData.name || o.name;
      const extra = info(en, node.name || o.name);
      Object.assign(o.userData, { en, side: node.userData.side, kind: key }, extra);
      o.material = o.userData.base;
      picks[key].push(o);
    });
    scene.add(g); groups[key] = g;
    applyLayer();
  }
  const ready = Promise.all([load("pelle"), hero ? null : load("ossa")]).then(([ps, os]) => {
    skin = ps.clone(true);
    skin.traverse((o) => { if (o.isMesh) { o.material = skinMat; o.renderOrder = 2; } });
    scene.add(skin); groups.pelle = skin;
    if (os) addGroup("ossa", os, (en) => ({ base: /cartilage|disk|meniscus/i.test(en) ? cartMat : boneMat, it: italiano(en), point: linkFor(en), sel: selMat, hov: hovMat }));
    applyLayer();
    opts.onReady && opts.onReady();
    if (!hero) loadMuscles(); // i muscoli arrivano dopo, senza bloccare
  }).catch((e) => { opts.onError && opts.onError(e); });

  let musclesLoading = null;
  function loadMuscles() {
    if (musclesLoading) return musclesLoading;
    musclesLoading = Promise.all([load("muscoli"), (MAP ||= fetch(FILES.mappa).then((r) => r.json()))]).then(([ms, map]) => {
      if (!alive) return;
      addGroup("muscoli", ms, (en, id) => {
        const m = map[id] || {};
        return { base: muscleMat, it: m.it || cap(en), point: m.point || null, sel: muscleSel, hov: muscleHov };
      });
      opts.onMuscles && opts.onMuscles();
    }).catch((e) => { musclesLoading = null; opts.onError && opts.onError(e); });
    return musclesLoading;
  }

  function applyLayer() {
    const shown = reveal > .02;
    // le ossa restano sotto i muscoli per riempire le zone senza muscoli
    if (groups.ossa) groups.ossa.visible = shown && (layer === "ossa" || layer === "muscoli");
    if (groups.muscoli) groups.muscoli.visible = shown && layer === "muscoli";
  }
  const active = () => (layer === "muscoli" && groups.muscoli ? picks.muscoli : layer === "ossa" ? picks.ossa : []);

  // selezione e passaggio del mouse
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let sel = null, hov = null, down = null;
  function hit(ev) {
    const list = active();
    if (!list.length || reveal < .5) return null;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(list, false)[0];
    return h ? h.object : null;
  }
  const paint = () => [...picks.ossa, ...picks.muscoli].forEach((m) => (m.material = m === sel ? m.userData.sel : m === hov ? m.userData.hov : m.userData.base));
  renderer.domElement.addEventListener("pointerdown", (e) => { down = [e.clientX, e.clientY]; controls.autoRotate = false; });
  renderer.domElement.addEventListener("pointermove", (e) => {
    if (hero || e.pointerType === "touch") return;
    const o = hit(e); if (o !== hov) { hov = o; paint(); renderer.domElement.style.cursor = o ? "pointer" : "grab"; }
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (hero || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const o = hit(e);
    sel = o; paint();
    if (opts.onPick) opts.onPick(o ? { en: o.userData.en, it: o.userData.it, side: o.userData.side, point: o.userData.point, kind: o.userData.kind } : null);
  });

  // ciclo di disegno
  let raf = 0, alive = true;
  function resize() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // inquadra tutto il corpo in verticale
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(container); resize();
  function frame() {
    if (!alive) return;
    reveal += (revealTarget - reveal) * .06;
    if (skin) {
      const k = layer === "pelle" ? 0 : reveal; // 0 = pelle piena, 1 = vetro
      skinMat.opacity = 1 - k * .87; // resta un velo di vetro attorno allo scheletro
      skinMat.depthWrite = k < .5;
      skinMat.color.setHex(0xd9a088).lerp(new THREE.Color(0x7fc4ff), k * .8);
      skin.visible = skinMat.opacity > .01;
      applyLayer();
    }
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return {
    ready,
    setLayer(l) { layer = l; if (l === "muscoli") loadMuscles(); applyLayer(); sel = null; hov = null; paint(); },
    hasMuscles: () => !!groups.muscoli,
    reveal(on) { revealTarget = on ? 1 : 0; },
    view(v) { // f = fronte, b = retro
      const d = camera.position.distanceTo(controls.target);
      camera.position.set(0, controls.target.y + .1, v === "b" ? -d : d); controls.update();
    },
    reset() { controls.target.set(0, .82, 0); camera.position.set(0, .95, 4.6); sel = null; paint(); },
    clear() { sel = null; paint(); },
    destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); renderer.domElement.remove(); },
  };
}

window.Viewer3D = { create, italiano, linkFor };
window.dispatchEvent(new Event("viewer3d-ready"));
