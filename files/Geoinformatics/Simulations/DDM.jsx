import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Plotly from 'plotly';

// ═══════════════════════════════════════════════════════════════════════════
// PHYSICAL CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  gridSize: 60,
  delayRange: [0, 8],
  dopplerRange: [-3500, 3500],
  chipRate: 1.023e6,
  carrierFreq: 1575.42e6,
  c: 299792458
};

// Manim-inspired colorscale
const manimColorscale = [
  [0, 'rgb(13, 17, 23)'],
  [0.1, 'rgb(30, 40, 80)'],
  [0.25, 'rgb(58, 100, 180)'],
  [0.4, 'rgb(88, 166, 255)'],
  [0.55, 'rgb(100, 200, 150)'],
  [0.7, 'rgb(227, 179, 65)'],
  [0.85, 'rgb(247, 120, 186)'],
  [1, 'rgb(255, 255, 255)']
];

// ═══════════════════════════════════════════════════════════════════════════
// PHYSICAL MODELS
// ═══════════════════════════════════════════════════════════════════════════

function calculateMSS(windSpeed) {
  const sigma2 = 0.003 + 0.00512 * windSpeed;
  return Math.min(sigma2, 0.15);
}

function calculateSigma0(mss, incidenceAngle, scatterAngle) {
  if (mss < 0.001) mss = 0.001;
  
  const theta_i = incidenceAngle * Math.PI / 180;
  const theta_s = scatterAngle * Math.PI / 180;
  
  const qz = Math.cos(theta_i) + Math.cos(theta_s);
  const qx = Math.sin(theta_i) - Math.sin(theta_s);
  const sx = -qx / qz;
  const q4 = Math.pow(qz, 4);
  const R0 = 0.65;
  const P_slope = (1 / (2 * Math.PI * mss)) * Math.exp(-(sx * sx) / (2 * mss));
  
  return (Math.PI * R0 * R0 * P_slope) / q4;
}

function woodwardAmbiguity(delayError, dopplerError, coherentTime = 0.001) {
  let codeCorr;
  if (Math.abs(delayError) < 0.001) {
    codeCorr = 1;
  } else if (Math.abs(delayError) > 2) {
    codeCorr = 0;
  } else {
    codeCorr = Math.max(0, 1 - Math.abs(delayError));
  }
  
  const dopplerNorm = dopplerError * coherentTime;
  let dopplerCorr;
  if (Math.abs(dopplerNorm) < 0.001) {
    dopplerCorr = 1;
  } else {
    const sincVal = Math.sin(Math.PI * dopplerNorm) / (Math.PI * dopplerNorm);
    dopplerCorr = sincVal * sincVal;
  }
  
  return codeCorr * codeCorr * dopplerCorr;
}

function getDelayFromPosition(x, y, altitude, incidenceAngle) {
  const theta = incidenceAngle * Math.PI / 180;
  const specX = altitude * Math.tan(theta);
  const dx = x - specX;
  const dy = y;
  const extraPath = Math.sqrt(dx * dx + dy * dy + altitude * altitude) - altitude / Math.cos(theta);
  return (2 * extraPath / CONFIG.c) * CONFIG.chipRate;
}

function getDopplerFromPosition(x, y, altitude, velocity = 7000) {
  const lambda = CONFIG.c / CONFIG.carrierFreq;
  const range = Math.sqrt(x * x + y * y + altitude * altitude);
  return (velocity * x / range) / lambda * 2;
}

