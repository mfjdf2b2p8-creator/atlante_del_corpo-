/* =========================================================
   Nervi, tendini/legamenti e sistema linfatico in 3D.
   Il modello BodyParts3D non li contiene (tranne pochi pezzi),
   quindi sono costruiti qui come tubi e nodi agganciati alle
   ossa reali del modello. Coordinate in millimetri del modello:
   [x, altezza, avanti]. x > 0 = lato sinistro della persona.
   Ogni struttura «L» viene specchiata sul lato destro.
   ========================================================= */
import * as THREE from "three";

// t: strato · n: nome italiano · p: punto dell'atlante · r: raggio (mm) · c: linea centrale (non specchiata)
const S = [];
const add = (t, n, p, r, pts, o = {}) => S.push(Object.assign({ t, n, p, r, pts }, o));
const N = (n, p, r, pts, o) => add("nervi", n, p, r, pts, o);
const T = (n, p, r, pts, o) => add("tendini", n, p, r, pts, o);
const V = (n, p, pts, o) => add("linfatico", n, p, 1.7, pts, o);
const NODES = []; // [nome, punto, [[x,h,f,raggio]...], centrale?]

/* ---------------- NERVI ---------------- */
N("Midollo spinale", "cervicale", 5, [[0, 1495, 62], [0, 1440, 62], [0, 1405, 58], [0, 1378, 52], [0, 1360, 45], [0, 1300, 33], [0, 1238, 27], [0, 1150, 36], [0, 1075, 50], [0, 1043, 60]], { c: 1 });
N("Cauda equina (radici lombari e sacrali)", "sciatico", 3.2, [[0, 1043, 60], [0, 990, 62], [0, 930, 52], [0, 880, 38], [0, 830, 22]], { c: 1 });
N("Plesso brachiale", "cervicobrachialgia", 2.6, [[24, 1402, 56], [60, 1365, 72], [95, 1330, 82], [140, 1282, 75]]);
N("Plesso brachiale", "cervicobrachialgia", 2.6, [[26, 1372, 50], [65, 1345, 66], [100, 1318, 78], [140, 1282, 75]]);
N("Nervo mediano", "tunnel-carpale", 2.3, [[140, 1282, 76], [175, 1180, 86], [200, 1085, 92], [217, 1040, 100], [238, 920, 110], [252, 815, 126], [258, 772, 133]]);
N("Nervo mediano · rami delle dita", "tunnel-carpale", 1.2, [[258, 772, 133], [282, 765, 145], [298, 755, 152], [312, 728, 160]]);
N("Nervo mediano · rami delle dita", "tunnel-carpale", 1.2, [[258, 772, 133], [272, 730, 136], [278, 690, 134], [280, 655, 130]]);
N("Nervo mediano · rami delle dita", "tunnel-carpale", 1.2, [[258, 772, 133], [262, 728, 135], [263, 685, 133], [263, 645, 130]]);
N("Nervo ulnare", "ulnare", 2.2, [[140, 1280, 70], [170, 1180, 60], [188, 1100, 52], [193, 1052, 50], [205, 1000, 80], [216, 930, 102], [228, 850, 120], [234, 805, 130], [236, 765, 133]]);
N("Nervo ulnare · rami delle dita", "ulnare", 1.2, [[236, 765, 133], [235, 730, 135], [233, 690, 133], [232, 655, 130]]);
N("Nervo ulnare · rami delle dita", "ulnare", 1.1, [[236, 765, 133], [246, 728, 134], [247, 690, 132]]);
N("Nervo radiale", "cervicobrachialgia", 2.2, [[140, 1280, 66], [165, 1235, 50], [190, 1190, 44], [215, 1130, 58], [234, 1075, 80], [238, 1048, 94], [255, 980, 96], [264, 910, 94], [275, 840, 102], [283, 800, 110], [293, 770, 122]]);
N("Nervo femorale", "flessori-anca", 2.6, [[24, 1005, 58], [32, 965, 64], [50, 905, 84], [70, 850, 112], [78, 815, 128], [85, 770, 122]]);
N("Nervo femorale · rami della coscia", "quadricipite", 1.4, [[85, 770, 122], [100, 680, 125], [108, 580, 120], [100, 480, 116]]);
N("Nervo femorale · rami della coscia", "quadricipite", 1.4, [[85, 770, 122], [75, 680, 118], [66, 580, 114], [62, 470, 110]]);
N("Nervo safeno", "zampa-oca", 1.3, [[85, 770, 122], [70, 690, 108], [55, 560, 92], [46, 430, 78], [44, 360, 80], [46, 250, 90], [48, 130, 95], [46, 20, 98], [55, -20, 110]]);
N("Nervo cutaneo femorale laterale", "meralgia", 1.5, [[34, 990, 62], [80, 935, 90], [116, 885, 126], [134, 820, 128], [146, 720, 118], [150, 600, 110]]);
N("Nervo sciatico", "sciatico", 4.2, [[22, 880, 34], [48, 862, 22], [72, 832, 14], [92, 790, 14], [96, 700, 22], [94, 600, 26], [90, 500, 30], [86, 430, 34]]);
N("Nervo tibiale", "sciatico", 2.8, [[86, 430, 34], [80, 340, 40], [75, 230, 46], [70, 130, 50], [58, 40, 56], [52, 0, 62], [62, -40, 80], [78, -56, 110], [100, -60, 150]]);
N("Nervo peroneo comune", "sciatico", 2.4, [[86, 430, 34], [104, 390, 42], [116, 345, 58], [114, 320, 78], [104, 250, 100], [96, 150, 104], [88, 50, 106], [96, -20, 138], [110, -42, 175]]);
N("Nervo grande occipitale", "cefalea-tensiva", 1.5, [[18, 1458, 26], [24, 1490, 10], [30, 1530, -6], [32, 1580, 0], [30, 1620, 30]]);

