# InSAR: When SAR is not enough

A few years ago, during a university project on the flood that struck Emilia-Romagna in May 2023, I got my hands on Sentinel-1 data. At the time, the goal was to distinguish the water that appeared after the event from "permanent water bodies" (lakes, rivers, etc.) and to understand how much preprocessing—specifically thermal noise removal—influenced the final result.

In that work, the absolute protagonist was **backscatter**. I was looking at how much energy returned to the satellite, how it changed between two acquisitions, and what I could deduce about the observed surface. The signal phase was there, of course, but it remained behind the scenes.

Then you start studying InSAR and discover that this secondary feature is actually capable of something quite surprising: measuring ground displacements on the order of centimeters—and, in well-constructed time series, millimeters—from hundreds of kilometers away.

The interesting point is that the satellite doesn't suddenly become more precise. It is still the same radar. We are simply asking it a different question.

So, let's take a step back. Before talking about interferograms, colored fringes, Persistent Scatterers, and time series, it is worth understanding what a SAR pixel actually contains.

---

## The same pixel tells two stories

A radar image does not start as a black-and-white photograph. In **SLC (Single Look Complex)** products, every pixel is a complex number and can be described by two quantities: **amplitude** and **phase**.

To simplify, amplitude tells us how strong the signal returned to the antenna is. From this, we derive intensity and, after radiometric calibration, quantities like sigma naught, which are used to analyze surface backscatter.

Phase, on the other hand, tells us *where* we are within the cycle of the received electromagnetic wave.

This distinction seems harmless. In reality, it separates two application worlds.

With amplitude, I can observe that water tends to return a weak signal to the radar when the surface is relatively smooth and specularly reflects energy away from the sensor. I can therefore use it for flood mapping, classification, change detection, and a host of other applications.

With phase, I can compare two acquisitions and notice that the distance between the satellite and the ground has changed by a tiny fraction of the wavelength.

And this is where InSAR begins.

> **Definition — SAR**  
> **Synthetic Aperture Radar** is an active radar: it illuminates the surface with microwaves and measures the signal returning to the sensor. The movement of the platform along its orbit is used to synthesize an antenna much larger than the one physically available, achieving an azimuth resolution much finer than that of a real-aperture radar.

Sentinel-1 operates in **C-band at 5.405 GHz**, which corresponds to a wavelength of approximately **5.55 cm**. The primary mode over land is **Interferometric Wide Swath**, or IW: approximately **250 km of swath** with a nominal resolution of **5 × 20 m**. The mode's name is not accidental: the mission was designed to allow for systematic interferometry over large areas.[^s1-facts] [^s1-instrument]

> **Remember — Why is an SLC product needed?**  
> To perform interferometry, knowing the intensity of the radar response is not enough. You must preserve the complex information, which includes the phase. GRD products have already been detected and do not retain the phase necessary to construct an interferogram.[^s1-products]

---

## Phase is not distance

It is worth pausing here for a moment, as this is one of the points where people stumble most easily.

If the radar receives a wave with a certain phase, **it cannot derive the absolute distance of the target from that phase alone**. The phase is observed modulo \(2\pi\): after one full cycle, we are back at the same point.

It is a bit like looking only at the second hand of a clock. If it points to 15, you know its position, but you cannot know if 15 seconds, 75 seconds, or 135 seconds have passed without additional information.

InSAR bypasses this problem by comparing acquisitions of the **same area**, taken with a sufficiently similar geometry at different times.

If the target has moved along the satellite-to-ground direction between the two acquisitions, the distance traveled by the wave changes. And the phase changes.

For a change in distance along the **Line of Sight (LOS)**, the fundamental relationship is:

$$
\Delta \phi_{def} = \frac{4\pi}{\lambda}\,d_{LOS}
$$

The factor of 4, instead of the 2 we might expect at first glance, comes from the round trip of the signal: if the ground moves by \(d\), the radar path changes by \(2d\).

From this equation follows a very useful consequence:

$$
2\pi \quad \longleftrightarrow \quad \frac{\lambda}{2}
$$

For Sentinel-1, \(\lambda/2\) is approximately **2.8 cm**.

Let’s keep that in mind. It will reappear shortly in the context of central Italy.

