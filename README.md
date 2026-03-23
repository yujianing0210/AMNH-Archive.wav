# 🏛️ Museum Sonic Archive

**Turning static artifacts into layered sonic identities**

---

## ✨ Overview

Museum Sonic Archive is an interactive web prototype that transforms images of museum artifacts into dynamic, generative sound.

Instead of treating this as a simple image-to-music tool, the system frames each artifact as a **sonic record**, combining:

* **Metadata-driven interpretation (LLM)**
* **Image-based temporal scanning**
* **Layered sound synthesis (Tone.js)**

Each artifact becomes a unique, playable audio experience — a form of **digital synesthesia** between vision, history, and sound.

---

## 🔊 How it works

The system uses a **Three-Layer Sound Model**:

* **Bottom Layer (Historical Atmosphere)**
  Generated from artifact metadata (era, material, function).
  Defines the overall sonic identity and mood.

* **Middle Layer (Image Traversal)**
  A scanline moves across the image (left → right), translating visual features into time-based variation.

* **Surface Layer (Material Texture)**
  Sparse accents reflecting material qualities and fine visual details.

If an uploaded image is not found in the database, the system uses AI to **infer an artifact record** before generating sound.

---

## 🧠 Key Features

* 📸 Upload artifact images
* 🧾 Automatic metadata matching (or AI inference)
* 🎵 Real-time generative audio using Tone.js
* 🔍 Scanline-based visual-to-audio mapping
* 🧱 Layered sound architecture (Bottom / Middle / Surface)
* 📚 Save and browse generated sonic records

---

## 🖥️ Demo

*(Add your deployment link here if available)*

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run the development server

```bash
npm start
```

---

### 4. Open in browser

```bash
http://localhost:3000
```

---

## 🛠️ Tech Stack

* **Frontend:** HTML / CSS / JavaScript
* **Audio Engine:** Tone.js
* **AI Integration:** OpenAI API (for artifact inference & sonic profile generation)
* **Canvas Processing:** Image analysis + scanline mapping

---

## 📁 Project Structure (simplified)

```
/public
/src
  ├── index.html
  ├── styles.css
  ├── app.js
  ├── audio/
  ├── utils/
```

---

## 🔮 Future Work

* Spatial audio & AR integration
* Real-time camera scanning (Live Sensor mode)
* Stronger artifact-to-sound semantic mapping
* Expanded museum database
* Multi-user shared sonic archive
