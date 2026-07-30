# Where will the fire go?

It's been months since I last wrote on this blog, and I'm truly sorry about that 🫣! But I've decided to return with a new series of articles that will be published once a month (fingers crossed).

## How is GeoAI used to manage wildfires?

At 8:18 AM on July 29, 2026, the Joint Research Centre’s page dedicated to European wildfires reported [434,976 hectares burned in the European Union since the beginning of the year, 1,407 detected fires, and 17.98 million tons of carbon dioxide emitted](https://joint-research-centre.ec.europa.eu/projects-and-activities/natural-and-man-made-hazards/forest-fires/current-wildfire-situation-europe_en). Comparing this to the same period in 2025—already cited by the JRC as the worst year on record—made the situation look even more severe.

![Median Fire Weather Index anomaly map](/Assets/fire-assets/fire_pred.jpg)

*I am writing this article on July 30, 2026. The map shows the median Fire Weather Index (FWI) anomaly, calculated as a standard deviation from the thirty-year historical mean.*

Before jumping to conclusions, however, it is worth pausing for a moment. EFFIS figures do not arrive as definitive data. The same page warns that estimates are corrected as better imagery becomes available; furthermore, the system primarily monitors fires of approximately thirty hectares or more that involve, at least in part, natural surfaces. In short, even the portion of territory we consider "already burned" remains a provisional reconstruction for some time.

This is a good starting point because it shows the situation for what it is. During a wildfire, there is no perfect map that observes everything at the same instant. There are sensors passing over at different times, pixels of varying sizes, weather models, ground observations, cameras, aircraft, drones, and perimeters that are drawn and then redrawn. With every step, we gain information, but we also uncover a new margin of error.

This is exactly where GeoAI comes in. It brings together geography, Earth observation, modeling, and artificial intelligence, but the question is constantly shifting. First, it tries to understand where the landscape is prone to burning. Then, it must distinguish a new thermal anomaly, reconstruct the fire front, explore its potential spread, overlay exposed people and infrastructure, and finally, interpret what remains after the flames have passed.

At first glance, it seems like a single application. Looking closer, however, different problems emerge, occurring on timescales ranging from months to minutes.

---

## Fire begins before the flames

When the first red dot appears on a satellite map, part of the story has already been written.

In the preceding days, there may have been little rain. The wind may have picked up. The vegetation may have lost moisture, while dry branches, needles, and shrubs continued to accumulate. A rainy spring may have even encouraged the growth of new biomass which, once dried out, becomes fuel. Then comes the ignition: lightning, a spark, agricultural activity, a power line, or a deliberate or careless human act.

To interpret this phase, meteorological danger indices have been used for some time. In Europe, EFFIS calculates the **Fire Weather Index** based on ECMWF and Météo-France forecasts, representing it in six harmonized classes, from low to very extreme. [The official EFFIS documentation describes forecasts from one to nine days and a "Very Extreme" class introduced in 2021 to distinguish the most severe Mediterranean situations](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/fire-danger-forecast).

The result indicates how much the atmosphere and dead fuel favor ignition and difficult-to-control behavior, should an ignition occur.

That **should** matters a great deal.

A territory can be very dry and windy without any fire starting. Conversely, an area with less extreme conditions might burn because the ignition happens in the wrong place, near continuous vegetation and an urban-rural interface.

Here, it is useful to distinguish between at least three concepts.

**Hazard** describes the possibility of the phenomenon occurring with a certain intensity. **Activity probability** attempts to pinpoint where it is plausible to observe a fire, adding information about fuel and ignition sources. **Risk** incorporates what could be affected: people, homes, roads, ecosystems, power lines, and farms.

The three maps may look similar, but the decisions they suggest are different.

![Five synthetic surfaces showing fuel, dryness, slope, human pressure, and estimated probability](/Assets/fire-assets/images/01-dalla-vegetazione-alla-probabilita.png)

*A didactic visualization of the fusion of geographic factors. The formula used to generate the image is intentionally simplified.*

In Italy, the Civil Protection Department produces a national bulletin every day. The assessment incorporates [weather and climate conditions, vegetation, land use and status, morphology, and territorial organization](https://rischi.protezionecivile.gov.it/it/approfondimento/bollettino-di-previsione-nazionale-incendi-boschivi/). This product provides a three-level probabilistic estimate of the susceptibility to ignition and spread over the following 24 hours, and it also supports the management of the national aerial fleet.

This is already a form of GeoAI, even if the label is not explicitly used. There is a geographic component, as every variable changes across space. There is a modeling component, as heterogeneous data must be fused. There is a downstream decision-making process, as an area classified as highly susceptible may require a different deployment of personnel and equipment. For the 2026 summer season, [the national wildfire prevention campaign has been set from June 15 to October 15](https://www.protezionecivile.gov.it/it/approfondimento/campagna-antincendio-boschivo-2026/).

In recent years, machine learning has attempted to sharpen this focus. The **Probability of Fire** model developed by ECMWF integrates weather, fuel abundance and moisture, human presence, lightning, and observations of fire activity. [According to the ECMWF technical presentation, the combined use of these various sources has improved predictive capability by up to 30%](https://www.ecmwf.int/en/about/media-centre/news/2025/scientists-present-new-ml-tool-improved-fire-prediction).

The scientific study behind the system offers an even more instructive finding: [data on fuel, ignitions, and observed fires reduce false alarms in models based primarily on weather, while the quality of the input data matters more than the complexity of the architecture](https://www.nature.com/articles/s41467-025-58097-7). In that comparison, a tree-based solution like XGBoost achieved performance comparable to a more sophisticated neural network.

Work conducted in eastern Spain helps illustrate what it means to add the human component. The authors cross-referenced 849 ignitions with distance from roads and wildland-urban interfaces, population density, fuel types, and dead fuel moisture: [the Random Forest model achieved an AUC of 0.76 ± 0.01 and demonstrated how climate and demographic shifts can reshape ignition probability](https://www.tandfonline.com/doi/abs/10.1080/19475705.2025.2472864). This figure must be read within its context, without pitting it against metrics obtained from different regions, periods, and sampling methods.

This is a lesson that frequently recurs in GeoAI. Before adding layers to a model, it is worth asking whether we are observing the territory correctly.

ECMWF has also published a [reproducible Probability of Fire Toolbox, built as a sequence of notebooks for preparing data, training local models, and evaluating them](https://www.ecmwf.int/en/about/media-centre/science-blog/2026/build-your-own-probability-fire-model). This is an interesting choice because it acknowledges a limitation of global products: climate, vegetation, land management, and human activity vary from region to region. The same conclusion emerges from a study of over 17,000 fires verified in different areas of central Russia: [F1-scores ranged between 0.70 and 0.87, and the authors recommended models adapted to the characteristics of each region](https://www.nature.com/articles/s41598-025-94002-4).

Other comparisons make this limitation even more apparent. In Changsha, [evapotranspiration and canopy water content were found to be the most influential factors in a Random Forest model with an AUC of 0.981](https://www.mdpi.com/2072-4292/15/17/4208); in a study between Okanogan, USA, and Jamésie, Canada, [performance decreased when training occurred in one region and validation in the other, although partial predictive capacity was maintained](https://link.springer.com/article/10.1186/s42408-024-00335-2). This is the kind of result that a global average tends to hide.

The geographic domain is embedded in the very logic of the algorithm: it changes the relationships between variables and, consequently, the validity of the model.

---

## A red dot is not the fire front

When opening NASA FIRMS on a difficult day, you see constellations of red and orange dots. The impression is immediate: every dot looks like a flame, and the collection of dots looks like the perimeter of the fire.

And this is where the trap lies.

In the MODIS product, a hotspot represents the center of a pixel—approximately one kilometer in size—where the algorithm has detected one or more thermal anomalies. EFFIS notes that [the nominal resolution of a MODIS pixel for active fire detection is one kilometer](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/active-fire-detection). The published point does not necessarily coincide with the exact location of the source, and, most importantly, the entire cell is not burning.

With VIIRS, the level of detail improves: [the NASA VNP14IMG_NRT product detects sub-pixel activity within 375-meter nominal cells](https://www.earthdata.nasa.gov/es/data/catalog/lancemodis-vnp14img-nrt-2). However, the nature of the information remains the same. We are observing a thermal anomaly, not the exact perimeter of the fire.

![Educational comparison between a MODIS pixel and a VIIRS pixel](/Assets/fire-assets/images/02-hotspot-non-perimetro.png)

*The point is published at the center of the cell containing the anomaly. The thermal source may be located in another part of the pixel.*

The difference is significant. Hotspots are invaluable for alerting us that something is happening and for tracking activity over time. Measuring the burned area requires a different process.

The EFFIS **Rapid Damage Assessment** module combines MODIS, VIIRS, and Sentinel-2 imagery. [Areas identified through automated procedures are checked and corrected via visual interpretation; since 2018, Sentinel-2 has allowed for the refinement of perimeters to twenty meters and the inclusion of fires below the thirty-hectare threshold](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/rapid-damage-assessment). EFFIS estimates that areas mapped in this way represent approximately 95% of the total burned area in the European Union, despite accounting for only a fraction of the total number of fires.

This verification process also avoids less intuitive errors. Industrial plants, very hot surfaces, or agricultural activities can produce suspicious thermal signals. The algorithm flags them for attention, and subsequent verification determines whether a fire compatible with the product actually occurred there.

### Test the concept

The following module changes the pixel size and moves the thermal source within the cell. It does not use satellite data; it is intended only to illustrate the misconception.

<hotspot-demo></hotspot-demo>

The choice of sensor introduces another trade-off. Polar-orbiting satellites, such as those carrying MODIS and VIIRS, offer more detail but only observe the same territory during specific passes. Geostationary satellites, by contrast, keep their gaze fixed on the same portion of the planet and update the scene much more frequently, at the cost of larger pixels.

![Qualitative diagram of the trade-off between spatial resolution and observation frequency](/Assets/fire-assets/images/03-compromesso-sensori.png)

*The positions in the diagram are qualitative. Actual performance depends on the sensor, orbit, acquisition geometry, cloud cover, and product.*

In the United States, the **Next Generation Fire System** analyzes images from GOES satellites. NOAA states that [the system can generate an alert within as little as one minute from the moment the fire's energy reaches the satellite](https://prod-01-alb-www-noaa.woc.noaa.gov/news-release/noaa-unveils-powerful-convergence-of-ai-and-science-with-revolutionary-next-generation-fire-system); furthermore, in 2026, the agency launched a [public portal featuring experimental, near-continuous detection and monitoring](https://www.nesdis.noaa.gov/data-products-research-services/wildland-fire-data-portal).

Another way to reduce latency is to perform processing directly in orbit. ESA’s **PhiFireAI** application classifies images from Φsat-2, distinguishing between [water, safe areas, burn scars, and fire-affected zones, thereby avoiding the download of scenes that lack useful information](https://www.esa.int/Applications/Observing_the_Earth/Phsat-2/AI_for_wildfire_detection). Following its commissioning phase, [Φsat-2 began distributing scientific data in July 2025](https://www.esa.int/Applications/Observing_the_Earth/Phsat-2/Phsat-2_begins_science_phase_for_AI_Earth_images).

Mediterranean Europe is also moving toward dedicated constellations. In May 2026, Greece launched [four CubeSats for the new Hellenic Fire System, which ESA has identified as the first national satellite capability dedicated to fire detection and tracking](https://www.esa.int/Applications/Observing_the_Earth/Hellenic_Fire_System_satellites_launched_for_Greece). Two months later, [the system returned its first thermal image of Greek territory](https://www.esa.int/Applications/Observing_the_Earth/Hellenic_Fire_System_achieves_first_light).

Remote sensing can also estimate how ready fuel is to burn. A continental-scale experiment combined ground observations, weather models, and VIIRS reflectances: [removing satellite data significantly worsened the error in estimating dead fuel moisture](https://www.mdpi.com/2072-4292/15/13/3372). At a much finer scale, experimental work in Harbin used 5,945 multispectral drone images and 480 samples: [the ConvNeXt model estimated dead fuel moisture with a MAE of 1.54% on the test set](https://www.mdpi.com/1999-4907/14/9/1724). This is a local test, not a guarantee of transferability; however, it shows how satellites, drones, and ground sampling can occupy different rungs on the same observational ladder.

More satellites, however, do not eliminate the problem. They reduce it. One sensor sees heat, another reads vegetation, and another uses radar to peer through smoke and clouds. The best map emerges from their combination and from the clarity with which time, resolution, and limitations are declared.

---

## Where will the flames go?

Detecting a fire means answering the question: **where is there thermal activity?**

Predicting its spread means addressing another: **how will the perimeter change when wind, slope, and fuel interact?**

Flames tend to move faster uphill because they preheat the fuel ahead of them. Wind tilts the flame, carries heat, and can loft embers capable of igniting spot fires beyond the main front. Vegetation continuity opens corridors; roads, rocks, and previously burned areas can interrupt them. Moisture alters the energy required for ignition.

Operational models did not originate with deep learning. Systems like **FlamMap** and **FARSITE** incorporate decades of physical and empirical research. [The US Forest Service documentation lists eight basic geographic layers, including elevation, slope, aspect, fuel models, and canopy characteristics](https://research.fs.usda.gov/firelab/products/dataandtools/flammap). Outputs include rate of spread, flame length, intensity, perimeter growth, and conditional burn probability.

Not all models are equivalent. [FlamMap calculates potential behavior under constant environmental conditions, while FARSITE allows for time-varying weather sequences](https://research.fs.usda.gov/firelab/projects/flammap). The former is useful for comparing landscapes and fuel treatments; the latter better tracks temporal evolution. Confusing their purposes produces apparent precision but a poorly posed question.

GeoAI can enter the pipeline by estimating hard-to-observe variables, such as fuel distribution; by correcting systematic errors in a simulator; by building a faster surrogate for a costly simulation; or by assimilating new observations to update the predicted perimeter. These are distinct tasks, and it is worth stating each time which one is being entrusted to the model.

The **WIFIRE Firemap** platform offers an example of this integration. The UC San Diego program combines [near-real-time weather, ignitions, topography, and vegetation characteristics to produce forecast maps in minutes](https://scil.ucsd.edu/wifire-program). During the most dangerous events, perimeters detected by aircraft can be assimilated to update simulations. The platform itself makes a point that applies here as well: [the results are support tools and do not replace professional judgment or the guidance of authorities](https://watch.firemap.sdsc.edu/).

### A forecast is a range

The front does not follow a pre-written line. Small differences in wind, humidity, or spotting can produce divergent trajectories. This is why a probabilistic forecast is often more honest than a single colored perimeter.

![Three propagation scenarios and the probability obtained from 120 Monte Carlo simulations](/Assets/fire-assets/images/04-propagazione-probabilistica.png)

*The figure is derived from 120 runs of a simplified cellular automaton. It illustrates a principle, not a forecast.*

Research is also experimenting with generative models. A paper published in 2026 in *Geoscientific Model Development* uses a diffusion model to produce sets of plausible futures. [The system learns to emulate a probabilistic cellular automaton conditioned by canopy cover, vegetation density, slope, and wind](https://gmd.copernicus.org/articles/19/1027/2026/). The resulting ensembles represent the proportion of simulations in which each cell is reached by fire.

The result is promising, but the epistemic boundaries must remain clearly visible. The authors present it as a **proof of concept** trained on synthetic sequences, albeit constructed from the geographical contexts of the Chimney and Ferguson fires. [Stated future work includes validation against progressions observed by satellite](https://gmd.copernicus.org/articles/19/1027/2026/index.html).

Calling it "AI that predicts fires" would erase half the story. It is a surrogate that attempts to reproduce the distribution of a simulator. Useful, perhaps very useful; but not yet an operational oracle.

### Move the wind, change the outcome

The interactive lab below uses the same general idea as the previous figure: a grid, synthetic fuel, dryness, slope, wind, and spotting. Each run contains randomness. By changing the controls, you can see how quickly a single trajectory can become fragile.

<wildfire-simulator></wildfire-simulator>

---

## Rhodes: eleven days, eighteen maps

To see the complete supply chain, it is best to follow a specific case.

On July 18, 2023, a fire began on the island of Rhodes. The Copernicus Emergency Management Service activated the Rapid Mapping module and continued to update its products as the front moved across the central-southern part of the island.

In the report released on August 3, [activation EMSR675 was shown to have produced eighteen maps for the Salakos area, with 17,773.5 hectares burned, approximately 750 people affected, and 737 buildings impacted](https://mapping.emergency.copernicus.eu/news/information-bulletin-169-the-copernicus-emergency-management-service-maps-some-critical-wildfires-in-greece-update/).

Months later, the Risk and Recovery module answered a more granular question. [Product P07 of activation EMSN159 recalculated 17,628.7 hectares and broke them down into 2,291.5 hectares slightly damaged, 6,143.8 moderately damaged, 7,856.4 highly damaged, and 1,337.1 destroyed](https://mapping.emergency.copernicus.eu/activations/EMSN159/).

The two surface areas differ slightly, and that difference is worth keeping visible. The timing of the analysis, the available imagery, the resolution, the purpose of the product, and the classification method all change. A rapid map must arrive while the event is still ongoing. A subsequent assessment can afford to observe the margins more closely and distinguish the severity.

![Timeline of Copernicus products for the Rhodes fire](/Assets/fire-assets/images/05-rodi-timeline.png)

*Original timeline built on data from activations EMSR675 and EMSN159.*

Sensors also tell different parts of the story. Sentinel-2 uses optical and infrared bands to show smoke, vegetation, and the burn scar. Sentinel-1 uses radar and can compare acquisitions before and after without depending on sunlight. [ESA combined two radar images from July 12 and 24 to show a scar of approximately 13,000 hectares already visible while the fire was still active](https://www.esa.int/ESA_Multimedia/Images/2023/09/Earth_from_Space_Scorched_Rhodes). This value is lower than the final tally precisely because it captures an earlier phase of the event.

At first glance, these seem like representations of the same blaze. Then, you shift your focus and see the heart of the matter: one map is used to locate heat, another to delineate the front, and yet another to estimate damage. Treating them as interchangeable leads to poor decision-making.

---

## A live module, without passing off a demo as an alarm

Copernicus EMS exposes a JSON API to query public activations. The general documentation indicates [a synthetic endpoint for the details of each code, including title, category, countries, centroid, status, and number of products](https://mapping.emergency.copernicus.eu/about/how-to-harvest-cems-mapping-data/). For Rapid Mapping activations, [an extended response is also available, containing areas of interest, source imagery, statistics, geometries, layers, and links to downloadable packages](https://mapping.emergency.copernicus.eu/about/how-to-harvest-cems-mapping-data/emergency-response-data/). The new viewer also associates an OpenAPI link with each record, such as [the one for activation EMSR906](https://mapping.emergency.copernicus.eu/activations/EMSR906/openapi).

The following box tests these interfaces in sequence and declares which response it was able to use. It displays only metadata that is already public, retains the time of the last check, and, when available, starts from a local snapshot generated during publication. The JRC catalogs the service as public and allows its reuse with attribution to the European Commission, subject to any third-party works ([official service sheet and reuse conditions](https://data.jrc.ec.europa.eu/service/9d439213-2598-5d04-b6b3-f2882e4b0fb6)).

<cems-activation activation="EMSR906" snapshot="/Assets/fire-assets/data/emsr906-fallback.json"></cems-activation>

This module should be read as an editorial window into the evolution of a geospatial product. For alerts, evacuations, and safety decisions, always rely on official communications from the Civil Protection, the Fire Brigade, and local authorities.

This distinction has become even more critical since 2026. Copernicus EMS has announced that [Rapid Mapping vector data is now delivered on average two hours before the finalized map layouts, and that in addition to shapefiles and GeoJSON, the GeoPackage format is also available](https://mapping.emergency.copernicus.eu/news/rapid-mapping-products-delivered-faster-and-with-new-formats/). For an operations center, two hours can make a substantial difference. For an article, it means the embedded screen may change after publication.

---

## From pixels to the operations center

A propagation forecast only gains meaning when it is overlaid on inhabited territory.

Where are the houses? Which roads could be cut off by the fire front? Is there only one evacuation route? Where are the hospitals, campsites, tourist facilities, power lines, and storage depots located? What water sources are available for aircraft? How long does it take for crews to reach a specific slope?

This is where GeoAI stops being just Earth observation and becomes decision support.

The Italian firefighting campaign offers a clear example. The Unified Air Operations Center (COAU) coordinates the state fleet, and deployment is adapted based on bulletins, forecast conditions, regional capabilities, and requests arriving from the field. The model does not decide which aircraft to launch. Instead, it narrows the field, prioritizes attention, and provides a common operating picture for people who must make quick decisions.

![GeoAI supply chain from observation to post-fire assessment](/Assets/fire-assets/images/07-filiera-geoai.png)

*Each link inherits the uncertainty of the previous one. Value is created in the transition from data to decision.*

This chain also suggests a more serious way to evaluate these systems.

A segmentation model might achieve an excellent intersection-over-union score on a benchmark, but arrive after the fire front has already crossed a road. A slightly less accurate model might offer ten minutes of extra time and change a decision. Computational metrics remain necessary, but they must meet operational ones: latency, reliability, false alarms, missed events, time saved, and resources reallocated.

The decisive question becomes: **what was made possible thanks to this information?**

---

## When the fire is no longer visible

Extinguishing the flames is only one part of the emergency.

The loss of vegetation and changes to the soil can increase erosion, runoff, shallow landslides, and debris flows. Heavy rain a few weeks after a fire can open a second chapter.

To reconstruct the severity, images acquired before and after the event are often compared. The **Normalized Burn Ratio (NBR)** relates near-infrared and short-wave infrared—two regions of the spectrum sensitive to vegetation and moisture. The difference between the pre-fire and post-fire values, known as dNBR, helps distinguish between unburned areas and those with low, moderate, or severe damage. [Copernicus describes NBR, burned area, and Fire Radiative Power as complementary measures of impact](https://climate.copernicus.eu/wildfire-impact-how-it-monitored-measured).

![Synthetic example of NBR before and after a fire and the dNBR difference](/Assets/fire-assets/images/06-dnbr-severita.png)

*These data are also simulated. Severity thresholds are not universal and must be calibrated with local observations.*

In the United States, **BAER** (Burned Area Emergency Response) teams use preliminary satellite products to assess vegetation, soil, and watersheds. [The program provides imagery, severity classifications, and other data within about seven days of containment](https://burnseverity.cr.usgs.gov/baer/), while BARC maps are subsequently corrected in the field to produce the final soil burn severity. USGS documentation clarifies that [there are four BARC classes—high, moderate, low, and unburned—which serve as input for stabilization efforts](https://www.usgs.gov/centers/eros/science/burned-area-emergency-response-support).

Spectral comparison does not settle the matter. Within the same perimeter, destroyed areas, lightly affected patches, and islands of green can coexist. Furthermore, radar, optical, and field surveys measure different properties. The final map is a synthesis, not a neutral photograph.

Meanwhile, smoke follows a different geography than the flames. The Copernicus Atmosphere Monitoring Service uses the **Global Fire Assimilation System** to derive intensity and emissions from Fire Radiative Power. [GFAS is updated in near real-time and powers forecasts on smoke composition and transport](https://atmosphere.copernicus.eu/global-fire-monitoring). CAMS also emphasizes that [Fire Radiative Power does not provide the physical surface area of the fire: it measures the energy signal used to estimate intensity and emissions](https://atmosphere.copernicus.eu/qa-wildfires).

At that point, the damage perimeter no longer coincides with the burned perimeter. A plume can cross regions and continents, degrading air quality far from the fire front.

---

## Errors that matter

Fire data is inherently imbalanced. Almost all observed spatio-temporal cells do not contain a fire. A model that always classified "no fire" could show remarkable accuracy while being completely useless.

Therefore, we must look at precision, recall, probability calibration, and behavior during extreme events. We need to check if the model works outside the region where it was trained. We must ask what happens when vegetation, agricultural practices, road density, climate, and sensor quality change.

Then there are observation errors. Clouds and smoke can hide the ground. A satellite might pass between two intense phases. A small fire might remain below the detection threshold. A hot surface can generate a false positive. A perimeter might be updated hours later, once better imagery is acquired.

For this reason, every operational product should carry four coordinates: the time of the last observation, the sensor or model used, the resolution along with the latency, and the product's uncertainty status. Without this information, a map that is precise in its colors may be vague in its meaning.

The issue is not just about scientific transparency. It involves how people read an interface. A solid, continuous red perimeter psychologically communicates more certainty than the model actually possesses. A probabilistic band, on the other hand, may seem more confusing but better conveys what we actually know.

Sometimes an honest visualization is less spectacular. In an operations room, however, the aesthetics of certainty can come at a high cost.

---

## The right map, at the right time

GeoAI applied to wildfires resembles a relay race.

The first system reads the territory's predisposition. The second intercepts a thermal anomaly. The third reconstructs the perimeter. A simulator explores possible trajectories. A GIS overlays homes, infrastructure, and escape routes. After the fire is extinguished, other models measure severity, erosion, and smoke transport.

Each step hands off an incomplete representation of the world to the next.

It is easy to be mesmerized by the latest neural network or the newest satellite constellation. Looking closer, however, value is created at the hinges: in how a hotspot is verified, a simulation is updated, uncertainty is communicated, and a forecast enters the operations room.

The question "can artificial intelligence predict a fire?" is too broad to be useful.

It is better to break it down.

Which phase are we trying to anticipate? With what observations? At what resolution? Within what timeframe must the answer arrive? Who will have to make decisions based on that map? And what happens when the model is wrong?

Fire runs across the landscape. Information must manage to run a little faster.

---

## Note on the interactive laboratory

The simulations in this article were developed to explain propagation, uncertainty, resolution, and progressive updating. They use an educational cellular automaton, synthetic fuel, and controllable parameters; FlamMap, FARSITE, and operational physical models have a much richer structure. The code is included in the package so that every step is inspectable and reproducible.

The Copernicus module, conversely, reads public metadata from the official API. The institutional origin of the data does not change its editorial role: for safety decisions, the competent authorities are the final authority.

## Sources and further reading

The main citations have been inserted directly into the passages they support. To continue reading:

- [JRC — Current wildfire situation in the European Union](https://joint-research-centre.ec.europa.eu/projects-and-activities/natural-and-man-made-hazards/forest-fires/current-wildfire-situation-europe_en)
- [EFFIS — Fire Danger Forecast](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/fire-danger-forecast)
- [EFFIS — Active Fire Detection](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/active-fire-detection)
- [EFFIS — Rapid Damage Assessment](https://forest-fire.emergency.copernicus.eu/about-effis/technical-background/rapid-damage-assessment)
- [Civil Protection — National forest fire forecast bulletin](https://rischi.protezionecivile.gov.it/it/approfondimento/bollettino-di-previsione-nazionale-incendi-boschivi/)
- [ECMWF — Probability of Fire](https://www.ecmwf.int/en/about/media-centre/news/2025/scientists-present-new-ml-tool-improved-fire-prediction)
- [Di Giuseppe et al. — Global data-driven prediction of fire activity](https://www.nature.com/articles/s41467-025-58097-7)
- [Illarionova et al. — Robust wildfire occurrence prediction](https://www.nature.com/articles/s41598-025-94002-4)
- [Gelabert et al. — Human-caused ignitions in eastern Spain](https://www.tandfonline.com/doi/abs/10.1080/19475705.2025.2472864)
- [Wu et al. — Fuel factors and fire prediction in Changsha](https://www.mdpi.com/2072-4292/15/17/4208)
- [Moghim and Mehrabi — Generalization across physically different regions](https://link.springer.com/article/10.1186/s42408-024-00335-2)
- [Schreck et al. — VIIRS and machine learning for fuel moisture](https://www.mdpi.com/2072-4292/15/13/3372)
- [Xing et al. — Fuel moisture estimation using multispectral drones](https://www.mdpi.com/1999-4907/14/9/1724)
- [NASA Earthdata — VIIRS active fire 375 m](https://www.earthdata.nasa.gov/es/data/catalog/lancemodis-vnp14img-nrt-2)
- [NOAA — Next Generation Fire System](https://www.nesdis.noaa.gov/data-products-research-services/wildland-fire-data-portal)
- [ESA — PhiFireAI](https://www.esa.int/Applications/Observing_the_Earth/Phsat-2/AI_for_wildfire_detection)
- [ESA — Hellenic Fire System](https://www.esa.int/Applications/Observing_the_Earth/Hellenic_Fire_System_achieves_first_light)
- [US Forest Service — FlamMap](https://research.fs.usda.gov/firelab/products/dataandtools/flammap)
- [UC San Diego — WIFIRE Program](https://scil.ucsd.edu/wifire-program)
- [Yu et al. — Probabilistic wildfire spread with a diffusion surrogate](https://gmd.copernicus.org/articles/19/1027/2026/)
- [Copernicus EMS — July 2023 Greek wildfires](https://mapping.emergency.copernicus.eu/news/information-bulletin-169-the-copernicus-emergency-management-service-maps-some-critical-wildfires-in-greece-update/)
- [Copernicus EMS — EMSN159, Rhodes assessment](https://mapping.emergency.copernicus.eu/activations/EMSN159/)
- [Copernicus EMS — Rapid Mapping API documentation](https://mapping.emergency.copernicus.eu/about/how-to-harvest-cems-mapping-data/emergency-response-data/)
- [USGS — Burned Area Emergency Response](https://burnseverity.cr.usgs.gov/baer/)
- [CAMS — Global fire and smoke monitoring](https://atmosphere.copernicus.eu/global-fire-monitoring)
