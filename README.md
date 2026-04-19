<div align="center">

# 🎭 PHANTOM CRYPT v1.0
### Face and Voice Replacement for Online Video Recording

[![TypeScript](https://img.shields.io/badge/TypeScript-51.6%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![CSS](https://img.shields.io/badge/CSS-33.9%25-rebeccapurple?style=for-the-badge&logo=css3)](https://www.w3.org/Style/CSS/)
[![HTML](https://img.shields.io/badge/HTML-14.5%25-orange?style=for-the-badge&logo=html5)](https://www.w3.org/TR/html5/)

**A specialized environment for ensuring digital anonymity.**

[🇷🇺 Russian Version](./README_RU.md) • [**View Repo**](https://github.com/savich18-Official/Face-and-voice-replacement-for-online-video-recording) • [**Creator: Savich18**](https://github.com/savich18-Official)

</div>

---

## 🛰 System Overview

**Phantom Crypt** is an advanced web application for full identity replacement in video streams. The project integrates state-of-the-art neural tracking algorithms and audio processing, allowing the creation of secure content where your face and voice are replaced by digital counterparts.

### 🌑 Key Protocols:

*   **Neural Face Masking**: Instant facial geometry capture via `face-api.js` and overlaying animated GIF masks. The mask adapts to head tilts, rotations, and scale in real-time.
*   **Audio Cryptography**: Voice modulation through a chain of low-level audio filters (WaveShaper, BiquadFilter). The result is a deep, mechanical, and unrecognizable timbre.
*   **Atmospheric Injection**: Replacing the background with dynamic environments. GIF background support for specific aesthetics.
*   **Native Intercept**: Direct capture of the composite stream (Canvas + AudioDestination) into a single media file. Saves in `MP4` / `WebM`.
*   **Hot-Swap Assets**: Ability to change masking assets on-the-fly during a session via external URLs.

---

## 🛠 Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Logic Layer** | `TypeScript`, `React 18`, `Vite` |
| **AI Vision** | `face-api.js`, `TensorFlow.js` |
| **Visuals** | `Tailwind CSS`, `Framer Motion`, `HTML5 Canvas` |
| **Audio Hub** | `Web Audio API` |
| **Backend** | `Express` (CORS Proxy Service) |

---

## ⚡ Deployment Instructions

To run the system in your local environment, follow these steps:

1. **Clone**:
   ```bash
   git clone https://github.com/savich18-Official/Face-and-voice-replacement-for-online-video-recording.git
   ```
2. **Initialization**:
   ```bash
   npm install
   ```
3. **Activation**:
   ```bash
   npm run dev
   ```

---

## 👤 Authorship

The system is developed and maintained by:
**[Savich18-Official](https://github.com/savich18-Official)**

---

<div align="center">

</div>
