let table; // Variabile per il file CSV
let continentsData = []; // Array per i dati raggruppati per continente

function preload() {
  // Caricamento del dataset
  table = loadTable("assets/rivers.csv", "csv", "header");
}

function setup() {
  createCanvas(1700, 1500);
  background(57, 90, 150); // Colore di sfondo
  angleMode(DEGREES);
  
  // Impostiamo il font serif per il testo
  textFont('Georgia');  // Cambia con il font che desideri
  textSize(14);  // Imposta una dimensione maggiore per il testo dei continenti
  textAlign(CENTER, CENTER);
  
  // Disegna il titolo in alto a sinistra, sopra i cerchi e i fiumi
  fill(32, 32, 91);  // Blu scuro
  textSize(32);  // Imposta una dimensione più grande per il titolo
  textStyle(BOLD);  // Imposta il testo in grassetto
  text("Rivers in the World", 180, 40);  // Posiziona il titolo in alto a destra (200px di margine)

  // Raggruppa i dati per continente
  let continents = ["Africa", "South America", "Asia", "North America", "Europe", "Australia"];
  continents.forEach(continent => {
    let rivers = table.rows.filter(row => row.get("continent") === continent);
    continentsData.push({ continent, rivers });
  });

  // Posizioni dei cerchi (colonne e righe)
  let positions = [
    { x: 450, y: 250 },
    { x: 1050, y: 250 },
    { x: 450, y: 800 },
    { x: 1050, y: 800 },
    { x: 450, y: 1320 },
    { x: 1050, y: 1320 }
  ];

  // Paletta di colori per i cerchi dei continenti
  let continentColors = [
    color(74, 153, 55),   // Rosso per Africa
    color(123, 66, 168),   // Verde per Sud America
    color(60, 30, 155),   // Blu per Asia
    color(109, 77, 61), // Giallo per Nord America
    color(255, 165, 0), // Arancione per Europa
    color(158, 50, 91)  // Ciano per Australia
  ];

  // Disegna i cerchi e i fiumi radiali
  for (let i = 0; i < continentsData.length; i++) {
    let data = continentsData[i];
    let rivers = data.rivers;
    let pos = positions[i];
    let continentColor = continentColors[i]; // Colore specifico per ogni continente

    // Disegna il cerchio del continente con un colore diverso
    fill(continentColor);
    noStroke();
    ellipse(pos.x, pos.y, 120, 120);

    // Disegna il nome del continente con il nuovo font e dimensione
    fill(0);  // Colore nero per il testo del continente
    textSize(12);  // Aumento della dimensione del testo
    textStyle(BOLD);  // Imposta il testo in grassetto
    text(`${data.continent}`, pos.x, pos.y - 10);
    text(`${rivers.length} rivers`, pos.x, pos.y + 10);

    // Disegna i fiumi radiali
    let angleStep = 360 / rivers.length; // Angolo tra ogni linea
    for (let j = 0; j < rivers.length; j++) {
      let river = rivers[j];
      let length = map(river.get("length"), 0, 7000, 50, 200); // Lunghezza della linea
      let discharge = map(river.get("discharge"), 0, 100000, 1, 8); // Spessore della linea

      let angle = j * angleStep;
      let x1 = pos.x + cos(angle) * 55; // Punto iniziale sulla circonferenza
      let y1 = pos.y + sin(angle) * 50;
      let x2 = pos.x + cos(angle) * (50 + length); // Punto finale
      let y2 = pos.y + sin(angle) * (50 + length);

      // Colore e spessore del fiume
      stroke(56, 150, 160);  // Colore del fiume
      strokeWeight(discharge);
      line(x1, y1, x2, y2);

      // Calcola l'angolo per la rotazione del testo (angolo della linea)
      let riverAngle = atan2(y2 - y1, x2 - x1); // Calcola l'angolo della linea in radianti

      // Calcola la posizione del nome del fiume
      let riverName = river.get("name");
      let nameLength = textWidth(riverName); // Larghezza del nome del fiume
      let radius = 50 + length + 30; // Distanza in cui disegnare il nome (20 px più lontano)

      // Calcola le coordinate del nome
      let nameX = pos.x + cos(angle) * radius;
      let nameY = pos.y + sin(angle) * radius;

      // Se il fiume è nella seconda metà del cerchio (angolo > 180), sposta il testo verso il basso
      if (angle > 180) {
        nameY += 5; // Sposta il testo verso il basso per evitare che sia capovolto
      }

      // Disegna il nome del fiume lungo la linea, mantenendo l'orientamento corretto
      push(); // Salva lo stato corrente della matrice di trasformazione
      translate(nameX, nameY); // Sposta il sistema di coordinate al punto del nome
      rotate(riverAngle); // Ruota il testo per allinearlo alla linea
      noStroke();
      textSize(10)
      fill(0); // Colore del testo (nero)
      text(riverName, 2, 10); // Disegna il nome
      pop(); // Ripristina lo stato della matrice di trasformazione
    }
  }
}

