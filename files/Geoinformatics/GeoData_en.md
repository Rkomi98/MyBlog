# What Data Do Satellites Record?

## Introduction

In recent decades, satellites have become one of the most strategic infrastructures for understanding, monitoring, and managing our planet. Every day, hundreds of missions in orbit collect an impressive amount of information: ultra-high-resolution images, atmospheric data, measurements of land and sea surfaces, navigation signals, vertical atmospheric profiles, and variations in the gravitational and magnetic fields. It's no longer just about "photos from space," but a complex ecosystem of complementary technologies that, together, build the most complete operational representation of Earth ever obtained in human history.

In this article, we will analyze all the main sources of satellite data, ordering them from the most well-known to the least. For each category, we will see what it measures, what it's used for, what real-world applications it enables, what the most representative missions are, and finally, how the sensor that makes it possible works. The goal is to offer a clear yet in-depth overview, useful for both industry professionals and those who wish to better understand the technologies that are revolutionizing the way we observe Earth.

In this report, we analyze in detail nineteen distinct categories of satellite instrumentation. For each, we will examine in detail the physical principle of operation, supported by the mathematical formalism governing the interaction between radiation and matter, and we will explore the operational applications that transform raw data into critical geophysical information.

In this analysis, we will discuss passive sensors that measure reflected solar radiation or terrestrial thermal emission, active sensors that illuminate the surface with their own pulses, as well as opportunistic sensors that leverage existing signals to infer environmental properties.

***

## GNSS – Global Navigation Satellite Systems
GNSS data originated in the military domain but have proven fundamental in many everyday fields. They enable global-scale autonomous positioning and navigation and provide a standard time reference.

GNSS systems (such as GPS, Galileo, GLONASS, BeiDou) transmit radiofrequency signals containing orbital and temporal information from onboard atomic clocks. By measuring the time it takes for the signal to reach a receiver on Earth, the distance and thus the user's position are calculated via trilateration with at least 4 visible satellites. GNSS therefore provides extremely precise measurements of positioning (latitude, longitude, altitude) and absolute time.

They are used in **geodesy** (GNSS station networks monitor tectonic movement and define global references), **precision agriculture**, **mapping** and **GIS**, terrestrial, aerial, and naval **transport**, and synchronization of power grids and telecommunications. For example, the combined use of various GNSS systems now allows for multi-constellation receivers with global coverage and greater reliability.

### GNSS Radio Occultation (GNSS-RO): Precision Atmospheric Sounding

GNSS Radio Occultation (GNSS-RO) represents one of the most elegant and robust remote sensing techniques, transforming navigation signals, originally conceived for positioning, into high-precision tools for meteorology and climatology.

#### Physical Principle and Mathematical Formulation

A GNSS receiver captures coded signals transmitted by satellites, which include the transmission time.

By comparing it with the local time (after synchronization), the satellite distance (pseudo-range) is obtained. By intersecting the distance spheres of 4 or more satellites, the three-dimensional position and the receiver's time difference are resolved. The physical principle is the measurement of the signal's time of flight ($t$) and the relationship
$$d = c \cdot t,$$
where $c$ is the speed of light.

**Relativistic** and **atmospheric corrections** (ionosphere and troposphere) must be applied to achieve accuracies at the meter level or below.

Differential systems and techniques like **RTK (Real-Time Kinematic)** allow for centimeter-level precision by correcting residual errors via reference stations. In summary, GNSS precisely measures position and time on a global scale, constituting an invisible but crucial infrastructure for modern society.

> I warn you, I'm now taking off my popularizer hat and putting on my mathematician hat :)

The fundamental parameter measured is the excess phase delay, from which the bending angle ($\alpha$) is derived as a function of the impact parameter ($a$). In a locally spherically symmetric atmosphere, the relationship between the bending angle and the refractive index $n(r)$ is governed by the generalized Snell's law and can be inverted using the inverse Abel transform <sup>1</sup>:

$$n(r) = \exp \left( \frac{1}{\pi} \int_x^\infty \frac{\alpha(x)}{\sqrt{x^2 - a^2}} \\, dx \right)$$