/* ---------------- TENDINI E LEGAMENTI ---------------- */
T("Tendine rotuleo", "rotuleo", 6, [[82, 362, 116], [83, 345, 117], [84, 328, 116]]);
T("Tendine del quadricipite", "rotuleo", 6.5, [[80, 440, 108], [81, 418, 113], [82, 400, 116]]);
T("Legamento collaterale mediale", "legamenti-ginocchio", 3.5, [[44, 412, 80], [41, 380, 80], [42, 340, 84], [45, 300, 88]]);
T("Legamento collaterale laterale", "legamenti-ginocchio", 2.8, [[120, 408, 76], [120, 380, 70], [115, 352, 62]]);
T("Legamento crociato anteriore", "legamenti-ginocchio", 3, [[96, 392, 68], [88, 380, 82], [78, 371, 96]]);
T("Legamento crociato posteriore", "legamenti-ginocchio", 3, [[70, 392, 94], [76, 378, 78], [84, 366, 60]]);
T("Zampa d'oca", "zampa-oca", 3.2, [[42, 430, 58], [40, 390, 68], [42, 350, 86], [52, 325, 104]]);
T("Legamento peroneo-astragalico anteriore", "caviglia", 2.6, [[112, -5, 72], [104, -10, 86], [94, -12, 98]]);
T("Legamento deltoideo", "caviglia", 3.2, [[44, 4, 78], [46, -14, 74], [52, -30, 66]]);
T("Legamento deltoideo", "caviglia", 2.6, [[44, 4, 82], [47, -10, 92], [52, -18, 104]]);
T("Fascia plantare", "fascia-plantare", 2.6, [[73, -66, 40], [82, -66, 100], [90, -63, 180]]);
T("Fascia plantare", "fascia-plantare", 2.4, [[73, -66, 40], [100, -68, 100], [120, -65, 172]]);
T("Fascia plantare", "fascia-plantare", 2.2, [[73, -66, 40], [112, -68, 90], [140, -67, 148]]);
T("Tendine del sovraspinato (cuffia)", "cuffia", 4.5, [[110, 1326, 30], [140, 1336, 52], [168, 1334, 70], [184, 1318, 84]]);
T("Tendine del capo lungo del bicipite", "cuffia", 2.4, [[152, 1312, 82], [168, 1300, 96], [178, 1265, 100], [186, 1200, 102]]);
T("Tendine distale del bicipite", "bicipite", 3, [[214, 1075, 104], [222, 1040, 100], [230, 1005, 88]]);
T("Tendine del tricipite", "tricipite", 5, [[200, 1120, 46], [206, 1085, 42], [212, 1052, 40]]);
T("Tendine comune degli estensori (epicondilo)", "epicondilite", 3.4, [[241, 1050, 72], [250, 1020, 76], [262, 980, 80]]);
T("Tendine comune dei flessori (epitroclea)", "epitrocleite", 3.4, [[190, 1052, 74], [200, 1020, 92], [212, 985, 106]]);
T("Tendini del pollice (De Quervain)", "dequervain", 2.2, [[262, 900, 96], [272, 850, 104], [280, 812, 112], [287, 790, 130], [300, 765, 146]]);
T("Guaina dei flessori · indice", "dito-scatto", 1.6, [[262, 805, 127], [276, 760, 134], [278, 722, 136], [280, 680, 134], [281, 650, 130]]);
T("Guaina dei flessori · medio", "dito-scatto", 1.6, [[256, 805, 127], [262, 760, 134], [263, 722, 136], [263, 680, 134], [263, 640, 130]]);
T("Guaina dei flessori · anulare", "dito-scatto", 1.6, [[250, 805, 127], [248, 760, 134], [247, 726, 135], [247, 690, 133], [246, 655, 130]]);
T("Guaina dei flessori · mignolo", "dito-scatto", 1.5, [[244, 805, 127], [237, 765, 134], [235, 733, 135], [233, 700, 133], [232, 670, 130]]);
T("Guaina dei flessori · pollice", "dito-scatto", 1.5, [[262, 805, 127], [285, 785, 140], [302, 762, 150], [312, 735, 160]]);
T("Legamento inguinale", "ernia-inguinale", 2.6, [[124, 892, 130], [95, 860, 136], [60, 828, 140], [26, 805, 140]]);

