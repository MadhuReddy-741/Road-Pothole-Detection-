# ⬡ PotholeAI — CNN Road Pothole Detection System

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange?logo=tensorflow)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)

An end-to-end deep learning web application that detects road potholes from images using a CNN model, tags GPS coordinates, assesses severity, and delivers a real-time analytics dashboard for infrastructure teams.

---

## 🚀 Features

- **Live Image Detection** — Upload any road photo and get instant pothole classification
- **Severity Scoring** — High / Medium / Low based on model confidence
- **GPS Geolocation Tagging** — Each detection is stamped with coordinates
- **Analytics Dashboard** — Weekly scan charts, severity distribution, recent detections table
- **Demo Mode** — Works without the model file (mock predictions) for UI development

---

## 🏗️ Project Structure

```
pothole-detection/
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── pages/
│   │       ├── Hero.jsx          # Landing page
│   │       ├── DetectionDemo.jsx # Upload + inference UI
│   │       ├── Dashboard.jsx     # Analytics dashboard
│   │       └── HowItWorks.jsx    # About / architecture
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # FastAPI REST API
│   ├── main.py             # API routes + CNN inference
│   ├── requirements.txt
│   └── model/              # ← place pothole_model.h5 here
│
└── README.md
```

---

## ⚙️ Setup & Run

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your trained model
mkdir model
cp /path/to/pothole_model.h5 model/

# Start the API server
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

### Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
```

---

## 🧠 Model

The CNN was trained on **1,299 road images** (Kaggle + Google Images):

| Split      | Images |
|------------|--------|
| Training   | 1,022  |
| Validation | 110    |
| Test       | 167    |

**Results:**
- Validation accuracy: **~93%**
- Test accuracy: **~81%**
- Input size: **64 × 64 × 3**

### Architecture

```
Input (64×64×3)
  → Conv2D(32, 3×3, ReLU)
  → MaxPooling2D(2×2)
  → Conv2D(64, 3×3, ReLU)
  → MaxPooling2D(2×2)
  → Flatten
  → Dense(128, ReLU)
  → Dropout(0.5)
  → Dense(1, Sigmoid)  →  Pothole / No Pothole
```

To use your own model, save it as `backend/model/pothole_model.h5`.

---

## 🌐 API Endpoints

| Method | Endpoint   | Description                          |
|--------|-----------|--------------------------------------|
| GET    | /health   | API status + model mode              |
| POST   | /predict  | Upload image → get prediction        |
| GET    | /stats    | Dashboard aggregate stats            |

### Example `/predict` response

```json
{
  "label": "Pothole Detected",
  "pothole": true,
  "confidence": 87.4,
  "severity": "High",
  "coordinates": { "lat": 17.3912, "lng": 78.4923 },
  "model_mode": "inference"
}
```

---

## 🛠️ Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| ML Model  | TensorFlow / Keras CNN |
| Backend   | FastAPI + Uvicorn      |
| Frontend  | React 18 + Vite        |
| Images    | OpenCV + Pillow        |
| Geo       | GeoPy                  |
| Arrays    | NumPy                  |

---

## 📈 Future Work

- NavIC / GPS hardware integration for real device coordinates
- Mobile app (React Native) for crowdsourced data collection
- YOLO upgrade for real-time video stream detection
- Predictive maintenance severity scoring with history
- Federated learning for privacy-preserving edge training

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*School of Computer Science & Engineering, NRCM*
