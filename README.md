# EcoSort AI

**EcoSort AI** is an AI-powered smart recycling assistant that uses computer vision to identify waste items from images and provide practical recycling and disposal recommendations.

## 🚀 Features

* 📷 **Waste Image Scanning** — Upload an image or capture one using your camera.
* 🤖 **AI Waste Detection** — Detects common waste categories using a trained YOLO model.
* ♻️ **Recycling Recommendations** — Suggests whether an item should be recycled and provides instructions.
* 📊 **Scan History** — Stores and displays previous waste-scanning results.
* 👤 **User Authentication** — Registration and login system for individual users.
* 📈 **Dashboard** — Shows scan statistics, recent activity, and recycling information.
* 📱 **Responsive Interface** — Designed for desktop and mobile usage.
* 🧠 **Trained AI Model** — Uses a custom-trained object detection model for waste classification.

## 🗂️ Waste Categories

The current model supports:

* Plastic
* Glass
* Metal
* Paper/Cardboard

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* React Router

### Backend

* Python
* FastAPI
* SQLite
* Uvicorn

### AI / Computer Vision

* YOLO
* Ultralytics
* OpenCV
* Pillow

## ⚙️ Project Structure

```text
EcoSort AI/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── model/
│   │   └── best.pt
│   ├── uploads/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── ecosort.db
│
├── ai/
├── datasets/
└── README.md
```

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd EcoSort-AI
```

### 2. Setup Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

## 🔄 How It Works

```text
Image / Camera
      ↓
Image Preprocessing
      ↓
YOLO Object Detection
      ↓
Waste Classification
      ↓
Recycling Decision
      ↓
Recommendation
      ↓
Scan History
```

The user provides an image of a waste item. The trained YOLO model analyzes the image and identifies the detected waste category. EcoSort AI then applies recycling rules to generate an actionable recommendation.

## ♻️ Example

**Input:** Plastic bottle image

**AI Detection:**

```text
Class: Plastic
Confidence: 94%
```

**Recommendation:**

```text
Action: RECYCLE

Instruction:
Clean and dry the plastic item before placing it
in the recyclable-plastic collection.
```

## 📊 Dashboard

The dashboard provides:

* Total scans
* Recyclable items
* Recycling rate
* Most detected waste type
* Recent scan activity
* Recycling tips
* Quick access to waste scanning

## 🔐 User Accounts

Each user can:

* Create an account
* Log in securely
* Perform waste scans
* View their own scan history
* View individual scan results
* Log out of the application

## 📱 Mobile Usage

EcoSort AI supports camera-based scanning on compatible devices. For local network testing, the frontend and backend can be accessed from a mobile device connected to the same Wi-Fi network as the development computer.

## 🔮 Future Scope

* Material-level classification
* Contamination detection
* More waste categories
* Environmental impact calculation
* AI recycling chatbot
* Local recycling rules and location-based recommendations
* Satellite and LiDAR-based illegal dumping detection
* Cloud deployment
* Improved model accuracy with larger datasets

## ⚠️ Current Status

EcoSort AI is an active development project. The current version includes the React frontend, FastAPI backend, user authentication, SQLite database, camera/image scanning, trained YOLO model integration, recycling recommendations, dashboard, and scan history.

## 👨‍💻 Project

**EcoSort AI — AI-Powered Smart Recycling Assistant**

Built using **React + FastAPI + YOLO + SQLite**.
