# What Data Do Satellites Record?

<details class="post-warning">
<summary><strong>Article under review</strong> (click to open)</summary>

This article is still a work in progress and is undergoing a complete revision. Some sections may be incomplete or change significantly in future versions.

</details>

## Introduction

In recent decades, satellites have become one of the most strategic infrastructures for understanding, monitoring, and managing our planet. Every day, hundreds of orbiting missions collect an impressive amount of information: ultra-high-resolution images, atmospheric data, measurements of land and sea surfaces, navigation signals, vertical atmospheric profiles, and variations in the gravitational and magnetic fields. It's no longer just about "photos from space," but a complex ecosystem of complementary technologies that, together, build the most complete operational representation of Earth ever obtained in human history.

In this article, we will analyze all the main sources of satellite data, ordering them from the most known to the least known. For each category, we will see what it measures, what it's used for, what real-world applications it enables, what the most representative missions are, and finally how the sensor that makes it possible works. The goal is to offer a clear yet in-depth overview, useful for both industry professionals and those who wish to better understand the technologies that are revolutionizing the way we observe Earth.

In this report, we analyze in detail nineteen distinct categories of satellite instrumentation. For each, we will examine in detail the physical principle of operation, supported by the mathematical formalism governing the interaction between radiation and matter, and we will explore the operational applications that transform raw data into critical geophysical information.

In this analysis, we will discuss passive sensors that measure reflected solar radiation or terrestrial thermal emission, active sensors that illuminate the surface with their own pulses, as well as opportunistic sensors that leverage existing signals to infer environmental properties.

***

## 1. GNSS – Global Navigation Satellite Systems
GNSS data originated in military contexts but have proven fundamental in many everyday fields. They enable global-scale autonomous positioning and navigation and provide a standard time reference.

GNSS systems (such as GPS, Galileo, GLONASS, BeiDou) transmit radiofrequency signals containing orbital and temporal information from onboard atomic clocks. By measuring the time it takes for the signal to reach a receiver on Earth, the distance and thus the user's position are calculated via trilateration with at least 4 visible satellites. GNSS therefore provides extremely precise measurements of positioning (latitude, longitude, altitude) and absolute time.

They are used in **geodesy** (GNSS station networks monitor tectonic movement and define global references), **precision agriculture**, **mapping** and **GIS**, terrestrial, aerial, and naval **transport**, and synchronization of electrical and telecommunication networks. For example, the combined use of various GNSS systems now allows for multi-constellation receivers with global coverage and greater reliability.

### 1.1 GNSS Radio Occultation (GNSS-RO): Precision Atmospheric Sounding

GNSS Radio Occultation (GNSS-RO) represents one of the most elegant and robust remote sensing techniques, transforming navigation signals, originally conceived for positioning, into high-precision tools for meteorology and climatology.

#### Physical Principle and Mathematical Formulation

A GNSS receiver captures coded signals transmitted by satellites, which include the transmission time.

By comparing with local time (after synchronization), the satellite distance (pseudo-range) is obtained. Intersecting the distance spheres of 4 or more satellites resolves the three-dimensional position and the receiver's time difference. The physical principle is the measurement of the signal's time of flight ($t$) and the relation
$$d = c \cdot t,$$
where $c$ is the speed of light.

**Relativistic** and **atmospheric corrections** (ionosphere and troposphere) must be applied to achieve accuracies at the meter level or below.

Differential systems and techniques such as **RTK (Real-Time Kinematic)** allow for centimeter-level precision by correcting residual errors using reference stations. In summary, GNSS precisely measures position and time on a global scale, constituting an invisible but crucial infrastructure for modern society.

> I warn you, I'm taking off my popularizer hat now and putting on my mathematician hat :)

The fundamental parameter measured is the excess phase delay, from which the bending angle ($\alpha$) is derived as a function of the impact parameter ($a$). In a locally spherically symmetric atmosphere, the relationship between the bending angle and the refractive index $n(r)$ is governed by the generalized Snell's law and can be inverted using the inverse Abel transform <sup>3</sup>:

$$n(r) = \exp \left( \frac{1}{\pi} \int_x^\infty \frac{\alpha(x)}{\sqrt{x^2 - a^2}} \\, dx \right)$$

