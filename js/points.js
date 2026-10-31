/* =========================================================
   CONTENUTI DEI PUNTI DEL CORPO
   Ogni punto: dove si trova, a cosa serve, problemi frequenti,
   domande guidate (con ipotesi), rimedi, esercizi, quando
   andare dal medico. Coordinate: corpo maschile, lato destro
   dello schermo, nella vista indicata (f = fronte, b = retro).
   ========================================================= */
window.POINTS = (function () {
  const LIST = [];
  const P = (o) => LIST.push(o);
  // risposta: [testo, punteggi ipotesi, extra {pin, flag, note}]
  const D = (q, a, multi) => ({ q, a, multi: !!multi });

  // icone rimedi: ghiaccio, calore, pomata, riposo, tape, tutore, massaggio, postura, farmacia
  const R = {
    ghiaccio: (t) => ["ghiaccio", "Ghiaccio", t || "10–15 minuti avvolto in un panno, 2–3 volte al giorno nelle prime 48–72 ore o dopo uno sforzo che lo risveglia."],
    calore: (t) => ["calore", "Calore", t || "Borsa dell'acqua calda o cerotto autoriscaldante 15–20 minuti: scioglie la tensione muscolare. Evitalo se la zona è gonfia o calda."],
    gel: (t) => ["pomata", "Gel antinfiammatorio", t || "Un gel da banco (diclofenac o ketoprofene) 2–3 volte al giorno per pochi giorni. Chiedi al farmacista; il ketoprofene rende la pelle sensibile al sole."],
    arnica: () => ["pomata", "Arnica o crema lenitiva", "Utile come massaggio delicato su contratture e piccoli traumi senza ferite."],
    riposo: (t) => ["riposo", "Riposo attivo", t || "Non immobilizzarti: riduci solo i gesti che fanno male e continua a muoverti entro un dolore lieve (massimo 3–4 su 10)."],
    tape: (t) => ["tape", "Taping", t || "Un bendaggio elastico (kinesio tape) può dare sollievo durante gli allenamenti. Fallo applicare la prima volta."],
    tutore: (t) => ["tutore", "Tutore", t],
    massaggio: (t) => ["massaggio", "Automassaggio", t || "Con pallina o rullo, 1–2 minuti per zona, pressione piacevole e mai dolorosa."],
    postura: (t) => ["postura", "Abitudini", t],
  };

  /* ===================== MUSCOLI ===================== */
  P({
    id: "pettorale", layer: "muscoli", view: "f", region: "torace", at: [248, 250], zoom: 230, parts: ["pec"],
    name: "Gran pettorale", sub: "Pectoralis major",
    dove: "È il grande muscolo a ventaglio davanti al torace: parte dallo sterno e dalla clavicola e si attacca all'omero, appena sotto la spalla.",
    funzione: "Porta il braccio in avanti e verso il centro: spinte, piegamenti, abbracci, lanci.",
    problemi: [["Contrattura", "Tensione dopo panca o piegamenti, dolore sordo che migliora scaldando."], ["Stiramento", "Fitta netta durante una spinta pesante, dolore vicino all'ascella."], ["Accorciamento posturale", "Spalle chiuse in avanti da tante ore al computer: tira davanti e stanca la schiena alta."]],
    domande: [
      D("Dove senti di più il fastidio?", [["Al centro del petto, vicino allo sterno", { contrattura: 1, costale: 2 }, { pin: [212, 250] }], ["Nel mezzo del muscolo", { contrattura: 2 }, { pin: [244, 246] }], ["Vicino all'ascella, verso il braccio", { stiramento: 2 }, { pin: [282, 254] }]]),
      D("Com'è iniziato?", [["Con una fitta durante uno sforzo", { stiramento: 3 }], ["Il giorno dopo l'allenamento, a poco a poco", { contrattura: 3 }], ["Da solo, con la postura o lo stress", { postura: 3, costale: 1 }]]),
      D("Senti oppressione al petto, fiato corto o dolore che va al braccio sinistro o alla mascella?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Questi segni vanno valutati subito: chiama il 112." }]]),
    ],
    ipotesi: {
      contrattura: ["Contrattura del pettorale", 1, "Muscolo affaticato e teso. Di solito passa in pochi giorni con movimento leggero, calore e allungamenti."],
      stiramento: ["Possibile stiramento", 2, "Una piccola lesione delle fibre. Servono 1–3 settimane senza spinte pesanti; se vedi un livido o un avvallamento, fatti visitare."],
      postura: ["Tensione posturale", 1, "Il muscolo è accorciato dalla posizione chiusa. Allunga davanti e rinforza dietro (scapole)."],
      costale: ["Fastidio alle cartilagini costali", 2, "Se il dolore è puntiforme sullo sterno e aumenta respirando a fondo, può essere un'infiammazione delle costole (costocondrite)."],
    },
    rimedi: [R.calore(), R.arnica(), R.riposo("Niente panca o piegamenti pesanti per qualche giorno; i movimenti quotidiani vanno bene."), R.postura("Ogni ora apri le spalle per 30 secondi; schermo all'altezza degli occhi.")],
    esercizi: ["stretch-pettorale", "rematore-elastico", "wall-slide", "push-up-muro"],
    medico: ["Dolore al petto con oppressione, sudore freddo, fiato corto: 112 subito.", "Livido esteso o avvallamento vicino all'ascella dopo uno sforzo (possibile rottura del tendine).", "Dolore che non cambia con i movimenti del braccio."],
  });

  P({
    id: "deltoide", layer: "muscoli", view: "f", region: "spalla", at: [300, 248], zoom: 220, parts: ["deltF"],
    name: "Deltoide", sub: "Deltoideus",
    dove: "È il «cappuccio» della spalla: copre l'articolazione davanti, di lato e dietro.",
    funzione: "Alza il braccio in avanti, di lato e indietro. Lavora in ogni spinta sopra la testa.",
    problemi: [["Sovraccarico", "Dolore sordo dopo tante alzate o lavori con le braccia in alto."], ["Dolore riferito", "Il fastidio sul lato del braccio spesso arriva dalla cuffia dei rotatori, sotto il deltoide."]],
    domande: [
      D("Dove indicheresti il dolore con un dito?", [["Davanti alla spalla", { anteriore: 2 }, { pin: [282, 228] }], ["Sul lato del braccio, a metà", { cuffia: 3 }, { pin: [304, 268] }], ["Diffuso su tutta la spalla", { sovraccarico: 2 }, { pin: [296, 238] }]]),
      D("Alzando il braccio di lato, c'è un arco in cui fa male (tra 60° e 120°) e poi passa?", [["Sì, proprio così", { cuffia: 3 }], ["Fa male per tutto il movimento", { sovraccarico: 1, cuffia: 1 }], ["No, solo quando premo il muscolo", { sovraccarico: 3 }]]),
      D("Riesci a dormire sul lato dolente?", [["Sì, senza problemi", { sovraccarico: 1 }], ["No, mi sveglia", { cuffia: 2 }, { flag: "giallo" }]]),
    ],
    ipotesi: {
      sovraccarico: ["Sovraccarico del deltoide", 1, "Il muscolo è affaticato. Riduci per qualche giorno i carichi sopra la testa e lavora con esercizi leggeri."],
      anteriore: ["Irritazione anteriore di spalla", 2, "Davanti alla spalla passa anche il tendine del bicipite. Evita per ora le spinte con il braccio dietro al corpo (dip, panca profonda)."],
      cuffia: ["Origine dalla cuffia dei rotatori", 2, "L'arco doloroso e il dolore notturno indicano spesso i tendini della cuffia: guarda anche il punto «Cuffia dei rotatori» nello strato Tendini."],
    },
    rimedi: [R.ghiaccio("10–15 minuti dopo l'allenamento se la spalla «brucia»."), R.gel(), R.riposo("Niente lento avanti o alzate laterali pesanti per 1–2 settimane.")],
    esercizi: ["pendolo", "rotazione-esterna", "wall-slide", "rematore-elastico"],
    medico: ["Non riesci ad alzare il braccio da solo dopo una caduta.", "Spalla deformata o «scesa» dopo un trauma: pronto soccorso.", "Dolore notturno che dura più di 3 settimane."],
  });

  P({
    id: "bicipite", layer: "muscoli", view: "f", region: "braccio", at: [292, 318], zoom: 220, parts: ["bicipite", "brachiale"],
    name: "Bicipite brachiale", sub: "Biceps brachii",
    dove: "Davanti al braccio, tra spalla e gomito. Ha due tendini in alto (spalla) e uno in basso (piega del gomito).",
    funzione: "Piega il gomito e ruota il palmo verso l'alto (come girare una chiave).",
    problemi: [["Contrattura o DOMS", "Indolenzimento 24–72 ore dopo curl o trazioni."], ["Tendinite del capo lungo", "Dolore davanti alla spalla."], ["Lesione del tendine distale", "Raro ma serio: «crack» al gomito sollevando un peso."]],
    domande: [
      D("Dove è il fastidio?", [["Davanti alla spalla", { capolungo: 3 }, { pin: [284, 240] }], ["Nella pancia del muscolo", { doms: 2 }, { pin: [292, 316] }], ["Nella piega del gomito", { distale: 2 }, { pin: [294, 380] }]]),
      D("Hai sentito uno schiocco e il muscolo ora ha una forma diversa (pallina più in alto)?", [["No", {}], ["Sì", { distale: 4 }, { flag: "rosso", note: "Un tendine del bicipite rotto va valutato da un ortopedico entro pochi giorni." }]]),
      D("Quando è iniziato?", [["1–3 giorni dopo un allenamento nuovo o intenso", { doms: 3 }], ["Piano piano, settimane di carico", { capolungo: 2 }], ["All'improvviso, sollevando", { distale: 2 }]]),
    ],
    ipotesi: {
      doms: ["Indolenzimento da allenamento", 1, "Normale dopo esercizi nuovi o eccentrici. Passa in 2–4 giorni; il movimento leggero aiuta."],
      capolungo: ["Tendinopatia del capo lungo", 2, "Il tendine davanti alla spalla è irritato. Riduci curl pesanti e trazioni presa supina per 2–3 settimane."],
      distale: ["Sospetta lesione del tendine distale", 3, "Se c'è stato uno schiocco con livido, serve una visita a breve: a volte va operato entro poche settimane."],
    },
    rimedi: [R.calore("Per l'indolenzimento muscolare, doccia calda e movimento leggero."), R.ghiaccio("Sul tendine (spalla o gomito) dopo l'attività."), R.gel()],
    esercizi: ["curl-eccentrico", "stretch-pettorale", "rematore-elastico"],
    medico: ["Schiocco con livido e muscolo «arrotolato» verso l'alto.", "Debolezza netta nel girare il palmo in su.", "Dolore che non migliora in 3 settimane."],
  });

  P({
    id: "avambraccio", layer: "muscoli", view: "f", region: "gomito", at: [302, 432], zoom: 230, parts: ["flessori", "brachiorad"],
    name: "Muscoli dell'avambraccio", sub: "Flessori, estensori e brachioradiale",
    dove: "Sono i muscoli tra gomito e polso: i flessori sul lato del palmo, gli estensori sul dorso, il brachioradiale sul lato del pollice.",
    funzione: "Chiudono e aprono mano e dita, stabilizzano il polso in ogni presa: bilanciere, kettlebell, arrampicata, mouse.",
    problemi: [["Pump e affaticamento", "Avambraccio duro e gonfio dopo prese prolungate."], ["Sovraccarico da presa", "Dolore lungo i muscoli che parte dal gomito."], ["Contratture da lavoro al computer", "Tensione sul dorso dell'avambraccio."]],
    domande: [
      D("In che lato senti tensione?", [["Lato del palmo", { flessori: 2 }, { pin: [300, 440] }], ["Dorso dell'avambraccio", { estensori: 2 }, { pin: [314, 424] }], ["Vicino al gomito, in un punto preciso", { tendine: 3 }, { pin: [292, 392] }]]),
      D("Le dita formicolano o si addormentano?", [["No", {}], ["Sì, pollice-indice-medio", { nervo: 3 }, { note: "Guarda anche il punto «Tunnel carpale» nello strato Nervi." }], ["Sì, anulare e mignolo", { nervo: 3 }, { note: "Guarda anche il punto «Nervo ulnare» nello strato Nervi." }]]),
    ],
    ipotesi: {
      flessori: ["Sovraccarico dei flessori", 1, "Tipico di chi fa tanta presa (trazioni, stacchi, arrampicata). Allunga e alterna i carichi di presa."],
      estensori: ["Tensione degli estensori", 1, "Comune con mouse e tastiera. Pause frequenti e allungamenti."],
      tendine: ["Probabile tendinopatia al gomito", 2, "Un punto preciso vicino al gomito fa pensare a epicondilite o epitrocleite: vedi lo strato Tendini."],
      nervo: ["Possibile componente nervosa", 2, "Il formicolio suggerisce un nervo irritato: approfondisci nello strato Nervi."],
    },
    rimedi: [R.massaggio("Con il pollice o una pallina lungo l'avambraccio, 1–2 minuti."), R.calore(), R.postura("Polso dritto sul mouse; usa ganci o magnesite nei giorni di molta presa.")],
    esercizi: ["stretch-estensori", "stretch-flessori", "polso-eccentrico-fless"],
    medico: ["Gonfiore improvviso e dolore forte dopo uno sforzo.", "Debolezza nella presa che peggiora.", "Formicolio costante alle dita."],
  });

  P({
    id: "addominali", layer: "muscoli", view: "f", region: "addome", at: [216, 372], central: true, zoom: 320, parts: ["retto", "obliquo"],
    name: "Addominali", sub: "Retto dell'addome e obliqui",
    dove: "Il retto va dallo sterno al pube (la «tartaruga»); gli obliqui sono ai lati, tra costole e bacino.",
    funzione: "Stabilizzano il tronco, proteggono la schiena, flettono e ruotano il busto, aiutano la respirazione.",
    problemi: [["Indolenzimento", "Dopo crunch o plank nuovi."], ["Stiramento degli obliqui", "Fitta laterale ruotando o tossendo."], ["Diastasi dei retti", "Separazione al centro, frequente dopo la gravidanza."], ["Ernia", "Rigonfiamento all'ombelico o all'inguine."]],
    domande: [
      D("Dove senti il fastidio?", [["Al centro", { doms: 2, diastasi: 1 }, { pin: [200, 360] }], ["Sul fianco", { obliqui: 3 }, { pin: [254, 380] }], ["In basso, vicino all'inguine", { ernia: 2 }, { pin: [228, 468] }]]),
      D("Tossendo o spingendo compare un rigonfiamento?", [["No", {}], ["Sì, una pallina che rientra", { ernia: 4 }, { flag: "giallo", note: "Un rigonfiamento che compare sotto sforzo va fatto vedere dal medico." }], ["Sì, una cresta lungo il centro della pancia", { diastasi: 4 }]]),
      D("Hai anche nausea, febbre o dolore che non cambia muovendoti?", [["No", {}], ["Sì", {}, { flag: "rosso", note: "Il dolore addominale con questi segni può venire da un organo interno: serve il medico." }]]),
    ],
    ipotesi: {
      doms: ["Affaticamento muscolare", 1, "Normale dopo un allenamento intenso del core. Passa in pochi giorni."],
      obliqui: ["Stiramento degli obliqui", 2, "Evita per 1–2 settimane rotazioni veloci e lanci; lavora prima in isometria."],
      diastasi: ["Possibile diastasi dei retti", 2, "Evita crunch classici e sit-up; prediligi respirazione e attivazione profonda. Un fisioterapista del pavimento pelvico ti aiuta molto."],
      ernia: ["Sospetta ernia", 3, "Non spingere carichi pesanti finché un medico non l'ha valutata."],
    },
    sesso: { f: "Dopo una gravidanza la diastasi è frequente: chiedi una valutazione del pavimento pelvico prima di tornare a carichi pesanti." },
    rimedi: [R.calore(), R.riposo("Niente crunch e sit-up finché fa male; respirazione e plank leggeri vanno bene.")],
    esercizi: ["respirazione", "dead-bug", "plank", "plank-laterale"],
    medico: ["Rigonfiamento duro e dolente che non rientra: pronto soccorso.", "Dolore con febbre, vomito o sangue.", "Dolore addominale che non cambia con i movimenti."],
  });

  P({
    id: "flessori-anca", layer: "muscoli", view: "f", region: "anca", at: [240, 486], zoom: 240, parts: ["ileopsoas", "rettofem", "tfl"],
    name: "Flessori dell'anca", sub: "Ileopsoas, retto femorale, tensore",
    dove: "Davanti all'anca, nella piega dell'inguine. L'ileopsoas parte dalla colonna lombare e arriva al femore.",
    funzione: "Portano il ginocchio verso il petto: corsa, scatti, salire le scale, calciare.",
    problemi: [["Accorciamento", "Molte ore seduti: tirano il bacino in avanti e caricano la zona lombare."], ["Stiramento", "Fitta all'inguine scattando o calciando."], ["Tendinopatia", "Dolore all'inguine salendo in auto o alzando la gamba."]],
    domande: [
      D("Stai tante ore seduto?", [["Sì, più di 6 ore al giorno", { accorciamento: 3 }], ["No", {}]]),
      D("Alzare il ginocchio contro resistenza fa male?", [["Sì, molto", { stiramento: 3 }], ["Un po'", { tendine: 2 }], ["No", { accorciamento: 1 }]]),
      D("Dove lo senti esattamente?", [["Nella piega dell'inguine", { tendine: 2, stiramento: 1 }, { pin: [236, 482] }], ["Più in alto, davanti all'anca", { accorciamento: 2 }, { pin: [262, 456] }], ["Dentro l'articolazione, con un click", { anca: 3 }, { pin: [246, 488] }]]),
    ],
    ipotesi: {
      accorciamento: ["Flessori accorciati", 1, "Il modo migliore per sbloccarli è allungarli e rinforzare i glutei: lavorano in coppia."],
      stiramento: ["Possibile stiramento", 2, "Riposo dagli scatti per 2–3 settimane, poi ritorno graduale."],
      tendine: ["Tendinopatia dell'ileopsoas", 2, "Riduci corsa in salita e alzate di gamba; lavora con isometrie."],
      anca: ["Possibile origine articolare", 2, "Un click con dolore profondo può venire dall'articolazione dell'anca: vedi lo strato Ossa."],
    },
    rimedi: [R.calore(), R.postura("Alzati ogni 45 minuti; seduto, tieni le anche leggermente più alte delle ginocchia.")],
    esercizi: ["stretch-flessori-anca", "ponte", "dead-bug"],
    medico: ["Dolore all'inguine con febbre.", "Non riesci a camminare senza zoppicare.", "Dolore profondo notturno."],
  });

  P({
    id: "adduttori", layer: "muscoli", view: "f", region: "coscia", at: [218, 540], zoom: 270, parts: ["adduttori", "pettineo"],
    name: "Adduttori", sub: "Lungo, breve, grande adduttore, gracile",
    dove: "All'interno della coscia, dall'osso del pube fino al femore e al ginocchio.",
    funzione: "Avvicinano le gambe e stabilizzano il bacino: cambi di direzione, calcio, pattinaggio, squat largo.",
    problemi: [["Stiramento", "Classico nel calcio e negli sport con cambi di direzione."], ["Pubalgia", "Dolore all'inguine e al pube che peggiora con lo sforzo."], ["Contrattura", "Tensione interna coscia dopo squat larghi."]],
    domande: [
      D("Dove è il dolore?", [["Vicino al pube", { pubalgia: 3 }, { pin: [212, 498] }], ["A metà interno coscia", { stiramento: 2, contrattura: 1 }, { pin: [216, 556] }]]),
      D("Stringere un pallone tra le ginocchia fa male?", [["Sì, molto", { stiramento: 2, pubalgia: 2 }], ["Un po'", { contrattura: 2 }], ["No", { contrattura: 1 }]]),
      D("Com'è iniziato?", [["Fitta improvvisa in un cambio di direzione", { stiramento: 3 }], ["Piano piano, peggiora con gli allenamenti", { pubalgia: 3 }], ["Dopo un allenamento nuovo", { contrattura: 3 }]]),
    ],
    ipotesi: {
      stiramento: ["Stiramento degli adduttori", 2, "Niente scatti e cambi di direzione per 2–4 settimane. Si recupera con isometrie progressive."],
      pubalgia: ["Possibile pubalgia", 2, "Dolore da sovraccarico del pube: va gestito riducendo il carico e rinforzando adduttori e core. Se dura più di 6 settimane, fai una visita."],
      contrattura: ["Contrattura", 1, "Muscolo affaticato: movimento leggero e allungamento dolce."],
    },
    rimedi: [R.ghiaccio("Nelle prime 48 ore se c'è stata una fitta."), R.calore("Dopo 3 giorni, per sciogliere."), R.riposo()],
    esercizi: ["affondo-laterale", "ponte", "plank-laterale"],
    medico: ["Livido esteso nell'interno coscia.", "Dolore al pube che dura più di 6 settimane.", "Non riesci a camminare normalmente."],
  });

  P({
    id: "quadricipite", layer: "muscoli", view: "f", region: "coscia", at: [258, 580], zoom: 320, parts: ["rettofem", "vastolat", "vastomed"],
    name: "Quadricipite", sub: "Retto femorale e vasti",
    dove: "Davanti alla coscia: quattro muscoli che si uniscono nel tendine sopra la rotula.",
    funzione: "Distende il ginocchio e frena la discesa: squat, scale, salti, corsa in discesa.",
    problemi: [["DOMS", "Coscia dura dopo squat o discese."], ["Stiramento del retto femorale", "Fitta calciando o scattando."], ["Contusione", "Colpo diretto (ginocchiata)."]],
    domande: [
      D("Dove senti il fastidio?", [["In alto, vicino all'anca", { stiramento: 2 }, { pin: [250, 510] }], ["A metà coscia", { doms: 2, contusione: 1 }, { pin: [256, 580] }], ["Sopra la rotula", { tendine: 3 }, { pin: [240, 656] }]]),
      D("Com'è iniziato?", [["Il giorno dopo un allenamento", { doms: 3 }], ["Fitta improvvisa scattando o calciando", { stiramento: 3 }], ["Ho preso un colpo", { contusione: 3 }]]),
      D("Riesci a piegare il ginocchio e portare il tallone vicino al gluteo?", [["Sì", { doms: 1 }], ["Solo a metà", { contusione: 2, stiramento: 1 }, { flag: "giallo" }]]),
    ],
    ipotesi: {
      doms: ["Indolenzimento muscolare", 1, "Passa in 2–4 giorni. Movimento leggero e bici aiutano più del riposo assoluto."],
      stiramento: ["Possibile stiramento", 2, "Stop a scatti e calci per 2–3 settimane; poi ritorno progressivo."],
      contusione: ["Contusione (bozzo)", 2, "Ghiaccio e ginocchio piegato nelle prime ore. Non massaggiare forte i primi giorni."],
      tendine: ["Tendine quadricipitale", 2, "Sopra la rotula è il tendine: vedi «Tendine rotuleo» nello strato Tendini."],
    },
    rimedi: [R.ghiaccio(), R.calore("Dal terzo giorno, se non è un colpo."), R.massaggio("Rullo sulla coscia, lento, solo se non è una contusione recente.")],
    esercizi: ["stretch-quadricipite", "estensione-ginocchio", "wall-sit", "squat", "affondo"],
    medico: ["Coscia molto gonfia e tesa dopo un colpo.", "Buco o avvallamento nel muscolo.", "Non riesci a distendere il ginocchio."],
  });

  P({
    id: "tibiale-anteriore", layer: "muscoli", view: "f", region: "gamba", at: [246, 790], zoom: 270, parts: ["tibant"],
    name: "Tibiale anteriore e tibia", sub: "Tibialis anterior · periostite tibiale",
    dove: "Sul davanti della gamba, appena di lato all'osso della tibia.",
    funzione: "Alza la punta del piede e controlla l'appoggio del passo: lavora tanto nella corsa.",
    problemi: [["Periostite tibiale (shin splints)", "Dolore lungo il bordo interno della tibia nei runner."], ["Sovraccarico del tibiale", "Bruciore davanti alla gamba aumentando i km."], ["Frattura da stress", "Dolore in un punto preciso dell'osso: va esclusa."]],
    domande: [
      D("Dove è il dolore?", [["Lungo il bordo interno della tibia, per diversi cm", { periostite: 3 }, { pin: [220, 800] }], ["Nel muscolo davanti", { muscolo: 3 }, { pin: [246, 780] }], ["In un punto preciso sull'osso, grande come un dito", { stress: 3 }, { pin: [228, 830] }]]),
      D("Saltellando su un piede solo 10 volte, fa male?", [["No", { muscolo: 1 }], ["Un po'", { periostite: 2 }], ["Molto, in un punto preciso", { stress: 3 }, { flag: "rosso", note: "Il dolore puntiforme saltellando può indicare una frattura da stress: serve una visita e spesso una risonanza." }]]),
      D("Hai aumentato di recente km, velocità o cambiato scarpe?", [["Sì", { periostite: 2, muscolo: 1 }], ["No", {}]]),
    ],
    ipotesi: {
      periostite: ["Periostite tibiale", 2, "Sovraccarico della tibia. Riduci del 30–50% i km, preferisci terreni morbidi e rinforza polpacci e piede."],
      muscolo: ["Sovraccarico del tibiale anteriore", 1, "Il muscolo è affaticato. Riduci le salite e lavora con esercizi di rinforzo."],
      stress: ["Sospetta frattura da stress", 3, "Stop alla corsa finché un medico non la esclude."],
    },
    sesso: { f: "Nelle donne con cicli irregolari o alimentazione insufficiente le fratture da stress sono più frequenti: parlane con il medico." },
    rimedi: [R.ghiaccio("Massaggio con il ghiaccio lungo la tibia 5–8 minuti dopo la corsa."), R.riposo("Sostituisci la corsa con bici o nuoto per 1–2 settimane."), R.postura("Controlla che le scarpe non abbiano più di 600–800 km.")],
    esercizi: ["tibiale-raise", "calf-raise", "stretch-polpaccio"],
    medico: ["Dolore puntiforme sull'osso che non passa a riposo.", "Dolore notturno alla tibia.", "Gonfiore teso e intorpidimento del piede durante la corsa."],
  });

  P({
    id: "trapezio", layer: "muscoli", view: "b", region: "collo", at: [244, 196], zoom: 240, parts: ["trapezio"],
    name: "Trapezio superiore", sub: "Trapezius · cervicale tensiva",
    dove: "È il muscolo tra collo e spalla, quello che si «indurisce» con lo stress.",
    funzione: "Alza le spalle, sostiene il peso delle braccia, stabilizza le scapole e il collo.",
    problemi: [["Contrattura da stress e postura", "Collo rigido, nodi dolorosi tra collo e spalla."], ["Cefalea tensiva", "Mal di testa che parte dalla nuca."], ["Torcicollo", "Blocco improvviso, spesso al risveglio."]],
    domande: [
      D("Hai anche mal di testa che parte dalla nuca?", [["Sì, spesso", { cefalea: 3 }], ["No", { contrattura: 1 }]]),
      D("Riesci a girare la testa?", [["Sì, solo un po' rigido", { contrattura: 2 }], ["No, sono bloccato da un lato", { torcicollo: 3 }]]),
      D("Il dolore scende nel braccio con formicolio?", [["No", {}], ["Sì", { nervo: 4 }, { note: "Il dolore che scende nel braccio fa pensare a una radice nervosa: vedi «Cervicobrachialgia» nello strato Nervi." }]]),
    ],
    ipotesi: {
      contrattura: ["Contrattura del trapezio", 1, "Molto comune con stress e computer. Calore, movimento e pause cambiano tutto."],
      cefalea: ["Cefalea tensiva", 1, "I muscoli del collo contratti possono dare mal di testa. Rilassamento, sonno e allungamenti aiutano."],
      torcicollo: ["Torcicollo acuto", 2, "Di solito passa in 3–7 giorni. Muovi dolcemente nei gradi liberi, senza forzare."],
      nervo: ["Possibile irritazione nervosa", 2, "Approfondisci nello strato Nervi."],
    },
    rimedi: [R.calore(), R.massaggio("Pallina contro il muro sul nodo, 60 secondi respirando lento."), R.postura("Schermo all'altezza degli occhi, spalle basse, pause ogni 30–45 minuti. Cuscino non troppo alto.")],
    esercizi: ["stretch-trapezio", "chin-tuck", "circonduzioni-spalle", "rematore-elastico"],
    medico: ["Mal di testa improvviso e fortissimo, o con febbre e rigidità del collo: pronto soccorso.", "Dopo un incidente o una caduta sulla testa.", "Vertigini, disturbi della vista o della parola."],
  });

  P({
    id: "romboidi", layer: "muscoli", view: "b", region: "schiena", at: [222, 262], zoom: 250, parts: ["romboidi"], peel: ["trapezio"],
    name: "Romboidi e muscoli interscapolari", sub: "Rhomboideus major e minor",
    dove: "Tra la colonna e il bordo interno della scapola, sotto il trapezio.",
    funzione: "Avvicinano le scapole e le tengono appoggiate alla gabbia toracica: postura, trazioni, rematori.",
    problemi: [["Dolore interscapolare", "Bruciore tra le scapole, tipico di chi lavora seduto."], ["Contrattura", "Punto duro e dolente vicino alla scapola."], ["Dolore riferito", "Può arrivare dal collo o, raramente, da organi interni."]],
    domande: [
      D("Il dolore cambia muovendo spalle o schiena?", [["Sì, peggiora o migliora", { postura: 2, contrattura: 2 }], ["No, è sempre uguale", { riferito: 3 }, { flag: "giallo" }]]),
      D("Com'è il dolore?", [["Bruciore che arriva a fine giornata", { postura: 3 }], ["Punto duro, come un nodo", { contrattura: 3 }], ["Insieme a dolore al collo o al braccio", { collo: 3 }]]),
    ],
    ipotesi: {
      postura: ["Dolore posturale", 1, "I muscoli lavorano allungati tutto il giorno. Rinforzali e apri il petto."],
      contrattura: ["Contrattura dei romboidi", 1, "Calore, pallina e rinforzo leggero."],
      collo: ["Origine cervicale", 2, "Il collo spesso «proietta» dolore tra le scapole: guarda anche la colonna cervicale nello strato Ossa."],
      riferito: ["Dolore che non sembra muscolare", 3, "Se il dolore non cambia con i movimenti, meglio una visita."],
    },
    rimedi: [R.calore(), R.massaggio("Pallina tra scapola e colonna, appoggiato al muro."), R.postura("Gomiti appoggiati, schermo davanti agli occhi, alzati ogni ora.")],
    esercizi: ["rematore-elastico", "wall-slide", "estensione-toracica", "stretch-pettorale"],
    medico: ["Dolore tra le scapole con fiato corto, sudore o oppressione al petto: 112.", "Dolore che non cambia mai con i movimenti.", "Febbre o calo di peso."],
  });

  P({
    id: "dorsale", layer: "muscoli", view: "b", region: "schiena", at: [254, 345], zoom: 320, parts: ["dorsale", "grandeRot"],
    name: "Gran dorsale", sub: "Latissimus dorsi",
    dove: "È il muscolo più largo della schiena: dal bacino e dalla colonna lombare sale fino all'interno del braccio.",
    funzione: "Tira il braccio in basso e indietro: trazioni, rematori, nuoto, arrampicata.",
    problemi: [["Contrattura", "Dolore sotto l'ascella o sul fianco della schiena dopo le trazioni."], ["Rigidità", "Limita il braccio sopra la testa e inarca la zona lombare."], ["Stiramento", "Fitta nei lanci o nelle trazioni esplosive."]],
    domande: [
      D("Dove lo senti?", [["Sotto l'ascella", { contrattura: 2, stiramento: 1 }, { pin: [282, 284] }], ["Sul fianco della schiena", { contrattura: 2 }, { pin: [262, 350] }], ["In basso, vicino al bacino", { lombare: 2 }, { pin: [240, 410] }]]),
      D("Alzando le braccia sopra la testa inarchi la schiena?", [["Sì", { rigidita: 3 }], ["No", {}]]),
      D("È iniziato con una fitta durante uno sforzo?", [["Sì", { stiramento: 3 }], ["No", { contrattura: 1 }]]),
    ],
    ipotesi: {
      contrattura: ["Contrattura del dorsale", 1, "Muscolo sovraccaricato: allunga e riduci per qualche giorno le trazioni."],
      rigidita: ["Dorsale rigido", 1, "Limita la mobilità della spalla sopra la testa: lavora su allungamento e mobilità."],
      stiramento: ["Possibile stiramento", 2, "Stop a trazioni e lanci per 2 settimane, poi ripresa graduale."],
      lombare: ["Coinvolgimento lombare", 1, "Nella parte bassa il dorsale si unisce alla fascia lombare: guarda anche «Muscoli lombari»."],
    },
    rimedi: [R.calore(), R.massaggio("Rullo sul fianco della schiena con il braccio sopra la testa."), R.riposo()],
    esercizi: ["bambino", "gatto-cammello", "rematore-elastico"],
    medico: ["Dolore al fianco con febbre o bruciore urinando (può essere il rene).", "Debolezza marcata del braccio."],
  });

  P({
    id: "lombari", layer: "muscoli", view: "b", region: "lombare", at: [212, 400], central: true, zoom: 280, parts: ["erettori"],
    name: "Muscoli lombari", sub: "Erettori della colonna · lombalgia muscolare",
    dove: "Due colonne di muscoli ai lati della colonna, nella parte bassa della schiena.",
    funzione: "Tengono il busto eretto e lo frenano quando ti pieghi in avanti.",
    problemi: [["Lombalgia acuta («colpo della strega»)", "Blocco improvviso sollevando o girandosi."], ["Contrattura", "Schiena dura dopo stacchi o tante ore in piedi."], ["Lombalgia cronica", "Dolore che va e viene da mesi."]],
    domande: [
      D("Il dolore scende sotto il ginocchio?", [["No, resta nella schiena", { muscolare: 2 }], ["Sì, fino al polpaccio o al piede", { sciatica: 4 }, { note: "Il dolore che scende nella gamba fa pensare al nervo sciatico: vedi lo strato Nervi." }]]),
      D("Com'è iniziato?", [["All'improvviso, sollevando o girandomi", { acuta: 3 }], ["Dopo un allenamento pesante", { muscolare: 3 }], ["Va e viene da più di 3 mesi", { cronica: 3 }]]),
      D("Hai difficoltà a urinare, perdita di controllo o formicolio nella zona genitale?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Sono segni rari ma urgenti (sindrome della cauda equina): vai subito al pronto soccorso." }]]),
    ],
    ipotesi: {
      acuta: ["Lombalgia acuta", 2, "Fa molto male ma di solito migliora in 1–2 settimane. Il riposo a letto rallenta la guarigione: cammina un po' ogni ora."],
      muscolare: ["Contrattura lombare", 1, "Muscoli sovraccaricati: calore, movimento e rinforzo del core."],
      cronica: ["Lombalgia ricorrente", 2, "La soluzione è un programma di rinforzo costante (core, glutei) e abitudini migliori. Un fisioterapista può costruirlo con te."],
      sciatica: ["Dolore irradiato", 2, "Approfondisci nello strato Nervi (nervo sciatico)."],
    },
    eta: { over: [50, "Sopra i 50 anni, un mal di schiena nuovo senza una causa chiara va fatto vedere dal medico."] },
    rimedi: [R.calore("15–20 minuti, anche più volte al giorno: è il rimedio più efficace per la schiena."), R.riposo("Cammina 10 minuti ogni 1–2 ore. Evita di stare a letto a lungo."), R.gel(), R.postura("Solleva i pesi con le ginocchia piegate e il carico vicino al corpo.")],
    esercizi: ["gatto-cammello", "ginocchia-petto", "bird-dog", "ponte"],
    medico: ["Perdita di controllo di urina o feci, intorpidimento all'inguine: pronto soccorso.", "Debolezza della gamba o piede che «cade».", "Febbre, calo di peso, storia di tumore, dolore notturno costante.", "Dopo una caduta o un trauma importante."],
  });

  P({
    id: "gluteo-medio", layer: "muscoli", view: "b", region: "anca", at: [252, 438], zoom: 230, parts: ["gluteoMedio"],
    name: "Gluteo medio", sub: "Gluteus medius",
    dove: "Sul lato del bacino, sopra il gluteo grande, fino alla sporgenza ossea del femore (grande trocantere).",
    funzione: "Tiene il bacino orizzontale quando sei su una gamba sola: camminare, correre, scale.",
    problemi: [["Debolezza", "Il bacino «cade» camminando, le ginocchia vanno verso l'interno."], ["Tendinopatia glutea", "Dolore sul lato dell'anca, non riesci a dormire su quel fianco."], ["Contrattura", "Punti tesi sul lato del bacino."]],
    domande: [
      D("Riesci a dormire sul fianco dolente?", [["Sì", { debolezza: 1, contrattura: 1 }], ["No, fa male appoggiarsi", { tendine: 3 }]]),
      D("Dove indicheresti il dolore?", [["Sopra l'osso sporgente del fianco", { tendine: 3 }, { pin: [272, 484] }], ["Più in alto, sul bacino", { contrattura: 2 }, { pin: [254, 436] }], ["Non ho dolore, ma le ginocchia vanno all'interno", { debolezza: 3 }]]),
      D("Stare su una gamba sola 30 secondi è difficile?", [["Sì, il bacino si inclina", { debolezza: 3 }], ["No", {}]]),
    ],
    ipotesi: {
      debolezza: ["Gluteo medio debole", 1, "Molto comune e causa di dolori a ginocchio e schiena. Si risolve con rinforzo mirato."],
      tendine: ["Tendinopatia glutea", 2, "Più frequente nelle donne sopra i 40 anni. Evita di accavallare le gambe e di stare in piedi su un fianco."],
      contrattura: ["Contrattura", 1, "Pallina sul fianco e rinforzo leggero."],
    },
    sesso: { f: "La tendinopatia glutea è più frequente nelle donne dopo i 40 anni: evita di accavallare le gambe e di dormire con la gamba sopra che cade in avanti (usa un cuscino tra le ginocchia)." },
    rimedi: [R.massaggio("Pallina sul lato del bacino, non direttamente sull'osso."), R.postura("Non accavallare le gambe; dormendo sul fianco metti un cuscino tra le ginocchia."), R.ghiaccio("Sul lato dell'anca se dolente dopo una camminata lunga.")],
    esercizi: ["abduzione-fianco", "ponte-mono", "equilibrio"],
    medico: ["Dolore che non migliora dopo 6 settimane di esercizi.", "Dolore all'inguine profondo o notturno.", "Dopo una caduta sul fianco, se fai fatica a caricare."],
  });

  P({
    id: "piriforme", layer: "muscoli", view: "b", region: "anca", at: [240, 474], zoom: 230, parts: ["piriforme"], peel: ["gluteoMax"],
    name: "Piriforme", sub: "Piriformis",
    dove: "È un muscolo profondo sotto il gluteo grande, dall'osso sacro all'anca. Il nervo sciatico gli passa vicinissimo.",
    funzione: "Ruota la coscia verso l'esterno e stabilizza l'anca.",
    problemi: [["Sindrome del piriforme", "Dolore profondo nel gluteo, a volte scende lungo la coscia."], ["Contrattura", "Fastidio stando seduti a lungo, soprattutto su superfici dure."]],
    domande: [
      D("Stare seduto peggiora il dolore nel gluteo?", [["Sì, molto", { piriforme: 3 }], ["No", { lombare: 1 }]]),
      D("Il dolore scende nella gamba?", [["No, resta nel gluteo", { piriforme: 2 }], ["Sì, fino al ginocchio", { piriforme: 2, lombare: 1 }], ["Sì, sotto il ginocchio fino al piede", { lombare: 3 }, { note: "Il dolore fino al piede fa pensare a una radice lombare: vedi «Nervo sciatico»." }]]),
      D("Hai anche mal di schiena?", [["Sì", { lombare: 2 }], ["No", { piriforme: 1 }]]),
    ],
    ipotesi: {
      piriforme: ["Sindrome del piriforme", 2, "Il muscolo contratto irrita il nervo sciatico. Allungamento, pallina e rinforzo dei glutei."],
      lombare: ["Origine lombare", 2, "Spesso il dolore al gluteo arriva dalla schiena. Approfondisci in «Colonna lombare» o «Nervo sciatico»."],
    },
    rimedi: [R.massaggio("Seduto su una pallina sotto il gluteo, piccoli movimenti per 60–90 secondi."), R.calore(), R.postura("Evita il portafoglio nella tasca posteriore; da seduto alzati spesso.")],
    esercizi: ["stretch-piriforme", "ponte", "abduzione-fianco"],
    medico: ["Debolezza della gamba o del piede.", "Disturbi urinari.", "Dolore che non migliora dopo 4–6 settimane."],
  });

  P({
    id: "ischiocrurali", layer: "muscoli", view: "b", region: "coscia", at: [240, 595], zoom: 320, parts: ["bicFem", "semiT"],
    name: "Ischiocrurali", sub: "Bicipite femorale, semitendinoso, semimembranoso",
    dove: "Dietro la coscia, dall'osso su cui ti siedi (ischio) fino al ginocchio.",
    funzione: "Piegano il ginocchio, estendono l'anca, frenano la gamba nello sprint.",
    problemi: [["Stiramento", "Il più comune negli sport di scatto: fitta dietro la coscia."], ["Tendinopatia prossimale", "Dolore all'osso su cui ti siedi, peggiora seduto."], ["Rigidità", "Fatica a toccare le punte dei piedi."]],
    domande: [
      D("Dove lo senti?", [["In alto, all'osso su cui mi siedo", { prossimale: 3 }, { pin: [226, 520] }], ["A metà coscia", { stiramento: 2, rigidita: 1 }, { pin: [240, 590] }], ["Dietro al ginocchio", { distale: 2 }, { pin: [238, 676] }]]),
      D("Com'è iniziato?", [["Fitta improvvisa correndo o scattando", { stiramento: 3 }], ["Piano piano, peggiora seduto", { prossimale: 3 }], ["Non fa male, sono solo rigido", { rigidita: 3 }]]),
      D("Hai un livido dietro la coscia?", [["No", {}], ["Sì", { stiramento: 2 }, { flag: "giallo", note: "Un livido indica una lesione più importante: fatti valutare." }]]),
    ],
    ipotesi: {
      stiramento: ["Stiramento degli ischiocrurali", 2, "Niente sprint e allungamenti aggressivi per le prime 2 settimane. La ripresa va fatta per gradi."],
      prossimale: ["Tendinopatia prossimale", 2, "Evita stretching intenso e sedute lunghe su superfici dure. Rinforzo progressivo."],
      distale: ["Tendini dietro il ginocchio", 1, "Spesso sovraccarico da corsa. Rinforzo e riduzione del carico."],
      rigidita: ["Rigidità", 1, "Allungamento costante e rinforzo in allungamento (stacco rumeno)."],
    },
    rimedi: [R.ghiaccio("Nelle prime 48 ore dopo una fitta."), R.riposo("Cammina normalmente; evita corse veloci e salite."), R.calore("Solo dopo i primi 3 giorni.")],
    esercizi: ["stretch-ischio", "ponte-mono", "rdl-mono"],
    medico: ["Schiocco con livido esteso dietro la coscia.", "Non riesci a camminare normalmente.", "Formicolio lungo la gamba."],
  });

  P({
    id: "polpaccio", layer: "muscoli", view: "b", region: "gamba", at: [242, 752], zoom: 280, parts: ["gastroLat", "gastroMed", "soleo"],
    name: "Polpaccio", sub: "Gastrocnemio e soleo",
    dove: "Dietro la gamba: il gastrocnemio (due «pance») in superficie e il soleo sotto; finiscono nel tendine d'Achille.",
    funzione: "Spinge il corpo in avanti a ogni passo, salto e scatto. Pompa il sangue verso il cuore.",
    problemi: [["Crampi", "Contrazione improvvisa e dolorosa, spesso di notte o a fine gara."], ["Stiramento («colpo di frusta»)", "Fitta come una sassata nel polpaccio."], ["Contrattura", "Polpaccio duro dopo corsa o salti."]],
    domande: [
      D("Com'è iniziato?", [["Fitta improvvisa, come un colpo", { stiramento: 3 }], ["Crampi ripetuti", { crampi: 3 }], ["Polpaccio duro dopo allenamenti", { contrattura: 3 }]]),
      D("Il polpaccio è gonfio, caldo e arrossato senza un trauma?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Gonfiore caldo del polpaccio senza trauma può essere una trombosi: vai subito dal medico o al pronto soccorso." }]]),
      D("Riesci a stare in punta di piedi?", [["Sì", { contrattura: 1, crampi: 1 }], ["Con dolore", { stiramento: 2 }], ["No", { stiramento: 2 }, { flag: "rosso", note: "Se non riesci a spingere sulla punta, va escluso un problema al tendine d'Achille." }]]),
    ],
    ipotesi: {
      crampi: ["Crampi muscolari", 1, "Spesso fatica, caldo e poca idratazione. Allungamento immediato, acqua e sali."],
      stiramento: ["Stiramento del polpaccio", 2, "Cammina con passi corti, alza un po' il tallone (rialzo nella scarpa) e riprendi la corsa dopo 2–4 settimane."],
      contrattura: ["Contrattura", 1, "Rullo, calore, allungamenti e rinforzo."],
    },
    eta: { over: [60, "Dopo i 60 anni, un gonfiore del polpaccio va sempre fatto controllare."] },
    rimedi: [R.massaggio("Rullo sotto il polpaccio, lento, 1–2 minuti."), R.calore(), R.ghiaccio("Solo nelle prime 48 ore dopo una fitta."), R.postura("Bevi durante gli allenamenti lunghi; reintegra i sali quando sudi molto.")],
    esercizi: ["stretch-polpaccio", "calf-raise", "eccentrico-polpaccio"],
    medico: ["Polpaccio gonfio, caldo, rosso senza trauma: urgente (possibile trombosi).", "Non riesci a stare in punta di piedi.", "Livido esteso fino alla caviglia."],
  });

  /* ===================== TENDINI E LEGAMENTI ===================== */
  P({
    id: "cuffia", layer: "tendini", view: "f", region: "spalla", at: [274, 210], zoom: 210, parts: ["sovraspinatoT", "capoLungo"],
    name: "Cuffia dei rotatori", sub: "Sovraspinato e tendini della spalla",
    dove: "Quattro piccoli muscoli che avvolgono la testa dell'omero; il tendine del sovraspinato passa sotto l'acromion, la punta ossea della spalla.",
    funzione: "Tengono la testa dell'omero centrata mentre il braccio si muove. Senza di loro il deltoide la spingerebbe in alto.",
    problemi: [["Tendinopatia", "Dolore sul lato del braccio alzandolo, peggiora la notte."], ["Conflitto (impingement)", "Dolore tra 60° e 120° di elevazione."], ["Lesione", "Debolezza nell'alzare il braccio, soprattutto dopo i 50 anni o un trauma."]],
    domande: [
      D("Alzando il braccio di lato, c'è un arco doloroso a metà?", [["Sì", { conflitto: 3 }], ["Fa male di più in alto, oltre la spalla", { ac: 2 }], ["No", { tendinopatia: 1 }]]),
      D("Riesci ad alzare il braccio da solo fino in alto?", [["Sì, anche se fa male", { tendinopatia: 2, conflitto: 1 }], ["No, ma se mi aiutano con l'altra mano sì", { lesione: 4 }, { flag: "rosso", note: "Se il braccio sale solo con aiuto, va esclusa una lesione del tendine: fatti visitare." }], ["No, la spalla è bloccata in ogni direzione", { capsulite: 4 }]]),
      D("Il dolore ti sveglia la notte?", [["Sì", { tendinopatia: 2 }], ["No", { conflitto: 1 }]]),
    ],
    ipotesi: {
      tendinopatia: ["Tendinopatia della cuffia", 2, "Il tendine è sovraccaricato. Risponde molto bene al rinforzo progressivo in 6–12 settimane."],
      conflitto: ["Conflitto subacromiale", 2, "Il tendine si irrita sotto l'acromion. Lavora su scapole, postura e rotatori esterni."],
      lesione: ["Sospetta lesione della cuffia", 3, "Serve una visita ortopedica e spesso un'ecografia."],
      capsulite: ["Possibile spalla congelata", 2, "Se è bloccata in tutte le direzioni, guarda il punto «Spalla rigida» nello strato Ossa."],
      ac: ["Articolazione acromion-claveare", 2, "Il dolore in cima alla spalla in alto viene spesso dall'articolazione con la clavicola."],
    },
    eta: { over: [50, "Dopo i 50 anni le lesioni della cuffia sono più frequenti, anche senza traumi: se c'è debolezza fai un'ecografia."] },
    rimedi: [R.ghiaccio("15 minuti dopo gli esercizi se la spalla brucia."), R.gel(), R.riposo("Evita per 2–3 settimane movimenti veloci sopra la testa e di dormire sul lato dolente."), R.postura("Dormi con un cuscino sotto il braccio dolente.")],
    esercizi: ["pendolo", "rotazione-esterna", "wall-slide", "rematore-elastico"],
    medico: ["Non riesci ad alzare il braccio da solo.", "Dopo una caduta con dolore forte o spalla deformata.", "Dolore notturno da più di 3–4 settimane."],
  });

  P({
    id: "epicondilite", layer: "tendini", view: "b", region: "gomito", at: [312, 388], zoom: 190, parts: ["epicondiloT"],
    name: "Epicondilite laterale", sub: "Gomito del tennista",
    dove: "Sulla sporgenza ossea esterna del gomito (epicondilo), dove si attaccano i muscoli che estendono polso e dita.",
    funzione: "Il tendine trasmette la forza degli estensori: afferrare, sollevare con il palmo in giù, usare il mouse.",
    problemi: [["Tendinopatia laterale", "Dolore all'esterno del gomito quando stringi o sollevi una tazza."], ["Sovraccarico da lavoro", "Mouse, attrezzi, giardinaggio, racchetta."]],
    domande: [
      D("Sollevare una sedia con il palmo verso il basso fa male all'esterno del gomito?", [["Sì", { epicondilite: 3 }], ["No", { altro: 1 }]]),
      D("Dove lo senti esattamente?", [["Sull'osso esterno del gomito", { epicondilite: 3 }, { pin: [312, 384] }], ["Qualche cm più in basso, nel muscolo", { tunnel: 2 }, { pin: [314, 412] }], ["All'interno del gomito", { altro: 2 }, { note: "L'interno del gomito è il punto «Epitrocleite»." }]]),
      D("Da quanto?", [["Meno di 6 settimane", { epicondilite: 1 }], ["Da mesi", { epicondilite: 1 }, { flag: "giallo" }]]),
    ],
    ipotesi: {
      epicondilite: ["Epicondilite laterale", 2, "Molto comune tra i 35 e i 55 anni. Migliora con carico progressivo (esercizi eccentrici) in 2–3 mesi; il riposo totale non basta."],
      tunnel: ["Possibile irritazione del nervo radiale", 2, "Se il dolore è più in basso e diffuso, può essere coinvolto un nervo. Chiedi una valutazione."],
      altro: ["Origine diversa", 1, "Guarda anche gli altri punti del gomito."],
    },
    rimedi: [R.tutore("Un tutore a fascetta 2–3 cm sotto il gomito scarica il tendine durante le attività."), R.ghiaccio(), R.gel(), R.postura("Solleva con il palmo verso l'alto quando puoi; mouse verticale se usi molto il computer.")],
    esercizi: ["polso-eccentrico-est", "stretch-estensori", "rematore-elastico"],
    medico: ["Gomito gonfio, caldo o arrossato.", "Formicolio alle dita.", "Nessun miglioramento dopo 3 mesi di esercizi."],
  });

  P({
    id: "epitrocleite", layer: "tendini", view: "f", region: "gomito", at: [292, 388], zoom: 190, parts: ["epitrocleaT"],
    name: "Epitrocleite", sub: "Gomito del golfista",
    dove: "Sulla sporgenza ossea interna del gomito (epitroclea), dove si attaccano i flessori di polso e dita.",
    funzione: "Trasmette la forza di chiusura della mano e della flessione del polso.",
    problemi: [["Tendinopatia mediale", "Dolore all'interno del gomito stringendo o lanciando."], ["Irritazione del nervo ulnare", "Lì vicino passa il nervo del «gomito che fa la scossa»."]],
    domande: [
      D("Stringere forte qualcosa fa male all'interno del gomito?", [["Sì", { epitrocleite: 3 }], ["No", {}]]),
      D("Anulare e mignolo formicolano?", [["No", { epitrocleite: 1 }], ["Sì", { ulnare: 4 }, { note: "Vedi il punto «Nervo ulnare» nello strato Nervi." }]]),
    ],
    ipotesi: {
      epitrocleite: ["Epitrocleite", 2, "Tendinopatia dei flessori. Si tratta con carico progressivo e riducendo le prese intense per qualche settimana."],
      ulnare: ["Coinvolgimento del nervo ulnare", 2, "Evita di tenere il gomito piegato a lungo e di appoggiarlo sul tavolo."],
    },
    rimedi: [R.ghiaccio(), R.gel(), R.tutore("Una fascetta sotto il gomito può aiutare durante le prese."), R.riposo("Riduci trazioni e presa intensa per 2–3 settimane.")],
    esercizi: ["polso-eccentrico-fless", "stretch-flessori", "glide-ulnare"],
    medico: ["Formicolio costante o debolezza delle dita.", "Dolore dopo un lancio con schiocco.", "Nessun miglioramento in 3 mesi."],
  });

  P({
    id: "dequervain", layer: "tendini", view: "f", region: "polso", at: [334, 496], zoom: 170, parts: ["dequervain", "retinacolo"],
    name: "Tendini del polso", sub: "Tenosinovite di De Quervain",
    dove: "Sul lato del pollice del polso, dove due tendini scorrono in una guaina stretta.",
    funzione: "Allontanano ed estendono il pollice: prendere in braccio, scrivere sul telefono, presa a martello.",
    problemi: [["Tenosinovite di De Quervain", "Dolore sul lato del pollice, peggiora prendendo in braccio un bambino."], ["Sovraccarico del polso", "Dolore generico dopo push-up o front squat."]],
    domande: [
      D("Chiudi il pollice nel pugno e piega il polso verso il mignolo: fa male sul lato del pollice?", [["Sì, molto", { dequervain: 4 }], ["Un po'", { dequervain: 2, polso: 1 }], ["No", { polso: 2 }]]),
      D("Dove senti il dolore?", [["Lato del pollice", { dequervain: 2 }, { pin: [334, 494] }], ["Al centro del dorso", { polso: 2 }, { pin: [318, 496] }], ["Lato del mignolo", { polso: 2 }, { pin: [310, 498] }]]),
      D("Usi molto lo smartphone, sollevi spesso un bambino o fai molti push-up?", [["Sì", { dequervain: 2 }], ["No", {}]]),
    ],
    ipotesi: {
      dequervain: ["Tenosinovite di De Quervain", 2, "Frequente nelle neo-mamme e con tanto uso del telefono. Un tutore per il pollice e riposo relativo aiutano molto."],
      polso: ["Sovraccarico del polso", 1, "Riduci i carichi in estensione (push-up sui palmi: usa i pugni o le maniglie)."],
    },
    sesso: { f: "Dopo il parto e durante l'allattamento questa infiammazione è molto comune." },
    rimedi: [R.tutore("Tutore con stecca per pollice, soprattutto di notte, per 2–4 settimane."), R.ghiaccio(), R.gel(), R.postura("Usa il telefono con due mani; prendi il bambino con le mani a cucchiaio, non a «L».")],
    esercizi: ["deviazione-radiale", "stretch-estensori"],
    medico: ["Gonfiore con arrossamento e calore.", "Nessun miglioramento dopo 4–6 settimane: un'infiltrazione può essere risolutiva.", "Dopo una caduta sulla mano (escludere frattura dello scafoide)."],
  });

  P({
    id: "rotuleo", layer: "tendini", view: "f", region: "ginocchio", at: [237, 712], zoom: 190, parts: ["rotuleo", "quadT"],
    name: "Tendine rotuleo", sub: "Ginocchio del saltatore",
    dove: "Va dalla punta inferiore della rotula alla tibia. Sopra la rotula c'è il tendine del quadricipite.",
    funzione: "Trasmette tutta la forza del quadricipite: salti, squat, frenate, scale.",
    problemi: [["Tendinopatia rotulea", "Dolore puntiforme sotto la rotula all'inizio dell'allenamento, poi si «scalda»."], ["Morbo di Osgood-Schlatter", "Nei ragazzi in crescita: bozzo doloroso sotto il ginocchio."]],
    domande: [
      D("Dove indichi il dolore?", [["Proprio sotto la punta della rotula", { tendine: 3 }, { pin: [237, 700] }], ["Più in basso, sull'osso (con un bozzo)", { osgood: 3 }, { pin: [238, 724] }], ["Sopra la rotula", { quad: 3 }, { pin: [240, 660] }]]),
      D("Come si comporta durante l'allenamento?", [["Fa male all'inizio, poi migliora scaldandomi", { tendine: 3 }], ["Peggiora sempre di più", { tendine: 2 }, { flag: "giallo" }], ["Fa male solo dopo", { tendine: 1, quad: 1 }]]),
      D("Fai salti o sport con scatti e frenate?", [["Sì", { tendine: 2 }], ["No", {}]]),
    ],
    ipotesi: {
      tendine: ["Tendinopatia rotulea", 2, "Il tendine vuole carico dosato, non riposo assoluto. Le isometrie (wall sit) riducono il dolore già in pochi giorni."],
      osgood: ["Osgood-Schlatter", 1, "Tipico tra 10 e 15 anni durante la crescita. Si gestisce riducendo salti e corse per qualche settimana."],
      quad: ["Tendine del quadricipite", 2, "Stessa gestione del rotuleo: carico progressivo."],
    },
    eta: { under: [17, "Nei ragazzi in crescita il dolore sotto il ginocchio è spesso Osgood-Schlatter: di solito si risolve con la fine della crescita."] },
    rimedi: [R.ghiaccio("Dopo l'allenamento, 10–15 minuti."), R.tape("Una cinghietta sotto la rotula (cinturino rotuleo) riduce il dolore durante lo sport."), R.riposo("Riduci salti e squat profondi, ma non fermarti del tutto.")],
    esercizi: ["wall-sit", "estensione-ginocchio", "step-down", "squat"],
    medico: ["Ginocchio gonfio dopo un salto o una caduta.", "Non riesci a distendere il ginocchio (possibile rottura).", "Dolore che dura da più di 3 mesi."],
  });

  P({
    id: "legamenti-ginocchio", layer: "tendini", view: "f", region: "ginocchio", at: [216, 702], zoom: 180, parts: ["lcm", "lcl", "lca"],
    name: "Legamenti del ginocchio", sub: "Crociato anteriore e collaterali",
    dove: "I collaterali sono ai lati del ginocchio (interno ed esterno); i crociati sono dentro l'articolazione, incrociati.",
    funzione: "Tengono femore e tibia allineati: impediscono al ginocchio di andare di lato o di scivolare in avanti.",
    problemi: [["Distorsione del collaterale mediale", "Colpo o torsione con il ginocchio che va verso l'interno."], ["Lesione del crociato anteriore", "Torsione con «crack», gonfiore rapido, sensazione di cedimento."]],
    domande: [
      D("Com'è successo?", [["Torsione con il piede fermo a terra e un «crack»", { lca: 4 }, { flag: "rosso" }], ["Colpo o spinta sul lato del ginocchio", { lcm: 3 }], ["Nessun trauma, dolore che è venuto piano", { altro: 3 }]]),
      D("Il ginocchio si è gonfiato entro poche ore?", [["Sì, molto", { lca: 3 }, { flag: "rosso", note: "Gonfiore rapido dopo un trauma indica sangue nell'articolazione: serve una visita ortopedica." }], ["Poco, dopo un giorno", { lcm: 2 }], ["No", { altro: 1 }]]),
      D("Senti che il ginocchio «cede» o non è stabile?", [["Sì", { lca: 3 }], ["No", { lcm: 1 }]]),
    ],
    ipotesi: {
      lca: ["Sospetta lesione del crociato", 3, "Va visitata da un ortopedico e spesso serve una risonanza. Nel frattempo: ghiaccio, gamba alta, niente sport."],
      lcm: ["Distorsione del collaterale", 2, "Di solito guarisce bene senza intervento in 3–8 settimane, a volte con un tutore."],
      altro: ["Origine non legamentosa", 1, "Senza trauma è più probabile un problema di menisco, rotula o tendini: guarda gli altri punti del ginocchio."],
    },
    rimedi: [R.ghiaccio("15 minuti ogni 2–3 ore nei primi 2 giorni, con la gamba sollevata."), R.tutore("Un tutore articolato se il medico lo consiglia."), R.riposo("Cammina solo se non zoppichi; altrimenti stampelle.")],
    esercizi: ["estensione-ginocchio", "equilibrio", "ponte", "step-down"],
    medico: ["Gonfiore rapido dopo un trauma.", "Ginocchio che cede o si blocca.", "Non riesci a caricare il peso.", "Deformità evidente: pronto soccorso."],
  });

  P({
    id: "bandelletta", layer: "tendini", view: "f", region: "coscia", at: [274, 610], zoom: 320, parts: ["itb"],
    name: "Bandelletta ileotibiale", sub: "Sindrome della bandelletta",
    dove: "È una fascia robusta sul lato esterno della coscia, dal bacino fino sotto il ginocchio.",
    funzione: "Stabilizza anca e ginocchio sul lato esterno durante corsa e camminata.",
    problemi: [["Sindrome della bandelletta", "Dolore sul lato esterno del ginocchio nei runner, dopo un certo numero di km."], ["Tensione laterale", "Coscia esterna dura, spesso per glutei deboli."]],
    domande: [
      D("Dove senti il dolore?", [["Sul lato esterno del ginocchio", { itbs: 3 }, { pin: [262, 692] }], ["Lungo tutta la coscia esterna", { tensione: 3 }, { pin: [278, 590] }], ["Sul lato dell'anca", { gluteo: 3 }, { pin: [276, 486] }]]),
      D("Compare sempre dopo un certo numero di km di corsa?", [["Sì, e poi devo fermarmi", { itbs: 3 }], ["No", { tensione: 1 }]]),
      D("Corri spesso in discesa o su strade inclinate?", [["Sì", { itbs: 2 }], ["No", {}]]),
    ],
    ipotesi: {
      itbs: ["Sindrome della bandelletta", 2, "Riduci km e discese per 2–4 settimane e rinforza i glutei: è la causa principale."],
      tensione: ["Tensione laterale", 1, "Il rullo dà sollievo ma la bandelletta non si «allunga»: rinforza il gluteo medio."],
      gluteo: ["Origine glutea", 2, "Vedi il punto «Gluteo medio»."],
    },
    rimedi: [R.massaggio("Rullo sui muscoli della coscia esterna (vasto laterale), non sull'osso del ginocchio."), R.ghiaccio("Sul lato del ginocchio dopo la corsa."), R.riposo("Accorcia il passo e aumenta la cadenza del 5–10%.")],
    esercizi: ["abduzione-fianco", "ponte-mono", "step-down"],
    medico: ["Ginocchio gonfio.", "Dolore anche a riposo.", "Nessun miglioramento dopo 6 settimane."],
  });

  P({
    id: "caviglia", layer: "tendini", view: "f", region: "piede", at: [246, 914], zoom: 150, parts: ["atfl", "deltoideo"],
    name: "Legamenti della caviglia", sub: "Distorsione di caviglia",
    dove: "I legamenti esterni (il più colpito è il peroneo-astragalico anteriore) sono davanti al malleolo esterno; il deltoideo è all'interno.",
    funzione: "Tengono stabile la caviglia quando il piede si gira.",
    problemi: [["Distorsione in inversione", "Il piede si gira all'interno: dolore e gonfiore all'esterno."], ["Instabilità cronica", "Distorsioni ripetute, la caviglia «non tiene»."]],
    domande: [
      D("Subito dopo, riuscivi a fare 4 passi?", [["Sì", { lieve: 2 }], ["No", { grave: 3 }, { flag: "rosso", note: "Se non riesci a fare 4 passi o fa male premere sull'osso del malleolo, serve una radiografia (regole di Ottawa)." }]]),
      D("Premendo sul bordo posteriore dell'osso del malleolo fa molto male?", [["No, fa male davanti al malleolo", { lieve: 2, media: 1 }, { pin: [246, 914] }], ["Sì, proprio sull'osso", { grave: 3 }, { flag: "rosso", pin: [250, 902] }]]),
      D("Quanto è gonfia?", [["Poco", { lieve: 2 }], ["Molto, con livido", { media: 3 }], ["Ho distorsioni ripetute", { instabile: 4 }]]),
    ],
    ipotesi: {
      lieve: ["Distorsione lieve", 1, "Ghiaccio, gamba alta e movimento precoce: di solito si torna allo sport in 1–3 settimane."],
      media: ["Distorsione moderata", 2, "Con livido e gonfiore: tutore o cavigliera per 2–4 settimane e propriocezione."],
      grave: ["Possibile frattura o lesione grave", 3, "Fai una radiografia prima di caricare."],
      instabile: ["Instabilità cronica", 2, "Serve un percorso di propriocezione di almeno 6–8 settimane. Una cavigliera aiuta nello sport."],
    },
    rimedi: [R.ghiaccio("15 minuti ogni 2–3 ore nelle prime 48–72 ore, con la caviglia più alta del cuore."), R.tutore("Cavigliera semirigida per le attività nelle prime settimane."), R.tape("Il taping funzionale aiuta al ritorno in campo."), R.gel()],
    esercizi: ["pompa-caviglia", "equilibrio", "calf-raise", "tibiale-raise"],
    medico: ["Non riesci a fare 4 passi.", "Dolore premendo sull'osso dei malleoli o alla base del 5° dito.", "Piede freddo, pallido o insensibile: pronto soccorso.", "Gonfiore che non scende dopo una settimana."],
  });

  P({
    id: "achille", layer: "tendini", view: "b", region: "piede", at: [232, 880], zoom: 210, parts: ["achille"],
    name: "Tendine d'Achille", sub: "Tendinopatia achillea",
    dove: "È il tendine più grosso del corpo: unisce il polpaccio al calcagno, dietro la caviglia.",
    funzione: "Trasmette la spinta del polpaccio: a ogni passo, salto e scatto.",
    problemi: [["Tendinopatia della porzione media", "Dolore 2–6 cm sopra il tallone, rigido al mattino."], ["Tendinopatia inserzionale", "Dolore proprio dove il tendine entra nel tallone."], ["Rottura", "Colpo come un calcio dietro la caviglia, non si riesce a spingere."]],
    domande: [
      D("Dove senti il dolore?", [["2–6 cm sopra il tallone", { media: 3 }, { pin: [232, 872] }], ["Proprio sul tallone, dove si attacca", { inserzionale: 3 }, { pin: [232, 906] }]]),
      D("Al mattino i primi passi sono rigidi e dolorosi?", [["Sì", { media: 2, inserzionale: 1 }], ["No", {}]]),
      D("Hai sentito un colpo come un calcio dietro la caviglia?", [["No", {}], ["Sì", { rottura: 5 }, { flag: "urgente", note: "Un colpo secco con debolezza nello spingere può essere una rottura: pronto soccorso o ortopedico entro 24–48 ore." }]]),
    ],
    ipotesi: {
      media: ["Tendinopatia achillea", 2, "Risponde molto bene agli esercizi eccentrici e di carico (12 settimane). Riduci salite e velocità."],
      inserzionale: ["Tendinopatia inserzionale", 2, "Evita di far scendere il tallone sotto il gradino: lavora su superficie piana. Un piccolo rialzo nella scarpa aiuta."],
      rottura: ["Sospetta rottura del tendine", 3, "Non caricare: serve una visita urgente."],
    },
    eta: { over: [35, "Tra i 35 e i 50 anni, negli sport occasionali (calcetto, padel), il rischio di rottura è più alto: riscaldati sempre bene."] },
    rimedi: [R.ghiaccio("Dopo la corsa, 10 minuti."), R.tape("Rialzo nel tallone di 0,5–1 cm per qualche settimana."), R.riposo("Sostituisci salti e salite con bici o nuoto finché il dolore è sopra 3/10.")],
    esercizi: ["eccentrico-polpaccio", "calf-raise", "stretch-polpaccio"],
    medico: ["Colpo secco con debolezza: urgente.", "Tendine gonfio e rosso.", "Nessun miglioramento dopo 3 mesi di esercizi.", "Se prendi antibiotici fluorochinolonici e compare dolore al tendine."],
  });

  P({
    id: "fascia-plantare", layer: "tendini", view: "b", region: "piede", at: [232, 950], zoom: 150, parts: ["fasciaPlantare", "calcagno"],
    name: "Fascia plantare", sub: "Fascite plantare",
    dove: "È una fascia robusta sotto la pianta del piede, dal tallone alle dita: sostiene l'arco plantare.",
    funzione: "Tiene l'arco del piede e restituisce energia nella spinta.",
    problemi: [["Fascite plantare", "Dolore sotto il tallone ai primi passi del mattino o dopo essere stati seduti."], ["Sovraccarico", "Dopo aver aumentato camminate o corsa, o con scarpe troppo piatte."]],
    domande: [
      D("I primi passi al mattino sono i più dolorosi?", [["Sì, poi migliora un po'", { fascite: 4 }], ["No, fa male soprattutto a fine giornata", { sovraccarico: 2 }]]),
      D("Dove è il dolore?", [["Sotto il tallone, verso l'interno", { fascite: 3 }, { pin: [224, 952] }], ["Dietro il tallone", { achille: 3 }, { note: "Dietro il tallone è più probabile il tendine d'Achille." }], ["Sotto l'avampiede", { morton: 3 }, { note: "Sotto l'avampiede guarda «Neuroma di Morton» nello strato Nervi." }]]),
      D("Hai formicolio o bruciore alla pianta?", [["No", {}], ["Sì", { nervo: 3 }, { flag: "giallo" }]]),
    ],
    ipotesi: {
      fascite: ["Fascite plantare", 2, "Molto frequente tra i 40 e i 60 anni. Migliora con allungamenti, rinforzo e scarpe adeguate in 6–12 settimane."],
      sovraccarico: ["Sovraccarico del piede", 1, "Riduci le camminate lunghe per qualche giorno e scegli scarpe ammortizzate."],
      achille: ["Possibile origine achillea", 2, "Vedi «Tendine d'Achille»."],
      morton: ["Possibile origine nervosa", 2, "Vedi «Neuroma di Morton»."],
      nervo: ["Componente nervosa", 2, "Il bruciore fa pensare a un nervo: chiedi una valutazione."],
    },
    rimedi: [R.massaggio("Rotola una bottiglietta d'acqua ghiacciata sotto la pianta per 5 minuti la sera."), R.postura("Non camminare scalzo sulle superfici dure; usa scarpe con un po' di rialzo al tallone."), R.tape("Plantari o talloniere in silicone danno sollievo."), R.gel()],
    esercizi: ["rullo-plantare", "stretch-polpaccio", "calf-raise"],
    medico: ["Dolore dopo una caduta o un salto (escludere frattura).", "Formicolio o intorpidimento della pianta.", "Nessun miglioramento dopo 3 mesi."],
  });

  /* ===================== NERVI ===================== */
  P({
    id: "cervicobrachialgia", layer: "nervi", view: "b", region: "collo", at: [216, 182], zoom: 300, parts: ["radiciCerv", "plessoB"],
    name: "Radici cervicali", sub: "Cervicobrachialgia",
    dove: "Dalle vertebre del collo escono i nervi che formano il plesso brachiale e vanno a spalla, braccio e mano.",
    funzione: "Portano movimento e sensibilità all'arto superiore.",
    problemi: [["Cervicobrachialgia", "Dolore dal collo che scende nel braccio, con formicolio."], ["Ernia cervicale", "Il disco preme sulla radice: dolore, formicolio, a volte debolezza."]],
    domande: [
      D("Fin dove scende il dolore o il formicolio?", [["Spalla", { lieve: 2 }, { pin: [262, 220] }], ["Braccio fino al gomito", { radice: 2 }, { pin: [298, 330] }], ["Fino alla mano e alle dita", { radice: 3 }, { pin: [326, 540] }]]),
      D("Hai perso forza nella mano o nel braccio?", [["No", {}], ["Sì, mi cadono le cose", { radice: 3 }, { flag: "rosso", note: "La perdita di forza va valutata rapidamente da un medico." }]]),
      D("Alzare il braccio e appoggiare la mano sulla testa dà sollievo?", [["Sì", { radice: 3 }], ["No", { lieve: 1 }]]),
    ],
    ipotesi: {
      lieve: ["Dolore cervicale riferito", 1, "Il collo irritato proietta dolore alla spalla. Movimento dolce, calore, postura."],
      radice: ["Radicolopatia cervicale", 2, "Una radice nervosa è irritata. Nella maggior parte dei casi migliora in 6–12 settimane con esercizi e tempo."],
    },
    rimedi: [R.calore("Sul collo, non sul braccio."), R.postura("Dormi con un cuscino che riempia la curva del collo; evita di guardare in basso a lungo."), R.riposo("Evita esercizi sopra la testa con carichi.")],
    esercizi: ["chin-tuck", "glide-mediano", "stretch-trapezio"],
    medico: ["Debolezza progressiva del braccio o della mano.", "Disturbi nel camminare, mani goffe, disturbi urinari: urgente.", "Dolore insopportabile che non dà tregua né di giorno né di notte."],
  });

  P({
    id: "tunnel-carpale", layer: "nervi", view: "f", region: "polso", at: [320, 500], zoom: 210, parts: ["mediano"],
    name: "Nervo mediano", sub: "Sindrome del tunnel carpale",
    dove: "Il nervo mediano attraversa il polso in un canale stretto (tunnel carpale) insieme ai tendini flessori.",
    funzione: "Dà sensibilità a pollice, indice, medio e metà anulare, e muove i muscoli del pollice.",
    problemi: [["Tunnel carpale", "Formicolio notturno a pollice, indice e medio; ci si sveglia scuotendo la mano."], ["Irritazione da sovraccarico", "Dopo lavori con il polso piegato a lungo."]],
    domande: [
      D("Quali dita formicolano?", [["Pollice, indice e medio", { tunnel: 4 }, { pin: [328, 560] }], ["Anulare e mignolo", { ulnare: 4 }, { note: "Questo fa pensare al nervo ulnare." }], ["Tutta la mano", { cervicale: 2, tunnel: 1 }]]),
      D("Ti svegli di notte e devi scuotere la mano?", [["Sì", { tunnel: 3 }], ["No", {}]]),
      D("La base del pollice è più piatta o fai fatica ad abbottonarti?", [["No", {}], ["Sì", { tunnel: 2 }, { flag: "rosso", note: "Se il muscolo del pollice si assottiglia, il nervo è compresso da tempo: serve una visita e un'elettromiografia." }]]),
    ],
    ipotesi: {
      tunnel: ["Sindrome del tunnel carpale", 2, "Più frequente nelle donne, in gravidanza e sopra i 40 anni. Un tutore notturno con polso dritto aiuta in molti casi."],
      ulnare: ["Nervo ulnare", 2, "Vedi il punto «Nervo ulnare»."],
      cervicale: ["Possibile origine cervicale", 2, "Se formicola tutta la mano, controlla anche il collo."],
    },
    sesso: { f: "È più frequente nelle donne, soprattutto in gravidanza e in menopausa." },
    rimedi: [R.tutore("Tutore notturno che tenga il polso dritto (neutro) per 4–6 settimane."), R.postura("Evita di dormire con i polsi piegati e di tenere il polso piegato a lungo su mouse o telefono."), R.riposo()],
    esercizi: ["glide-mediano", "stretch-flessori"],
    medico: ["Muscolo alla base del pollice che si assottiglia.", "Formicolio costante giorno e notte.", "Perdita di forza o oggetti che cadono."],
  });

  P({
    id: "ulnare", layer: "nervi", view: "f", region: "gomito", at: [287, 386], zoom: 240, parts: ["ulnare"],
    name: "Nervo ulnare", sub: "Sindrome del tunnel cubitale",
    dove: "Passa nel canale dietro la sporgenza interna del gomito: è il punto del «gomito che fa la scossa».",
    funzione: "Dà sensibilità ad anulare e mignolo e muove molti piccoli muscoli della mano.",
    problemi: [["Tunnel cubitale", "Formicolio ad anulare e mignolo, peggiora con il gomito piegato (telefono, dormire)."], ["Compressione al polso", "Più rara: ciclisti con le mani sul manubrio."]],
    domande: [
      D("Formicolio ad anulare e mignolo?", [["Sì", { cubitale: 3 }], ["No, altre dita", { altro: 3 }]]),
      D("Peggiora tenendo il gomito piegato a lungo?", [["Sì", { cubitale: 3 }, { pin: [287, 384] }], ["No, peggiora in bici con le mani sul manubrio", { polso: 3 }, { pin: [312, 510] }]]),
      D("Hai difficoltà a incrociare le dita o perdi precisione?", [["No", {}], ["Sì", { cubitale: 2 }, { flag: "rosso", note: "La debolezza dei muscoli della mano va valutata da un medico." }]]),
    ],
    ipotesi: {
      cubitale: ["Sindrome del tunnel cubitale", 2, "Evita di tenere il gomito piegato a lungo e di appoggiarci sopra. Di notte un asciugamano avvolto sul gomito lo tiene più dritto."],
      polso: ["Compressione al polso (canale di Guyon)", 1, "Guanti imbottiti e cambi di presa in bici."],
      altro: ["Altro nervo", 1, "Guarda «Tunnel carpale» o «Radici cervicali»."],
    },
    rimedi: [R.postura("Usa auricolari per telefonare; non appoggiare il gomito sul bracciolo o sul finestrino."), R.tutore("Di notte, un asciugamano arrotolato intorno al gomito impedisce di piegarlo troppo.")],
    esercizi: ["glide-ulnare", "chin-tuck"],
    medico: ["Mano che perde forza o muscoli che si assottigliano.", "Formicolio costante.", "Dopo un trauma al gomito."],
  });

  P({
    id: "sciatico", layer: "nervi", view: "b", region: "lombare", at: [238, 566], zoom: 560, parts: ["sciatico", "tibiale", "peroneoB", "radiciLomb"],
    name: "Nervo sciatico", sub: "Sciatalgia · lombosciatalgia",
    dove: "È il nervo più lungo e grosso del corpo: nasce dalle radici lombari e sacrali, passa sotto il gluteo e scende dietro la coscia fino al piede.",
    funzione: "Muove la gamba e il piede e porta la sensibilità di gran parte della gamba.",
    problemi: [["Sciatalgia da ernia o protrusione", "Dolore che dalla schiena scende sotto il ginocchio, spesso con formicolio."], ["Sindrome del piriforme", "Il nervo è irritato nel gluteo."], ["Stenosi", "Dopo i 60 anni, gambe pesanti camminando che migliorano sedendosi."]],
    domande: [
      D("Fin dove arriva il dolore?", [["Gluteo e dietro la coscia", { piriforme: 2, radice: 1 }, { pin: [238, 540] }], ["Sotto il ginocchio, nel polpaccio", { radice: 3 }, { pin: [234, 760] }], ["Fino al piede e alle dita", { radice: 4 }, { pin: [228, 920] }]]),
      D("Tossire o starnutire aumenta il dolore alla gamba?", [["Sì", { radice: 3 }], ["No", { piriforme: 1 }]]),
      D("Camminando le gambe si appesantiscono e ti devi sedere per farle passare?", [["Sì", { stenosi: 4 }], ["No", {}]]),
      D("Hai perso forza (piede che «cade», non riesci a stare sulle punte o sui talloni)?", [["No", {}], ["Sì", { radice: 2 }, { flag: "rosso", note: "La perdita di forza alla gamba va valutata rapidamente." }]]),
    ],
    ipotesi: {
      radice: ["Sciatalgia radicolare", 2, "Una radice lombare è irritata (spesso da un disco). In 9 casi su 10 migliora entro 6–12 settimane con movimento ed esercizi."],
      piriforme: ["Origine glutea", 2, "Il nervo è irritato nel gluteo: vedi «Piriforme»."],
      stenosi: ["Possibile stenosi lombare", 2, "Più frequente dopo i 60 anni. Esercizi in flessione e bici aiutano; serve una valutazione medica."],
    },
    eta: { over: [60, "Dopo i 60 anni il dolore alle gambe camminando può dipendere da stenosi o dalla circolazione: fatti visitare."] },
    rimedi: [R.calore("Sulla zona lombare."), R.riposo("Cammina a passi brevi ogni ora; evita di stare seduto a lungo e di sollevare pesi."), R.postura("Dormi sul fianco con un cuscino tra le ginocchia o supino con un cuscino sotto le ginocchia.")],
    esercizi: ["glide-sciatico", "mckenzie", "ginocchia-petto", "bird-dog"],
    medico: ["Disturbi urinari, intorpidimento all'inguine: pronto soccorso.", "Piede che cade o perdita di forza.", "Dolore insopportabile nonostante i farmaci.", "Febbre o storia di tumore."],
  });

  P({
    id: "meralgia", layer: "nervi", view: "f", region: "coscia", at: [270, 530], zoom: 260, parts: ["cutFemLat"],
    name: "Nervo cutaneo femorale laterale", sub: "Meralgia parestesica",
    dove: "Un nervo solo sensitivo che passa vicino alla sporgenza ossea del bacino (spina iliaca) e arriva alla pelle della coscia esterna.",
    funzione: "Porta la sensibilità della pelle sul lato della coscia.",
    problemi: [["Meralgia parestesica", "Bruciore, formicolio o pelle «addormentata» sul lato della coscia."]],
    domande: [
      D("Hai bruciore o pelle insensibile sul lato della coscia, senza dolore muscolare?", [["Sì", { meralgia: 4 }, { pin: [274, 560] }], ["No, ho dolore profondo", { altro: 3 }]]),
      D("Porti cinture o pantaloni stretti, o sei aumentato di peso / in gravidanza?", [["Sì", { meralgia: 2 }], ["No", {}]]),
      D("Hai debolezza nella gamba?", [["No", {}], ["Sì", { altro: 3 }, { flag: "rosso", note: "Questo nervo non dà debolezza: se c'è, la causa è altrove." }]]),
    ],
    ipotesi: {
      meralgia: ["Meralgia parestesica", 1, "Fastidiosa ma benigna: spesso passa togliendo la compressione (cinture, pantaloni stretti)."],
      altro: ["Origine diversa", 2, "Il dolore profondo o la debolezza indicano un'altra causa: fatti valutare."],
    },
    sesso: { f: "Frequente in gravidanza: di solito si risolve dopo il parto." },
    rimedi: [R.postura("Evita cinture strette, pantaloni a vita bassa stretti e marsupi in vita."), R.riposo()],
    esercizi: ["stretch-flessori-anca", "ponte"],
    medico: ["Debolezza della gamba.", "Disturbi che si estendono oltre la coscia.", "Nessun miglioramento in 2–3 mesi."],
  });

  P({
    id: "morton", layer: "nervi", view: "f", region: "piede", at: [228, 940], zoom: 110, parts: ["digitaliPl", "neuroma"],
    name: "Neuroma di Morton", sub: "Nervi digitali plantari",
    dove: "Tra le teste del 3° e 4° metatarso, sotto l'avampiede, un nervo può ispessirsi.",
    funzione: "I nervi digitali portano la sensibilità alle dita.",
    problemi: [["Neuroma di Morton", "Bruciore o scossa tra 3° e 4° dito, come «un sassolino nella scarpa»."], ["Metatarsalgia", "Dolore sotto l'avampiede da sovraccarico."]],
    domande: [
      D("Senti come un sassolino o una scossa tra le dita?", [["Sì, tra 3° e 4° dito", { morton: 4 }, { pin: [226, 944] }], ["No, è un dolore sotto l'avampiede", { metatarsalgia: 3 }, { pin: [218, 942] }]]),
      D("Togliendo la scarpa e massaggiando migliora?", [["Sì", { morton: 2 }], ["No", { metatarsalgia: 1 }]]),
      D("Usi scarpe strette o con il tacco?", [["Spesso", { morton: 2, metatarsalgia: 1 }], ["No", {}]]),
    ],
    ipotesi: {
      morton: ["Neuroma di Morton", 2, "Scarpe larghe in punta e un cuscinetto metatarsale risolvono molti casi."],
      metatarsalgia: ["Metatarsalgia", 1, "Sovraccarico dell'avampiede: scarpe ammortizzate e rinforzo del piede."],
    },
    sesso: { f: "Più frequente nelle donne, soprattutto con tacchi e scarpe strette in punta." },
    rimedi: [R.tape("Cuscinetto (pad) metatarsale da mettere dietro le teste dei metatarsi."), R.postura("Scarpe larghe in punta, niente tacchi alti per qualche settimana."), R.massaggio("Massaggia tra le teste dei metatarsi con il pollice.")],
    esercizi: ["rullo-plantare", "tibiale-raise"],
    medico: ["Intorpidimento costante delle dita.", "Dolore che non migliora con scarpe adatte.", "Gonfiore e arrossamento dell'avampiede."],
  });

  /* ===================== OSSA E ARTICOLAZIONI ===================== */
  P({
    id: "cervicale", layer: "ossa", view: "b", region: "collo", at: [200, 180], central: true, zoom: 230, parts: ["colCerv", "jCervicale"],
    name: "Colonna cervicale", sub: "Vertebre C1–C7",
    dove: "Sette vertebre tra la testa e le spalle; tra una e l'altra ci sono i dischi e piccole articolazioni.",
    funzione: "Sostiene la testa (circa 5 kg) e permette di girarla, piegarla e inclinarla.",
    problemi: [["Cervicalgia meccanica", "Collo rigido e dolente, peggiora con certe posizioni."], ["Artrosi cervicale", "Rigidità e scricchiolii, più comune dopo i 50 anni."], ["Colpo di frusta", "Dopo un incidente."]],
    domande: [
      D("È iniziato dopo un incidente o una caduta?", [["No", {}], ["Sì", { trauma: 4 }, { flag: "rosso", note: "Dopo un trauma, il dolore al collo va valutato da un medico prima di fare esercizi." }]]),
      D("Com'è il dolore?", [["Rigido al mattino, migliora muovendomi", { artrosi: 2, meccanica: 1 }], ["Peggiora a fine giornata, dopo tanto computer", { meccanica: 3 }], ["Scende nel braccio con formicolio", { radice: 3 }]]),
      D("Hai vertigini, visione doppia o difficoltà a parlare o deglutire?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Questi sintomi vanno valutati subito." }]]),
    ],
    ipotesi: {
      meccanica: ["Cervicalgia meccanica", 1, "La forma più comune: postura, stress e poco movimento. Esercizi semplici ogni giorno fanno la differenza."],
      artrosi: ["Rigidità da artrosi", 1, "Normale con l'età: il movimento regolare è la cura migliore."],
      radice: ["Componente nervosa", 2, "Vedi «Radici cervicali» nello strato Nervi."],
      trauma: ["Esito di trauma", 3, "Serve una valutazione medica."],
    },
    eta: { over: [50, "Dopo i 50 anni un po' di artrosi è normale e non è una diagnosi grave: il movimento è la cura migliore."] },
    rimedi: [R.calore(), R.postura("Schermo all'altezza degli occhi, telefono alzato, cuscino che sostenga il collo."), R.riposo("Non immobilizzare il collo con collari se non te lo ha detto il medico.")],
    esercizi: ["chin-tuck", "stretch-trapezio", "circonduzioni-spalle", "estensione-toracica"],
    medico: ["Dopo un incidente o una caduta.", "Vertigini, visione doppia, difficoltà di parola.", "Febbre con collo rigido: pronto soccorso.", "Mani goffe, difficoltà a camminare."],
  });

  P({
    id: "toracica", layer: "ossa", view: "b", region: "schiena", at: [200, 272], central: true, zoom: 320, parts: ["colTor", "jToracica"],
    name: "Colonna dorsale", sub: "Vertebre toraciche T1–T12",
    dove: "Dodici vertebre unite alle costole, tra collo e zona lombare.",
    funzione: "Protegge cuore e polmoni, ruota il busto, sostiene la postura eretta.",
    problemi: [["Rigidità toracica", "Schiena «chiusa», fatica a stare dritti o a ruotare."], ["Blocco costo-vertebrale", "Fitta tra le scapole respirando a fondo."], ["Ipercifosi", "Schiena curva, spalle in avanti."]],
    domande: [
      D("Respirare a fondo dà una fitta in un punto della schiena?", [["Sì", { costale: 3 }], ["No", { rigidita: 1 }]]),
      D("Fatichi a stare dritto o a girarti all'indietro?", [["Sì", { rigidita: 3 }], ["No", {}]]),
      D("Il dolore è comparso dopo un piccolo trauma o senza motivo, con osteoporosi nota?", [["No", {}], ["Sì", { frattura: 4 }, { flag: "rosso", note: "Con l'osteoporosi anche un piccolo trauma può causare una frattura vertebrale." }]]),
    ],
    ipotesi: {
      rigidita: ["Rigidità toracica", 1, "Il tratto dorsale si irrigidisce stando seduti: mobilità e rinforzo dei muscoli tra le scapole."],
      costale: ["Blocco costo-vertebrale", 1, "Fastidioso ma benigno: calore, respirazione e mobilità dolce."],
      frattura: ["Possibile frattura vertebrale", 3, "Serve una radiografia."],
    },
    sesso: { f: "Dopo la menopausa aumenta il rischio di osteoporosi: un dolore dorsale improvviso va controllato." },
    eta: { over: [65, "Dopo i 65 anni un dolore dorsale improvviso va controllato per escludere fratture da osteoporosi."] },
    rimedi: [R.calore(), R.postura("Ogni ora: in piedi, mani sulla nuca, apri i gomiti e respira a fondo 5 volte.")],
    esercizi: ["estensione-toracica", "gatto-cammello", "wall-slide"],
    medico: ["Dolore toracico con fiato corto o sudore: 112.", "Dolore dopo trauma con osteoporosi.", "Dolore notturno con febbre o calo di peso."],
  });

  P({
    id: "lombare", layer: "ossa", view: "b", region: "lombare", at: [200, 398], central: true, zoom: 260, parts: ["colLomb", "dischi", "jLombare"],
    name: "Colonna lombare e dischi", sub: "Vertebre L1–L5 · protrusioni ed ernie",
    dove: "Le cinque vertebre più grandi, in fondo alla schiena. Tra loro ci sono i dischi (gli azzurri nel disegno) e le faccette articolari.",
    funzione: "Sostengono tutto il peso del busto e permettono di piegarsi e ruotare.",
    problemi: [["Protrusione o ernia del disco", "Dolore che peggiora seduto o piegandosi in avanti."], ["Sindrome delle faccette", "Dolore inarcando la schiena o stando in piedi a lungo."], ["Artrosi lombare", "Rigidità al mattino, più comune dopo i 50 anni."]],
    domande: [
      D("Cosa peggiora il dolore?", [["Stare seduto e piegarmi in avanti", { disco: 3 }], ["Inarcare la schiena e stare in piedi fermo", { faccette: 3 }], ["Tutto al mattino, poi migliora muovendomi", { artrosi: 3 }]]),
      D("Il dolore scende nella gamba sotto il ginocchio?", [["No", {}], ["Sì", { disco: 2 }, { note: "Guarda anche «Nervo sciatico» nello strato Nervi." }]]),
      D("Hai disturbi urinari o intorpidimento all'inguine?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Segni di sindrome della cauda equina: pronto soccorso subito." }]]),
    ],
    ipotesi: {
      disco: ["Origine discale", 2, "La maggior parte delle protrusioni migliora con movimento ed esercizi; spesso le estensioni (McKenzie) danno sollievo."],
      faccette: ["Origine dalle faccette articolari", 1, "Gli esercizi in leggera flessione (ginocchia al petto) e il rinforzo del core aiutano."],
      artrosi: ["Artrosi lombare", 1, "Normale con l'età. Il movimento quotidiano è la cura migliore."],
    },
    eta: { over: [50, "Le alterazioni dei dischi viste in risonanza sono molto comuni anche in chi non ha dolore: non spaventarti per il referto."] },
    rimedi: [R.calore(), R.riposo("Cammina più volte al giorno; evita di stare seduto più di 30 minuti di fila."), R.postura("Sedia con supporto lombare; solleva con le gambe, non con la schiena.")],
    esercizi: ["mckenzie", "bird-dog", "ponte", "gatto-cammello"],
    medico: ["Disturbi urinari o intestinali, intorpidimento all'inguine: urgente.", "Debolezza della gamba.", "Febbre, calo di peso, dolore notturno costante.", "Dopo un trauma importante."],
  });

  P({
    id: "sacroiliaca", layer: "ossa", view: "b", region: "lombare", at: [216, 460], zoom: 220, parts: ["sacro", "si", "jSI"],
    name: "Articolazione sacro-iliaca", sub: "Tra osso sacro e bacino",
    dove: "In fondo alla schiena, dove l'osso sacro si unisce al bacino: le due «fossette» sopra i glutei.",
    funzione: "Trasmette il peso dal busto alle gambe; si muove pochissimo ma assorbe gli urti.",
    problemi: [["Disfunzione sacro-iliaca", "Dolore su un lato, sopra il gluteo, salendo le scale o girandosi nel letto."], ["Dolore in gravidanza", "Gli ormoni rendono i legamenti più lassi."], ["Sacroileite", "Infiammazione, a volte legata a malattie reumatiche."]],
    domande: [
      D("Indichi il dolore con un dito sulla fossetta sopra il gluteo?", [["Sì, proprio lì", { si: 4 }, { pin: [218, 458] }], ["No, è più al centro della schiena", { lombare: 3 }, { pin: [200, 410] }]]),
      D("Peggiora salendo le scale, stando su una gamba o girandoti nel letto?", [["Sì", { si: 3 }], ["No", { lombare: 1 }]]),
      D("Hai rigidità al mattino che dura più di 30 minuti e migliora con il movimento (e hai meno di 45 anni)?", [["No", {}], ["Sì", { infiammatoria: 4 }, { flag: "giallo", note: "Questo schema fa pensare a un mal di schiena infiammatorio: parlane con il medico." }]]),
    ],
    ipotesi: {
      si: ["Disfunzione sacro-iliaca", 1, "Risponde bene al rinforzo di glutei e core e a esercizi di mobilità."],
      lombare: ["Origine lombare", 1, "Guarda «Colonna lombare»."],
      infiammatoria: ["Possibile dolore infiammatorio", 2, "Un mal di schiena infiammatorio va inquadrato da un reumatologo."],
    },
    sesso: { f: "In gravidanza e dopo il parto il dolore sacro-iliaco è frequente: una fascia pelvica può aiutare." },
    rimedi: [R.calore(), R.tutore("Una cintura sacro-iliaca può dare sollievo nelle attività, soprattutto in gravidanza."), R.postura("Dormi sul fianco con un cuscino tra le ginocchia; sali in auto girando entrambe le gambe insieme.")],
    esercizi: ["ponte", "ginocchia-petto", "bird-dog", "abduzione-fianco"],
    medico: ["Rigidità mattutina lunga con età inferiore a 45 anni.", "Febbre.", "Dopo una caduta sul sedere."],
  });

  P({
    id: "anca", layer: "ossa", view: "f", region: "anca", at: [248, 488], zoom: 220, parts: ["testaFemore", "jAnca"],
    name: "Articolazione dell'anca", sub: "Coxo-femorale",
    dove: "La testa del femore entra nella cavità del bacino (acetabolo), in profondità all'inguine.",
    funzione: "Sostiene il peso del corpo e muove la gamba in tutte le direzioni.",
    problemi: [["Artrosi d'anca (coxartrosi)", "Dolore all'inguine, rigidità a mettere calze e scarpe."], ["Conflitto femoro-acetabolare", "Nei giovani sportivi: dolore all'inguine in squat profondo."], ["Lesione del labbro", "Click e blocchi."]],
    domande: [
      D("Dove senti il dolore?", [["Profondo all'inguine", { articolare: 3 }, { pin: [246, 486] }], ["Sul lato dell'anca", { laterale: 3 }, { pin: [272, 484] }], ["Nel gluteo", { posteriore: 3 }]]),
      D("Mettere calze e scarpe è diventato difficile?", [["Sì", { artrosi: 3 }], ["No", { conflitto: 1 }]]),
      D("Fa male accosciarti in profondità o portare il ginocchio al petto e verso l'interno?", [["Sì", { conflitto: 3 }], ["No", {}]]),
    ],
    ipotesi: {
      artrosi: ["Possibile artrosi d'anca", 2, "Il movimento e il rinforzo riducono dolore e rigidità: l'esercizio è la prima cura."],
      conflitto: ["Conflitto femoro-acetabolare", 2, "Evita per ora squat molto profondi e posizioni in cui l'anca si chiude troppo."],
      articolare: ["Dolore articolare", 2, "Il dolore all'inguine viene spesso dall'articolazione: una visita può chiarire."],
      laterale: ["Dolore laterale", 1, "Più probabile il gluteo medio: vedi lo strato Muscoli."],
      posteriore: ["Dolore posteriore", 1, "Più probabile schiena o piriforme."],
    },
    eta: { over: [55, "Dopo i 55 anni il dolore all'inguine camminando fa pensare all'artrosi: un'ortopedico può confermarlo con una radiografia."], under: [15, "Nei ragazzi un dolore all'anca o al ginocchio con zoppia va sempre visitato."] },
    rimedi: [R.calore(), R.riposo("Cammina su terreno piano, bici e nuoto sono ottimi; evita corse lunghe se fa male."), R.postura("Sedie non troppo basse; alzati spesso.")],
    esercizi: ["ponte", "abduzione-fianco", "stretch-flessori-anca", "squat"],
    medico: ["Dopo una caduta, soprattutto se anziano e non riesci a caricare: pronto soccorso.", "Dolore con febbre.", "Zoppia in bambini e ragazzi.", "Dolore notturno costante."],
  });

  P({
    id: "menisco", layer: "ossa", view: "f", region: "ginocchio", at: [218, 700], zoom: 170, parts: ["menisco", "jGinocchio"],
    name: "Menischi e cartilagine", sub: "Ginocchio",
    dove: "Due cuscinetti a forma di C tra femore e tibia, uno interno e uno esterno. Sopra le ossa c'è la cartilagine.",
    funzione: "Distribuiscono il carico e stabilizzano il ginocchio.",
    problemi: [["Lesione meniscale", "Dolore sulla linea articolare, a volte blocchi."], ["Artrosi del ginocchio (gonartrosi)", "Dolore al carico, rigidità, gonfiore dopo l'attività."]],
    domande: [
      D("Dove senti il dolore?", [["Lato interno, sulla linea tra le ossa", { menisco: 3 }, { pin: [216, 700] }], ["Lato esterno, sulla linea", { menisco: 3 }, { pin: [258, 700] }], ["Diffuso, tutto il ginocchio", { artrosi: 2 }]]),
      D("Il ginocchio si blocca o fa click e non si distende del tutto?", [["Sì", { menisco: 3 }, { flag: "giallo" }], ["No", {}]]),
      D("Com'è iniziato?", [["Torsione accovacciato o girandomi", { menisco: 3 }], ["Piano piano, da anni", { artrosi: 3 }]]),
    ],
    ipotesi: {
      menisco: ["Possibile lesione del menisco", 2, "Molte lesioni migliorano con esercizi. Se il ginocchio si blocca, serve una visita."],
      artrosi: ["Artrosi del ginocchio", 2, "Il rinforzo del quadricipite e dei glutei riduce il dolore quanto molti farmaci."],
    },
    eta: { over: [50, "Dopo i 50 anni piccole lesioni del menisco sono frequenti e spesso non danno problemi: la prima scelta è l'esercizio."] },
    rimedi: [R.ghiaccio("Dopo l'attività se il ginocchio si gonfia."), R.riposo("Evita accosciate profonde e torsioni; bici e nuoto sono ottimi."), R.gel()],
    esercizi: ["estensione-ginocchio", "wall-sit", "ponte", "equilibrio"],
    medico: ["Ginocchio bloccato che non si distende.", "Gonfiore improvviso dopo un trauma.", "Ginocchio caldo e rosso senza trauma: possibile infezione o gotta."],
  });

  P({
    id: "rotula", layer: "ossa", view: "f", region: "ginocchio", at: [237, 680], zoom: 170, parts: ["rotulaB", "jRotula"],
    name: "Articolazione femoro-rotulea", sub: "Condropatia e dolore anteriore",
    dove: "La rotula scorre in un solco sul davanti del femore, come un treno sul binario.",
    funzione: "Aumenta la forza del quadricipite e protegge il ginocchio.",
    problemi: [["Dolore femoro-rotuleo", "Dolore dietro o intorno alla rotula su scale, squat e stando seduti a lungo."], ["Condropatia", "Usura della cartilagine dietro la rotula, scricchiolii."]],
    domande: [
      D("Stare seduto a lungo con le ginocchia piegate fa male (segno del cinema)?", [["Sì", { pfps: 3 }], ["No", {}]]),
      D("Le scale in discesa sono peggio della salita?", [["Sì", { pfps: 3 }], ["No", { tendine: 1 }]]),
      D("Dove lo senti?", [["Dietro o intorno alla rotula", { pfps: 3 }, { pin: [237, 680] }], ["Sotto la rotula, in un punto", { tendine: 3 }, { note: "Più probabile il tendine rotuleo (strato Tendini).", pin: [237, 702] }]]),
    ],
    ipotesi: {
      pfps: ["Dolore femoro-rotuleo", 1, "La causa più comune di dolore al ginocchio negli sportivi. Rinforzo di quadricipite e glutei per 6–12 settimane."],
      tendine: ["Tendine rotuleo", 2, "Vedi il punto nello strato Tendini."],
    },
    sesso: { f: "È più frequente nelle donne, anche per la forma del bacino: il rinforzo dei glutei è fondamentale." },
    rimedi: [R.ghiaccio(), R.tape("Il taping della rotula o una ginocchiera con foro rotuleo può dare sollievo."), R.riposo("Riduci scale, squat profondi e corsa in discesa per qualche settimana.")],
    esercizi: ["wall-sit", "abduzione-fianco", "step-down", "stretch-quadricipite"],
    medico: ["La rotula è uscita di sede (lussazione).", "Ginocchio gonfio.", "Nessun miglioramento dopo 3 mesi di esercizi."],
  });

  P({
    id: "spalla-rigida", layer: "ossa", view: "f", region: "spalla", at: [276, 216], zoom: 200, parts: ["testaOmero", "glena", "jSpalla"],
    name: "Articolazione della spalla", sub: "Gleno-omerale · spalla congelata",
    dove: "La testa dell'omero appoggia su una piccola superficie della scapola (glena), avvolta da una capsula.",
    funzione: "È l'articolazione più mobile del corpo: muove il braccio in ogni direzione.",
    problemi: [["Capsulite adesiva (spalla congelata)", "La spalla si blocca in tutte le direzioni, soprattutto nella rotazione esterna."], ["Instabilità", "Sensazione che la spalla «esca», dopo lussazioni."], ["Artrosi", "Rigidità e scricchiolii dopo i 60 anni."]],
    domande: [
      D("La spalla è rigida anche quando qualcun altro prova a muoverla?", [["Sì, è bloccata", { capsulite: 4 }], ["No, si muove ma fa male", { cuffia: 3 }]]),
      D("Ti è mai uscita la spalla o hai la sensazione che stia per uscire?", [["Sì", { instabile: 4 }, { flag: "giallo" }], ["No", {}]]),
      D("Hai il diabete o problemi alla tiroide?", [["Sì", { capsulite: 2 }], ["No", {}]]),
    ],
    ipotesi: {
      capsulite: ["Possibile capsulite adesiva", 2, "Ha tre fasi (dolore, rigidità, sblocco) e può durare 1–2 anni. Gli esercizi dolci mantengono il movimento e riducono i tempi."],
      instabile: ["Instabilità di spalla", 2, "Serve un rinforzo mirato della cuffia e delle scapole; dopo una lussazione fatti visitare."],
      cuffia: ["Origine tendinea", 2, "Vedi «Cuffia dei rotatori» nello strato Tendini."],
    },
    sesso: { f: "La capsulite adesiva è più frequente nelle donne tra i 40 e i 60 anni." },
    eta: { over: [40, "La spalla congelata colpisce soprattutto tra i 40 e i 60 anni."] },
    rimedi: [R.calore("Prima degli esercizi, 15 minuti, rende la capsula più elastica."), R.riposo("Muovi ogni giorno entro il dolore: non forzare."), R.gel()],
    esercizi: ["pendolo", "wall-slide", "rotazione-esterna"],
    medico: ["Spalla deformata dopo un trauma: pronto soccorso.", "Rigidità che peggiora per mesi.", "Dolore notturno forte che non risponde ai rimedi."],
  });

  /* ===================== SISTEMA LINFATICO ===================== */
  P({
    id: "linfonodi-collo", layer: "linfatico", view: "f", region: "collo", at: [232, 172], zoom: 200, parts: ["lnCervicali", "vasiCollo"],
    name: "Linfonodi del collo", sub: "Cervicali e sotto la mandibola",
    dove: "Catena di linfonodi lungo il collo, sotto la mandibola e sopra la clavicola.",
    funzione: "Filtrano la linfa di testa, gola, bocca: si ingrossano quando combattono un'infezione.",
    problemi: [["Linfonodi reattivi", "Ingrossati e dolenti durante mal di gola o raffreddore."], ["Linfonodi persistenti", "Duri, non dolenti, che non si riducono: vanno controllati."]],
    domande: [
      D("Hai o hai avuto da poco mal di gola, raffreddore, un dente infiammato?", [["Sì", { reattivo: 3 }], ["No", { controllo: 2 }]]),
      D("Com'è il linfonodo al tatto?", [["Morbido, mobile, dolente", { reattivo: 3 }], ["Duro, fisso, non fa male", { controllo: 4 }, { flag: "rosso" }], ["Non sento nulla di gonfio, ho solo tensione", { muscolare: 3 }]]),
      D("Da quanto è ingrossato?", [["Meno di 2 settimane", { reattivo: 2 }], ["Più di 3–4 settimane", { controllo: 3 }, { flag: "rosso", note: "Un linfonodo ingrossato da più di 3–4 settimane va fatto vedere dal medico." }]]),
    ],
    ipotesi: {
      reattivo: ["Linfonodo reattivo", 1, "È il sistema immunitario al lavoro: di solito si riduce in 2–3 settimane dopo l'infezione."],
      controllo: ["Linfonodo da controllare", 3, "Prenota una visita dal medico di base: probabilmente non è nulla, ma va valutato."],
      muscolare: ["Probabile tensione muscolare", 1, "Guarda «Trapezio» nello strato Muscoli."],
    },
    rimedi: [R.riposo("Riposo, idratazione e cura dell'infezione."), R.postura("Non massaggiare un linfonodo gonfio e dolente."), R.calore("Impacchi tiepidi possono dare sollievo al fastidio.")],
    esercizi: ["respirazione", "circonduzioni-spalle"],
    medico: ["Linfonodo duro, fisso, non dolente.", "Ingrossato da più di 3–4 settimane o più grande di 2 cm.", "Febbre, sudorazione notturna, calo di peso.", "Difficoltà a respirare o deglutire: urgente."],
  });

  P({
    id: "linfonodi-ascellari", layer: "linfatico", view: "f", region: "spalla", at: [268, 260], zoom: 260, parts: ["lnAscellari", "vasiBraccio", "vasiTorace"],
    name: "Linfonodi ascellari", sub: "Drenaggio di braccio e torace",
    dove: "Gruppo di linfonodi nell'ascella: raccolgono la linfa del braccio, del seno e di parte della schiena.",
    funzione: "Filtrano la linfa del braccio e del torace.",
    problemi: [["Linfonodi reattivi", "Dopo una ferita alla mano, una vaccinazione o un'infezione della pelle."], ["Linfedema del braccio", "Gonfiore del braccio, soprattutto dopo interventi al seno."], ["Noduli da controllare", "Duri e persistenti."]],
    domande: [
      D("Hai avuto da poco una ferita a mano o braccio, un'infezione o una vaccinazione?", [["Sì", { reattivo: 3 }], ["No", { controllo: 1 }]]),
      D("Il braccio è gonfio, pesante o l'anello stringe più del solito?", [["Sì", { linfedema: 4 }, { flag: "giallo", note: "Un braccio gonfio va valutato, soprattutto dopo interventi al seno o all'ascella." }], ["No", {}]]),
      D("Senti un nodulo duro che non si riduce da settimane?", [["No", {}], ["Sì", { controllo: 4 }, { flag: "rosso" }]]),
    ],
    ipotesi: {
      reattivo: ["Linfonodo reattivo", 1, "Normale dopo infezioni o vaccini: si riduce in 2–4 settimane."],
      linfedema: ["Possibile linfedema", 2, "Il movimento del braccio e la respirazione aiutano il drenaggio; un fisioterapista esperto può insegnarti il linfodrenaggio."],
      controllo: ["Nodulo da controllare", 3, "Prenota una visita dal medico."],
    },
    sesso: { f: "Controlla periodicamente seno e ascelle e segui i programmi di screening." },
    rimedi: [R.postura("Evita indumenti che stringono il braccio e borse pesanti sulla spalla del lato gonfio."), R.riposo("Muovi spesso il braccio sopra il livello del cuore.")],
    esercizi: ["circonduzioni-spalle", "wall-slide", "respirazione"],
    medico: ["Nodulo duro o che cresce.", "Braccio gonfio, caldo e rosso: possibile infezione.", "Gonfiore persistente del braccio."],
  });

  P({
    id: "linfonodi-inguinali", layer: "linfatico", view: "f", region: "anca", at: [238, 488], zoom: 230, parts: ["lnInguinali", "lnIliaci"],
    name: "Linfonodi inguinali", sub: "Drenaggio della gamba",
    dove: "Nella piega dell'inguine: raccolgono la linfa di gambe, piedi e parte bassa dell'addome.",
    funzione: "Filtrano la linfa degli arti inferiori.",
    problemi: [["Linfonodi reattivi", "Dopo una vescica infetta, un'unghia incarnita o un'infezione della pelle della gamba."], ["Confusione con ernia", "Un rigonfiamento all'inguine può anche essere un'ernia."]],
    domande: [
      D("Hai una ferita, una vescica infetta o un'unghia incarnita a gamba o piede?", [["Sì", { reattivo: 3 }], ["No", {}]]),
      D("Il rigonfiamento compare tossendo e rientra da sdraiato?", [["Sì", { ernia: 4 }, { note: "Più probabile un'ernia: vedi «Addominali»." }], ["No, è sempre uguale", { reattivo: 1, controllo: 1 }]]),
      D("È duro, fisso e presente da più di 3–4 settimane?", [["No", {}], ["Sì", { controllo: 4 }, { flag: "rosso" }]]),
    ],
    ipotesi: {
      reattivo: ["Linfonodo reattivo", 1, "Cura la ferita o l'infezione: il linfonodo si riduce in qualche settimana."],
      ernia: ["Possibile ernia inguinale", 2, "Fatti visitare e non sollevare carichi pesanti nel frattempo."],
      controllo: ["Linfonodo da controllare", 3, "Prenota una visita dal medico."],
    },
    rimedi: [R.riposo("Cura e disinfetta eventuali ferite al piede o alla gamba."), R.postura("Non massaggiare un linfonodo gonfio e dolente.")],
    esercizi: ["respirazione", "pompa-caviglia", "marcia"],
    medico: ["Striscia rossa che sale lungo la gamba con febbre: urgente (linfangite).", "Nodulo duro e fisso.", "Rigonfiamento doloroso che non rientra."],
  });

  P({
    id: "gambe-gonfie", layer: "linfatico", view: "f", region: "gamba", at: [236, 820], central: true, zoom: 620, parts: ["vasiGamba", "lnInguinali"],
    name: "Drenaggio delle gambe", sub: "Gambe pesanti, gonfiore, ritenzione",
    dove: "I vasi linfatici risalgono dai piedi all'inguine accanto alle vene. Funzionano grazie alla pompa dei muscoli del polpaccio e alla respirazione.",
    funzione: "Riportano verso il cuore i liquidi in eccesso: se ristagnano, la gamba si gonfia.",
    problemi: [["Gambe pesanti", "A fine giornata, con caldo e tanta sedentarietà."], ["Insufficienza venosa", "Vene visibili, gonfiore alle caviglie."], ["Linfedema", "Gonfiore persistente che non scende con il riposo notturno."]],
    domande: [
      D("Il gonfiore scende dopo una notte di riposo?", [["Sì, del tutto", { pesanti: 3 }], ["Solo in parte", { venosa: 3 }], ["No, resta sempre", { linfedema: 3 }, { flag: "giallo" }]]),
      D("È gonfia una gamba sola, calda e dolente?", [["No, entrambe in modo simile", { pesanti: 1 }], ["Sì", {}, { flag: "urgente", note: "Una gamba sola gonfia, calda e dolente può essere una trombosi: vai subito dal medico o al pronto soccorso." }]]),
      D("Hai anche fiato corto o gonfiore che aumenta in fretta?", [["No", {}], ["Sì", {}, { flag: "rosso", note: "Il gonfiore con fiato corto può dipendere da cuore o reni: fatti visitare a breve." }]]),
    ],
    ipotesi: {
      pesanti: ["Gambe pesanti da ristagno", 1, "Molto comune: movimento del polpaccio, gambe alte e respirazione profonda fanno una grande differenza."],
      venosa: ["Possibile insufficienza venosa", 2, "Calze elastiche a compressione graduata e movimento; fatti vedere da un medico."],
      linfedema: ["Possibile linfedema", 2, "Serve una diagnosi e un percorso specifico (linfodrenaggio, bendaggi)."],
    },
    sesso: { f: "Ormoni, gravidanza e pillola aumentano la ritenzione; peggiora nei giorni prima del ciclo." },
    eta: { over: [60, "Dopo i 60 anni il gonfiore alle gambe va sempre controllato dal medico, perché può dipendere da cuore, reni o farmaci."] },
    rimedi: [R.postura("Gambe sollevate 15–20 minuti a fine giornata; non stare troppo fermo in piedi o seduto."), R.tutore("Calze a compressione graduata, su consiglio del medico o del farmacista."), R.ghiaccio("Docce fresche dal basso verso l'alto sulle gambe a fine giornata.")],
    esercizi: ["pompa-caviglia", "marcia", "calf-raise", "respirazione"],
    medico: ["Una gamba sola gonfia, calda e dolente: urgente.", "Gonfiore con fiato corto.", "Gonfiore che non scende mai.", "Pelle arrossata, calda, con febbre."],
  });

  /* ===================== NUOVE ZONE ===================== */
  // --- Testa e collo ---
  P({
    id: "atm", layer: "ossa", view: "f", region: "collo", at: [238, 124], zoom: 150, parts: ["mandibola", "jATM"],
    name: "Articolazione della mandibola", sub: "ATM · temporo-mandibolare",
    dove: "Subito davanti all'orecchio, dove la mandibola si aggancia al cranio. Se appoggi un dito lì e apri la bocca, la senti muoversi.",
    funzione: "Apre e chiude la bocca per masticare, parlare, sbadigliare. Dentro c'è un piccolo disco che fa da cuscinetto.",
    problemi: [["Dolore muscolare (bruxismo)", "Mascella stanca o dolente al mattino, spesso con stress e denti serrati di notte."], ["Click o scatto", "Rumore aprendo la bocca: il disco scivola. Se non fa male, di solito non è un problema."], ["Apertura limitata", "La bocca non si apre del tutto o la mandibola devia di lato."]],
    domande: [
      D("Dove senti il fastidio?", [["Davanti all'orecchio", { articolare: 2 }, { pin: [238, 124] }], ["Sulla guancia, nel muscolo che mastica", { muscolare: 3 }, { pin: [233, 148] }], ["Sulla tempia, come un mal di testa", { muscolare: 2 }, { pin: [238, 90] }]]),
      D("Senti un click o uno scatto aprendo la bocca?", [["No", { muscolare: 1 }], ["Sì, ma senza dolore", { click: 3 }], ["Sì, con dolore", { articolare: 2, click: 1 }]]),
      D("Riesci ad aprire bene la bocca (tre dita una sopra l'altra)?", [["Sì", {}], ["Solo in parte, o la mandibola va di lato", { blocco: 3 }, { flag: "giallo" }], ["Si è bloccata all'improvviso, aperta o chiusa", { blocco: 3 }, { flag: "rosso", note: "Una mandibola bloccata va valutata a breve dal dentista o in pronto soccorso." }]]),
      D("Ti svegli con la mascella stanca o ti dicono che digrigni i denti?", [["No", {}], ["Sì", { muscolare: 3 }]]),
    ],
    ipotesi: {
      muscolare: ["Tensione dei muscoli masticatori", 1, "È la causa più comune, spesso legata a stress e bruxismo. Rilassare la mandibola durante il giorno e il calore aiutano molto."],
      click: ["Disco che scatta, senza blocco", 1, "Il click senza dolore è frequente e spesso innocuo. Evita chewing-gum e cibi molto duri."],
      articolare: ["Infiammazione dell'articolazione", 2, "Dolore proprio davanti all'orecchio: cibi morbidi per qualche giorno, niente aperture forzate (sbadigli ampi, panini alti)."],
      blocco: ["Apertura limitata", 2, "Il disco può ostacolare il movimento: serve una valutazione da un dentista esperto di ATM o da un fisioterapista."],
    },
    sesso: { f: "I disturbi dell'ATM sono più frequenti nelle donne tra i 20 e i 40 anni." },
    rimedi: [R.calore("Panno caldo sulla guancia 10–15 minuti, la sera."), R.postura("Durante il giorno: labbra chiuse, denti separati, lingua appoggiata dietro gli incisivi. Niente chewing-gum, unghie o penne tra i denti."), R.massaggio("Con due dita, cerchi lenti sulla guancia (il muscolo che si gonfia stringendo i denti), 1 minuto per lato."), R.tutore("Se digrigni di notte, il dentista può prepararti un bite.")],
    esercizi: ["chin-tuck", "respirazione", "stretch-trapezio"],
    medico: ["Mandibola bloccata aperta o chiusa.", "Dolore con gonfiore, febbre o dopo un colpo al viso.", "Dolore che dura più di 3–4 settimane o ti impedisce di mangiare.", "Dolore alla mascella con oppressione al petto o fiato corto: 112."],
  });

  P({
    id: "cefalea-tensiva", layer: "muscoli", view: "b", region: "collo", at: [214, 132], zoom: 170, parts: ["occipitaleM", "splenio"],
    name: "Muscoli della nuca", sub: "Cefalea muscolo-tensiva",
    dove: "Alla base del cranio, dietro la testa: lo splenio e i piccoli muscoli sotto-occipitali collegano il cranio alle prime vertebre del collo.",
    funzione: "Tengono su la testa e fanno piccoli aggiustamenti per lo sguardo. Lavorano tantissimo quando la testa sta in avanti (schermo, telefono).",
    problemi: [["Cefalea tensiva", "Mal di testa «a casco» o a fascia, pesante, che peggiora a fine giornata."], ["Cefalea dal collo (cervicogenica)", "Parte dalla nuca e sale su un lato fino all'occhio; cambia con i movimenti del collo."], ["Contratture sotto-occipitali", "Punti duri e dolenti alla base del cranio."]],
    domande: [
      D("Dove senti il mal di testa?", [["A fascia, tutto intorno alla testa", { tensiva: 3 }, { pin: [228, 108] }], ["Parte dalla nuca e sale su un lato", { cervicogenica: 3 }, { pin: [216, 132] }], ["Solo alla base del cranio", { contrattura: 3 }, { pin: [210, 140] }]]),
      D("Muovere il collo o premere sulla nuca lo cambia?", [["Sì, lo riproduce o lo peggiora", { cervicogenica: 2, contrattura: 2 }], ["No, non cambia", { tensiva: 1 }]]),
      D("Quante ore al giorno passi davanti a schermi o telefono?", [["Meno di 3", {}], ["Da 3 a 6", { tensiva: 1, contrattura: 1 }], ["Più di 6", { tensiva: 2, contrattura: 2 }]]),
      D("Hai uno di questi: mal di testa improvviso e fortissimo, febbre con collo rigido, disturbi della vista o della parola, debolezza di un lato?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Sono segnali da valutare subito: chiama il 112 o vai in pronto soccorso." }]]),
    ],
    ipotesi: {
      tensiva: ["Cefalea di tipo tensivo", 1, "La più comune: legata a stress, sonno e postura. Pause, movimento e rilassamento della nuca riducono frequenza e intensità."],
      cervicogenica: ["Cefalea che parte dal collo", 2, "Il dolore nasce dalle articolazioni e dai muscoli alti del collo. Esercizi di mobilità e rinforzo dei flessori profondi funzionano bene."],
      contrattura: ["Contratture sotto-occipitali", 1, "Muscoli piccoli ma sovraccarichi: automassaggio con due palline e retrazione del mento."],
    },
    eta: { over: [50, "Un mal di testa nuovo, o diverso dal solito, dopo i 50 anni va sempre fatto vedere dal medico."] },
    rimedi: [R.calore("Doccia calda o borsa calda sulla nuca per 15 minuti."), R.massaggio("Due palline da tennis in un calzino sotto la base del cranio, da sdraiato, 2 minuti di respiri lenti."), R.postura("Schermo all'altezza degli occhi, telefono in alto, 2 minuti di pausa ogni 45."), ["riposo", "Sonno e abitudini", "Orari di sonno regolari, acqua e pasti regolari: saltarli scatena spesso la cefalea."]],
    esercizi: ["chin-tuck", "stretch-trapezio", "circonduzioni-spalle", "respirazione"],
    medico: ["Mal di testa improvviso e fortissimo («il peggiore della vita»): 112.", "Febbre e collo rigido.", "Disturbi della vista, della parola o debolezza di un lato.", "Mal di testa dopo un colpo alla testa.", "Mal di testa nuovo dopo i 50 anni o che cambia carattere."],
  });

  // --- Torace ---
  P({
    id: "costocondrite", layer: "ossa", view: "f", region: "torace", at: [213, 238], zoom: 210, parts: ["cartCostali", "sterno"],
    name: "Cartilagini costali", sub: "Costocondrite · sindrome di Tietze",
    dove: "Sono i tratti di cartilagine che uniscono le costole allo sterno, davanti al petto (in grigio-azzurro nel disegno).",
    funzione: "Rendono la gabbia toracica elastica: si allarga a ogni respiro e assorbe i colpi.",
    problemi: [["Costocondrite", "Dolore puntiforme a lato dello sterno, che aumenta respirando a fondo o premendo."], ["Sovraccarico da allenamento", "Dopo panca, piegamenti, trazioni o tanta tosse."], ["Contusione", "Dopo un colpo al petto."]],
    domande: [
      D("Premendo con un dito a lato dello sterno trovi il punto che fa male?", [["Sì, proprio lì", { costo: 3 }, { pin: [212, 236] }], ["Più in basso, sotto il petto", { arcata: 2 }, { pin: [228, 292] }], ["No, il dolore è profondo e diffuso", {}, { flag: "giallo", note: "Un dolore al petto che non si riproduce premendo va fatto vedere dal medico." }]]),
      D("Cosa lo peggiora?", [["Respiro profondo, tosse, girare il busto", { costo: 2, arcata: 1 }], ["Le spinte in palestra", { sovraccarico: 3 }], ["La fatica o le salite, e passa a riposo", {}, { flag: "urgente", note: "Un dolore al petto che compare con lo sforzo e passa a riposo va valutato subito dal medico." }]]),
      D("C'è un gonfiore visibile sulla cartilagine?", [["No", {}], ["Sì", { tietze: 3 }]]),
      D("Senti oppressione, sudore freddo, fiato corto o dolore al braccio sinistro o alla mascella?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Questi segni vanno valutati subito: chiama il 112." }]]),
    ],
    ipotesi: {
      costo: ["Costocondrite", 1, "Un'infiammazione benigna delle cartilagini: fa male ma non è pericolosa. Migliora in qualche settimana riducendo gli sforzi che la provocano."],
      sovraccarico: ["Sovraccarico da allenamento", 1, "Riduci per 1–2 settimane panca, dip e piegamenti; il resto dell'allenamento puoi mantenerlo."],
      arcata: ["Fastidio all'arcata costale", 1, "Le costole basse si irritano con torsioni ripetute o tosse: respirazione e mobilità dolce del torace."],
      tietze: ["Possibile sindrome di Tietze", 2, "Quando la cartilagine è anche gonfia conviene una visita per confermarlo."],
    },
    rimedi: [R.calore("Borsa calda 15 minuti, più volte al giorno."), R.gel(), R.riposo("Niente spinte pesanti o esercizi per il petto per 1–2 settimane; cammina e muoviti normalmente."), R.postura("Dormi sulla schiena o sul lato che non fa male.")],
    esercizi: ["respirazione", "estensione-toracica", "stretch-pettorale"],
    medico: ["Dolore al petto con oppressione, fiato corto, sudore freddo o che va al braccio o alla mascella: 112.", "Dolore che compare con lo sforzo e passa a riposo.", "Febbre, tosse con catarro o dolore che aumenta.", "Dopo un colpo forte al petto."],
  });

  P({
    id: "nevralgia-intercostale", layer: "nervi", view: "f", region: "torace", at: [244, 268], zoom: 230, parts: ["intercostali"],
    name: "Nervi intercostali", sub: "Nevralgia intercostale",
    dove: "Corrono sotto ogni costola, dalla colonna dorsale fino al davanti del torace.",
    funzione: "Danno sensibilità alla pelle del torace e comandano i muscoli tra le costole che aiutano a respirare.",
    problemi: [["Nevralgia intercostale", "Dolore a fitta o bruciore che segue una costola, «a cintura»."], ["Irritazione dalla colonna dorsale", "Un blocco tra le vertebre dorsali può mandare dolore lungo la costola."], ["Herpes zoster (fuoco di Sant'Antonio)", "Bruciore su una fascia di un solo lato; dopo qualche giorno compaiono vescicole."]],
    domande: [
      D("Che tipo di dolore è?", [["Una fitta o una scossa lungo la costola", { nevralgia: 3 }, { pin: [244, 268] }], ["Bruciore sulla pelle, su un solo lato", { zoster: 3 }, { pin: [236, 262] }], ["Sordo, che parte dalla schiena", { toracica: 3 }, { pin: [262, 284] }]]),
      D("Sono comparse macchie rosse o piccole vescicole sulla zona?", [["No", {}], ["Sì", { zoster: 4 }, { flag: "rosso", note: "Se compaiono vescicole a fascia senti il medico entro 72 ore: gli antivirali funzionano meglio se presi presto." }]]),
      D("Ruotare il busto o respirare a fondo lo riproduce?", [["Sì", { nevralgia: 1, toracica: 2 }], ["No", { zoster: 1 }]]),
      D("Hai oppressione al petto, fiato corto o sudore freddo?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Chiama subito il 112." }]]),
    ],
    ipotesi: {
      nevralgia: ["Nevralgia intercostale", 1, "Il nervo è irritato: calore, movimento dolce del busto e respirazione lenta aiutano."],
      toracica: ["Origine dalla colonna dorsale", 1, "Spesso la causa è una rigidità tra le vertebre: lavora sulla mobilità del dorso (vedi «Colonna toracica»)."],
      zoster: ["Sospetto herpes zoster", 3, "Il bruciore a fascia su un solo lato, con vescicole, è tipico: serve il medico presto."],
    },
    eta: { over: [50, "Dopo i 50 anni l'herpes zoster è più frequente: se il bruciore è su un solo lato, controlla la pelle nei giorni seguenti."] },
    rimedi: [R.calore(), R.postura("Cambia spesso posizione; evita di stare a lungo curvo in avanti."), ["farmacia", "Farmacia", "Per il dolore dei nervi chiedi al farmacista o al medico: i normali antinfiammatori a volte funzionano poco."]],
    esercizi: ["respirazione", "estensione-toracica", "gatto-cammello"],
    medico: ["Vescicole o macchie rosse su una fascia del torace.", "Dolore al petto con oppressione o fiato corto: 112.", "Dolore che non cambia con la posizione e il respiro.", "Febbre o calo di peso."],
  });

  // --- Addome e inguine ---
  P({
    id: "pubalgia", layer: "tendini", view: "f", region: "addome", at: [210, 498], zoom: 200, parts: ["pubeT", "adduttoriT"],
    name: "Pube e tendini adduttori", sub: "Pubalgia · dolore inguinale dello sportivo",
    dove: "In basso al centro, dove si uniscono le due ossa del bacino (sinfisi pubica). Lì si attaccano i tendini degli adduttori e degli addominali.",
    funzione: "È il punto d'incontro tra le forze dell'addome e quelle dell'interno coscia: lavora in ogni cambio di direzione, calcio e scatto.",
    problemi: [["Pubalgia da adduttori", "Dolore all'inguine e all'interno coscia, tipico di calcio, rugby, hockey, padel."], ["Inguine dello sportivo", "Dolore sopra il pube che peggiora con scatti, tosse o addominali."], ["Sovraccarico della sinfisi", "Dolore proprio sull'osso al centro, nei casi di lungo sovraccarico."]],
    domande: [
      D("Dove senti di più il dolore?", [["Interno coscia, vicino all'inguine", { adduttori: 3 }, { pin: [214, 508] }], ["Sopra il pube, verso la pancia", { addominale: 3 }, { pin: [220, 478] }], ["Proprio al centro, sull'osso", { sinfisi: 3 }, { pin: [204, 496] }]]),
      D("Cosa lo scatena?", [["Calciare, aprire le gambe, cambi di direzione", { adduttori: 2 }], ["Scatti, addominali, tosse o starnuti", { addominale: 2 }], ["Anche camminare o girarmi nel letto", { sinfisi: 2 }, { flag: "giallo" }]]),
      D("Stringendo un pallone tra le ginocchia da sdraiato, senti dolore all'inguine?", [["No", {}], ["Sì, un po'", { adduttori: 2 }], ["Sì, forte", { adduttori: 2, sinfisi: 1 }, { flag: "giallo" }]]),
      D("C'è un rigonfiamento all'inguine che compare quando tossisci o stai in piedi?", [["No", {}], ["Sì", {}, { flag: "rosso", note: "Un rigonfiamento può essere un'ernia: guarda il punto «Canale inguinale» e fatti visitare." }]]),
    ],
    ipotesi: {
      adduttori: ["Pubalgia da adduttori", 1, "La forma più comune. Il rinforzo progressivo degli adduttori (squeeze, poi Copenaghen) è la base del recupero: 6–12 settimane."],
      addominale: ["Inguine dello sportivo (parete addominale)", 2, "Se dopo 6–8 settimane di rinforzo non migliora serve una visita specialistica."],
      sinfisi: ["Sovraccarico della sinfisi pubica", 2, "Stop a scatti e calci, rinforzo dolce del core; fatti seguire da un fisioterapista."],
    },
    sesso: { f: "In gravidanza e dopo il parto il dolore al pube (sinfisi) è frequente: chiedi una valutazione all'ostetrica o a un fisioterapista del pavimento pelvico." },
    rimedi: [R.ghiaccio("10–15 minuti sull'inguine dopo l'allenamento."), R.riposo("Stop a calci, scatti e cambi di direzione finché lo squeeze non è indolore; la corsa leggera in linea retta va bene."), R.tape("Pantaloncini compressivi danno un po' di sostegno durante l'attività.")],
    esercizi: ["squeeze-adduttori", "ponte", "dead-bug", "plank-laterale"],
    medico: ["Rigonfiamento all'inguine.", "Dolore che dura più di 6–8 settimane nonostante riposo ed esercizi.", "Febbre, o dolore anche a riposo e di notte.", "Disturbi urinari."],
  });

  P({
    id: "ernia-inguinale", layer: "tendini", view: "f", region: "addome", at: [234, 468], zoom: 210, parts: ["inguinale", "anelloIng"],
    name: "Canale inguinale", sub: "Ernia inguinale e femorale",
    dove: "Un piccolo passaggio nella parete dell'addome, appena sopra la piega dell'inguine, lungo il legamento inguinale.",
    funzione: "Nell'uomo ci passa il funicolo del testicolo, nella donna un legamento dell'utero: è un punto naturalmente più debole della parete.",
    problemi: [["Ernia inguinale", "Un rigonfiamento che compare in piedi o tossendo e rientra da sdraiati."], ["Ernia femorale", "Più in basso, sotto la piega dell'inguine; relativamente più frequente nelle donne."], ["Dolore senza ernia", "Negli sport con scatti e calci la parete può far male senza alcun rigonfiamento."]],
    domande: [
      D("Vedi o senti un rigonfiamento?", [["Sì, sopra la piega dell'inguine", { inguinale: 3 }, { pin: [222, 476] }], ["Sì, sotto la piega, verso la coscia", { femorale: 3 }, { pin: [234, 496] }], ["No, solo dolore", { sportivo: 3 }]]),
      D("Il rigonfiamento rientra quando ti sdrai o lo spingi piano?", [["Sì", { inguinale: 1 }], ["No: è duro, dolente e non rientra", {}, { flag: "urgente", note: "Un'ernia che non rientra ed è dolente può essere strozzata: pronto soccorso subito." }], ["Non c'è rigonfiamento", { sportivo: 1 }]]),
      D("Hai nausea, vomito o la pancia gonfia e dura?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Insieme a un rigonfiamento all'inguine è un'emergenza: pronto soccorso." }]]),
    ],
    ipotesi: {
      inguinale: ["Possibile ernia inguinale", 2, "Se rientra non è pericolosa, ma va valutata dal medico: spesso si opera in modo programmato. Nel frattempo evita sforzi in apnea."],
      femorale: ["Possibile ernia femorale", 3, "Va valutata a breve perché si strozza più facilmente."],
      sportivo: ["Dolore della parete senza ernia", 1, "Probabile sovraccarico: guarda anche «Pube e tendini adduttori»."],
    },
    sesso: { m: "L'ernia inguinale è molto più frequente negli uomini.", f: "Nelle donne l'ernia femorale è relativamente più frequente: un rigonfiamento sotto la piega dell'inguine va fatto vedere presto." },
    rimedi: [R.postura("Espira mentre sollevi un peso, non trattenere il fiato; niente carichi massimali finché non sei stato visitato."), R.riposo("Puoi continuare a muoverti e ad allenarti in modo leggero se non fa male."), R.tutore("Le cinture contenitive si usano solo su consiglio del chirurgo.")],
    esercizi: ["respirazione", "dead-bug", "ponte"],
    medico: ["Rigonfiamento duro, dolente, che non rientra: pronto soccorso.", "Nausea, vomito, pancia gonfia: pronto soccorso.", "Qualsiasi rigonfiamento nuovo all'inguine: visita programmata.", "Dolore o gonfiore al testicolo."],
  });

  // --- Braccio ---
  P({
    id: "tricipite", layer: "muscoli", view: "b", region: "braccio", at: [293, 316], zoom: 220, parts: ["tricipite"],
    name: "Tricipite brachiale", sub: "Triceps brachii",
    dove: "Dietro al braccio, dalla spalla al gomito. Ha tre capi in alto e un unico tendine che si attacca alla punta del gomito (olecrano).",
    funzione: "Distende il gomito: spinte, piegamenti, dip, lanci, colpi di racchetta.",
    problemi: [["Contrattura o indolenzimento", "Dopo dip, french press o tanti piegamenti."], ["Tendinopatia del tricipite", "Dolore appena sopra la punta del gomito nelle spinte."], ["Borsite olecranica", "Gonfiore morbido sulla punta del gomito, spesso dopo appoggi o colpi."]],
    domande: [
      D("Dove senti il fastidio?", [["Nel muscolo, dietro al braccio", { doms: 2 }, { pin: [293, 316] }], ["Appena sopra la punta del gomito", { tendine: 3 }, { pin: [297, 364] }], ["Sulla punta del gomito, che è gonfia", { borsite: 3 }, { pin: [296, 378] }]]),
      D("Quando è iniziato?", [["1–3 giorni dopo un allenamento nuovo o intenso", { doms: 3 }], ["Piano piano, con tante spinte", { tendine: 2 }], ["Dopo un colpo o tanti appoggi sul gomito", { borsite: 2 }]]),
      D("La punta del gomito è calda, arrossata o hai febbre?", [["No", {}], ["Sì", { borsite: 2 }, { flag: "rosso", note: "Una borsite calda e arrossata può essere infetta: senti il medico in giornata." }]]),
      D("Dopo uno strappo, riesci a distendere il gomito con forza?", [["Non ho avuto strappi", {}], ["Sì", { tendine: 1 }], ["No, è nettamente debole", {}, { flag: "rosso", note: "Debolezza improvvisa nel distendere il gomito dopo uno sforzo: va esclusa una lesione del tendine." }]]),
    ],
    ipotesi: {
      doms: ["Indolenzimento da allenamento", 1, "Passa in 2–4 giorni; il movimento leggero aiuta."],
      tendine: ["Tendinopatia del tricipite", 2, "Riduci dip e french press pesanti; lavora con carichi lenti e progressivi."],
      borsite: ["Borsite olecranica", 2, "Non appoggiarti sul gomito; ghiaccio e protezione. Se è calda e rossa, vai dal medico."],
    },
    rimedi: [R.calore("Per il muscolo indolenzito, doccia calda e movimento leggero."), R.ghiaccio("Sulla punta del gomito se è gonfia."), R.riposo("Niente dip e spinte pesanti per 1–2 settimane."), R.postura("Non appoggiare il gomito su tavoli e braccioli duri.")],
    esercizi: ["stretch-tricipite", "push-up-muro", "rematore-elastico"],
    medico: ["Punta del gomito calda, rossa, con febbre.", "Schiocco con debolezza nel distendere il gomito.", "Gonfiore dopo una caduta sul gomito.", "Dolore che non migliora in 3 settimane."],
  });

  // --- Polso e mano ---
  P({
    id: "dito-scatto", layer: "tendini", view: "f", region: "polso", at: [322, 534], zoom: 130, parts: ["guaineFless"],
    name: "Tendini flessori delle dita", sub: "Dito a scatto · tenosinovite",
    dove: "Nel palmo e lungo le dita i tendini che chiudono la mano scorrono dentro guaine con piccoli anelli (pulegge). Il primo anello è all'altezza della nocca, nel palmo.",
    funzione: "Fanno chiudere la mano: prese, trazioni, arrampicata, attrezzi.",
    problemi: [["Dito a scatto", "Il dito si blocca piegato e scatta quando lo stendi, soprattutto al mattino."], ["Tenosinovite dei flessori", "Dolore e gonfiore lungo il dito dopo tanta presa."], ["Lesione di una puleggia", "Nell'arrampicata: «pop» e dolore alla base del dito."]],
    domande: [
      D("Quale dito ti dà fastidio?", [["Il pollice", { scatto: 1 }, { pin: [341, 524] }], ["Il medio o l'anulare", { scatto: 1 }, { pin: [318, 536] }], ["L'indice o il mignolo", { scatto: 1 }, { pin: [330, 536] }]]),
      D("Il dito si blocca o scatta?", [["Sì, soprattutto al mattino", { scatto: 3 }], ["No, ma è gonfio e dolente lungo il dito", { teno: 3 }], ["Ho sentito un «pop» durante una presa", { puleggia: 4 }, { flag: "giallo" }]]),
      D("Senti un nodulo nel palmo, alla base del dito?", [["Sì", { scatto: 2 }], ["No", {}]]),
      D("Il dito è rosso, caldo e gonfio come una salsiccia, magari dopo una piccola ferita?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Può essere un'infezione della guaina del tendine: pronto soccorso subito." }]]),
    ],
    ipotesi: {
      scatto: ["Dito a scatto", 2, "Il tendine ispessito fatica a passare nel primo anello. Riposo dalle prese forti e stretching dolce; se non passa, un'infiltrazione spesso lo risolve."],
      teno: ["Tenosinovite da sovraccarico", 1, "Riduci la presa per 1–2 settimane e alterna le attività."],
      puleggia: ["Possibile lesione di una puleggia", 2, "Tipica di chi arrampica: stop alle prese piccole e valutazione da un fisioterapista della mano."],
    },
    sesso: { f: "Il dito a scatto è più frequente nelle donne." },
    eta: { over: [45, "Dopo i 45 anni, e in chi ha il diabete, il dito a scatto è più frequente."] },
    rimedi: [R.calore("Mano in acqua calda per 10 minuti al mattino: aiuta a sbloccare il dito."), R.riposo("Riduci le prese forti e prolungate (attrezzi, trazioni, borse pesanti)."), R.tutore("Uno splint che tiene dritto il dito di notte riduce il blocco al mattino."), R.massaggio("Massaggio leggero sul nodulo nel palmo, 1 minuto.")],
    esercizi: ["stretch-flessori", "stretch-estensori"],
    medico: ["Dito rosso, caldo e gonfio dopo una ferita: pronto soccorso.", "Dito bloccato che non riesci più a stendere.", "Nessun miglioramento in 4–6 settimane.", "«Pop» con livido alla base del dito."],
  });

  P({
    id: "rizoartrosi", layer: "ossa", view: "f", region: "polso", at: [331, 505], zoom: 130, parts: ["trapezioMC", "jPollice"],
    name: "Base del pollice", sub: "Rizoartrosi · articolazione trapezio-metacarpale",
    dove: "Alla radice del pollice, vicino al polso, dove il primo metacarpo si appoggia su un piccolo osso a forma di sella (trapezio).",
    funzione: "Permette al pollice di opporsi alle altre dita: pinza, girare una chiave, aprire un barattolo.",
    problemi: [["Rizoartrosi", "Usura della cartilagine: dolore alla base del pollice nelle prese a pinza."], ["Distorsione del pollice", "Dopo una caduta con il pollice aperto (sci, pallone): dolore all'interno della base."], ["De Quervain", "Il dolore è più sul lato del polso, lungo i tendini: vedi lo strato Tendini."]],
    domande: [
      D("Dove indichi il dolore?", [["Proprio alla radice del pollice", { rizo: 3 }, { pin: [331, 505] }], ["Sul lato del polso, un po' più in su", { dq: 3 }, { pin: [327, 486] }], ["All'interno della base del pollice, dopo una caduta", { distorsione: 3 }, { pin: [337, 520] }]]),
      D("Fa male girare una chiave, aprire un barattolo o scrivere?", [["Sì, molto", { rizo: 2 }], ["Un po'", { rizo: 1, dq: 1 }], ["No", {}]]),
      D("La base del pollice è diventata più sporgente o «squadrata»?", [["Sì", { rizo: 2 }], ["No", {}]]),
      D("Se sei caduto, riesci a stringere con forza tra pollice e indice?", [["Non sono caduto", {}], ["Sì", { distorsione: 1 }], ["No, è debole e instabile", { distorsione: 2 }, { flag: "rosso", note: "Un pollice instabile dopo una caduta va visto da un ortopedico entro pochi giorni." }]]),
    ],
    ipotesi: {
      rizo: ["Rizoartrosi", 1, "Molto comune dopo i 50 anni. Tutore notturno, esercizi di stabilità e oggetti che riducono lo sforzo di presa."],
      dq: ["Possibile De Quervain", 1, "Guarda il punto «Tendini del pollice» nello strato Tendini."],
      distorsione: ["Distorsione del pollice", 2, "Il legamento interno del pollice può lesionarsi: tutore e visita se è instabile."],
    },
    sesso: { f: "La rizoartrosi è molto più frequente nelle donne, soprattutto dopo la menopausa." },
    eta: { over: [50, "Dopo i 50 anni la rizoartrosi è frequente: muoversi e rinforzare aiuta più del riposo assoluto."] },
    rimedi: [R.tutore("Un tutore per il pollice (da farmacia o su misura) di notte e nelle attività pesanti."), R.calore("Acqua calda al mattino per la rigidità."), R.postura("Usa apribarattoli, impugnature più grosse e penne spesse; evita la pinza stretta e prolungata."), R.gel()],
    esercizi: ["stretch-flessori", "stretch-estensori"],
    medico: ["Pollice instabile o deformato dopo una caduta.", "Gonfiore caldo e arrossato.", "Dolore che non migliora con 6–8 settimane di tutore ed esercizi.", "Formicolio a pollice, indice e medio (vedi «Tunnel carpale»)."],
  });

  P({
    id: "ganglio-polso", layer: "tendini", view: "b", region: "polso", at: [317, 489], zoom: 140, parts: ["retinacoloB"],
    name: "Dorso del polso", sub: "Cisti gangliare · sovraccarico dorsale",
    dove: "Sul dorso del polso, dove i tendini estensori passano sotto una fascia (retinacolo) sopra le ossa del carpo.",
    funzione: "I tendini estensori sollevano mano e dita; le ossa del carpo reggono il carico nei piegamenti e nelle spinte.",
    problemi: [["Cisti gangliare", "Pallina morbida sul dorso del polso, più visibile piegandolo."], ["Impingement dorsale", "Dolore sul dorso del polso in piegamenti, burpee, front squat."], ["Sovraccarico degli estensori", "Dolore lungo il dorso dopo tanto mouse o tastiera."]],
    domande: [
      D("Vedi o senti una pallina sul dorso del polso?", [["Sì, morbida, a volte più grande a volte più piccola", { ganglio: 4 }, { pin: [318, 488] }], ["No", { impingement: 1, estensori: 1 }]]),
      D("Cosa provoca il dolore?", [["Appoggiarmi sulle mani a polso piegato (piegamenti, plank)", { impingement: 3 }], ["Mouse, tastiera, tanta scrittura", { estensori: 3 }], ["Quasi niente: la pallina non fa male", { ganglio: 1 }]]),
      D("Sei caduto sulla mano aperta e fa male nell'incavo alla base del pollice («tabacchiera»)?", [["No", {}], ["Sì", {}, { flag: "rosso", note: "Dopo una caduta sulla mano, il dolore nella tabacchiera può indicare una frattura dello scafoide: serve una radiografia." }]]),
    ],
    ipotesi: {
      ganglio: ["Cisti gangliare", 1, "È benigna: spesso si riduce o sparisce da sola. Non va schiacciata. Se dà fastidio il medico può aspirarla."],
      impingement: ["Impingement dorsale del polso", 1, "Nei piegamenti usa impugnature o i pugni, oppure un rialzo sotto il palmo per ridurre l'angolo."],
      estensori: ["Sovraccarico degli estensori", 1, "Pause, polso dritto sul mouse, allungamenti e rinforzo lento."],
    },
    rimedi: [R.ghiaccio("Dopo l'attività se il dorso è dolente."), R.postura("Nei piegamenti usa maniglie o i pugni; sul mouse polso dritto e appoggiato."), R.tutore("Una polsiera morbida nelle attività che lo provocano."), R.riposo()],
    esercizi: ["stretch-estensori", "polso-eccentrico-est", "stretch-flessori"],
    medico: ["Dopo una caduta: dolore nella tabacchiera anatomica (serve una radiografia).", "Pallina dura, che cresce in fretta o con formicolio.", "Polso caldo, arrossato e gonfio.", "Dolore che non migliora in 4–6 settimane."],
  });

  // --- Ginocchio ---
  P({
    id: "zampa-oca", layer: "tendini", view: "f", region: "ginocchio", at: [224, 722], zoom: 200, parts: ["zampaOca"],
    name: "Zampa d'oca", sub: "Tendinopatia e borsite anserina",
    dove: "Sul lato interno del ginocchio, 3–5 cm sotto la linea articolare: lì si uniscono i tendini di sartorio, gracile e semitendinoso.",
    funzione: "Aiutano a piegare il ginocchio e lo proteggono dalle spinte verso l'interno.",
    problemi: [["Tendinopatia della zampa d'oca", "Dolore sul lato interno, sotto il ginocchio, salendo le scale o alzandosi dalla sedia."], ["Borsite anserina", "Gonfiore morbido e dolore al tatto in quel punto, spesso insieme all'artrosi del ginocchio."], ["Da non confondere con il menisco", "Il menisco fa male più in alto, proprio sulla linea del ginocchio."]],
    domande: [
      D("Dove fa più male premendo?", [["3–5 cm sotto il ginocchio, lato interno", { zampa: 3 }, { pin: [224, 722] }], ["Proprio sulla linea del ginocchio, lato interno", { menisco: 3 }, { pin: [215, 700] }], ["Lungo il bordo interno, sopra e sotto il ginocchio", { lcm: 3 }, { pin: [217, 690] }]]),
      D("Cosa lo peggiora?", [["Scale, alzarmi dalla sedia, corsa", { zampa: 2 }], ["Torsioni e accovacciarmi", { menisco: 2 }], ["Dormire con le ginocchia una sull'altra", { zampa: 2 }]]),
      D("Il ginocchio si è gonfiato tutto o si blocca?", [["No", {}], ["Sì", { menisco: 2 }, { flag: "giallo", note: "Gonfiore e blocchi fanno pensare al menisco: guarda il punto «Menisco» nello strato Ossa." }]]),
    ],
    ipotesi: {
      zampa: ["Tendinopatia o borsite della zampa d'oca", 1, "Per qualche settimana riduci corse in discesa e scale; rinforza glutei e quadricipite; di notte cuscino tra le ginocchia."],
      menisco: ["Possibile origine dal menisco", 2, "Vedi il punto «Menisco» nello strato Ossa."],
      lcm: ["Legamento collaterale mediale", 2, "Vedi «Legamenti del ginocchio» in questo strato."],
    },
    sesso: { f: "È più frequente nelle donne, soprattutto con ginocchia «a X»." },
    eta: { over: [50, "Dopo i 50 anni la borsite anserina accompagna spesso l'artrosi del ginocchio: muoversi e perdere qualche chilo aiuta molto."] },
    rimedi: [R.ghiaccio(), R.gel(), R.postura("Di notte un cuscino tra le ginocchia; scarpe ammortizzate per la corsa."), R.riposo("Niente discese di corsa e scale ripetute per 2–3 settimane.")],
    esercizi: ["abduzione-fianco", "ponte", "estensione-ginocchio", "stretch-ischio"],
    medico: ["Ginocchio molto gonfio, caldo o arrossato.", "Ginocchio che si blocca o cede.", "Dolore che non migliora in 4–6 settimane.", "Febbre."],
  });

  P({
    id: "baker", layer: "ossa", view: "b", region: "ginocchio", at: [236, 690], zoom: 210, parts: ["jPoplitea"],
    name: "Cavo popliteo", sub: "Cisti di Baker",
    dove: "Dietro al ginocchio, nell'incavo. La cisti è una sacca piena del liquido dell'articolazione.",
    funzione: "Il liquido sinoviale nutre e lubrifica il ginocchio: se il ginocchio è irritato ne produce di più e può gonfiare una sacca sul retro.",
    problemi: [["Cisti di Baker", "Gonfiore e tensione dietro al ginocchio, peggio a gamba tutta piegata o tutta tesa."], ["Rottura della cisti", "Dolore improvviso al polpaccio con gonfiore: somiglia a una trombosi."], ["Tendini posteriori", "Dolore dietro-lato del ginocchio in corsa e in discesa."]],
    domande: [
      D("Senti una pallina o una tensione dietro al ginocchio?", [["Sì, un gonfiore morbido nell'incavo", { baker: 3 }, { pin: [234, 690] }], ["No, è un dolore sul lato, dietro", { tendine: 3 }, { pin: [253, 694] }]]),
      D("Hai anche problemi dentro il ginocchio (artrosi, menisco, ginocchio gonfio)?", [["Sì", { baker: 2 }], ["No", { tendine: 1 }]]),
      D("Il polpaccio è gonfio, caldo, dolente o arrossato?", [["No", {}], ["Sì", {}, { flag: "urgente", note: "Un polpaccio gonfio, caldo e dolente va controllato subito per escludere una trombosi." }]]),
    ],
    ipotesi: {
      baker: ["Cisti di Baker", 1, "Di solito è la spia di un problema dentro il ginocchio: curando quello, la cisti si riduce. Tieni il ginocchio in movimento."],
      tendine: ["Tendinopatia posteriore del ginocchio", 1, "Riduci discese e scatti; rinforza ischiocrurali e polpaccio."],
    },
    eta: { over: [50, "Dopo i 50 anni la cisti di Baker è quasi sempre legata all'artrosi del ginocchio."] },
    rimedi: [R.ghiaccio("10–15 minuti dietro al ginocchio se è gonfio."), R.riposo("Muovi il ginocchio senza forzare la piega massima; per un po' evita accosciate profonde."), R.tutore("Una ginocchiera elastica può dare sollievo.")],
    esercizi: ["estensione-ginocchio", "pompa-caviglia", "ponte", "stretch-polpaccio"],
    medico: ["Polpaccio gonfio, caldo e dolente: urgente.", "Gonfiore che aumenta in fretta o impedisce di piegare il ginocchio.", "Febbre.", "Ginocchio che si blocca."],
  });

  // --- Piede ---
  P({
    id: "alluce-valgo", layer: "ossa", view: "f", region: "piede", at: [210, 940], zoom: 140, parts: ["alluceB", "jAlluce"],
    name: "Alluce", sub: "Alluce valgo · alluce rigido",
    dove: "L'articolazione alla base dell'alluce, tra il primo metatarso e la prima falange: è il punto che sporge sul lato interno del piede.",
    funzione: "A ogni passo il peso passa sull'alluce per spingere: nella corsa porta 2–3 volte il peso del corpo.",
    problemi: [["Alluce valgo", "L'alluce devia verso le altre dita e alla base sporge una «cipolla»."], ["Alluce rigido", "Artrosi: l'alluce si piega poco verso l'alto e fa male in spinta."], ["Gotta", "Attacco improvviso: alluce rosso, caldo, dolorosissimo, spesso di notte."]],
    domande: [
      D("Com'è l'alluce?", [["Deviato verso le altre dita, con una sporgenza", { valgo: 3 }, { pin: [208, 940] }], ["Dritto, ma rigido e dolente sopra", { rigido: 3 }, { pin: [211, 936] }], ["Rosso, caldo e gonfio all'improvviso", { gotta: 4 }, { flag: "rosso", note: "Un attacco così può essere gotta: senti il medico a breve." }]]),
      D("Cosa fa male?", [["Le scarpe strette sulla sporgenza", { valgo: 2 }], ["Spingere sulle punte, correre, salire", { rigido: 2 }], ["Anche il lenzuolo che sfiora il dito", { gotta: 2 }]]),
      D("Hai il diabete o problemi di circolazione, e una ferita sul piede?", [["No", {}], ["Sì", {}, { flag: "rosso", note: "Con il diabete ogni ferita del piede va mostrata al medico." }]]),
    ],
    ipotesi: {
      valgo: ["Alluce valgo", 1, "Scarpe con pianta larga, distanziatore tra le dita e rinforzo del piede riducono il fastidio. Si opera solo se il dolore limita la vita di tutti i giorni."],
      rigido: ["Alluce rigido", 1, "Scarpe con suola rigida e un po' «a dondolo» riducono la spinta sull'alluce."],
      gotta: ["Possibile gotta", 2, "Serve il medico: esami del sangue e una cura per l'attacco."],
    },
    sesso: { f: "L'alluce valgo è molto più frequente nelle donne, anche per scarpe strette e con il tacco." },
    rimedi: [R.postura("Scarpe con pianta larga e tacco basso; evita le punte strette."), R.tutore("Distanziatore in silicone tra alluce e secondo dito; plantare su misura se serve."), R.ghiaccio("Dopo una giornata in piedi se l'articolazione è infiammata.")],
    esercizi: ["rullo-plantare", "equilibrio", "calf-raise"],
    medico: ["Alluce rosso, caldo e gonfio all'improvviso.", "Ferite o pelle che si rompe sulla sporgenza, soprattutto con il diabete.", "Dolore che limita il camminare nonostante scarpe adatte."],
  });

  P({
    id: "frattura-stress", layer: "ossa", view: "f", region: "piede", at: [227, 933], zoom: 150, parts: ["metatarsi"],
    name: "Metatarsi", sub: "Frattura da stress · metatarsalgia",
    dove: "Le cinque ossa lunghe del piede, tra la caviglia e le dita. Il secondo e il terzo sono i più colpiti dalle fratture da stress.",
    funzione: "Formano l'arco anteriore del piede e distribuiscono il peso durante la spinta.",
    problemi: [["Frattura da stress", "Una piccola crepa da sovraccarico: dolore puntiforme sul dorso del piede che aumenta correndo."], ["Metatarsalgia", "Dolore sotto le teste dei metatarsi, nell'avampiede."], ["Neuroma di Morton", "Formicolio o scossa tra le dita: vedi lo strato Nervi."]],
    domande: [
      D("Dove senti il dolore?", [["Sul dorso del piede, in un punto preciso", { stress: 3 }, { pin: [224, 932] }], ["Sotto il piede, nell'avampiede", { metatarsalgia: 3 }, { pin: [226, 944] }], ["Tra due dita, con formicolio", { morton: 3 }, { pin: [229, 946] }]]),
      D("Hai aumentato da poco chilometri o intensità, o cambiato scarpe?", [["Sì", { stress: 2 }], ["No", { metatarsalgia: 1 }]]),
      D("Riesci a saltellare su un piede solo senza dolore?", [["Sì", { metatarsalgia: 1 }], ["No, fa male in un punto preciso", { stress: 3 }, { flag: "rosso", note: "Un dolore puntiforme saltellando fa sospettare una frattura da stress: fermati e fatti visitare." }]]),
      D("Il dorso del piede è gonfio?", [["No", {}], ["Sì", { stress: 2 }]]),
    ],
    ipotesi: {
      stress: ["Sospetta frattura da stress", 3, "Fermati dalla corsa e fatti visitare: nelle prime settimane la radiografia può essere negativa, a volte serve la risonanza."],
      metatarsalgia: ["Metatarsalgia da sovraccarico", 1, "Scarpe ammortizzate, plantare con scarico metatarsale e rinforzo del polpaccio."],
      morton: ["Possibile neuroma di Morton", 1, "Guarda il punto «Neuroma di Morton» nello strato Nervi."],
    },
    sesso: { f: "Nelle atlete con cicli irregolari, poca energia nella dieta o osteoporosi le fratture da stress sono più frequenti: parlane con il medico." },
    rimedi: [R.riposo("Stop a corsa e salti finché camminare non è del tutto indolore; bici o nuoto vanno bene."), R.ghiaccio(), R.tutore("Scarpa a suola rigida o scarpa post-operatoria, se te la indica il medico."), R.postura("Ritorno alla corsa graduale: non aumentare il volume più del 10% a settimana.")],
    esercizi: ["pompa-caviglia", "stretch-polpaccio", "ponte"],
    medico: ["Dolore puntiforme che aumenta saltellando o correndo.", "Piede gonfio dopo aver aumentato l'allenamento.", "Fratture da stress ripetute.", "Dolore anche a riposo o di notte."],
  });

  const BY_ID = {};
  LIST.forEach((p) => (BY_ID[p.id] = p));

  const LAYERS = {
    muscoli: { short: "Muscoli", label: "Muscoli", color: "#ff7a5c", desc: "Contratture, stiramenti, sovraccarichi" },
    tendini: { short: "Tendini", label: "Tendini e legamenti", color: "#cfe0f5", desc: "Tendiniti, distorsioni, fasce" },
    ossa: { short: "Ossa", label: "Ossa e articolazioni", color: "#f1e2c2", desc: "Colonna, anca, ginocchio, spalla" },
    nervi: { short: "Nervi", label: "Nervi", color: "#f5c542", desc: "Formicolii, sciatica, tunnel carpale" },
    linfatico: { short: "Linfatico", label: "Sistema linfatico", color: "#46d996", desc: "Linfonodi, gonfiori, drenaggio" },
  };

  const REGIONS = {
    collo: "Testa e collo", spalla: "Spalla", braccio: "Braccio", gomito: "Gomito e avambraccio", polso: "Polso e mano",
    torace: "Torace", addome: "Addome", schiena: "Schiena alta", lombare: "Zona lombare e bacino", anca: "Anca e inguine",
    coscia: "Coscia", ginocchio: "Ginocchio", gamba: "Gamba e polpaccio", piede: "Caviglia e piede",
  };

  return { LIST, BY_ID, LAYERS, REGIONS };
})();
