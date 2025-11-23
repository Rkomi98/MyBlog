# **Technical Compendium of Earth Observation Systems: Physics, Metrology, and Advanced Satellite Applications**

\



## **1. Introduction: The Evolution of Satellite Remote Sensing**

Earth Observation (EO) has undergone a radical metamorphosis over the last decade, transitioning from an exclusive domain of large government agencies to a hybrid and dynamic ecosystem, characterized by the convergence of high-precision scientific missions and massive commercial constellations. The ability to monitor the Earth system on a global scale, with unprecedented temporal and spatial resolutions, lies in the diversification of sensor technologies. It is no longer just about acquiring optical images, but about probing the physics of the atmosphere, the chemistry of the oceans, and the dynamics of the Earth's crust across the entire electromagnetic spectrum and beyond, measuring gravitational and magnetic potential fields.

This report analyzes in detail nineteen distinct categories of satellite instrumentation. For each, the physical principle of operation is dissected, supported by the mathematical formalism governing the interaction between radiation and matter, and the operational applications that transform raw data into critical geophysical information are examined.<sup>1</sup> The analysis extends from passive sensors that measure reflected solar radiation or terrestrial thermal emission, to active sensors that illuminate the surface with their own pulses, to opportunistic sensors that exploit existing signals to infer environmental properties.

***


## **2. GNSS Radio Occultation (GNSS-RO): Precision Atmospheric Sounding**

GNSS Radio Occultation (GNSS-RO) represents one of the most elegant and robust remote sensing techniques, transforming navigation signals, originally conceived for positioning, into high-precision tools for meteorology and climatology.


### **Physical Principle and Mathematical Formulation**

The technique is based on the refraction of radio waves transmitted by GNSS satellites (GPS, Galileo, GLONASS) as they pass through the Earth's atmosphere to reach a receiver on a low Earth orbit (LEO) satellite setting behind the Earth's limb. Due to the vertical variation in atmospheric density, the signal path is curved.

The fundamental parameter measured is the excess phase delay, from which the bending angle ($\alpha$) is derived as a function of the impact parameter ($a$). In a locally spherically symmetric atmosphere, the relationship between the bending angle and the refractive index $n(r)$ is governed by the generalized Snell's law and can be inverted using the inverse Abel transform <sup>3</sup>:

$$n(r) = \exp \left( \frac{1}{\pi} \int\_{a}^{\infty} \frac{\alpha(x)}{\sqrt{x^2 - a^2}} \\, dx \right)$$

Where $x = n(r) \cdot r$ is the refractive radius. Once the refractive index profile is obtained, the refractivity $N$ is calculated, defined as $N = (n-1) \times 10^6$. The relationship between refractivity and atmospheric thermodynamic variables is described by the Smith-Weintraub equation <sup>3</sup>:

$$N = 77.6 \frac{P}{T} + 3.73 \times 10^5 \frac{e}{T^2} - 40.3 \frac{n\_e}{f^2}$$

In this equation:

- $P$ is the total atmospheric pressure (hPa).

- $T$ is the temperature (K).

- $e$ is the partial pressure of water vapor (hPa).

- $n\_e$ is the electron density, which dominates the ionospheric term (significant above 60-80 km).

- $f$ is the signal frequency.


### **Utility and Critical Applications**

The strength of GNSS-RO lies in its "self-calibrating" nature: since it is based on time and frequency measurements (guaranteed by atomic clocks), it does not suffer from instrumental drift, making it ideal for long-term climate monitoring.<sup>6</sup>

- **Operational Meteorology (NWP):** RO profiles are essential for anchoring weather models in the upper troposphere and stratosphere, where other data are scarce, correcting temperature biases.<sup>7</sup>

- **Climatology:** Monitoring global temperature trends and the tropopause with absolute precision.

- **Space Weather:** Measurement of Total Electron Content (TEC) and ionospheric scintillations, crucial for the security of satellite communications.<sup>8</sup>


### **Reference Missions**

The technique was pioneered by the **GPS/MET** mission and made operational by the **COSMIC-1** constellation (Taiwan/USA). Currently, **COSMIC-2** provides dense coverage in equatorial latitudes, optimized for studying hurricanes and the ionosphere.<sup>6</sup> In parallel, the "NewSpace" commercial sector has revolutionized this field: **Spire Global**, with its constellation of over 100 LEMUR CubeSats, and **PlanetIQ**, provide thousands of daily occultations, integrating institutional data.<sup>9</sup>

***

## **3. GNSS Reflectometry (GNSS-R): The Bistatic Radar of Opportunity**

While Radio Occultation exploits signals transmitted through the atmosphere, GNSS Reflectometry (GNSS-R) analyzes signals reflected from the Earth's surface, operating as a multi-static bistatic radar.

### **What It Measures**

GNSS-R allows for the extraction of geophysical properties from the reflecting surface:

- **Oceans:** Surface wind speed and Mean Square Slope.

- **Land:** Soil Moisture and vegetation biomass.

- **Cryosphere:** Sea ice extent and thickness.

### **Physical Operation and Formulas**

The receiver measures the power of the reflected signal as a function of time delay and Doppler shift, generating a _Delay Doppler Map_ (DDM). The received power $P\_r$ is described by the bistatic radar equation <sup>9</sup>:

$$ P\_r(\tau, f\_D) = \frac{P\_t G\_t \lambda^2}{(4\pi)^3} \iint\_A \frac{G\_r(\vec{r}) \sigma^0(\vec{r}) \chi^2(\tau, f\_D)}{R\_t^2(\vec{r}) R\_r^2(\vec{r})} , d\vec{r} $$

Where:

- $\sigma^0$ is the bistatic scattering coefficient of the surface.

- $\chi^2$ is the ambiguity function (Woodward Ambiguity Function) that describes the system's response.

- $R\_t$ and $R\_r$ are the distances from the transmitter and receiver to the specular reflection point.