function computeDDM(windSpeed, altitude, incidenceAngle) {
  const mss = calculateMSS(windSpeed);
  const size = CONFIG.gridSize;
  
  const delays = [];
  const dopplers = [];
  
  for (let i = 0; i < size; i++) {
    delays.push(CONFIG.delayRange[0] + (CONFIG.delayRange[1] - CONFIG.delayRange[0]) * i / (size - 1));
    dopplers.push(CONFIG.dopplerRange[0] + (CONFIG.dopplerRange[1] - CONFIG.dopplerRange[0]) * i / (size - 1));
  }
  
  const power = [];
  const gzRadius = 10 + 100 * Math.sqrt(mss);
  const surfacePoints = 30;
  
  for (let j = 0; j < size; j++) {
    const row = [];
    for (let i = 0; i < size; i++) {
      const targetDelay = delays[j];
      const targetDoppler = dopplers[i];
      
      let totalPower = 0;
      
      for (let sx = -surfacePoints/2; sx < surfacePoints/2; sx++) {
        for (let sy = -surfacePoints/2; sy < surfacePoints/2; sy++) {
          const surfX = (sx / surfacePoints) * gzRadius * 2;
          const surfY = (sy / surfacePoints) * gzRadius * 2;
          
          const pointDelay = getDelayFromPosition(surfX * 1000, surfY * 1000, altitude * 1000, incidenceAngle);
          const pointDoppler = getDopplerFromPosition(surfX * 1000, surfY * 1000, altitude * 1000);
          
          const sigma0 = calculateSigma0(mss, incidenceAngle, incidenceAngle);
          const waf = woodwardAmbiguity(targetDelay - pointDelay, targetDoppler - pointDoppler);
          const antennaGain = Math.exp(-(surfX * surfX + surfY * surfY) / (gzRadius * gzRadius * 2));
          const rangeFactor = 1 / (1 + (surfX * surfX + surfY * surfY) / (altitude * altitude));
          
          totalPower += sigma0 * waf * antennaGain * rangeFactor;
        }
      }
      
      row.push(totalPower);
    }
    power.push(row);
  }
  
  const maxPower = Math.max(...power.flat());
  if (maxPower > 0) {
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        power[j][i] /= maxPower;
      }
    }
  }
  
  return { delays, dopplers, power, mss, gzRadius };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Slider({ label, value, onChange, min, max, step, unit, color }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span 
          className="font-mono text-xs px-2 py-1 rounded"
          style={{ backgroundColor: '#21262d', color }}
        >
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #21262d ${((value - min) / (max - min)) * 100}%, #21262d 100%)`
        }}
      />
    </div>
  );
}

