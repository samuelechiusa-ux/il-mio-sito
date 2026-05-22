# Design System — Portfolio Workshop

## Overview

Design system unico per il sito portfolio che raccoglie tutti gli esercizi sviluppati durante un workshop. Il sito funge da vetrina navigabile per 5 progetti interattivi, ognuno con la propria identità visiva, unificati da una cornice coerente di navigazione e presentazione.

## Progetti Inclusi

| Progetto | Cartella | SVG associato | Colore SVG |
|----------|----------|---------------|------------|
| Manorietta (hands-free pong) | `manorietta/` | `ASSETS/manorietta.svg` | #ffae4d |
| Tipografia Cinetica (3D generativa) | `tipografia cinetica/` | `ASSETS/tipografia cinetica.svg` | #6b3135 |
| Pasta alla Palermitana | `pasta alla palermitana/` | `ASSETS/pasta alla palermitana.svg` | #dd0303 |
| Maschera Animata (mic-reactive) | `MASCHERA ANIMATA/` | `ASSETS/maschera animata. 2.svg` | #50ff86 |
| Finestra con Luce | `finestra con LUCE 2/` | `ASSETS/finestra con luce.svg` | #ff4500 |

Ogni progetto può contenere varianti (es. `tipografia cinetica copia/`, `pattern design/` sotto `finestra con LUCE 2/`) — queste condividono la stessa schermata di dettaglio del progetto padre.

## Architettura del Sito

Tecnologia: **100% vanilla HTML/CSS/JS** (nessun framework o build tool).

```
IL SITO/
├── index.html              # Home page (SPA entry point)
├── css/
│   ├── design-system.css   # Variabili, reset, typography, utilities
│   └── home.css            # Stili specifici della home
├── js/
│   ├── home.js             # Logica home: toggle, fisica, navigazione
│   └── physics.js          # Motore fisico 2D (Matter.js o custom)
├── ASSETS/                 # SVG forme per ogni progetto
│   ├── manorietta.svg
│   ├── tipografia cinetica.svg
│   ├── pasta alla palermitana.svg
│   ├── maschera animata. 2.svg
│   └── finestra con luce.svg
├── data/
│   └── projects.json       # Metadati progetti (titolo, percorso, descrizione)
├── manorietta/
├── MASCHERA ANIMATA/
├── tipografia cinetica/
├── tipografia cinetica copia/
├── pasta alla palermitana/
└── finestra con LUCE 2/
```

### Flusso di Navigazione

```
[HOME]                    [PAGINA DETTAGLIO]        [FULLSCREEN]
━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━
"la mia home" +           preview iframe     ───►   progetto
sottotitolo +             + documentazione    ◄───  (tasto Esc)
5 SVG fluttuanti          + mini-logo SVG dx
(sandbox fisica)               │
     │                         │ click mini-logo
     │ click SVG ──────────────┘
     │                              │
     │◄─────────────────────────────┘
     click mini-logo o Esc
```

### Stati dell'Applicazione

1. **HOME** — titolo + sottotitolo + 5 SVG fluttuanti con fisica 2D
2. **PROGETTO_DETAIL** — pagina dettaglio: preview iframe + documentazione + mini-logo SVG
3. **FULLSCREEN** — progetto interattivo a schermo intero (tasto Esc per tornare al dettaglio)

## Sistema Colore

```
--color-bg:         #f2fbfc    /* sfondo pagina */
--color-text:       #232323    /* testo base */
--color-hover:      #b70000    /* hover su "la mia home" */
--color-active:     #ed0000    /* active/click su "la mia home" */
```

Regole applicazione:
- I colori hover/active si applicano esclusivamente al titolo "la mia home"
- Sottotitolo, nomi progetto e altri testi ereditano `--color-text`
- Le SVG mantengono i loro colori originali (non sovrascritti dalla palette)
- Lo sfondo `#f2fbfc` è costante su tutte le pagine del sito

## Sistema Tipografia

Font: **Snaga Unicase Display** (Adobe Fonts)
```
<link rel="stylesheet" href="https://use.typekit.net/jit0hru.css">
```