> **Definition — Line of Sight (LOS)**  
> InSAR does not directly measure "how much the ground has dropped" or "how much it has moved eastward." It measures the **projection of the three-dimensional displacement along the line connecting the satellite to the target**. This is a subtle distinction on paper, but a decisive one when interpreting results.

---

## Two images are not enough: they must also "talk" to each other

Let’s take two SAR acquisitions of the same area. To build an interferogram, the pixels we are comparing must refer to the same ground targets with very high precision. The first serious step is therefore **co-registration**.

Next, the complex signal of the two images is combined by multiplying one image by the complex conjugate of the other. What we are interested in is the phase difference.

So far, it might seem almost too easy.

The problem is that the satellite does not pass over the exact same point in space again. The distance between the two orbits is described by the **interferometric baseline**, which can be broken down into different components; due to sensitivity to topography and geometric decorrelation, the **perpendicular baseline** is particularly important.

Sentinel-1 benefits from very tight orbital control precisely because repeat-pass interferometry requires similar geometries to maintain good coherence between acquisitions.[^s1-baseline]

> **Definition — InSAR**  
> **Interferometric Synthetic Aperture Radar** refers to the set of techniques that exploit the phase difference between two or more SAR acquisitions to derive information about topography and/or surface deformation.[^nasa-handbook]

When the goal is to isolate deformation by removing the topographic contribution, we enter more precisely into the territory of **Differential InSAR, or DInSAR**.

---

## Those colored fringes are not just decoration

On August 24, 2016, an earthquake struck central Italy. ESA and CNR-IREA combined Sentinel-1 acquisitions taken before and after the event to build an interferogram of the deformed area.

**Seven interferometric fringes** appeared in the image. ESA quantified their meaning in an almost didactic way: the seven fringes corresponded to approximately **20 cm of deformation along the radar's line of sight**, while each full color cycle represented about **2.8 cm of displacement**.[^italy-august]

There it is again, our \(\lambda/2\).

An interferogram normally displays the *wrapped* phase, meaning it is confined to a range of \(2\pi\). When the phase exceeds the limit, the color cycle restarts. Each full rotation is a fringe.

This is why, if you look at a co-seismic interferogram, those concentric bands look a bit like the contour lines on a topographic map. Except they aren't counting meters of elevation: they are counting phase cycles.

> **Real-world case — Central Italy, August 2016**  
> Sentinel-1B acquired the area on August 20, and Sentinel-1A on August 26, two days after the August 24 earthquake. In the interferogram published by ESA, seven full cycles corresponded to approximately 20 cm of LOS deformation. It is one of the cleanest cases for visually connecting phase, fringes, and displacement.[^italy-august]

However, there is one detail that must not be lost: **counting fringes does not automatically give you the three-dimensional displacement of the ground**. We are always observing a projection along the LOS.

We will return to this shortly.

---

## The interferogram contains more than we want

At this point, we might be tempted to say: phase difference equals deformation.

And that is where we run into trouble.

The interferometric phase is not a gauge that directly returns movement. It is a sum of contributions. A useful way to think about it is:

$$
\Delta \phi =
\Delta \phi_{def}
+ \Delta \phi_{topo}
+ \Delta \phi_{orb}
+ \Delta \phi_{atmo}
+ \Delta \phi_{scatt}
+ \Delta \phi_{noise}
$$

InSAR literature separates the contribution of **deformation** from that of residual topography, orbital errors, the atmosphere, scattering changes, and noise.[^phase-components]

Our job consists of removing, modeling, or reducing everything that is not the signal we are looking for.

### Topography

Two slightly different orbits "see" the terrain with different geometries, and this introduces a phase contribution. In DInSAR, a **Digital Elevation Model** is used to simulate the topographic component and subtract it. If the DEM contains errors, a portion of that contribution remains and behaves as residual topography.

### The atmosphere

The radar signal travels through the atmosphere twice. Variations in pressure, temperature, humidity, and the ionosphere's electron content alter the propagation delay. If conditions differ between acquisitions, the discrepancy can end up in the interferogram and appear as movement.[^atmosphere]

### Orbits

Imperfectly known orbits leave behind ramps and large-scale artifacts. This is why precise orbits and geometric modeling are so important.

### The target itself

If the way a radar cell scatters energy changes between two acquisitions—due to vegetation growth, the appearance of snow, wet soil, or a landslide that alters the surface—the phase can become unstable.

