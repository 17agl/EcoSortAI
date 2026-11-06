import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";

// ── Per-class colours ────────────────────────────────────────
const CLASS_META = {
  plastic:         { color: "#2e7d32", bg: "#e8f5e9",  icon: "🧴", label: "Plastic",          bin: "Yellow Recycling Bin" },
  glass:           { color: "#0277bd", bg: "#e1f5fe",  icon: "🫙", label: "Glass",             bin: "Green Glass Bank"     },
  metal:           { color: "#c62828", bg: "#ffebee",  icon: "🔩", label: "Metal",             bin: "Metal Recycling Bin"  },
  paper_cardboard: { color: "#e65100", bg: "#fff3e0",  icon: "📦", label: "Paper/Cardboard",   bin: "Blue Paper Bin"       },
  food_container:  { color: "#ef6c00", bg: "#fff3e0",  icon: "🥡", label: "Food Container",    bin: "General / Compost"    },
  battery:         { color: "#6a1b9a", bg: "#f3e5f5",  icon: "🔋", label: "Battery",           bin: "Hazardous Drop-off"   },
  electronics:     { color: "#283593", bg: "#e8eaf6",  icon: "💻", label: "Electronics",       bin: "E-Waste Facility"     },
  organic_waste:   { color: "#1b5e20", bg: "#f1f8e9",  icon: "🌿", label: "Organic Waste",     bin: "Green Compost Bin"    },
  hazardous_waste: { color: "#b71c1c", bg: "#ffcdd2",  icon: "⚠️", label: "Hazardous Waste",  bin: "Chemical Depot"       },
  unknown:         { color: "#616161", bg: "#f5f5f5",  icon: "❓", label: "Unknown",           bin: "General Waste"        },
};

function getMeta(cls) {
  return CLASS_META[cls] || CLASS_META.unknown;
}

// ── Confidence badge colour ──────────────────────────────────
function confColor(conf) {
  if (conf >= 0.75) return "#2e7d32";
  if (conf >= 0.50) return "#f57f17";
  return "#c62828";
}

// ── Confidence label ─────────────────────────────────────────
function confLabel(conf) {
  if (conf >= 0.80) return "High";
  if (conf >= 0.55) return "Medium";
  return "Low";
}

// ── Material sub-type details per class ──────────────────────
const MATERIAL_DETAILS = {
  plastic:         { subtypes: "PET, HDPE, PVC, LDPE, PP, PS",             recyclable: true,  reusable: false, decompose: "20–500 years" },
  glass:           { subtypes: "Clear, Green, Brown, Tempered",             recyclable: true,  reusable: true,  decompose: "1 million+ years" },
  metal:           { subtypes: "Aluminium, Steel, Iron, Copper",            recyclable: true,  reusable: false, decompose: "50–200 years" },
  paper_cardboard: { subtypes: "Newspaper, Office Paper, Cardboard",        recyclable: true,  reusable: false, decompose: "2–6 weeks (compost)" },
  food_container:  { subtypes: "Plastic tray, Paper cup, Foam box",         recyclable: false, reusable: false, decompose: "5–50 years" },
  battery:         { subtypes: "AA, AAA, Lithium, Nickel-Cadmium",          recyclable: true,  reusable: false, decompose: "100+ years" },
  electronics:     { subtypes: "Circuit boards, Cables, Devices, Screens",  recyclable: true,  reusable: true,  decompose: "Centuries" },
  organic_waste:   { subtypes: "Fruit peels, Vegetable scraps, Food waste", recyclable: true,  reusable: true,  decompose: "1–4 months" },
  hazardous_waste: { subtypes: "Chemicals, Paints, Solvents, Medicines",    recyclable: false, reusable: false, decompose: "Centuries" },
  unknown:         { subtypes: "Unknown material",                          recyclable: false, reusable: false, decompose: "Unknown" },
};

