const SVGS = {
  'manorietta': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><path fill="#ffae4d" d="M424.48,780.98l-402.65,2.55c-5.65-21.24-2.34-35.9.42-56.01,18.52-134.7,109.43-247.86,234.86-299.61,36.47-14.96,70.92-20.14,108.15-27.23l-347.97-1.28.21-382.92c205.07,1.79,363.99,155.7,384,349.35l1.53-348.92c194.52.46,357.8,145.02,379.89,336,27.22,235.39-159.49,426.81-358.44,428.07Z"/></svg>',
  'tipografia-cinetica': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><path fill="#6b3135" d="M125.88,653.66C-23.73,490.68-.69,233.86,172.73,99.64c63.92-49.47,139.76-76.03,221.39-75.44l73.68,148.55c71.94-93.82,175.91-148.64,293.98-149.04l.09,748.87c-116.33.13-222.59-54.4-294.04-149.19l-73.7,149.41c-103.54-.95-197.61-42.2-268.25-119.15Z"/></svg>',
  'pasta-alla-palermitana': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><polygon fill="#dd0303" points="322.83 15.85 478.13 15.85 478.13 175.18 633.42 15.85 633.42 175.18 780.65 175.18 637.45 320.39 780.65 320.39 780.65 475.69 637.45 475.69 780.65 620.9 637.45 620.9 637.45 786.28 478.13 637.03 480.14 786.28 322.83 786.28 322.83 630.98 165.52 786.28 165.52 626.95 18.29 628.96 165.52 475.69 18.29 471.65 18.29 324.43 161.49 324.43 18.29 173.17 173.59 173.17 171.57 15.85 328.88 173.17 322.83 15.85"/></svg>',
  'maschera-animata': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><path fill="#50ff86" d="M779.47,377.64c2.25,250.84-186.94,425.42-406.12,409.46-193.38-14.08-353.4-173.89-353.63-374.72l-.24-204c92.05.67,162.12,60.79,188.27,151.99,9.89-88.27,21.89-162.86,58.45-235.72,17.65-36.06,42.17-66.24,72.9-90.58,39.53-26.56,86.68-25.11,124.44,4.2,89.43,67.2,117.51,216.97,125.73,329.04,20.49-92.76,92.75-157.79,188.67-159.48l1.53,169.8Z"/></svg>',
  'finestra-con-luce': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><path fill="#ff4500" d="M16.84,786.63c-1.03-189.16,133.13-346.48,319.06-382.98-27.96-2.85-49.8-2.43-78.33-2.52l-140.51-.42c-2.86,0-99.7.72-99.7.72C14.21,196.98,176.64,16.29,383.55,15.34l335.82-1.54c21.97-.1,41.47-1.49,63.19,2.04.74,191.99-137.58,348.9-324.55,381.97l325.15,2.37c-.07,154.92-89.57,293.01-231.5,355.26-54.03,26.12-111.98,31.45-172.95,31.42l-361.87-.22Z"/></svg>'
};

const PROJECTS = [
  {
    id: 'manorietta',
    title: 'manorietta',
    svg: 'ASSETS/manorietta.svg',
    color: '#ffae4d',
    path: 'manorietta/index.html',
    description: 'Hands-free pong con MediaPipe e TensorFlow.js'
  },
  {
    id: 'tipografia-cinetica',
    title: 'tipografia cinetica',
    svg: 'ASSETS/tipografia cinetica.svg',
    color: '#6b3135',
    path: 'tipografia cinetica copia/index.html',
    description: 'Tipografia 3D generativa con Three.js e shader GLSL'
  },
  {
    id: 'pasta-alla-palermitana',
    title: 'pasta alla palermitana',
    svg: 'ASSETS/pasta alla palermitana.svg',
    color: '#dd0303',
    path: 'pasta alla palermitana/codebase/index.html',
    description: 'Esperienza interattiva sulla ricetta della pasta alla palermitana'
  },
  {
    id: 'maschera-animata',
    title: 'maschera animata',
    svg: 'ASSETS/maschera animata. 2.svg',
    color: '#50ff86',
    path: 'MASCHERA ANIMATA/index.html',
    description: 'Maschera animata reattiva al microfono'
  },
  {
    id: 'finestra-con-luce',
    title: 'finestra con luce',
    svg: 'ASSETS/finestra con luce.svg',
    color: '#ff4500',
    path: 'finestra con LUCE 2/index.html',
    description: 'Pattern design e finestra con luce'
  }
];
