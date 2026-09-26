# Makeup by Kajal Dholani — Luxury 3D Motion Website

A haute couture 3D motion website crafted for **Makeup by Kajal Dholani**, premier luxury bridal, editorial, and celebrity makeup studio.

---

## ✨ Features & Architecture

### 1. 3D WebGL Motion Studio (Three.js)
- **Physically Based Rendering (PBR)**: Realistic 18K polished gold reflection, velvet lipstick bullet, mirror-finish compact highlighter, and crystal perfume flacon.
- **Interactive 3D Switcher**:
  - 💄 **Haute Couture Lipstick**: Procedurally modeled with gold casing, rose-gold neck, and angled bullet.
  - ✨ **Diamond Compact Highlighter**: Scalloped golden case, reflective mirror lid, and faceted highlighter pan.
  - 🧴 **Crystal Elixir Flacon**: Faceted glass bottle with liquid refraction.
  - 🌸 **Silk & Pearls**: Dynamic parametric flowing silk ribbon with orbiting iridescent pearls.
- **Interactive Controls**:
  - **Mouse-tilt parallax** with smooth lerp inertia.
  - **360° Drag Orbit** (rotate freely with mouse or touch).
  - **Live Shade Swapper**: Instantly change lipstick bullet color (Royal Crimson, Rose Velvet, Cashmere Nude, Burgundy Noir, Champagne Pearl).
- **Golden Stardust Particle System**: 380+ floating starlight and golden bokeh dust particles with vertical ascent and gentle Brownian motion.

### 2. Luxury Light-Theme Aesthetic & Typography
- **Palette**: Alabaster Silk (`#FAF8F5`), Champagne Gold (`#C5A059`), Warm Cashmere (`#F8F3EE`), Rose Velvet (`#9C2738`), and Charcoal Noir (`#1C1917`).
- **Typography**: Editorial serif headings in *Cormorant Garamond* and *Playfair Display*, complemented by modern *Montserrat* and handwritten *Alex Brush* signatures.
- **Custom Fluid Cursor**: Smooth golden dot with trailing magnetic ring that scales on clickable elements.

### 3. Interactive Bridal Modules
- **Interactive Before & After Slider**: Split-screen comparison with draggable handle, smooth touch support, and 3 distinct bridal presets (*Royal Heritage Bride*, *Golden Hour Reception*, *Modern Dewy Cocktail*).
- **Bespoke Look Customizer Studio**: Real-time look blueprint generator allowing clients to select Occasion, Complexion undertone, Eye focus, and Lip finish with dynamic color swatch updates and one-click blueprint export.
- **Bespoke Services & Packages**: Signature Royal Bride, Sangeet Haute Glam, Global Destination Wedding, and Editorial Campaigns with direct package pre-selection.
- **Pro Academy Masterclass**: Comprehensive 7-day masterclass syllabus overview, live seat countdown counter, and syllabus enrollment.
- **Interactive Quote Calculator & WhatsApp VIP Concierge**: Real-time investment calculation with add-on toggles (Airbrush base, Family glam, On-site touchup artist) and instant pre-filled WhatsApp inquiry generation.
- **Ambient Harmony Synthesizer**: Subtle luxury chimes generated via the Web Audio API without external audio file dependencies.

---

## 🚀 Running the Project

### Development Server
The development server is running at:
```bash
npm run dev
# Server accessible at http://localhost:5173/
```

### Production Build
```bash
npm run build
```
Production assets are generated in `dist/`.

---

© 2026 Makeup by Kajal Dholani. Crafted with 3D Motion Artistry.
