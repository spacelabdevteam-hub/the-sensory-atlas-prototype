# 🌿 The Sensory Atlas — 3D Contemplative Exploration Prototype

[![Three.js](https://img.shields.io/badge/Three.js-r160-black?logo=three.js)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-2.0-red)](https://www.khronos.org/webgl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Atlas_Roma_01-blue)](https://spacejourney.app/play/roma-atlas/)

An open-source, lightweight isometric 3D spatial exploration prototype developed for **[Space Journey](https://spacejourney.app/)**, the 21st-century platform for sensory travel, acoustic well-being, and mindful urban exploration.

Built with **Three.js** and **WebGL**, this project demonstrates how historical environments (such as Ancient Rome and the Roman Forum) can be rendered interactively with zero tourist clutter, optimal golden-hour lighting, and soundscape awareness.

---

## 🧭 Live Interactive Experiences

Explore the active modules running in production:

* **[Live 3D Sensory Atlas (Rome Pilot)](https://spacejourney.app/play/roma-atlas/)** — Interactive isometric viewer exploring acoustic refuges in Rome.
* **[Roman Forum Viewer](https://spacejourney.app/play/foro-romano/)** — Spatial reconstruction prototype with real-time camera controls.
* **[Sensory Itinerary Planner](https://spacejourney.app/en/itinerary-planner/)** — Algorithmic route planning based on physical fatigue and sensory noise limits *(also in [Español](https://spacejourney.app/planificador-de-viajes/) & [Português](https://spacejourney.app/pt-br/planejador-de-viagens/))*.
* **[AI Journey Assistant & Sensory Copilot](https://spacejourney.app/en/ai-journey-assistant/)** — Conversational AI guide for mindful itineraries and crowd avoidance *(also in [Español](https://spacejourney.app/ai-journey-assistant/) & [Português](https://spacejourney.app/pt-br/ai-journey-assistant/))*.

---

## 🛠️ Tech Stack & Architecture

* **Rendering Engine:** Three.js (WebGL 2.0).
* **Camera System:** Orthographic isometric projection (snapping angle: 35.264°).
* **Color Palette:** Solarpunk Aesthetic (Deep Space Obsidian `#061212`, Solar Gold `#F59E0B`, Emerald Zenith `#10B981`).
* **Performance:** Ultra-lightweight footprint (< 1 MB total payload) for instant mobile loading.

---

## 🚀 Quick Start (Local Setup)

Clone and run the interactive viewer locally:

```bash
# Clone the repository
git clone https://github.com/spacelabdevteam-hub/the-sensory-atlas-prototype.git

# Navigate to project directory
cd the-sensory-atlas-prototype

# Serve locally with any static server (e.g. Python or Node)
python -m http.server 8000
# or
npx serve .
