const CONFIG = {
  gridSize: 60,
  delayRange: [0, 8],
  dopplerRange: [-3500, 3500],
  chipRate: 1.023e6,
  carrierFreq: 1575.42e6,
  c: 299792458,
};

const manimColorscale = [
  [0, 'rgb(13, 17, 23)'],
  [0.1, 'rgb(30, 40, 80)'],
  [0.25, 'rgb(58, 100, 180)'],
  [0.4, 'rgb(88, 166, 255)'],
  [0.55, 'rgb(100, 200, 150)'],
  [0.7, 'rgb(227, 179, 65)'],
  [0.85, 'rgb(247, 120, 186)'],
  [1, 'rgb(255, 255, 255)'],
];

const cameraViews = {
  '3d': { x: 1.8, y: 1.8, z: 1.2 },
  top: { x: 0, y: 0, z: 2.5 },
  side: { x: 2.5, y: 0, z: 0.3 },
};

function calculateMSS(windSpeed) {
  const sigma2 = 0.003 + 0.00512 * windSpeed;
  return Math.min(sigma2, 0.15);
}

function calculateSigma0(mss, incidenceAngle, scatterAngle) {
  const clampedMss = Math.max(mss, 0.001);
  const thetaI = (incidenceAngle * Math.PI) / 180;
  const thetaS = (scatterAngle * Math.PI) / 180;

  const qz = Math.cos(thetaI) + Math.cos(thetaS);
  const qx = Math.sin(thetaI) - Math.sin(thetaS);
  const sx = -qx / qz;
  const q4 = Math.pow(qz, 4);
  const r0 = 0.65;
  const slopePdf = (1 / (2 * Math.PI * clampedMss)) * Math.exp(-(sx * sx) / (2 * clampedMss));

  return (Math.PI * r0 * r0 * slopePdf) / q4;
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
  const theta = (incidenceAngle * Math.PI) / 180;
  const specX = altitude * Math.tan(theta);
  const dx = x - specX;
  const dy = y;
  const extraPath = Math.sqrt(dx * dx + dy * dy + altitude * altitude) - altitude / Math.cos(theta);
  return (2 * extraPath * CONFIG.chipRate) / CONFIG.c;
}

function getDopplerFromPosition(x, y, altitude, velocity = 7000) {
  const lambda = CONFIG.c / CONFIG.carrierFreq;
  const range = Math.sqrt(x * x + y * y + altitude * altitude);
  return ((velocity * x) / range / lambda) * 2;
}

