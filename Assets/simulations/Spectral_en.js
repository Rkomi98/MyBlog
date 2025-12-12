const { useState, useEffect } = React;
const html = htm.bind(React.createElement);

function iconProps(props = {}) {
  const { size = 18, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...rest,
  };
}

const Play = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <polygon points="7 5 19 12 7 19 7 5" />
  </svg>
`;

const Pause = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <line x1="9" y1="5" x2="9" y2="19" />
    <line x1="15" y1="5" x2="15" y2="19" />
  </svg>
`;

const Info = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <circle cx="12" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
`;

const Layers = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <path d="M12 4l9 5-9 5-9-5 9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 16l9 5 9-5" />
  </svg>
`;

const Activity = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <polyline points="4 12 8 12 11 6 13 18 16 12 20 12" />
  </svg>
`;

const ImageIcon = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <rect x="4" y="5" width="16" height="14" rx="2" ry="2" />
    <circle cx="9" cy="11" r="1.2" />
    <path d="M4 17l4.5-4 3.5 3 2.5-2 5.5 5" />
  </svg>
`;

const MapIcon = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <path d="M3 6l6-2 6 2 6-2v13l-6 2-6-2-6 2z" />
    <line x1="9" y1="4" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="20" />
  </svg>
`;

const Scan = (props = {}) => html`
  <svg ...${iconProps(props)}>
    <circle cx="12" cy="12" r="7" />
    <line x1="12" y1="4" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="20" />
    <line x1="4" y1="12" x2="2" y2="12" />
    <line x1="22" y1="12" x2="20" y2="12" />
  </svg>