On calm (specular) surfaces, energy is concentrated at one point in the DDM. On rough surfaces (ocean agitated by wind), energy disperses to form a "horseshoe" shape in the DDM map; the amplitude of this dispersion is directly correlated with wind speed.

### **Utility and Applications**

The "killer" application of GNSS-R is tropical cyclone monitoring. Unlike optical radiometers (blocked by clouds) or Ku-band scatterometers (attenuated by heavy rain), L-band GNSS signals penetrate intense precipitation, allowing for the measurement of wind speed in the eye of the cyclone.<sup>9</sup>

In terrestrial environments, the technique provides high-temporal-resolution soil moisture maps, essential for flood forecasting and agriculture.

### **Missions**

- **CYGNSS (NASA):** A constellation of 8 microsatellites launched to study hurricane intensification, which has also demonstrated surprising capabilities in monitoring tropical wetlands.

- **FSSCat (ESA):** A mission based on two 6U CubeSats (²Cat-5/A and B) that combines GNSS-R with an optical hyperspectral sensor, winner of the Copernicus Masters.<sup>12</sup>

- **Spire Global:** Offers commercial reflectometry products for maritime and sea ice monitoring.<sup>9</sup>

***

## **4. Synthetic Aperture Radar (SAR): All-Weather Microwave Imaging**

SAR represents the primary instrument for observing the solid surface in all weather and lighting conditions, thanks to its active nature and microwave wavelength.

### **What It Measures**

SAR returns complex images where each pixel contains:

- **Amplitude:** Correlated with surface roughness, dielectric constant (moisture), and local geometry.

- **Phase:** Correlated with the geometric sensor-target distance, fundamental for interferometric applications.

### **Physical Operation and Formulas**

To achieve high spatial resolution in the azimuthal direction (along-track) without employing kilometer-long antennas, SAR exploits the satellite's motion to synthesize a virtual aperture. By coherently processing the phase history of the return echoes (Doppler effect), the theoretical azimuthal resolution $\delta\_a$ becomes independent of distance and is equal to half the length of the real antenna $L\_a$ <sup>14</sup>:

$$\delta\_a = \frac{L\_a}{2}$$

The range resolution (perpendicular to the track) is determined by the bandwidth $B$ of the transmitted pulse (often a frequency-modulated _chirp_):

$$\delta\_r = \frac{c}{2B \sin(\theta)}$$

Where $\theta$ is the incidence angle. The phase equation $\phi$ for a pixel at distance $R$ is given by <sup>15</sup>:

$$\phi = -\frac{4\pi R}{\lambda} + \phi\_{scatt}$$

The term $4\pi R / \lambda$ indicates that the phase completes a full cycle each time the distance changes by half a wavelength ($\lambda/2$).

### **Utility and Applications**

The versatility of SAR is immense:

- **Maritime Monitoring:** Detection of ships, _oil spills_ (which appear dark due to capillary wave suppression) and sea ice classification.<sup>16</sup>

- **Agriculture:** Monitoring crop growth (biomass and structure sensitivity) and soil moisture.

- **Emergency Management:** Rapid flood mapping (calm water appears black due to specular reflection away from the sensor).<sup>16</sup>


### **Missions**

- **Sentinel-1 (ESA/Copernicus):** The reference C-band mission, providing global data with an open access policy, crucial for operational interferometry.<sup>16</sup>

- **COSMO-SkyMed (ASI/Italy) & TerraSAR-X (DLR/Germany):** X-band systems with very high resolution for dual civil/military uses.

- **NISAR (NASA/ISRO):** Future L- and S-band mission, focused on biomass and global crustal deformation.

***


## **5. SAR Interferometry (InSAR): Geodesy from Space**

InSAR is a SAR-derived technique that exploits the phase difference between two acquisitions to measure topography or millimeter-scale surface deformations.


### **What It Measures**

It measures the displacement of the Earth's surface along the Line of Sight (LOS) or generates Digital Elevation Models (DEMs).


### **Physical Principles and Formulas**

The interferometric phase difference $\Delta \phi$ between two images is composed of several contributions:

$$ \Delta \phi = \Delta \phi\_{geom} + \Delta \phi\_{topo} + \Delta \phi\_{def} + \Delta \phi\_{atm} + \Delta \phi\_{noise} $$

- $\Delta \phi\_{def}$ is the phase due to ground displacement.

- $\Delta \phi\_{topo}$ is related to residual topography.

- $\Delta \phi\_{atm}$ is the atmospheric delay (often the main error term).

The relationship between deformation $d$ and the unwrapped phase is <sup>18</sup>:

$$d = \frac{\lambda}{4\pi} \Delta \phi\_{unwrapped}$$

For a C-band satellite like Sentinel-1 ($\lambda \approx 5.6$ cm), an interference fringe ($2\pi$) corresponds to a displacement of approximately 2.8 cm.<sup>20</sup>


### **Applications**

- **Tectonics and Volcanology:** Measurement of post-seismic deformation fields and the "breathing" of volcanoes (inflation/deflation of magma chambers).<sup>21</sup>

- **Urban Subsidence:** Monitoring the stability of buildings and critical infrastructure with advanced techniques such as Persistent Scatterers (PS-InSAR).<sup>16</sup>

***


## **6. Radar Altimetry: Ocean and Ice Topography**

Nadir radar altimetry is the fundamental technique for quantifying sea level rise and ocean circulation.


### **What It Measures**

It measures the vertical distance (range) between the satellite and the surface at nadir. Combining this measurement with precise orbit and geophysical corrections, one obtains:

- **Sea Surface Height (SSH).**

- **Significant Wave Height (SWH).**

- **Wind speed** (from backscatter intensity).


### **Physical Principles and Formulas**

The altimeter emits a radar pulse and records the return echo. The sea surface height ($SSH$) is calculated as <sup>22</sup>:

$$SSH = H\_{sat} - (R\_{obs} + \Delta R\_{iono} + \Delta R\_{dry} + \Delta R\_{wet} + \Delta R\_{ssb})$$

Where $\Delta R\_{ssb}$ is the Sea State Bias, due to the fact that wave troughs reflect better than crests. The echo waveform is analytically modeled by the Brown Model, which describes the convolution between the system response, the probability density of wave heights, and the impulsive response of the flat surface.23

The SAR Altimetry (or Delay-Doppler) technique, introduced by CryoSat-2 and Sentinel-3, improves along-track resolution (\~300m) by focusing energy into Doppler cells, allowing precise measurements even among sea ice and in coastal waters.24


### **Missions**

- **Sentinel-3 (SRAL):** Operational SAR altimeter for ocean and ice.

- **Jason-3 / Sentinel-6 Michael Freilich:** The reference series for climate continuity of the Global Mean Sea Level (GMSL).

- **SWOT (Surface Water and Ocean Topography):** Wide-swath radar interferometry (Ka-band) to extend altimetry from 1D profile to 2D map.

***


## **7. Scatterometry: Wind over the Sea Surface**

Scatterometers are active radars designed to measure large-scale ocean surface roughness, providing the global wind vector.


### **What It Measures**

The normalized radar backscatter coefficient ($\sigma^0$) from different azimuthal angles, from which wind speed and direction at 10m above the surface are inverted.


### **Physical Principles and Formulas**

The relationship between $\sigma^0$ and wind is described by _Geophysical Model Functions_ (GMFs), empirically defined as <sup>26</sup>:

$$ \sigma^0(\theta, \chi, U) = A\_0(U, \theta) \[1 + A\_1(U, \theta) \cos \chi + A\_2(U, \theta) \cos 2\chi] $$

Where $U$ is the wind speed and $\chi$ is the relative direction with respect to the antenna. By observing the same sea cell from different angles (generally 3 antennas or a rotating antenna), it is possible to resolve directional ambiguity and determine the wind vector.


### **Utility and Applications**

- **Marine Meteorology:** Essential data for identifying fronts and extratropical cyclones.

- **Climate:** Study of air-sea interaction and surface stresses that drive ocean currents.


### **Missions**

- **MetOp (ASCAT):** C-band fixed fan-beam scatterometer (dual swath).

- **CFOSAT:** Franco-Chinese rotating scatterometer designed to jointly measure wind and wave spectra.

***


## **8. Panchromatic Optical Imaging: Extreme Geometric Resolution**

Panchromatic sensors form the backbone of high spatial resolution observation for intelligence and detailed mapping.


### **What It Measures**

Radiance integrated over a single very broad spectral band (typically visible + near-infrared, 0.4 - 0.9 $\mu m$).


### **Physical Operation**

The wide bandwidth allows for the collection of a large number of photons, ensuring a high Signal-to-Noise Ratio (SNR). This enables the reduction of pixel size (IFOV) while maintaining short integration times, necessary to avoid orbital _motion blur_. Spatial resolution can drop below 30 cm in modern commercial platforms.<sup>27</sup>


### **Applications and Pansharpening**

The panchromatic band is often used in synergy with low-resolution multispectral bands through _Pansharpening_ techniques. The resulting image combines the high geometric fidelity of the panchromatic with the chromatic information of the multispectral. A simplified relationship for fusion is <sup>28</sup>:

$$I\_{Pan} \approx \sum\_i \alpha\_i \cdot I\_{MS, i}$$


### **Missions**

- **Maxar (WorldView Legion), Airbus (Pléiades Neo):** Market-leading commercial resolutions (30 cm).

- **Landsat 8/9:** 15m panchromatic band to refine 30m spectral bands.<sup>29</sup>

***


## **9. Multispectral Optical Imaging: The Color of Earth**

The standard for global environmental monitoring, which acquires images in a discrete number of spectral bands (approximately 4 to 15).


### **What It Measures**

Surface reflectance in discrete bands in the Visible (VIS), Near-Infrared (NIR), and Shortwave Infrared (SWIR).


### **Physics and Spectral Indices**

It exploits the distinctive spectral signatures of materials. For example, chlorophyll absorbs in the red and strongly reflects in the NIR. The NDVI (_Normalized Difference Vegetation Index_) quantifies vegetation health:

$$NDVI = \frac{\rho\_{NIR} - \rho\_{RED}}{\rho\_{NIR} + \rho\_{RED}}$$

The use of SWIR bands is crucial for discriminating snow from clouds and for monitoring vegetation water stress.


### **Applications and Missions**

- **Sentinel-2 (ESA):** With 13 bands and 10-20m resolution, it is the reference for precision agriculture and land cover monitoring.<sup>16</sup>

- **Landsat 8/9 (NASA/USGS):** Ensures continuity of observations since 1972, essential for long-term change studies.

***


## **10. Hyperspectral Imaging: Spectroscopy from Space**

Hyperspectral imaging (HSI) extends the multispectral concept by acquiring hundreds of contiguous bands, allowing for detailed chemical-physical analysis of each pixel.


### **What It Measures**

A data "hypercube" $(x, y, \lambda)$ with hundreds of narrow spectral channels (e.g., 5-10 nm), covering the VNIR-SWIR range (400-2500 nm).


### **Physical Operation and Spectral Mixing**

Each pixel contains a continuous spectrum that acts as a chemical "fingerprint". The measured signal $y$ is often modeled as a linear mixture of the pure spectra of the constituent materials (_endmembers_) $M$ present in the pixel, according to the _Linear Mixing Model_ (LMM) <sup>30</sup>:

$$y = \sum\_{k=1}^{K} a\_k m\_k + n$$

Where $a\_k$ are the fractional abundances. This allows for the identification of sub-pixel materials or specific minerals.


### **Utility and Applications**

- **Mineral Geology:** Identification of hydrothermal alterations and rare earth elements.