function computeDDM(windSpeed, altitude, incidenceAngle) {
  const mss = calculateMSS(windSpeed);
  const size = CONFIG.gridSize;
  const delays = [];
  const dopplers = [];

  for (let i = 0; i < size; i += 1) {
    delays.push(CONFIG.delayRange[0] + ((CONFIG.delayRange[1] - CONFIG.delayRange[0]) * i) / (size - 1));
    dopplers.push(
      CONFIG.dopplerRange[0] + ((CONFIG.dopplerRange[1] - CONFIG.dopplerRange[0]) * i) / (size - 1),
    );
  }

  const power = [];
  const gzRadius = 10 + 100 * Math.sqrt(mss);
  const surfacePoints = 30;

  for (let j = 0; j < size; j += 1) {
    const row = [];
    for (let i = 0; i < size; i += 1) {
      const targetDelay = delays[j];
      const targetDoppler = dopplers[i];

      let totalPower = 0;
      for (let sx = -surfacePoints / 2; sx < surfacePoints / 2; sx += 1) {
        for (let sy = -surfacePoints / 2; sy < surfacePoints / 2; sy += 1) {
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
    for (let j = 0; j < size; j += 1) {
      for (let i = 0; i < size; i += 1) {
        power[j][i] /= maxPower;
      }
    }
  }

  return { delays, dopplers, power, mss, gzRadius };
}

function sliderGradient(value, min, max, color) {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #1c2129 ${pct}%, #1c2129 100%)`;
}

function seaStateFromWind(windSpeed) {
  if (windSpeed < 2) {
    return { label: 'Specular reflection', color: '#58a6ff' };
  }
  if (windSpeed < 7) {
    return { label: 'Developing sea', color: '#e3b341' };
  }
  if (windSpeed < 14) {
    return { label: 'Horseshoe pattern', color: '#f0883e' };
  }
  return { label: 'Diffuse scattering', color: '#f778ba' };
}

function updateStatus(state, ddmData, elements) {
  const { label, color } = seaStateFromWind(state.wind);
  elements.seaState.textContent = label;
  elements.statusDot.style.background = color;
  elements.statusDot.style.boxShadow = `0 0 14px ${color}`;
  elements.mssValue.textContent = ddmData.mss.toFixed(4);
  elements.gzValue.textContent = `${(ddmData.gzRadius * 2).toFixed(0)} km`;
}

function updateSliders(state, elements) {
  const windBg = sliderGradient(state.wind, Number(elements.windSlider.min), Number(elements.windSlider.max), '#58a6ff');
  const altBg = sliderGradient(
    state.altitude,
    Number(elements.altitudeSlider.min),
    Number(elements.altitudeSlider.max),
    '#f778ba',
  );
  const incBg = sliderGradient(
    state.incidence,
    Number(elements.incidenceSlider.min),
    Number(elements.incidenceSlider.max),
    '#e3b341',
  );

  elements.windSlider.style.background = windBg;
  elements.altitudeSlider.style.background = altBg;
  elements.incidenceSlider.style.background = incBg;

  elements.windValue.textContent = `${state.wind.toFixed(1)} m/s`;
  elements.altitudeValue.textContent = `${state.altitude.toFixed(0)} km`;
  elements.incidenceValue.textContent = `${state.incidence.toFixed(0)}°`;
}

function updatePlot(plotEl, ddmData, view) {
  if (!window.Plotly || !plotEl) {
    return;
  }
  const trace = {
    z: ddmData.power,
    x: ddmData.dopplers,
    y: ddmData.delays,
    type: 'surface',
    colorscale: manimColorscale,
    showscale: true,
    colorbar: {
      title: { text: 'Power', font: { color: '#8b949e', size: 11 } },
      tickfont: { color: '#8b949e', size: 10 },
      thickness: 12,
      len: 0.5,
    },
    contours: {
      z: { show: true, usecolormap: true, highlightcolor: '#58a6ff', project: { z: true } },
    },
    lighting: {
      ambient: 0.7,
      diffuse: 0.8,
      specular: 0.3,
      roughness: 0.5,
    },
    hovertemplate: 'Doppler: %{x:.0f} Hz<br>Delay: %{y:.2f} chips<br>Power: %{z:.3f}<extra></extra>',
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
        showbackground: true,
      },
      yaxis: {
        title: { text: 'Delay (chips)', font: { color: '#58a6ff', size: 11 } },
        tickfont: { color: '#8b949e', size: 9 },
        gridcolor: '#30363d',
        backgroundcolor: 'rgba(13, 17, 23, 0.9)',
        showbackground: true,
      },
      zaxis: {
        title: { text: 'Power', font: { color: '#e3b341', size: 11 } },
        tickfont: { color: '#8b949e', size: 9 },
        gridcolor: '#30363d',
        backgroundcolor: 'rgba(13, 17, 23, 0.9)',
        showbackground: true,
        range: [0, 1.1],
      },
      camera: { eye: cameraViews[view] ?? cameraViews['3d'] },
      aspectmode: 'manual',
      aspectratio: { x: 1.2, y: 1, z: 0.7 },
    },
  };

  Plotly.react(plotEl, [trace], layout, { responsive: true, displayModeBar: false });
}

function bindViewButtons(state, buttons, onChange) {
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view && state.view !== view) {
        state.view = view;
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        onChange();
      }
    });
  });
}

function bindPresets(state, slider, buttons, render) {
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = Number(btn.dataset.wind);
      if (!Number.isNaN(value)) {
        state.wind = value;
        slider.value = value;
        render();
      }
    });
  });
}

function init() {
  const elements = {
    plot: document.getElementById('ddmPlot'),
    windSlider: document.getElementById('windSlider'),
    altitudeSlider: document.getElementById('altitudeSlider'),
    incidenceSlider: document.getElementById('incidenceSlider'),
    windValue: document.getElementById('windValue'),
    altitudeValue: document.getElementById('altitudeValue'),
    incidenceValue: document.getElementById('incidenceValue'),
    seaState: document.getElementById('seaState'),
    statusDot: document.getElementById('statusDot'),
    mssValue: document.getElementById('mssValue'),
    gzValue: document.getElementById('gzValue'),
  };

  const state = {
    wind: Number(elements.windSlider?.value ?? 0),
    altitude: Number(elements.altitudeSlider?.value ?? 500),
    incidence: Number(elements.incidenceSlider?.value ?? 30),
    view: '3d',
  };

  const viewButtons = Array.from(document.querySelectorAll('.view-btn'));
  const presetButtons = Array.from(document.querySelectorAll('.preset-btn'));

  function render() {
    updateSliders(state, elements);
    const ddm = computeDDM(state.wind, state.altitude, state.incidence);
    updateStatus(state, ddm, elements);
    updatePlot(elements.plot, ddm, state.view);
  }

  bindViewButtons(state, viewButtons, render);
  bindPresets(state, elements.windSlider, presetButtons, render);

  if (elements.windSlider) {
    elements.windSlider.addEventListener('input', (event) => {
      state.wind = Number(event.target.value);
      render();
    });
  }
  if (elements.altitudeSlider) {
    elements.altitudeSlider.addEventListener('input', (event) => {
      state.altitude = Number(event.target.value);
      render();
    });
  }
  if (elements.incidenceSlider) {
    elements.incidenceSlider.addEventListener('input', (event) => {
      state.incidence = Number(event.target.value);
      render();
    });
  }

  window.addEventListener('resize', () => {
    if (elements.plot && window.Plotly?.Plots) {
      window.Plotly.Plots.resize(elements.plot);
    }
  });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
