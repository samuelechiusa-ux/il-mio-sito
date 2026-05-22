# Essenza 3D Generativa — Design Document

## Visione

Opera d'arte generativa web, ispirata alle installazioni atmosferiche di Olafur Eliasson.
Un'essenza geometrica tridimensionale astratta (sfera) evolve in loop continuo:
si espande e si deforma fluidamente, il colore oscilla tra tonalità bluastre
e vette arancio/rosso saturo, mentre l'interno rimane arioso e gassoso.

## Stack Tecnologico

- Singolo file `index.html` auto-contenuto
- Three.js (importmap da CDN) con custom ShaderMaterial GLSL
- WebGL2, vertex + fragment shader inline
- Nessuna dipendenza da build tool, nessuna UI

## Architettura

```
index.html
├── Import map: Three.js CDN
├── Vertex shader (noise, displacement, morphing)
├── Fragment shader (colore, opacità, porosità, rifrazione)
├── Particelle interne (PointsMaterial)
└── Orchestrazione JS
    ├── Timer globale monotono t
    ├── Calcolo fase nel ciclo (phase = t % cycleDuration)
    ├── Update uniforms shader
    ├── Update colore sfondo
    ├── Update particelle
    └── requestAnimationFrame loop
```

## Geometria e Morfing

- **Geometria base:** Icosaedro, 6-8 subdivisioni (20k-40k vertici)
- **Displacement:** Simplex noise 3D a 4 ottave nel vertex shader
  - 3 pattern combinati: ondulazioni lente, creste acute, torsioni
  - Ampiezza cresce con la fase del ciclo
- **Espansione:** Raggio scala da ~2 a ~8 unità nel ciclo
- **Contrazione:** Ritorno a sfera quasi perfetta a fine ciclo

## Colore del Nucleo

- **Min (bluastro):** bianco/azzurro, opacità 0.3, hue ~210°
- **Max (picco):** arancio/rosso, opacità 0.85, hue ~25°, saturazione 100%
- **Transizioni:** interpolazione lineare HSL con gradienti locali via noise
- **Picco:** 15 secondi a saturazione massima prima della discesa
- **Ciclo totale:** ~40 secondi (5s bluastro + 10s ascesa + 15s picco + 10s discesa)

## Porosità e Gas Interno

- **Guscio:** mesh semitrasparente con micro-perforazioni procedurali (noise frattale)
  - Opacità mai superiore a 0.85
  - Doppio strato (0.98x e 1.0x) per profondità
  - Back-face visibili per enfatizzare cavità
- **Gas interno:** ~2000-5000 particelle (PointsMaterial) fluttuanti nel volume
  - Movimento browniano leggero
  - Colore segue evoluzione del nucleo con offset di fase
  - Opacità individuale variabile per effetto nebbia permeabile

## Sfondo

- **Arco:** bianco → giallo pastello → bianco
- **Sincronizzato con il primo ciclo** del nucleo — completa l'arco una sola volta
- **Dopo il primo ciclo:** lo sfondo rimane bianco stabilmente; il nucleo continua a ciclare
- **Gamma:** colore desaturato al 70-80%, luminosità 85-95%
- **Implementazione:** `scene.background` via Color.lerp

## Timeline di un Ciclo

| Fase | Durata | Nucleo: forma | Nucleo: colore | Sfondo |
|------|--------|--------------|----------------|--------|
| Bluastro | ~5s | Sfera piccola, quasi perfetta | Bianco/azzurro, opacità 0.3 | Bianco |
| Ascesa | ~10s | Si espande + si deforma | Gradiente azzurro→arancio/rosso | Bianco→giallo |
| Picco | 15s | Massima espansione + deformazione | Arancio/rosso saturo, opacità 0.85 | Giallo pastello |
| Discesa | ~10s | Si contrae + torna sferico | Gradiente arancio/rosso→azzurro | Giallo→bianco |

## Interazione Leggera

- **Mouse X:** modula curvatura/torsione della deformazione
- **Mouse Y:** modula velocità locale del morphing
- **Click:** genera ondulazione impulsiva sulla superficie
- **Decay:** influenza decade in 2-3 secondi senza input
- **Mobile:** touch drag ↔ mouse, tap ↔ click

## Variabili Uniform degli Shader

| Uniform | Tipo | Descrizione |
|---------|------|-------------|
| `uTime` | float | Tempo globale monotono |
| `uPhase` | float | Fase nel ciclo (0.0–1.0) |
| `uMouse` | vec2 | Posizione mouse normalizzata |
| `uRadius` | float | Raggio target |
| `uColor1` | vec3 | Colore min (bluastro) |
| `uColor2` | vec3 | Colore max (arancio/rosso) |
| `uOpacity` | float | Opacità target |
| `uDisplacementAmp` | float | Ampiezza deformazione |

## Irreversibilità

Il tempo globale `t` cresce monotonicamente. La fase ciclica (`phase = t % cycleDuration`)
gestisce le oscillazioni di colore/forma, mentre lo sfondo completa il suo arco una sola volta.
Non ci sono ritorni spontanei allo stato iniziale di quiete assoluta per il sistema.