This is where a term that constantly recurs in InSAR comes into play: **coherence**.

---

## Coherence: when two acquisitions recognize each other

**Interferometric coherence** measures the stability of the complex relationship between two acquisitions. It is typically expressed on a scale from **0 to 1**: values close to 1 indicate strong interferometric correlation, while low values indicate that the phase has become unreliable for estimating deformation.[^nasa-coherence]

Stated this way, it sounds like a mere quality indicator. In reality, it is more interesting than that.

Coherence can decrease because the orbits are too different, because too much time has passed, because the terrain has changed, because vegetation has moved, because snow has appeared, or because surface humidity has changed. In its Sentinel-1 coherence pipeline, ESA explicitly cites vegetation dynamics, snow cover, moisture, and mass movements as causes of temporal decorrelation.[^apex-coherence]

In other words, low coherence can tell you that your interferogram is unreliable. But it can also tell you that **something happened on the surface**.

It is easy to forget this dual nature.

> **Real-world case — Kåfjord, Norway**  
> Two Sentinel-1A acquisitions from August 30 and September 23, 2014, were combined to observe a landslide in the municipality of Kåfjord, in Troms County. In the 24 days between the two acquisitions, the ground had moved by approximately **1 cm**. This case is interesting because it shows InSAR not as a snapshot of an impulsive event, but as a tool for tracking slow slope movements.[^kafjord]

> **Caution — A fast landslide can be more difficult than a slow one**  
> If an event alters the surface too much between two acquisitions, the scattering mechanisms may change to the point where coherence is lost. Therefore, InSAR does not follow a simple "the larger the movement, the easier it is to measure" rule. Velocity, the spatial gradient of the deformation, geometry, and scattering stability all matter. In some cases, the loss of coherence itself becomes useful information for delineating the affected area.

---

## Wrapped, unwrapped, and the clock problem

Let’s return for a moment to our second hand.

The observed phase is wrapped: we know the position within the cycle, but we don't know how many full rotations have occurred. To move from an interferogram to a continuous displacement map, we must reconstruct those multiples of \(2\pi\).

This is **phase unwrapping**.

The idea seems simple: if one pixel is nearly \(+\pi\) and the adjacent one is nearly \(-\pi\), a massive physical jump likely didn't occur; we have simply crossed the conventional boundary of the phase interval.

In reality, however, phase unwrapping can become one of the most delicate steps in the processing chain. Noise, low coherence, and strong deformation gradients can produce errors of an entire multiple of \(2\pi\). And with Sentinel-1, a one-cycle error translates to an error of approximately 2.8 cm in the LOS (Line of Sight).

> **Definition — Phase unwrapping**  
> This is the process of reconstructing a continuous phase from the phase observed modulo \(2\pi\) by estimating how many full cycles must be added to the various pixels. An incorrect unwrapping does not just introduce minor noise: it can shift entire zones by one or more cycles.

This is why the coherence map is not just an ornamental attachment to the interferogram. It tells you where you are asking the algorithm to reconstruct a history based on robust clues, and where, conversely, you are asking it to essentially guess.

---

## The satellite only sees the shadow of the movement

Imagine a target that moves 10 cm to the east. The satellite does not measure "10 cm to the east." It measures how much of that vector falls along its line of sight.

The same movement observed from a different geometry produces a different measurement.

**Ascending** and **descending** orbits are therefore invaluable because they observe the same area from different sides. Sentinel-1 follows a near-polar orbit and looks sideways: by combining different geometries, we can much better separate the vertical and east-west components, while sensitivity to the north-south component remains intrinsically weaker.

The central Italy earthquake of October 30, 2016, is an almost perfect example.

Experts from CNR-IREA and INGV, by analyzing Sentinel-1 radar acquisitions, reconstructed a picture in which the area near **Montegallo** had shifted about **40 cm eastward**, the **Norcia** area about **30 cm westward**, while around **Castelluccio** the ground had subsided by up to about **60 cm**. Near Norcia, an uplift of about **12 cm** was also estimated.[^italy-october]

If we had looked at only a single LOS, we would have obtained a projection of this story. By combining different geometries, the picture becomes much more readable.

