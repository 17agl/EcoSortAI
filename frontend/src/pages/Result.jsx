import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ResultCard from "../components/ResultCard";

function Result() {
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const storedResult =
      sessionStorage.getItem("ecosortResult");

    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error(
          "Failed to read AI result:",
          error
        );
      }
    }

    const storedImage =
      sessionStorage.getItem("ecosortImage");

    if (storedImage) {
      setImage(storedImage);
    }
  }, []);

  const hasDetection =
    result &&
    result.status === "success" &&
    result.detections &&
    result.detections.length > 0;

  const detection = hasDetection
    ? result.detections[0]
    : null;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="page-content">

          {/* PAGE INTRODUCTION */}
          <div className="page-introduction">
            <span className="small-label">
              ANALYSIS RESULT
            </span>

            <h2>AI Scan Result</h2>

            <p>
              EcoSort AI analyzed your uploaded
              image using the trained YOLO model.
            </p>
          </div>


          {/* RESULT AREA */}
          <div className="result-layout">

            {/* IMAGE */}
            <div className="result-image-panel">

              {image ? (
                <div className="uploaded-result-image">
                  <img
                    src={image}
                    alt="Uploaded waste"
                  />
                </div>
              ) : (
                <div className="placeholder-image">
                  <span>📷</span>
                  <span>Uploaded image</span>
                </div>
              )}

            </div>


            {/* AI RESULT */}
            {hasDetection ? (

              <ResultCard
                objectName={detection.class_name}
                material={detection.class_name}
                recommendation={detection.action}
                confidence={
                  detection.confidence * 100
                }
                ecoScore={0}
              />

            ) : (

              <div className="result-card">

                <div className="result-header">

                  <div>
                    <span className="result-label">
                      AI ANALYSIS
                    </span>

                    <h2>
                      No Reliable Detection
                    </h2>
                  </div>

                  <div className="material-badge">
                    NOT DETECTED
                  </div>

                </div>


                {/* MESSAGE */}
                <div className="recommendation">

                  <span className="recommendation-icon">
                    ⚠️
                  </span>

                  <div>

                    <span>Message</span>

                    <h3>
                      {result?.message ||
                        "No reliable waste item was detected."}
                    </h3>

                  </div>

                </div>


                <p>
                  Try uploading a clearer image
                  with better lighting and make
                  sure the waste item is clearly
                  visible.
                </p>

              </div>

            )}

          </div>


          {/* AI PIPELINE */}
          <div className="future-result-panel">

            <h3>
              AI Processing Pipeline
            </h3>

            <div className="pipeline">

              <div>
                <span>1</span>
                <p>Image</p>
              </div>

              <div className="arrow">
                →
              </div>

              <div>
                <span>2</span>
                <p>YOLO</p>
              </div>

              <div className="arrow">
                →
              </div>

              <div>
                <span>3</span>
                <p>Material</p>
              </div>

              <div className="arrow">
                →
              </div>

              <div>
                <span>4</span>
                <p>Recommendation</p>
              </div>

            </div>

          </div>


          {/* RECYCLING INFORMATION */}
          {hasDetection && (
            <div className="future-result-panel">

              <h3>
                ♻️ Recycling Information
              </h3>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "15px"
                }}
              >

                <div
                  style={{
                    padding: "16px",
                    background: "#eef8ef",
                    borderRadius: "12px"
                  }}
                >
                  <strong>
                    Recommended Action
                  </strong>

                  <p
                    style={{
                      marginTop: "7px",
                      color: "#5f7066",
                      fontSize: "13px"
                    }}
                  >
                    {detection.action}
                  </p>
                </div>


                <div
                  style={{
                    padding: "16px",
                    background: "#f5f8f5",
                    borderRadius: "12px"
                  }}
                >
                  <strong>
                    What to do
                  </strong>

                  <p
                    style={{
                      marginTop: "7px",
                      color: "#5f7066",
                      fontSize: "13px",
                      lineHeight: "1.6"
                    }}
                  >
                    {detection.instruction ||
                      "Follow local recycling guidelines."}
                  </p>
                </div>


                <div
                  style={{
                    padding: "16px",
                    background: "#f5f8f5",
                    borderRadius: "12px"
                  }}
                >
                  <strong>
                    Why?
                  </strong>

                  <p
                    style={{
                      marginTop: "7px",
                      color: "#5f7066",
                      fontSize: "13px",
                      lineHeight: "1.6"
                    }}
                  >
                    {detection.reason ||
                      "Recycling rules can vary by location."}
                  </p>
                </div>

              </div>

            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default Result;