function getMd(cls) {
  return MATERIAL_DETAILS[cls] || MATERIAL_DETAILS.unknown;
}

// ── Draw bounding boxes on canvas ───────────────────────────
function drawBoxes(imgEl, canvasEl, detections, selectedIdx) {
  if (!imgEl || !canvasEl || !detections.length) return;

  const dw = imgEl.clientWidth;
  const dh = imgEl.clientHeight;
  if (!dw || !dh) return;

  canvasEl.width  = dw;
  canvasEl.height = dh;

  const ctx = canvasEl.getContext("2d");
  ctx.clearRect(0, 0, dw, dh);

  const origW = detections[0]?.img_dimensions?.[0] || imgEl.naturalWidth || 640;
  const origH = detections[0]?.img_dimensions?.[1] || imgEl.naturalHeight || 640;

  const sx = dw / origW;
  const sy = dh / origH;

  detections.forEach((det, idx) => {
    if (!det.bbox) return;
    const [x1, y1, x2, y2] = det.bbox;
    const bx = x1 * sx;
    const by = y1 * sy;
    const bw = (x2 - x1) * sx;
    const bh = (y2 - y1) * sy;

    const meta      = getMeta(det.class_name);
    const isActive  = idx === selectedIdx;
    const lineW     = isActive ? 4 : 2;
    const alpha     = isActive ? 1 : 0.65;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = meta.color;
    ctx.lineWidth   = lineW;
    ctx.shadowColor = meta.color;
    ctx.shadowBlur  = isActive ? 12 : 4;
    ctx.strokeRect(bx, by, bw, bh);

    // Corner accent squares for active box
    if (isActive) {
      ctx.fillStyle = meta.color;
      ctx.shadowBlur = 0;
      const cs = 8;
      [[bx, by], [bx + bw - cs, by], [bx, by + bh - cs], [bx + bw - cs, by + bh - cs]]
        .forEach(([cx, cy]) => ctx.fillRect(cx, cy, cs, cs));
    }

    // Label pill
    const pct   = (det.confidence * 100).toFixed(0);
    const label = `${meta.icon} #${idx + 1} ${det.class_name.replace(/_/g, " ").toUpperCase()} ${pct}%`;
    ctx.font      = `bold ${isActive ? 13 : 11}px sans-serif`;
    ctx.shadowBlur = 0;
    const tw = ctx.measureText(label).width;

    ctx.fillStyle   = meta.color;
    ctx.globalAlpha = isActive ? 1 : 0.8;
    const ly = Math.max(0, by - 24);
    ctx.fillRect(bx, ly, tw + 14, 22);

    ctx.fillStyle   = "#ffffff";
    ctx.globalAlpha = 1;
    ctx.fillText(label, bx + 7, ly + 15);

    ctx.restore();
  });
}

