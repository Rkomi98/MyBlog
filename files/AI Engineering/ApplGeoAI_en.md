# LLMs for GeoAI: Geospatial applications, GIS, and disaster response

## Introduction

In recent months, there has been a great deal of talk about LLMs, agents, multimodal systems, and reasoning tools. Very often, however, the discussion remains abstract: impressive demos are shown, but it is not always clear where these technologies become truly useful outside of general-purpose chatbots.

This is precisely where, in my opinion, the geospatial world becomes truly interesting. Because when we enter the field of maps, satellite imagery, territorial data, environmental monitoring, or emergency response, language alone is not enough. It must be linked to coordinates, information layers, time series, satellite surveys, geographic databases, and constraints derived from the real world. In other words, we must stop viewing the LLM as an isolated object and start treating it as a component within a broader system.

In this article, I want to reason in a simple but concrete way about **what language models can actually do in the geospatial world.**

I envision various possible scenarios, such as post-event reporting, decision support, interpreting remote sensing results, linking textual sources with cartographic data, and [natural language interfaces for existing GIS tools](https://www.mdpi.com/2220-9964/13/10/348).

In the GEO world, LLMs can be very useful, but they are rarely the quantitative core of the analysis. They should not be the ones to precisely segment a radar image, estimate flood extent to the meter, or replace a specialized geospatial algorithm: [in object detection and image segmentation tasks for Earth Observation, the work remains in the hands of dedicated vision models](https://www.mdpi.com/2072-4292/12/10/1667). Their value, rather, emerges when they are tasked with **connecting different pieces of information, synthesizing them, explaining them clearly, and making them queryable in a natural way.**

For this reason, I believe it makes sense to talk about the **integration of LLMs and geospatial pipelines.** And this is the thread we will follow in the sections to come.

## My favorite examples

Let us now turn to the use case that interests me most: applying these technologies in the geospatial and disaster response sectors, such as earthquakes, natural disasters, etc.

This sector combines *multimodal* data (text, maps, satellite imagery, sensors) and requires both **precise quantitative analysis** (e.g., detecting damage from images) and **synthesis and reasoning capabilities** (e.g., drafting situation reports, making risk inferences). LLMs can play a valuable role, but they **must be correctly integrated** with existing geospatial workflows. Let's look at some possible scenarios.

### LLM + RAG for post-earthquake reports

Imagine having to quickly create a report after a major earthquake that summarizes the damage, the most affected areas, the status of infrastructure, and potential actions. You have various sources available: fire department reports, geolocated social media posts, satellite imagery with collapse analysis, and GIS databases containing building and population data.

An LLM on its own *knows* nothing about the earthquake (or rather, it certainly knows nothing about what just happened). However, we can use it as a **linguistic generation engine** by feeding it data specific to the event. With a RAG approach, the system can retrieve, for example: "textual reports from the fire department over the last 12 hours," "results of automated image analysis (X buildings collapsed in area Y)," and "lists of blocked roads from live maps." The logic is consistent with the original work on RAG, where [retrieval is used to give the model access to explicit memory, improve factuality, and make the provenance of answers possible](https://nlp.cs.ucl.ac.uk/publications/2020-05-retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/). This information is inserted (perhaps in an already summarized form) into the prompt, and the LLM is tasked with drafting a **coherent and readable report**, for example, for the authorities.

The LLM excels at **connecting the dots**: it can take a list of facts and transform them into a narrative: "In the northern part of the city (District XX), approximately 30 buildings have collapsed, with the highest concentrations of damage along Via Alfa and Via Beta. Rescue teams have saved 12 people from the rubble and report at least 5 missing. The bridge over the river is impassable, temporarily isolating the Gamma district..."

Without an LLM, a human operator would have to manually write this summary by integrating many sources; with an LLM, the operator can focus on verifying and correcting, rather than writing from scratch.

> **Important:** As we have seen, the LLM must be *grounded* in real data here: we do not want it to invent casualty numbers! Therefore, we provide precise figures and details via RAG, and we **ask** the model to **cite its sources**. This way, the LLM does what it does best (language and textual reasoning) without acting "in the absence of information."

### LLM + agents for emergency decision support

In crisis situations, a civil protection manager might query an AI system with complex questions, such as: *"Where should we concentrate Urban Search and Rescue (USAR) teams based on reports and damage data?"*

Answering this requires: understanding the question (a linguistic task), having access to data (geospatial and textual), and reasoning by combining *criteria* (e.g., USAR teams are for search and rescue in rubble, so they are needed where collapsed buildings and the potential for trapped people are highest).

A single static model would struggle with this. However, we can build an **LLM agent** equipped with tools: one that writes a query to a GIS database for the number of collapsed buildings per zone, one that reads the latest SOS messages, and one that consults the registry of already deployed teams. This follows the same direction shown in works like ReAct, where [the model alternates between reasoning and taking actions toward external sources to gather additional information](https://iclr.cc/virtual/2023/poster/11003), or [Toolformer](https://arxiv.org/abs/2302.04761), where the language model learns when to call external APIs and how to incorporate their results.

The agent can create a plan such as:

1) obtain a collapse density map;

2) obtain a list of reports of trapped people;

3) cross-reference by zone;

4) propose priorities.

It performs steps 1) and 2) via tools, for example, by calling a geospatial API that returns data or by executing a query on an emergency knowledge graph. Then, the LLM itself can generate a response like:

*"The zones with the greatest need for USAR appear to be A and B. In district A, there are 20 collapsed buildings, corresponding to approximately 50 people reported under the rubble, and there is currently only one operational team; I suggest sending at least two more. In district B (15 collapses, 30 people reported), the situation is similar. Zones C and D have fewer collapses or already have sufficient coverage."*

