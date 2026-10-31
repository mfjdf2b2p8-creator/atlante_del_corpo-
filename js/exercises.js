/* =========================================================
   ESERCIZI: testi + pose chiave per l'animazione.
   Vista "side" (di lato, guarda verso destra) o "front".
   A = arto vicino (side) / sinistra dello schermo (front).
   ========================================================= */
window.EXERCISES = (function () {
  const E = {};
  const X = (id, o) => (E[id] = Object.assign({ id }, o));
  const K = (pose, d, hold, label) => ({ pose, d, hold, label });

  const STAND = { p: [0, 92], lA: { to: [1, 7] }, lB: { to: [-2, 7] } };
  const SUPINE = { p: [0, 10], t: -90, h: 0 };
  const QUAD = { p: [0, 48], t: 82, lA: { h: 0, k: -90, f: -170 }, lB: { h: 2, k: -88, f: -170 }, aA: { to: [48, 3], b: 1, wa: 90 }, aB: { to: [46, 3], b: 1, wa: 90 } };
  const SEAT = { p: [-14, 49], t: -4, lA: { h: 90, k: 0, f: 0 }, lB: { h: 88, k: 2, f: 0 } };
  const FSTAND = { p: [0, 92], lA: { h: 0, k: 0 }, lB: { h: 0, k: 0 } };

  /* ---------------- COLLO E SPALLE ---------------- */
  X("chin-tuck", {
    name: "Retrazione cervicale", target: "Flessori profondi del collo", level: "Facile", dose: "2 × 10 · tieni 3 s",
    view: "side", hi: ["neck"], focus: [-40, 96, 52, 165], base: Object.assign({}, STAND, { t2: 6 }),
    k: [K({ n: 22, h: -18 }, 900, 500, "Testa in avanti: la postura da evitare"), K({ n: -6, h: 8 }, 1300, 1600, "Porta il mento indietro, come a fare il doppio mento")],
    steps: ["In piedi o seduto, guarda dritto davanti a te.", "Porta la testa indietro facendo scivolare il mento, senza abbassare lo sguardo.", "Tieni 3 secondi sentendo allungare la base della nuca, poi rilascia."],
    tips: ["Immagina un filo che ti tira in alto dalla nuca.", "Puoi farlo anche in auto al semaforo, appoggiando la testa al poggiatesta."],
    avoid: ["Non piegare la testa in giù: il movimento è all'indietro, orizzontale."],
  });

  X("stretch-trapezio", {
    name: "Allungamento del trapezio", target: "Trapezio superiore, elevatore della scapola", level: "Facile", dose: "3 × 30 s per lato",
    view: "front", hi: ["trapA"], base: Object.assign({}, FSTAND, { aA: { s: -10, e: -8 }, aB: { to: ["head", -6, 5], b: -1 } }),
    k: [K({ n: 0, h: 0, aA: { s: -8, e: -6 } }, 900, 400, "Mano sopra la testa, spalla opposta rilassata"), K({ n: 18, h: 14, aA: { s: -14, e: -14 } }, 1600, 2200, "Inclina l'orecchio verso la spalla e spingi giù la spalla opposta")],
    steps: ["Seduto o in piedi, appoggia una mano sopra la testa.", "Inclina lentamente l'orecchio verso la spalla, senza ruotare il viso.", "Allunga il braccio opposto verso il pavimento: senti tirare tra collo e spalla.", "Respira lento e tieni 30 secondi, poi cambia lato."],
    tips: ["La mano accompagna, non tira forte."],
    avoid: ["Non alzare la spalla del lato che stai allungando.", "Non fare rimbalzi."],
  });

  X("circonduzioni-spalle", {
    name: "Elevazioni e rotazioni delle spalle", target: "Trapezio, muscoli delle scapole, drenaggio", level: "Facile", dose: "2 × 10",
    view: "front", hi: ["trap"], base: FSTAND,
    k: [K({ sh: 0 }, 900, 200, "Spalle rilassate"), K({ sh: 6 }, 1000, 300, "Alza le spalle verso le orecchie inspirando"), K({ sh: -2, aA: { s: -12, e: -10 }, aB: { s: 12, e: 10 } }, 1100, 300, "Portale indietro e giù espirando")],
    steps: ["In piedi, braccia rilassate lungo i fianchi.", "Alza le spalle verso le orecchie inspirando.", "Portale indietro e poi giù espirando, come a disegnare un cerchio.", "Movimento lento e ampio."],
    tips: ["Ottimo ogni ora se lavori al computer.", "Respirare a fondo aiuta anche il drenaggio linfatico."],
    avoid: ["Non trattenere il respiro."],
  });

  X("rematore-elastico", {
    name: "Rematore con elastico", target: "Romboidi, trapezio medio, dorsale", level: "Facile", dose: "3 × 12",
    view: "side", hi: ["upperback", "lats"], props: [{ type: "post", x: 74 }, { type: "band", from: "handA", to: [74, 110] }, { type: "band", from: "handB", to: [74, 110] }],
    base: { p: [0, 90], t: 4, lA: { to: [4, 7] }, lB: { to: [-4, 7] }, aA: { to: [46, 112], b: -1 }, aB: { to: [44, 112], b: -1 } },
    k: [K({}, 900, 300, "Braccia avanti, elastico in leggera tensione"), K({ aA: { to: [10, 108], b: -1 }, aB: { to: [8, 108], b: -1 }, t: 0 }, 1100, 700, "Tira i gomiti indietro e stringi le scapole"), K({ aA: { to: [46, 112], b: -1 }, aB: { to: [44, 112], b: -1 }, t: 4 }, 1800, 200, "Torna avanti lentamente")],
    steps: ["Fissa l'elastico a una maniglia all'altezza del petto.", "Ginocchia morbide, petto aperto, braccia tese in avanti.", "Tira i gomiti indietro vicino ai fianchi e stringi le scapole.", "Torna avanti in 2 secondi controllando l'elastico."],
    tips: ["Pensa a «mettere le scapole nelle tasche posteriori»."],
    avoid: ["Non alzare le spalle verso le orecchie.", "Non inarcare la schiena per tirare di più."],
  });

  X("wall-slide", {
    name: "Scivolamento al muro", target: "Trapezio inferiore, dentato anteriore, deltoide", level: "Facile", dose: "2 × 10",
    view: "front", hi: ["upperback", "delt"], props: [{ type: "wallbg" }],
    base: Object.assign({}, FSTAND, { aA: { s: -88, e: -178 }, aB: { s: 88, e: 178 } }),
    k: [K({}, 900, 400, "Schiena, testa e braccia a «W» contro il muro"), K({ aA: { s: -148, e: -162 }, aB: { s: 148, e: 162 } }, 1800, 500, "Fai scivolare le braccia in alto a «Y»"), K({ aA: { s: -88, e: -178 }, aB: { s: 88, e: 178 } }, 1800, 300, "Torna giù tirando i gomiti verso i fianchi")],
    steps: ["Schiena e testa appoggiate al muro, piedi a 15–20 cm.", "Braccia a «W»: gomiti piegati a 90°, dorso delle mani verso il muro.", "Fai scivolare le braccia verso l'alto finché la schiena resta appoggiata.", "Torna giù tirando i gomiti verso i fianchi."],
    tips: ["Se la spalla fa male, fermati prima del punto doloroso."],
    avoid: ["Non staccare la zona lombare dal muro.", "Non alzare le spalle."],
  });

  X("stretch-pettorale", {
    name: "Allungamento del pettorale alla porta", target: "Gran pettorale, bicipite", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["chest"], props: [{ type: "post", x: -8 }],
    base: { p: [4, 88], t: 0, lA: { to: [24, 7] }, lB: { to: [-14, 7] }, aA: { to: [-3, 160], b: 1, wa: 180 }, aB: { s: 0, e: 2 }, sc: { uarmA: .45 } },
    k: [K({}, 900, 400, "Avambraccio appoggiato allo stipite, gomito all'altezza della spalla"), K({ p: [14, 86], t: 10 }, 1800, 2200, "Fai un passo avanti e apri il petto")],
    steps: ["Appoggia l'avambraccio allo stipite di una porta, gomito all'altezza della spalla.", "Fai un piccolo passo in avanti con la gamba dello stesso lato.", "Ruota leggermente il busto verso l'esterno finché senti allungare il petto.", "Tieni 30 secondi respirando, poi cambia lato."],
    tips: ["Alzando il gomito un po' più in alto allunghi le fibre basse."],
    avoid: ["Non spingere fino a sentire formicolio nel braccio: abbassa il gomito."],
  });

  X("rotazione-esterna", {
    name: "Extrarotazione con elastico", target: "Sottospinato, piccolo rotondo (cuffia dei rotatori)", level: "Facile", dose: "3 × 15",
    view: "front", hi: ["rotatorA"], props: [{ type: "band", from: "handA", to: [58, 104] }],
    base: Object.assign({}, FSTAND, { aA: { s: -3, e: -82, w: 0 }, aB: { s: 6, e: 6 }, sc: { farmA: .12, handA: .3 } }),
    k: [K({}, 900, 300, "Gomito attaccato al fianco, avambraccio in avanti"), K({ sc: { farmA: .95, handA: 1 } }, 1300, 600, "Ruota l'avambraccio verso l'esterno"), K({ sc: { farmA: .12, handA: .3 } }, 1900, 200, "Torna lentamente")],
    steps: ["Elastico fissato all'altezza della vita sul lato opposto.", "Gomito piegato a 90° e attaccato al fianco (un asciugamano arrotolato aiuta).", "Ruota l'avambraccio verso l'esterno come una porta che si apre.", "Torna lentamente in 2–3 secondi."],
    tips: ["Il gomito resta fermo: si muove solo l'avambraccio."],
    avoid: ["Non ruotare il busto per aiutarti.", "Dolore sopra 3/10: riduci la tensione dell'elastico."],
  });

  X("pendolo", {
    name: "Pendolo di Codman", target: "Mobilità dolce della spalla", level: "Facile", dose: "1–2 minuti, 2–3 volte al giorno",
    view: "side", hi: ["deltA"], props: [{ type: "table", x: 30, w: 60, h: 78 }],
    base: { p: [-6, 88], t: 62, h: -10, lA: { to: [10, 7] }, lB: { to: [-22, 7] }, aB: { to: [44, 81], b: -1, wa: 90 }, aA: { s: -16, e: -16 } },
    k: [K({ aA: { s: -16, e: -16 } }, 1300, 0, "Lascia penzolare il braccio rilassato"), K({ aA: { s: 16, e: 16 } }, 1300, 0, "Dondola il busto: il braccio oscilla da solo")],
    steps: ["Appoggia la mano sana su un tavolo e piega il busto in avanti.", "Lascia penzolare il braccio dolente completamente rilassato.", "Muovi il busto in modo che il braccio oscilli avanti-indietro, poi a cerchio.", "I muscoli della spalla non devono lavorare."],
    tips: ["Puoi tenere in mano una bottiglietta leggera per aumentare la trazione."],
    avoid: ["Non muovere il braccio con la forza della spalla."],
  });

  X("push-up-muro", {
    name: "Piegamenti al muro", target: "Pettorale, tricipite, dentato anteriore", level: "Facile", dose: "3 × 12",
    view: "side", hi: ["chest", "tricepsA"], props: [{ type: "wall", x: 70 }],
    base: { p: [9, 87], t: 20, lA: { to: [-20, 7], f: 0 }, lB: { to: [-22, 7], f: 0 }, aA: { to: [67, 126], b: -1, wa: 180 }, aB: { to: [66, 124], b: -1, wa: 180 } },
    k: [K({}, 900, 300, "Mani al muro all'altezza delle spalle, corpo dritto"), K({ p: [25, 79], t: 32 }, 1600, 300, "Scendi con il petto verso il muro"), K({ p: [9, 87], t: 20 }, 1200, 300, "Spingi e torna su")],
    steps: ["Mani al muro all'altezza delle spalle, un po' più larghe.", "Corpo dritto dalla testa ai talloni.", "Piega i gomiti e porta il petto verso il muro.", "Spingi e torna, allontanando bene le scapole alla fine."],
    tips: ["Più i piedi sono lontani dal muro, più è difficile."],
    avoid: ["Non far cadere il bacino in avanti.", "Non aprire troppo i gomiti (circa 45° dal corpo)."],
  });

  X("estensione-toracica", {
    name: "Estensione toracica sulla sedia", target: "Mobilità della colonna dorsale", level: "Facile", dose: "2 × 8",
    view: "side", hi: ["upperback"], props: [{ type: "chair", x: -34, w: 42, h: 41, back: 44 }],
    base: Object.assign({}, SEAT, { p: [-16, 49], t: -4, t2: 15, h: 10, aA: { to: ["head", -7, 3], b: 1 }, aB: { to: ["head", -8, 3], b: 1 } }),
    k: [K({}, 900, 400, "Seduto, mani dietro la nuca"), K({ t2: -32, h: -6 }, 1800, 1200, "Appoggia la parte alta della schiena allo schienale e apri il petto"), K({ t2: 15, h: 10 }, 1500, 300, "Torna lentamente")],
    steps: ["Siediti con lo schienale che arriva all'altezza delle scapole.", "Mani dietro la nuca, gomiti in avanti.", "Inspira e porta la parte alta della schiena indietro sopra lo schienale, aprendo i gomiti.", "Torna espirando."],
    tips: ["Si muove la schiena alta, non la zona lombare."],
    avoid: ["Non tirare la testa con le mani."],
  });

  X("gatto-cammello", {
    name: "Gatto-cammello", target: "Mobilità di tutta la colonna", level: "Facile", dose: "2 × 10",
    view: "side", hi: ["lumbar", "upperback"], props: [{ type: "mat", x0: -60, x1: 70 }], base: QUAD,
    k: [K({ t: 70, t2: 96, h: 32, n: 10 }, 1600, 500, "Gatto: arrotonda la schiena spingendo il pavimento"), K({ t: 96, t2: 70, h: -28, n: -8 }, 1800, 500, "Cammello: lascia scendere la pancia e guarda avanti")],
    steps: ["A quattro zampe: mani sotto le spalle, ginocchia sotto le anche.", "Espirando arrotonda la schiena e porta il mento al petto.", "Inspirando lascia scendere la pancia e porta lo sguardo avanti.", "Muoviti lento, una vertebra alla volta."],
    tips: ["Rimani nell'ampiezza che non fa male."],
    avoid: ["Non spingere forte nella posizione che dà dolore."],
  });

  X("bambino", {
    name: "Posizione del bambino", target: "Zona lombare, gran dorsale", level: "Facile", dose: "3 × 30 s",
    view: "side", hi: ["lumbar", "lats"], props: [{ type: "mat", x0: -60, x1: 70 }],
    base: Object.assign({}, QUAD, { aA: { to: [54, 3], b: 1, wa: 90 }, aB: { to: [52, 3], b: 1, wa: 90 } }),
    k: [K({}, 900, 400, "A quattro zampe, mani un po' avanti"), K({ p: [-39, 23], t: 100, t2: 104, h: 10, lA: { h: 65, k: -90, f: -170 }, lB: { h: 66, k: -89, f: -170 } }, 2000, 2400, "Porta i glutei verso i talloni e allunga le braccia")],
    steps: ["Parti a quattro zampe con le mani un po' avanti.", "Porta i glutei verso i talloni lasciando le mani a terra.", "Rilassa la fronte verso il tappetino e respira nella schiena.", "Per allungare un fianco, sposta entrambe le mani verso il lato opposto."],
    tips: ["Se le ginocchia fanno male metti un cuscino tra glutei e talloni."],
    avoid: ["Non forzare se senti dolore alle ginocchia."],
  });

  /* ---------------- BRACCIO, GOMITO, POLSO ---------------- */
  X("curl-eccentrico", {
    name: "Curl con discesa lenta", target: "Bicipite e tendini del gomito", level: "Medio", dose: "3 × 10",
    view: "side", hi: ["bicepsA"], props: [{ type: "db", at: "handA" }], base: STAND,
    k: [K({ aA: { s: 6, e: 8 } }, 900, 300, "Braccio disteso con il manubrio"), K({ aA: { s: 10, e: 142 } }, 1000, 300, "Porta su (aiutati con l'altra mano se serve)"), K({ aA: { s: 6, e: 8 } }, 3000, 300, "Scendi lentamente in 3 secondi")],
    steps: ["In piedi, gomito vicino al fianco, palmo in avanti.", "Porta il manubrio verso la spalla (anche con l'aiuto dell'altra mano).", "Scendi lentamente in 3 secondi fino a braccio disteso."],
    tips: ["Peso leggero: la lentezza in discesa è ciò che conta."],
    avoid: ["Non dondolare con la schiena.", "Non spostare il gomito in avanti."],
  });

  const DESK = { props: [{ type: "chair", x: -42, w: 40, h: 41 }, { type: "table", x: 0, w: 70, h: 74 }], focus: [-32, 46, 72, 124] };
  const DESKBASE = { p: [-22, 49], t: 12, lA: { h: 90, k: 0, f: 0 }, lB: { h: 88, k: 2, f: 0 }, aA: { to: [34, 77], b: -1, w: 0 }, aB: { to: [22, 77], b: -1, w: 0 } };

  X("polso-eccentrico-est", {
    name: "Eccentrico degli estensori del polso", target: "Estensori dell'avambraccio (gomito del tennista)", level: "Facile", dose: "3 × 15, 1 volta al giorno",
    view: "side", hi: ["forearmExtA"], props: DESK.props.concat([{ type: "db", at: "handA" }]), focus: DESK.focus, base: DESKBASE,
    k: [K({ aA: { to: [34, 77], b: -1, w: 45 } }, 900, 400, "Palmo verso il basso: polso su (aiutati con l'altra mano)"), K({ aA: { to: [34, 77], b: -1, w: -45 } }, 3200, 400, "Scendi lentamente in 3–4 secondi")],
    steps: ["Avambraccio appoggiato sul tavolo, mano fuori dal bordo, palmo in giù.", "Usa l'altra mano per portare il polso in alto.", "Togli l'aiuto e lascia scendere il polso lentamente in 3–4 secondi.", "Ripeti: un leggero fastidio (fino a 3–4/10) è accettabile."],
    tips: ["Parti con 0,5–1 kg (o una bottiglietta d'acqua) e aumenta ogni settimana."],
    avoid: ["Non sollevare con il polso dolente: la salita la fa l'altra mano."],
  });

  X("polso-eccentrico-fless", {
    name: "Eccentrico dei flessori del polso", target: "Flessori dell'avambraccio (gomito del golfista)", level: "Facile", dose: "3 × 15",
    view: "side", hi: ["forearmA"], props: DESK.props.concat([{ type: "db", at: "handA" }]), focus: DESK.focus, base: DESKBASE,
    k: [K({ aA: { to: [34, 77], b: -1, w: 45 } }, 900, 400, "Palmo verso l'alto: polso su"), K({ aA: { to: [34, 77], b: -1, w: -45 } }, 3200, 400, "Scendi lentamente in 3–4 secondi")],
    steps: ["Avambraccio sul tavolo, palmo verso l'alto, mano fuori dal bordo.", "Porta il polso in alto aiutandoti con l'altra mano.", "Lascia scendere lentamente in 3–4 secondi."],
    tips: ["Aumenta il peso solo quando 15 ripetizioni sono facili."],
    avoid: ["Non stringere troppo forte il peso."],
  });

  X("deviazione-radiale", {
    name: "Deviazione radiale a martello", target: "Tendini del pollice (De Quervain)", level: "Facile", dose: "3 × 12",
    view: "side", hi: ["forearmA"], props: DESK.props.concat([{ type: "db", at: "handA" }]), focus: DESK.focus, base: DESKBASE,
    k: [K({ aA: { to: [34, 77], b: -1, w: -28 } }, 900, 300, "Pollice in alto, polso basso"), K({ aA: { to: [34, 77], b: -1, w: 28 } }, 1200, 400, "Alza il pollice verso il soffitto"), K({ aA: { to: [34, 77], b: -1, w: -28 } }, 2600, 300, "Scendi lentamente")],
    steps: ["Avambraccio sul tavolo, pollice verso l'alto, peso leggero in mano.", "Solleva la mano verso il soffitto muovendo solo il polso.", "Scendi lentamente in 3 secondi."],
    tips: ["Inizia senza peso se il dolore è forte."],
    avoid: ["Non ruotare l'avambraccio."],
  });

  X("stretch-estensori", {
    name: "Allungamento degli estensori del polso", target: "Estensori dell'avambraccio", level: "Facile", dose: "3 × 30 s",
    view: "side", hi: ["forearmExtA"], base: Object.assign({}, STAND, { aA: { s: 88, e: 90, w: 0 } , aB: { to: ["handA", 1, 3], b: -1 } }),
    k: [K({ aA: { s: 88, e: 90, w: 0 } }, 900, 300, "Braccio teso in avanti, palmo in giù"), K({ aA: { s: 88, e: 90, w: -78 } }, 1500, 2200, "Piega il polso in giù aiutandoti con l'altra mano")],
    steps: ["Braccio teso in avanti, palmo verso il basso.", "Con l'altra mano piega delicatamente il polso verso il basso.", "Tieni 30 secondi sentendo allungare il dorso dell'avambraccio."],
    tips: ["Chiudere la mano a pugno aumenta l'allungamento."],
    avoid: ["Non piegare il gomito."],
  });

  X("stretch-flessori", {
    name: "Allungamento dei flessori del polso", target: "Flessori dell'avambraccio, nervo mediano", level: "Facile", dose: "3 × 30 s",
    view: "side", hi: ["forearmA"], base: Object.assign({}, STAND, { aA: { s: 88, e: 90, w: 0 }, aB: { to: ["handA", -1, 3], b: -1 } }),
    k: [K({ aA: { s: 88, e: 90, w: 0 } }, 900, 300, "Braccio teso in avanti, palmo in avanti"), K({ aA: { s: 88, e: 90, w: 72 } }, 1500, 2200, "Tira indietro le dita con l'altra mano")],
    steps: ["Braccio teso in avanti, palmo rivolto in avanti come per dire «stop».", "Con l'altra mano tira delicatamente indietro le dita.", "Tieni 30 secondi."],
    tips: ["Se formicolano le dita, riduci l'intensità."],
    avoid: ["Non tirare fino al dolore."],
  });

  X("glide-mediano", {
    name: "Scivolamento del nervo mediano", target: "Mobilità del nervo mediano", level: "Facile", dose: "2 × 10, lento",
    view: "front", hi: ["nerveArmA"], base: Object.assign({}, FSTAND, { aA: { s: -90, e: -170, w: 0 }, aB: { s: 6, e: 6 } }),
    k: [K({ aA: { s: -90, e: -170, w: 0 }, n: -10 }, 1000, 300, "Braccio di lato, gomito piegato, testa verso il braccio"), K({ aA: { s: -90, e: -92, w: -72 }, n: 14 }, 1800, 500, "Distendi gomito e polso mentre inclini la testa dall'altra parte"), K({ aA: { s: -90, e: -170, w: 0 }, n: -10 }, 1600, 300, "Torna: il nervo «scivola», non si tira")],
    steps: ["Braccio aperto di lato all'altezza della spalla, gomito piegato.", "Distendi gomito e polso (palmo in avanti, dita in su) e insieme inclina la testa dalla parte opposta.", "Torna piegando gomito e polso mentre la testa va verso il braccio.", "Movimento fluido, mai fino al formicolio forte."],
    tips: ["È un «filo interdentale» per il nervo: niente tenute, solo movimento."],
    avoid: ["Non tenere la posizione di massima tensione."],
  });

  X("glide-ulnare", {
    name: "Scivolamento del nervo ulnare", target: "Mobilità del nervo ulnare", level: "Facile", dose: "2 × 10, lento",
    view: "front", hi: ["nerveArmA"], base: Object.assign({}, FSTAND, { aA: { s: -90, e: -90, w: 0 }, aB: { s: 6, e: 6 } }),
    k: [K({ aA: { s: -90, e: -90, w: 0 } }, 1000, 300, "Braccio aperto e disteso"), K({ aA: { s: -98, e: -212, w: -60 } }, 1800, 500, "Piega il gomito e porta la mano verso il viso come una maschera"), K({ aA: { s: -90, e: -90, w: 0 } }, 1600, 300, "Torna lentamente")],
    steps: ["Braccio aperto di lato, disteso, palmo verso il basso.", "Piega gomito e polso portando la mano verso il viso, come una maschera intorno all'occhio.", "Torna distendendo. Movimento lento e fluido."],
    tips: ["Se compare formicolio, riduci l'ampiezza."],
    avoid: ["Non fare tenute nella posizione di massimo allungamento."],
  });

  /* ---------------- CORE E SCHIENA ---------------- */
  const SUP_LIMBS = { lA: { h: 180, k: 90, f: 90 }, lB: { h: 182, k: 92, f: 92 }, aA: { s: 180, e: 180 }, aB: { s: 182, e: 182 } };
  X("dead-bug", {
    name: "Dead bug", target: "Addominali profondi, controllo del tronco", level: "Medio", dose: "3 × 8 per lato",
    view: "side", hi: ["abs"], props: [{ type: "mat", x0: -80, x1: 90 }], base: Object.assign({}, SUPINE, SUP_LIMBS),
    k: [K({}, 900, 300, "Braccia al soffitto, anche e ginocchia a 90°"), K({ aA: { s: 255, e: 255 }, lB: { h: 100, k: 100, f: 100 } }, 1700, 400, "Allunga un braccio dietro e la gamba opposta in avanti"), K(SUP_LIMBS, 1300, 300, "Torna al centro"), K({ aB: { s: 255, e: 255 }, lA: { h: 100, k: 100, f: 100 } }, 1700, 400, "Cambia lato"), K(SUP_LIMBS, 1300, 300, "Torna al centro")],
    steps: ["Sdraiato sulla schiena, braccia verso il soffitto, anche e ginocchia piegate a 90°.", "Schiaccia leggermente la zona lombare a terra.", "Allunga un braccio dietro la testa e la gamba opposta in avanti, senza toccare terra.", "Torna e cambia lato espirando."],
    tips: ["Più è lento, più è efficace."],
    avoid: ["Non staccare la schiena dal pavimento.", "Non trattenere il respiro."],
  });

  X("bird-dog", {
    name: "Bird dog", target: "Muscoli lombari, glutei, addominali", level: "Facile", dose: "3 × 8 per lato",
    view: "side", hi: ["lumbar", "gluteB", "abs"], props: [{ type: "mat", x0: -100, x1: 110 }], base: QUAD,
    k: [K({}, 900, 300, "A quattro zampe, schiena neutra"), K({ aA: { to: [100, 60], b: 1, wa: 95 }, lB: { h: -86, k: -88, f: -150 } }, 1600, 1500, "Allunga un braccio avanti e la gamba opposta indietro"), K({ aA: { to: [48, 3], b: 1, wa: 90 }, lB: { h: 2, k: -88, f: -170 } }, 1400, 300, "Torna senza far ruotare il bacino")],
    steps: ["A quattro zampe, mani sotto le spalle e ginocchia sotto le anche.", "Allunga un braccio in avanti e la gamba opposta indietro, in linea con la schiena.", "Tieni 3 secondi senza far ruotare il bacino.", "Torna e cambia lato."],
    tips: ["Immagina un bicchiere d'acqua sulla zona lombare da non rovesciare."],
    avoid: ["Non alzare la gamba più in alto del bacino.", "Non inarcare la schiena."],
  });

  X("plank", {
    name: "Plank sugli avambracci", target: "Addominali, glutei, spalle", level: "Medio", dose: "3 × 20–40 s",
    view: "side", hi: ["abs", "obl"], props: [{ type: "mat", x0: -100, x1: 100 }],
    base: { p: [3, 16], t: 71, h: 0, lA: { h: -90, k: -90, f: -40 }, lB: { h: -89, k: -89, f: -40 }, aA: { s: 0, e: 90, wa: 90 }, aB: { s: 2, e: 92, wa: 92 } },
    k: [K({}, 900, 400, "Avambracci a terra, gomiti sotto le spalle"), K({ p: [4.3, 26.4], t: 83, lA: { h: -83, k: -83, f: -40 }, lB: { h: -82, k: -82, f: -40 } }, 1300, 3000, "Solleva il bacino: corpo in linea, respira"), K({ p: [3, 16], t: 71, lA: { h: -90, k: -90, f: -40 }, lB: { h: -89, k: -89, f: -40 } }, 1200, 400, "Scendi e riposa")],
    steps: ["Avambracci a terra, gomiti sotto le spalle, punte dei piedi a terra.", "Solleva il bacino finché il corpo forma una linea dalla testa ai talloni.", "Stringi glutei e addominali e respira normalmente.", "Versione facile: ginocchia a terra."],
    tips: ["Meglio 3 × 20 secondi perfetti che 1 minuto con la schiena che cede."],
    avoid: ["Non far cadere il bacino.", "Non alzare troppo i glutei."],
  });

  X("plank-laterale", {
    name: "Plank laterale", target: "Obliqui, quadrato dei lombi, gluteo medio", level: "Medio", dose: "3 × 15–30 s per lato",
    view: "front", hi: ["obl", "abductorB"], props: [{ type: "mat", x0: -100, x1: 80 }],
    base: { p: [8, 22], t: 62, lA: { to: [-79, 16], b: 1, f: 0 }, lB: { to: [-80, 7], b: 1, f: 0 }, aB: { s: 0, e: 0 }, aA: { s: 150, e: 150 }, sc: { farmB: .18, handB: .3 } },
    k: [K({}, 900, 400, "Sul fianco, gomito sotto la spalla"), K({ p: [0, 38.5], t: 75, aA: { s: 180, e: 180 } }, 1300, 2600, "Solleva il bacino: corpo in linea"), K({ p: [8, 22], t: 62, aA: { s: 150, e: 150 } }, 1200, 400, "Scendi")],
    steps: ["Sdraiato su un fianco, gomito sotto la spalla, gambe una sull'altra.", "Solleva il bacino finché il corpo è dritto.", "Tieni respirando, poi scendi e cambia lato.", "Versione facile: ginocchia piegate a terra."],
    tips: ["Spingi il pavimento con l'avambraccio per non «sprofondare» nella spalla."],
    avoid: ["Non ruotare il busto in avanti."],
  });

  X("ponte", {
    name: "Ponte per i glutei", target: "Glutei, ischiocrurali, zona lombare", level: "Facile", dose: "3 × 12",
    view: "side", hi: ["glute", "hamA"], props: [{ type: "mat", x0: -80, x1: 60 }],
    base: Object.assign({}, SUPINE, { lA: { to: [30, 7], b: 1, f: 0 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { s: 90, e: 90, wa: 90 }, aB: { s: 91, e: 91, wa: 91 } }),
    k: [K({}, 900, 300, "Supino, ginocchia piegate, piedi a terra"), K({ p: [0, 38], t: -118, h: 28 }, 1400, 1200, "Spingi sui talloni e solleva il bacino"), K({ p: [0, 10], t: -90, h: 0 }, 1600, 300, "Scendi una vertebra alla volta")],
    steps: ["Sdraiato sulla schiena, ginocchia piegate, piedi a terra alla larghezza delle anche.", "Spingi sui talloni e solleva il bacino stringendo i glutei.", "Tieni 2 secondi in alto con spalle, anche e ginocchia in linea.", "Scendi lentamente."],
    tips: ["Se senti i crampi dietro la coscia, avvicina i piedi ai glutei."],
    avoid: ["Non inarcare la zona lombare in alto: la spinta viene dai glutei."],
  });

  X("ponte-mono", {
    name: "Ponte su una gamba", target: "Gluteo grande e medio, ischiocrurali", level: "Medio", dose: "3 × 8 per lato",
    view: "side", hi: ["glute", "hamB"], props: [{ type: "mat", x0: -80, x1: 90 }],
    base: Object.assign({}, SUPINE, { lA: { to: [60, 70], b: 1, f: 135 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { s: 90, e: 90, wa: 90 }, aB: { s: 91, e: 91, wa: 91 } }),
    k: [K({}, 900, 300, "Una gamba distesa verso l'alto"), K({ p: [0, 38], t: -118, h: 28, lA: { to: [75, 78], b: 1, f: 118 } }, 1400, 1200, "Solleva il bacino spingendo con il tallone a terra"), K({ p: [0, 10], t: -90, h: 0, lA: { to: [60, 70], b: 1, f: 135 } }, 1600, 300, "Scendi lentamente")],
    steps: ["Come il ponte, ma con una gamba distesa.", "Spingi con il tallone a terra e solleva il bacino.", "Il bacino resta orizzontale: non deve inclinarsi.", "Scendi lentamente e ripeti, poi cambia lato."],
    tips: ["Metti le mani sulle anche per sentire se il bacino resta dritto."],
    avoid: ["Non ruotare il bacino verso la gamba sollevata."],
  });

  X("mckenzie", {
    name: "Estensione da prono (McKenzie)", target: "Mobilità lombare in estensione", level: "Facile", dose: "2 × 10",
    view: "side", hi: ["lumbar"], props: [{ type: "mat", x0: -90, x1: 80 }],
    base: { p: [0, 10], t: 90, h: 0, lA: { h: -90, k: -90, f: -175 }, lB: { h: -89, k: -89, f: -175 }, aA: { to: [38, 3], b: -1, wa: 90 }, aB: { to: [36, 3], b: -1, wa: 90 } },
    k: [K({}, 900, 500, "Prono, mani sotto le spalle"), K({ t: 40, h: -22 }, 1600, 1200, "Spingi con le braccia: il bacino resta a terra"), K({ t: 90, h: 0 }, 1500, 400, "Torna giù rilassato")],
    steps: ["Sdraiato a pancia in giù, mani a terra vicino alle spalle.", "Spingi con le braccia sollevando il busto, lasciando il bacino appoggiato.", "Rilassa glutei e schiena: lavorano solo le braccia.", "Torna giù lentamente."],
    tips: ["Se il dolore alla gamba si «centralizza» verso la schiena è un buon segno."],
    avoid: ["Fermati se il dolore scende più in basso nella gamba."],
  });

  X("ginocchia-petto", {
    name: "Ginocchia al petto", target: "Zona lombare, glutei", level: "Facile", dose: "3 × 30 s",
    view: "side", hi: ["lumbar"], props: [{ type: "mat", x0: -80, x1: 60 }],
    base: Object.assign({}, SUPINE, { lA: { to: [30, 7], b: 1, f: 0 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { to: [8, 7], b: -1 }, aB: { to: [6, 7], b: -1 } }),
    k: [K({}, 900, 400, "Supino, ginocchia piegate"), K({ lA: { h: 205, k: 118, f: 118 }, lB: { h: 203, k: 116, f: 116 }, aA: { to: ["kneeA", 1, -3], b: 1 }, aB: { to: ["kneeB", 1, -3], b: 1 } }, 1700, 2600, "Porta le ginocchia al petto e abbracciale"), K({ lA: { to: [30, 7], b: 1, f: 0 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { to: [8, 7], b: -1 }, aB: { to: [6, 7], b: -1 } }, 1500, 300, "Torna lentamente")],
    steps: ["Sdraiato sulla schiena con le ginocchia piegate.", "Porta una o entrambe le ginocchia verso il petto e abbracciale.", "Respira lento e lascia rilassare la zona lombare.", "Puoi dondolare dolcemente."],
    tips: ["Se fa male alle ginocchia, prendi le gambe da dietro le cosce."],
    avoid: ["Non tirare la testa in avanti."],
  });

  X("respirazione", {
    name: "Respirazione diaframmatica", target: "Diaframma, addominali profondi, drenaggio", level: "Facile", dose: "5 minuti",
    view: "side", hi: ["abs"], props: [{ type: "mat", x0: -80, x1: 60 }],
    base: Object.assign({}, SUPINE, { lA: { to: [28, 7], b: 1, f: 0 }, lB: { to: [26, 7], b: 1, f: 0 }, aA: { to: ["belly", 0, 2], b: 1 }, aB: { to: ["belly", -4, 2], b: 1 }, bel: 0 }),
    k: [K({ bel: 0 }, 3600, 300, "Espira dalla bocca: la pancia scende"), K({ bel: 6 }, 3200, 500, "Inspira dal naso: la pancia sale, il petto resta fermo")],
    steps: ["Sdraiato con le ginocchia piegate, una mano sulla pancia.", "Inspira dal naso in 4 secondi gonfiando la pancia.", "Espira dalla bocca in 6 secondi lasciando scendere la pancia.", "Continua per 5 minuti."],
    tips: ["Ottima prima di dormire o nei momenti di stress.", "Muove la linfa nel torace e nell'addome."],
    avoid: ["Non alzare spalle e petto inspirando."],
  });

  /* ---------------- ANCA E GLUTEI ---------------- */
  X("stretch-piriforme", {
    name: "Allungamento del piriforme da seduto", target: "Piriforme, gluteo", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["gluteA"], props: [{ type: "chair", x: -42, w: 42, h: 41 }],
    base: { p: [-22, 49], t: -2, lB: { h: 90, k: 0, f: 0 }, lA: { to: ["kneeB", -2, 4], b: 1, f: 80 }, sc: { thighA: .74, shinA: .5 }, aA: { to: ["kneeA", 0, 3], b: -1 }, aB: { to: ["kneeB", 0, 2], b: -1 } },
    k: [K({}, 900, 400, "Caviglia appoggiata sul ginocchio opposto"), K({ t: 34, h: 6 }, 1800, 2400, "Schiena dritta, piegati in avanti dalle anche")],
    steps: ["Seduto, appoggia la caviglia sopra il ginocchio opposto (forma un «4»).", "Tieni la schiena dritta e piegati in avanti dalle anche.", "Senti allungare il gluteo; tieni 30 secondi e cambia lato."],
    tips: ["Spingi delicatamente il ginocchio verso il basso per aumentare."],
    avoid: ["Non arrotondare la schiena.", "Se il ginocchio fa male, scegli un'altra posizione."],
  });

  X("stretch-flessori-anca", {
    name: "Allungamento dei flessori dell'anca", target: "Ileopsoas, retto femorale", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["hipflexB"], props: [{ type: "mat", x0: -70, x1: 70 }],
    base: { p: [0, 48], t: 0, lA: { to: [40, 7], b: 1, f: 0 }, lB: { to: [-55, 6], b: 1, f: -165 }, aA: { to: ["kneeA", -2, 4], b: -1 }, aB: { s: 0, e: 0 } },
    k: [K({}, 900, 400, "In ginocchio, un piede avanti"), K({ p: [10, 45], t: -6, aB: { s: 170, e: 175 } }, 1800, 2400, "Stringi il gluteo dietro, porta il bacino avanti e allunga il braccio in alto"), K({ p: [0, 48], t: 0, aB: { s: 0, e: 0 } }, 1400, 300, "Torna")],
    steps: ["In ginocchio su un tappetino, un piede avanti con il ginocchio a 90°.", "Stringi il gluteo della gamba dietro e porta il bacino un po' avanti.", "Alza il braccio dello stesso lato della gamba dietro per allungare di più.", "Tieni 30 secondi e cambia lato."],
    tips: ["Il bacino va «in dentro» (coda tra le gambe), non serve andare lontano."],
    avoid: ["Non inarcare la schiena."],
  });

  X("abduzione-fianco", {
    name: "Abduzione dell'anca sul fianco", target: "Gluteo medio", level: "Facile", dose: "3 × 12 per lato",
    view: "front", hi: ["abductorA"], props: [{ type: "mat", x0: -100, x1: 80 }],
    base: { p: [0, 24], t: 95, h: -6, lA: { h: -78, k: -78, f: -78 }, lB: { h: -84, k: -84, f: -84 }, aB: { s: 90, e: 150 }, aA: { to: [40, 4], b: -1 } },
    k: [K({}, 900, 300, "Sul fianco, gambe distese una sull'altra"), K({ lA: { h: -112, k: -112, f: -112 } }, 1200, 800, "Alza la gamba di sopra con la punta un po' in giù"), K({ lA: { h: -78, k: -78, f: -78 } }, 2000, 300, "Scendi lentamente")],
    steps: ["Sdraiato sul fianco, gambe distese in linea con il corpo.", "Alza la gamba di sopra di 30–40 cm con il tallone che guida e la punta leggermente in giù.", "Scendi lentamente in 2 secondi."],
    tips: ["Se senti lavorare il davanti della coscia, porta la gamba un po' più indietro."],
    avoid: ["Non ruotare il bacino all'indietro.", "Non alzare troppo: conta la qualità."],
  });

  X("affondo-laterale", {
    name: "Affondo laterale", target: "Adduttori, glutei, quadricipite", level: "Medio", dose: "3 × 8 per lato",
    view: "front", hi: ["adductorB", "gluteA"],
    base: { p: [0, 84], t: 0, lA: { to: [-40, 7], b: -1 }, lB: { to: [40, 7], b: 1 }, aA: { to: ["chest", -1, -2], b: 1 }, aB: { to: ["chest", 1, -2], b: -1 } },
    k: [K({}, 900, 300, "Gambe larghe, piedi paralleli"), K({ p: [-22, 62], t: -6 }, 1600, 600, "Piega un ginocchio e porta indietro il bacino; l'altra gamba resta tesa"), K({ p: [0, 84], t: 0 }, 1300, 300, "Spingi e torna al centro")],
    steps: ["Gambe larghe il doppio delle spalle, piedi paralleli.", "Sposta il peso su una gamba piegando il ginocchio e portando indietro il bacino.", "L'altra gamba resta tesa: senti allungare l'interno coscia.", "Spingi e torna al centro, poi cambia lato."],
    tips: ["Il ginocchio piegato va nella direzione delle punte."],
    avoid: ["Non far cadere il ginocchio verso l'interno."],
  });

  /* ---------------- GAMBA ---------------- */
  X("squat", {
    name: "Squat", target: "Quadricipite, glutei", level: "Facile", dose: "3 × 10–12",
    view: "side", hi: ["quad", "glute"],
    base: { p: [0, 91], t: 4, lA: { to: [2, 7], b: 1 }, lB: { to: [-1, 7], b: 1 }, aA: { s: 10, e: 15 }, aB: { s: 8, e: 13 } },
    k: [K({}, 900, 300, "In piedi, piedi alla larghezza delle spalle"), K({ p: [-24, 52], t: 40, aA: { s: 80, e: 85 }, aB: { s: 78, e: 83 } }, 1800, 300, "Scendi portando indietro il bacino, come per sederti"), K({ p: [0, 91], t: 4, aA: { s: 10, e: 15 }, aB: { s: 8, e: 13 } }, 1400, 300, "Spingi sui talloni e risali")],
    steps: ["Piedi alla larghezza delle spalle, punte leggermente aperte.", "Porta indietro il bacino e piega le ginocchia come per sederti.", "Scendi finché la schiena resta dritta (anche solo a metà).", "Spingi sui piedi e risali."],
    tips: ["Usa una sedia dietro di te come riferimento all'inizio."],
    avoid: ["Non far entrare le ginocchia verso l'interno.", "Non alzare i talloni."],
  });

  X("affondo", {
    name: "Affondo indietro", target: "Quadricipite, gluteo", level: "Medio", dose: "3 × 8 per lato",
    view: "side", hi: ["quadA", "gluteA"],
    base: { p: [-4, 86], t: 0, lA: { to: [24, 7], b: 1, f: 0 }, lB: { to: [-38, 15.5], b: 1, f: -35 }, aA: { to: ["hip", 3, 13], b: -1 }, aB: { to: ["hip", 1, 13], b: -1 } },
    k: [K({}, 900, 300, "Passo lungo, peso sulla gamba davanti"), K({ p: [-4, 50], t: 2 }, 1600, 300, "Scendi in verticale: il ginocchio dietro va verso terra"), K({ p: [-4, 86], t: 0 }, 1300, 300, "Spingi con il piede davanti e risali")],
    steps: ["Fai un passo lungo indietro.", "Scendi in verticale finché il ginocchio dietro sfiora il pavimento.", "Il ginocchio davanti resta sopra la caviglia.", "Spingi con il piede davanti e torna."],
    tips: ["Tieni il busto dritto e lo sguardo avanti."],
    avoid: ["Non far crollare il ginocchio davanti verso l'interno."],
  });

  X("step-down", {
    name: "Discesa dal gradino", target: "Quadricipite, gluteo medio, controllo del ginocchio", level: "Medio", dose: "3 × 10 per lato",
    view: "side", hi: ["quadA", "gluteA"], props: [{ type: "step", x: -40, w: 62, h: 20 }],
    base: { p: [0, 118], t: 4, lA: { to: [0, 27], b: 1, f: 0 }, lB: { to: [22, 40], b: 1, f: 0 }, aA: { s: 10, e: 12 }, aB: { s: 8, e: 10 } },
    k: [K({}, 900, 300, "In piedi sul gradino"), K({ p: [-6, 86], t: 25, lB: { to: [27, 9], b: 1, f: 12 }, aA: { s: 42, e: 52 }, aB: { s: 40, e: 50 } }, 2400, 200, "Scendi lentamente fino a sfiorare terra con il tallone"), K({ p: [0, 118], t: 4, lB: { to: [22, 40], b: 1, f: 0 }, aA: { s: 10, e: 12 }, aB: { s: 8, e: 10 } }, 1300, 300, "Risali spingendo con la gamba sul gradino")],
    steps: ["In piedi su un gradino basso con una gamba, l'altra nel vuoto davanti.", "Piega lentamente il ginocchio d'appoggio fino a sfiorare terra con il tallone.", "Il ginocchio resta in linea con il secondo dito del piede.", "Risali spingendo con la gamba sul gradino."],
    tips: ["Usa uno specchio per controllare il ginocchio."],
    avoid: ["Non lasciar cadere il bacino dal lato della gamba libera."],
  });

  X("wall-sit", {
    name: "Sedia al muro (isometria)", target: "Quadricipite, tendine rotuleo", level: "Medio", dose: "5 × 30–45 s",
    view: "side", hi: ["quad"], props: [{ type: "wall", x: -34 }],
    base: { p: [-14, 76], t: -3, lA: { to: [30, 7], b: 1, f: 0 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { to: ["chest", 6, -1], b: -1 }, aB: { to: ["chest", 4, 1], b: -1 } },
    k: [K({}, 900, 400, "Schiena al muro, piedi avanti"), K({ p: [-14, 47], t: 0 }, 1600, 4000, "Scivola giù fino a ginocchia quasi a 90° e tieni"), K({ p: [-14, 76], t: -3 }, 1300, 300, "Risali")],
    steps: ["Schiena contro il muro, piedi 40–50 cm avanti.", "Scivola giù finché le ginocchia sono piegate a 60–90° (meno se fa male).", "Tieni 30–45 secondi respirando, poi risali e riposa 1 minuto."],
    tips: ["Per il tendine rotuleo le isometrie riducono il dolore anche per alcune ore."],
    avoid: ["Non superare un dolore di 3–4/10 durante la tenuta."],
  });

  X("estensione-ginocchio", {
    name: "Estensione del ginocchio da seduto", target: "Quadricipite, vasto mediale", level: "Facile", dose: "3 × 15 per lato",
    view: "side", hi: ["quadA"], props: [{ type: "chair", x: -34, w: 52, h: 41 }],
    base: Object.assign({}, SEAT, { aA: { to: [-4, 43], b: -1 }, aB: { to: [-8, 43], b: -1 } }),
    k: [K({ lA: { h: 90, k: 0, f: 0 } }, 900, 300, "Seduto, schiena appoggiata"), K({ lA: { h: 93, k: 88, f: 96 } }, 1300, 1200, "Distendi il ginocchio, punta del piede verso di te"), K({ lA: { h: 90, k: 0, f: 0 } }, 2200, 300, "Scendi lentamente")],
    steps: ["Seduto su una sedia, schiena dritta.", "Distendi completamente un ginocchio portando la punta verso di te.", "Stringi la coscia per 2 secondi.", "Scendi lentamente. Aggiungi una cavigliera quando è facile."],
    tips: ["Senti lavorare la parte interna sopra il ginocchio: è il vasto mediale."],
    avoid: ["Non dondolare la gamba."],
  });

  X("stretch-quadricipite", {
    name: "Allungamento del quadricipite", target: "Quadricipite, flessori dell'anca", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["quadA"], props: [{ type: "wall", x: 36 }],
    base: { p: [0, 92], t: 0, lB: { to: [0, 7], b: 1 }, lA: { h: 0, k: 0, f: 0 }, aA: { s: 4, e: 8 }, aB: { to: [34, 128], b: -1, wa: 180 } },
    k: [K({}, 900, 300, "In piedi, una mano al muro"), K({ lA: { h: -8, k: 166, f: 175 }, aA: { to: ["ankleA", -1, 1], b: -1 } }, 1700, 2400, "Prendi la caviglia e porta il tallone al gluteo"), K({ lA: { h: 0, k: 0, f: 0 }, aA: { s: 4, e: 8 } }, 1400, 300, "Lascia andare lentamente")],
    steps: ["In piedi vicino al muro per l'equilibrio.", "Piega un ginocchio e prendi la caviglia con la mano.", "Porta il tallone verso il gluteo, ginocchia vicine.", "Spingi leggermente il bacino in avanti e tieni 30 secondi."],
    tips: ["Se non arrivi alla caviglia usa un asciugamano."],
    avoid: ["Non inarcare la schiena.", "Non portare il ginocchio in fuori."],
  });

  X("stretch-ischio", {
    name: "Allungamento degli ischiocrurali con asciugamano", target: "Ischiocrurali, polpaccio", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["hamA"], props: [{ type: "mat", x0: -80, x1: 100 }, { type: "strap", from: "handA", to: "soleA" }],
    base: Object.assign({}, SUPINE, { lB: { h: 90, k: 90, f: 90 }, lA: { h: 120, k: 120, f: 120 }, aA: { to: [-6, 46], b: 1 }, aB: { to: [-8, 45], b: 1 } }),
    k: [K({}, 900, 400, "Supino, asciugamano sotto il piede"), K({ lA: { h: 158, k: 158, f: 150 } }, 1800, 2400, "Porta la gamba tesa verso l'alto finché senti tirare"), K({ lA: { h: 120, k: 120, f: 120 } }, 1300, 300, "Rilascia")],
    steps: ["Sdraiato sulla schiena, passa un asciugamano sotto la pianta di un piede.", "Tieni la gamba distesa e portala verso l'alto tirando l'asciugamano.", "Fermati quando senti tirare dietro la coscia; tieni 30 secondi.", "L'altra gamba resta distesa a terra."],
    tips: ["Portare la punta verso di te allunga anche il polpaccio."],
    avoid: ["Non staccare il bacino da terra.", "Non piegare la gamba a terra."],
  });

  X("rdl-mono", {
    name: "Stacco rumeno su una gamba", target: "Ischiocrurali, gluteo, equilibrio", level: "Medio", dose: "3 × 8 per lato",
    view: "side", hi: ["hamA", "gluteA"],
    base: { p: [0, 91], t: 2, lA: { to: [2, 7], b: 1, f: 0 }, lB: { h: 0, k: 0, f: 0 }, aA: { s: 0, e: 0 }, aB: { s: 0, e: 0 } },
    k: [K({}, 900, 300, "In piedi su una gamba, ginocchio morbido"), K({ p: [-6, 86], t: 78, h: 6, lB: { h: -78, k: -78, f: -78 }, aA: { s: 0, e: 0 }, aB: { s: 0, e: 0 } }, 2000, 500, "Porta il busto avanti e la gamba libera indietro, schiena dritta"), K({ p: [0, 91], t: 2, h: 0, lB: { h: 0, k: 0, f: 0 } }, 1500, 300, "Torna su stringendo il gluteo")],
    steps: ["In piedi su una gamba con il ginocchio leggermente piegato.", "Piegati in avanti dalle anche mentre la gamba libera va indietro in linea con il busto.", "Scendi finché la schiena resta dritta e senti tirare dietro la coscia.", "Torna su stringendo il gluteo."],
    tips: ["Tieni un appoggio vicino all'inizio; poi aggiungi un manubrio."],
    avoid: ["Non arrotondare la schiena.", "Non ruotare il bacino verso l'alto."],
  });

  X("glide-sciatico", {
    name: "Scivolamento del nervo sciatico", target: "Mobilità del nervo sciatico", level: "Facile", dose: "2 × 10, lento",
    view: "side", hi: ["nerveLegA"], props: [{ type: "chair", x: -34, w: 44, h: 41 }],
    base: Object.assign({}, SEAT, { t: -2, t2: 18, aA: { to: [-6, 43], b: -1 }, aB: { to: [-10, 43], b: -1 } }),
    k: [K({ lA: { h: 90, k: 4, f: 0 }, n: 18, h: 26 }, 1200, 300, "Ginocchio piegato e testa verso il basso"), K({ lA: { h: 93, k: 80, f: 92 }, n: -8, h: -22 }, 1800, 400, "Distendi il ginocchio mentre guardi in alto"), K({ lA: { h: 90, k: 4, f: 0 }, n: 18, h: 26 }, 1600, 300, "Torna: piega il ginocchio mentre guardi in basso")],
    steps: ["Seduto sul bordo della sedia, schiena leggermente curva.", "Distendi il ginocchio portando la punta del piede verso di te e insieme guarda in alto.", "Torna piegando il ginocchio e abbassando la testa.", "Il nervo scorre senza essere messo in tensione."],
    tips: ["Movimento fluido, come un'altalena."],
    avoid: ["Non tenere la posizione di massima tensione.", "Fermati se il formicolio aumenta e resta."],
  });

  X("calf-raise", {
    name: "Sollevamento sui talloni", target: "Polpaccio (gastrocnemio e soleo)", level: "Facile", dose: "3 × 15",
    view: "side", hi: ["calf"], props: [{ type: "wall", x: 42 }],
    base: { p: [0, 92], t: 2, lA: { to: [0, 7], b: 1, f: 0 }, lB: { to: [-2, 7], b: 1, f: 0 }, aA: { to: [40, 120], b: -1, wa: 180 }, aB: { to: [39, 118], b: -1, wa: 180 } },
    k: [K({}, 900, 300, "In piedi, mani al muro"), K({ p: [7, 100.5], lA: { to: [7.1, 15.5], b: 1, f: -35 }, lB: { to: [5.1, 15.5], b: 1, f: -35 } }, 1100, 700, "Sali in punta di piedi"), K({ p: [0, 92], lA: { to: [0, 7], b: 1, f: 0 }, lB: { to: [-2, 7], b: 1, f: 0 } }, 2000, 300, "Scendi lentamente")],
    steps: ["In piedi, mani appoggiate al muro.", "Sali sulle punte il più in alto possibile.", "Tieni 1 secondo e scendi lentamente in 2 secondi.", "Quando è facile, fallo su una gamba sola."],
    tips: ["Con le ginocchia piegate lavori di più il soleo."],
    avoid: ["Non far cadere le caviglie verso l'esterno."],
  });

  X("eccentrico-polpaccio", {
    name: "Discesa eccentrica dal gradino", target: "Tendine d'Achille, polpaccio", level: "Medio", dose: "3 × 15, ogni giorno",
    view: "side", hi: ["calfA"], props: [{ type: "step", x: 4, w: 56, h: 18 }, { type: "wall", x: 64 }],
    base: { p: [10, 118], t: 2, lA: { to: [10.1, 33.5], b: 1, f: -35 }, lB: { h: 10, k: -70, f: -60 }, aA: { to: [57, 140], b: -1, wa: 180 }, aB: { to: [56, 138], b: -1, wa: 180 } },
    k: [K({}, 900, 600, "In punta sul bordo del gradino"), K({ p: [1.6, 102], lA: { to: [1.6, 17.2], b: 1, f: 25 } }, 3400, 600, "Scendi lentamente su un piede: il tallone va sotto il gradino"), K({ p: [10, 118], lA: { to: [10.1, 33.5], b: 1, f: -35 } }, 1200, 300, "Risali aiutandoti con l'altro piede")],
    steps: ["Avampiede sul bordo di un gradino, talloni nel vuoto, mani al muro.", "Sali in punta con entrambi i piedi.", "Togli il piede sano e scendi lentamente su un piede solo, in 3–4 secondi, sotto il livello del gradino.", "Risali con due piedi e ripeti."],
    tips: ["Fallo anche con il ginocchio leggermente piegato.", "Un fastidio fino a 3–4/10 è accettabile se il giorno dopo non peggiora."],
    avoid: ["Se il dolore è proprio sul tallone (inserzionale), non scendere sotto il livello del gradino."],
  });

  X("stretch-polpaccio", {
    name: "Allungamento del polpaccio al muro", target: "Gastrocnemio, soleo, fascia plantare", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["calfB"], props: [{ type: "wall", x: 62 }],
    base: { p: [0, 82], t: 5, lA: { to: [25, 7], b: 1, f: 0 }, lB: { to: [-35, 7], b: 1, f: 0 }, aA: { to: [59, 128], b: -1, wa: 180 }, aB: { to: [58, 126], b: -1, wa: 180 } },
    k: [K({}, 900, 300, "Mani al muro, una gamba indietro"), K({ p: [8, 76], t: 15 }, 1600, 2600, "Porta il bacino verso il muro: tallone dietro a terra"), K({ p: [0, 82], t: 5 }, 1300, 300, "Torna")],
    steps: ["Mani al muro, una gamba avanti piegata e una dietro tesa.", "Tieni il tallone dietro ben a terra e la punta dritta.", "Porta il bacino verso il muro finché senti tirare il polpaccio.", "Tieni 30 secondi; poi piega anche il ginocchio dietro per allungare il soleo."],
    tips: ["Fallo dopo ogni corsa."],
    avoid: ["Non far ruotare il piede dietro verso l'esterno."],
  });

  X("tibiale-raise", {
    name: "Sollevamento delle punte", target: "Tibiale anteriore", level: "Facile", dose: "3 × 20",
    view: "side", hi: ["tib"], props: [{ type: "wall", x: -36 }],
    base: { p: [-14, 90], t: -8, lA: { to: [0, 7], b: 1, f: 0 }, lB: { to: [-2, 7], b: 1, f: 0 }, aA: { s: 4, e: 6 }, aB: { s: 2, e: 4 } },
    k: [K({}, 800, 200, "Schiena al muro, talloni a 20–30 cm"), K({ lA: { to: [-4.2, 8.6], b: 1, f: 30 }, lB: { to: [-6.2, 8.6], b: 1, f: 30 } }, 900, 500, "Alza le punte dei piedi verso le tibie"), K({ lA: { to: [0, 7], b: 1, f: 0 }, lB: { to: [-2, 7], b: 1, f: 0 } }, 1400, 200, "Scendi lentamente")],
    steps: ["Appoggia schiena e glutei al muro con i talloni a 20–30 cm.", "Alza le punte dei piedi il più possibile restando sui talloni.", "Scendi lentamente senza far sbattere le punte."],
    tips: ["Più i piedi sono lontani dal muro, più è difficile."],
    avoid: ["Non piegare le ginocchia."],
  });

  X("equilibrio", {
    name: "Equilibrio su una gamba", target: "Caviglia, gluteo medio, propriocezione", level: "Facile", dose: "3 × 30 s per lato",
    view: "front", hi: ["calfA", "gluteA"],
    base: { p: [0, 92], t: 0, lA: { h: 0, k: 0, f: 0 }, lB: { h: 6, k: 0, f: 0 }, sc: { thighB: .45 }, aA: { s: -62, e: -70 }, aB: { s: 62, e: 70 } },
    k: [K({ t: -2, p: [-1, 92] }, 1300, 200, "In piedi su una gamba, ginocchio morbido"), K({ t: 2, p: [1, 92], aA: { s: -58, e: -64 }, aB: { s: 66, e: 74 } }, 1300, 200, "Piccole correzioni: è normale oscillare")],
    steps: ["In piedi su una gamba vicino a un appoggio.", "Ginocchio leggermente morbido, bacino orizzontale.", "Tieni 30 secondi; quando è facile chiudi gli occhi o mettiti su un cuscino."],
    tips: ["Fallo mentre ti lavi i denti: 2 minuti al giorno fanno la differenza."],
    avoid: ["Non far cadere il bacino dal lato della gamba sollevata."],
  });

  X("rullo-plantare", {
    name: "Massaggio plantare con la pallina", target: "Fascia plantare, muscoli del piede", level: "Facile", dose: "2 minuti per piede",
    view: "side", hi: ["footA"], props: [{ type: "ball", x: 6, y: 3.5, r: 3.5 }, { type: "wall", x: 44 }],
    base: { p: [-6, 90], t: 2, lB: { to: [-12, 7], b: 1, f: 0 }, lA: { to: [-4, 14], b: 1, f: 0 }, aA: { to: [41, 122], b: -1, wa: 180 }, aB: { to: [40, 120], b: -1, wa: 180 } },
    k: [K({ lA: { to: [-4, 14], b: 1, f: 0 } }, 1400, 100, "Pallina sotto l'avampiede"), K({ lA: { to: [10, 14], b: 1, f: 0 } }, 1600, 100, "Fai rotolare la pallina fino al tallone")],
    steps: ["In piedi o seduto, metti una pallina (da tennis o da massaggio) sotto la pianta.", "Falla rotolare lentamente dall'avampiede al tallone.", "Fermati 20–30 secondi sui punti più sensibili."],
    tips: ["Al mattino usa una bottiglietta d'acqua ghiacciata al posto della pallina."],
    avoid: ["Non premere fino a far male."],
  });

  X("pompa-caviglia", {
    name: "Pompa delle caviglie a gambe sollevate", target: "Polpaccio, ritorno venoso e linfatico", level: "Facile", dose: "2 × 30 ripetizioni",
    view: "side", hi: ["calf"], props: [{ type: "mat", x0: -80, x1: 100 }, { type: "box", x: 45, w: 44, h: 24 }],
    base: Object.assign({}, SUPINE, { lA: { h: 105, k: 105, f: 70 }, lB: { h: 104, k: 104, f: 69 }, aA: { s: 90, e: 90, wa: 90 }, aB: { s: 91, e: 91, wa: 91 } }),
    k: [K({ lA: { h: 105, k: 105, f: 70 }, lB: { h: 104, k: 104, f: 69 } }, 900, 150, "Punte in avanti"), K({ lA: { h: 105, k: 105, f: 130 }, lB: { h: 104, k: 104, f: 129 } }, 900, 150, "Punte verso di te")],
    steps: ["Sdraiato con le gambe appoggiate su un cuscino o una sedia.", "Porta le punte dei piedi verso di te e poi lontano, ampio e ritmico.", "Fai 30 movimenti, riposa e ripeti."],
    tips: ["Fallo anche seduto in aereo o in ufficio ogni ora."],
    avoid: ["Non trattenere il respiro: abbinalo alla respirazione profonda."],
  });

  X("marcia", {
    name: "Marcia sul posto", target: "Pompa muscolare delle gambe, flessori dell'anca", level: "Facile", dose: "2–3 minuti",
    view: "side", hi: ["calf", "hipflexA"],
    base: { p: [0, 92], t: 2, lA: { h: 0, k: 0, f: 0 }, lB: { h: 0, k: 0, f: 0 }, aA: { s: 4, e: 8 }, aB: { s: -4, e: 4 } },
    k: [K({ lA: { h: 72, k: -4, f: -6 }, aA: { s: -30, e: -18 }, aB: { s: 38, e: 70 } }, 700, 50, "Alza un ginocchio, braccio opposto avanti"), K({ lA: { h: 0, k: 0, f: 0 }, aA: { s: 2, e: 6 }, aB: { s: 0, e: 4 } }, 600, 50, "Giù"), K({ lB: { h: 72, k: -4, f: -6 }, aB: { s: -30, e: -18 }, aA: { s: 38, e: 70 } }, 700, 50, "Cambia gamba"), K({ lB: { h: 0, k: 0, f: 0 }, aA: { s: 2, e: 6 }, aB: { s: 0, e: 4 } }, 600, 50, "Giù")],
    steps: ["In piedi, alza alternativamente le ginocchia all'altezza dell'anca.", "Muovi le braccia in modo opposto alle gambe.", "Respira profondamente e mantieni un ritmo costante."],
    tips: ["Ottimo come pausa attiva dopo tanto tempo seduto."],
    avoid: ["Non inclinare il busto all'indietro."],
  });

  /* ---------------- AGGIUNTE ---------------- */
  X("stretch-tricipite", {
    name: "Allungamento del tricipite", target: "Tricipite, gran dorsale", level: "Facile", dose: "3 × 30 s per lato",
    view: "side", hi: ["tricepsA", "lats"], base: Object.assign({}, STAND, { aA: { s: 6, e: 8 }, aB: { s: -4, e: 4 } }),
    k: [K({ aA: { s: 168, e: 172 } }, 1100, 300, "Porta il braccio dritto in alto"), K({ aA: { s: 172, e: 338 } }, 1400, 2600, "Piega il gomito: la mano scende tra le scapole"), K({ aA: { s: 6, e: 8 } }, 1300, 300, "Rilascia e torna giù")],
    steps: ["In piedi o seduto, alza un braccio verso il soffitto.", "Piega il gomito portando la mano dietro la testa, verso le scapole.", "Con l'altra mano spingi leggermente il gomito verso il basso e indietro.", "Tieni 30 secondi respirando, poi cambia lato."],
    tips: ["Tieni la testa dritta: non spingerla in avanti con il braccio."],
    avoid: ["Non inarcare la zona lombare per andare più in basso."],
  });
  X("squeeze-adduttori", {
    name: "Squeeze degli adduttori con la palla", target: "Adduttori, pube, addominali profondi", level: "Facile", dose: "5 × 5 s, poi 3 × 10",
    view: "side", hi: ["adductor", "abs"],
    props: [{ type: "mat", x0: -80, x1: 60 }, { type: "ball", at: "kneeA", off: [-3.5, -3], r: 4.6, front: true }],
    base: Object.assign({}, SUPINE, { lA: { to: [30, 7], b: 1, f: 0 }, lB: { to: [28, 7], b: 1, f: 0 }, aA: { s: 90, e: 90, wa: 90 }, aB: { s: 91, e: 91, wa: 91 } }),
    k: [K({}, 900, 400, "Supino, ginocchia piegate, palla (o cuscino) tra le ginocchia"), K({ h: -4 }, 900, 4200, "Stringi forte la palla per 5 secondi, respirando"), K({ h: 0 }, 900, 900, "Rilascia piano")],
    steps: ["Sdraiato sulla schiena, ginocchia piegate, piedi a terra.", "Metti una palla o un cuscino arrotolato tra le ginocchia.", "Stringi progressivamente fino a una forza di 6–7 su 10 e tieni 5 secondi, senza trattenere il fiato.", "Rilascia piano. Quando non fa più male, passa a 3 serie da 10 strette brevi."],
    tips: ["È anche un test: se stringere fa male all'inguine, riduci la forza.", "Con i progressi puoi farlo a gambe distese o con il ponte."],
    avoid: ["Non superare un dolore di 3 su 10 all'inguine.", "Non inarcare la schiena mentre stringi."],
  });

  return E;
})();