`;

const SpectralSensors = () => {
  const [mode, setMode] = useState('pan');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setMode((prev) => {
          if (prev === 'pan') return 'multi';
          if (prev === 'multi') return 'hyper';
          return 'pan';
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const modes = {
    pan: {
      title: 'Panchromatic (PAN)',
      color: 'text-gray-200',
      borderColor: 'border-gray-400',
      bands: 1,
      width: 'Wide (full visible)',
      description:
        "A single sensor captures total light intensity. You get an extremely sharp black-and-white image (high spatial resolution), ideal for seeing roads, buildings, and boundaries.",
      analogy: 'A very high-definition black-and-white photo.',
      resolution: 'High',
      spectralRes: 'Low',
      imageLabel: 'High-res B/W image',
    },
    multi: {
      title: 'Multispectral (MS)',
      color: 'text-blue-400',
      borderColor: 'border-blue-500',
      bands: '3 - 10',
      width: 'Discrete (RGB + NIR)',
      description:
        "Captures true color and near-infrared. Spatial resolution is lower (grainier than PAN), but you can distinguish vegetation from water and bare soil.",
      analogy: 'Like an old color TV: you see colors but the pixels are larger.',
      resolution: 'Medium',
      spectralRes: 'Medium',
      imageLabel: 'True Color (Medium Resolution)',
    },
    hyper: {
      title: 'Hyperspectral (HS)',
      color: 'text-purple-400',
      borderColor: 'border-purple-500',
      bands: '100 - 200+',
      width: 'Narrow and continuous',
      description:
        "Lets you identify material chemistry. What looked like a simple green field (Multi) now reveals water-stress zones or different plant species (shown in false colors).",
      analogy: "An MRI scan of the landscape: you see what's inside or what it's made of.",
      resolution: 'Low/Medium',
      spectralRes: 'Very High',
      imageLabel: 'Material Map (Classification)',
    },
  };

  const currentInfo = modes[mode];

  const generateCurve = () => {
    const points = [];
    for (let x = 0; x <= 100; x++) {
      let y = 0;
      if (x < 20) y = 10 + x;
      else if (x < 40) y = 30 + (x - 20) * 0.5;
      else if (x < 50) y = 40 - (x - 40) * 2;
      else y = 20 + (x - 50) * 1.5;
      points.push(`${x * 6},${150 - y * 1.2}`);
    }
    return points.join(' ');
  };

  const SatelliteView = ({ mode }) => {
    const isPan = mode === 'pan';
    const isHyper = mode === 'hyper';
    const blurAmount = isPan ? 0 : 2;
    const riverColor = isPan ? '#333' : isHyper ? '#1e3a8a' : '#3b82f6';
    const fieldColor = isPan ? '#888' : isHyper ? '#a855f7' : '#22c55e';
    const forestColor = isPan ? '#555' : isHyper ? '#166534' : '#15803d';
    const roadColor = isPan ? '#bbb' : '#94a3b8';

    return html`
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-inner group">
        <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white border border-white/20">
          ${currentInfo.imageLabel}
        </div>
        <div
          className="w-full h-full transition-all duration-500"
          style=${{
            filter: isPan ? 'grayscale(100%) contrast(1.2)' : `blur(${blurAmount}px)`,
            transform: isPan ? 'scale(1)' : 'scale(1.02)',
          }}
        >
          <svg viewBox="0 0 400 225" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="400" height="225" fill=${isPan ? '#222' : '#78350f'} />
            <path d="M -10,80 C 100,60 200,150 410,120" stroke=${riverColor} strokeWidth="35" fill="none" />
            <rect x="20" y="120" width="120" height="80" fill=${fieldColor} opacity="0.9" />
            ${isHyper &&
            html`<circle cx="80" cy="160" r="20" fill="#ef4444" className="animate-pulse" />`}
            <circle cx="300" cy="50" r="40" fill=${forestColor} opacity="0.8" />
            <circle cx="340" cy="80" r="35" fill=${forestColor} opacity="0.9" />
            <circle cx="260" cy="70" r="30" fill=${forestColor} opacity="0.7" />
            <line x1="0" y1="200" x2="400" y2="0" stroke=${roadColor} strokeWidth=${isPan ? '4' : '8'} />
            ${!isPan && html`<rect width="400" height="225" fill="url(#grid)" opacity="0.2" />`}
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 z-20 flex flex-col items-end gap-1">
          ${isHyper &&
          html`<div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Water stress detected
          </div>`}
          ${isPan &&
          html`<div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Max edge detail
          </div>`}
        </div>
      </div>
    `;
  };

  return html`
    <div className="flex flex-col w-full min-h-screen bg-slate-900 text-white font-sans selection:bg-yellow-500 selection:text-black pb-10">
      <header className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-slate-900/95 backdrop-blur z-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif italic flex items-center gap-2">
            ${html`<${Scan} className="text-yellow-500" />`}
            Spectral Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">Spectral vs spatial resolution trade-off</p>
        </div>
        <div className="flex gap-2 sm:gap-4 flex-wrap">
          ${['pan', 'multi', 'hyper'].map((m) =>
            html`<button
              key=${m}
              onClick=${() => {
                setIsPlaying(false);
                setMode(m);
              }}
              className=${`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded border transition-all duration-300 ${
                mode === m
                  ? 'bg-white text-slate-900 border-white font-bold'
                  : 'bg-transparent text-slate-400 border-slate-600 hover:border-slate-400'
              }`}
            >
              ${m.charAt(0).toUpperCase() + m.slice(1)}
            </button>`,
          )}
          <button
            onClick=${() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors"
          >
            ${isPlaying ? html`<${Pause} size=${20} />` : html`<${Play} size=${20} />`}
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 relative border border-slate-700 flex flex-col justify-center items-center min-h-[300px]">
            <h3 className="absolute top-4 left-4 text-slate-400 font-mono text-xs sm:text-sm uppercase flex items-center gap-2">
              ${html`<${Activity} size=${14} />`}
              Spectral Sampling
            </h3>
            <div className="w-full h-48 sm:h-64 relative mt-8">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                <line x1="0" y1="200" x2="600" y2="200" stroke="white" strokeWidth="2" />
                <line x1="0" y1="200" x2="0" y2="0" stroke="white" strokeWidth="2" />
                <text x="580" y="220" fill="white" fontSize="12" className="font-mono">λ</text>
                <text x="50" y="220" fill="#64748b" fontSize="10">BLU</text>
                <text x="200" y="220" fill="#64748b" fontSize="10">GREEN</text>
                <text x="350" y="220" fill="#64748b" fontSize="10">RED</text>
                <text x="500" y="220" fill="#64748b" fontSize="10">NIR</text>
                <path d=${`M 0,200 ${generateCurve()} L 600,200 Z`} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                ${mode === 'pan' &&
                html`<g className="animate-pulse-slow">
                  <rect x="10" y="20" width="580" height="180" fill="white" fillOpacity="0.15" />
                  <rect x="10" y="20" width="580" height="2" fill="white" />
                  <rect x="10" y="20" width="2" height="180" fill="white" />
                  <rect x="590" y="20" width="2" height="180" fill="white" />
                  <text x="300" y="110" textAnchor="middle" fill="white" className="text-lg font-serif italic">Total Integration</text>
                </g>`}
                ${mode === 'multi' &&
                html`<g>
                  <rect x="20" y="100" width="60" height="100" fill="#3b82f6" fillOpacity="0.5" />
                  <rect x="140" y="60" width="60" height="140" fill="#22c55e" fillOpacity="0.5" />
                  <rect x="300" y="120" width="60" height="80" fill="#ef4444" fillOpacity="0.5" />
                  <rect x="450" y="40" width="100" height="160" fill="#a855f7" fillOpacity="0.5" />
                  <text x="110" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">GAP</text>
                </g>`}
                ${mode === 'hyper' &&
                html`<g>
                  ${Array.from({ length: 60 }).map((_, i) => {
                    let xVal = i * 1.66;
                    let yHeight = 0;
                    if (xVal < 20) yHeight = 10 + xVal;
                    else if (xVal < 40) yHeight = 30 + (xVal - 20) * 0.5;
                    else if (xVal < 50) yHeight = 40 - (xVal - 40) * 2;
                    else yHeight = 20 + (xVal - 50) * 1.5;
                    const h = yHeight * 1.2;
                    const fillColor =
                      i < 20 ? '#60a5fa' : i < 40 ? '#4ade80' : i < 50 ? '#f87171' : '#c084fc';
                    return html`<rect key=${i} x=${i * 10} y=${200 - h} width="8" height=${h} fill=${fillColor} fillOpacity="0.8" />`;
                  })}
                  <path d=${`M 0,200 ${generateCurve()} L 600,200`} fill="none" stroke="white" strokeWidth="2" className="drop-shadow-lg" />
                </g>`}
              </svg>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 font-mono text-sm mb-4 flex items-center gap-2 uppercase">
              ${html`<${MapIcon} size=${14} />`}
              Satellite View Simulation
            </h3>
            ${html`<${SatelliteView} mode=${mode} />`}
            <p className="text-xs text-slate-400 mt-3 italic text-center">
              ${mode === 'pan'
                ? 'Notice the crisp edges (roads, boundaries)'
                : mode === 'multi'
                ? 'Colors help the human eye, but resolution drops'
                : "False colors reveal details invisible to the human eye"}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div
            className=${`p-6 rounded-lg border-2 transition-colors duration-500 ${
              mode === 'pan'
                ? 'bg-slate-800 border-white'
                : mode === 'multi'
                ? 'bg-slate-800 border-blue-500'
                : 'bg-slate-800 border-purple-500'
            }`}
          >
            <h2 className=${`text-2xl font-bold mb-2 ${currentInfo.color} font-serif`}>
              ${currentInfo.title}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">${currentInfo.description}</p>
            <div className="space-y-3 mt-6 text-sm">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2">
                  ${html`<${Layers} size=${14} />`}
                  Number of bands
                </span>
                <span className="font-mono text-white">${currentInfo.bands}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2">
                  ${html`<${ImageIcon} size=${14} />`}
                  Spatial Resolution
                </span>
                <span
                  className=${`font-mono font-bold ${
                    currentInfo.resolution === 'High'
                      ? 'text-green-400'
                      : currentInfo.resolution === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-orange-400'
                  }`}
                >
                  ${currentInfo.resolution}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2">
                  ${html`<${Activity} size=${14} />`}
                  Spectral Resolution
                </span>
                <span
                  className=${`font-mono font-bold ${
                    currentInfo.spectralRes === 'Very High' ? 'text-green-400' : 'text-slate-300'
                  }`}
                >
                  ${currentInfo.spectralRes}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2 text-sm">
              ${html`<${Info} size=${16} />`}
              Analogy
            </h3>
            <p className="text-sm italic text-slate-300">"${currentInfo.analogy}"</p>
          </div>
          <div className="flex-1 min-h-[200px] bg-slate-900 rounded-lg flex items-center justify-center p-4 border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[length:20px_20px]"></div>
            <h3 className="absolute top-2 left-2 text-xs text-slate-500">DATA STRUCTURE</h3>
            ${mode === 'pan' &&
            html`<div className="w-24 h-24 bg-gray-400 rounded flex items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <span className="text-black font-bold text-xs">2D Matrix</span>
            </div>`}
            ${mode === 'multi' &&
            html`<div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-60 translate-x-[-8px] translate-y-[-8px] rounded border border-white"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-60 rounded border border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
                Layer Stack
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-60 translate-x-[8px] translate-y-[8px] rounded border border-white"></div>
            </div>`}
            ${mode === 'hyper' &&
            html`<div className="relative transform rotate-12">
              ${Array.from({ length: 8 }).map((_, i) =>
                html`<div
                  key=${i}
                  className="absolute w-24 h-24 border border-purple-400/30 bg-purple-900/20"
                  style=${{
                    transform: `translateZ(${i * 4}px) translateY(${-i * 3}px) translateX(${i * 3}px)`,
                    zIndex: 10 - i,
                  }}
                ></div>`,
              )}
              <div className="w-24 h-24 border-2 border-purple-400 bg-purple-900/60 backdrop-blur-sm relative z-20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <span className="text-[10px] font-mono text-purple-100 text-center leading-tight">Hyper<br />Cube<br />(λ-z axis)</span>
              </div>
            </div>`}
          </div>
        </div>
      </main>
    </div>
  `;
};

function mountSpectralSensors(targetId = 'spectral-root') {
  if (typeof window === 'undefined' || typeof ReactDOM === 'undefined') {
    return;
  }
  const container = document.getElementById(targetId);
  if (!container) {
    return;
  }
  const root = ReactDOM.createRoot(container);
  root.render(html`<${SpectralSensors} />`);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountSpectralSensors());
  } else {
    mountSpectralSensors();
  }
}

if (typeof window !== 'undefined') {
  window.mountSpectralSensors = mountSpectralSensors;
}