Sempre in **minuscolo**. Pesi:
- **SEMIBOLD** (600): "la mia home"
- **LIGHT** (300): "di samuele chiusa", nomi progetto sotto le SVG

### Scala Dimensioni

| Elemento | Stato | Peso | Dimensione CSS |
|----------|-------|------|----------------|
| "la mia home" | iniziale | semibold | `clamp(3rem, 8vw, 7.2rem)` |
| "la mia home" | espanso (click) | semibold | `clamp(5rem, 15vw, 14rem)` |
| "di samuele chiusa" | visibile | light | `clamp(1.2rem, 3vw, 2.8rem)` |
| "di samuele chiusa" | fade-out | light | opacity 0 |
| Nome progetto sotto SVG | sempre | light | `1rem` |

### Design Tokens CSS

```css
:root {
  --color-bg: #f2fbfc;
  --color-text: #232323;
  --color-hover: #b70000;
  --color-active: #ed0000;
  --font-primary: "snaga-unicase-display", sans-serif;
  --weight-semibold: 600;
  --weight-light: 300;
  --text-title: clamp(3rem, 8vw, 7.2rem);
  --text-title-open: clamp(5rem, 15vw, 14rem);
  --text-subtitle: clamp(1.2rem, 3vw, 2.8rem);
  --svg-size: clamp(80px, 10vw, 140px);
  --svg-size-mini: 48px;
  --safe-radius: 200px;
  --transition-default: 0.3s ease;
}
```

## Home Page — Interazioni e Animazioni

### Apertura Pagina
- "la mia home" compare con dissolvenza (`@keyframes fadeIn`)
- "di samuele chiusa" compare subito dopo con leggero ritardo

