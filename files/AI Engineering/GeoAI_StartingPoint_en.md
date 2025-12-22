# GeoAI Stack: A Guide for 2025

<details class="post-warning">
<summary><strong>Article under review</strong> (click to open)</summary>

This article is still being written and is under technical review. Some content may be incomplete or subject to change with short notice.

</details>

Second installment of our long journey to become a GeoAI engineer. Last time we generally described what an AI engineer does and what differentiates them.

Now we understand what an aspiring GeoAI engineer needs to get started: the tools, datasets, and necessary setup.

## 1. Architectural Overview of the Geospatial AI Stack

Let's start with the main objective and keep it in mind.

> **Objective:** Integrate **Language (LLM)** models and **Geospatial Vision** pipelines in a reproducible environment, from local development to production.

The typical architecture combines:

- **Geospatial data ingestion:** access to optical satellite imagery (e.g., Sentinel-2) and SAR radar (e.g., Sentinel-1) via **STAC/COG** catalogs (Planetary Computer, Earth Data, etc.). We will discuss this in detail later.
- **Pre-processing and remote sensing analysis:** Python pipelines to read, align, and process large rasters (with _rasterio_/_GDAL_, _rioxarray_/_dask_ for voluminous data) and vectors (with _geopandas_/_shapely_). This produces _features_ such as damage maps, flood extent, extracted buildings, etc.
- **Vision and geospatial models:** application of specialized deep learning models on pre-processed data. For example, [IBM used **U-Net**](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=Our%20main%20algorithm%20of%20choice,algorithm%20for%20semantic%20image%20segmentation) in one of its research activities for damage segmentation post-natural disaster. Or, models derived from [**SegFormer**](https://arxiv.org/abs/2105.15203) for change detection, such as [Open-CD](https://arxiv.org/abs/2407.15317v1).\ Libraries like [**TorchGeo**](https://github.com/torchgeo/torchgeo) provide ready-to-use datasets and pre-trained models specific to geospatial scenarios.

![Image](../Assets/Unet.png)
_Figure 1 – U-Net architecture with encoder/decoder and skip connection for segmenting damage and classes in satellite images._

![Image](../Assets/TorchGeo.png)
_Figure 2 – TorchGeo collects ready-to-use datasets and pre-trained models designed for geospatial computer vision scenarios._
- **LLM/RAG Integration:** a **Retrieval-Augmented Generation (RAG)** module connects geospatial results with an **LLM** (e.g., GPT-5 or Mistral Large) to enable Q&A and reporting. The LLM can draw upon updated knowledge bases (documents, place descriptions) in addition to extracted data. This reduces the problem of hallucinations by providing verifiable context. For example, a user can ask _"How many buildings were destroyed by the earthquake in Turkey?"_ and the system uses data extracted from the CV model + textual descriptions to generate an answer citing sources.
- **Agents and automation:** agent-based components (built with frameworks like **LangChain**, **Haystack**, or Datapizza-AI) orchestrate the steps and calls to specific tools. \ In particular, an _agent_ can:
    1. query a *geospatial database* to find relevant post-disaster images;
    2. execute the computer vision model to obtain metrics (number of damaged buildings, flooded area, etc.);
    3. call the LLM to explain the results.

    This enables complex "question -> actions -> answer" workflows in a modular way.
- **Services and deployment:** everything is containerized (Docker) and can be exposed via REST APIs (e.g., with [**FastAPI**](https://fastapi.tiangolo.com/)) or lightweight graphical interfaces. For example, a _Streamlit_ dashboard can display interactive maps with damage layers and offer an LLM chat for disaster-related questions.

### Local vs. Production Architecture
When developing the solution, it is good practice to work on test datasets (for example, on a few representative satellite scenes) using notebooks (like Jupyter Lab, Colab, etc.) or modular scripts (in src/).

In production, however, individual **components** are orchestrated into **microservices**: there can be a service for geospatial analysis (e.g., calculating risk maps) and a service for the LLM (e.g., generating responses), with logging and monitoring. Raw data in this case, such as images, resides in storage (either a local file system or a cloud bucket), while intermediate results, such as generated COGs (Cloud Optimized GeoTIFFs), shapefiles, vector embeddings, can be cached to speed up repeated requests.

I would like to note that language models are typically used via external APIs (OpenAI, etc.) or, in the case of optimized open-source models (e.g., gemma3n 4B), inference occurs on-premise.

As I read in [this paper](https://arxiv.org/html/2502.18470v5#:~:text=On%20the%20other%20hand%2C%20large,zhang2024bb%20%2C%20but%20the%20resulting), this **hybrid AI + GIS** architecture overcomes the limitations of individual systems: classic GIS systems struggle with natural language input, while _"Large Language Models show strong linguistic capabilities but struggle with spatial reasoning and geospatial ground truth"_. By combining them, we obtain a system where visual models provide "eyes" and structured data, and LLMs provide "linguistic reasoning" on such data, with the ability to consult real-time knowledge bases. In summary, the stack embraces the full cycle: **Data (Geo) → AI Vision → Knowledge → LLM**. The following figure illustrates the key components and data flow in the system (from data collection to user response):

![Image](../Assets/framework.png)

_Figure 3 – Summary diagram of the GeoAI stack connecting geospatial ingestion and analysis, CV models, RAG/LLM components, and agent-orchestrated deployment services._

## 2\. Map of Tools and Resources (2025)

In this chapter, we will look at the main options for each aspect of the stack: from Python environment management to development tools, covering container basics, open geospatial datasets, and key libraries. The goal will not only be to understand all of this but also to keep in mind a comparison of features, outlining the advantages of each method.

### 2.1 Python Environment Management (venv, conda, poetry, etc.)

One thing we all agree on: for a solid foundation, a **reproducible Python environment** is necessary, with all dependencies, including GPU packages and geospatial libraries.

The following table compares the most popular approaches today (in 2025):

| Approach | Type | Advantages (pros) | Disadvantages (cons) | Update |
| --- | --- | --- | --- | --- |
| **pip + venv** | Installer + isolated env | Simple and native; fast direct installation | Solver [**no longer greedy**](https://debuglab.net/2024/01/26/resolving-new-pip-backtracking-runtime-issue/) but still less powerful than SAT solvers; no native lockfile; requires [manual removal of unused sub-deps](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20OG%20of%20Python%20package,be%20completely%20decoupled%20from%20a) | pip 25.3 (2025) |
| **conda / mamba** | Package manager with C++ SAT solver | [Manages **non-Python** libraries](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Python%20GDAL%20requires%20,while%20using%20Conda%20package%20manager) (e.g., GDAL, PROJ) in isolated envs; complete and fast resolution thanks to the _libmamba_ solver | Heavy base environment (hundreds MB); lacks out-of-the-box lockfile; sometimes requires mixing pip → possible conflicts | Conda 25.9.1 (2025) |
| **Poetry** | PyPI manager with lockfile | Uses unified _pyproject.toml_ standard; generates multi-platform **lockfile** for reproducibility; automatically manages virtual env | Python solver relatively slow on large reqs. (DFS backtracking); voluminous lockfile; beware of excessive constraints (^version) which can cause conflicts in large teams. | Poetry 2.1 (2025) |
| **PDM / Hatch** | Modern PyPI managers | **PDM** supports PEP 582 (local environment without activate); **Hatch** also acts as a complete build system and allows multi-Python version testing | Less common than the pip/conda/poetry triad; Hatch has a steeper learning curve and a packaging focus (not just env) | PDM 2.26 (2025), Hatch 1.15 (2025) |
| **uv (Astral)** | Unified all-in-one tool (Rust) | [**Extremely fast**](https://docs.astral.sh/uv/) (10-100× pip) thanks to its Rust core; replaces pip, pipx, poetry, pyenv with a single tool; universal lockfile support and multi-project workspace; transparent integration with existing venvs (you can activate uv, then use normal pip if you want) | API and CLI still unstable (young project); emerging community | uv 0.9.9 (2025) |
| **pixi (prefix.dev)** | Conda-like package manager (Rust) | [**Speed**](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=benchmarks%20show%20that%20pixi%20is,on%20a%20M2%20MacBook%20Pro) ~4× micromamba, >10× conda (resolution + install); supports its own cross-platform lockfile (solves one of conda's limitations); integrates PyPI packages into the unified solver ([uses uv libraries](https://prefix.dev/blog/pixi_a_fast_conda_alternative)); no conda base env to install ([standalone executable](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Reason%203%3A%20No%20more%20Miniconda,base%20environment)) | New ecosystem (releases <1 year); fewer pre-compiled packages compared to conda-forge; some commands are still evolving | pixi 0.59 (2025) |

| **pyenv** | Python Version Manager | Allows easy installation and switching of different Python versions per project (useful for multi-version or legacy testing) | Does not manage packages; used in combination with venv/poetry; if used globally, can create confusion about active versions | pyenv 2.6.12 (2025) |

_Table notes:_ **mamba** is the C++ implementation of conda. Today _conda_ itself incorporates _libmamba_ by default, so the two converge in speed. In data science environments, conda/mamba remains popular for its ease with complex scientific packages, while in production, [pip/poetry is often preferred](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Verdict) to avoid extra dependencies and have more control. Emerging tools like uv and pixi aim to unify the best of both worlds (speed and completeness). For example, **uv** is developed in Rust by the creators of Ruff and aims to become the "Cargo for Python" (a single tool to manage Python versions, dependencies, virtualenvs, publishing). **Pixi**, created by the mamba team, is a drop-in conda replacement written in Rust: it uses _uv_ to resolve pip packages, generates lockfiles, and removes the need for a conda base environment, drastically improving speed and ergonomics for bringing conda environments to production.

#### GPU/Geo Reproducibility

For a local AI/RS project on GPU, conda often offers the simplest path (e.g., `conda install pytorch cudatoolkit gdal rasterio` in an env) because it manages compatible "binaries" (CUDA, GDAL). Alternatively, in containerized environments, you can opt for **pip + Docker** using base images with appropriate drivers (we'll discuss this shortly).

In all cases, it is recommended to **pin versions** in a lockfile (for example, using poetry.lock) or requirements files with hashes, and to document the setup (e.g., by providing a conda environment.yml + pip requirements.txt for safety).

An ideal project layout includes a structure similar to:

```bash
proj-root/  
├── src/ # application code (main package)  
├── notebooks/ # exploratory Jupyter notebooks  
├── data/ # raw or sample data (gitignored if large)  
├── models/ # saved models or weights  
├── tests/ # unit/integrated tests  
├── configs/ # config for Hydra/pydantic (e.g., dev.yaml, prod.yaml)  
├── Dockerfile # container definition  
├── pyproject.toml # package/dep specifications (poetry/pdm)  
├── requirements.txt # dependencies (if pip)  
├── Makefile # useful commands (setup, run, lint, test, deploy)  
└── README.md # project documentation
```

This organization partly follows the [_Cookiecutter Data Science_](https://cookiecutter-data-science.drivendata.org/#directory-structure) model (to clearly separate code, data, docs) and facilitates the transition **from local development to production**: the code is packaged (in src/ with an optional \__init_\_.py), tests ensure functionality, and separate configs/secrets per environment allow for consistent deployments.

Let's say it's a good practice, it costs nothing and provides an order that is useful both to you and to those who work with you.

### 2.2 Essential AI Engineer Tooling

To ensure **code quality and development speed**, every developer adopts a set of lightweight DevOps/MLOps tools, which we will look at shortly.

Before giving advice on this, I'll provide some definitions that might be obvious to some but not to others.

> Linting is an automatic check of source code looking for:
> - potential errors: unused variables, suspicious syntax, common bugs
> - style issues: formatting, inconsistent names, unrespected conventions.
> "code smell": patterns that are not errors, but can create problems later
> In practice, files are analyzed without being executed, and points to be fixed are flagged, often with suggestions or automatic corrections.

- **Linting & Format:** _Black_ for automatic code formatting (opinionated, PEP8) and **Ruff** for ultra-fast linting in Rust. Ruff includes hundreds of rules (replaces flake8, isort, etc.) and automatically fixes many issues. It has practically supplanted traditional linters in a short time thanks to its speed and coverage.
    > **Tip:** configure Black and Ruff not to overlap rules (e.g., disable in Ruff the rules that Black already handles, such as line length) - this can be done by [centralizing the configuration](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac) in pyproject.toml.
- **Type Checking:** use **static typing** to prevent bugs. _Mypy_ is the standard for type-checking in Python; alternatively, _Pyright_ (integrated into VSCode/Pylance) offers very fast incremental analysis while writing. Setting a "strict" level (e.g., `warn_unused_configs`, `disallow_untyped_defs` in mypy) helps maintain robust code.
- **Testing:** _Pytest_ is the de facto standard for unit and functional tests in Python. Organize tests in tests/ and perhaps use useful plugins: e.g., **pytest-snapshot** (or [**Syrupy**](https://github.com/syrupy-project/syrupy)) for _snapshot testing_ of complex outputs (automatically compares current output with a previously saved one). This can be useful for validating, for example, API response JSON or raster analysis results. For geospatial pipelines, it might be useful to generate small synthetic datasets to test functions (e.g., create a 100x100 raster and a known geometry and verify that the overlay produces expected results).
- **Pre-commit hooks:** configure _pre-commit_ (file `.pre-commit-config.yaml`) to automatically run quality tools before each commit. A recommended set of hooks: **black**, **ruff**, **mypy**, _isort_ (if not using ruff for import sorting), _end-of-file-fixer_ and _trailing-whitespace_ (simple cleanups), optionally **nbstripout** or **nbqa** to normalize notebooks. This ensures that every commit adheres to code style standards and passes static tests. For example, a combined ruff/black hook makes the code consistent - a developer notes _"Ruff + Black + isort configured together provide friction-free quality"_ in CI and editor.
- **Minimum CI/CD:** set up a simple GitHub Action that on every push executes: lint (ruff/black), type-check (mypy), and test (pytest) across a matrix of environments (at least Python 3.x). This automates quality control. For ML projects, a test on sample data can be included (e.g., run inference on a small image) to ensure pipelines and models function. A minimal YAML workflow would include steps to install dependencies (using poetry/mamba for speed in CI) and then `pre-commit run --all-files` followed by `pytest`.
- **Notebooks and Collaboration:** use **JupyterLab 4** (modern, supports plugins and real-time collaboration) or the **VSCode notebook interface** for prototyping. In shared or cloud contexts: _Deepnote_, _Google Colab_, or JupyterHub offer ready-to-use environments (Colab, for example, provides limited free GPUs). It's good practice to keep notebooks and code synchronized: _Jupytext_ (notebooks as paired scripts) can be used for easy versioning. To visualize geospatial data in notebooks, tools like **folium** (interactive Leaflet maps) or **ipyleaflet/leafmap** allow direct visualization of tiles, shapefiles, and model results (this will be explored in a couple of sections).

> **Tip:** configure all these tools from the start. For example, add to pyproject.toml: black, ruff, isort, mypy with consistent config (same line-length, etc.). Install pre-commit and activate it (`pre-commit install`) so that every git commit triggers the checks. These automations make development **"no drama"**: the developer can focus on AI/Geo logic, while the tools keep the code clean and functional.

#### Does all this make sense today with AI?

In recent years, the introduction of AI into development tools has revolutionized how we write, maintain, and version code. Yet, this revolution has not eliminated the need for good practices: it has simply shifted the focus of what truly matters. AI accelerates, suggests, generates, but does not guarantee quality and structural consistency. For this reason, many classic tools not only remain relevant but, in some cases, become more important than before.

Let's start with linting and formatting. It's no longer a matter of aesthetics, but of having more substance.

Formatters like **Black** remain indispensable. Even if AI produces already readable code, a consistent format is essential for clean diffs and friction-free reviews.

As for linters, tools like **Ruff** become fundamental not for aesthetic purposes (which AI already handles well), but for catching errors, unused imports, dead code, or risky patterns. The goal is not to make the code "prettier," but to prevent bugs introduced by overly optimistic generations.

Let's move on to the guardrails introduced by type checking.

With AI proposing complex code or plausible but not always correct functions, tools like **Mypy** or **Pyright** become essential as a safety net. Static typing is not just a quality measure, but a structural guide that AI itself uses to generate more precise solutions. Particularly, in a project's core modules, a semi-strict type checking profile enormously reduces the risk of silent errors (meaning errors that are not visible now but emerge later).

Now let's analyze what I believe is the most important point: **testing**.

With well-structured tests and snapshot tests for complex outputs, it's possible to ensure that AI-driven optimizations or refactors do not alter, shall we say, delicate behaviors.

We're almost at the end; now it's time for pre-commit, what I define as the sentinel between us and Git.

**Pre-commit** hooks continue to be useful as a final filter before code enters Git (here, by Git, I mean both GitHub and GitLab).

Black, Ruff, and some light cleanups like whitespace removal are often sufficient. Other heavier tools, like Mypy, can remain in CI to avoid local slowdowns. In personal projects, they can even be omitted, but in teams, it remains a mechanism that prevents small, unnecessary errors.

Finally, for independence and reproducibility, there's the classic CI/CD.

With AI facilitating the generation of entire code blocks, the probability of unintentionally destructive changes increases. A minimal CI pipeline, including linting, type checking, and tests, ensures that every push is valid in a clean and controlled environment.

This is a fundamental step to prevent AI-generated code from breaking distant functions or introducing regressions that are difficult to identify.

In conclusion, in a world where AI supports development, "code safety" tools do not disappear: they reposition themselves. Black standardizes, Ruff protects, Mypy or Pyright guide, Pytest ensures stability, CI guarantees reproducibility.

Therefore, AI does not eliminate the need for these practices. On the contrary, it makes them even more relevant because it increases the volume and speed of code produced.

Quality is no longer just a matter of writing, but of the ecosystem. And in this ecosystem, AI is a powerful accelerator, but not a substitute!

### 2.3 Docker and AI+GEO Containerization

This is a part that is very dear to me (so much so that I want to dedicate an entire series to Docker).

Containerizing the app allows for standardizing the development environment (especially for native libraries and GPU drivers) and thus facilitating the deployment phase. We present two examples of optimized **Dockerfiles**, one for a lightweight LLM/RAG service, the other for a heavy geospatial pipeline, and a table of recommended base images.

#### Example 1: Dockerfile for LLM/RAG + FastAPI service (CPU)

```Docker
# We use the lightweight Python version with Debian 12 "bookworm"
FROM python:3.12-slim-bookworm as base

# Update and install only git, without recommended packages, then clean the cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the service
RUN useradd -m appuser

# Set the working directory
WORKDIR /app

# Install a stable version of Poetry and configure package installation
RUN pip install --no-cache-dir poetry==1.8.2

# Copy project files and leverage Docker cache to speed up updates
COPY pyproject.toml poetry.lock ./
# Install dependencies (production only) directly into the global site-packages
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev

# Copy application code
COPY src/ ./src/
COPY main.py ./

# Run as non-root user
USER appuser

# Start Uvicorn exposing FastAPI externally
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```

**Note:** Here we use python:3.12-slim (~50MB) because it's a good compromise between size and functionality, as it avoids issues arising from using Alpine.
I decided to propose version 3.12 for maximum compatibility with other libraries.

Dependency installation is done in a separate layer by copying only `pyproject/lock` (to leverage Docker cache: if only the code changes and not the dependencies, all packages are not reinstalled).

Uvicorn serves the FastAPI app. This container is CPU-only (suitable for LLMs via external API or small models). If we wanted to include a local model (e.g., Transformers), it would be enough to add `RUN pip install transformers` or include it directly in poetry.

#### Example 2: Dockerfile for geospatial pipeline (with GDAL, optional GPU)
Let's now look at a more complex example, but also one more suitable for a GeoAI engineer.

For complex geospatial pipelines (raster analysis, photogrammetry, deep
learning on satellite imagery), an environment with many
native libraries (GDAL, PROJ, Rasterio) and often GPU support is necessary.
```Docker
# Stage 1 – builder with Miniconda and mamba
FROM continuumio/miniconda3:latest as builder

# The latest version of mamba is 2.3.3. Then we delete temporary files
RUN conda install -n base -c conda-forge mamba==2.3.3 \
    && conda clean -afy

# Copy the environment that lists geospatial packages (Python 3.12, GDAL,
# Rasterio, Geopandas, etc.)
COPY environment.yaml /tmp/environment.yaml

# Update the base environment with the libraries specified in environment.yaml
RUN mamba env update -n base -f /tmp/environment.yaml \
    && conda clean -afy

# Install additional packages with pip (e.g., Raster Vision)
RUN pip install --no-cache-dir rastervision==0.31.2

# Stage 2 – production image with CUDA 13.0.2 support
FROM nvidia/cuda:13.0.2-runtime-ubuntu22.04 AS production

# Copy the conda installation from the builder
COPY --from=builder /opt/conda /opt/conda

# Update the PATH variable to include conda
ENV PATH="/opt/conda/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy the source code
COPY src/ ./src/
COPY entrypoint.py ./

# Pipeline startup command
CMD ["python", "entrypoint.py"]

```

For the `environment.yaml` file, you can use:
```yaml
name: geoenv
channels:
  - conda-forge
dependencies:
  - python=3.12
  - gdal=3.12       # GDAL 3.12 is available via OSGeo containers
  - rasterio
  - geopandas
  - numpy
  - pandas
  - pyproj
  - pip
  - pip:
      - rastervision==0.31.2
      - torch==2.7.0
```

We have considered an example here taken from a [source](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application) from which, at the time, I also studied. I tried to update it based on the library versions updated to the date of this article.

In this multi-stage Dockerfile, we use the **Miniconda** image with mamba as a builder to resolve dependencies (in `environment.yaml` we specify, for example: gdal, rasterio, geopandas, pytorch, etc. with the conda-forge channel). This approach automatically manages native libraries (GEOS, PROJ, etc.) avoiding pip errors (e.g., `pip install gdal` would fail without GDAL dev installed).

In the second part, we start from a very slim nvidia **CUDA** runtime, which includes only the necessary drivers for PyTorch Tensor GPU.

We copy the conda installation from the builder, avoiding bringing along the compilation layers. The result is a ready image with GPU support and geospatial libs.

Below is a table of common **base images** for various scenarios:

| Base Image | Content | Recommended Use |
| --- | --- | --- |
| [**python:3.12-slim**](https://hub.docker.com/layers/library/python/3.12-slim/images/) | Debian slim + Python 3.x | Lightweight Python services (APIs, agents) - minimal (<50MB) |
| [**continuumio/miniconda3**](https://hub.docker.com/r/continuumio/miniconda3) | Miniconda + conda (base env) | Data science/[Full Geo](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Unlike%20pip%2C%20Conda%20package%20manager,python%2C%20we%20get%20following%20error); easy to install complex packages (e.g., GDAL) |
| [**mambaorg/micromamba**](https://micromamba-docker.readthedocs.io/en/latest/) | Micromamba in Alpine/CentOS | Build images with conda env in a lean way; ideal in multi-stage (downloads only required packages) |
| [**nvidia/cuda:13.0.2-runtime-ubuntu22.04**](https://hub.docker.com/r/nvidia/cuda) | CUDA libraries + base runtime | Add GPU support. To be used with pip/conda to install PyTorch/TF with compatible CUDA. Note that we are at version 13.0.2 now |
| [**pytorch/pytorch:2.7.0-cuda12.8-cudnn8-devel-ubuntu20.04**](https://hub.docker.com/r/pytorch/pytorch) | Python + PyTorch 2.0 + pre-installed CUDA | DL training/inference on GPU - avoids manual CUDA/cuDNN configurations. However, it also includes various libs (image ~>10GB). |
| [**ghcr.io/osgeo/gdal:ubuntu-full-3.12.0**](https://github.com/OSGeo/gdal/pkgs/container/gdal) | Ubuntu + pre-compiled GDAL (full drivers) | Intensive GIS/RS pipelines. |
| [**jupyter/scipy-notebook**](https://hub.docker.com/r/jupyter/scipy-notebook) | Python with Jupyter Notebook + SciPy stack | Ready-to-use notebook environments (CPU). Includes numpy, pandas, matplotlib, etc. Useful for interactive development, also on cloud (e.g., JupyterHub Docker Stacks). |

I don't exclude that there are

#### GPU Management

In on-prem deployments, enable GPU runtime with `--gpus all` on `Docker run` (using NVIDIA runtimes). In Kubernetes, use NVIDIA device plugins. If the host does not have a GPU, it will be sufficient for the image to still contain the correct libraries, and we can execute on CPU without errors, or delegate to Colab for GPU execution.

### 2.4 Managing "passwords" and configurations

Today, the word AI often calls for the word **API**, and consequently also **credentials (or config)** for services (e.g., Mapbox token, OpenAI key, database URL). It is crucial **not to embed** these values **in the source code**, but to **use configuration systems**.

#### .env Approach (local)
The simplest and most functional approach is certainly to use the classic `.env` file, which means putting the keys in a `.env` file excluded from git commands, and then loading it with [python-dotenv](https://pypi.org/project/python-dotenv/).

For [example](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration), the `config.py` file could be written as:

```python
from pydantic import BaseSettings  

class Settings(BaseSettings):  
    openai_api_key: str  
    db_url: str  
    debug: bool = False  
class Config:  
    env_file = ".env" # reads variables from .env  
    env_prefix = "MYAPP_" # optional: prefix required in env vars  
settings = Settings()
```

This code uses **Pydantic BaseSettings**. Using this code, at each startup, the application would read the environment variables (or from the .env file) and build a settings object.

This offers the advantage of **type validation** (e.g., if db_url must be a URL, Pydantic can validate it). Defaults can be defined, and Pydantic automatically converts types (int, bool, etc.) and handles nested configurations. Pydantic is excellent when _"the configuration structure is relatively simple and based on env var/.env"_, i.e., with few main parameters.

Furthermore, by integrating it with FastAPI, settings can be used as dependencies.

#### YAML/INI file approach + other classes

In larger projects or with many configurations, using YAML or TOML files for different environments can be more organized. For example, a schema:
```
config/
|_default.yaml  
|_dev.yaml  
|_prod.yaml
```
Libraries like **Dynaconf** support *multi-layer configuration* by loading multiple files and merging them based on an environment key.

[Dynaconf](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration) allows defining configs in different formats (YAML, TOML, Python) and distinguishes _development_ vs _production_ contexts, in addition to supporting encrypted secrets. It is indicated when _"complex, multi-source configurations with clear separation between environments are needed"_.

Alternatively, **Hydra** (from Facebook) allows composing configurations from modular files and overriding them via CLI. Hydra is common in research contexts for managing many parameters (e.g., model architecture, hyperparameters) and varying experiments simply by launching. Hydra automatically creates versioned output directories with the used config.

**Practical config tips:** If the app is relatively simple (few parameters and secrets), **Pydantic BaseSettings** offers simplicity and robustness (type-safe). If it grows in complexity (e.g., dozens of entries, multiple files), **Dynaconf** might be useful to avoid boilerplate and manage multiple sources. **Hydra** is excellent if you plan to do many run variations (typical in ML model training), but for a web service, it might be overkill.

#### Secret management in production

Never commit credentials. In cloud environments, use dedicated services: AWS Secrets Manager, GCP Secret Manager, Hashicorp Vault.

For example, on AWS, you can store the OPENAI_API_KEY and retrieve it dynamically in the ECS container or insert it as an environment variable through the configuration system (like Terraform).

Many CI/CD services (GitHub Actions, GitLab CI) offer an integrated vault to save secrets and make them available as env vars during deployment. Therefore, the recommended pattern is: **locally .env**, in CI/prod **env var** or encrypted config.

In summary, investing time in robust config/secret management ensures that the app can transition from dev to prod without manual code changes, minimizing leak risks (no keys in the repository, please).

### 2.5 Open Datasets and STAC/COG Catalogs for Disasters

For more on satellite sensors and data types, see the article [What Data Do Satellites Record?](../blog/en/geodata/).

For **Disaster Intelligence** projects, drawing on updated open datasets is crucial. Fortunately, between 2022-2025, **STAC** (SpatioTemporal Asset Catalog) catalogs and specialized datasets have increased. Here is a selection of _state-of-the-art_ datasets and resources:

| Dataset / Catalog | Data (type and resolution) | Coverage/Size | Task / Use | Source (link) |
| --- | --- | --- | --- | --- |
| **[xBD](https://arxiv.org/abs/1911.09296) / [xView2](https://xview2.org/)** (2019) | Maxar pre- and post-event satellite imagery (RGB, ~0.3 m/px, 1024×1024 tile); building annotations + damage class | [19 events of 5 different types](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world) (earthquakes, hurricanes, fires); [850k annotated buildings over ~45k km²](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images); 9k pre/post image pairs for training | **Building Damage Assessment** - building segmentation and damage classification (none, minor, moderate, major, destroyed) | [DIU xView2](https://xview2.org/) - [xBD Paper](https://arxiv.org/abs/1911.09296)) |
| **[C2SMS Floods](https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html)** (ended in 2023) | Sentinel-1 (SAR) + Sentinel-2 (Optical) co-registered, 512×512 px; binary masks with water (flood vs permanent water) | ~900 chip pairs from 18 global flood events | **[Flood segmentation (multimodal)](https://github.com/microsoft/PlanetaryComputerExamples/blob/main/competitions/s1floods/benchmark_tutorial.ipynb)**: training models to detect floodwater by combining SAR and optical | [Microsoft/Cloud to Street](https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf#:~:text=The%20C2S,oz32gz) |
| **Sen1Floods11** (2020) | Sentinel-1 GRD (SAR) chips 512×512 px; binary water mask | 4,831 chips from 11 flood events across 5 continents[\[59\]](https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1#:~:text=,to%20train%20and%20evaluate)[\[60\]](https://eod-grss-ieee.com/dataset-detail/ekFTRmNnWmtGOE52LzgrVUE4Ykd4dz09#:~:text=Sen1Floods11%20is%20a%20surface%20water,consists%20of%204%2C831%20512) (including Japan Tsunami 2011, Harvey 2017, etc.) | **Flood segmentation (SAR)** - benchmarking on radar only (robust even with clouds) | Cloud to Street - [IEEE Paper][\[61\]](https://openaccess.thecvf.com/content_CVPRW_2020/papers/w11/Bonafilia_Sen1Floods11_A_Georeferenced_Dataset_to_Train_and_Test_Deep_Learning_CVPRW_2020_paper.pdf#:~:text=,ter%20data%20set) (HuggingFace Datasets available) |
| **NASA/UN Flood Extents** (2023) | Sentinel-1 rasters (sigma0 backscatter, ~10 m) with vector flood delineation polygons | Recent global events (e.g., Pakistan 2022, cyclones 2023) - data released via UNOSAT or NASA. Size varies (e.g., Pakistan ~1000 rasters) | **Rapid flood mapping** - water segmentation via automated pipelines (Google, UN) | UNOSAT / NASA (HRC) - e.g., internal datasets shared on Radiant MLHub |

| **Maxar Open Data** (2017-2025) | High-resolution optical satellite imagery (30-50 cm) pre and post-disaster (GeoTIFF) | \>100 global events (Nepal Earthquake 2015, Beirut Explosion 2020, Libya Flood 2023, etc.) - coverage varies per event (tens of images each)[\[62\]](https://gee-community-catalog.org/projects/maxar_opendata/#:~:text=MAXAR%20Open%20Data%20Events%20,events%20like%20earthquakes%20and) | **Visual damage mapping** - quickly provides post-event CC BY 4.0 imagery for humanitarian uses, e.g., mapping collapsed buildings | Maxar Open Data Program (AWS OpenData)[\[63\]](https://www.reddit.com/r/AirlinerAbduction2014/comments/17190ge/maxar_technologies_open_data_list_of_the_last/#:~:text=Maxar%20Technologies%20Open%20Data%20List,some%20of%20these%20datasets) (includes STAC index on registry.opendata.aws) |
| **Copernicus EMS** (2015-) | _Analyst-derived_ products from imagery (GeoTIFF and shapefile): e.g., polygons of destroyed buildings, flood extent, damage grade maps (EMS-98) | Emergency activations in Europe and worldwide (thousands of maps for earthquakes, floods, fires) - resolution depends on imagery (Sentinel-2 10 m, Pléiades 0.5 m, etc.) | **Rapid Mapping** - official results from analysts in a few hours/days (useful ground truth for model training or verification) | Copernicus Emergency Mgt Service (public downloads per activation) |
| **Landslide4Sense / GDCLD** (2024) | Multi-source HR imagery (PlanetScope ~3 m, Gaofen-6 2 m, UAV ~0.1 m) with landslide masks (pixel polygons) | 9 global seismic events (Nepal 2015, Amatrice 2016, etc.) with various geological contexts[\[64\]](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These); ~60,000 labeled landslides. + Test on 1 rain-induced event. | **Landslide detection** - landslide segmentation in mountainous contexts. Allows training robust models on global datasets. | _Globally Distributed Coseismic Landslide Dataset_ - \[DOI Zenodo\][\[64\]](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These) (Fang et al, ESSD 2024) |
| **Planetary Computer STAC** (ongoing) | Cloud catalog of ~100 environmental/EO datasets: Sentinel-1, Sentinel-2, Landsat, MODIS, NAIP collections, etc., with STAC API and Azure storage for on-demand tiles | Global or national coverage depending on the dataset. Examples: Sentinel-2 L2A global (2017-2025), NAIP USA (aerial 60 cm). | **Base data hub** - standardized access to open geo imagery and data for custom analytics (subset, mosaic, etc.). Allows spatial and temporal queries via API.[\[65\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) | Microsoft Planetary Computer - \[Docs\][\[66\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=If%20you%27re%20viewing%20this%20repository,quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) (free API key required for high throughput) |
| **Radiant MLHub** (ongoing) | Catalog of **geospatial datasets for ML** with labels: e.g., LandCoverNet (global land use classification), BigEarthNet, Functional Map of World, etc. + pre-trained models | Various - global (LandCoverNet covers 5 continents), regional (crop type in Rwanda, etc.). Data often in chips/COCO format. | **Training data repository** - unifies curated datasets used in competitions and papers, ready for use with libraries (torchgeo, tf.data). | Radiant Earth - \[Registry on AWS\][\[67\]](https://registry.opendata.aws/radiant-mlhub/#:~:text=Radiant%20MLHub%20,as%20other%20training%20data)[\[68\]](https://medium.com/radiant-earth-insights/geospatial-models-now-available-in-radiant-mlhub-a41eb795d7d7#:~:text=Radiant%20MLHub%20has%20been%20the,ML%29%20algorithms%20since%202019) (free API key available) |
| **NOAA NGS Aerial** (various) | Post-event nadir oblique aerial imagery (~10-20 cm/px) | USA (coasts and areas affected by hurricanes, tornadoes, fires). Example: ~15k aerial photos after Hurricane Ian 2022 Florida[\[69\]](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote). | **Damage inspection** - used for visual damage assessment immediately after events (also input for CV - e.g., damaged roof detection). | NOAA NGS Emergency Response Imagery[\[69\]](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote) (viewer storms.ngs.noaa.gov, data downloadable via API) |

| **Planet Disaster Data** (2020-) | PlanetScope (3-5 m) and SkySat (~0.8 m) imagery with temporary free license for major disasters | Global, selective. Examples: Australia Fires 2020, Beirut 2020, etc. Often full event area coverage for subsequent days/weeks. | **Rapid Monitoring** - high-frequency (daily) optical imagery for monitoring disaster evolution. Useful for before/after time series not available elsewhere. | Planet/Open Region - (requires registration, data provided upon request or via partners)[\[70\]](https://esri-disasterresponse.hub.arcgis.com/pages/imagery#:~:text=disasterresponse,major%20earthquakes%2C%20floods%2C%20storms) |

These datasets allow for training and validating models for _damage assessment_, _flood mapping_, _change detection_, etc., leveraging real data from past events. We note the trend towards multi-modal datasets (SAR+optical combined), multi-event (generalization), and with **rich labeling** (not just binary, but degrees of damage, land cover type, etc.). For example, xBD remains the reference for damage detection with its unprecedented breadth[\[54\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images)[\[55\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world), while Cloud to Street's flood datasets combine Sentinel-1 and 2 to mitigate cloud cover issues[\[57\]](https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html#:~:text=The%20C2S,of%20chips%2C%20and%20water%20labels).

**Active STAC Catalogs:** The aforementioned Planetary Computer and Radiant MLHub offer uniform APIs for searching data by area and date. For example, with **pystac-client** we can query Planetary Computer:

```python
from pystac_client import Client  
catalog = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")  
search = catalog.search(collections=["sentinel-2-l2a"],  
intersects={"type": "Point", "coordinates": [30.5,50.5]},  
datetime="2023-06-01/2023-06-30")  
items = list(search.get_items())  
print(f"Found {len(items)} Sentinel-2 images in June 2023 in the AOI.")  
for item in items[:5]:  
print(item.id, item.assets["B04"].href) # prints link to band 4 (red)
```

_(Example of using pystac-client to search for Sentinel-2 images in an AOI and data period. It allows us to obtain URLs (often signed) to directly access the COG file, or download subsets.)_

Similarly, Radiant MLHub provides SDKs and APIs for downloading ML datasets. For example, with the radiant_mlhub package, we can query collections by name and download annotations.

**Other Notable Datasets 2025:** SpaceNet Challenges (1-8) have produced open datasets on building footprints, road network extraction, multi-year building change detection (SpaceNet 7), etc. Although somewhat dated, they remain valuable for benchmarks. For example, SpaceNet8 (2022) provides pre/post-flood PlanetScope imagery + flood masks and building footprints, useful for multimodal approaches (similar to xBD but for floods). Furthermore, datasets like **CASA Landslide** and **DMLD** (China) offer thousands of examples of landslides mapped in different regions[\[71\]](https://www.mdpi.com/2072-4292/16/11/1886#:~:text=The%20Diverse%20Mountainous%20Landslide%20Dataset,across%20different%20terrain%20in)[\[72\]](https://www.sciencedirect.com/science/article/pii/S2666592124000568#:~:text=Landslide%20detection%20based%20on%20deep,detect%20landslides%20in%20Linzhi%20City). The open community is also moving towards **geospatial foundation models**: e.g., _BigEarthNet_ (520k Sentinel-2 patches labeled with land cover) is used to pre-train ResNet/ViT-like models on satellite data.

### 2.6 Geospatial and Core RS Libraries

The geospatial Python ecosystem is mature. Key tools:

- **GDAL (osgeo)** - the _foundation_ library for GIS rasters and vectors. In Python, it is used indirectly via bindings (osgeo.gdal) but more often through more Pythonic wrappers:
- **rasterio** (for rasters) and **fiona** (for shapefiles) are Pythonic _wrappers_ of GDAL/OGR. _Rasterio_ offers GeoTIFF reading/writing, cropping, reprojection, and numpy-friendly functions.
- **Geopandas** (for vectors) combines Fiona + Shapely: it allows reading shapefiles/GeoJSON into DataFrames and using geographic operations (buffer, intersection) via Shapely in a vectorized manner. Excellent for non-enormous vector layers (up to ~100k entities).
- **Shapely 2.0** - geometric library (in C) used by geopandas; with v2, it natively supports _arrays_ (thanks to PyGEOS), making it very efficient on large sets of geometries.
- **pyproj** - manages coordinate systems and transformations (uses PROJ underneath).
- **rasterio vs rioxarray vs xarray**: _rasterio_ is ideal for high-performance file-by-file raster operations and batch processing (scripts); _xarray_ is preferable for analysis on data stacks like temporal cubes or large mosaics, thanks to _dask_ for parallelization. _rioxarray_ is an extension of xarray that adds geospatial awareness (CRS, transforms) using rasterio under the hood. **Ruff** - _"Rasterio is for speed, batch processing of many files, Rioxarray shines for interactive analytical work in notebooks"_ users note[\[73\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%207mo%20ago). However, be careful: rioxarray/xarray can consume a lot of memory if not well chunked, and on large datasets they sometimes crash, whereas rasterio still performs at lower speeds ("when large datasets slow down or crash with rioxarray, I switch to GDAL/rasterio which solves it in a few seconds" quote)[\[74\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%206mo%20ago)[\[75\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=This,to). **Tip:** use _xarray + dask_ for distributed processing (e.g., calculating NDVI on 1000 scenes) - dask will create a graph and execute in parallel (even on a cluster).
- **rio-tiler**: library for working with COG (Cloud Optimized GeoTIFF) and generating tiles (e.g., 256x256) for web visualization. It allows quickly extracting image portions via HTTP range requests and creating XYZ or WMTS tiles. Indispensable if building a map service (e.g., providing an interactive map of model predictions). Example: with rio-tiler you can get the PNG tile for zoom 15, x=17342,y=11945 from a COG in S3 with a single call, possibly including color mapping application.
- **folium / ipyleaflet / leafmap**: for visualizing results on interactive maps in Jupyter. _Folium_ is simple: it produces a Leaflet HTML map with markers, raster/vector layers (you can even add the URL of a tile server or a COG). _ipyleaflet_ is more advanced (bidirectional, reacts to Python in real-time) - e.g., it allows drawing a polygon on the map and having it in Python for analysis. _Leafmap_ provides a high-level API and also supports interfaces like Google Earth Engine. Integrating these libraries helps to **visually validate** model outputs (e.g., showing damaged buildings in red on a map).
- **TorchGeo**: deserves mention again here - it is an official _PyTorch Domain Library_[\[76\]](https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/#:~:text=Geospatial%20deep%20learning%20with%20TorchGeo,models%20specific%20to%20geospatial%20data) which provides dataset loaders for many geospatial datasets (like those above), samplers for extracting geolocated patches by balancing classes, and pre-trained models (e.g., a ResNet50 pre-trained on BigEarthNet). It simplifies the creation of training pipelines with PyTorch Lightning for tasks such as building segmentation, land use classification, etc., reducing the custom code to write. For example, TorchGeo includes the datamodule for xView2, so you can easily get pre/post pairs and damage masks with a simple API[\[77\]](https://github.com/torchgeo/torchgeo#:~:text=from%20torchgeo,trainers%20import%20SemanticSegmentationTask)[\[78\]](https://github.com/torchgeo/torchgeo#:~:text=datasets%20can%20be%20challenging%20to,reprojected%20into%20a%20matching%20CRS).
- **Others**: _scikit-image_ for raster filters (e.g., median filter to remove SAR speckle), _OpenCV_ if fast transformations are needed, _pySAR_ (or _Gamma_) for SAR processing (e.g., generating interferograms - specialist field). **SNAP** (from ESA) has Java APIs that can be called in Python (not trivial, but useful for Sentinel-1 pre-processing).

- **Geospatial databases**: if vector data becomes large, consider _PostGIS_ (PostgreSQL + GIS extension) to store and query efficiently. For example, building detection results for a city (millions of points) can be put into PostGIS and queried with spatial indexes (e.g., find damaged buildings within a 1 km radius of X coordinates). Or, in geospatial retrieval for LLM agents (see Spatial RAG), a spatial database can quickly filter candidates (as suggested by Yu et al. 2024[[79]](https://arxiv.org/html/2502.18470v5#:~:text=Answering%20real,the%20answering%20process%20as%20a)[[80]](https://arxiv.org/html/2502.18470v5#:~:text=geographic%20relationships%20and%20semantic%20user,retriever%20that%20combines%20sparse%20spatial)). With Python, you interact via SQLAlchemy/GeoAlchemy or directly with geopandas (which can read from PostGIS with read_postgis).

**When to use what:**
- If you only need to read a few images, perform pixel-wise calculations or masks => _rasterio_ + numpy is simple and sufficient.
- If you need to manage a large data stack (time series, data cube over a large area) => _xarray + dask_ is more appropriate (but requires thinking about chunking and memory).
- For streaming pipelines (many independent images) => leverage _concurrent.futures_ or _dask.bag_ with rasterio (which releases the GIL during I/O operations).
- For vectors, if <100k features => _geopandas_ is fine; >100k consider PostGIS or use _spatialindex_/Rtree for in-memory spatial queries.
- For _serving tile maps_ => _rio-tiler_ for the backend (cuts images) and _folium/ipyleaflet_ for frontend map.
- For _mixed raster-vector analysis_ (zonal stats, clip raster with mask) => _rasterstats_ is a useful package (built on rasterio).
- If you are working with _3D or LiDAR data_ => _PDAL_ (Point Data Abstraction Lib) with Python bindings or _pylas_ for LAS.

**Example Pipeline (Optical + SAR):** let's assume we want to identify flooded areas by combining Sentinel-1 and Sentinel-2:
1.  **Data loading:** we download a post-event Sentinel-2 image (e.g., infrared and red band) and a coeval Sentinel-1 image. We can use pystac-client to get the asset URLs and download them. We load with rasterio: `s2 = rasterio.open('sentinel2.tif')`, `s1 = rasterio.open('sentinel1.tif')`.
2.  **Pre-process:** we align resolution and CRS - e.g., we bring Sentinel-1 (10 m, VV polarization) into the Sentinel-2 grid (10 m). With rasterio: `rasterio.warp.reproject(source=s1.read(1), src_transform=s1.transform, src_crs=s1.crs, destination=arr, dst_transform=s2.transform, dst_crs=s2.crs, dst_shape=s2.shape)`. We obtain the registered SAR array.
3.  **Stack & filter:** we normalize the bands (e.g., Sentinel-1 in dB, applying a threshold to remove noise) and stack them: we build a 3-channel array: NIR, Red, SAR. We can do this with numpy on small images, or with xarray (a multi-band DataArray). We might apply a median filter on the SAR to reduce speckle.
4.  **Model inference:** we pass the tensor `[H,W,3]` to the segmentation model (e.g., U-Net trained on a flood dataset). We obtain a predicted binary mask.
5.  **Post-process & vectorize:** using _rasterio.features_, we transform the mask into a shapefile (flooded polygons). `shapes = rasterio.features.shapes(mask_pred, transform=s2.transform)` provides geometries; we filter those with minimum area and write them with geopandas into a GeoJSON.
6.  **Visualize/validate:** we open the map with folium: `folium.Map(...)`. Add Sentinel-2 RGB layer, then add semi-transparent flood polygons in blue.

This pipeline combines **rasterio** for I/O and warp, **numpy/scikit-image** for filters, **deep learning (PyTorch)** for inference, **rasterio.features/geopandas** for vector output. If the scale grows (very large or many images), we can distribute on dask: e.g., read images as dask arrays via rioxarray (`rioxarray.open_rasterio(..., chunks=...)`), perform lazy calculations, use map_blocks for model inference (if the model is deployed in a way that dask can call it - not trivial, but possible with dask.delayed). Or process iteratively by tile (e.g., 512x512).

**Integration with LLMs:** the final geospatial results (e.g., shapefiles of flooded areas with attributes) can be inserted into a textual _knowledge base_: for example, generate a brief summary in JSON or CSV (50 km² flooded in region X). An LLM agent can then perform simple geospatial queries via Python code (e.g., using _shapely_ to check if a point is within a flooded area) - as seen in recent research _Spatial-QA_ approaches.

In short, **Python geospatial libraries offer power similar to desktop GIS** but programmable: from simple buffers to complex spatial joins or mass reprojections. The key is to choose the right tool based on **scalability and complexity**: a mix of rasterio/geopandas for targeted tasks, xarray/dask for big data, dedicated databases/services if necessary. Fortunately, mutual compatibility is good (geopandas can use shapely/dask-geopandas for parallelism, rasterio interacts with numpy/xarray easily). All integrated with the PyData world (numpy, pandas) and now PyTorch/TensorFlow for ML models creates a **powerful ecosystem for geospatial AI**.

### 2.7 Project Templates, Reference Repos, and Best Practices

To build a **production-ready** stack, it's useful to study existing open-source projects that address similar problems. Here are **10 reference repositories and templates (2025)** from which to draw lessons, with motivation:

- **LangChain** - 【67†repo】 (framework for agents and LLM apps). **Why:** It's the de facto standard for orchestrating LLMs with memory, tools, and data augmentation. Study how it structures modular code (chains, agents), its **pyproject.toml** with _uv_ (they maintain it with uv and release frequently, ~14k commits), and how they manage integrations (e.g., vectorstores). _Update:_ v1.0 released 2025, very active repo (commits daily)[\[81\]](https://github.com/hwchase17/langchain/commits#:~:text=Commits%20%C2%B7%20langchain,%C2%B7%20fix%28infra%29%3A).
- **LlamaIndex (GPT Index)** - [\[82\]](https://github.com/run-llama/llama_index/releases#:~:text=Release%20Notes.%20%5B2025,core%20%5B0.14.0%5D.%20breaking%3A%20bumped) (data-centric RAG framework). **Why:** It provides patterns for indexing documents and images and performing efficient retrieval for LLMs. It has components for spatial queries (e.g., you could index coordinates and perform filtering). See how it implements various Storage and **readers for heterogeneous data**. Active Python repo (0.14.x releases in 2025).
- **Haystack** (deepset.ai) - [GitHub](https://github.com/deepset-ai/haystack). **Why:** End-to-end open-source QA pipeline, with support for document retrieval, generation, and even agents. They have a design oriented towards **producing APIs** (e.g., GraphQL) and composable YAML pipelines. Study how they define components (Reader, Retriever, Generator) and configuration management. Very production-friendly (used in companies). Regularly updated (v1.x in 2025).
- **TorchGeo** - 【49†repo】 (PyTorch GeoAI library). **Why:** Example of a well-designed _domain-specific_ library: see structure (modularity in datasets, samplers, models), thorough tests, and use of CI (they have integration with OSGeo, etc.). Actively maintained by Microsoft Research (recent commits 2025). Useful for understanding best practices in _packaging_ geospatial models (e.g., in HuggingFace Hub).
- **Segment Anything (Meta AI)** - [GitHub](https://github.com/facebookresearch/segment-anything). **Why:** Although not geospatial, _SAM_ has also had an impact in RS (used to segment generic objects in satellite images). The repo shows how to deploy a foundation model with interactive annotations. Study the **optimized inference pipeline** part (batched mask generation on large images) and the design of the demo notebook/web. Last update: 2023-11 (Meta released SAM-1).
- **xView2 First Place Solution** - [\[83\]](https://github.com/DIUx-xView/xView2_first_place#:~:text=DIUx,idea%20will%20be%20improved%20further) (DIUx-xView GitHub). **Why:** Code from a winning team for building damage. It allows seeing a complete project: data preprocessing from xBD, model (U-Net ensemble), inference and post-processing, and final packaging (they have scripts for inference on image directories). Although from 2019, many principles remain valid. PyTorch structure with JSON config, separate training and inference. Useful for understanding _tricks_ to improve performance (e.g., split model into two stages for localization vs classification[\[84\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20U,sampler%20or%20the%20decoder)).
- **SpaceNet 8 Baseline (Flood Detection)** - [\[85\]](https://github.com/SpaceNetChallenge/SpaceNet8#:~:text=Algorithmic%20baseline%20for%20SpaceNet%208,%C2%B7%20Finetune%20the) (spacenet8 repo). **Why:** An example of a **multimodal pipeline**: reads Sentinel-2 and -1, uses models to extract roads, buildings, and floods. It contains notebooks and scripts, and shows how to evaluate results with custom metrics. It teaches how to organize a challenge project and apply specific augmentations. Last update 2023.

- **Raster Vision** - [\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are) (Azavea). **Why:** General framework for CV on geospatial images, written with a plugin architecture. Allows defining training pipelines with JSON configs. Study its _config-driven design_, the use of Docker to isolate environments, and its components (scenario, dataset, backend). Demonstrates how a tool can abstract common tasks (clip, retiling, train, predict) for various problems. Updated to the latest version 0.31 in 2025[\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are).
- **Lightning + Hydra Template** - _Lightning-Hydra-Template_ (ashleve) - [GitHub](https://github.com/ashleve/lightning-hydra-template). **Why:** A very popular scaffolding repository for deep learning projects. Combines PyTorch Lightning for modular training and Hydra for managing experiment configs. Offers a clean structure (src with pl_modules, data_module, separate configs for dataset/model/training). Although general, it's useful for seeing best practices in _ML code organization_, logging (integrated neptune/mlflow), and train/val automation. Continuously updated with new best practices (v2024).
- **Cookiecutter MLOps** - (DrivenData Cookiecutter Data Science 2.0) - [GitHub](https://github.com/drivendata/cookiecutter-data-science). **Why:** A project template that emphasizes the complete cycle: data, modeling, deployment. Although more data-science oriented, it provides a reference on how to structure repositories with folders for raw data, intermediate data, saved models, reports, etc., and how to document decisions. Useful for not forgetting anything (e.g., it also includes CI setup and docs scaffolding).

In addition to these, monitor tech company repositories on _disaster response_ - e.g.: **Google's flood forecasting** (proprietary code, but detailed publications), **UNOSAT open products** (GIS scripts). And communities like **OSGeo** and **OMEN (Open Mapping)** for automatic mapping tools.

**Ideal Repository Structure (AI+Geo):** combining inspiration from the above, we recommend:
- **Modularize** by components: e.g., src/models/ for ML models, src/data/ for loading utilities, src/utils/geo.py for geospatial functions (buffer, reproject, etc.), src/api/ for FastAPI code.
- **Configs outside code**: use Hydra or Pydantic as discussed. Provide example configs for datasets (especially if open) so that new contributors can easily replicate results by pointing to the correct paths.
- **Makefile/CLI**: provide quick commands: make data (downloads open dataset), make train (starts training if applicable), make infer (performs inference on example input), make serve (launches API). This reduces friction in executing parts of the project.
- **Comprehensive README**: explain architecture, how to set up the environment, run tests, etc. See LangChain's README[\[6\]](https://github.com/langchain-ai/langchain#:~:text=LangChain%20is%20a%20framework%20for,as%20the%20underlying%20technology%20evolves) or TorchGeo for examples of clear documentation and build badges.
- **Tests & CI**: include some tests even for geospatial functions (e.g., a test that creates a geometry, applies a buffer, and compares the expected area). Or tests that the loaded model produces output with correct dimensions on a dummy input.

Finally, general **best practices**: version models (use semver or date to know with which data they were trained), keep track of _cron jobs_ if any (e.g., daily data update), and include monitoring tools if in production (Prometheus exporter for resources and perhaps a counter for how many times a certain inference function is called).

### 2.8 Practical Plan: Complete Setup in 7-10 Days

We now propose a _day-by-day_ roadmap (approximately 2-3 hours per day for a week) to build the local stack and move it towards minimal production.

**Day 1: Environment and Initial Structure**  
**Objective:** Set up the Python environment and the basic project structure.  
\- _Activity:_ Install pyenv and create a new Python 3.11 version if necessary. Initialize a git repository (git init). Choose the **environment manager** (e.g., Poetry vs Conda): to start, you can use Poetry for simplicity. Run poetry init and immediately add main dependencies: poetry add rasterio geopandas shapely torch torchvision fastapi uvicorn.  
\- _Commands:_ pyenv install 3.11.5 && pyenv local 3.11.5 (or use the system/conda interpreter), poetry init, poetry add .... Create the folder structure as in §2.1 (you can use cookiecutter data science as a reference).  
\- _Result:_ Project with directory layout, active Python env with core packages installed. Verify crucial imports (open REPL: import rasterio, torch, geopandas to confirm they work - if geopandas complains about gdal, you might need apt-get install libgdal-dev or install via conda instead). In case of dependency issues (e.g., GDAL), adjust using conda: e.g., create env with mamba create -n myenv python=3.11 gdal rasterio geopandas.

**Day 2: Tooling and Code Quality**  
**Objective:** Configure pre-commit, lint, formatter, test scaffolding.  
\- _Activity:_ Add _Black, Ruff, Mypy_ to the project (poetry add --dev black ruff mypy pre-commit pytest). Create .pre-commit-config.yaml with hooks:  

repos:  
\- repo: <https://github.com/astral-sh/ruff-pre-commit>  
rev: v0.5.4  
hooks:  
\- id: ruff  
args: \["--fix"\] # let ruff apply simple fixes  
\- repo: <https://github.com/psf/black>  
rev: 23.9.1  
hooks:  
\- id: black  
\- repo: <https://github.com/pre-commit/mirrors-mypy>  
rev: v1.5.1  
hooks:  
\- id: mypy  
\- repo: local  
hooks:  
\- id: pytest  
name: pytest  
entry: pytest  
language: system  
files: "^tests/"

Install the pre-commit hooks (pre-commit install). Create configuration files in pyproject.toml for black/ruff (line-length, etc. as in Medium combos[\[41\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%23%20pyproject.toml%20%5Btool.black%5D%20line,version%20%3D%20%5B%22py311)). Create a test stub in tests/test_basic.py with a trivial assertion (e.g., assert 2+2==4).  
\- _Commands:_ pre-commit run --all-files to test the hooks immediately. pytest to see that the suite (with 1 trivial test) passes.  
\- _Result:_ Every commit will now automatically format the code and flag issues. The test base is set up (even if trivial). The introduction of lint or type-check errors will be blocked by the hook, ensuring standards from the first code written.

**Day 3: Example Data Ingestion**  
**Objective:** Download a small example dataset (e.g., 1 event) and implement reading scripts.  
\- _Activity:_ Choose a target dataset - e.g., images and labels of Hurricane Harvey 2017 (flood). Use the planetary STAC API or directly known links (Maxar Open Data, etc.) to download 1-2 pre and post images and some vector labels. Write a Python script in src/data/download_data.py that downloads these files (you can use requests or pystac-client + urllib). Implement a function to load a pair of rasters into memory (use rasterio).  
\- _Commands:_ Example: poetry add requests pystac-client. Run the script: python src/data/download_data.py --event harvey (parameterize based on the event). This should save files in data/raw/harvey/.  
\- _Result:_ You have a subset of local data. Verify by opening with rasterio that the files are readable and check dimensions. This prepares the ground for developing pipelines without downloading every time (add data to .gitignore). - _Extra:_ You could write a test for the load function (e.g., assert img.shape == (….) expected). Or generate a synthetic image for testing (useful for CI: you won't want to download 100MB of data in CI, but you can create a 10x10 GeoTIFF in memory and pass it to functions to test the flow).

**Day 4: Model and Geospatial Pipeline**  
**Objective:** Implement the optical+SAR -> prediction -> vectorization pipeline on a test case.  
\- _Activity:_ If you have a pre-trained model (e.g., you could use placeholders like: if SAR pixel > X and NDVI &lt; Y =&gt; flood), implement it now in src/models/model.py as the predict_flood(mask, arr_s2, arr_s1) function. Otherwise, if you have time/data, you can train a small model: install Lightning (poetry add lightning) and write a segmentation LightningModule. But given the time constraints, let's assume we use a simple heuristic or a loaded pre-trained model (e.g., use torchvision segmentation weights and adapt them).  
\- _Commands:_ Run the complete pipeline on a test tile: read the images (Day3), pass them to the model, get the mask. Use geopandas to convert to vector and save the shapefile in data/predictions/. Visualize the result (you can create a small script with folium that loads the image and overlays the shapefile - open it in a browser).  
\- _Result:_ Functional local pipeline on at least one input. Qualitative validation: if the model is not trained, it's fine to just see that it produces _something_. This step consolidates the integration between geospatial and ML components. - _Extra:_ Add logs or print results (e.g., % flooded pixels: 12%). You can also calculate a metric if you have ground truth for that image (if there's a manual mask in the dataset, compare it with the predicted one).

**Day 5: Service API and LLM Integration**  
**Objective:** Create a FastAPI microservice that exposes the functionality and integrates an LLM for Q&A.  
\- _Activity:_ Write a FastAPI app in src/api/app.py with endpoints: /predict that might accept coordinates or an event ID and returns how many buildings/floods were found; /ask that accepts a user question and uses an LLM chain to answer. For the latter, you need to integrate the LLM: you can use OpenAI API (if you have a key) or a local open model (install pip install openai or transformers + an HF model). Implement simply: receive a question, in the backend call the internal function (which eventually consults geospatial results - if the question is like "how many buildings damaged at X", query geopandas data). Finally, compose the answer - if you have OpenAI, send it with a prompt containing the data as context.  
\- _Commands:_ Start the local server: uvicorn src.api.app:app --reload and test queries with curl or in the browser (FastAPI doc UI). Example: GET /predict?event=harvey -> returns JSON {"flooded_area_km2": ..., "buildings_damaged": ...}. Then POST /ask with body {"question": "How many buildings were damaged by Hurricane Harvey?"} -> the code takes buildings_damaged from the previous output and formulates "Approximately XYZ buildings were damaged." (In the future, this would be done via an agent).  
\- _Result:_ A prototype **disaster API** service. Not yet robust or secure, but it demonstrates the idea. - _Extra:_ Integrate the actual LLM - if OpenAI, add the key to .env and use openai.Completion.create(prompt=...). Or if local, load a small model (e.g.: pip install sentence-transformers and use a Q/A model like "deepset/roberta-base-squad2" with Transformers QA pipeline).

**Day 6: Dockerization and Portability**  
**Objective:** Create the Docker image of the app and test it (CPU).  
\- _Activity:_ Write the Dockerfile based on the examples (§2.3). Since the focus is lightweight (no heavy training), you could use Python slim + pip. Pay attention to geospatial dependencies: add apt-get for geos/gdal in the Dockerfile. Example:  

```dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y libgdal-dev libgeos-dev
...
RUN pip install -r requirements.txt
```

(Or use a miniconda image and conda install). Copy the app and entrypoint.  
\- _Commands:_ docker build -t myapp:dev . (from the root) and then docker run --rm -p 8000:8000 myapp:dev. Verify that by making the same requests as Day5, you get responses. If it works in Docker, you've resolved any native dependency gaps. If it fails (e.g., Import GDAL errors), experiment with a different base image (conda).  
\- _Result:_ Functional local container. This simulates the production environment. Current image size? Perhaps ~1-2 GB with all libs (geopandas and Torch inflate it a bit). Consider optimizing with multi-stage if time permits. - _Extra:_ Test multi-arch: if you only have local CPU, at least you've tested on linux/amd64.

**Day 7: Cloud Deployment or Documentation**  
_(Optional, if you wish to proceed further)_  
**Objective:** Prepare the ground for deployment and write final documentation.  
\- _Activity:_ Write user documentation: how to use the API, how to replicate results (perhaps in README). Optionally, create a _smoke test_ script in tests/test_api.py that starts a FastAPI test client and calls /predict on a sample, verifying the response format.  
\- Consider where to deploy: you could try **Heroku** (simple for FastAPI, but without GPU) or **Railway**. Configure the Dockerfile for production (e.g., use gunicorn).  
\- Set up optional CI/CD: for example, a GitHub Actions workflow that builds the image and publishes it to Docker Hub on push to main.  
\- _Result:_ Project ready to be shared: code, Docker, documentation, and perhaps a live link (even if performance is limited in the free tier).

Naturally, each phase may require adjustments. For example, you might discover a missing package – resolved by adding it and regenerating poetry.lock or environment.yml (a reason to fix the environment early).

The plan anticipates ~7 days, but could extend to 10 if you dedicate time to custom model training or refining the LLM agent. In that case: Day 8-9 could be dedicated to fine-tuning a model (using open datasets and saving the weights), and Day 10 to integrating that output into the service (e.g., a /retrain endpoint if you want continuous MLOps).

### 2.9 Immediate Actions (first 24h)

To get started immediately, here's a quick checklist of the first actions to take:

- **1\. Prepare the development environment:** Install Anaconda/Miniconda or Poetry on your Linux system. Update NVIDIA drivers if you plan to test on a remote GPU (Colab). Create a new, clean Python 3.11 environment.
- **2\. Initialize the project:** Structure the folders as described and start a git repo. Create a remote repository (GitHub) and make the first commit with README.md and pyproject.toml/requirements.txt.
- **3\. Configure Dev tools:** Immediately set up pre-commit and Black/Ruff. Run pre-commit install so that every file you create will already be formatted and linted on commit. This prevents you from accumulating technical style debt.
- **4\. Retrieve sample datasets:** Identify a small event (even just a pre/post image from Maxar Open Data or Copernicus EMS). Download them manually for now (via browser or AWS CLI) and place them in data/raw/. In parallel, request any necessary API keys (e.g., OpenAI API if you intend to use it).
- **5\. Study references:** Dedicate a few hours to reading documentation for 1-2 key tools you'll use first. For example: basic rasterio syntax (read the official tutorial), basic FastAPI usage (how to define an endpoint and run uvicorn), and if you're unfamiliar, the pystac-client guide to understand how to query STAC data[\[87\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=The%20following%20code%20creates%20an,Microsoft%20Planetary%20Computer%20root%20catalog)[\[88\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=,Microsoft%20Planetary%20Computer%20STAC%20API). This initial investment will save you headaches later.
- **6\. Set config variables:** Create an .env.example file containing expected keys (e.g., OPENAI_API_KEY=) and add it to git. Copy it to .env and populate for dev. Include in the README how to obtain and set these variables (e.g., link to the OpenAI page to create a key).
- **7\. Plan computational resources:** Since you don't have a local GPU, decide how to test heavy parts. Example: configure a notebook on Colab with a linked GitHub repo, so you can perform inference on GPU there if needed. Or ensure the code is parameterized to use .to('cpu') as default and still functions.
- **8\. Communicate and document:** Even if you are the sole developer, get used to maintaining clear changelogs or commit messages. For example, after Day1, write a commit "setup environment, add base deps (rasterio, torch, etc.) - verify imports OK". This will help you track progress and facilitate potential involvement of other collaborators in the future.

By following these actions in the first 24 hours, you will lay solid foundations: a ready environment, a repo configured with quality gates, and data available to start developing the **core functionality**. From there, you can iterate, gradually building the pipeline, knowing you have a professional _scaffolding_ around you (tests, lint, containers) that supports you in producing reliable and reproducible code.

[\[1\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=Our%20main%20algorithm%20of%20choice,algorithm%20for%20semantic%20image%20segmentation) [\[54\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images) [\[55\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world) [\[84\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20U,sampler%20or%20the%20decoder) The xView2 AI Challenge | IBM

<https://www.ibm.com/think/insights/the-xview2-ai-challenge>

[\[2\]](https://github.com/torchgeo/torchgeo#:~:text=Image%3A%20TorchGeo%20logo) [\[3\]](https://github.com/torchgeo/torchgeo#:~:text=First%20we%27ll%20import%20various%20classes,used%20in%20the%20following%20sections) [\[77\]](https://github.com/torchgeo/torchgeo#:~:text=from%20torchgeo,trainers%20import%20SemanticSegmentationTask) [\[78\]](https://github.com/torchgeo/torchgeo#:~:text=datasets%20can%20be%20challenging%20to,reprojected%20into%20a%20matching%20CRS) GitHub - torchgeo/torchgeo: TorchGeo: datasets, samplers, transforms, and pre-trained models for geospatial data

<https://github.com/torchgeo/torchgeo>

[\[4\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=search%20engines%20with%20LLMs%20to,more%20accurate%20and%20reliable%20answers) [\[5\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=This%20teamwork%20reduces%20the%20chance,existent%20street) [\[9\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=A%20RAG%20pipeline%20works%20like,The%20team%20includes) [\[10\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=capture%20the%20essence%20of%20each,or%20another%20LLM%2C%20the%20model%E2%80%99s) [\[11\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=Image%3A%20rag%20pipeline%20architecture%20diagram) [\[12\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=find%20documents%20discussing%20%E2%80%9Creturns%2C%E2%80%9D%2C%20%E2%80%9Cdownloads%2C%20%E2%80%9D,of%20the%20context%20it%20receives) How to Build a RAG Pipeline: A Step-by-Step Guide

<https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline>

[\[6\]](https://github.com/langchain-ai/langchain#:~:text=LangChain%20is%20a%20framework%20for,as%20the%20underlying%20technology%20evolves) [\[7\]](https://github.com/langchain-ai/langchain#:~:text=Why%20use%20LangChain%3F) GitHub - langchain-ai/langchain: The platform for reliable agents.

<https://github.com/langchain-ai/langchain>

[\[8\]](https://arxiv.org/html/2502.18470v5#:~:text=On%20the%20other%20hand%2C%20large,zhang2024bb%20%2C%20but%20the%20resulting) [\[79\]](https://arxiv.org/html/2502.18470v5#:~:text=Answering%20real,the%20answering%20process%20as%20a) [\[80\]](https://arxiv.org/html/2502.18470v5#:~:text=geographic%20relationships%20and%20semantic%20user,retriever%20that%20combines%20sparse%20spatial) Spatial-RAG: Spatial Retrieval Augmented Generation for Real-World Geospatial Reasoning Questions

<https://arxiv.org/html/2502.18470v5>

[\[13\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20OG%20of%20Python%20package,be%20completely%20decoupled%20from%20a) [\[14\]](https://dublog.net/blog/so-many%2Dpython%2Dpackage%2Dmanagers/#:~:text=One%20of%20the%20key%20faults,that%20are%20no%20longer%20useful) [\[17\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Furthermore%2C%20as%20of%202024%2C%20the,actual%20conflict%20in%20the%20DAG) [\[18\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=) [\[19\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20core%20tradeoff%20with%20,possible%20leading%20to%20a%20potentially) [\[20\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=tools%20like%20,to%20build%20and%20publish%20Python) [\[21\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=specify%20upper%20and%20lower%20bounds,intended%20to%20be%20used%20widely) [\[22\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=pdm) [\[23\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Unlike%20the%20other%20tools%20on,on%20multiple%20versions%20of%20python) [\[24\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20downside%20to%20,%E2%80%9Cidiomatic%E2%80%9D%20in%20the%20long%20run%E2%80%A6) [\[27\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=,it%20was%20released%20in%202022) [\[28\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=written%20in%20Rust%20and%20is,rye) [\[30\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=dependencies.%20In%20mid%202024%2C%20,for%20reproducibility) [\[33\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=One%20thing%20to%20note%20about,were%20using%20for%20different%20projects) [\[34\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Verdict) [\[39\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=drop,it%20was%20released%20in%202022) [\[40\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=linter%20notes,it%20was%20released%20in%202022) Python has too many package managers

<https://dublog.net/blog/so-many-python-package-managers/>

[\[15\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Unlike%20pip%2C%20Conda%20package%20manager,python%2C%20we%20get%20following%20error) [\[16\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Python%20GDAL%20requires%20,while%20using%20Conda%20package%20manager) [\[45\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=We%20are%20starting%20from%20Miniconda,of%20dockerfile%20are%20as%20follows) Docker image for geospatial python application

<https://www.geosynopsis.com/posts/docker-image-for-geospatial-application>

[\[25\]](https://docs.astral.sh/uv/#:~:text=,boost%20with%20a%20familiar%20CLI) uv

<https://docs.astral.sh/uv/>

[\[26\]](https://www.reddit.com/r/learnpython/comments/1fyvk0v/poetry_conda_pipenv_or_just_pip_what_are_you_using/#:~:text=updoot%20for%20,Here%20is%20their%20site) Poetry, Conda, Pipenv or just Pip. What are you using? : r/learnpython

<https://www.reddit.com/r/learnpython/comments/1fyvk0v/poetry_conda_pipenv_or_just_pip_what_are_you_using/>

[\[29\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=benchmarks%20show%20that%20pixi%20is,on%20a%20M2%20MacBook%20Pro) [\[31\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=In%20comparison%20with%20conda%2C%20pixi,conda%20packages%20for%20real%20reproducibility) [\[32\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Reason%203%3A%20No%20more%20Miniconda,base%20environment) [\[35\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=At%20prefix%2C%20we%E2%80%99re%20solving%20conda,tasks%20for%20collaboration%2C%20and%20more) [\[36\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Image) 7 Reasons to Switch from Conda to Pixi | prefix.dev

<https://prefix.dev/blog/pixi_a_fast_conda_alternative>

[\[37\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%5Btool.ruff%5D%20target,by%20Black%20fix%20%3D%20true) [\[38\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=line,by%20Black%20fix%20%3D%20true) [\[41\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%23%20pyproject.toml%20%5Btool.black%5D%20line,version%20%3D%20%5B%22py311) [\[42\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%5Btool.mypy%5D%20python_version%20%3D%20,true%20plugins%20%3D) [\[44\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=friction%20Python%20code%20quality%20with,commit%2C%20CI%2C%20and%20editor%20tips) 10 mypy/ruff/black/isort Combos for Zero-Friction Quality | by Syntal | Oct, 2025 | Medium

<https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac>

[\[43\]](https://github.com/syrupy-project/syrupy#:~:text=syrupy,assert%20immutability%20of%20computed%20results) syrupy-project/syrupy: :pancakes: The sweeter pytest snapshot plugin

<https://github.com/syrupy-project/syrupy>

[\[46\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[47\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=%5Bproduction%5D%20DATABASE_URL%20%3D%20,Dynaconf%20can%20handle%20encrypted%20secrets) [\[48\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=API_KEY%20%3D%20%22%40STRONGLY_ENCRYPTED%3Aprod_api_key_encrypted_value%22%20,can%20handle%20encrypted%20secrets) [\[49\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[50\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=%5Bdevelopment%5D%20DATABASE_URL%20%3D%20) [\[51\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=DATABASE_URL%20%3D%20) [\[52\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[53\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=print%28f,Debug%20Mode%3A%20%7Bsettings.get%28%27DEBUG_MODE) Pydantic BaseSettings vs. Dynaconf A Modern Guide to Application Configuration | Leapcell

<https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration>

[\[56\]](https://openaccess.thecvf.com/content_CVPRW_2019/papers/cv4gc/Gupta_Creating_xBD_A_Dataset_for_Assessing_Building_Damage_from_Satellite_CVPRW_2019_paper.pdf#:~:text=Imagery%20openaccess,of%20imagery%20from%2015%20countries) \[PDF\] A Dataset for Assessing Building Damage from Satellite Imagery

<https://openaccess.thecvf.com/content_CVPRW_2019/papers/cv4gc/Gupta_Creating_xBD_A_Dataset_for_Assessing_Building_Damage_from_Satellite_CVPRW_2019_paper.pdf>

[\[57\]](https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html#:~:text=The%20C2S,of%20chips%2C%20and%20water%20labels) Cloud to Street - Microsoft flood dataset - CMR Search

<https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html>

[\[58\]](https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf#:~:text=The%20C2S,oz32gz) \[PDF\] C2SMS Floods - NET

<https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf>

[\[59\]](https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1#:~:text=,to%20train%20and%20evaluate) (PDF) Sen1Floods11: a georeferenced dataset to train and test deep ...

<https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1>

[\[60\]](https://eod-grss-ieee.com/dataset-detail/ekFTRmNnWmtGOE52LzgrVUE4Ykd4dz09#:~:text=Sen1Floods11%20is%20a%20surface%20water,consists%20of%204%2C831%20512) Sen1Floods11 - Earth Observation Database

<https://eod-grss-ieee.com/dataset-detail/ekFTRmNnWmtGOE52LzgrVUE4Ykd4dz09>

[\[61\]](https://openaccess.thecvf.com/content_CVPRW_2020/papers/w11/Bonafilia_Sen1Floods11_A_Georeferenced_Dataset_to_Train_and_Test_Deep_Learning_CVPRW_2020_paper.pdf#:~:text=,ter%20data%20set) \[PDF\] Sen1Floods11: A Georeferenced Dataset to Train and Test Deep ...

<https://openaccess.thecvf.com/content_CVPRW_2020/papers/w11/Bonafilia_Sen1Floods11_A_Georeferenced_Dataset_to_Train_and_Test_Deep_Learning_CVPRW_2020_paper.pdf>

[\[62\]](https://gee-community-catalog.org/projects/maxar_opendata/#:~:text=MAXAR%20Open%20Data%20Events%20,events%20like%20earthquakes%20and) MAXAR Open Data Events - awesome-gee-community-catalog

<https://gee-community-catalog.org/projects/maxar_opendata/>

[\[63\]](https://www.reddit.com/r/AirlinerAbduction2014/comments/17190ge/maxar_technologies_open_data_list_of_the_last/#:~:text=Maxar%20Technologies%20Open%20Data%20List,some%20of%20these%20datasets) Maxar Technologies Open Data List of the Last Decade of Global ...

<https://www.reddit.com/r/AirlinerAbduction2014/comments/17190ge/maxar_technologies_open_data_list_of_the_last/>

[\[64\]](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These) ESSD - A globally distributed dataset of coseismic landslide mapping via multi-source high-resolution remote sensing images

<https://essd.copernicus.org/articles/16/4817/2024/>

[\[65\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) [\[66\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=If%20you%27re%20viewing%20this%20repository,quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) GitHub - microsoft/PlanetaryComputerExamples: Examples of using the Planetary Computer

<https://github.com/microsoft/PlanetaryComputerExamples>

[\[67\]](https://registry.opendata.aws/radiant-mlhub/#:~:text=Radiant%20MLHub%20,as%20other%20training%20data) Radiant MLHub - Registry of Open Data on AWS

<https://registry.opendata.aws/radiant-mlhub/>

[\[68\]](https://medium.com/radiant-earth-insights/geospatial-models-now-available-in-radiant-mlhub-a41eb795d7d7#:~:text=Radiant%20MLHub%20has%20been%20the,ML%29%20algorithms%20since%202019) Geospatial Models Now Available in Radiant MLHub - Medium

<https://medium.com/radiant-earth-insights/geospatial-models-now-available-in-radiant-mlhub-a41eb795d7d7>

[\[69\]](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote) Hurricane IAN Imagery

<https://storms.ngs.noaa.gov/storms/ian/index.html>

[\[70\]](https://esri-disasterresponse.hub.arcgis.com/pages/imagery#:~:text=disasterresponse,major%20earthquakes%2C%20floods%2C%20storms) Imagery - Esri Disaster Response Program - ArcGIS Online

<https://esri-disasterresponse.hub.arcgis.com/pages/imagery>

[\[71\]](https://www.mdpi.com/2072-4292/16/11/1886#:~:text=The%20Diverse%20Mountainous%20Landslide%20Dataset,across%20different%20terrain%20in) The Diverse Mountainous Landslide Dataset (DMLD) - MDPI

<https://www.mdpi.com/2072-4292/16/11/1886>

[\[72\]](https://www.sciencedirect.com/science/article/pii/S2666592124000568#:~:text=Landslide%20detection%20based%20on%20deep,detect%20landslides%20in%20Linzhi%20City) Landslide detection based on deep learning and remote sensing ...

<https://www.sciencedirect.com/science/article/pii/S2666592124000568>

[\[73\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%207mo%20ago) [\[74\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%206mo%20ago) [\[75\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=This,to) Rasterio vs Rioxarray : r/remotesensing

<https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/>

[\[76\]](https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/#:~:text=Geospatial%20deep%20learning%20with%20TorchGeo,models%20specific%20to%20geospatial%20data) Geospatial deep learning with TorchGeo - PyTorch

<https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/>

[\[81\]](https://github.com/hwchase17/langchain/commits#:~:text=Commits%20%C2%B7%20langchain,%C2%B7%20fix%28infra%29%3A) Commits · langchain-ai/langchain - GitHub

<https://github.com/hwchase17/langchain/commits>

[\[82\]](https://github.com/run-llama/llama_index/releases#:~:text=Release%20Notes.%20%5B2025,core%20%5B0.14.0%5D.%20breaking%3A%20bumped) Releases · run-llama/llama_index - GitHub

<https://github.com/run-llama/llama_index/releases>

[\[83\]](https://github.com/DIUx-xView/xView2_first_place#:~:text=DIUx,idea%20will%20be%20improved%20further) DIUx-xView/xView2_first_place: 1st place solution for "xView2 - GitHub

<https://github.com/DIUx-xView/xView2_first_place>

[\[85\]](https://github.com/SpaceNetChallenge/SpaceNet8#:~:text=Algorithmic%20baseline%20for%20SpaceNet%208,%C2%B7%20Finetune%20the) Algorithmic baseline for SpaceNet 8 Challenge - GitHub

<https://github.com/SpaceNetChallenge/SpaceNet8>

[\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are) Raster Vision - Free and Open Machine Learning - NO Complexity

<https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html>

[\[87\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=The%20following%20code%20creates%20an,Microsoft%20Planetary%20Computer%20root%20catalog) [\[88\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=,Microsoft%20Planetary%20Computer%20STAC%20API) Usage - pystac-client 0.8.5 documentation

<https://pystac-client.readthedocs.io/en/stable/usage.html>