> **Real-world case — Norcia and Castelluccio, October 2016**  
> This case is useful because it shifts the reasoning from the question "how much did it move?" to the correct question: **"how much did it move, and in what direction relative to the geometry I am using to observe it?"**[^italy-october]

> **Interview question**  
> Why don't ascending + descending orbits automatically return the complete 3D vector?  
> Because near-polar SAR geometries have very limited sensitivity to the north-south component. In the absence of additional information, robust decomposition primarily concerns the vertical and east-west components.

---

## An interferogram is a photograph. A time series is a movie

A single interferogram can be spectacular after an earthquake. But if I need to monitor the subsidence of a city, a slow-moving landslide, or the stability of infrastructure, the point is not to know what happened between Tuesday and Sunday.

I want to understand **how the movement evolves over time**.

This is where **multi-temporal InSAR** techniques come in.

The two families that appear most often are **Persistent Scatterer Interferometry (PSI)** and **Small Baseline Subset (SBAS)** approaches. The boundary between families and implementations is not always clear—many variants and hybrid techniques have emerged over the years—but the underlying intuition is quite clear.[^tsinsar-review]

### Persistent Scatterer Interferometry

PSI looks for targets whose phase response remains stable throughout a long sequence of acquisitions: the **Persistent Scatterers**.

In urban environments, these are often buildings, metal structures, bridges, or other point targets that continue to behave consistently over time. Once identified, we can separately model deformation, atmosphere, residual topographic errors, and other contributions to reconstruct an average velocity and a time series for each point.[^psi-review]

### Small Baseline Subset

SBAS approaches, on the other hand, build a network of interferograms by choosing pairs with **relatively small temporal and spatial baselines**, precisely to reduce decorrelation. The network is then inverted to reconstruct the temporal evolution of the displacement.[^sbas-hpc]

A useful simplification is this: PSI focuses on the stability of persistent targets; SBAS focuses on a network of interferometric pairs chosen to contain decorrelation. In modern practice, however, tools and ideas can cross-pollinate, and many pipelines also work with **Distributed Scatterers**, i.e., homogeneous groups of pixels that do not behave like a single point scatterer but still contain exploitable interferometric information.[^ds-review]

> **Definition — Persistent Scatterer**  
> A radar target that maintains interferometric characteristics sufficiently stable over time to be used to estimate deformation and other parameters through a series of acquisitions.

> **Definition — Distributed Scatterer**  
> A region composed of multiple scatterers with statistically similar properties. Taken individually, a pixel may not have the stability of a PS; however, by appropriately treating a homogeneous set of pixels, useful interferometric information can be recovered.[^ds-review]

---

## When InSAR stops being an experiment and becomes a service

Up to this point, we have reasoned as if we were building an analysis for a single study area.

Then comes the **European Ground Motion Service**, EGMS, and the scale changes completely.

EGMS is the Copernicus Land Monitoring Service's service that uses InSAR data derived from Sentinel-1 to measure ground movements in Europe. The products are updated annually; in the Basic product, each measurement point is associated with an average LOS velocity, quality indicators, and a displacement time series.[^egms-overview] [^egms-basic]

The technical specification claims a **mean velocity resolution better than 1 mm/year** and, for certain classes of points, standard deviations on the order of a millimeter per year.[^egms-spec]

What is interesting, especially if we want to understand how a scientific activity becomes operational, is the organization of the service.

In 2024, **e-GEOS became the Group Leader of the ORIGINAL consortium**, tasked by the European Environment Agency with the end-to-end implementation and operation of EGMS for the **2024-2028** period. The service uses Sentinel-1 data and, according to e-GEOS, also leverages **Leonardo’s davinci-1 HPC infrastructure** to support production on a continental scale.[^egeos-egms]

This transition seems to me one of the most interesting parts of the entire story. InSAR is no longer just an algorithm that produces a nice interferogram: it becomes an **industrial data chain** with requirements for quality, reproducibility, updates, computing infrastructure, and product distribution.

### Basic, Calibrated, Ortho

EGMS distributes three levels that also help clarify the geometry of the measurement.

