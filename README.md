# ⚡ VUCX — 3D Unit Converter

> A sleek desktop & web unit conversion tool with a real-time reactive 3D WebGL particle field built with **Three.js** and packaged via **Electron**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows&logoColor=white)](#-download)

---

## 📥 Download

Grab the latest pre-built Windows standalone executable directly from the Releases tab:

👉 **[Download Latest Release (.exe)](https://github.com/VEKX/unit-converter/releases/latest)**

*No installation or Node.js runtime required.*

---

## ✨ Features

- **🔄 Two-Way Conversions:** Instantly reverse the calculation direction with a single toggle button.
- **📏 Supported Units:**
  - **Distance / Length:**
    - Miles ⇄ Kilometers
    - Meters ⇄ Centimeters
  - **Digital Data Storage:**
    - Bytes ⇄ Kilobytes
    - Megabytes ⇄ Bytes
- **🌌 Interactive 3D Background:**
  - 6,400-point WebGL particle grid simulated in real time with **Three.js**.
  - Dynamic surface deformation tracking mouse/cursor position and mobile touch gestures.
  - Interactive shockwave ripple effects on click/tap.
- **🖥️ Desktop & Web Compatibility:** Runs natively on Windows via Electron or in any modern browser as a static web app.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5 / CSS3 / JavaScript (ES6+)** | UI layout, controls, glassmorphic styling, and conversion logic |
| **[Three.js (r128)](https://threejs.org/)** | WebGL canvas particle grid & interactive physics |
| **[Electron](https://www.electronjs.org/)** | Native desktop cross-platform wrapper |
| **electron-builder** | Packaging and portable `.exe` creation |

---

## 📂 Project Structure

```text
Unit Converter/
├── bg-3d.js        # Three.js particle wave background & click shockwave physics
├── script.js       # Core conversion calculations & direction toggling
├── style.css       # UI layout, typography, glassmorphism card styling
├── index.html      # Calculator DOM layout
├── main.js         # Electron main lifecycle & window management
├── package.json    # Project configuration and build scripts
└── release/        # Standalone portable binaries (VUCX)
```

---

## 🚀 Running from Source

If you want to clone, modify, or build the project yourself:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- `npm`

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/VEKX/unit-converter.git

# Navigate to project directory
cd "unit-converter"

# Install dev dependencies
npm install
```

### 3. Development Mode
Run the Electron desktop app locally:
```bash
npm start
```
*(You can also simply double-click `index.html` to run it as a regular web page).*

### 4. Build Standalone Portable `.exe`
```bash
npm run build
```
The packaged executable will be generated inside the `build_out/` folder.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