- **Water Quality:** Distinction between different algal species and sediments.<sup>32</sup>

- **Intelligent CubeSats:** The **FSSCat/$\Phi$-Sat-1** mission demonstrated the use of on-board AI to process hyperspectral data (HyperScout-2) and discard cloudy images directly in orbit, optimizing downlink.<sup>13</sup>


### **Missions**

- **EnMAP (DLR) & PRISMA (ASI):** Operational high-performance scientific missions.<sup>34</sup>

- **PACE (NASA):** Launched in 2024, with the OCI (Ocean Color Instrument) extending hyperspectral capabilities to global oceans.<sup>32</sup>

***

## **11. Thermal Infrared (TIR): The Planet's Heat**

TIR sensors measure the energy emitted by Earth, allowing for the inference of surface temperature.

### **What It Measures**

- **Land Surface Temperature (LST).**

- **Sea Surface Temperature (SST).**

- **Thermal Anomalies:** Wildfires and volcanic activity.

### **Physical Principle and Formulas**

The measured radiance $L\_{\lambda}$ is converted into brightness temperature $T\_b$ by inverting Planck's Law <sup>36</sup>:

$$T\_b = \frac{h c}{k\_B \lambda \ln\left( \frac{2 h c^2}{\lambda^5 L\_\lambda} + 1 \right)}$$

To obtain the actual kinetic temperature ($T\_{surf}$), it is necessary to correct for the surface emissivity $\epsilon$ and for the atmospheric contribution (water vapor absorption/emission). _Split-Window_ algorithms use two nearby thermal channels (e.g., 11 $\mu m$ and 12 $\mu m$) to estimate and remove the atmospheric effect.

### **Missions**

- **Sentinel-3 (SLSTR):** High precision (<0.3 K) for climatic SST, using a dual view (nadir and oblique) to correct for the atmosphere.

- **Landsat 8/9 (TIRS):** Two thermal bands at 100m resolution.

- **ECOSTRESS (ISS):** Monitoring evapotranspiration and vegetation water stress.

***

## **12. Passive Microwave Radiometry (Surface Imaging)**

Sensors that observe the natural microwave emission from the Earth's surface at low frequencies (L, C, X Band).

### **What It Measures**

- **Soil Moisture:** The dielectric constant of water is very high (~80) compared to dry soil (~4), drastically influencing emissivity.

- **Ocean Salinity (SSS):** In L-band (1.4 GHz), emissivity depends on salinity.

### **Physical Principle and Synthetic Interferometry**

In microwaves, the Rayleigh-Jeans approximation ($h\nu \ll k\_B T$) holds, so radiance is proportional to physical temperature:

$$T\_b \approx \epsilon \cdot T\_{phys}$$

The **SMOS** (ESA) mission introduced a revolutionary technology: the interferometric synthetic aperture radiometer (MIRAS). Instead of a large rotating parabolic antenna (as in SMAP), it uses a static array of 69 Y-shaped antennas. The brightness temperature image is mathematically reconstructed from the inverse Fourier transform of the visibility functions measured between pairs of antennas.<sup>37</sup>

### **Missions**

- **SMOS (ESA):** Pioneer of interferometric L-band.

- **SMAP (NASA):** Radiometer with a large rotating antenna (6m) for high-precision soil moisture.

- **AMSR-2 (JAXA):** Multifrequency "workhorse" radiometer for precipitable water, ice, and SST.

***

## **13. Microwave Radiometry for Atmospheric Sounding**

These sensors vertically profile the atmosphere by exploiting molecular absorption lines.

### **What It Measures**

- **Temperature** profiles (O$\_2$ absorption band at 50-60 GHz).

- **Humidity** profiles (H$\_2$O absorption band at 183 GHz).

### **Physical Principle**

The principle is based on the variation of atmospheric opacity with frequency. Channels centered on absorption lines "see" only the upper layers (emission from below is reabsorbed). Channels on the wings of the line penetrate deeper. The radiative transfer equation is <sup>40</sup>:

$$T\_b(\nu) \approx T\_{surf} e^{-\tau\_\nu(0, \infty)} + \int\_{0}^{\infty} T(z) K\_\nu(z) dz$$

Where $K\_\nu(z)$ is the _weighting function_ that determines the peak altitude of the signal for that frequency.

### **Utility**

These data are the single most impactful input source for the quality of global weather forecasts (NWP).

New CubeSat constellations like TROPICS (NASA) use miniaturized radiometers to provide revisit times of less than an hour over hurricanes, which is impossible for traditional large polar satellites.

***

## **14. Topographic and Bathymetric Lidar: Photon Counting**

Lidar (Light Detection and Ranging) altimeters measure elevation with centimeter precision using laser pulses.

### **What It Measures**

- Sea ice thickness and polar ice sheet elevation.

- Vegetation height (_canopy height_) and biomass.

### **Physical Principle: Photon Counting**

Unlike classic Lidars that digitize the entire analog waveform, the ATLAS instrument on ICESat-2 uses the Photon Counting technique. It emits green laser pulses (532 nm) at very high frequency (10 kHz) divided into 6 beams. The receiver counts individual returning photons, timing them with picosecond precision.

The statistical accumulation of photons allows for the reconstruction of the surface, the seabed (up to 40m in clear waters), and the vertical structure of the forest.41

### **Applications and Missions**

- **ICESat-2 (NASA):** Fundamental for estimating the cryosphere's mass balance.<sup>44</sup>

- **GEDI (ISS):** Full-waveform lidar optimized for tropical and temperate forest structure.

***


## **15. Atmospheric Doppler Lidar (Wind Lidar)**

Measuring clear-air wind from space has been one of the most arduous technological challenges in EO.


### **What It Measures**

Vertical profiles of the horizontal wind component along the Line-of-Sight (LOS).


### **Physical Principle**