### Hover e Active sul Titolo
- `:hover` → `color: var(--color-hover)` (#b70000), transizione fluida
- `:active` → `color: var(--color-active)` (#ed0000)

### Click sul Titolo (Toggle Home ↔ Progetti)
Al click su "la mia home":
1. Il titolo si ingrandisce fino a `var(--text-title-open)`
2. Il sottotitolo svanisce (opacity 0)
3. Le 5 SVG appaiono con effetto **stagger** (scale 0 → 1 con elastic easing, una dopo l'altra)
4. La simulazione fisica si attiva

Riclick sul titolo: processo inverso — SVG scompaiono, titolo torna a `var(--text-title)`, sottotitolo riappare, fisica si disattiva.

### Stato Intermedio del Titolo
- Quando le SVG sono visibili, hover sul titolo: `color: rgba(35, 35, 35, 0.6)` (nero meno opaco) per segnalare che è cliccabile per tornare indietro.

## Fisica 2D — Sandbox delle Forme

### Libreria
**Matter.js** (CDN leggero) — scelta definitiva per stabilità delle collisioni e performance.

### Configurazione Fisica
- **Gravità**: 0 o quasi zero (le forme fluttuano come nello spazio)
- **Collisioni**: attive tra forme (rimbalzo elastico realistico)
- **Bordi**: collisioni con i bordi dello schermo
- **Safe Area**: ostacolo circolare statico invisibile al centro (raggio ~200px) attorno al titolo — le forme non possono penetrarlo
- **Dimensione forme**: la hitbox segue il bounding box della SVG

### Drag & Drop
- Le forme sono **draggabili** con mouse e touch
- Al rilascio: mantengono **inerzia e velocità** del movimento (lancio)
- **Hover**: `scale(1.08)` con `transition: transform 0.3s ease`
- **Click**: naviga al progetto corrispondente

## Navigazione — Sistema SPA

### HOME → PAGINA DETTAGLIO PROGETTO
Trigger: click su una SVG fluttuante

Animazione:
1. Transizione dello stato HOME: titolo si rimpicciolisce a `var(--text-title)` (se espanso), tutte le altre SVG → fade-out
2. La SVG cliccata → si rimpicciolisce e si sposta in **alto a destra** diventando un **mini-logo** (48px, posizione fixed)
3. Durante lo spostamento: rotazione su sé stessa (spin)
4. Viene caricato il contenuto della pagina dettaglio (contenitore centrale)

### PAGINA DETTAGLIO PROGETTO
Layout:
```
┌──────────────────────────────────┐
│                      ┌────────┐ │
│                      │ SVG    │ │ ← mini-logo fixed in alto a dx
│                      │ (48px) │ │    ruota su sé stessa
│                      │        │ │    legata allo scroll
│                      └────────┘ │
│                                  │
│  ┌────────────────────────────┐ │
│  │     iframe preview         │ │ ← "Clicca per esplorare"
│  │                            │ │    hover: zoom + badge
│  └────────────────────────────┘ │
│                                  │
│  Documentazione testo            │
│  (consegna, dettagli esercizio)  │
│                                  │
└──────────────────────────────────┘
```

Elementi:
- **Mini-logo SVG**: fixed in alto a destra, ruota proporzionalmente allo scroll della pagina. Cliccando → torna alla HOME (animazione inversa)
- **Preview iframe**: anteprima del progetto interattivo. Hover con badge "Clicca per esplorare". Click → fullscreen
- **Documentazione**: testo descrittivo del progetto sotto il preview

### PAGINA DETTAGLIO → FULLSCREEN
Trigger: click sul preview iframe
- Il progetto si apre in un overlay/modal a schermo intero
- L'utente interagisce direttamente con tutte le funzionalità dell'esercizio
- **Tasto Esc**: chiude il fullscreen e torna alla pagina dettaglio

### FULLSCREEN → PAGINA DETTAGLIO
Trigger: tasto Esc (`event.key === 'Escape'`)
- Animazione di chiusura (fade-out overlay)
- Ritorno alla pagina dettaglio con preview + testo

### PAGINA DETTAGLIO → HOME
Trigger: click sul mini-logo SVG
1. Contenuto dettaglio → fade-out
2. Mini-logo SVG → animazione inversa (torna al centro, scala originale)
3. Home riappare con titolo + sottotitolo + tutte le SVG
4. Fisica riattivata

## Animazioni Predefinite

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}
```

Transizioni:
- Titolo hover/active: `color var(--transition-default)`
- SVG hover: `transform 0.3s ease`
- Stagger SVG: `transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)` (elastic ease-out)

## Gestione Eventi

| Evento | Elemento | Azione |
|--------|----------|--------|
| DOMContentLoaded | document | init home (fadeIn titolo) |
| click | ".home-title" | toggle home ↔ progetti |
| click | ".svg-shape" | naviga a dettaglio progetto |
| click | ".preview-frame" | apre fullscreen progetto |
| keydown (Escape) | document | chiude fullscreen |
| click | ".mini-logo" | torna alla home |
| scroll | window | ruota mini-logo proporzionalmente |

## Roadmap Implementazione

1. **Setup struttura file**: index.html, css/, js/, data/
2. **Design system CSS**: variabili, reset, typography, utility classes
3. **Home page HTML/CSS**: layout centrale, titolo, sottotitolo
4. **Home page JS**: toggle title, fade-in iniziale
5. **Physics engine**: Matter.js setup, shapes, safe area, collisioni
6. **SVG shapes**: caricamento da ASSETS/, configurazione fisica
7. **Drag & drop**: interazione con le forme, inerzia al rilascio
8. **Pagina dettaglio**: layout preview + documentazione + mini-logo
9. **Navigazione SPA**: transizioni tra stati (home → dettaglio → fullscreen → dettaglio → home)
10. **Fullscreen overlay**: iframe a schermo intero, tasto Esc
11. **Mini-logo rotazione**: scroll-linked rotation
12. **Dati progetti**: file projects.json con metadati
13. **Test e rifiniture**: cross-browser, mobile touch, performance

## Limiti e Vincoli

- Nessun framework o build tool (vanilla HTML/CSS/JS)
- Le SVG in `ASSETS/` non devono essere modificate o ricolorate
- Ogni progetto nella sua cartella resta intatto (non si modifica il codice interno)
- Il font Snaga Unicase Display richiede connessione a Adobe Fonts (CDN)
- Matter.js caricato via CDN per la fisica 2D