This is pure **decision support**: the LLM does not make the decision, but it provides a reasoned, quickly readable analysis by integrating disparate data (GIS + reports + resource status). This allows the manager to confirm and act much faster. Again, the LLM acts here as an **intelligent aggregator**: it manipulates data with reasoning and presents it effectively to those who will ultimately make the decisions.

### LLM + Remote Sensing (RS) models

When analyzing satellite imagery or remote sensing data, we often obtain technical results, such as classification maps, confusion matrices, damage percentages per cell, etc. An LLM can help translate these raw outputs into **actionable insights** that are understandable to everyone* (I include an asterisk because we can adapt the outputs based on who will be reading these reports).

For example, a computer vision model processes post-disaster images and outputs shapefiles with polygons of flooded areas and a severity indicator per area. An LLM could take these results (converted into structured text) and generate a **briefing**:

*"Satellite analyses indicate extensive flooding along the Delta River: approximately 45 km² of territory is flooded. Municipalities X and Y are particularly affected, with water covering ~30% and ~45% of their urban areas, respectively. The industrial area of Y is entirely submerged, with a possible release of substances into the water. Major infrastructure affected includes the SP123 road and the Z railway, both of which are interrupted."*

Note how many deductions and aggregations are included: the LLM can describe the total area (by summing polygons), convert that information into an impact statement, identify municipalities within the polygons (by cross-referencing coordinates with names via a backend GIS tool), and mention affected infrastructure (if it has vector data on roads and railways, it can cross-reference them). In short, we use it as an *intelligent report generator* that sits on top of numerical models.

#### What should the LLM not do?

Let's take a step back: what should the LLM not do?

Do not use it for image segmentation! To identify flooded pixels, there is a specialized vision model that works on rasters and likely uses convolutional networks or other architectures: [in EO/RS literature, image segmentation and object detection are treated as specific visual deep learning problems](https://www.mdpi.com/2072-4292/12/10/1667). An LLM lacks direct visual perception (unless you use a multimodal model, but currently, dedicated models are better for precision tasks). Therefore, the rule is: leave the quantitative "pixel-wise" work to RS models (they are trained for high accuracy in that area) and use the LLM to **connect those results with knowledge and present them**. For example, an LLM can explain why a certain flooding pattern is dangerous ("this area was already prone to landslides; the flood makes it unstable"), which a pure RS model cannot do.

#### What an LLM *must not do* in geospatial/DR

As mentioned, do not entrust an LLM with **technical precision** that requires dedicated algorithms. If you need the latitude/longitude of an address, use a geocoding API; do not ask the model to do it all! If you need to calculate the magnitude of an earthquake from seismographic data, you need physical formulas, not an LLM's "opinion" for a rough estimate. LLMs lack guarantees of numerical accuracy and scientific rigor. Therefore, the *core* parts of the analysis (detecting damage, calculating extensions, counting accurately) must be done with deterministic methods or specialized ML models. Instead, the LLM excels at: **synthesis, high-level correlation, communication, and Q&A**. Furthermore, it is excellent at filling general knowledge gaps: if you also need to explain concepts in a report (e.g., what a seismic fault is or the effects of soil liquefaction), the LLM can generate those paragraphs by drawing on its trained knowledge.

## Fewer words, more facts

Okay, but what should we actually do in practice? Let's look at a couple of important points.

### Integration with existing GEO pipelines

You could imagine your system as: data ingestion pipeline (satellites, sensors, open data) → analytical models (CV for images, GIS computations, etc.) → **LLM layer** for user output. This is also the logic shown in works that use the LLM as a [bridge between natural language and executable GIS code](https://www.mdpi.com/2220-9964/13/10/348) or as an [interface to generate spatial SQL queries from natural language questions](https://www.mdpi.com/2220-9964/13/1/26). During the design phase, clearly define the API between the analytical layer and the LLM. It is often better to structure data in a textual format the model can understand (e.g., bullet points or JSON), including explanations. For example, instead of dumping raw numbers, you could say: "Road X: blocked (bridge collapsed)." This way, the LLM already knows that Road X is blocked and why, and it can easily include it in its narrative, perhaps reasoning that "bridge collapsed → that municipality to the north is isolated." If you only provided "road X status: 0," it would have to infer the meaning of 0, which is much more difficult. Therefore, doing some **data preprocessing for the LLM** is useful: convert technical results into simple sentences or statements, or at least provide comments for the data.

### Cross-validation

In safety-critical areas (such as environmental disasters), an LLM must not be the only voice. You can use a combination of approaches: have the LLM generate the report, then have another LLM review it, asking it to highlight contradictions or possible errors, and finally have a human-in-the-loop (an operator) verify the entire final report, focusing on critical points. This setup is very much in line with NIST recommendations, which emphasize [human oversight roles, independent evaluations, and supervision policies for generative systems used in high-risk contexts](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence). Alternatively, generate two versions (perhaps with different temperatures or prompts) and compare them. In short, use the LLM as an assistant, not as an oracle.

## Conclusion

In conclusion, an LLM can act as an **intelligent collector and communicator** on top of geospatial data. Think of it as a **virtual analyst** that knows a little bit about everything (thanks to its general training) and can be instructed to use your specific data to produce analyses and reports. It frees you from having to manually interpret every map and table by offering an integrated picture. However, as an engineer, you must prepare the ecosystem: specialized models to extract info from raw data, well-organized databases, and then the LLM, appropriately reined in (targeted prompts, RAG, tools) to stitch it all together. This way, you leverage the best of both worlds and get both the quantitative accuracy of geo models and the *linguistic intelligence* of LLMs.