| Product | Contents |
|---|---|
| **Basic (L2a)** | LOS displacement measurements, relative to a local reference, with time series and quality metrics. |
| **Calibrated (L2b)** | LOS measurements calibrated to a GNSS-derived reference, making them comparable within a common reference system. |
| **Ortho (L3)** | Two components that are easier to interpret: **vertical** and **east-west**, obtained by combining ascending and descending geometries and using GNSS information to manage the weak north-south sensitivity. |

Copernicus documentation highlights this very point: the Ortho product combines different look-angles and returns vertical and east-west layers on a 100 m grid.[^egms-levels] [^egms-ortho]

---

## Metro C: a few millimeters beneath a massive city

There is one case that perfectly illustrates the leap from theory to the real city.

In October 2025, while discussing e-GEOS geospatial applications, **Emanuele Mele, Head of InSAR Service**, cited the monitoring of **Rome’s Metro C**. During construction, interferometric monitoring was carried out to check for ongoing deformations and to observe **ground subsidence and compaction in the excavation zones beneath the urban fabric**.[^metro-c]

Here, the way we interpret the data also changes.

After an earthquake, we look for a sudden deformation that appears between two time periods. Beneath a city, however, we want to understand if an apparently stationary point is following a slow trend, if it is accelerating, if it shows a discontinuity, and if that dynamic coincides with a construction phase or another cause.

The time series matters more than the single number.

> **Real-world case — Metro C, Rome**  
> InSAR becomes a tool for monitoring the consequences of a major work in the urban underground. The value lies not only in the precision of the measurement but in the ability to observe many points simultaneously and track them over time without installing a physical sensor on each one.[^metro-c]

And it is perhaps here that we best see what makes remote sensing special: it does not automatically replace ground-based measurements, but it radically changes **the scale at which we can decide where to look**.

---

## Not all radars speak with the same voice

Sentinel-1 is an excellent starting point, but it is not the only SAR system we encounter in interferometric applications. Changing missions means changing bands, wavelengths, resolutions, revisit times, available geometries, acquisition policies, and costs.

A table helps organize this.

| Mission | Band | Frequency / Wavelength | A useful trait to remember |
|---|---|---|---|
| **Sentinel-1** | C | 5.405 GHz, \(\lambda\) ≈ 5.55 cm | IW: 250 km swath, 5 × 20 m; systematic acquisitions and open Copernicus data. |
| **COSMO-SkyMed / CSG** | X | X-band | High resolution and great operational flexibility; CSG offers, for example, 3 × 3 m nominal Stripmap. |
| **RADARSAT-2 / RCM** | C | 5.405 GHz, \(\lambda\) ≈ 5.55 cm | Canadian tradition in C-band; RADARSAT-2 offers multiple polarizations and various imaging modes. |
| **SAOCOM** | L | 1.275 GHz, \(\lambda\) ≈ 23.5 cm | Wavelength much longer than C/X band; the Argentine mission is also designed for soil moisture applications. |

The specifications are provided by the respective space agencies.[^s1-facts] [^csg-spec] [^radarsat-spec] [^saocom-spec]

The wavelength is not just a catalog detail.

Generally speaking, a shorter **X-band** wavelength can offer high sensitivity to small changes and high resolution, but it tends to be more vulnerable to decorrelation when the scene changes. The much longer **L-band** interacts more deeply with vegetation and often maintains coherence for longer periods in vegetated areas. The **C-band** sits in the middle and, with Sentinel-1, has primarily benefited from the enormous advantage of a systematic acquisition policy and very wide coverage.

That said, reducing the choice of sensor to the band alone would be a mistake. Revisit time, resolution, polarization, incidence angle, acquisition availability, baseline, and scene geometry can be just as important.

> **Interview question**  
> "Why should I choose COSMO-SkyMed instead of Sentinel-1?"  
> A good answer does not start with "X-band is better." It starts with the requirements: resolution, observation frequency, area to be covered, target type, temporal stability, available geometries, and budget constraints. Only then do you choose the sensor.

---

## An Italian example in X-band: The Sibari Archaeological Park

In 2024, e-GEOS reported on a project for the **Sibari Archaeological Park**, an area exposed to both ground instability and hydraulic risk related to the flooding of the Crati river.

To address the risk of instability, a monitoring chain based on **InSAR methodology and COSMO-SkyMed data** was set up; displacement information is then made available through visualization and query services on Leonardo's data intelligence platform.[^sibari]