// ── Action card for one detected object ──────────────────────
function ObjectActionCard({ det, index, isActive, onClick }) {
  const meta = getMeta(det.class_name);
  const md   = getMd(det.class_name);
  const pct  = (det.confidence * 100).toFixed(1);
  const chatMsg = encodeURIComponent(`How do I recycle ${det.class_name.replace(/_/g, " ")}?`);

  return (
    <div
      className={`obj-action-card${isActive ? " obj-action-card--active" : ""}`}
      style={{ borderLeft: `4px solid ${meta.color}` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Header */}
      <div className="oac-header">
        <div className="oac-icon" style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </div>
        <div className="oac-title-block">
          <span className="oac-num" style={{ color: meta.color }}>Object #{index + 1}</span>
          <h3 className="oac-title">{meta.label}</h3>
          <span className="oac-subtypes">{md.subtypes}</span>
        </div>
        <div className="oac-conf-block">
          <div
            className="oac-conf-badge"
            style={{ background: meta.bg, color: confColor(det.confidence), border: `1px solid ${meta.color}30` }}
          >
            <span className="oac-conf-pct">{pct}%</span>
            <span className="oac-conf-lbl">{confLabel(det.confidence)}</span>
          </div>
        </div>
      </div>

      {/* Only show full details when active / selected */}
      {isActive && (
        <>
          {/* Confidence bar */}
          <div className="oac-conf-bar-wrap">
            <div className="oac-conf-bar-track">
              <div
                className="oac-conf-bar-fill"
                style={{ width: `${pct}%`, background: confColor(det.confidence) }}
              />
            </div>
            <span className="oac-conf-bar-label" style={{ color: confColor(det.confidence) }}>
              {pct}% — Model Confidence
            </span>
          </div>

          {/* Contamination */}
          <div
            className="oac-contam"
            style={{
              background: det.contamination?.is_clean === false ? "#fff3e0" : "#e8f5e9",
              borderColor: det.contamination?.is_clean === false ? "#ffb74d" : "#a5d6a7",
            }}
          >
            <strong>{det.contamination?.status || "Clean & Dry ✨"}</strong>
            <p>{det.contamination?.instruction || "Approved for recycling."}</p>
          </div>

          {/* Lifecycle badges */}
          <div className="oac-badges">
            <div className="oac-badge" style={{ background: meta.bg }}>
              <span>♻️ Recyclable</span>
              <strong style={{ color: meta.color }}>{md.recyclable ? "Yes" : "No"}</strong>
            </div>
            <div className="oac-badge" style={{ background: meta.bg }}>
              <span>🔄 Reusable</span>
              <strong style={{ color: meta.color }}>{md.reusable ? "Yes" : "No"}</strong>
            </div>
            <div className="oac-badge" style={{ background: "#fff8e1" }}>
              <span>⏳ Decomposes</span>
              <strong style={{ color: "#e65100" }}>{md.decompose}</strong>
            </div>
            <div className="oac-badge" style={{ background: "#eceff1" }}>
              <span>🗑️ Bin</span>
              <strong style={{ color: "#37474f" }}>{meta.bin}</strong>
            </div>
          </div>

          {/* Disposal action */}
          <div className="oac-action-box" style={{ borderColor: meta.color + "40", background: meta.bg }}>
            <strong style={{ color: meta.color }}>Recommended Action</strong>
            <p>{det.action || "Follow local recycling guidelines."}</p>
          </div>

          <div className="oac-instruction-box">
            <strong>How to Dispose Safely</strong>
            <p>{det.instruction || "Refer to your local waste authority."}</p>
          </div>

          {/* Per-object action buttons */}
          <div className="oac-action-buttons">
            <Link
              to="/map"
              className="oac-btn oac-btn--primary"
              style={{ background: meta.color }}
            >
              🗺️ Find Recycling Centre
            </Link>

            <Link
              to="/chatbot"
              className="oac-btn oac-btn--outline"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              🤖 Ask AI About This
            </Link>

            <Link
              to="/impact"
              className="oac-btn oac-btn--outline"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              🌱 My Eco Impact
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Result page ─────────────────────────────────────────
function Result() {
  const navigate = useNavigate();

  const [result,        setResult]        = useState(null);
  const [image,         setImage]         = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imgRef    = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("ecosortResult");
    if (raw) {
      try { setResult(JSON.parse(raw)); } catch { /* ignore */ }
    }
    const img = sessionStorage.getItem("ecosortImage");
    if (img) setImage(img);
  }, []);

  const detections   = (result?.status === "success" && result.detections) || [];
  const hasDetection = detections.length > 0;
  const activeDet    = hasDetection ? detections[selectedIndex] || detections[0] : null;

  // Redraw boxes whenever image, detections or selection changes
  useEffect(() => {
    if (image && detections.length > 0) {
      const timer = setTimeout(() => {
        drawBoxes(imgRef.current, canvasRef.current, detections, selectedIndex);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [image, detections, selectedIndex]);

  const handleRetake = () => {
    sessionStorage.removeItem("ecosortResult");
    sessionStorage.removeItem("ecosortImage");
    navigate("/scan");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="page-content">

          {/* ── Page header ── */}
          <div className="page-introduction">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span className="small-label">MULTI-OBJECT AI ANALYSIS</span>
                <h2>AI Waste Detection Results</h2>
                <p>
                  {hasDetection
                    ? <>Found <b>{detections.length}</b> waste object{detections.length > 1 ? "s" : ""} · Select each for disposal options.</>
                    : "No waste objects detected. Try another photo."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetake}
                className="primary-btn"
                style={{ padding: "10px 20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
              >
                📷 Retake Photo
              </button>
            </div>
          </div>

          {/* ── Main layout ── */}
          <div className="result-layout">

            {/* ── Left: image + canvas overlay ── */}
            <div className="result-image-panel" style={{ position: "relative" }}>
              {image ? (
                <div
                  className="uploaded-result-image"
                  style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "12px" }}
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Uploaded waste"
                    onLoad={() => drawBoxes(imgRef.current, canvasRef.current, detections, selectedIndex)}
                    style={{ width: "100%", height: "auto", maxHeight: "480px", objectFit: "contain", display: "block" }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                  />
                </div>
              ) : (
                <div className="placeholder-image">
                  <span>📷</span>
                  <span>No uploaded image</span>
                </div>
              )}

              {/* Object selector chips */}
              {detections.length > 1 && (
                <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#2e7d32", alignSelf: "center" }}>
                    Objects detected:
                  </span>
                  {detections.map((det, idx) => {
                    const m = getMeta(det.class_name);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedIndex(idx)}
                        style={{
                          padding: "5px 11px",
                          borderRadius: "14px",
                          border: `2px solid ${idx === selectedIndex ? m.color : "#d0ddd1"}`,
                          background: idx === selectedIndex ? m.color : "#f4f8f4",
                          color: idx === selectedIndex ? "#ffffff" : "#1b5e20",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {m.icon} #{idx + 1} {det.class_name.replace(/_/g, " ")} ({(det.confidence * 100).toFixed(0)}%)
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Detection summary table */}
              {detections.length > 1 && (
                <div className="oac-summary-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Material</th>
                        <th>Confidence</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((det, idx) => {
                        const m = getMeta(det.class_name);
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            style={{
                              cursor: "pointer",
                              background: idx === selectedIndex ? m.bg : "transparent",
                              fontWeight: idx === selectedIndex ? "600" : "400",
                            }}
                          >
                            <td style={{ color: m.color }}>{m.icon} {idx + 1}</td>
                            <td>{m.label}</td>
                            <td style={{ color: confColor(det.confidence) }}>
                              {(det.confidence * 100).toFixed(1)}%
                            </td>
                            <td style={{ fontSize: "11px", color: "#5a7568" }}>
                              {det.action || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Right: per-object action cards ── */}
            <div className="oac-cards-column">
              {hasDetection ? (
                detections.map((det, idx) => (
                  <ObjectActionCard
                    key={idx}
                    det={det}
                    index={idx}
                    isActive={idx === selectedIndex}
                    onClick={() => setSelectedIndex(idx)}
                  />
                ))
              ) : (
                <div className="result-card">
                  <div className="result-header">
                    <div>
                      <span className="result-label">AI ANALYSIS</span>
                      <h2>No Detection</h2>
                    </div>
                    <div className="material-badge">NOT DETECTED</div>
                  </div>
                  <div className="recommendation">
                    <span className="recommendation-icon">⚠️</span>
                    <div>
                      <span>Message</span>
                      <h3>{result?.message || "No waste item detected. Try a clearer photo in better lighting."}</h3>
                    </div>
                  </div>
                  <button type="button" onClick={handleRetake} className="primary-btn" style={{ marginTop: "15px", width: "100%" }}>
                    📷 Retake Photo
                  </button>
                </div>
              )}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Result;