It is based on the optical Doppler effect. The laser pulse sent into the atmosphere is backscattered by air molecules (_Rayleigh scattering_) and aerosols/clouds (_Mie scattering_). The movement of these targets along the line of sight causes a frequency shift $\Delta f$:

$$\Delta f = \frac{2 v\_{LOS}}{\lambda}$$

The **Aeolus** mission uses an HSRL (_High Spectral Resolution Lidar_) receiver with two distinct optical channels:

1. A Fizeau interferometer for the Mie signal (narrow spectrum, aerosols).

2. A Fabry-Pérot interferometer for the Rayleigh signal (spectrum broadened by molecular thermal motion).<sup>45</sup>


### **Missions**

- **Aeolus (ESA):** A demonstrator mission that filled a critical gap in the global observation system (winds at altitude over oceans), significantly improving European weather models.<sup>47</sup>

***


## **16. Satellite Gravimetry: Weighing Water from Space**

Gravimetry measures variations in the planet's mass, offering a unique view of the deep water cycle.


### **What It Measures**

Anomalies in the Earth's gravitational field and their temporal variations (monthly). These variations are due to the movement of large water masses (glacier melt, aquifer depletion, ocean level variations).


### **Physical Principle: Satellite-to-Satellite Tracking (SST)**

Two identical satellites (as in GRACE and GRACE-FO) fly in the same orbit separated by approximately 220 km. A microwave ranging system (K-band) or a laser interferometer (in GRACE-FO) measures the inter-satellite distance variation with micrometric precision.

When the leading satellite flies over an excess mass (e.g., a mountain), it is gravitationally accelerated, moving away from the second. By analyzing the variations in relative velocity (Range-Rate $\dot{\rho}$), the global gravitational potential is reconstructed.<sup>48</sup>


### **Missions and Applications**

- **GRACE / GRACE-FO (NASA/GFZ):** They quantified for the first time unequivocally the mass loss of polar ice sheets and the excessive abstraction from aquifers in India and California.<sup>50</sup>

- **GOCE (ESA):** Used a gradiometer (ultrasensitive accelerometers) to define the static geoid with unprecedented spatial resolution and precision.

***


## **17. Satellite Magnetometry**

Space magnetometers study the Earth's magnetic field, a protective shield against the solar wind.


### **What It Measures**

The total magnetic field vector $\vec{B}$, separating contributions from the core (Core field), the crust (Lithospheric field), and external electric currents (Ionosphere/Magnetosphere).


### **Physical Principle: Fluxgate and Scalar**

High-precision missions use a combination of instruments:

1. **Fluxgate Magnetometer (Vector):** Measures the three components of the field. It exploits the periodic magnetic saturation of a ferromagnetic core; the second harmonic of the induced signal is proportional to the external field.<sup>51</sup> Requires precise attitude calibration via Star Trackers rigidly attached to the instrument boom.

2. **Absolute Scalar Magnetometer:** (e.g., Overhauser or optically pumped helium) Measures the total intensity $|\vec{B}|$ by exploiting nuclear magnetic resonance or atomic transitions (Zeeman effect), providing an absolute reference for calibrating vector instruments.<sup>53</sup>


### **Missions**

- **Swarm (ESA):** Constellation of 3 satellites that allows separating temporal from spatial variations of the geomagnetic field.

- **DSCOVR (NASA/NOAA):** Positioned at L1, it uses magnetometers to monitor the interplanetary magnetic field (IMF) carried by the solar wind, providing early warning for geomagnetic storms.<sup>54</sup>

***


## **18. Lightning Mapping (Geostationary): GLM**

Geostationary lightning sensors offer continuous monitoring of severe convective phenomena.


### **What It Measures**

Detects total lightning activity, including intra-cloud (IC) and cloud-to-ground (CG) lightning, day and night over a hemisphere.


### **Physical Principle**

Strumenti come il GLM (Geostationary Lightning Mapper) su GOES-R sono sensori ottici ad alta velocità che operano in una banda stretta nel vicino infrarosso (777.4 nm), corrispondente a una riga di emissione dell'ossigeno atomico nel plasma del fulmine.

Il sensore rileva variazioni transitorie di luminosità a livello di pixel sottraendo il background in tempo reale (filtro di eventi). Questo permette di vedere il lampo anche sopra nuvole illuminate dal sole pieno.56


### **Applicazioni**

L'improvviso aumento del tasso di fulminazione ("Lightning Jump") è un precursore fisico affidabile dell'intensificazione di una tempesta e della possibile genesi di tornado, aumentando il tempo di preavviso (lead time) per gli allarmi meteo.<sup>58</sup>

***


## **19. Segnali di Opportunità e CubeSat Radar: La Nuova Frontiera**

Questa categoria unisce due trend emergenti: l'uso di segnali non nativi per l'EO e la miniaturizzazione estrema dei sensori attivi.


### **A. Monitoraggio Traffico: AIS e ADS-B Satellitare**

I satelliti captano i messaggi di posizione trasmessi da navi (AIS) e aerei (ADS-B). La sfida principale è la **de-collisione dei pacchetti**: un satellite vede un'area enorme (FOV \~5000 km) contenente migliaia di emettitori che trasmettono negli stessi slot temporali (TDMA).

- **SOTDMA vs CSTDMA:** Il protocollo SOTDMA (usato dalle grandi navi Classe A) prenota gli slot futuri ed è più facile da decodificare dallo spazio rispetto al CSTDMA (Classe B), che usa un approccio randomico "ascolta prima di parlare", spesso saturato in orbita.<sup>59</sup>

- **Applicazioni:** Fusione con dati SAR per identificare navi "dark" (che non trasmettono AIS) coinvolte in pesca illegale o traffici illeciti.


### **B. CubeSat Radar: RainCube**

Fino a poco tempo fa, i radar erano considerati incompatibili con i CubeSat a causa dei requisiti di potenza e dimensioni. La missione **RainCube** (NASA) ha dimostrato un radar meteorologico in banda Ka (35.7 GHz) su un CubeSat 6U.