This is a useful case because it brings together several pieces of the puzzle: X-band, repeated monitoring, an operational chain, and an end-user who does not need "an interferogram," but rather readable information to decide how to protect a site.

The final product rarely coincides with the technique that generated it.

---

## From SLC to deformation map

At this point, it makes sense to outline a typical processing chain. The details vary between SNAP, ISCE, GAMMA, SARscape, MintPy, LiCSBAS, and proprietary pipelines, but the general logic remains recognizable.

1. **Selection of acquisitions** compatible in terms of geometry, orbit, mode, and polarization.
2. **Acquisition of SLC products** and precise orbital information.
3. **Co-registration** of images onto the same radar geometry.
4. **Interferogram formation** and coherence estimation.
5. **Removal of the topographic phase**, typically using a DEM.
6. **Interferometric filtering** when appropriate, to reduce phase noise without destroying the signal.
7. **Phase unwrapping** in areas where the phase is sufficiently reliable.
8. **Conversion of phase to LOS displacement** and selection of a consistent spatial reference.
9. **Geocoding and validation** against external data, GNSS, leveling, inventories, or knowledge of the phenomenon.
10. If many acquisitions are available, **estimation of the time series**, Atmospheric Phase Screen, velocities, and other model parameters.

With Sentinel-1 IW, specific aspects of the TOPS mode are added: burst and sub-swath management, highly accurate azimuthal co-registration, and debursting. This is one of the reasons why an operational pipeline requires much more than the sequence of buttons we might learn in a tutorial.

> **Deeper dive — What are we trying to isolate?**  
> At the end of the chain, we want the residual phase to be dominated by \(\Delta\phi_{def}\). Everything else—residual topography, orbit, atmosphere, unstable scattering, and noise—is something to be modeled, estimated, filtered, or at least quantified.

---

## Back to Emilia-Romagna

At this point, I can return to the project I started with.

In flood mapping with Sentinel-1, I was interested in observing how the **backscatter** changed between acquisitions and how preprocessing influenced the separation between flooded surfaces and permanent water. I had worked with calibration, multilooking, thermal noise removal, terrain correction, and change detection.

If I wanted to use the same acquisitions for an InSAR problem, however, the question would change completely.

| SAR flood mapping | InSAR for deformation |
|---|---|
| The core information is **amplitude/backscatter**. | The core information is **phase difference**. |
| I can work with detected products like GRD. | I need the complex phase, so typically **SLC**. |
| I am looking for a change in the electromagnetic properties of the surface. | I am looking for a change in distance along the **LOS**. |
| A surface that changes significantly may be the very signal I am looking for. | A surface that changes significantly may destroy coherence and prevent me from measuring the phase. |
| Terrain correction is used to correctly map the data into geographic space. | The DEM is also used in modeling and removing the **topographic phase**. |
| Comparison can be performed on calibrated intensities. | I must co-register complex signals with high precision and manage wrapping/unwrapping. |

It is the same satellite mission. Often, it is even the same scene.

But we are interrogating the data in different ways.

This, in my opinion, is the key to not viewing SAR and InSAR as two independent chapters of a manual. The pixel is always the same. What changes is the part of the signal we choose to listen to.

---

## When InSAR is not the right answer

By this point, it is easy to fall in love with the technique. This often happens with elegant tools: as soon as we learn how they work, we start seeing them as the natural solution to every problem.

It is best to get vaccinated against this early on.

InSAR suffers when the surface changes too rapidly between acquisitions, when vegetation cover destroys phase stability, when snow and humidity alter electromagnetic behavior, when movement is oriented almost perpendicularly to the LOS, or when the spatial gradient of the deformation is so strong that it makes unwrapping ambiguous.

A very rapid landslide can therefore be **less** measurable with DInSAR than a slow, continuous deformation. A movement that is almost north-south may be significant on the ground but nearly invisible in SAR geometry. Unfavorable atmospheric conditions can create patterns that look like deformations. A building can be an excellent Persistent Scatterer, while the lawn next to it becomes almost silent.

The point is not to memorize a list of limitations. It is to learn how to formulate the right question before processing:

> **Do the geometry, time scale, and surface type allow me to observe the phenomenon I am looking for?**

If the answer is no, no downstream algorithm can recover information that the sensor did not measure in a usable way.

---

