let table;
let continentsData = []; // Array per raggruppare i dati dei fiumi per continente

function preload() {
  // Carica il file CSV che contiene il dataset
  table = loadTable("assets/rivers.csv", "csv", "header");
}

function setup() {
  createCanvas(1700, 1600);
  background(57, 90, 150); // Colore di sfondo blu
  angleMode(DEGREES); // Imposta l'angolo in gradi invece che in radianti
  
  // Imposta il font e la dimensione del testo per i nomi dei continenti e dei fiumi
  textFont('Georgia');  // (serif)
  textSize(14);  // Imposta la dimensione del testo per i continenti
  textAlign(CENTER, CENTER);  // Allinea il testo al centro sia orizzontalmente che verticalmente
  
  // Disegna il titolo in alto, centrato sopra i cerchi e i fiumi
  fill(32, 32, 91);  // Colore blu scuro per il titolo
  textSize(36);  // Imposta la dimensione del titolo
  textStyle(BOLD);  // Imposta il titolo in grassetto
  text("All the rivers in the World", 780, 35);  // Posiziona il titolo in alto a destra (con un margine di 180px dalla sinistra)
  fill(32, 32, 91);  // Colore blu scuro per il titolo
  textSize(12);  // Imposta la dimensione del titolo
  text("The length of the lines represents the length of the", 775, 65)
  fill(32, 32, 91);  // Colore blu scuro per il titolo
  textSize(12);  // Imposta la dimensione del titolo
  text("rivers, while their thickness reflects their discharge.", 775, 80)
  let continents = ["Africa", "South America", "Asia", "North America", "Europe", "Australia"];
  continents.forEach(continent => {
    let rivers = table.rows.filter(row => row.get("continent") === continent); // Filtra i fiumi per continente
    continentsData.push({ continent, rivers }); // Aggiunge il continente e i suoi fiumi all'array continentsData
  });

  // Definisce le posizioni dei cerchi che rappresentano i continenti
  let positions = [
    { x: 450, y: 350 }, // Posizione per il primo continente (Africa)
    { x: 1050, y: 350 }, // Posizione per il secondo continente (Sud America)
    { x: 450, y: 850 }, // Posizione per il terzo continente (Asia)
    { x: 1050, y: 850 }, // Posizione per il quarto continente (Nord America)
    { x: 450, y: 1350 }, // Posizione per il quinto continente (Europa)
    { x: 1050, y: 1350 } // Posizione per il sesto continente (Australia)
  ];

  // Palette di colori per i cerchi dei continenti
  let continentColors = [
    color(74, 153, 55),   // Colore per Africa
    color(123, 66, 168),   // Colore per Sud America
    color(60, 30, 155),   // Colore per Asia
    color(109, 77, 61), // Colore per Nord America
    color(205, 175, 0), // Colore per Europa
    color(158, 50, 91)  // Colore per Australia
  ];

  for (let i = 0; i < continentsData.length; i++) {
    let data = continentsData[i];  // Dati per ogni continente
    let rivers = data.rivers; // Fiumi del continente
    let pos = positions[i];  // Posizione del cerchio per il continente
    let continentColor = continentColors[i]; // Colore per il continente specifico

    // Disegnare il cerchio che rappresenta il continente
    fill(continentColor); // Colore del cerchio (basato sul continente)
    noStroke();  // Rimuove il bordo del cerchio
    ellipse(pos.x, pos.y, 120, 120);  // Disegna il cerchio (120px di diametro)

    // Scrivere il nome del continente sopra il cerchio
    fill(0);  // Colore del testo
    textSize(12);  // Dimensione del testo per il nome del continente
    textStyle(BOLD);  // Testo in grassetto
    text(`${data.continent}`, pos.x, pos.y - 10); // Posiziona il nome del continente sopra il cerchio
    text(`${rivers.length} rivers`, pos.x, pos.y + 10);  // Mostra il numero di fiumi per continente sotto il cerchio

    // Calcolo e disegno dei fiumi (radiale)
    let angleStep = 360 / rivers.length; // Angolo tra ogni linea di fiume
    for (let j = 0; j < rivers.length; j++) {
      let river = rivers[j]; // Estrarre il fiume corrente
      let length = map(river.get("length"), 0, 7000, 50, 200); // Mappa la lunghezza del fiume a una dimensione visibile
      let discharge = map(river.get("discharge"), 0, 100000, 1, 8); // Mappa la portata del fiume ad uno spessore visibile

      // Calcola l'angolo per posizionare ogni fiume in modo radiale
      let angle = j * angleStep;
      let x1 = pos.x + cos(angle) * 55;  // Calcola la posizione iniziale del fiume
      let y1 = pos.y + sin(angle) * 55;
      let x2 = pos.x + cos(angle) * (55 + length); // Calcola la posizione finale del fiume
      let y2 = pos.y + sin(angle) * (55 + length);

      // Disegnare il fiume come una linea, con il colore e spessore calcolato in base ai dati
      stroke(56, 150, 160);  // Colore del fiume
      strokeWeight(discharge);  // Spessore della linea in base alla portata
      line(x1, y1, x2, y2);  // Linea che rappresenta il fiume

      // Calcolo l'angolo per ruotare il testo del nome del fiume e renderlo leggibile correttamnete 
      let riverAngle = atan2(y2 - y1, x2 - x1); // Calcolo l'angolo della linea
      let flipText = angle > 90 && angle < 270; // Se il testo è sulla sinistra

      // Calcolo la posizione per il nome del fiume
      let riverName = river.get("name");  // Nome del fiume
      let radius = 55 + length + 10;  // Distanza costante
      let nameX = pos.x + cos(angle) * radius;
      let nameY = pos.y + sin(angle) * radius;

      // Disegna il nome del fiume lungo la linea
      push();
      translate(nameX, nameY);
      rotate(riverAngle + (flipText ? 180 : 0));  // Ruota e inverte se necessario
      textAlign(CENTER);
      noStroke();
      textSize(10);
      fill(0);
      text(riverName, 0, 5); // Centra il testo
      pop();
    }
  }
}