/* ---------------- SISTEMA LINFATICO ---------------- */
NODES.push(["Linfonodi cervicali", "linfonodi-collo", [[46, 1452, 118, 5], [52, 1426, 104, 5.5], [55, 1400, 96, 5], [52, 1376, 92, 5], [36, 1440, 140, 4.5], [24, 1437, 150, 4]]]);
NODES.push(["Linfonodi sopraclaveari", "linfonodi-collo", [[60, 1346, 104, 5], [76, 1350, 98, 4.5]]]);
NODES.push(["Linfonodi ascellari", "linfonodi-ascellari", [[130, 1265, 70, 6], [140, 1250, 80, 6.5], [124, 1244, 60, 5.5], [146, 1270, 62, 5], [134, 1228, 76, 5.5]]]);
NODES.push(["Linfonodi epitrocleari", "linfonodi-ascellari", [[184, 1082, 80, 4], [188, 1094, 74, 3.5]]]);
NODES.push(["Linfonodi inguinali", "linfonodi-inguinali", [[60, 820, 140, 6], [80, 814, 138, 6.5], [96, 806, 134, 5.5], [70, 790, 134, 5.5], [86, 778, 130, 5]]]);
NODES.push(["Linfonodi iliaci", "linfonodi-inguinali", [[44, 900, 100, 5], [60, 870, 106, 5]]]);
NODES.push(["Linfonodi poplitei", "gambe-gonfie", [[82, 410, 26, 4.5], [90, 395, 30, 4], [78, 395, 30, 4]]]);
NODES.push(["Linfonodi del mediastino", null, [[0, 1300, 122, 5], [10, 1270, 112, 5], [-10, 1240, 106, 5], [0, 1200, 96, 5]], 1]);
NODES.push(["Linfonodi lombo-aortici", "linfonodi-inguinali", [[18, 1040, 122, 5], [-18, 1020, 122, 5], [20, 990, 124, 5], [-20, 970, 124, 5], [18, 940, 122, 5]], 1]);
V("Vasi linfatici della gamba", "gambe-gonfie", [[100, -30, 150], [62, 20, 108], [55, 200, 106], [55, 380, 96], [70, 600, 116], [76, 800, 134]]);
V("Vasi linfatici della gamba", "gambe-gonfie", [[130, -40, 122], [112, 150, 92], [106, 380, 102], [110, 600, 122], [86, 792, 134]]);
V("Vasi linfatici della gamba", "gambe-gonfie", [[80, 50, 40], [80, 250, 30], [84, 400, 26]]);
V("Vasi linfatici del braccio", "linfonodi-ascellari", [[256, 750, 136], [246, 810, 126], [226, 930, 108], [200, 1060, 86], [170, 1180, 80], [136, 1250, 70]]);
V("Vasi linfatici del braccio", "linfonodi-ascellari", [[286, 760, 112], [266, 900, 82], [232, 1060, 70], [182, 1200, 70], [142, 1255, 64]]);
V("Vasi linfatici del collo", "linfonodi-collo", [[40, 1452, 116], [55, 1400, 96], [46, 1345, 108]]);
V("Dotto toracico", null, [[4, 1040, 100], [5, 1150, 86], [0, 1250, 76], [8, 1320, 86], [25, 1350, 100], [40, 1346, 110]], { c: 1, r: 2.6 });
NODES.push(["Cisterna del chilo", null, [[4, 1040, 100, 7]], 1]);

/* ---------------- COSTRUZIONE ---------------- */
const mm = ([x, y, z]) => new THREE.Vector3(x / 1000, y / 1000, z / 1000);
const mir = (pts) => pts.map(([x, y, z, r]) => [-x, y, z, r]);

