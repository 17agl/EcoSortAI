import { useState } from "react";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// ─── Feature data ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: 1,
    icon: "🔍",
    title: "Multi-Object Detection",
    status: "in-progress",
    statusLabel: "In Progress",
    category: "AI & Detection",
    color: "#1565c0",
    colorBg: "#e3f2fd",
    summary:
      "Detect multiple waste items in a single image and provide individual recommendations for every object found.",
    details: [
      "Scan one photo — get results for every waste item in frame",
      "Per-object confidence scores and bounding boxes",
      "Separate disposal recommendation for each detected item",
      "Handles mixed waste bins and complex scenes",
    ],
  },
  {
    id: 2,
    icon: "🧪",
    title: "Advanced Material Detection",
    status: "planned",
    statusLabel: "Planned",
    category: "AI & Detection",
    color: "#6a1b9a",
    colorBg: "#f3e5f5",
    summary:
      "Identify the exact material sub-type within each waste category for precision recycling guidance.",
    details: [
      "🧴 Plastic — PET, HDPE, PVC, LDPE, PP, PS",
      "🫙 Glass — Clear, green, brown, tempered",
      "🔩 Metal — Aluminium, steel, iron, copper",
      "📦 Paper — Newspaper, office paper, cardboard, paperboard",
      "⚡ E-waste — Batteries, cables, circuit boards, devices",
      "🍌 Food Waste — Fruit peels, vegetable scraps, leftovers",
    ],
  },
  {
    id: 3,
    icon: "♻️",
    title: "Smart Waste Segregation",
    status: "planned",
    statusLabel: "Planned",
    category: "AI & Detection",
    color: "#2e7d32",
    colorBg: "#e8f5e9",
    summary:
      "Automatically classify detected waste into standard disposal streams with colour-coded bin assignments.",
    details: [
      "Recyclable ♻️ — plastic, glass, metal, paper",
      "Reusable 🔄 — intact containers, fabric, furniture",
      "Hazardous ⚠️ — batteries, chemicals, medicines",
      "Compostable 🌿 — food waste, garden waste",
      "General Waste 🗑️ — non-recyclable mixed waste",
    ],
  },
  {
    id: 4,
    icon: "📦",
    title: "Barcode & Packaging Scanner",
    status: "planned",
    statusLabel: "Planned",
    category: "Smart Features",
    color: "#e65100",
    colorBg: "#fff3e0",
    summary:
      "Scan product barcodes or packaging to instantly look up manufacturer recycling guidance and local disposal rules.",
    details: [
      "Scan any product barcode with the camera",
      "Look up recycling symbols (♳ – ♸) and their meaning",
      "Packaging material breakdown per product",
      "Local council disposal rules per item",
      "\"Is it recyclable here?\" quick answer",
    ],
  },
  {
    id: 5,
    icon: "🧠",
    title: "AI Prediction Improvement",
    status: "in-progress",
    statusLabel: "In Progress",
    category: "AI & Detection",
    color: "#00695c",
    colorBg: "#e0f2f1",
    summary:
      "Make the AI smarter over time through user feedback, confidence explanations, and continuous model retraining.",
    details: [
      "Confidence score with plain-language explanation",
      "\"Unsure\" flag when confidence is low",
      "👍/👎 feedback button on every scan result",
      "Flagging system for incorrect predictions",
      "Monthly model retraining on collected feedback",
    ],
  },
  {
    id: 6,
    icon: "⚖️",
    title: "Waste Quantity Estimation",
    status: "planned",
    statusLabel: "Planned",
    category: "Smart Features",
    color: "#f9a825",
    colorBg: "#fffde7",
    summary:
      "Estimate the number of objects, approximate volume, and weight of waste detected in a scan.",
    details: [
      "Object count per scan (e.g. '3 plastic bottles')",
      "Estimated weight range per item type",
      "Approximate volume (litres) of waste",
      "Cumulative weight tracker across all scans",
      "\"You've diverted Xkg from landfill\" milestone",
    ],
  },
  {
    id: 7,
    icon: "🗣️",
    title: "Multilingual AI Assistant",
    status: "planned",
    statusLabel: "Planned",
    category: "Accessibility",
    color: "#ad1457",
    colorBg: "#fce4ec",
    summary:
      "Interact with the AI chatbot in Hindi or English using voice or text, with regional recycling knowledge.",
    details: [
      "Full Hindi & English bilingual chatbot",
      "Voice input using Web Speech API",
      "Text-to-speech responses for accessibility",
      "Regional recycling rules (city-level)",
      "Switch language mid-conversation",
    ],
  },
  {
    id: 8,
    icon: "🌍",
    title: "Advanced Environmental Impact",
    status: "in-progress",
    statusLabel: "In Progress",
    category: "Analytics",
    color: "#1b5e20",
    colorBg: "#f1f8e9",
    summary:
      "Personalised eco-scores, carbon-saving estimates, achievement badges, and monthly recycling reports.",
    details: [
      "Personalised Eco-Score (0–100) updated after each scan",
      "kg of CO₂ saved per recycling action",
      "Monthly PDF / share-card recycling report",
      "Achievement badges (Plastic Hero, Green Warrior…)",
      "City-level ranking vs. other EcoSort users",
    ],
  },
  {
    id: 9,
    icon: "📍",
    title: "Recycling Center Finder",
    status: "live",
    statusLabel: "Live",
    category: "Community",
    color: "#00838f",
    colorBg: "#e0f7fa",
    summary:
      "Find nearby recycling centres, e-waste drop-offs, and scheduled collection points on an interactive map.",
    details: [
      "GPS-aware map of verified recycling facilities",
      "Filter by type: plastic / glass / e-waste / hazardous",
      "Opening hours, contact info, and directions",
      "Report a new facility or flag a closed one",
      "In-app navigation handoff to Google Maps",
    ],
  },
  {
    id: 10,
    icon: "🚛",
    title: "Waste Pickup Scheduling",
    status: "planned",
    statusLabel: "Planned",
    category: "Community",
    color: "#37474f",
    colorBg: "#eceff1",
    summary:
      "Request doorstep collection of recyclables and hazardous waste directly from within the app.",
    details: [
      "Schedule pickup for recyclables or hazardous items",
      "Choose date, time slot, and waste type",
      "Partner with municipal collection agencies",
      "SMS / push notification reminders",
      "Track pickup status in real time",
    ],
  },
  {
    id: 11,
    icon: "🏆",
    title: "Community Engagement",
    status: "planned",
    statusLabel: "Planned",
    category: "Community",
    color: "#f57f17",
    colorBg: "#fff8e1",
    summary:
      "Leaderboards, recycling challenges, digital rewards, and community clean-up events.",
    details: [
      "Global & city leaderboard by recycling points",
      "Weekly / monthly recycling challenges",
      "Digital reward coins redeemable for eco-products",
      "Community clean-up event registration",
      "Share milestones to social media",
    ],
  },
  {
    id: 12,
    icon: "📊",
    title: "Admin Dashboard & Analytics",
    status: "planned",
    statusLabel: "Planned",
    category: "Platform",
    color: "#283593",
    colorBg: "#e8eaf6",
    summary:
      "Full admin panel to manage users, recycling centres, waste statistics, AI feedback, and local rules.",
    details: [
      "User management (view, suspend, export)",
      "Waste statistics by city / material / time range",
      "AI feedback review and model management",
      "Recycling centre CMS (add, edit, verify)",
      "Local recycling rule editor per municipality",
    ],
  },
];

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:        { label: "🟢 Live",        bg: "#e8f5e9", color: "#2e7d32" },
  "in-progress":{ label: "🟡 In Progress", bg: "#fffde7", color: "#f9a825" },
  planned:     { label: "⚪ Planned",      bg: "#f5f5f5", color: "#616161" },
};