Where $x = n(r) \cdot r$ is the refractive radius and $\alpha(x)$ is the corrected bending angle. Once the refractive index profile is obtained, refractivity $N$ is calculated, defined as $N = (n-1) \times 10^6$. The relationship between refractivity and atmospheric thermodynamic variables is described by the [Smith-Weintraub](https://nvlpubs.nist.gov/nistpubs/jres/50/jresv50n1p39_A1b.pdf) equation:

$$N = 77.6 \frac{P}{T} + 3.73 \times 10^5 \frac{e}{T^2} - 40.3 \frac{n\_e}{f^2}$$

In this equation:

- $P$ is the total atmospheric pressure (hPa).

- $T$ is the temperature (K).

- $e$ is the partial pressure of water vapor (hPa).

- $n\_e$ is the electron density, which dominates the ionospheric term (significant above 60-80 km).

- $f$ is the signal frequency.


#### Utility and Critical Applications

The strength of GNSS-RO lies in its "self-calibrating" nature: since it relies on time and frequency measurements (guaranteed by atomic clocks), it does not suffer from instrumental drift, making it ideal for long-term climate monitoring.<sup>6</sup>

- **Operational Meteorology (NWP):** RO profiles are essential for anchoring weather models in the upper troposphere and stratosphere, where other data are scarce, correcting temperature biases.<sup>7</sup>

- **Climatology:** Monitoring global temperature and tropopause trends with absolute precision.

- **Space Weather:** Measurement of Total Electron Content (TEC) and ionospheric scintillations, crucial for the security of satellite communications.<sup>8</sup>


#### Reference Missions

The technique was pioneered by the **GPS/MET** mission and made operational by the **COSMIC-1** constellation (Taiwan/USA). Currently, **COSMIC-2** provides dense coverage in equatorial latitudes, optimized for hurricane and ionosphere studies.<sup>6</sup> In parallel, the commercial "NewSpace" sector has revolutionized this field: **Spire Global**, with its constellation of over 100 LEMUR CubeSats, and **PlanetIQ**, provide thousands of daily measurements, integrating institutional data.<sup>9</sup>

***

### 1.2. GNSS Reflectometry (GNSS-R): The Bistatic Radar of Opportunity

While Radio Occultation exploits signals transmitted through the atmosphere, GNSS Reflectometry (GNSS-R) analyzes signals reflected from the Earth's surface, operating as a multi-static bistatic radar.


#### What Does It Measure?

GNSS-R allows the extraction of geophysical properties from the reflecting surface:

- **Oceans:** Surface wind speed and mean square slope.

- **Soil:** Soil moisture and vegetation biomass.

- **Cryosphere:** Sea ice extent and thickness.


#### Physical Operation and Formulas

The receiver measures the power of the reflected signal as a function of time delay and Doppler shift, generating a _Delay Doppler Map_ (DDM). The received power $P_r$ is described by the bistatic radar equation <sup>9</sup>:

$$ P_r(\tau, f_D) = \frac{P_t G_t \lambda^2}{(4\pi)^3} \iint_A \frac{G_r(\vec{r}) \sigma^0(\vec{r}) \chi^2(\tau, f_D)}{R_t^2(\vec{r}) R_r^2(\vec{r})} d\vec{r} $$

Where:

- $\sigma^0$ is the bistatic scattering coefficient of the surface.

- $\chi^2$ is the ambiguity function (Woodward Ambiguity Function) that describes the system's response.

- $R_t$ and $R_r$ are the distances from the transmitter and receiver to the specular reflection point.

On calm (specular) surfaces, energy is concentrated at one point in the DDM. On rough surfaces (ocean agitated by wind), energy disperses to form a "horseshoe" shape in the DDM map; the amplitude of this dispersion is directly correlated with wind speed.

> 🎮 **Interactive Simulation.** Do you want to see how Delay Doppler Maps change with varying wind, altitude, and incidence angle? Try the [GNSS-R DDM simulation](Assets/simulations/ddm/index.html) based on the model described here.

<iframe
  src="../../../Assets/simulations/ddm/index.html"
  title="GNSS-R Delay Doppler Map Simulation"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

The graph shows the power distribution of the reflected signal in delay-Doppler space. In rough sea conditions (wind ~10-15 m/s), energy disperses from the specular position (delay=0, Doppler=0) forming the characteristic "horseshoe shape" in a 2D graph. In this case, we have
- **X-axis** (Doppler): Frequency shift due to the relative motion of satellite-surface
- **Y-axis** (Delay): Time delay relative to the direct specular path
- **Z-axis** (Power): Intensity of the reflected signal

Multiple peaks along the Doppler axis indicate that surface roughness (waves) generates scattering from a wide glistening zone, with contributions from points at different relative velocities. The rougher the sea, the more the DDM "opens" laterally and the central peak attenuates.

##### Some notes on the surface integral

In GNSS-R, the signal does not reflect from a single point (as in a monostatic radar with a point target), but scatters over a wide elliptical area on the sea surface, known as the Fresnel zone or illuminated scattering area.

Each small surface element within this area contributes to the total power received by the satellite.

To find the total power ($P_r$​) arriving at the receiver, we must sum (integrate) the power contributions from all these small surface elements.

The scattering surface ($A$) is defined by two orthogonal coordinates (which can be spatial or signal-related) lying on the scattering plane.

The differential element $\mathrm{d} \vec{r}$ in this context represents $\mathrm{d} S$ or $\mathrm{d} A$ (differential surface element).

#### Utility and applications

The "killer" application of GNSS-R is tropical cyclone monitoring<sup>65</sup>. Unlike optical radiometers (blocked by clouds) or Ku-band scatterometers (attenuated by heavy rain), L-band GNSS signals penetrate intense precipitation<sup>66</sup>, allowing for the measurement of wind speed in the eye of the cyclone.

In terrestrial environments, the technique provides high-temporal-resolution soil moisture maps, essential for flood forecasting and agriculture.

#### Missions
Of course, among the missions, I must mention the one from which I took much of this information, namely NASA's CYGNSS, but it is not the only one.

- **CYGNSS (NASA):** A constellation of 8 microsatellites launched to study hurricane intensification, which has also demonstrated surprising capabilities in monitoring tropical wetlands.

- **FSSCat (ESA):** A mission based on two 6U CubeSats that combined GNSS-R with an optical hyperspectral sensor, winner of the Copernicus Masters. The mission lasted approximately one year. <sup>12</sup>

- **Spire Global:** Offers commercial reflectometry products for maritime and sea ice monitoring, and more.<sup>9</sup>

***

## 2. Synthetic Aperture Radar: SAR

### 2.1 Synthetic Aperture Radar (SAR): all-weather microwave imaging

SAR represents the primary instrument for observing the solid surface in all weather and lighting conditions, thanks to its active nature and microwave wavelength.

#### What does it measure?

Synthetic aperture radars actively send electromagnetic waves (microwaves) towards the Earth's surface and measure the backscattered echo, recording its intensity and phase upon return. Unlike optical sensors, a SAR illuminates the scene with its own pulses (typically in centimetric bands: L, C, X, etc.) and captures microwaves reflected from objects on the ground. This provides images where the “brightness” of each pixel is related to the radar backscattering coefficient (**backscatter**), which depends on the roughness, structure, and water content of the target. For example, smooth surfaces (calm waters) reflect little energy back to the radar, appearing dark, while rough areas or those with edges (such as buildings, fractured rocks, dense vegetation) appear bright.

By also measuring the phase of the backscattered microwave, SAR systems can detect distance differences on the order of millimeters with extreme sensitivity, paving the way for interferometry (InSAR, see next section). SAR radars operate in various polarizations (HH, VV, HV, VH), measuring different components of the electromagnetic field vector, which adds information about target geometry and the presence of vegetation.

SAR returns complex images (in the mathematical sense of the term) where each pixel contains:

- **Amplitude:** Correlated with surface roughness, dielectric constant (moisture), and local geometry.

- **Phase:** Correlated with the geometric distance between sensor and target, fundamental for interferometric applications.

#### Physical operation and formulas

Per ottenere un'alta risoluzione spaziale in direzione azimutale (lungo la traccia) senza impiegare antenne chilometriche, il SAR sfrutta il movimento del satellite per sintetizzare un'apertura virtuale<sup>14</sup>. 

Elaborando coerentemente la storia di fase degli echi di ritorno (**effetto Doppler**), la risoluzione azimutale teorica $\delta_a$ diventa indipendente dalla distanza ed è pari a metà della lunghezza dell'antenna reale $L_a$<sup>15</sup>:

$$\delta_a = \frac{L_a}{2}$$

La risoluzione in range (perpendicolare alla traccia) è determinata dalla larghezza di banda $B$ dell'impulso trasmesso (spesso un _chirp_ modulato in frequenza, dove il _chirp_ è un segnale la cui frequenza varia nel tempo):

$$\delta_r = \frac{c}{2B \sin(\theta)}$$

Dove $\theta$ è l'angolo di incidenza. L'equazione di fase $\phi$ per un pixel a distanza $R$ è data da:

$$\phi = -\frac{4\pi R}{\lambda} + \phi_{scatt}$$

La frazione $4\pi R / \lambda$ indica che la fase compie un ciclo completo ogni volta che la distanza cambia di mezza lunghezza d'onda ($\lambda/2$).


#### Utilità e applicazioni

Il vantaggio principale del SAR è la sua capacità di osservare la Terra **con ogni condizione di illuminazione** e **meteorologica**: essendo attivo, non dipende dal Sole né è ostacolato dalle nubi (le microonde attraversano la copertura nuvolosa). Questo rende i SAR ideali per monitorare regioni frequentemente coperte da nubi (zone tropicali) o per sorvegliare aree polari durante la lunga notte invernale. 

Le immagini SAR trovano impiego in cartografia di suoli umidi e alluvionati (il segnale penetra un po’ la vegetazione e riflette fortemente da terreni saturi d’acqua, utilissimo in caso di inondazioni), in agricoltura (stima dell’umidità del suolo e fase fenologica delle colture: la dispersione del segnale varia con la struttura del fogliame), nella sorveglianza marittima (rilevazione di navi e di chiazze di petrolio: il petrolio calma il mare e appare scuro sul SAR, facilitando l’individuazione di sversamenti). 

In geologia e gestione del territorio, i SAR mappano deformazioni del terreno e frane tramite InSAR (si veda oltre), mentre in forestry la polarimetria SAR aiuta a stimare la biomassa forestale (missioni P-band come BIOMASS). Inoltre, i SAR permettono di rilevare cambiamenti improvvisi: grazie a passaggi frequenti, individuano il disboscamento illegale, il movimento di ghiacciai, i nuovi edifici o i danni da disastri confrontando immagini prima/dopo (change detection). In ambito militare e di intelligence, l’osservazione radar è cruciale perché fornisce immagini giorno/notte e all-weather, rivelando installazioni camuffate e movimenti.

In conclusione la versatilità dei sistemi SAR è immensa<sup>16</sup>:

- **Monitoraggio Marittimo:** Rilevamento di navi, _oil spills_ (che appaiono scuri per soppressione delle onde capillari) e classificazione del ghiaccio marino.

- **Agricoltura:** Monitoraggio della crescita delle colture (sensibilità alla biomassa e struttura) e dell'umidità del suolo.

- **Gestione Emergenze:** Mappatura rapida delle inondazioni (l'acqua calma appare nera per riflessione speculare lontano dal sensore).


#### Missioni

Le principali missioni sono:

- **Sentinel-1 (ESA/Copernicus):** La missione di riferimento in banda C, che fornisce dati globali con politica open access, cruciale per l'interferometria operativa.<sup>16</sup>

- **COSMO-SkyMed (ASI/Italia) & TerraSAR-X (DLR/Germania):** Sistemi in banda X ad altissima risoluzione per usi duali civili/militari.

- **NISAR (NASA/ISRO):** Missione futura in banda L ed S, focalizzata sulla biomassa e sulla deformazione crostale globale.

***


### 2.2 Interferometria SAR (InSAR): la geodesia dallo spazio

L'InSAR è una tecnica derivata dal SAR che sfrutta la differenza di fase tra due acquisizioni per misurare la topografia o le deformazioni millimetriche della superficie.


#### Cosa misura

L’Interferometria SAR sfrutta la fase del segnale radar registrato da due immagini SAR acquisite da orbite leggermente diverse (Interferometria spaziale) o a tempi diversi (Interferometria differenziale temporale) per misurare minime differenze di distanza e quindi variazioni di quota o di spostamento della superficie terrestre. 

In pratica, combinando due immagini SAR della stessa area, la differenza di fase tra i pixel genera frange d’interferenza proporzionali alla differenza di percorso ottico dell’onda radar.

Nel caso di InSAR topografica (es. missione SRTM o TanDEM-X), due antenne (o satelliti in formazione) osservano simultaneamente la superficie: la fase differenziale dipende dall’altitudine del suolo e consente di derivare modelli digitali di elevazione (DEM) ad alta risoluzione. 

Nell’InSAR differenziale (DInSAR), si usano due passaggi successivi a distanza di tempo $\Delta t$: se la superficie nel frattempo è deformata (abbassata o sollevata) di pochi millimetri o centimetri, tale differenza appare come variazione di fase tra le due immagini.

This generates **false-color interferograms** with concentric fringes, each typically corresponding to a line-of-sight displacement of half a wavelength ($≈2.8$ cm for Sentinel-1 in C-band).

By measuring the number and spacing of the fringes, the 2D surface deformation field projected onto the radar's line of sight is obtained. InSAR is therefore capable of measuring microscopic ground movements (mm order) over large areas, detecting slow and progressive phenomena invisible to the naked eye. Sudden co-seismic displacements (earthquakes) or rapid volcanic deformations also generate characteristic interferometric patterns (circular fringes around the epicenter or crater).

#### Physical Operation and Formulas

The interferometric phase difference $\Delta \phi$ between two images is composed of several contributions:

$$ \Delta \phi = \Delta \phi_{geom} + \Delta \phi_{topo} + \Delta \phi_{def} + \Delta \phi_{atm} + \Delta \phi_{noise} $$

- $\Delta \phi_{def}$ is the phase due to ground displacement.

- $\Delta \phi_{topo}$ is related to residual topography.

- $\Delta \phi_{atm}$ is the atmospheric delay (often the main error term).

The relationship between deformation $d$ and the "unwrapped" phase is <sup>18</sup>:

$$d = \frac{\lambda}{4\pi} \Delta \phi\_{unwrapped}$$

For a C-band satellite like Sentinel-1 ($\lambda \approx 5.6$ cm), an interference fringe ($2\pi$) corresponds to a displacement of approximately 2.8 cm.<sup>20</sup>

<img src="../../../Assets/phase_diff.png" alt="Interferometric fringes and measured deformation" title="Example of an interferogram: colored phase fringes represent millimetric surface displacements relative to the radar's line of sight.">
_Figure 01: Interferometric fringes and measured deformation: example of an interferogram. Colored phase fringes represent millimetric surface displacements relative to the radar's line of sight_

#### Applications
The main ones are:
- **Tectonics and Volcanology:** Measurement of post-seismic deformation fields and the "breathing" of volcanoes (inflation/deflation of magma chambers).<sup>21</sup>

- **Urban Subsidence:** Monitoring the stability of critical buildings and infrastructure with advanced techniques such as Persistent Scatterers (PS-InSAR).<sup>16</sup>

<figure>
  <video controls src="https://sentiwiki.copernicus.eu/__attachments/1680568/1302_001_AR_EN%20(1).mp4?inst-v=edeeb585-a079-43c5-850b-337320319499" style="max-width: 100%; height: auto;"></video>
  <figcaption>Video 01: Monitoring of Venice (Italy) with Sentinel-1, which allows continuous monitoring of ground movements with an accuracy of a few millimeters per year.</figcaption>
</figure>

***

### 2.3. Radar Altimetry: Ocean and Ice Topography

Radar altimeters precisely measure the vertical distance between the satellite and the underlying surface, calculated from the round-trip time of radar pulses sent perpendicularly to the ground (nadir).

Nadir radar altimetry is the fundamental technique for quantifying sea level rise and ocean circulation.

#### What Does It Measure?

As I mentioned before, it measures the vertical distance (range) between the satellite and the surface at nadir. Combining this measurement with the precise orbit and geophysical corrections, we obtain:

- **Sea Surface Height (SSH).**

- **Significant Wave Height (SWH).**

- **Wind speed** (from backscatter intensity).

The objective to measure is the surface elevation (ocean, land, ice) relative to a reference ellipsoid. In oceanography, this measurement, subtracted from the satellite's orbit known in a geodetic system, provides the sea surface height (SSH) relative to the geoid. Over the open ocean, SSH variations of a few centimeters reflect ocean currents, tides, and the mean sea level rise.

Altimeters also measure secondary parameters: by analyzing the shape and power of the radar echo (the waveform), surface roughness, and thus significant wave height and wind speed over the sea, are derived.

Over continental surfaces, the altimeter can measure the height of lakes and large rivers, as well as the average terrain topography (although with spatial resolution limited by the large radar footprint, typically a few km).

Over ice sheets, specialized radar altimeters (e.g., CryoSat-2) measure snow/ice elevation and detect temporal variations in ice thickness. In new "synthetic aperture" altimeters (SAR altimetry), the use of Doppler processing improves along-track spatial resolution (∼300 m), allowing more accurate measurements near coasts and over smaller water bodies.

#### Physical Operation and Formulas

The altimeter emits a radar pulse and records the returning echo.

The echo waveform is analytically modeled by the Brown Model, which describes the convolution between the system response, the probability density of wave heights, and the flat surface impulse response.<sup>22</sup>

The SAR Altimetry (or Delay-Doppler) technique, introduced by CryoSat-2 and Sentinel-3, improves along-track resolution (\~300m) by focusing energy into Doppler cells, allowing precise measurements even among sea ice and in coastal waters.<sup>24</sup>

#### Missions

- **Sentinel-3 (SRAL):** Operational SAR altimeter for ocean and ice.

- **Jason-3 / Sentinel-6 Michael Freilich:** The reference series for climate continuity of global mean sea level (GMSL).

- **SWOT (Surface Water and Ocean Topography):** Wide-swath radar interferometry (Ka-band) to extend altimetry from 1D profile to 2D map.

***

## 3. Passive and optical sensors
Now we radically change topic, discussing passive sensors, those most similar to classic cameras or the cameras on our smartphones.

Passive optical sensors aboard satellites capture solar electromagnetic radiation reflected from the Earth's surface (in the visible, near-infrared, and shortwave infrared bands) and, in some cases, thermal emission in the thermal infrared.

They therefore provide measurements of reflected radiance or surface reflectance for each spectral band. In the case of thermal bands (typically present on satellites like Landsat or Sentinel-3), they measure emitted thermal radiance related to surface temperature.

### 3.1 Panchromatic images: extreme geometric resolution

Optical images are intuitive and rich in information, finding application in environmental mapping, land management, agriculture and forest monitoring, urban planning, and emergency surveillance.

#### What it measures

In panchromatic mode, the integrated intensity over a wide spectral range (e.g., 0.5–0.8 μm, like WorldView-3) is recorded, producing high-spatial-resolution black and white images.

In practice, the **integrated radiance** is recorded over a single very wide spectral band (typically visible + near-infrared, 0.4 - 0.9 $\mu m$ Landsat 7).

> Landsat 8 has a restricted range of 0.50-0.68 $\mu m$ to avoid atmospheric scattering.

#### Physical operation

The wide bandwidth allows for collecting a high number of photons, ensuring a high Signal-to-Noise Ratio (SNR). This enables reducing pixel size (IFOV) while maintaining short integration times, necessary to avoid orbital _motion blur_. Spatial resolution can drop below 30 cm in modern commercial platforms, such as Superview Neo-1.<sup>27</sup>

#### Applications and pansharpening

The panchromatic band is often used in synergy with low-resolution multispectral bands through _Pansharpening_ techniques. The resulting image combines the high geometric fidelity of the panchromatic with the chromatic information of the multispectral. A simplified relationship for fusion is <sup>28</sup>:

$$I_{Pan} \approx \sum_i \alpha_i \cdot I_{MS, i}$$

This is the initial physical condition and expresses the fact that the energy recorded by the panchromatic sensor (wideband) should ideally correspond to the weighted sum of the energies recorded by the multispectral bands (narrowband) that fall within its spectral range.

The coefficients $\alpha_i$ represent the spectral weights. Since the panchromatic sensor does not have a flat sensitivity (i.e., it does not "see" all colors with the same efficiency), each multispectral band contributes to the Pan signal differently. For example, if the Pan sensor is very sensitive to red and less to blue, the weight $\alpha_i$ of the red channel will be greater.

Below is an [example of pansharpening application](https://www.satimagingcorp.com/satellite-sensors/superview-neo-satellite-constellation/).

<img src="../../../Assets/Doha.jpg" alt="Satellite panchromatic image of Doha skyline" title="Example of ultra-high resolution panchromatic image of Doha">
Figure 02: _Doha skyline captured from a sub-metric panchromatic scene: the extreme geometric resolution allows distinguishing individual buildings and urban infrastructure._

#### Missions

- **Maxar (WorldView Legion), Airbus (Pléiades Neo), and Superview Neo-1:** Market-leading commercial resolutions (up to 30 cm).

- **Landsat 8/9:** 15m panchromatic band to refine 30m spectral bands.<sup>29</sup>

***

### 3.2. Multispectral imaging: the color of the Earth

Optical images are used to identify soil types and land use (crops, forests, urban areas), to monitor water bodies, glaciers and snow, and to document events such as fires, floods, or landslides.

The standard for global environmental monitoring, which acquires images in a discrete number of spectral bands (approximately 4 to 15).

Multispectral images allow, for example, to distinguish healthy vegetation from diseased vegetation through indices like NDVI (Normalized Difference Vegetation Index). NDVI is calculated from reflectances in the Near-Infrared (NIR) and Red (R):
$$NDVI = \frac{NIR - R}{NIR + R},$$
and is widely used to quantify the density and vigor of vegetation cover.


#### What it measures

In multispectral mode, the sensor has several separate (typically 3–10) narrower channels (e.g., blue, green, red, near-infrared bands, etc.), providing information on the color and composition of the surface.

Surface reflectance in discrete bands in the Visible (VIS), Near-Infrared (NIR), and Shortwave Infrared (SWIR).


#### Physics and spectral indices

It exploits the distinctive spectral signatures of materials. For example, chlorophyll absorbs in the red and strongly reflects in the NIR.

The use of SWIR bands is fundamental for discriminating snow from clouds and for monitoring vegetation water stress.

<img src="../../../Assets/PanvsMulti.png" alt="Comparison between panchromatic and multispectral image over the same urban neighborhood" title="Differences between panchromatic band and multispectral composite">
_Figure 03: Visual comparison between a high-resolution panchromatic band and its multispectral composite: the panchromatic captures geometric detail, while the multispectral preserves chromatic variation useful for indices like NDVI and SWIR to discriminate materials._


#### Applications and missions

- **Sentinel-2 (ESA):** With 13 bands and [resolution](https://sentiwiki.copernicus.eu/web/s2-products) 10-20m or 60m, it is the reference for precision agriculture and land cover monitoring.<sup>16</sup>

- **Landsat 8/9 (NASA/USGS):** Ensures continuity of observations since 1972, essential for long-term change studies. The resolution, depending on the chosen band, ranges from 30m to 100m.

***


### 3.3 Hyperspectral Imaging

Hyperspectral Imaging (HSI) extends the multispectral concept by acquiring hundreds of contiguous bands, allowing for detailed chemical-physical analysis of each pixel.

Indeed, the narrow and contiguous bands of HSI allow for the detection of absorption features (narrow peaks and valleys in the spectral curve). These features are unique to specific chemical bonds (e.g., O-H bonds in clay minerals, or specific pigments in vegetation), making it possible to identify which material is present, not just distinguish its color. I would define it as a kind of remote spectroscopy.


#### What it measures
Hyperspectral sensors go beyond multispectral ones, acquiring tens or hundreds of very narrow (on the order of 10 nm) contiguous bands, covering the visible/SWIR spectral continuum in detail: each pixel contains a kind of continuous "spectral signature" of the observed object. This allows for the measurement of subtle reflectance differences related to the chemical and physical composition of materials (vegetation, minerals, water).

What is studied is nothing more than a data "hypercube" $(x, y, \lambda)$ with hundreds of narrow spectral channels (e.g., $5-10 nm$), covering the VNIR-SWIR range ($400-2500 nm$).


#### Physical operation and spectral mixing

Each pixel contains a continuous spectrum that acts as a chemical "fingerprint." The measured signal $y$ is often modeled as a [linear mixture](https://ieeexplore.ieee.org/document/974727) of the pure spectra of the constituent materials (_endmembers_) $M$ present in the pixel, according to the _Linear Mixing_ (or _Mixture_) _Model_ (**LMM**) <sup>30</sup>:

$$y = \sum_{k=1}^{K} a_k m_k + n$$

Where $a_k$ are the fractional abundances. This allows for the identification of sub-pixel materials or specific minerals.
> In mineralogy, an "endmember" is a 100% pure mineral (e.g., pure quartz) which, when mixed with others, forms the rock observed in the pixel.


#### Utility and applications

- **Mineral Geology:** Identification of hydrothermal alterations and rare earth elements.

- **Water Quality:** Distinction between different algal species and sediments.<sup>32</sup>


<figure>
  <img src="../../../Assets/Sea.png" alt="Ocean colors determined by constituents in water" title="Ocean colors determined by constituents in water">
  <figcaption>
    The color of the ocean is a function of the light that is absorbed or scattered in the presence of dissolved or suspended constituents in the water. <sup>32</sup>
  </figcaption>
</figure>

- **Smart CubeSats:** The **FSSCat/$\Phi$-Sat-1** mission demonstrated the use of on-board AI to process hyperspectral data (HyperScout-2) and discard cloudy images directly in orbit, optimizing downlink.<sup>13</sup>


#### Missions

- **EnMAP (DLR) & PRISMA (ASI):** Operative scientific missions, German and Italian respectively.<sup>34</sup>

- **PACE (NASA):** Launched in 2024, with the OCI (Ocean Color Instrument) extending hyperspectral capabilities to global oceans.<sup>32</sup>

> 🎮 **Spectral Simulation.** Visually compare panchromatic, multispectral, and hyperspectral modes and observe how spatial resolution, sampled spectrum, and thematic information change. You can open it full screen from the [dedicated page](Assets/simulations/spectral/index_en.html).

<iframe
  src="../../../Assets/simulations/spectral/index_en.html"
  title="Spectral Sensor Simulation"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

> The widget shows (on the left) the signal sampling with different bands and (on the right) the visual rendering on the ground: panchromatic aims for maximum spatial resolution, multispectral introduces color but loses detail, while hyperspectral decreases resolution to recover chemical-physical information (vegetative stress, materials, etc.).

***


### 3.4. Thermal Infrared (TIR): measuring the planet's heat

TIR sensors measure the energy emitted by Earth, allowing for the estimation and study of surface temperature.


#### What it measures
Based on the subject to be measured, there are:

- **Land Surface Temperature (LST).**

- **Sea Surface Temperature (SST).**

- **Thermal Anomalies:** Wildfires and volcanic activity.


#### Physical operation and formulas

Before explaining the physical operation and especially the formulas, I think it's important to understand why inversion is crucial. For this, we need to distinguish two regimes:

  - In the visible (e.g., Sentinel-2 RGB bands), the sensor measures reflected sunlight. Here, the object's temperature has almost nothing to do with the amount of light reaching the sensor.

  - In Thermal Infrared (TIR), the energy source is not the Sun, but the object itself. Every body with a temperature above absolute zero emits electromagnetic radiation due to thermal agitation.

        Therefore: In TIR, measuring energy (Radiance) is equivalent to measuring the object's thermal state.

Physics tells us (Planck's Law) that there is a rigid relationship between the Temperature $T$ of a black body and the Radiance $L_\lambda$ it emits at a specific wavelength $\lambda$.

The measured radiance $L_{\lambda}$ is converted into brightness temperature $T_b$ by inverting Planck's law (at least I'll spare you that one). In practice, if the object is at temperature $T$, it will emit $L_\lambda$ amount of energy.

However, the sensor works in reverse. The detector is an infrared-sensitive photodiode (I admit it sounds very cacophonous in Italian), often made of Mercury-Cadmium-Telluride, cryogenically cooled, and struck by photons. Photons generate electrons and thus electric current, which is converted into a digital number (DN).

Through radiometric calibration (Gain & Offset), the DN is converted back into Radiance at the Sensor ($L_{Sensor}$).

Since the sensor "doesn't know" what the temperature is, we must ask ourselves mathematically:
"What temperature $T$ must a theoretical black body have to produce the radiance $L$ I have just measured?"

This is why inversion is performed. Planck's equation is solved for $T$:

$$T_b = \frac{h c}{k_B \lambda \ln\left( \frac{2 h c^2}{\lambda^5 L_\lambda} + 1 \right)}$$

To obtain the real kinetic temperature ($T_{surf}$), it is necessary to correct for the surface emissivity $\epsilon$ and for the atmospheric contribution (water vapor absorption/emission). _Split-Window_ algorithms use two nearby thermal channels (e.g., 11 $\mu m$ and 12 $\mu m$) to estimate and remove the atmospheric effect.

#### Why is it called "Brightness Temperature" and not "Real Temperature"?
This is the most subtle and important part. The inversion assumes that the object is a Black Body (Emissivity $\varepsilon = 1$), i.e., a perfect emitter. However, in reality:

- Water has emissivity ranging between 0.98 and 0.99 (almost a black body).
- Bare soil or sand can have an emissivity between 0.90 and 0.95.

If a sensor points at a warm rock at 300K (27 °C), but with low emissivity, the rock will emit less energy than predicted by the pure Planck's law. If we invert the formula without correction, the satellite will calculate a temperature lower than reality (e.g., 295K instead of 300K).

That "fictitious" (lower) temperature is the **brightness temperature**. It is the temperature the object would have if it were a perfect black body emitting that amount of light.

### Missions
Among the missions that I believe are worth mentioning are:

- **Sentinel-3 (SLSTR):** High precision (<0.3 K) for climatic SST, using a dual view (nadir and oblique) to correct for the atmosphere.

- **Landsat 8/9 (TIRS):** Two thermal bands at 100m resolution.

- **ECOSTRESS (ISS):** Monitoring evapotranspiration and vegetation water stress.

***

> 🎮 **Interactive TIR simulation.** Follow the complete pipeline (photons → DN → radiance → Planck inversion) and observe how emissivity and atmosphere shift the brightness temperature relative to the actual temperature.

<iframe
  src="../../../Assets/simulations/tir/index_en.html"
  title="TIR simulation: radiance and temperature"
  loading="lazy"
  style="width: 100%; min-height: 960px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

## 4. Passive microwave radiometry (surface imaging)

Sensors that observe the natural microwave emission from the Earth's surface at low frequencies (L, C, X Band).

### What it measures

- **Soil Moisture:** The dielectric constant of water is very high (~80) compared to dry soil (~4), drastically influencing emissivity.

- **Ocean Salinity (SSS):** In L-band (1.4 GHz), emissivity depends on salinity.

### Physical operation and synthetic interferometry

In microwaves, the Rayleigh-Jeans approximation ($h\nu \ll k\_B T$) holds, so radiance is proportional to the physical temperature:

$$T\_b \approx \epsilon \cdot T\_{phys}$$

The **SMOS** (ESA) mission introduced a revolutionary technology: the interferometric synthetic aperture radiometer (MIRAS). Instead of a large rotating parabolic antenna (as in SMAP), it uses a static Y-shaped array of 69 antennas. The brightness temperature image is mathematically reconstructed from the inverse Fourier transform of the visibility functions measured between pairs of antennas.<sup>37</sup>

### Missions

- **SMOS (ESA):** Pioneer of interferometric L-band.

- **SMAP (NASA):** Radiometer with a large rotating antenna (6m) for high-precision soil moisture.

- **AMSR-2 (JAXA):** Multifrequency "workhorse" radiometer for precipitable water, ice, and SST.

***

## 5. Satellite gravimetry: weighing water from space

Gravimetry measures variations in the planet's mass, offering a unique view of the deep water cycle.

### What it measures

Anomalies in the Earth's gravitational field and their temporal variations (monthly). These variations are due to the movement of large water masses (glacier melt, aquifer depletion, ocean level variations).

### Physical operation: satellite-to-satellite tracking (SST)

Two identical satellites (as in GRACE and GRACE-FO) fly in the same orbit separated by approximately 220 km. A microwave ranging system (K-band) or a laser interferometer (in GRACE-FO) measures the variation in inter-satellite distance with micrometric precision.

When the leading satellite flies over an excessive mass (e.g., a mountain), it is gravitationally accelerated, moving away from the second. By analyzing the variations in relative velocity (Range-Rate $\dot{\rho}$), the global gravitational potential is reconstructed.<sup>48</sup>

### Missions and applications

- **GRACE / GRACE-FO (NASA/GFZ):** For the first time, they unequivocally quantified the mass loss of polar ice sheets and the excessive withdrawal from aquifers in India and California.<sup>50</sup>

- **GOCE (ESA):** Used a gradiometer (ultrasensitive accelerometers) to define the static geoid with unprecedented spatial resolution and precision.

***

## 6. Satellite magnetometry

Space magnetometers study the Earth's magnetic field, a protective shield against solar wind.

### What it measures

The total magnetic field vector $\vec{B}$, separating contributions from the core (Core field), the crust (Lithospheric field), and external electric currents (Ionosphere/Magnetosphere).

### Physical operation: fluxgate and scalar

High-precision missions use a combination of instruments:

1. **Fluxgate Magnetometer (Vector):** Measures the three components of the field. It exploits the periodic magnetic saturation of a ferromagnetic core; the second harmonic of the induced signal is proportional to the external field.<sup>51</sup> It requires precise attitude calibration using Star Trackers rigidly attached to the instrument boom.

2. **Absolute Scalar Magnetometer:** (e.g., Overhauser or optically pumped helium) Measures the total intensity $|\vec{B}|$ by exploiting nuclear magnetic resonance or atomic transitions (Zeeman effect), providing an absolute reference for calibrating vector magnetometers.<sup>53</sup>


### Missions

- **Swarm (ESA):** A constellation of 3 satellites that allows for separating temporal from spatial variations of the geomagnetic field.

- **DSCOVR (NASA/NOAA):** Positioned at L1, it uses magnetometers to monitor the interplanetary magnetic field (IMF) carried by the solar wind, providing early warning for geomagnetic storms.<sup>54</sup>

***

## 7. Signals of Opportunity and CubeSat Radars: The New Frontier

This category combines two emerging trends: the use of non-native signals for EO and the extreme miniaturization of active sensors.


### A. Traffic Monitoring: Satellite AIS and ADS-B

Satellites capture position messages transmitted by ships (AIS) and aircraft (ADS-B). The main challenge is **packet de-collision**: a satellite sees an enormous area (FOV ~5000 km) containing thousands of emitters transmitting in the same time slots (TDMA).

- **SOTDMA vs CSTDMA:** The SOTDMA protocol (used by large Class A vessels) reserves future slots and is easier to decode from space compared to CSTDMA (Class B), which uses a random "listen before talk" approach, often saturated in orbit.<sup>59</sup>

- **Applications:** Fusion with SAR data to identify "dark" vessels (those not transmitting AIS) involved in illegal fishing or illicit trafficking.


### B. CubeSat Radar: RainCube

Until recently, radars were considered incompatible with CubeSats due to power and size requirements. The **RainCube** mission (NASA) demonstrated a Ka-band (35.7 GHz) weather radar on a 6U CubeSat.

- **Innovation:** Use of an ultralight deployable parabolic antenna and pulse compression techniques. In Ka-band, rain strongly attenuates the signal; RainCube exploits this very principle to profile storm structures.<sup>61</sup>


### C. Smart LNB: Rain from Satellite TVs

Projects like **NEFOCAST** transform domestic satellite TV receivers (Smart LNBs) into rain gauges. They measure the attenuation of the downlink signal (Ku/Ka band) caused by rain (_Rain Fade_).

- **Formula:** The specific attenuation $A$ (dB/km) is related to the precipitation rate $R$ (mm/h) by the power law $A = k R^\alpha$. A dense network of domestic "sensors" provides real-time rain maps with capillary resolution.<sup>63</sup>

***


### Synthetic Comparative Table of Technologies

| **Category**           | **Sensor Type**     | **Primary Measurement**                | **Exemplary Missions**         | **Key Application**           |
| :--------------------- | :------------------ | :------------------------------------- | :----------------------------- | :---------------------------- |
| **GNSS-RO**            | Passive (Limb)      | Refractivity ($N$), Temp., Humidity    | COSMIC-2, Spire, MetOp         | Weather (NWP), Climate        |
| **GNSS-R**             | Bistatic            | Surface Roughness, Wind, Soil Moisture | CYGNSS, FSSCat                 | Hurricanes, Floods            |
| **SAR**                | Active (Microwave)  | Backscatter ($\sigma^0$), Phase        | Sentinel-1, COSMO-SkyMed       | Deformations (InSAR), Ice     |
| **Radar Altimetry**    | Active (Nadir)      | SSH, SWH, Wind                         | Sentinel-3, Jason-3, SWOT      | Sea Level, Oceanography       |
| **Scatterometry**      | Active (Microwave)  | Vector Wind                            | MetOp (ASCAT), CFOSAT          | Marine Weather                |
| **Optical Pan**        | Passive (Vis/NIR)   | Radiance (High Spatial Res.)           | WorldView, Pléiades, Landsat   | Cartography, Intelligence     |
| **Optical Multi**      | Passive (Vis/IR)    | Spectral Reflectance (Bands)           | Sentinel-2, Landsat            | Agriculture, Land Cover       |
| **Hyperspectral**      | Passive (Vis/SWIR)  | Continuous Spectrum ($>100$ bands)     | EnMAP, PRISMA, PACE            | Geology, Water Quality        |
| **Thermal (TIR)**      | Passive (Emission)  | Brightness Temperature ($T\_b$)        | Landsat, Sentinel-3, ECOSTRESS | SST, LST, Fires               |
| **Radiometry (Surface)** | Passive (Microwave) | $T\_b$ (L/C/X Band)                    | SMOS, SMAP                     | Soil Moisture, Salinity       |
| **Atm. Sounding**      | Passive (Microwave) | T/Humidity Profiles (O$\_2$, H$\_2$O)  | AMSU/MHS, TROPICS              | Global Weather Input          |
| **Lidar Altimetry**    | Active (Laser)      | Elevation, Ice Thickness               | ICESat-2, GEDI                 | Ice Mass Balance              |
| **Wind Lidar**         | Active (Doppler)    | LOS Wind (Doppler Shift)               | Aeolus                         | Clear-Air Wind                |
| **Gravimetry**         | Active (SST)        | Gravity Anomalies (Mass)               | GRACE-FO, GOCE                 | Groundwater, Glaciers         |
| **Magnetometry**       | Passive (In-situ)   | Magnetic Field Vector                  | Swarm, DSCOVR                  | Geomagnetic Models            |
| **Lightning (GLM)**    | Passive (Optical)   | Lightning Events                       | GOES-R, MTG                    | Storm Nowcasting              |
| **AIS / ADS-B**        | Passive (RF)        | Ship/Aircraft Position                 | Spire, Aireon                  | Global Tracking               |
| **CubeSat Radar**      | Active (Ka-band)    | Rain Profile                           | RainCube                       | Technology Demonstrator       |
| **Smart LNB**          | Opportunity         | Rain Attenuation                       | NEFOCAST                       | Distributed Rainfall Measurement |

## Conclusion

The analysis of these nineteen categories reveals an increasingly interconnected and multi-physical Earth observation system. The dominant trend is data fusion (_Data Fusion_): the vertical precision of Lidar and Radar is extended horizontally by optical and radiometric constellations. Furthermore, the integration of traditional scientific sensors with commercial opportunity data (GNSS-R, Smart LNB, AIS) is creating a true "Digital Twin" of the planet, capable of quantifying not only the state of the natural environment but also anthropogenic impact in real-time.

## Infographic: Comparison Matrix

<!-- Infografica Page (NEW) -->
<div id="infografica" class="content-page hidden">
  <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Infographic: Comparison Matrix</h1>
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
          <!-- 2. Ottico -->
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
          <!-- 5. Altimetria -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">5. Altimetry</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Active</span></td>
            <td class="px-6 py-4">Radar pulse (nadir)</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Surface height (cm)</td>
          </tr>
          <!-- 6. Radiometri -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">6. Microwave Radiometers</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passive</span></td>
            <td class="px-6 py-4">Thermal emission</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Temperature, humidity</td>
          </tr>
          <!-- 7. Iperspettrale -->
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
          <!-- 9. Gravimetria -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">9. Gravimetry</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Physical</span></td>
            <td class="px-6 py-4">Gravitational field</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Mass/water map</td>
          </tr>
          <!-- 10. Magnetometria -->
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
            <td class="px-6 py-4 font-bold text-gray-900">12. Geo Weather</td>
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
  <p class="mt-4 text-sm text-gray-500 text-right">* Note: ☁️ = Penetrates clouds | 🌙 = Works at night | ❌ = Blocked/Not available</p>
</div>

#### Works cited

1. Parametric Sizing Equations for Earth Observation Satellites | Request PDF - ResearchGate, <https://www.researchgate.net/publication/328159562_Parametric_Sizing_Equations_for_Earth_Observation_Satellites>

2. perspective on Gaussian processes for Earth observation | National Science Review, <https://academic.oup.com/nsr/article/6/4/616/5369430>

3. GNSS radio occultation (GNSS-RO): Lecture 1 – Principles and NWP use - ECMWF Events (Indico), <https://events.ecmwf.int/event/375/contributions/4253/attachments/2310/4039/gnssro_lecture_KL_2024.pdf>

4. A variational regularization of Abel transform for GPS radio occultation - AMT, <https://amt.copernicus.org/articles/11/1947/>

5. GNSS radio occultation excess-phase processing for climate applications including uncertainty estimation - AMT, <https://amt.copernicus.org/articles/16/5217/>

6. GNSS Radio Occultation | Constellation Observing System for Meteorology Ionosphere and Climate - ucar cosmic, <https://www.cosmic.ucar.edu/what-we-do/gnss-radio-occultation>

7. Using the Commercial GNSS RO Spire Data in the Neutral Atmosphere for Climate and Weather Prediction Studies - the NOAA Institutional Repository, <https://repository.library.noaa.gov/view/noaa/58772/noaa_58772_DS1.pdf>

8. Sensing the ionosphere with the Spire radio occultation constellation | Journal of Space Weather and Space Climate, <https://www.swsc-journal.org/articles/swsc/full_html/2021/01/swsc210051/swsc210051.html>

9. Reconnaissance satellite constellations: For enhanced global awareness - Spire, <https://spire.com/blog/space-reconnaissance/reconnaissance-satellite-constellations-for-enhanced-global-awareness/>

10. Space Weather Data from Commercial GNSS RO, <https://www.swpc.noaa.gov/sites/default/files/images/u4/07%20Rob%20Kursinski.pdf>

11. RainCube Demonstrates Miniature Radar Technology to Measure Storms - NASA Science, <https://science.nasa.gov/science-research/science-enabling-technology/technology-highlights/raincube-demonstrates-miniature-radar-technology-to-measure-storms/>

12. FSSCat Overview - ESA Earth Online, <https://earth.esa.int/eogateway/missions/fsscat/description>

13. FSSCat - Earth Online, <https://earth.esa.int/eogateway/missions/fsscat>

14. Synthetic-aperture radar - Wikipedia, <https://en.wikipedia.org/wiki/Synthetic-aperture_radar>

15. Synthetic Aperture Radar (SAR): Principles and Applications - eo4society, <https://eo4society.esa.int/wp-content/uploads/2021/02/D1T2a_LTC2015_Younis.pdf>

16. S1 Applications - SentiWiki - Copernicus, <https://sentiwiki.copernicus.eu/web/s1-applications>

17. Create an Interferogram Using ESA's Sentinel-1 Toolbox | NASA Earthdata, <https://www.earthdata.nasa.gov/learn/data-recipes/create-interferogram-using-esas-sentinel-1-toolbox>

18. InSAR Phase Unwrapping Error Correction for Rapid Repeat Measurements of Water Level Change in Wetlands - LaCoast.gov, <https://www.lacoast.gov/crms/crms_public_data/publications/Oliver-Cabrera%20et%20al%202021.pdf>

19. Unwrapped Interferograms: Creating a Deformation Map | NASA Earthdata, <https://www.earthdata.nasa.gov/learn/data-recipes/unwrapped-interferograms-creating-deformation-map>

20. Sentinel-1 InSAR Product Guide - HyP3, <https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/>

21. Sentinel-1 InSAR Processing using S1TBX - Alaska Satellite Facility, <https://asf.alaska.edu/wp-content/uploads/2019/05/generate_insar_with_s1tbx_v5.4.pdf>

22. Radar Altimetry Principle and Data Processing by M.-H. Rio, <https://ftp.itc.nl/pub/Dragon4_Lecturer_2018/D2_Tue/L1/D2L1-DRAGON_OTC18_Altimetry1_mhr.pdf>

23. Radar Altimetry for remote sensing of the oceans and their impact on climate - ESA Earth Online, <https://earth.esa.int/eogateway/documents/20142/0/01_Tuesday_OCT2013_Cipollini_Altimetry_1.pdf>

24. Using Altimetry service data - EUMETSAT - User Portal, <https://user.eumetsat.int/data/satellites/sentinel-3/altimetry-service>

25. Altimetry Applications - SentiWiki - Copernicus, <https://sentiwiki.copernicus.eu/web/altimetry-applications>

26. Backscatter LIDAR, <https://reef.atmos.colostate.edu/~odell/at652/lecture_2013/lecture8b.pdf>

27. Panchromatic Images Explained | Satellite Bands, Specs & Uses - XrTech Group, <https://xrtechgroup.com/panchromatic-imaging-bands-uses/>

28. Image Fusion for High-Resolution Optical Satellites Based on Panchromatic Spectral Decomposition - PMC, <https://pmc.ncbi.nlm.nih.gov/articles/PMC6603526/>

29. Panchromatic Imagery And Its Band Combinations In Use - EOS Data Analytics, <https://eos.com/make-an-analysis/panchromatic/>

30. Hyperspectral Imaging - arXiv, <https://arxiv.org/html/2508.08107v1>

31. Full article: Hyperspectral and multispectral image fusion addressing spectral variability by an augmented linear mixing model - Taylor & Francis Online, <https://www.tandfonline.com/doi/full/10.1080/01431161.2022.2041762>

32. Introduction to PACE Hyperspectral Observations for Water Quality Monitoring - NASA Applied Sciences, <https://appliedsciences.nasa.gov/sites/default/files/2024-09/PACE_Part1_Final.pdf>

33. SSC19-V-05 - DigitalCommons@USU, <https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=4391&context=smallsat>

34. EnMAP, <https://www.enmap.org/>

35. Mission - EnMAP, <https://www.enmap.org/mission/>

36. Passive Microwave, <https://topex.ucsd.edu/rs/Passive_Microwave.pdf>

37. SMOS - ESA Earth Online - European Space Agency, <https://earth.esa.int/eogateway/missions/smos>

38. AMSR2 Overview NESDIS Operational Soil Moisture Products - Office of Satellite and Product Operations - NOAA OSPO, <https://www.ospo.noaa.gov/products/land/smops/sensors_AMSR2.html>

39. SMOS (Soil Moisture and Ocean Salinity) Mission - eoPortal, <https://www.eoportal.org/satellite-missions/smos>

40. Microwave radiometer to retrieve temperature profiles - AMT, <https://amt.copernicus.org/preprints/6/2857/2013/amtd-6-2857-2013.pdf>

41. ICESat-2: Home, <https://icesat-2.gsfc.nasa.gov/>

42. Counting on NASA's ICESat-2, <https://icesat-2.gsfc.nasa.gov/articles/counting-nasas-icesat-2>

43. IceSat 2 ATLAS photon-counting receiver - initial on-orbit performance - NASA Technical Reports Server, <https://ntrs.nasa.gov/api/citations/20200001212/downloads/20200001212.pdf>

44. Signal Photon Extraction Method for ICESat-2 Data Using Slope and Elevation Information Provided by Stereo Images - PubMed Central, <https://pmc.ncbi.nlm.nih.gov/articles/PMC10649317/>

45. Aeolus Objectives - ESA Earth Online, <https://earth.esa.int/eogateway/missions/aeolus/objectives>

46. First validation of Aeolus wind observations by airborne Doppler wind lidar measurements, <https://amt.copernicus.org/articles/13/2381/2020/>

47. The ESA ADM-Aeolus Doppler Wind Lidar Mission – Status and validation strategy - ECMWF, <https://www.ecmwf.int/sites/default/files/elibrary/2016/16851-esa-adm-aeolus-doppler-wind-lidar-mission-status-and-validation-strategy.pdf>

48. Gravity Recovery and Climate Experiment (GRACE) - NASA Sea Level Change Portal, <https://sealevel.nasa.gov/missions/grace>

49. GRACE-FO - Gravity Recovery and Climate Experiment Follow-On - Center for Space Research, <https://www2.csr.utexas.edu/grace/RL061LRI.html>

50. Satellite Gravimetry – Measuring Earth's Gravity Field from Space - IAG - Geodesy, <https://geodesy.science/item/satellite-gravimetry/>

51. In-flight calibration of the fluxgate magnetometer on Macau Science Satellite-1, <https://www.eppcgs.org/article/doi/10.26464/epp2025067>

52. A miniature two-axis fluxgate magnetometer - NASA Technical Reports Server, <https://ntrs.nasa.gov/api/citations/19700008650/downloads/19700008650.pdf>

53. Types of magnetometers, uses and characteristics | AV3 AEROVISUAL, <https://av3aerovisual.com/en/types-of-magnetometers-uses-and-characteristics/>

54. Deep Space Climate Observatory (DSCOVR) - National Centers for Environmental Information - NOAA, <https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.stp.swx:satellite-systems_dscovr>

55. It's all systems go for NOAA's first space weather satellite, <https://www.noaa.gov/its-all-systems-go-noaas-first-space-weather-satellite>

56. GOES-R Post Launch Test | NASA Earthdata, <https://www.earthdata.nasa.gov/data/projects/goes-r-plt>

57. GOES-R Terrestrial Weather (ABI/GLM) - National Centers for Environmental Information, <https://www.ncei.noaa.gov/products/goes-terrestrial-weather-abi-glm>

58. GOES-R Series Data Book, <https://www.goes-r.gov/downloads/resources/documents/GOES-RSeriesDataBook.pdf>

59. Sotdma vs cstdma: understanding key differences for maritime communication - BytePlus, <https://www.byteplus.com/en/topic/560464>

60. AIS Know-How: Data transfer (SOTDMA vs. CSTDMA), <https://defender.com/assets/pdf/simrad/sotdma_cstdma_comparison.pdf>

61. RainCube: the first ever radar measurements from a CubeSat in space - SPIE Digital Library, <https://www.spiedigitallibrary.org/journals/journal-of-applied-remote-sensing/volume-13/issue-3/032504/RainCube--the-first-ever-radar-measurements-from-a-CubeSat/10.1117/1.JRS.13.032504.full>

62. RainCube - NASA ESTO, <https://esto.nasa.gov/wp-content/uploads/2020/07/RainCube.pdf>

63. Real-Time Rain Rate Evaluation via Satellite Downlink Signal Attenuation Measurement - PubMed Central, <https://pmc.ncbi.nlm.nih.gov/articles/PMC5580102/>

64. SmartLNB for weather forecasting - Nefocast, <http://www.nefocast.it/news/smartlnb-for-weather-forecasting/>

65. Improving Analysis and Prediction of Tropical Cyclones by Assimilating Radar and GNSS-R Wind Observations: Ensemble Data Assimilation and Observing System Simulation Experiments Using a Coupled Atmosphere–Ocean Model, <https://journals.ametsoc.org/view/journals/wefo/37/9/WAF-D-21-0202.1.xml>

66. NASA/University of Michigan - CYGNSS Handbook <https://cygnss.engin.umich.edu/wp-content/uploads/sites/534/2021/07/148-0138-ATBD-L2-Wind-Speed-Retrieval-R6_release.pdf>