- **Innovazione:** Uso di un'antenna parabolica dispiegabile ultraleggera e di tecniche di compressione dell'impulso. In banda Ka, la pioggia attenua fortemente il segnale; RainCube sfrutta proprio questo principio per profilare la struttura delle tempeste.<sup>61</sup>


### **C. Smart LNB: Pioggia dalle TV Satellitari**

Progetti come **NEFOCAST** trasformano i ricevitori TV satellitari domestici (Smart LNB) in pluviometri. Misurano l'attenuazione del segnale di downlink (Ku/Ka band) causata dalla pioggia (_Rain Fade_).

- **Formula:** L'attenuazione specifica $A$ (dB/km) è legata al tasso di precipitazione $R$ (mm/h) dalla legge di potenza $A = k R^\alpha$. Una rete densa di "sensori" domestici fornisce mappe di pioggia in tempo reale con risoluzione capillare.<sup>63</sup>

***


### **Tabella Comparativa Sintetica delle Tecnologie**

|                         |                     |                                        |                                |                               |
| ----------------------- | ------------------- | -------------------------------------- | ------------------------------ | ----------------------------- |
| **Category**            | **Sensor Type**     | **Primary Measurement**                | **Exemplary Missions**         | **Key Application**           |
| **GNSS-RO**             | Passive (Limb)      | Refractivity ($N$), Temp., Humidity    | COSMIC-2, Spire, MetOp         | Weather (NWP), Climate        |
| **GNSS-R**              | Bistatic            | Surface Roughness, Wind, Soil Moisture | CYGNSS, FSSCat                 | Hurricanes, Floods            |
| **SAR**                 | Active (Microwave)  | Backscatter ($\sigma^0$), Phase        | Sentinel-1, COSMO-SkyMed       | Deformations (InSAR), Ice     |
| **Radar Altimetry**     | Active (Nadir)      | SSH, SWH, Wind                         | Sentinel-3, Jason-3, SWOT      | Sea Level, Oceanography       |
| **Scatterometry**       | Active (Microwave)  | Vector Wind                            | MetOp (ASCAT), CFOSAT          | Marine Weather                |
| **Optical Pan**         | Passive (Vis/NIR)   | Radiance (High Spatial Res.)           | WorldView, Pléiades, Landsat   | Cartography, Intelligence     |
| **Optical Multi**       | Passive (Vis/IR)    | Spectral Reflectance (Bands)           | Sentinel-2, Landsat            | Agriculture, Land Cover       |
| **Hyperspectral**       | Passive (Vis/SWIR)  | Continuous Spectrum ($>100$ bands)     | EnMAP, PRISMA, PACE            | Geology, Water Quality        |
| **Thermal (TIR)**       | Passive (Emission)  | Brightness Temperature ($T\_b$)        | Landsat, Sentinel-3, ECOSTRESS | SST, LST, Fires               |
| **Radiometry (Ground)** | Passive (Microwave) | $T\_b$ (L/C/X Band)                    | SMOS, SMAP                     | Soil Moisture, Salinity       |
| **Atm. Sounding**       | Passive (Microwave) | T/Humidity Profiles (O$\_2$, H$\_2$O)  | AMSU/MHS, TROPICS              | Global Weather Input          |
| **Lidar Altimetry**     | Active (Laser)      | Elevation, Ice Thickness               | ICESat-2, GEDI                 | Ice Mass Balance              |
| **Lidar Wind**          | Active (Doppler)    | LOS Wind (Doppler Shift)               | Aeolus                         | Clear-air Wind                |
| **Gravimetry**          | Active (SST)        | Gravity Anomalies (Mass)               | GRACE-FO, GOCE                 | Groundwater, Glaciers         |
| **Magnetometry**        | Passive (In-situ)   | Magnetic Field Vector                  | Swarm, DSCOVR                  | Geomagnetic Models            |
| **Lightning (GLM)**     | Passive (Optical)   | Lightning Events                       | GOES-R, MTG                    | Storm Nowcasting              |
| **AIS / ADS-B**         | Passive (RF)        | Ship/Aircraft Position                 | Spire, Aireon                  | Global Tracking               |
| **CubeSat Radar**       | Active (Ka-band)    | Rain Profile                           | RainCube                       | Technology Demonstrator       |
| **Smart LNB**           | Opportunity         | Rain Attenuation                       | NEFOCAST                       | Distributed Rainfall          |

## **Conclusion**

The analysis of these nineteen categories reveals an increasingly interconnected and multi-physical Earth observation system. The dominant trend is data fusion (_Data Fusion_): the vertical precision of Lidar and Radar is extended horizontally by optical and radiometric constellations. Furthermore, the integration of traditional scientific sensors with commercial opportunity data (GNSS-R, Smart LNB, AIS) is creating a true "Digital Twin" of the planet, capable of quantifying not only the state of the natural environment but also anthropogenic impact in real-time.

#### **Works cited**

1. Parametric Sizing Equations for Earth Observation Satellites | Request PDF - ResearchGate, accessed November 23, 2025, <https://www.researchgate.net/publication/328159562_Parametric_Sizing_Equations_for_Earth_Observation_Satellites>

2. perspective on Gaussian processes for Earth observation | National Science Review, accessed November 23, 2025, <https://academic.oup.com/nsr/article/6/4/616/5369430>

3. GNSS radio occultation (GNSS-RO): Lecture 1 – Principles and NWP use - ECMWF Events (Indico), accessed November 23, 2025, <https://events.ecmwf.int/event/375/contributions/4253/attachments/2310/4039/gnssro_lecture_KL_2024.pdf>

4. A variational regularization of Abel transform for GPS radio occultation - AMT, accessed November 23, 2025, <https://amt.copernicus.org/articles/11/1947/>

