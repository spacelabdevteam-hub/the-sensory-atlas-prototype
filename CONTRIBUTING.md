# Contributing to The Sensory Atlas Prototype

Thank you for contributing to **The Sensory Atlas** — Space Journey's open-source isometric 3D spatial viewer for contemplative urban exploration.

## Principles
- **Zero-friction WebGL:** Keep the prototype buildless (native ES Modules + `importmap`) so it runs directly on GitHub Pages and static servers with minimal payload.
- **FAIR Open Data:** All acoustic (`dB`), luminous (`Lux`), and elevation (`ESA Copernicus DEM GLO-90`) values must trace back to verified datasets in [`spacelabdevteam-hub/sensory-impact-score-datasets`](https://github.com/spacelabdevteam-hub/sensory-impact-score-datasets).
- **Solarpunk Palette & Accessibility:** Use `#061212` (Deep Space Obsidian), `#10B981` (Solarpunk Emerald), and `#E8C57D` (Noble Gold). Respect `prefers-reduced-motion` and keep native **EN / ES / PT** parity in `src/i18n.js`.

## Local Development & Verification
```bash
# Serve locally (ES Modules require HTTP)
python -m http.server 8000

# Run the automated test suite (Node.js 20+)
npm test
```

## Commit Style
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scene): ...`
- `fix(data): ...`
- `test(ci): ...`
- `docs(readme): ...`