## If I have truly understood it, I should be able to answer these questions

This section is almost a personal test. If an answer requires going back to the definitions, that is perfectly fine: it means we have found a point that needs reviewing.

1. Why do I need an SLC product for an interferogram, and why is a GRD not enough?
2. Why does a full phase cycle correspond to $\lambda/2$ of LOS displacement and not $\lambda$?
3. What contributions, besides deformation, enter into the interferometric phase?
4. What does coherence tell me, and why does low coherence not always just mean "bad data"?
5. Why does an urban surface often tend to offer more Persistent Scatterers than a cultivated field?
6. Why can a large movement be more difficult to measure than a small one?
7. What does it mean to say that InSAR measures along the LOS?
8. What do I gain by combining ascending and descending orbits, and which component remains difficult to observe?
9. What is the intuition that separates PSI and SBAS?
10. If I had to choose between Sentinel-1, COSMO-SkyMed, and SAOCOM, which requirements would I look at before even talking about the band?
11. Why is a service like EGMS also a problem of data engineering and High Performance Computing, in addition to remote sensing?
12. How does my old Sentinel-1 flood mapping workflow resemble an InSAR pipeline, and how, instead, does it change radically?

If these questions become a conversation and stop feeling like an interrogation, the bulk of the work is likely done.

---

## Wrapping up

The part I find most fascinating about InSAR is that the final result seems almost disproportionate to the starting information.

We have a radar that sends out a wave, waits for an echo, and records a complex number. Then we have the satellite pass over again, compare two phases that are ambiguous on their own, remove the topography, try to understand what the atmosphere did, discard the areas that lost coherence, reconstruct the phase cycles, and project everything along a geometry that almost never coincides with the direction we are actually interested in.

It seems like a fragile house of cards.

Yet, this "castle" is exactly what yields the centimeters of displacement from the Amatrice earthquake, the centimeter of movement on a Norwegian hillside, the time series of an entire continent, and the ability to track subsidence above subway excavations.

Perhaps that is the point. InSAR is not powerful because it eliminates ambiguity. It is powerful because **it models it well enough to turn it into a measurement**.

And when you look at a Sentinel-1 image again after understanding this, that pixel is no longer just light or dark.

It also has a memory.

---

## Sources and further reading

[^s1-facts]: European Space Agency, **Sentinel-1 — Facts and figures**. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Facts_and_figures

[^s1-instrument]: European Space Agency, **Sentinel-1 — Instrument**. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Instrument

[^s1-products]: Copernicus Sentinel-1, **Product Definition / Level-1 products**. SLC products are complex and preserve both amplitude and phase; GRD products are detected. https://sentinels.copernicus.eu/documents/247904/1877131/Sentinel-1-Product-Definition.pdf

[^s1-baseline]: Copernicus Sentinel-1 Mission Performance Centre, **Sentinel-1A & Sentinel-1B Annual Performance Report 2018**, section on interferometric baseline. https://sentinels.copernicus.eu/documents/247904/3406423/Sentinel-1-Annual-Performance-Report-2018.pdf

[^nasa-handbook]: NASA Earthdata, **SAR Handbook — Chapter 2: Spaceborne Synthetic Aperture Radar**, section on the principles of Interferometric SAR. https://earthdata.nasa.gov/s3fs-public/2025-04/SARHB_CH2_Content.pdf

[^italy-august]: European Space Agency, **Italy earthquake displacement**, August 26, 2016. https://www.esa.int/ESA_Multimedia/Images/2016/08/Italy_earthquake_displacement

[^phase-components]: Pepe, A. & Calò, F., **A Review of Interferometric Synthetic Aperture RADAR (InSAR) Multi-Track Approaches for the Retrieval of Earth's Surface Displacements**, *Applied Sciences*, 2017. https://www.mdpi.com/2076-3417/7/12/1264

[^atmosphere]: Ding, X. et al., **Atmospheric Effects on InSAR Measurements and Their Mitigation**, *Sensors*, 2008. https://www.mdpi.com/1424-8220/8/9/5426

[^nasa-coherence]: NASA Earthdata GIS, **Interferometric Coherence** — description of the OPERA displacement product. Coherence is described as a measure of the similarity of radar phase between two acquisitions, ranging from 0 to 1. https://gis.earthdata.nasa.gov/gis05/rest/services/DISASTERS_202606_EARTHQUAKE_VENEZUELA/202611_opera_displacement/ImageServer