// linea centrale di una costola, ricavata dai vertici della mesh vera (per i nervi intercostali)
function ribCurve(mesh, sideSign) {
  const pos = mesh.geometry.attributes.position, v = new THREE.Vector3(), bins = new Map();
  mesh.updateWorldMatrix(true, false);
  for (let i = 0; i < pos.count; i += 2) {
    v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
    const a = Math.atan2(v.x * sideSign, v.z - .06); // angolo attorno alla colonna
    const k = Math.round(a / .12);
    const b = bins.get(k) || [0, 0, 0, 0]; b[0] += v.x; b[1] += v.y; b[2] += v.z; b[3]++; bins.set(k, b);
  }
  return [...bins.entries()].sort((p, q) => p[0] - q[0]).filter(([, b]) => b[3] > 3)
    .map(([, b]) => new THREE.Vector3(b[0] / b[3], b[1] / b[3] - .012, b[2] / b[3])); // sotto il bordo della costola
}

export function build(boneByName, mats) {
  const groups = { nervi: new THREE.Group(), tendini: new THREE.Group(), linfatico: new THREE.Group() };
  const items = { nervi: [], tendini: [], linfatico: [] };
  const proxies = { nervi: [], tendini: [], linfatico: [] };
  // zona di tocco invisibile e più larga, così le strutture sottili si prendono anche col dito
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const mk = (t, geo, info, fat) => {
    const m = new THREE.Mesh(geo, mats[t].base);
    Object.assign(m.userData, { kind: t, base: mats[t].base, sel: mats[t].sel, hov: mats[t].hov }, info);
    groups[t].add(m); items[t].push(m);
    const p = new THREE.Mesh(fat || geo, hitMat); p.userData.target = m;
    groups[t].add(p); proxies[t].push(p);
  };
  const tube = (pts, r, seg = 8) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => (p.isVector3 ? p : mm(p))), false, "centripetal"), Math.max(12, pts.length * 10), r / 1000, seg, false);
  const fatTube = (pts, r) => tube(pts, Math.max(r * 2.2, 9), 6);
  S.forEach((s) => {
    const sides = s.c ? [["c", s.pts]] : [["l", s.pts], ["r", mir(s.pts)]];
    sides.forEach(([side, pts]) => mk(s.t, tube(pts, s.r), { it: s.n, point: s.p, side, en: "" }, fatTube(pts, s.r)));
  });
  // nervi intercostali lungo le costole vere, dalla terza alla decima
  ["third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"].forEach((o) => [["Left", 1, "l"], ["Right", -1, "r"]].forEach(([L, sg, side]) => {
    const rib = boneByName(`${L} ${o} rib`);
    if (!rib) return;
    const c = ribCurve(rib, sg);
    if (c.length > 3) mk("nervi", tube(c, 1.1), { it: "Nervo intercostale", point: "nevralgia-intercostale", side, en: "" }, tube(c, 6, 6));
  }));
  // nodi linfatici e neuroma
  const sphere = new THREE.SphereGeometry(1, 16, 12);
  const nodeSet = (t, name, point, list, central) => {
    const sides = central ? [["c", list]] : [["l", list], ["r", mir(list)]];
    sides.forEach(([side, l]) => {
      const ball = (k, min) => l.map(([x, y, z, r]) => { const R = Math.max(r * k, min) / 1000; return sphere.clone().scale(R, R * (t === "linfatico" && k === 1 ? .8 : 1), R).translate(x / 1000, y / 1000, z / 1000); });
      mk(t, mergeGeos(ball(1, 0)), { it: name, point, side, en: "" }, mergeGeos(ball(2.2, 11)));
    });
  };
  NODES.forEach(([n, p, l, c]) => nodeSet("linfatico", n, p, l, c));
  nodeSet("nervi", "Neuroma di Morton (sede tipica)", "morton", [[125, -60, 172, 4]]);
  return { groups, items, proxies };
}

// unisce più geometrie semplici in una sola
function mergeGeos(geos) {
  let n = 0, ni = 0;
  geos.forEach((g) => { n += g.attributes.position.count; ni += g.index.count; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), idx = new Uint32Array(ni);
  let o = 0, oi = 0;
  geos.forEach((g) => {
    pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
    for (let i = 0; i < g.index.count; i++) idx[oi + i] = g.index.array[i] + o;
    o += g.attributes.position.count; oi += g.index.count;
  });
  const m = new THREE.BufferGeometry();
  m.setAttribute("position", new THREE.BufferAttribute(pos, 3)); m.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); m.setIndex(new THREE.BufferAttribute(idx, 1));
  return m;
}
