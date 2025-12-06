import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronRight, Info, Layers, Activity, Image as ImageIcon, Map, Scan } from 'lucide-react';

const SpectralSensors = () => {
  const [mode, setMode] = useState('pan'); // pan, multi, hyper
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ciclo automatico per la modalità "play"
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setMode(prev => {
          if (prev === 'pan') return 'multi';
          if (prev === 'multi') return 'hyper';
          return 'pan';
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Dati per la visualizzazione
  const modes = {
    pan: {
      title: "Pancromatico (PAN)",
      color: "text-gray-200",
      borderColor: "border-gray-400",
      bands: 1,
      width: "Larga (tutto il visibile)",
      description: "Un singolo sensore cattura l'intensità totale della luce. Ottieni un'immagine in bianco e nero estremamente nitida (alta risoluzione spaziale), ideale per vedere strade, edifici e confini.",
      analogy: "Una foto in bianco e nero ad altissima definizione.",
      resolution: "Alta",
      spectralRes: "Bassa",
      imageLabel: "Immagine BN Alta Risoluzione"
    },
    multi: {
      title: "Multispettrale (MS)",
      color: "text-blue-400",
      borderColor: "border-blue-500",
      bands: "3 - 10",
      width: "Discreta (RGB + NIR)",
      description: "Cattura colori reali e infrarosso vicino. La risoluzione spaziale è inferiore (immagine più 'granulosa' del PAN), ma puoi distinguere la vegetazione dall'acqua e dal suolo nudo.",
      analogy: "Una vecchia TV a colori: vedi i colori ma i pixel sono più grossi.",
      resolution: "Media",
      spectralRes: "Media",
      imageLabel: "Colori Reali (Risoluzione Media)"
    },
    hyper: {
      title: "Iperspettrale (HS)",
      color: "text-purple-400",
      borderColor: "border-purple-500",
      bands: "100 - 200+",
      width: "Stretta e Continua",
      description: "Permette di identificare la chimica dei materiali. Quello che sembrava un semplice campo verde (Multi) ora rivela zone di stress idrico o tipi di piante diverse (visualizzate in falsi colori).",
      analogy: "Una scansione MRI del paesaggio: vedi cosa c'è 'dentro' o di cosa è fatto.",
      resolution: "Bassa/Media",
      spectralRes: "Altissima",
      imageLabel: "Mappa Materiali (Classificazione)"
    }
  };

  const currentInfo = modes[mode];

  // Generazione fittizia della curva di riflettanza (es. vegetazione)
  const generateCurve = () => {
    const points = [];
    for (let x = 0; x <= 100; x++) {
      let y = 0;
      if (x < 20) y = 10 + x; // Blu
      else if (x < 40) y = 30 + (x-20) * 0.5; // Verde picco
      else if (x < 50) y = 40 - (x-40) * 2; // Rosso assorbimento
      else y = 20 + (x-50) * 1.5; // NIR (Red edge)
      points.push(`${x * 6},${150 - y * 1.2}`); 
    }
    return points.join(" ");
  };

  // Componente Simulazione Terreno
  const SatelliteView = ({ mode }) => {
    // Definizione stili in base alla modalità
    const isPan = mode === 'pan';
    const isMulti = mode === 'multi';
    const isHyper = mode === 'hyper';

    // Filtri SVG per simulare pixelazione (risoluzione spaziale)
    // Pan = nitido, Multi/Hyper = leggermente pixelato/sfocato
    const blurAmount = isPan ? 0 : 2; 
    
    // Colori elementi
    // Fiume
    const riverColor = isPan ? '#333' : isHyper ? '#1e3a8a' : '#3b82f6';
    // Campo coltivato
    const fieldColor = isPan ? '#888' : isHyper ? '#a855f7' : '#22c55e'; // Hyper mostra "stress" in viola
    // Bosco
    const forestColor = isPan ? '#555' : isHyper ? '#166534' : '#15803d'; // Hyper distingue specie diverse (verde scuro)
    // Strada
    const roadColor = isPan ? '#bbb' : '#94a3b8';

    return (
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-inner group">
        
        {/* Etichetta sovrimpressa */}
        <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white border border-white/20">
          {currentInfo.imageLabel}
        </div>

        {/* Simulazione Pixelazione per risoluzione inferiore */}
        <div 
          className="w-full h-full transition-all duration-500"
          style={{ 
            filter: isPan ? 'grayscale(100%) contrast(1.2)' : `blur(${blurAmount}px)`,
            transform: isPan ? 'scale(1)' : 'scale(1.02)' // zoom leggero per nascondere bordi blur
          }}
        >
          <svg viewBox="0 0 400 225" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            
            {/* Sfondo (Suolo) */}
            <rect width="400" height="225" fill={isPan ? '#222' : '#78350f'} />
            
            {/* Fiume (Curva) */}
            <path d="M -10,80 C 100,60 200,150 410,120" stroke={riverColor} strokeWidth="35" fill="none" />
            
            {/* Campi (Rettangoli) */}
            <rect x="20" y="120" width="120" height="80" fill={fieldColor} opacity="0.9" />
            
            {/* Dettaglio Iperspettrale: Zona "Malata" nel campo che non si vede in Multi */}
            {isHyper && (
               <circle cx="80" cy="160" r="20" fill="#ef4444" className="animate-pulse" />
            )}
            {/* In Pan e Multi sembra tutto uguale, in Hyper vediamo il problema */}

            {/* Bosco (Cerchi) */}
            <circle cx="300" cy="50" r="40" fill={forestColor} opacity="0.8" />
            <circle cx="340" cy="80" r="35" fill={forestColor} opacity="0.9" />
            <circle cx="260" cy="70" r="30" fill={forestColor} opacity="0.7" />

            {/* Strada (Linea netta) */}
            <line x1="0" y1="200" x2="400" y2="0" stroke={roadColor} strokeWidth={isPan ? "4" : "8"} />
            
            {/* Griglia pixel (solo estetica) */}
            {!isPan && <rect width="400" height="225" fill="url(#grid)" opacity="0.2" />}
          </svg>
        </div>

        {/* Legenda Dinamica */}
        <div className="absolute bottom-2 right-2 z-20 flex flex-col items-end gap-1">
          {isHyper && (
            <div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Stress Idrico Rilevato
            </div>
          )}
          {isPan && (
            <div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Massimo Dettaglio Bordi
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    // CAMBIATO: min-h-screen invece di h-screen, rimosso overflow-hidden globale
    <div className="flex flex-col w-full min-h-screen bg-slate-900 text-white font-sans selection:bg-yellow-500 selection:text-black pb-10">
      
      {/* Header stile Manim */}
      <header className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-slate-900/95 backdrop-blur z-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif italic flex items-center gap-2">
            <Scan className="text-yellow-500" /> Analisi Spettrale
          </h1>
          <p className="text-slate-400 text-sm mt-1">Confronto risoluzione spettrale vs spaziale</p>
        </div>
        
        <div className="flex gap-2 sm:gap-4 flex-wrap">
          {['pan', 'multi', 'hyper'].map((m) => (
            <button
              key={m}
              onClick={() => { setIsPlaying(false); setMode(m); }}
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded border transition-all duration-300 ${
                mode === m 
                  ? 'bg-white text-slate-900 border-white font-bold' 
                  : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-400'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
        
        {/* COLONNA SINISTRA: Grafici e Teoria */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Sezione Grafico Spettrale */}
          <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 relative border border-slate-700 flex flex-col justify-center items-center min-h-[300px]">
            <h3 className="absolute top-4 left-4 text-slate-400 font-mono text-xs sm:text-sm uppercase flex items-center gap-2">
              <Activity size={14} /> Campionamento Spettrale
            </h3>
            
            <div className="w-full h-48 sm:h-64 relative mt-8">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                {/* Assi */}
                <line x1="0" y1="200" x2="600" y2="200" stroke="white" strokeWidth="2" />
                <line x1="0" y1="200" x2="0" y2="0" stroke="white" strokeWidth="2" />
                <text x="580" y="220" fill="white" fontSize="12" className="font-mono">λ</text>

                {/* Labels Assi X */}
                <text x="50" y="220" fill="#64748b" fontSize="10">BLU</text>
                <text x="200" y="220" fill="#64748b" fontSize="10">GREEN</text>
                <text x="350" y="220" fill="#64748b" fontSize="10">RED</text>
                <text x="500" y="220" fill="#64748b" fontSize="10">NIR</text>

                {/* Curva Reale Sfondo */}
                <path d={`M 0,200 ${generateCurve()} L 600,200 Z`} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />

                {/* ANIMAZIONI SENSORI */}
                {mode === 'pan' && (
                  <g className="animate-pulse-slow">
                    <rect x="10" y="20" width="580" height="180" fill="white" fillOpacity="0.15" />
                    <rect x="10" y="20" width="580" height="2" fill="white" />
                    <rect x="10" y="20" width="2" height="180" fill="white" />
                    <rect x="590" y="20" width="2" height="180" fill="white" />
                    <text x="300" y="110" textAnchor="middle" fill="white" className="text-lg font-serif italic">Integrazione Totale</text>
                  </g>
                )}

                {mode === 'multi' && (
                  <g>
                    <rect x="20" y="100" width="60" height="100" fill="#3b82f6" fillOpacity="0.5" />
                    <rect x="140" y="60" width="60" height="140" fill="#22c55e" fillOpacity="0.5" />
                    <rect x="300" y="120" width="60" height="80" fill="#ef4444" fillOpacity="0.5" />
                    <rect x="450" y="40" width="100" height="160" fill="#a855f7" fillOpacity="0.5" />
                    <text x="110" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">GAP</text>
                  </g>
                )}

                {mode === 'hyper' && (
                  <g>
                    {Array.from({ length: 60 }).map((_, i) => {
                       let xVal = i * 1.66;
                       let yHeight = 0;
                       if (xVal < 20) yHeight = 10 + xVal;
                       else if (xVal < 40) yHeight = 30 + (xVal-20) * 0.5;
                       else if (xVal < 50) yHeight = 40 - (xVal-40) * 2;
                       else yHeight = 20 + (xVal-50) * 1.5;
                       let h = yHeight * 1.2;
                       return <rect key={i} x={i * 10} y={200 - h} width="8" height={h} fill={i < 20 ? '#60a5fa' : i < 40 ? '#4ade80' : i < 50 ? '#f87171' : '#c084fc'} fillOpacity="0.8" />
                    })}
                    <path d={`M 0,200 ${generateCurve()} L 600,200`} fill="none" stroke="white" strokeWidth="2" className="drop-shadow-lg" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* NUOVA SEZIONE: Simulazione Satellitare */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
             <h3 className="text-slate-400 font-mono text-sm mb-4 flex items-center gap-2 uppercase">
               <Map size={14} /> Simulazione Vista Satellitare
             </h3>
             <SatelliteView mode={mode} />
             <p className="text-xs text-slate-400 mt-3 italic text-center">
               {mode === 'pan' ? "Nota la nitidezza delle linee (Strade, confini)" : 
                mode === 'multi' ? "I colori aiutano l'occhio umano, ma la risoluzione cala" : 
                "I colori 'falsi' rivelano dettagli invisibili all'occhio umano"}
             </p>
          </div>

        </div>

        {/* COLONNA DESTRA: Spiegazioni e Data Cube */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          
          <div className={`p-6 rounded-lg border-2 transition-colors duration-500 ${
            mode === 'pan' ? 'bg-slate-800 border-white' : 
            mode === 'multi' ? 'bg-slate-800 border-blue-500' : 
            'bg-slate-800 border-purple-500'
          }`}>
            <h2 className={`text-2xl font-bold mb-2 ${currentInfo.color} font-serif`}>
              {currentInfo.title}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">
              {currentInfo.description}
            </p>
            
            <div className="space-y-3 mt-6 text-sm">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><Layers size={14}/> Numero Bande</span>
                <span className="font-mono text-white">{currentInfo.bands}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><ImageIcon size={14}/> Risoluzione Spaziale</span>
                <span className={`font-mono font-bold ${currentInfo.resolution === 'Alta' ? 'text-green-400' : currentInfo.resolution === 'Media' ? 'text-yellow-400' : 'text-orange-400'}`}>
                  {currentInfo.resolution}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><Activity size={14}/> Risoluzione Spettrale</span>
                <span className={`font-mono font-bold ${currentInfo.spectralRes === 'Altissima' ? 'text-green-400' : 'text-slate-300'}`}>
                  {currentInfo.spectralRes}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2 text-sm">
              <Info size={16} /> Analogia
            </h3>
            <p className="text-sm italic text-slate-300">
              "{currentInfo.analogy}"
            </p>
          </div>

          {/* Rappresentazione visiva cubo dati (Semplificata) */}
          <div className="flex-1 min-h-[200px] bg-slate-900 rounded-lg flex items-center justify-center p-4 border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[length:20px_20px]" />
            <h3 className="absolute top-2 left-2 text-xs text-slate-500">STRUTTURA DATI</h3>
            
            {mode === 'pan' && (
               <div className="w-24 h-24 bg-gray-400 rounded flex items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                 <span className="text-black font-bold text-xs">2D Matrix</span>
               </div>
            )}
             {mode === 'multi' && (
               <div className="relative w-24 h-24">
                 <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-60 translate-x-[-8px] translate-y-[-8px] rounded border border-white" />
                 <div className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-60 rounded border border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">Layer Stack</div>
                 <div className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-60 translate-x-[8px] translate-y-[8px] rounded border border-white" />
               </div>
            )}
             {mode === 'hyper' && (
               <div className="relative transform rotate-12">
                 {[...Array(8)].map((_, i) => (
                   <div 
                    key={i} 
                    className="absolute w-24 h-24 border border-purple-400/30 bg-purple-900/20"
                    style={{ transform: `translateZ(${i*4}px) translateY(${-i*3}px) translateX(${i*3}px)`, zIndex: 10-i }}
                   />
                 ))}
                 <div className="w-24 h-24 border-2 border-purple-400 bg-purple-900/60 backdrop-blur-sm relative z-20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <span className="text-[10px] font-mono text-purple-100 text-center leading-tight">Hyper<br/>Cube<br/>(λ-z axis)</span>
                 </div>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SpectralSensors;