[^apex-coherence]: ESA APEx Algorithm Catalogue, **Sentinel-1 Coherence**. https://algorithm-catalogue.apex.esa.int/apps/sentinel1_sar_coherence

[^kafjord]: European Space Agency, **Landslide risk monitoring with Sentinel-1**, March 27, 2015. https://www.esa.int/ESA_Multimedia/Images/2015/03/Landslide_risk_monitoring_with_Sentinel-1

[^italy-october]: European Space Agency, **Sentinel satellites reveal east–west shift in Italian quake**, November 3, 2016. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Sentinel_satellites_reveal_east_west_shift_in_Italian_quake

[^tsinsar-review]: Osmanoğlu, B. et al., **Radar Interferometry: 20 Years of Development in Time Series Techniques and Future Perspectives**, *Remote Sensing*, 2020. https://www.mdpi.com/2072-4292/12/9/1364

[^psi-review]: Crosetto, M. et al., **An Approach to Persistent Scatterer Interferometry**, *Remote Sensing*, 2014. https://www.mdpi.com/2072-4292/6/7/6662

[^sbas-hpc]: Zinno, I. et al., **High Performance Computing in Satellite SAR Interferometry: A Critical Perspective**, *Remote Sensing*, 2021. https://www.mdpi.com/2072-4292/13/23/4756

[^ds-review]: Even, M. & Schulz, K., **InSAR Deformation Analysis with Distributed Scatterers: A Review Complemented by New Advances**, *Remote Sensing*, 2018. https://www.mdpi.com/2072-4292/10/5/745

[^egms-overview]: Copernicus Land Monitoring Service, **European Ground Motion Service**. https://land.copernicus.eu/en/products/european-ground-motion-service

[^egms-basic]: Copernicus Land Monitoring Service, **European Ground Motion Service: Basic**. https://land.copernicus.eu/en/products/european-ground-motion-service/egms-basic

[^egms-spec]: Copernicus Land Monitoring Service, **EGMS Product Description and Format Specification**. https://library.land.copernicus.eu/products/European_Ground_Motion_Service_Product_Description_v3.html

[^egeos-egms]: e-GEOS, **Rilevare e misurare i movimenti del terreno dallo Spazio: e-GEOS alla guida del progetto europeo**, July 18, 2024. https://www.e-geos.it/press-release/rilevare-e-misurare-i-movimenti-del-terreno-dallo-spazio-e-geos-alla-guida-del-progetto-europeo/

[^egms-levels]: Copernicus Land Monitoring Service, **What European Ground Motion Service products are made available to the user?** https://land.copernicus.eu/en/faq/products/european-ground-motion-service/what-products-are-made-available-to-the-user

[^egms-ortho]: Copernicus Land Monitoring Service, **EGMS Explorer Manual / Ortho product description**. https://land.copernicus.eu/en/technical-library/egms-end-user-interface-manual/@@download/file

[^metro-c]: Telespazio, **Smart city: satellite data to manage the metropolises of the future**, October 7, 2025. Presentation by Emanuele Mele, Head of InSAR Service at e-GEOS. https://www.telespazio.com/it/focus-detail/-/detail/space-panorama-episodio-4

[^csg-spec]: Italian Space Agency (ASI), **COSMO-SkyMed Second Generation — System and Products Description**. https://www.asi.it/wp-content/uploads/2021/02/CSG-Mission-and-Products-Description_issue-A-1.pdf

[^radarsat-spec]: Canadian Space Agency, **RADARSAT satellites: Technical comparison**. https://www.asc-csa.gc.ca/eng/satellites/radarsat/technical-features/radarsat-comparison.asp

[^saocom-spec]: CONAE, **SAOCOM Mission Products Definition**. https://catalogos.conae.gov.ar/Catalogo/docs/SAOCOM/SAOCOM%20Mission%20Products%20Definition.pdf

[^sibari]: e-GEOS, **International Day for Monuments and Sites 2024** — monitoring the Sibari Archaeological Park with InSAR and COSMO-SkyMed. https://www.e-geos.it/news-stories/giornata-internazionale-dei-monumenti-e-dei-siti-2024/