5. GNSS radio occultation excess-phase processing for climate applications including uncertainty estimation - AMT, accessed November 23, 2025, <https://amt.copernicus.org/articles/16/5217/>

6. GNSS Radio Occultation | Constellation Observing System for Meteorology Ionosphere and Climate - ucar cosmic, accessed November 23, 2025, <https://www.cosmic.ucar.edu/what-we-do/gnss-radio-occultation>

7. Using the Commercial GNSS RO Spire Data in the Neutral Atmosphere for Climate and Weather Prediction Studies - the NOAA Institutional Repository, accessed November 23, 2025, <https://repository.library.noaa.gov/view/noaa/58772/noaa_58772_DS1.pdf>

8. Sensing the ionosphere with the Spire radio occultation constellation | Journal of Space Weather and Space Climate, accessed November 23, 2025, <https://www.swsc-journal.org/articles/swsc/full_html/2021/01/swsc210051/swsc210051.html>

9. Reconnaissance satellite constellations: For enhanced global awareness - Spire, accessed November 23, 2025, <https://spire.com/blog/space-reconnaissance/reconnaissance-satellite-constellations-for-enhanced-global-awareness/>

10. Space Weather Data from Commercial GNSS RO, accessed November 23, 2025, <https://www.swpc.noaa.gov/sites/default/files/images/u4/07%20Rob%20Kursinski.pdf>

11. RainCube Demonstrates Miniature Radar Technology to Measure Storms - NASA Science, accessed November 23, 2025, <https://science.nasa.gov/science-research/science-enabling-technology/technology-highlights/raincube-demonstrates-miniature-radar-technology-to-measure-storms/>

12. FSSCat Overview - ESA Earth Online, accessed November 23, 2025, <https://earth.esa.int/eogateway/missions/fsscat/description>

13. FSSCat - Earth Online, accessed November 23, 2025, <https://earth.esa.int/eogateway/missions/fsscat>

14. Synthetic-aperture radar - Wikipedia, accessed November 23, 2025, <https://en.wikipedia.org/wiki/Synthetic-aperture_radar>

15. Synthetic Aperture Radar (SAR): Principles and Applications - eo4society, accessed November 23, 2025, <https://eo4society.esa.int/wp-content/uploads/2021/02/D1T2a_LTC2015_Younis.pdf>

16. S1 Applications - SentiWiki - Copernicus, accessed November 23, 2025, <https://sentiwiki.copernicus.eu/web/s1-applications>

17. Create an Interferogram Using ESA's Sentinel-1 Toolbox | NASA Earthdata, accessed November 23, 2025, <https://www.earthdata.nasa.gov/learn/data-recipes/create-interferogram-using-esas-sentinel-1-toolbox>

18. InSAR Phase Unwrapping Error Correction for Rapid Repeat Measurements of Water Level Change in Wetlands - LaCoast.gov, accessed November 23, 2025, <https://www.lacoast.gov/crms/crms_public_data/publications/Oliver-Cabrera%20et%20al%202021.pdf>

19. Unwrapped Interferograms: Creating a Deformation Map | NASA Earthdata, accessed November 23, 2025, <https://www.earthdata.nasa.gov/learn/data-recipes/unwrapped-interferograms-creating-deformation-map>

20. Sentinel-1 InSAR Product Guide - HyP3, accessed November 23, 2025, <https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/>

21. Sentinel-1 InSAR Processing using S1TBX - Alaska Satellite Facility, accessed November 23, 2025, <https://asf.alaska.edu/wp-content/uploads/2019/05/generate_insar_with_s1tbx_v5.4.pdf>

22. Radar Altimetry Principle and Data Processing by M.-H. Rio, accessed November 23, 2025, <https://ftp.itc.nl/pub/Dragon4_Lecturer_2018/D2_Tue/L1/D2L1-DRAGON_OTC18_Altimetry1_mhr.pdf>

23. Radar Altimetry for remote sensing of the oceans and their impact on climate - ESA Earth Online, accessed November 23, 2025, <https://earth.esa.int/eogateway/documents/20142/0/01_Tuesday_OCT2013_Cipollini_Altimetry_1.pdf>

24. Using Altimetry service data - EUMETSAT - User Portal, accessed November 23, 2025, <https://user.eumetsat.int/data/satellites/sentinel-3/altimetry-service>

25. Altimetry Applications - SentiWiki - Copernicus, accessed November 23, 2025, <https://sentiwiki.copernicus.eu/web/altimetry-applications>

26. Backscatter LIDAR, accessed November 23, 2025, <https://reef.atmos.colostate.edu/~odell/at652/lecture_2013/lecture8b.pdf>

27. Panchromatic Images Explained | Satellite Bands, Specs & Uses - XrTech Group, accessed November 23, 2025, <https://xrtechgroup.com/panchromatic-imaging-bands-uses/>

28. Image Fusion for High-Resolution Optical Satellites Based on Panchromatic Spectral Decomposition - PMC, accessed November 23, 2025, <https://pmc.ncbi.nlm.nih.gov/articles/PMC6603526/>

29. Panchromatic Imagery And Its Band Combinations In Use - EOS Data Analytics, accessed November 23, 2025, <https://eos.com/make-an-analysis/panchromatic/>

30. Hyperspectral Imaging - arXiv, accessed November 23, 2025, <https://arxiv.org/html/2508.08107v1>

31. Full article: Hyperspectral and multispectral image fusion addressing spectral variability by an augmented linear mixing model - Taylor & Francis Online, accessed November 23, 2025, <https://www.tandfonline.com/doi/full/10.1080/01431161.2022.2041762>

32. Introduction to PACE Hyperspectral Observations for Water Quality Monitoring - NASA Applied Sciences, accessed November 23, 2025, <https://appliedsciences.nasa.gov/sites/default/files/2024-09/PACE_Part1_Final.pdf>

33. SSC19-V-05 - DigitalCommons\@USU, accessed November 23, 2025, <https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=4391&context=smallsat>

