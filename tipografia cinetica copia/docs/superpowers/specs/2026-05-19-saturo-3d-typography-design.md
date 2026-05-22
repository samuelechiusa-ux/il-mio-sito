# SATURO 3D Typography — Design Document

## Visione

Evoluzione del progetto "Essenza 3D Generativa": la sfera icosaedrica viene sostituita dalla parola "(SATURO)" renderizzata in 3D, mantenendo la stessa dinamica ciclica di espansione, deformazione, cambiamento cromatico e opacità. Aggiunti 5 slider per interazione utente. Lo sfondo evolve ciclicamente su ogni iterazione.

## Stack Tecnologico

- Singolo file `index.html` auto-contenuto
- Three.js (importmap da CDN) con custom ShaderMaterial GLSL
- FontLoader + TextGeometry per testo 3D
- Jost Bold (tramite `@compai/font-jost` su CDN jsDelivr) — geometric sans-serif, alternativa open-source a Futura
- WebGL2, vertex + fragment shader inline
- 5 slider HTML `<input type="range">` con styling CSS professionale

## Architettura

```
index.html
├── Import map: Three.js CDN
├── FontLoader: carica Jost Bold typeface.json da CDN
├── Vertex shader (adattato per testo — noise displacement, espansione)
├── Fragment shader (colore, opacità, porosità)
├── TextGeometry "(SATURO)" + ShaderMaterial
├── 5 slider HTML (scala, colore, velocità, deformazione, opacità)
├── Sfondo ciclico (bianco ↔ giallo pastello)
└── Orchestrazione JS
    ├── Timer globale monotono t
    ├── Calcolo fase nel ciclo (phase = t % cycleDuration)
    ├── Update uniforms shader (con influenza slider)
    ├── Update colore sfondo (ogni ciclo)
    ├── Update particelle
    └── requestAnimationFrame loop
```

## Geometria e Testo 3D

- **Font:** Jost Bold caricato da `https://cdn.jsdelivr.net/npm/@compai/font-jost/data/typefaces/normal-700.json`
- **Testo:** "(SATURO)"
- **TextGeometry:** size variabile nel ciclo (da ~2 a ~8), height 0.5, bevel minimo
- **Displacement:** Simplex noise 3D a 4 ottave nel vertex shader — agisce su ogni vertice delle lettere
  - 3 pattern combinati: ondulazioni lente, creste acute, torsioni
  - Ampiezza cresce con la fase del ciclo e controllata dallo slider "Deformazione"
- **Espansione:** scala da size ~2 a size ~8 nel ciclo
- **Centratura:** il testo rimane centrato, non occupa tutto lo schermo al picco

## Colore

- **Min (bluastro):** bianco/azzurro, opacità ~0.3
- **Max (picco):** arancio/rosso saturo, opacità ~0.85
- **Slider "Colore":** controlla il mix factor tra i due colori (0 = bluastro, 1 = arancio/rosso)
- Il gradient locale via noise crea variazioni superficiali

## Porosità e Gas Interno

- **Mesh testo:** semitrasparente con micro-perforazioni procedurali (noise frattale) — stesso sistema del progetto originale
- **Gas interno:** ~3000 particelle (PointsMaterial) fluttuanti nel volume del testo
  - Movimento browniano leggero
  - Colore segue evoluzione del nucleo
  - Opacità individuale variabile

## Sfondo

- Ciclico su ogni iterazione (non solo il primo ciclo):
  - **Bluastro:** bianco
  - **Ascesa:** bianco → giallo pastello
  - **Picco:** giallo pastello
  - **Discesa:** giallo pastello → bianco
- Implementazione: `scene.background` via Color.lerp

## Timeline di un Ciclo

| Fase | Durata | Testo: forma | Testo: colore | Sfondo |
|------|--------|--------------|----------------|--------|
| Bluastro | ~5s | Piccolo, centrato, quasi perfetto | Bianco/azzurro, opacità ~0.3 | Bianco |
| Ascesa | ~10s | Si espande + si deforma | Gradiente azzurro→arancio/rosso | Bianco→giallo |
| Picco | 15s | Massima espansione + deformazione | Arancio/rosso saturo, opacità ~0.85 | Giallo pastello |
| Discesa | ~10s | Si contrae + torna liscio | Gradiente arancio/rosso→azzurro | Giallo→bianco |

## Slider (Interazione Utente)

5 slider `<input type="range">` in basso, design professionale:

| Slider | Range | Default | Effetto |
|--------|-------|---------|---------|
| **Scala** | 0.5 – 2.0 | 1.0 | Moltiplicatore dimensione base del testo (sovrascrive ciclo) |
| **Colore** | 0.0 – 1.0 | ciclo | A 0 segue il ciclo; spostandolo sovrascrive il mix colore manualmente |
| **Velocità** | 0.1 – 3.0 | 1.0 | Moltiplicatore velocità ciclo (sovrascrive) |
| **Deformazione** | 0.0 – 2.0 | ciclo | A 0 segue il ciclo; spostandolo sovrascrive l'ampiezza noise |
| **Opacità** | 0.0 – 1.0 | ciclo | A 0 segue il ciclo; spostandolo sovrascrive l'opacità |

Nota: slider con default "ciclo" partono in posizione che segue la fase attuale. Appena l'utente li sposta, il valore manuale sostituisce il valore ciclico per quel parametro.

### Design CSS degli Slider

- Barra orizzontale fissa in basso, centrata
- Sfondo semitrasparente (effetto vetro/sfumato) per leggibilità
- Label eleganti con testo piccolo sopra ogni slider
- Valore numerico in tempo reale mostrato vicino al thumb
- Thumb personalizzato (arrotondato, non default browser)
- Colore accento arancio/rosso coerente con il tema
- Spaziatura uniforme tra i 5 slider
- Reattivi al tocco (touch)
- Altezza massima: 15% della viewport

## Interazione Mouse/Touch (invariata)

- **Mouse X:** modula curvatura/torsione della deformazione
- **Mouse Y:** modula velocità locale del morphing
- **Click/Tap:** genera ondulazione impulsiva sulla superficie
- **Decay:** influenza decade in 2-3 secondi senza input

## Variabili Uniform degli Shader

| Uniform | Tipo | Descrizione |
|---------|------|-------------|
| `uTime` | float | Tempo globale monotono |
| `uPhase` | float | Fase nel ciclo (0.0–1.0) |
| `uMouse` | vec2 | Posizione mouse normalizzata |
| `uRadius` | float | Raggio/scale target |
| `uColor1` | vec3 | Colore min (bluastro) |
| `uColor2` | vec3 | Colore max (arancio/rosso) |
| `uOpacity` | float | Opacità target |
| `uDisplacementAmp` | float | Ampiezza deformazione |
| `uSpeedMul` | float | Moltiplicatore velocità (da slider) |
| `uColorSlider` | float | Mix colore manuale (da slider) |
| `uScaleMul` | float | Moltiplicatore scala (da slider) |

## Modifiche agli Shader (rispetto a versione sfera)

### Vertex Shader
- Rimossa logica di `radius` basata su sfera — sostituita con scale uniforme del testo
- `uRadius` ora controlla dimensione tramite `modelMatrix` scale
- Displacement via noise applicato lungo la normale locale di ogni vertice del testo

### Fragment Shader
- Invariato — stessa logica di colore HSL, porosità, fresnel

## Irreversibilità

Tempo globale `t` cresce monotonicamente. Fase ciclica (`phase = t % cycleDuration`) gestisce oscillazioni di colore/forma. Lo sfondo completa il suo arco a ogni ciclo (non più una sola volta).