function StatusIndicator({ windSpeed, mss, gzRadius }) {
  let status, statusColor, dotColor;
  
  if (windSpeed < 2) {
    status = 'Specular Reflection';
    statusColor = '#58a6ff';
    dotColor = '#58a6ff';
  } else if (windSpeed < 7) {
    status = 'Developing Sea';
    statusColor = '#e3b341';
    dotColor = '#e3b341';
  } else if (windSpeed < 14) {
    status = 'Horseshoe Pattern';
    statusColor = '#f0883e';
    dotColor = '#f0883e';
  } else {
    status = 'Diffuse Scattering';
    statusColor = '#f778ba';
    dotColor = '#f778ba';
  }
  
  return (
    <div className="rounded-lg p-4 mt-4" style={{ backgroundColor: '#21262d' }}>
      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#484f58' }}>
        Sea State
      </div>
      <div className="flex items-center gap-2" style={{ color: statusColor }}>
        <span 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}` }}
        />
        <span className="font-semibold">{status}</span>
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: '#8b949e' }}>σ² (MSS)</span>
          <span className="font-mono" style={{ color: '#3fb950' }}>{mss.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#8b949e' }}>Glistening Zone</span>
          <span className="font-mono" style={{ color: '#3fb950' }}>~{(gzRadius * 2).toFixed(0)} km</span>
        </div>
      </div>
    </div>
  );
}

function PresetButtons({ onSelect }) {
  const presets = [
    { label: 'Calm', wind: 0 },
    { label: 'Light', wind: 5 },
    { label: 'Moderate', wind: 10 },
    { label: 'Rough', wind: 15 },
    { label: 'Storm', wind: 20 },
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {presets.map(p => (
        <button
          key={p.label}
          onClick={() => onSelect(p.wind)}
          className="px-3 py-1.5 text-xs rounded transition-all hover:border-cyan-400 hover:text-cyan-400"
          style={{ 
            backgroundColor: '#21262d', 
            border: '1px solid #30363d',
            color: '#8b949e'
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function PhysicsCard({ title, content, formula, color }) {
  return (
    <div 
      className="rounded-lg p-4 transition-transform hover:-translate-y-1"
      style={{ 
        backgroundColor: '#21262d',
        borderLeft: `3px solid ${color}`
      }}
    >
      <div className="font-semibold mb-2" style={{ color: '#e6edf3' }}>{title}</div>
      <div className="text-sm mb-3" style={{ color: '#8b949e' }}>{content}</div>
      <div 
        className="font-mono text-xs p-2 rounded text-center"
        style={{ backgroundColor: '#161b22', color: '#58a6ff' }}
      >
        {formula}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DDMSimulation() {
  const [windSpeed, setWindSpeed] = useState(0);
  const [altitude, setAltitude] = useState(500);
  const [incidence, setIncidence] = useState(30);
  const [view, setView] = useState('3d');
  const plotRef = useRef(null);
  
  const ddmData = useMemo(() => {
    return computeDDM(windSpeed, altitude, incidence);
  }, [windSpeed, altitude, incidence]);
  
  const cameraViews = {
    '3d': { x: 1.8, y: 1.8, z: 1.2 },
    'top': { x: 0, y: 0, z: 2.5 },
    'side': { x: 2.5, y: 0, z: 0.3 }
  };
  
  useEffect(() => {
    if (!plotRef.current) return;
    
    const { delays, dopplers, power } = ddmData;
    
    const trace = {
      z: power,
      x: dopplers,
      y: delays,
      type: 'surface',
      colorscale: manimColorscale,
      showscale: true,
      colorbar: {
        title: { text: 'Power', font: { color: '#8b949e', size: 11 } },
        tickfont: { color: '#8b949e', size: 10 },
        thickness: 12,
        len: 0.5
      },
      contours: {
        z: { show: true, usecolormap: true, highlightcolor: '#58a6ff', project: { z: true } }
      },
      lighting: {
        ambient: 0.7,
        diffuse: 0.8,
        specular: 0.3,
        roughness: 0.5
      },
      hovertemplate: 'Doppler: %{x:.0f} Hz<br>Delay: %{y:.2f} chips<br>Power: %{z:.3f}<extra></extra>'
    };
    
    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        xaxis: {
          title: { text: 'Doppler (Hz)', font: { color: '#f778ba', size: 11 } },
          tickfont: { color: '#8b949e', size: 9 },
          gridcolor: '#30363d',
          backgroundcolor: 'rgba(13, 17, 23, 0.9)',
          showbackground: true
        },
        yaxis: {
          title: { text: 'Delay (chips)', font: { color: '#58a6ff', size: 11 } },
          tickfont: { color: '#8b949e', size: 9 },
          gridcolor: '#30363d',
          backgroundcolor: 'rgba(13, 17, 23, 0.9)',
          showbackground: true
        },
        zaxis: {
          title: { text: 'Power', font: { color: '#e3b341', size: 11 } },
          tickfont: { color: '#8b949e', size: 9 },
          gridcolor: '#30363d',
          backgroundcolor: 'rgba(13, 17, 23, 0.9)',
          showbackground: true,
          range: [0, 1.1]
        },
        camera: { eye: cameraViews[view] },
        aspectmode: 'manual',
        aspectratio: { x: 1.2, y: 1, z: 0.7 }
      }
    };
    
    Plotly.react(plotRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [ddmData, view]);
  
  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#0d1117', color: '#e6edf3' }}>
      {/* Background grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(88, 166, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(88, 166, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-wide mb-2"
            style={{ 
              background: 'linear-gradient(135deg, #58a6ff, #f778ba)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Delay Doppler Map
          </h1>
          <p className="text-sm uppercase tracking-widest" style={{ color: '#8b949e' }}>
            GNSS-R Ocean Surface Scattering
          </p>
        </header>
        
        {/* Equation */}
        <div 
          className="rounded-xl p-5 mb-6 relative overflow-hidden"
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
          <div 
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ background: 'linear-gradient(180deg, #58a6ff, #f778ba)' }}
          />
          <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#58a6ff' }}>
            <span style={{ color: '#f778ba' }}>∎</span> Bistatic Radar Equation
          </div>
          <div 
            className="rounded-lg p-4 text-center overflow-x-auto font-mono text-sm"
            style={{ backgroundColor: '#21262d', color: '#e6edf3' }}
          >
            P_r(τ, f_D) = (P_t G_t λ²) / (4π)³ ∬ [G_r(r⃗) σ⁰(r⃗) |χ(Δτ, Δf_D)|²] / [R_t² R_r²] dA
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Controls */}
          <div 
            className="lg:col-span-1 rounded-xl p-5"
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          >
            <div 
              className="text-xs uppercase tracking-wider mb-5 pb-3"
              style={{ color: '#484f58', borderBottom: '1px solid #30363d' }}
            >
              Parameters
            </div>
            
            <PresetButtons onSelect={setWindSpeed} />
            
            <Slider
              label="Wind Speed (U₁₀)"
              value={windSpeed}
              onChange={setWindSpeed}
              min={0}
              max={20}
              step={0.5}
              unit=" m/s"
              color="#58a6ff"
            />
            
            <Slider
              label="Receiver Altitude"
              value={altitude}
              onChange={setAltitude}
              min={300}
              max={800}
              step={50}
              unit=" km"
              color="#f778ba"
            />
            
            <Slider
              label="Incidence Angle"
              value={incidence}
              onChange={setIncidence}
              min={5}
              max={60}
              step={5}
              unit="°"
              color="#e3b341"
            />
            
            <StatusIndicator 
              windSpeed={windSpeed} 
              mss={ddmData.mss} 
              gzRadius={ddmData.gzRadius} 
            />
          </div>
          
          {/* Plot */}
          <div 
            className="lg:col-span-3 rounded-xl p-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs uppercase tracking-wider" style={{ color: '#484f58' }}>
                3D Visualization
              </span>
              <div className="flex gap-1">
                {['3d', 'top', 'side'].map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="px-3 py-1.5 text-xs rounded transition-all"
                    style={{
                      backgroundColor: view === v ? '#58a6ff' : '#21262d',
                      color: view === v ? '#0d1117' : '#8b949e',
                      border: `1px solid ${view === v ? '#58a6ff' : '#30363d'}`
                    }}
                  >
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div 
              ref={plotRef} 
              className="w-full rounded-lg"
              style={{ height: '450px' }}
            />
            
            <div 
              className="flex justify-center gap-8 mt-3 pt-3 text-xs"
              style={{ borderTop: '1px solid #30363d', color: '#8b949e' }}
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f778ba' }} />
                Doppler (Hz)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#58a6ff' }} />
                Delay (chips)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#e3b341' }} />
                Power
              </span>
            </div>
          </div>
        </div>
        
        {/* Physics Cards */}
        <div 
          className="rounded-xl p-5"
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
          <div className="text-xs uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: '#58a6ff' }}>
            <span style={{ color: '#f778ba' }}>∎</span> Physical Model
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PhysicsCard
              title="🌊 Cox-Munk Model"
              content="Surface slope variance from wind speed"
              formula="σ² = 0.003 + 0.00512 × U₁₀"
              color="#58a6ff"
            />
            <PhysicsCard
              title="📡 Woodward Ambiguity"
              content="Resolution in delay-Doppler space"
              formula="χ² = sinc²(Δτ) × sinc²(Δf·T)"
              color="#f778ba"
            />
            <PhysicsCard
              title="🔷 Iso-Delay Ellipses"
              content="Equal delay forms elliptic curves"
              formula="R_t + R_r = const"
              color="#e3b341"
            />
            <PhysicsCard
              title="〰️ Iso-Doppler Curves"
              content="Equal Doppler forms hyperbolas"
              formula="f_D = (v⃗ · r̂) / λ"
              color="#3fb950"
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center mt-8 pt-6 text-xs" style={{ color: '#484f58', borderTop: '1px solid #30363d' }}>
          GNSS-R DDM Simulation — Based on Zavorotny & Voronovich (2000)
        </footer>
      </div>
    </div>
  );
}