34. EnMAP, accessed November 23, 2025, <https://www.enmap.org/>

35. Mission - EnMAP, accessed November 23, 2025, <https://www.enmap.org/mission/>

36. Passive Microwave, accessed November 23, 2025, <https://topex.ucsd.edu/rs/Passive_Microwave.pdf>

37. SMOS - ESA Earth Online - European Space Agency, accessed November 23, 2025, <https://earth.esa.int/eogateway/missions/smos>

38. AMSR2 Overview NESDIS Operational Soil Moisture Products - Office of Satellite and Product Operations - NOAA OSPO, accessed November 23, 2025, <https://www.ospo.noaa.gov/products/land/smops/sensors_AMSR2.html>

39. SMOS (Soil Moisture and Ocean Salinity) Mission - eoPortal, accessed November 23, 2025, <https://www.eoportal.org/satellite-missions/smos>

40. Microwave radiometer to retrieve temperature profiles - AMT, accessed November 23, 2025, <https://amt.copernicus.org/preprints/6/2857/2013/amtd-6-2857-2013.pdf>

41. ICESat-2: Home, accessed November 23, 2025, <https://icesat-2.gsfc.nasa.gov/>

42. Counting on NASA's ICESat-2, accessed November 23, 2025, <https://icesat-2.gsfc.nasa.gov/articles/counting-nasas-icesat-2>

43. IceSat 2 ATLAS photon-counting receiver - initial on-orbit performance - NASA Technical Reports Server, accessed November 23, 2025, <https://ntrs.nasa.gov/api/citations/20200001212/downloads/20200001212.pdf>

44. Signal Photon Extraction Method for ICESat-2 Data Using Slope and Elevation Information Provided by Stereo Images - PubMed Central, accessed November 23, 2025, <https://pmc.ncbi.nlm.nih.gov/articles/PMC10649317/>

45. Aeolus Objectives - ESA Earth Online, accessed November 23, 2025, <https://earth.esa.int/eogateway/missions/aeolus/objectives>

46. First validation of Aeolus wind observations by airborne Doppler wind lidar measurements, accessed November 23, 2025, <https://amt.copernicus.org/articles/13/2381/2020/>

47. The ESA ADM-Aeolus Doppler Wind Lidar Mission – Status and validation strategy - ECMWF, accessed November 23, 2025, <https://www.ecmwf.int/sites/default/files/elibrary/2016/16851-esa-adm-aeolus-doppler-wind-lidar-mission-status-and-validation-strategy.pdf>

48. Gravity Recovery and Climate Experiment (GRACE) - NASA Sea Level Change Portal, accessed November 23, 2025, <https://sealevel.nasa.gov/missions/grace>

49. GRACE-FO - Gravity Recovery and Climate Experiment Follow-On - Center for Space Research, accessed November 23, 2025, <https://www2.csr.utexas.edu/grace/RL061LRI.html>

50. Satellite Gravimetry – Measuring Earth's Gravity Field from Space - IAG - Geodesy, accessed November 23, 2025, <https://geodesy.science/item/satellite-gravimetry/>

51. In-flight calibration of the fluxgate magnetometer on Macau Science Satellite-1, accessed November 23, 2025, <https://www.eppcgs.org/article/doi/10.26464/epp2025067>

52. A miniature two-axis fluxgate magnetometer - NASA Technical Reports Server, accessed November 23, 2025, <https://ntrs.nasa.gov/api/citations/19700008650/downloads/19700008650.pdf>

53. Types of magnetometers, uses and characteristics | AV3 AEROVISUAL, accessed November 23, 2025, <https://av3aerovisual.com/en/types-of-magnetometers-uses-and-characteristics/>

54. Deep Space Climate Observatory (DSCOVR) - National Centers for Environmental Information - NOAA, accessed November 23, 2025, <https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.stp.swx:satellite-systems_dscovr>

55. It's all systems go for NOAA's first space weather satellite, accessed November 23, 2025, <https://www.noaa.gov/its-all-systems-go-noaas-first-space-weather-satellite>

56. GOES-R Post Launch Test | NASA Earthdata, accessed November 23, 2025, <https://www.earthdata.nasa.gov/data/projects/goes-r-plt>

57. GOES-R Terrestrial Weather (ABI/GLM) - National Centers for Environmental Information, accessed November 23, 2025, <https://www.ncei.noaa.gov/products/goes-terrestrial-weather-abi-glm>

58. GOES-R Series Data Book, accessed November 23, 2025, <https://www.goes-r.gov/downloads/resources/documents/GOES-RSeriesDataBook.pdf>

59. Sotdma vs cstdma: understanding key differences for maritime communication - BytePlus, accessed November 23, 2025, <https://www.byteplus.com/en/topic/560464>

60. AIS Know-How: Data transfer (SOTDMA vs. CSTDMA), accessed November 23, 2025, <https://defender.com/assets/pdf/simrad/sotdma_cstdma_comparison.pdf>

61. RainCube: the first ever radar measurements from a CubeSat in space - SPIE Digital Library, accessed November 23, 2025, <https://www.spiedigitallibrary.org/journals/journal-of-applied-remote-sensing/volume-13/issue-3/032504/RainCube--the-first-ever-radar-measurements-from-a-CubeSat/10.1117/1.JRS.13.032504.full>

62. RainCube - NASA ESTO, accessed November 23, 2025, <https://esto.nasa.gov/wp-content/uploads/2020/07/RainCube.pdf>

63. Real-Time Rain Rate Evaluation via Satellite Downlink Signal Attenuation Measurement - PubMed Central, accessed November 23, 2025, <https://pmc.ncbi.nlm.nih.gov/articles/PMC5580102/>

64. SmartLNB for weather forecasting - Nefocast, accessed November 23, 2025, <http://www.nefocast.it/news/smartlnb-for-weather-forecasting/>