const CATEGORIES = ["All", "AI & Detection", "Smart Features", "Accessibility", "Analytics", "Community", "Platform"];

// ─── Component ──────────────────────────────────────────────────────────────

export default function Roadmap() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    activeCategory === "All"
      ? FEATURES
      : FEATURES.filter((f) => f.category === activeCategory);

  const counts = {
    live:        FEATURES.filter((f) => f.status === "live").length,
    "in-progress": FEATURES.filter((f) => f.status === "in-progress").length,
    planned:     FEATURES.filter((f) => f.status === "planned").length,
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content roadmap-page">

          {/* ── Page header ── */}
          <div className="roadmap-header">
            <div className="roadmap-header-text">
              <h1 className="roadmap-title">🗺️ Product Roadmap</h1>
              <p className="roadmap-subtitle">
                Our vision to transform EcoSort AI into an intelligent
                waste-management platform — from scanning one item to managing
                entire cities.
              </p>
            </div>

            {/* Progress pills */}
            <div className="roadmap-progress-pills">
              <div className="rp-pill rp-live">
                <span className="rp-dot" style={{ background: "#2e7d32" }} />
                <strong>{counts.live}</strong> Live
              </div>
              <div className="rp-pill rp-wip">
                <span className="rp-dot" style={{ background: "#f9a825" }} />
                <strong>{counts["in-progress"]}</strong> In Progress
              </div>
              <div className="rp-pill rp-plan">
                <span className="rp-dot" style={{ background: "#9e9e9e" }} />
                <strong>{counts.planned}</strong> Planned
              </div>
            </div>
          </div>

          {/* ── Overall progress bar ── */}
          <div className="roadmap-overall-bar">
            <div
              className="roadmap-bar-fill roadmap-bar-live"
              style={{ width: `${(counts.live / FEATURES.length) * 100}%` }}
            />
            <div
              className="roadmap-bar-fill roadmap-bar-wip"
              style={{ width: `${(counts["in-progress"] / FEATURES.length) * 100}%` }}
            />
          </div>
          <p className="roadmap-bar-caption">
            {Math.round(((counts.live + counts["in-progress"] * 0.5) / FEATURES.length) * 100)}% complete
          </p>

          {/* ── Category filter ── */}
          <div className="roadmap-filter-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`roadmap-filter-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Feature cards grid ── */}
          <div className="roadmap-grid">
            {filtered.map((feature) => {
              const isExpanded = expandedId === feature.id;
              const sc = STATUS_CONFIG[feature.status];

              return (
                <div
                  key={feature.id}
                  className={`roadmap-card${isExpanded ? " expanded" : ""}`}
                  style={{ borderTop: `3px solid ${feature.color}` }}
                >
                  {/* Card header */}
                  <div className="roadmap-card-top">
                    <div
                      className="roadmap-card-icon"
                      style={{ background: feature.colorBg, color: feature.color }}
                    >
                      {feature.icon}
                    </div>

                    <div className="roadmap-card-meta">
                      <span
                        className="roadmap-status-badge"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                      <span className="roadmap-category-tag">{feature.category}</span>
                    </div>
                  </div>

                  {/* Feature number + title */}
                  <div className="roadmap-card-num" style={{ color: feature.color }}>
                    #{feature.id}
                  </div>
                  <h3 className="roadmap-card-title">{feature.title}</h3>
                  <p className="roadmap-card-summary">{feature.summary}</p>

                  {/* Expandable details */}
                  {isExpanded && (
                    <ul className="roadmap-detail-list">
                      {feature.details.map((d, i) => (
                        <li key={i} className="roadmap-detail-item">
                          <span className="roadmap-detail-dot" style={{ background: feature.color }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    className="roadmap-expand-btn"
                    onClick={() => setExpandedId(isExpanded ? null : feature.id)}
                    type="button"
                    style={{ color: feature.color }}
                  >
                    {isExpanded ? "▲ Less detail" : "▼ See details"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Overall goal banner ── */}
          <div className="roadmap-goal-banner">
            <div className="roadmap-goal-icon">🌱</div>
            <div>
              <h3>Overall Goal</h3>
              <p>
                Transform EcoSort AI into an intelligent waste-management platform
                that can detect individual objects, identify their material
                composition, segregate waste automatically, and provide practical
                recycling solutions — all in real time.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