Where $x = n(r) \cdot r$ is the refractive radius and $\alpha(x)$ is the corrected bending angle. Once the refractive index profile is obtained, refractivity $N$ is calculated, defined as $N = (n-1) \times 10^6$. The relationship between refractivity and atmospheric thermodynamic variables is described by the [Smith-Weintraub](https://nvlpubs.nist.gov/nistpubs/jres/50/jresv50n1p39_A1b.pdf) equation<sup>2</sup>:

$$N = 77.6 \frac{P}{T} + 3.73 \times 10^5 \frac{e}{T^2} - 40.3 \frac{n\_e}{f^2}$$

In this equation:

- $P$ is the total atmospheric pressure (hPa).

- $T$ is the temperature (K).

- $e$ is the water vapor partial pressure (hPa).

- $n\_e$ is the electron density, which dominates the ionospheric term (significant above 60-80 km).

- $f$ is the signal frequency.


#### Utility and Critical Applications

The strength of GNSS-RO lies in its "self-calibrating" measurement nature: since it is based on time and frequency measurements (guaranteed by atomic clocks), it does not suffer from instrumental drift, making it ideal for long-term climate monitoring.<sup>3</sup>

- **Operational Meteorology (NWP):** RO profiles are essential for anchoring meteorological models in the upper troposphere and stratosphere, where other data are scarce, correcting temperature biases.<sup>4</sup>

- **Climatology:** Monitoring global temperature trends and the tropopause with absolute precision.

- **Space Weather:** Measuring Total Electron Content (TEC) and ionospheric scintillations, crucial for satellite communication security.<sup>5</sup>


#### Reference Missions

The technique was pioneered by the **GPS/MET** mission and made operational by the **COSMIC-1** constellation (Taiwan/USA). Currently, **COSMIC-2** provides dense coverage in equatorial latitudes, optimized for the study of hurricanes and the ionosphere.<sup>3</sup> In parallel, the "NewSpace" commercial sector has revolutionized this field: **Spire Global**, with its constellation of over 100 LEMUR CubeSats, and **PlanetIQ**, provide thousands of daily measurements, complementing institutional data.<sup>6</sup>

***

### GNSS Reflectometry (GNSS-R): The Bistatic Radar of Opportunity

While Radio Occultation exploits signals transmitted through the atmosphere, GNSS Reflectometry (GNSS-R) analyzes signals reflected from the Earth's surface, operating as a multi-static bistatic radar.


#### What does it measure?

GNSS-R allows the extraction of geophysical properties from the reflecting surface:

- **Oceans:** Surface wind speed and mean roughness (Mean Square Slope).

- **Land:** Soil Moisture and vegetation biomass.

- **Cryosphere:** Sea ice extent and thickness.


#### Physical Operation and Formulas

The receiver measures the power of the reflected signal as a function of time delay (delay) and Doppler shift, generating a _Delay Doppler Map_ (DDM). The received power $P_r$ is described by the bistatic radar equation <sup>6</sup>:

$$ P_r(\tau, f_D) = \frac{P_t G_t \lambda^2}{(4\pi)^3} \iint_A \frac{G_r(\vec{r}) \sigma^0(\vec{r}) \chi^2(\tau, f_D)}{R_t^2(\vec{r}) R_r^2(\vec{r})} d\vec{r} $$

Where:

- $\sigma^0$ is the bistatic scattering coefficient of the surface.

- $\chi^2$ is the ambiguity function (Woodward Ambiguity Function) that describes the system's response.

- $R_t$ and $R_r$ are the distances from the transmitter and receiver to the specular reflection point.

On calm (specular) surfaces, the energy is concentrated at one point in the DDM. On rough surfaces (ocean agitated by wind), the energy disperses to form a "horseshoe" in the DDM map; the amplitude of this dispersion is directly correlated with wind speed.

> 🎮 **Interactive Simulation.** Do you want to see how Delay Doppler Maps change with varying wind, altitude, and incidence angle? Try the [GNSS-R DDM simulation](Assets/simulations/ddm/index.html) based on the model described here.

<iframe
  src="../../../Assets/simulations/ddm/index.html"
  title="GNSS-R Delay Doppler Map Simulation"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

The graph shows the power distribution of the reflected signal in delay-Doppler space. In rough sea conditions (wind ~10-15 m/s), energy disperses from the specular position (delay=0, Doppler=0) forming the characteristic "horseshoe shape" in a 2D graph. In this case, we have
- **X-axis** (Doppler): Frequency shift due to relative satellite-surface motion
- **Y-axis** (Delay): Time delay relative to the direct specular path
- **Z-axis** (Power): Intensity of the reflected signal

Multiple peaks along the Doppler axis indicate that surface roughness (waves) generates scattering from a wide glistening zone, with contributions from points at different relative velocities. The rougher the sea, the more the DDM "opens" laterally and the central peak attenuates.

##### Some notes on the surface integral

In GNSS-R, the signal does not reflect from a single point (as in a monostatic radar with a point target), but scatters over a wide elliptical area on the sea surface, known as the Fresnel zone or illuminated scattering area.

Each small surface element within this area contributes to the total power received by the satellite.

To find the total power ($P_r$) that reaches the receiver, we must sum (integrate) the power contributions of all these small surface elements.

The scattering surface ($A$) is defined by two orthogonal coordinates (which can be spatial or signal-related) lying on the scattering plane.

The differential element $\mathrm{d} \vec{r}$ in this context represents $\mathrm{d} S$ or $\mathrm{d} A$ (differential surface element).

#### Utility and applications

The "killer" application of GNSS-R is tropical cyclone monitoring<sup>7</sup>. Unlike optical radiometers (blocked by clouds) or Ku-band scatterometers (attenuated by heavy rain), L-band GNSS signals penetrate intense precipitation<sup>8</sup>, allowing wind speed to be measured in the eye of the cyclone.

In terrestrial environments, the technique provides high-temporal-resolution soil moisture maps, essential for flood forecasting and agriculture.

#### Missions
Of course, among the missions, I must mention the one from which I took most of this information, namely NASA's CYGNSS, but it is not the only one.

- **CYGNSS (NASA):** A constellation of 8 microsatellites launched to study hurricane intensification, which has also demonstrated surprising capabilities in monitoring tropical wetlands.

- **FSSCat (ESA):** A mission based on two 6U CubeSats that combined GNSS-R with an optical hyperspectral sensor, winner of the Copernicus Masters. The mission lasted about a year.<sup>9</sup>

- **Spire Global:** Offers commercial reflectometry products for maritime and sea ice monitoring, but not only.<sup>6</sup>

***

## Synthetic Aperture Radar: SAR

### Synthetic Aperture Radar (SAR): all-weather microwave imaging

SAR represents the primary tool for observing the solid surface in all weather and lighting conditions, thanks to its active nature and microwave wavelength.

#### What does it measure?

Synthetic aperture radars actively send electromagnetic waves (microwaves) towards the Earth's surface and measure the backscattered echo, recording its intensity and phase upon return. Unlike optical sensors, a SAR illuminates the scene with its own pulses (typically in centimetric bands: L, C, X, etc.) and captures microwaves reflected from objects on the ground. This provides images where the "brightness" of each pixel is related to the radar backscatter coefficient, which depends on the roughness, structure, and water content of the target. For example, smooth surfaces (calm waters) reflect little energy back to the radar, appearing dark, while rough areas or areas with edges (such as buildings, fractured rocks, dense vegetation) appear bright.

By also measuring the phase of the backscattered microwave, SAR systems can detect distance differences in the millimeter range with extreme sensitivity, paving the way for interferometry (InSAR, see next section). SAR radars operate in various polarizations (HH, VV, HV, VH), measuring different components of the electromagnetic field vector, which adds information about target geometry and the presence of vegetation.

SAR returns complex images (in the mathematical sense of the term) where each pixel contains:

- **Amplitude:** Correlated with surface roughness, dielectric constant (moisture), and local geometry.

- **Phase:** Correlated with the geometric sensor-target distance, fundamental for interferometric applications.

#### Physical operation and formulas

To achieve high spatial resolution in the azimuthal direction (along-track) without employing kilometer-long antennas, SAR exploits the satellite's motion to synthesize a virtual aperture<sup>10</sup>.

By coherently processing the phase history of the return echoes (**Doppler effect**), the theoretical azimuthal resolution $\delta_a$ becomes independent of distance and is equal to half the length of the real antenna $L_a$<sup>11</sup>:

$$\delta_a = \frac{L_a}{2}$$

The range resolution (perpendicular to the track) is determined by the bandwidth $B$ of the transmitted pulse (often a frequency-modulated _chirp_, where a _chirp_ is a signal whose frequency varies over time):

$$\delta_r = \frac{c}{2B \sin(\theta)}$$

Where $\theta$ is the incidence angle. The phase equation $\phi$ for a pixel at distance $R$ is given by:

$$\phi = -\frac{4\pi R}{\lambda} + \phi_{scatt}$$

The fraction $4\pi R / \lambda$ indicates that the phase completes a full cycle every time the distance changes by half a wavelength ($\lambda/2$).


#### Utility and Applications

The main advantage of SAR is its ability to observe the Earth **under all illumination** and **weather conditions**: being active, it does not depend on the Sun nor is it hindered by clouds (microwaves penetrate cloud cover). This makes SAR ideal for monitoring regions frequently covered by clouds (tropical areas) or for surveying polar areas during the long winter night.

SAR images are used in mapping wet and flooded soils (the signal penetrates vegetation somewhat and reflects strongly from water-saturated ground, very useful in case of floods), in agriculture (estimation of soil moisture and crop phenological stage: signal scattering varies with foliage structure), in maritime surveillance (detection of ships and oil spills: oil calms the sea and appears dark on SAR, facilitating the identification of spills).

In geology and land management, SAR maps ground deformations and landslides using InSAR (see below), while in forestry, SAR polarimetry helps estimate forest biomass (P-band missions like BIOMASS). Furthermore, SAR allows the detection of sudden changes: thanks to frequent passes, it identifies illegal deforestation, glacier movement, new buildings, or disaster damage by comparing before/after images (change detection). In military and intelligence contexts, radar observation is crucial because it provides day/night and all-weather images, revealing camouflaged installations and movements.

In conclusion, the versatility of SAR systems is immense<sup>12</sup>:

- **Maritime Monitoring:** Detection of ships, _oil spills_ (which appear dark due to capillary wave suppression), and sea ice classification.

- **Agriculture:** Monitoring crop growth (sensitivity to biomass and structure) and soil moisture.

- **Emergency Management:** Rapid mapping of floods (calm water appears black due to specular reflection away from the sensor).


#### Missions

The main missions are:

- **Sentinel-1 (ESA/Copernicus):** The reference C-band mission, providing global data with an open access policy, crucial for operational interferometry.<sup>12</sup>

- **COSMO-SkyMed (ASI/Italy) & TerraSAR-X (DLR/Germany):** Very high-resolution X-band systems for dual civil/military uses.

- **NISAR (NASA/ISRO):** Future L- and S-band mission, focused on biomass and global crustal deformation.

***


### SAR Interferometry (InSAR): geodesy from space

InSAR is a technique derived from SAR that exploits the phase difference between two acquisitions to measure topography or millimeter-scale surface deformations.


#### What it measures

SAR Interferometry exploits the phase of the radar signal recorded by two SAR images acquired from slightly different orbits (Spatial Interferometry) or at different times (Temporal Differential Interferometry) to measure minimal distance differences and thus variations in elevation or displacement of the Earth's surface.

In practice, by combining two SAR images of the same area, the phase difference between pixels generates interference fringes proportional to the difference in the radar wave's optical path.

In the case of topographic InSAR (e.g., SRTM or TanDEM-X missions), two antennas (or satellites in formation) simultaneously observe the surface: the differential phase depends on the ground altitude and allows the derivation of high-resolution digital elevation models (DEMs).

In differential InSAR (DInSAR), two successive passes are used with a time interval $\Delta t$: if the surface has deformed in the meantime (subsidence or uplift) by a few millimeters or centimeters, this difference appears as a phase variation between the two images.

Si generano così **false-color interferograms** with concentric fringes, each typically corresponding to a line-of-sight displacement of half a wavelength ($≈2.8$ cm for Sentinel-1 in C-band).

By measuring the number and spacing of the fringes, the 2D deformation field of the surface projected onto the radar's line of sight is obtained. InSAR is therefore able to measure microscopic ground movements (mm order) over large areas, detecting slow and progressive phenomena invisible to the naked eye. Even sudden co-seismic displacements (earthquakes) or rapid volcanic deformations generate characteristic interferometric patterns (circular fringes around the epicenter or crater).

#### Physical operation and formulas

The interferometric phase difference $\Delta \phi$ between two images is composed of several contributions:

$$ \Delta \phi = \Delta \phi_{geom} + \Delta \phi_{topo} + \Delta \phi_{def} + \Delta \phi_{atm} + \Delta \phi_{noise} $$

- $\Delta \phi_{def}$ is the phase due to ground displacement.

- $\Delta \phi_{topo}$ is related to residual topography.

- $\Delta \phi_{atm}$ is the atmospheric delay (often the main error term).

The relationship between deformation $d$ and the "unwrapped" phase is <sup>13</sup>:

$$d = \frac{\lambda}{4\pi} \Delta \phi\_{unwrapped}$$

For a C-band satellite like Sentinel-1 ($\lambda \approx 5.6$ cm), an interference fringe ($2\pi$) corresponds to a displacement of approximately 2.8 cm.<sup>14</sup>

<img src="../../../Assets/phase_diff.png" alt="Frange interferometriche e deformazione misurata" title="Esempio di interferogramma: le frange di fase colorate rappresentano spostamenti millimetrici della superficie rispetto alla linea di vista del radar.">
_Figure 01: Interferometric fringes and measured deformation: example of an interferogram. The colored phase fringes represent millimeter-scale displacements of the surface relative to the radar's line of sight_


#### Applications
The main ones are:
- **Tectonics and Volcanology:** Measurement of post-seismic deformation fields and the "breathing" of volcanoes (inflation/deflation of magma chambers).<sup>15</sup>

- **Urban Subsidence:** Monitoring the stability of critical buildings and infrastructure with advanced techniques such as Persistent Scatterers (PS-InSAR).<sup>12</sup>

<figure>
  <video controls src="https://sentiwiki.copernicus.eu/__attachments/1680568/1302_001_AR_EN%20(1).mp4?inst-v=edeeb585-a079-43c5-850b-337320319499" style="max-width: 100%; height: auto;"></video>
  <figcaption>Video 01: Monitoring of Venice (Italy) with Sentinel-1, which allows continuous monitoring of ground movements with an accuracy of a few millimeters per year.<sup>16</sup></figcaption>
</figure>


***


### Radar altimetry: ocean and ice topography

Radar altimeters precisely measure the vertical distance between the satellite and the underlying surface, calculated from the round-trip time of radar pulses sent perpendicularly to the ground (nadir).

Nadir radar altimetry is the fundamental technique for quantifying sea level rise and ocean circulation.


#### What does it measure?

As I mentioned before, it measures the vertical distance (range) between the satellite and the surface at nadir. By combining this measurement with the precise orbit and geophysical corrections, the following are obtained:

- **Sea Surface Height (SSH).**

- **Significant Wave Height (SWH).**

- **Wind speed** (from backscatter intensity).

The objective is to measure the height of the surface (ocean, land, ice) relative to a reference ellipsoid. In oceanography, this measurement, subtracted from the satellite's orbit known in a geodetic system, provides the Sea Surface Height (SSH) relative to the geoid. Over the open ocean, SSH variations of a few centimeters reflect ocean currents, tides, and the mean sea level rise.

Altimeters also measure secondary parameters: by analyzing the shape and power of the radar echo (the waveform), the surface roughness, and thus the significant wave height and wind speed over the sea, are derived.

Over continental surfaces, the altimeter can measure the height of lakes and large rivers, as well as the average terrain topography (although with spatial resolution limited by the large radar footprint, typically a few km).

Over ice sheets, specialized radar altimeters (e.g., CryoSat-2) measure snow/ice elevation and detect temporal variations in ice thickness. In new "synthetic aperture" altimeters (SAR altimetry), the use of Doppler processing improves along-track spatial resolution (∼300 m), allowing more accurate measurements near coasts and over smaller water bodies.


#### Physical operation and formulas

L'altimetro emette un impulso radar e registra l'eco di ritorno.

La forma d'onda dell'eco (waveform) è modellata analiticamente dal Modello di Brown, che descrive la convoluzione tra la risposta del sistema, la densità di probabilità delle altezze delle onde e la risposta impulsiva della superficie piatta.<sup>17</sup>

La tecnica SAR Altimetry (o Delay-Doppler), introdotta da CryoSat-2 e Sentinel-3, migliora la risoluzione lungo traccia (\~300m) focalizzando l'energia in celle Doppler, permettendo di misurare con precisione anche tra i ghiacci marini e nelle acque costiere.<sup>18</sup>

#### Missioni

- **Sentinel-3 (SRAL):** Altimetro SAR operativo per oceano e ghiacci.

- **Jason-3 / Sentinel-6 Michael Freilich:** La serie di riferimento per la continuità climatica del livello medio del mare (GMSL).

- **SWOT (Surface Water and Ocean Topography):** Interferometria radar ad ampio swath (Ka-band) per estendere l'altimetria dal profilo 1D alla mappa 2D.

***

## Sensori passivi e ottici
Ora cambiamo radicalmente argomento, parliamo di sensori passivi, quelli più simili alle classiche macchinette fotografiche o alle fotocamere dei nostri smartphone.

I sensori ottici passivi a bordo dei satelliti catturano la radiazione elettromagnetica solare riflessa dalla superficie terrestre (nelle bande del visibile, infrarosso vicino e infrarosso a onde corte) e, in alcuni casi, l’emissione termica nell’infrarosso termico.

Essi forniscono dunque misure di radianza riflessa o riflettanza della superficie per ciascuna banda spettrale. Nel caso di bande termiche (tipicamente presenti su satelliti come Landsat o Sentinel-3), misurano la radianza termica emessa legata alla temperatura superficiale.

### Immagini pancromatiche: risoluzione geometrica estrema

Le immagini ottiche sono intuitive e ricche di informazioni, trovando impiego in mappatura ambientale, gestione del territorio, agricoltura e monitoraggio forestale, pianificazione urbana e sorveglianza di emergenze.

#### Cosa misura

In modalità pancromatica viene registrata l’intensità integrata su un ampio intervallo spettrale (ad es. 0,5–0,8 μm, come WorldView-3), producendo immagini in bianco e nero ad alta risoluzione spaziale.

In pratica, viene registrata la **radianza integrata** su un'unica banda spettrale molto ampia (tipicamente visibile + vicino infrarosso, 0.4 - 0.9 $\mu m$ Landsat 7).

> Landsat 8 ha un range ristretto 0.50-0.68 $\mu m$ per evitare lo scattering atmosferico.

#### Funzionamento fisico

L'ampia larghezza di banda permette di raccogliere un elevato numero di fotoni, garantendo un alto Rapporto Segnale-Rumore (SNR). Questo consente di ridurre la dimensione del pixel (IFOV) mantenendo tempi di integrazione brevi, necessari per evitare il _motion blur_ orbitale. La risoluzione spaziale può scendere sotto i 30 cm nelle piattaforme commerciali moderne, come Superview Neo-1.<sup>19</sup>

#### Applicazioni e pansharpening

La banda pancromatica è spesso usata in sinergia con bande multispettrali a bassa risoluzione tramite tecniche di _Pansharpening_. L'immagine risultante combina l'alta fedeltà geometrica del pancromatico con l'informazione cromatica del multispettrale. Una relazione semplificata per la fusione è <sup>20</sup>:

$$I_{Pan} \approx \sum_i \alpha_i \cdot I_{MS, i}$$

Questa è la condizione fisica di partenza ed esprime il fatto che l'energia registrata dal sensore pancromatico (a banda larga) dovrebbe idealmente corrispondere alla somma pesata delle energie registrate dalle bande multispettrali (a banda stretta) che ricadono nel suo intervallo spettrale.

I coefficienti $\alpha_i$ rappresentano i pesi spettrali. Poiché il sensore pancromatico non ha una sensibilità piatta (cioè non "vede" tutti i colori con la stessa efficienza), ogni banda multispettrale contribuisce al segnale Pan in modo diverso. Ad esempio, se il sensore Pan è molto sensibile al rosso e poco al blu, il peso $\alpha_i$ del canale rosso sarà maggiore.

Di seguito un [esempio di applicazione](https://www.satimagingcorp.com/satellite-sensors/superview-neo-satellite-constellation/) del pansharpening.<sup>21</sup>

<img src="../../../Assets/Doha.jpg" alt="Immagine pancromatica satellitare della skyline di Doha" title="Esempio di immagine pancromatica ad altissima risoluzione di Doha">
Figura 02: _Skyline di Doha ripreso da una scena pancromatica sub-metrica: la risoluzione geometrica estrema consente di distinguere singoli edifici e infrastrutture urbane._

#### Missioni

- **Maxar (WorldView Legion), Airbus (Pléiades Neo) e Superview Neo-1:** Risoluzioni commerciali leader di mercato (fino a 30 cm).

- **Landsat 8/9:** Banda pancromatica a 15m per affinare le bande spettrali a 30m.<sup>22</sup>

***

### Imaging multispettrale: il colore della terra

Optical images are used to identify soil types and land use (crops, forests, urban areas), to monitor water bodies, glaciers and snow, and to document events such as fires, floods or landslides.

The standard for global environmental monitoring, which acquires images in a discrete number of spectral bands (approximately 4 to 15).

Multispectral images allow, for example, to distinguish healthy vegetation from diseased vegetation through indices such as NDVI (Normalized Difference Vegetation Index). NDVI is calculated from reflectances in the near-infrared (NIR) and red (R):
$$NDVI = \frac{NIR - R}{NIR + R},$$
and is widely used to quantify the density and vigor of vegetation cover.

#### What it measures

In multispectral mode, the sensor has several separate (typically 3–10) narrower channels (e.g., blue, green, red, near-infrared bands, etc.), providing information on the color and composition of the surface.

Surface reflectance in discrete bands in the Visible (VIS), Near-Infrared (NIR), and Shortwave Infrared (SWIR).

#### Physics and spectral indices

It exploits the distinctive spectral signatures of materials. For example, chlorophyll absorbs in the red and strongly reflects in the NIR.

The use of SWIR bands is fundamental for discriminating snow from clouds and for monitoring vegetation water stress.

<img src="../../../Assets/PanvsMulti.png" alt="Comparison between panchromatic and multispectral image of the same urban neighborhood" title="Differences between panchromatic band and multispectral composite">
_Figure 03: Visual comparison between a high-resolution panchromatic band and its multispectral composite: the panchromatic captures geometric detail, while the multispectral preserves chromatic variation useful for indices like NDVI and SWIR to discriminate materials._

#### Applications and missions

- **Sentinel-2 (ESA):** With 13 bands and [resolution](https://sentiwiki.copernicus.eu/web/s2-products)<sup>23</sup> 10-20m or 60m, it is the reference for precision agriculture and land cover monitoring.<sup>12</sup>

- **Landsat 8/9 (NASA/USGS):** Ensures continuity of observations since 1972, essential for long-term change studies. The resolution, depending on the chosen band, ranges from 30m to 100m.

***

### Hyperspectral imaging

Hyperspectral imaging (HSI) extends the multispectral concept by acquiring hundreds of contiguous bands, allowing for detailed chemical-physical analysis of each pixel.

Indeed, HSI's narrow and contiguous bands allow for the detection of absorption features (narrow peaks and valleys in the spectral curve). These features are unique to specific chemical bonds (e.g., O-H bonds in clay minerals, or specific pigments in vegetation), allowing for the identification of which material is present, not just distinguishing its color. I would define it as a kind of remote spectroscopy.

#### What it measures
Hyperspectral sensors go beyond multispectral ones, acquiring tens or hundreds of very narrow (on the order of 10 nm) contiguous bands, covering the visible/SWIR spectral continuum in detail: each pixel contains a kind of continuous "spectral signature" of the observed object. This allows for the measurement of subtle reflectance differences related to the chemical and physical composition of materials (vegetation, minerals, water).

What is studied is nothing more than a data "hypercube" $(x, y, \lambda)$ with hundreds of narrow spectral channels (e.g., $5-10 nm$), covering the VNIR-SWIR range ($400-2500 nm$).

#### Physical operation and spectral mixing

Each pixel contains a continuous spectrum that acts as a chemical "fingerprint." The measured signal $y$ is often modeled as a [linear mixture](https://ieeexplore.ieee.org/document/974727)<sup>24</sup> of the pure spectra of the constituent materials (_endmembers_) $M$ present in the pixel, according to the _Linear Mixing_ (or _Mixture_) _Model_ (**LMM**) <sup>25</sup>:

$$y = \sum_{k=1}^{K} a_k m_k + n$$

Where $a_k$ are the fractional abundances. This allows for the identification of sub-pixel materials or specific minerals.
> In mineralogy, an "endmember" is a 100% pure mineral (e.g., pure quartz) which, when mixed with others, forms the rock observed in the pixel.

#### Utility and applications

- **Mineral Geology:** Identification of hydrothermal alterations and rare earth elements.

- **Water Quality:** Distinction between different algal species and sediments.<sup>26</sup>

<figure>
  <img src="../../../Assets/Sea.png" alt="Ocean colors determined by constituents in water" title="Ocean colors determined by constituents in water">
  <figcaption>
    The color of the ocean is a function of the light that is absorbed or scattered in the presence of dissolved or suspended constituents in the water. <sup>26</sup>
  </figcaption>
</figure>

- **Smart CubeSats:** The **FSSCat/$\Phi$-Sat-1** mission demonstrated the use of on-board AI to process hyperspectral data (HyperScout-2) and discard cloudy images directly in orbit, optimizing downlink.<sup>27</sup>


#### Missions

- **EnMAP (DLR) & PRISMA (ASI):** Operational German and Italian scientific missions, respectively.<sup>28</sup>

- **PACE (NASA):** Launched in 2024, with the OCI (Ocean Color Instrument) extending hyperspectral capabilities to global oceans.<sup>26</sup>

> 🎮 **Spectral simulation.** Visually compare panchromatic, multispectral, and hyperspectral modes and observe how spatial resolution, sampled spectrum, and thematic information change. You can open it full screen from the [dedicated page](Assets/simulations/spectral/index.html).

<iframe
  src="../../../Assets/simulations/spectral/index.html"
  title="Spectral Sensor Simulation"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

> The widget shows (left) the signal sampling with different bands and (right) the visual rendering on the ground: panchromatic aims for maximum spatial resolution, multispectral introduces color but loses detail, while hyperspectral decreases resolution to recover chemical-physical information (vegetative stress, materials, etc.).

***


### Thermal Infrared (TIR): measuring the planet's heat

TIR sensors measure the energy emitted by the Earth, allowing for the estimation and study of surface temperature.


#### What it measures
Based on the subject to be measured, there are:

- **Land Surface Temperature (LST).**

- **Sea Surface Temperature (SST).**

- **Thermal Anomalies:** Wildfires and volcanic activity.


#### Physical operation and formulas

Before explaining the physical operation and especially the formulas, I think it's important to understand why inversion is crucial. For this, we need to distinguish two regimes:

  - In the visible spectrum (e.g., Sentinel-2 RGB bands), the sensor measures reflected sunlight. Here, the object's temperature has almost nothing to do with the amount of light reaching the sensor.

  - In Thermal Infrared (TIR), the energy source is not the Sun, but the object itself. Every body with a temperature above absolute zero emits electromagnetic radiation due to thermal agitation.
  
  > Therefore: In TIR, measuring energy (Radiance) is equivalent to measuring the thermal state of the object.

Physics tells us (Planck's Law) that there is a rigid relationship between the Temperature $T$ of a black body and the Radiance $L_\lambda$ it emits at a specific wavelength $\lambda$.

The measured radiance $L_{\lambda}$ is converted into brightness temperature $T_b$ by inverting Planck's law (at least I'll spare you that one). In practice, if the object is at temperature $T$, it will emit $L_\lambda$ amount of energy.

However, the sensor works in reverse. The detector is an infrared-sensitive photodiode (which I admit sounds very cacophonous in Italian), often made of Mercury-Cadmium-Telluride, cryogenically cooled, and struck by photons. Photons generate electrons and thus electric current, which is converted into a digital number (DN).

Through radiometric calibration (Gain & Offset), the DN is converted back into Radiance at the Sensor ($L_{Sensor}$).

Since the sensor "doesn't know" what the temperature is, we must ask ourselves mathematically:
"What temperature $T$ must a theoretical black body have to produce the radiance $L$ that I have just measured?"

This is why inversion is performed. Planck's equation is solved for $T$:

$$T_b = \frac{h c}{k_B \lambda \ln\left( \frac{2 h c^2}{\lambda^5 L_\lambda} + 1 \right)}$$

To obtain the actual kinetic temperature ($T_{surf}$), it is necessary to correct for the surface emissivity $\epsilon$ and for the atmospheric contribution (water vapor absorption/emission). _Split-Window_ algorithms use two nearby thermal channels (e.g., 11 $\mu m$ and 12 $\mu m$) to estimate and remove the atmospheric effect.

#### Why is it called "Brightness Temperature" and not "Real Temperature"?
This is the most subtle and important part. The inversion assumes that the object is a Black Body (Emissivity $\varepsilon = 1$), i.e., a perfect emitter. However, in reality:

- Water has an emissivity that oscillates between 0.98 and 0.99 (almost a black body).
- Bare soil or sand can have an emissivity between 0.90 and 0.95.

If a sensor points at a hot rock at 300K (27 °C), but with low emissivity, the rock will emit less energy than predicted by the pure Planck's law. If we invert the formula without correction, the satellite will calculate a temperature lower than the actual one (e.g., 295K instead of 300K).

That "fictitious" (lower) temperature is the **brightness temperature**. It is the temperature the object would have if it were a perfect black body emitting that amount of light.

### Missions
Among the missions that I think are definitely worth mentioning are:

- **Sentinel-3 (SLSTR):** High precision (<0.3 K) for climatic SST, using a dual view (nadir and oblique) to correct for the atmosphere.

- **Landsat 8/9 (TIRS):** Two thermal bands at 100m resolution.

- **ECOSTRESS (ISS):** Monitoring evapotranspiration and vegetation water stress.

***

> 🎮 **Interactive TIR Simulation.** Follow the complete pipeline (photons → DN → radiance → Planck inversion) and observe how emissivity and atmosphere shift the brightness temperature relative to the real temperature.

<iframe
  src="../../../Assets/simulations/tir/index.html"
  title="Simulazione TIR: radianza e temperatura"
  loading="lazy"
  style="width: 100%; min-height: 960px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>


## Passive Microwave Radiometry (surface imaging)

Every material emits thermal radiation based on its physical temperature and emissivity: radiometers record the brightness temperature $T_B$ in specific microwave spectral bands, which is proportional (by Rayleigh-Jeans approximation) to the object's thermal emission.

### What it measures

Microwave radiometers are passive sensors that measure the **natural electromagnetic brightness** emitted by the Earth at millimeter-centimeter wavelengths (typically 0.3–30 GHz).

Atmosphere, soil, vegetation, oceans, and ice have different emissivities at microwave frequencies, so geophysical parameters are inferred from the measurement of $T_B$ at different frequencies and polarizations.

For example, liquid water has low emissivity in the microwave band, so the cold ocean appears “dark” (low $T_B$) compared to land; the contrast between H and V polarizations over soil varies with humidity (wet soil = higher emissivity and smaller difference). Multispectral microwave radiometers typically measure at frequencies such as 6.9 GHz, 10 GHz, 18 GHz, 23 GHz, 36 GHz, 89 GHz (some up to 166 GHz), often with two polarizations (H and V) for each.

Low frequencies ($L-$band ~1.4 GHz) penetrate deeper into the soil, useful for humidity; high frequencies ($K/Ka-$band) are more sensitive to vapor and rain. In bands around atmospheric absorption lines (e.g., 22 GHz water vapor, 60 GHz oxygen), temperature and gas content for atmospheric layers can be deduced (microwave sounding).

<figure>
  <img src="../../../Assets/Passive.png" alt="Passive microwave radiometry diagram" title="Passive microwave radiometry diagram">
  <figcaption>
    Passive microwave band sensor: measures natural emission, modulated by emissivity, temperature, and atmosphere.
  </figcaption>
</figure>

### Physical operation and synthetic interferometry

In microwaves, the Rayleigh-Jeans approximation ($h\nu \ll k_B T$) holds, so radiance is proportional to physical temperature:

$$T_b \approx \epsilon \cdot T_{phys}$$

The **SMOS** (ESA) mission introduced a revolutionary technology: the interferometric synthetic aperture radiometer (MIRAS). Instead of a large rotating parabolic antenna (as in SMAP), it uses a static array of 69 Y-shaped LICEF (Lightweight Cost-Effective Front-end) receivers. The brightness temperature image is mathematically reconstructed from the inverse Fourier transform of the visibility functions measured between pairs of antennas.<sup>29</sup>

### Missions

- **SMOS (ESA):** Pioneer of interferometric L-band.

- **SMAP (NASA):** Radiometer with large rotating antenna (6m) for high-precision soil moisture.

- **AMSR-2 (JAXA):** Multifrequency "workhorse" radiometer for precipitable water, ice, and SST.

***

## Satellite Gravimetry: Weighing Water from Space

Satellite gravimetry has two major applications:
1) the creation of a precise global model of the geoid and the static gravitational field;

2) the monitoring of mass variations redistributed across the planet (water, ice).

The geoid is fundamental for geodesy: it defines the altimetric reference surface “at sea level” to which heights measured by satellites and on the ground are referred. Missions like GOCE (ESA, 2009-2013) have provided a high-resolution geoid (up to 100 km) with 1–2 cm precision, improving vertical references between continents. This impacts [ocean altimetric maps](https://geodesy.science/item/satellite-altimetry/)<sup>30</sup>: by subtracting the geoid from the sea surface measured by altimeters, stationary ocean currents (dynamic topography) emerge.

Anche in geodesia pura, conoscere l’anomalia di gravità sulla crosta informa sulla struttura geologica e la densità (utili in esplorazione mineraria e petrolifera).

Riguardo il punto 2, i satelliti gravimetrici time-variable (GRACE e successore GRACE-FO) hanno aperto un nuovo campo nel monitorare il [ciclo idrologico globale](https://gracefo.jpl.nasa.gov/resources/72/tracking-water-from-space/)<sup>31</sup> e la criosfera su base mensile. In oceanografia, le misure GRACE di pressione sul fondo oceanico completano gli altimetri isolando la componente di massa negli aumenti di livello (distinguendola dall’espansione termica). Queste osservazioni di “bilancio idrico” sono cruciali per capire gli impatti climatici e per gestione risorse idriche. Inoltre, la gravimetria è servita a evidenziare variazioni di massa nel mantello post-terremoti (es. il sisma di Tōhoku 2011 ha provocato una minuscola ma rilevabile variazione locale del campo di gravità).

### What it Measures

Satellite gravimetry missions measure the tiny variations of the Earth's gravitational field in space and time. In practical terms, they observe how gravitational acceleration $g$ (or gravitational potential) changes from place to place and from one epoch to another, due to the distribution of mass within and on the Earth's surface. An orbiting satellite is affected by this: where local gravity is slightly stronger (e.g., above a submarine mountain range or an area of higher mantle density), the satellite accelerates a little more; where it is weaker (e.g., above an oceanic depression or a less dense mantle) it accelerates less.

Gravimetric missions measure these differences through precision tracking: for example, the [renowned GRACE mission](https://sealevel.nasa.gov/missions/grace#:~:text=GRACE%20measured%20gravity%20by%20relating,or%20between%2C%20the%20satellite%20pair) consisted of two twin satellites following the same orbit 220 km apart and measuring the variation in their mutual distance with microscopic precision. When the first satellite passes over a gravitational anomaly, it accelerates (increasing the distance from the second); then the second also accelerates and the distance returns to nominal: the gravity anomaly is deduced from the magnitude and phase of this variation.

> GRACE therefore measures gravity anomalies and, by repeating month after month, can detect temporal variations in the gravitational field

Another technique is the **gradiometer gravimeter** (used by GOCE): accelerometric sensors directly measure the field gradient along different directions. In short, missions measure parameters such as: linear combinations of the second derivatives of the gravitational potential (gradiometry), inter-satellite distance (GRACE), or orbital perturbations (from which spherical harmonics of the gravity field are inverted). The final results are geoid models (mean equipotential surface) and maps of static and time-varying gravitational anomalies (in mGal), or time series of variable equivalent masses (such as water thickness).

<img src="../../../Assets/geoid.jpg" alt="Earth geoid model derived from GOCE and GRACE missions" title="The Earth's geoid, mean equipotential surface obtained from gravimetry missions like GOCE and GRACE">
_Figure 05: The Earth's geoid (combining GOCE/GRACE data) visualizes the spatial distribution of gravitational anomalies that these satellites measure and monitor over time_

### Physical Operation: Satellite-to-Satellite Tracking (SST)

Two identical satellites (as in GRACE and GRACE-FO) fly in the same orbit separated by approximately 220 km. A microwave ranging system ($K$-band) or a laser interferometer (in GRACE-FO) measures the variation in inter-satellite distance with micrometric precision.<sup>32</sup>

When the leading satellite flies over an excessive mass (e.g., a mountain), it is gravitationally accelerated, moving away from the second. By analyzing the variations in relative velocity (Range-Rate $\dot{\rho}$), the global gravitational potential is reconstructed.

### Missions and Applications
The main missions I am aware of involve the two Atlantic giants in the space sector, NASA and ESA

- **GRACE / GRACE-FO (NASA/GFZ):** They quantified for the first time unequivocally the mass loss of polar ice sheets and excessive groundwater depletion in India and California.<sup>33</sup>

- **GOCE (ESA):** It used a gradiometer (ultrasensitive accelerometer) to define the static geoid with unprecedented spatial resolution and precision.

***

## Satellite Magnetometry

I satelliti magnetometrici misurano l’intensità e la direzione del campo magnetico terrestre nello spazio circumterrestre. Il campo magnetico terrestre è generato principalmente dal nucleo esterno fluido (dinamo geodinamica), con contributi della crosta (dovuta alla magnetizzazione delle rocce) e correnti elettriche nello spazio e nell’alta atmosfera dovute all'interazione con il vento solare.

### What it measures

A satellite equipped with a vector magnetometer records at each point the three components of the magnetic field ($B_x, B_y, B_z$) measured in nanotesla, nT, and how these vary as it moves across the Earth.

Missions dedicate great care to **calibration**. Magnetic sensors (often fluxgate or Overhauser scalar type) are mounted on [extendable booms](https://link.springer.com/article/10.1007/s11214-025-01238-7)<sup>34</sup> to avoid interference from onboard instrumentation, and are accompanied by high-precision star trackers to determine orientation and thus derive field vectors in an Earth-fixed inertial reference frame:
- A **Vector Field Magnetometer (VFM)** (often Fluxgate) mounted on an extendable boom is used to measure the direction of field lines without the satellite's magnetic interference.
- An **Absolute Scalar Magnetometer (ASM)** (e.g., Overhauser or helium vapor) to measure absolute intensity with very high precision, used to calibrate the vector magnetometer.

By measuring the entire globe on repeated polar orbits, magnetic satellites produce global models of the geomagnetic field, subdivided into components: the main field (originating from the core, with a dominant dipole), the crustal field (local anomalies from magnetized rocks), and variable external fields (ionospheric and magnetospheric currents).

Furthermore, by measuring over time, the secular variation of the main field is tracked (magnetic pole drift, decadal intensity variations due to core motions).

<figure>
  <video controls src="https://dlmultimedia.esa.int/download/public/videos/2013/10/038/1310_038_BR_009.mp4"></video>
  <figcaption>ESA Video: measuring Earth's magnetic field from space.<sup>35</sup></figcaption>
</figure>

### What is it used for?
An accurate map of the geomagnetic field has many scientific and practical applications. Let's look at the main ones:

- **Core Geophysics**: The temporal variation of the field (secular variation) provides information on fluid motions in the Earth's core [at ~3000 km depth](https://phys.org/news/2016-05-strength-earth-magnetic-field.html#:~:text=The%20magnetic%20field%20is%20thought,the%20continuously%20changing%20electromagnetic%20field)<sup>36</sup>, improving the understanding of the terrestrial dynamo mechanism (terrestrial bicycle dinamo) and allowing for modeling of the field's evolution and possible reversals.
- **Crustal Magnetism**: Magnetic anomalies mapped by satellites (by filtering out the main field) reveal geological structures: for example, the aggregation of CHAMP and Swarm data has produced maps of the Baghdad anomaly, highlighting buried areas. This has been useful for mineral and tectonic research.
- **Space Weather and Ionospheric Currents**: Satellites like Swarm measure electric currents in the upper atmosphere (e.g., Birkeland currents and equatorial ring current) through characteristic magnetic perturbations (differences between tracks of different satellites and internal field models). This helps monitor geomagnetic storms and magnetosphere-ionosphere coupling.
- **Risks to Infrastructure**: From the measurement of rapid field changes (pulsations, coronal mass ejections), the induction of geomagnetically induced currents that can damage power grids is deduced.
- **Research in Archaeology and Paleomagnetism**: Although satellites measure the current field, comparisons with historical models and simulations help understand past variations imprinted in rocks and artifacts (archeomagnetism).
- **Migratory Fauna**: The Earth's magnetic field is used by migratory animals (birds, turtles) for orientation: field models updated by satellite data are used in ecological studies to understand migratory paths (e.g., maps of magnetic intensity and inclination explain certain routes).

### Missions

- [**Swarm (ESA):**](https://earth.esa.int/eogateway/missions/swarm) A constellation of 3 satellites that allows for the separation of temporal from spatial variations of the geomagnetic field.<sup>37</sup>

- **DSCOVR (NASA/NOAA):** Positioned at L1, it uses magnetometers to monitor the interplanetary magnetic field (IMF) carried by the solar wind, providing early warning for geomagnetic storms.<sup>38</sup>

***

## Signals of Opportunity and CubeSat Radar: The New Frontier

This category combines two emerging trends: the use of non-native signals for EO and the extreme miniaturization of active sensors.

### A. CubeSat Radar: RainCube

Until recently, radars were considered incompatible with CubeSats due to power and size requirements. The **RainCube** mission (NASA) demonstrated a Ka-band (35.7 GHz) weather radar on a 6U CubeSat.

- **Innovation:** Use of an ultralight deployable parabolic antenna and pulse compression techniques. In Ka-band, rain strongly attenuates the signal; RainCube exploits this very principle to profile storm structures.<sup>39</sup>

### B. Smart LNB: Rain from Satellite TVs

Projects like **NEFOCAST** transform domestic satellite TV receivers (Smart LNBs) into rain gauges. They measure the attenuation of the downlink signal (Ku/Ka band) caused by rain (_Rain Fade_).

- **Formula:** The specific attenuation $A$ (dB/km) is related to the precipitation rate $R$ (mm/h) by the power law $A = k R^\alpha$. A dense network of domestic "sensors" provides real-time rain maps with capillary resolution.<sup>40</sup>

***

### Synthetic Comparative Table of Technologies

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
| **Radiometry (Soil)**   | Passive (Microwave) | $T\_b$ (L/C/X Band)                    | SMOS, SMAP                     | Soil Moisture, Salinity       |
| **Atm. Sounding**       | Passive (Microwave) | T/Humidity Profiles (O$\_2$, H$\_2$O)  | AMSU/MHS, TROPICS              | Global Weather Input          |
| **Lidar Altimetry**     | Active (Laser)      | Elevation, Ice Thickness               | ICESat-2, GEDI                 | Ice Mass Balance              |
| **Wind Lidar**          | Active (Doppler)    | LOS Wind (Doppler Shift)               | Aeolus                         | Clear-Air Wind                |
| **Gravimetry**          | Active (SST)        | Gravity Anomalies (Mass)               | GRACE-FO, GOCE                 | Groundwater, Glaciers         |
| **Magnetometry**        | Passive (In-situ)   | Magnetic Field Vector                  | Swarm, DSCOVR                  | Geomagnetic Models            |
| **Lightning (GLM)**     | Passive (Optical)   | Lightning Events                       | GOES-R, MTG                    | Storm Nowcasting              |
| **AIS / ADS-B**         | Passive (RF)        | Ship/Aircraft Position                 | Spire, Aireon                  | Global Tracking               |
| **CubeSat Radar**       | Active (Ka-band)    | Rain Profile                           | RainCube                       | Technology Demonstrator       |
| **Smart LNB**           | Opportunistic       | Rain Attenuation                       | NEFOCAST                       | Distributed Rain Gauging      |

<!-- Infografica Page (NEW) -->
<div id="infografica" class="content-page hidden">
  <h3 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Infographic: Comparison Matrix</h1>
  <p class="text-lg text-gray-700 mb-6">This table summarizes the operational capabilities of all analyzed technologies. Use this legend to guide you:</p>

<div class="flex flex-wrap gap-4 mb-6 text-sm">
    <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">☀️ Passive (Requires Sun/Emission)</span>
    <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">📡 Active (Emits its own signal)</span>
    <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold border border-green-200">☁️ Sees through clouds</span>
  </div>




  <figure class="table-wrapper" data-enhanced-table>
    <div class="table-wrapper__scroll">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3">Technology</th>
            <th class="px-6 py-3">Type</th>
            <th class="px-6 py-3">Physical source</th>
            <th class="px-6 py-3 text-center">Weather / night</th>
            <th class="px-6 py-3">Main output</th>
          </tr>
        </thead>
        <tbody>
          <!-- 1. GNSS -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">1. GNSS</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Reception</span></td>
            <td class="px-6 py-4">Radio waves (L-band)</td>
            <td class="px-6 py-4 text-center text-xl" title="All-weather">☁️ 🌙</td>
            <td class="px-6 py-4">Position (XYZ), time (T)</td>
          </tr>
          <!-- 2. Optical -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">2. Optical</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passive</span></td>
            <td class="px-6 py-4">Visible light / IR</td>
            <td class="px-6 py-4 text-center text-xl" title="Day only, no clouds">☀️ ❌</td>
            <td class="px-6 py-4">Images (photos)</td>
          </tr>
          <!-- 3. SAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">3. SAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Active</span></td>
            <td class="px-6 py-4">Microwaves (radar)</td>
            <td class="px-6 py-4 text-center text-xl" title="All-weather, day and night">☁️ 🌙</td>
            <td class="px-6 py-4">Images (reflectivity)</td>
          </tr>
          <!-- 4. InSAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">4. InSAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Active</span></td>
            <td class="px-6 py-4">Radar phase</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">mm displacements / topography</td>
          </tr>
          <!-- 5. Altimetry -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">5. Altimetry</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Active</span></td>
            <td class="px-6 py-4">Radar pulse (nadir)</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Surface height (cm)</td>
          </tr>
          <!-- 6. Radiometers -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">6. MO Radiometers</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passive</span></td>
            <td class="px-6 py-4">Thermal emission</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Temperature, humidity</td>
          </tr>
          <!-- 7. Hyperspectral -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">7. Hyperspectral</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passive</span></td>
            <td class="px-6 py-4">Visible/IR spectrum</td>
            <td class="px-6 py-4 text-center text-xl">☀️ ❌</td>
            <td class="px-6 py-4">Chemical signature of materials</td>
          </tr>
          <!-- 8. LIDAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">8. LIDAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Active</span></td>
            <td class="px-6 py-4">Laser (light)</td>
            <td class="px-6 py-4 text-center text-xl" title="No clouds">❌ 🌙</td>
            <td class="px-6 py-4">3D profiles / heights</td>
          </tr>
          <!-- 9. Gravimetry -->
          <tr class="bg-white border-b hover:bg-gray-50">

<td class="px-6 py-4 font-bold text-gray-900">9. Gravimetry</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Physics</span></td>
            <td class="px-6 py-4">Gravitational field</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Mass/water map</td>
          </tr>
          <!-- 10. Magnetometry -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">10. Magnetometry</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Physics</span></td>
            <td class="px-6 py-4">Magnetic field</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Magnetic field map</td>
          </tr>
          <!-- 11. Radio-Occ -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">11. Radio-Occ.</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Passive (RX)</span></td>
            <td class="px-6 py-4">GNSS signal refraction</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Atmospheric profiles</td>
          </tr>
          <!-- 12. Meteo GEO -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">12. GEO Weather</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passive</span></td>
            <td class="px-6 py-4">Visible + thermal</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙 (thermal)</td>
            <td class="px-6 py-4">Full-disk video/img</td>
          </tr>
          <!-- 13. Space Wx -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">13. Space Wx</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Physics</span></td>
            <td class="px-6 py-4">Particles / X-rays</td>
            <td class="px-6 py-4 text-center text-xl">N/A (space)</td>
            <td class="px-6 py-4">Particle count</td>
          </tr>
          <!-- 14. AIS -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">14. AIS</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Reception</span></td>
            <td class="px-6 py-4">VHF Radio (ships)</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Ship ID and position</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
  <p class="mt-4 text-sm text-gray-500 text-right">* Note: ☁️ = Penetrates clouds | 🌙 = Works at night | ❌ = Blocked/Unavailable</p>
</div>

## Conclusion

The analysis of these categories reveals an increasingly interconnected and multi-physical Earth observation system. The dominant trend is data fusion (_Data Fusion_): the vertical precision of Lidar and Radar is extended horizontally by optical and radiometric constellations. Furthermore, the integration of traditional scientific sensors with commercial opportunity data (GNSS-R, Smart LNB, AIS) is creating a true "Digital Twin" of the planet, capable of quantifying not only the state of the natural environment but also anthropogenic impact in real-time.

#### Works cited

1. GNSS radio occultation (GNSS-RO): Lecture 1 – Principles and NWP use - ECMWF Events (Indico), <https://events.ecmwf.int/event/375/contributions/4253/attachments/2310/4039/gnssro_lecture_KL_2024.pdf>

2. Smith-Weintraub equation (atmospheric refractivity) - NIST JRES, <https://nvlpubs.nist.gov/nistpubs/jres/50/jresv50n1p39_A1b.pdf>

3. GNSS Radio Occultation | Constellation Observing System for Meteorology Ionosphere and Climate - ucar cosmic, <https://www.cosmic.ucar.edu/what-we-do/gnss-radio-occultation>

4. Using the Commercial GNSS RO Spire Data in the Neutral Atmosphere for Climate and Weather Prediction Studies - the NOAA Institutional Repository, <https://repository.library.noaa.gov/view/noaa/58772/noaa_58772_DS1.pdf>

5. Sensing the ionosphere with the Spire radio occultation constellation | Journal of Space Weather and Space Climate, <https://www.swsc-journal.org/articles/swsc/full_html/2021/01/swsc210051/swsc210051.html>

6. Reconnaissance satellite constellations: For enhanced global awareness - Spire, <https://spire.com/blog/space-reconnaissance/reconnaissance-satellite-constellations-for-enhanced-global-awareness/>

7. Improving Analysis and Prediction of Tropical Cyclones by Assimilating Radar and GNSS-R Wind Observations: Ensemble Data Assimilation and Observing System Simulation Experiments Using a Coupled Atmosphere–Ocean Model, <https://journals.ametsoc.org/view/journals/wefo/37/9/WAF-D-21-0202.1.xml>

8. NASA/University of Michigan - CYGNSS Handbook <https://cygnss.engin.umich.edu/wp-content/uploads/sites/534/2021/07/148-0138-ATBD-L2-Wind-Speed-Retrieval-R6_release.pdf>

9. FSSCat Overview - ESA Earth Online, <https://earth.esa.int/eogateway/missions/fsscat/description>

10. Synthetic-aperture radar - Wikipedia, <https://en.wikipedia.org/wiki/Synthetic-aperture_radar>

11. Synthetic Aperture Radar (SAR): Principles and Applications - eo4society, <https://eo4society.esa.int/wp-content/uploads/2021/02/D1T2a_LTC2015_Younis.pdf>

12. S1 Applications - SentiWiki - Copernicus, <https://sentiwiki.copernicus.eu/web/s1-applications>

13. InSAR Phase Unwrapping Error Correction for Rapid Repeat Measurements of Water Level Change in Wetlands - LaCoast.gov, <https://www.lacoast.gov/crms/crms_public_data/publications/Oliver-Cabrera%20et%20al%202021.pdf>

14. Sentinel-1 InSAR Product Guide - HyP3, <https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/>

15. Sentinel-1 InSAR Processing using S1TBX - Alaska Satellite Facility, <https://asf.alaska.edu/wp-content/uploads/2019/05/generate_insar_with_s1tbx_v5.4.pdf>

16. Sentinel-1 InSAR (Venice) video - SentiWiki, <https://sentiwiki.copernicus.eu/__attachments/1680568/1302_001_AR_EN%20(1).mp4?inst-v=edeeb585-a079-43c5-850b-337320319499>

17. Radar Altimetry Principle and Data Processing by M.-H. Rio, <https://ftp.itc.nl/pub/Dragon4_Lecturer_2018/D2_Tue/L1/D2L1-DRAGON_OTC18_Altimetry1_mhr.pdf>

18. Using Altimetry service data - EUMETSAT - User Portal, <https://user.eumetsat.int/data/satellites/sentinel-3/altimetry-service>

19. Panchromatic Images Explained | Satellite Bands, Specs & Uses - XrTech Group, <https://xrtechgroup.com/panchromatic-imaging-bands-uses/>

20. Image Fusion for High-Resolution Optical Satellites Based on Panchromatic Spectral Decomposition - PMC, <https://pmc.ncbi.nlm.nih.gov/articles/PMC6603526/>

21. SuperView Neo satellite constellation (pansharpening example) - Satellite Imaging Corp, <https://www.satimagingcorp.com/satellite-sensors/superview-neo-satellite-constellation/>

22. Panchromatic Imagery And Its Band Combinations In Use - EOS Data Analytics, <https://eos.com/make-an-analysis/panchromatic/>

23. Sentinel-2 products and resolutions - SentiWiki, <https://sentiwiki.copernicus.eu/web/s2-products>

24. Linear mixture model / spectral mixing - IEEE Xplore, <https://ieeexplore.ieee.org/document/974727>

25. Hyperspectral Imaging - arXiv, <https://arxiv.org/html/2508.08107v1>

26. Introduction to PACE Hyperspectral Observations for Water Quality Monitoring - NASA Applied Sciences, <https://appliedsciences.nasa.gov/sites/default/files/2024-09/PACE_Part1_Final.pdf>

27. FSSCat - Earth Online, <https://earth.esa.int/eogateway/missions/fsscat>

28. EnMAP, <https://www.enmap.org/>

29. MIRAS - ESA Earth Online - European Space Agency, <https://earth.esa.int/eogateway/instruments/miras>

30. Satellite altimetry overview - Geodesy Science, <https://geodesy.science/item/satellite-altimetry/>

31. Tracking water from space (GRACE/GRACE-FO) - JPL, <https://gracefo.jpl.nasa.gov/resources/72/tracking-water-from-space/>

32. Gravity Recovery and Climate Experiment (GRACE) - NASA Sea Level Change Portal, <https://sealevel.nasa.gov/missions/grace>

33. Satellite-based estimates of groundwater depletion in India <https://www.nature.com/articles/nature08238/>

34. Satellite magnetometer booms and calibration - Springer, <https://link.springer.com/article/10.1007/s11214-025-01238-7>

35. Earth's magnetic field (video) - ESA Multimedia, <https://dlmultimedia.esa.int/download/public/videos/2013/10/038/1310_038_BR_009.mp4>

36. Earth's magnetic field generated in the core (depth reference) - Phys.org, <https://phys.org/news/2016-05/strength-earth-magnetic-field.html>

37. Swarm mission overview - ESA Earth Online, <https://earth.esa.int/eogateway/missions/swarm>

38. Deep Space Climate Observatory (DSCOVR) - National Centers for Environmental Information - NOAA, <https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.stp.swx:satellite-systems_dscovr>

39. RainCube: the first ever radar measurements from a CubeSat in space - SPIE Digital Library, <https://www.spiedigitallibrary.org/journals/journal-of-applied-remote-sensing/volume-13/issue-3/032504/RainCube--the-first-ever-radar-measurements-from-a-CubeSat/10.1117/1.JRS.13.032504.full>

40. Real-Time Rain Rate Evaluation via Satellite Downlink Signal Attenuation Measurement - PubMed Central, <https://pmc.ncbi.nlm.nih.gov/articles/PMC5580102/>