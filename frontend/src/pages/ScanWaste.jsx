import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import LoadingSpinner from "../components/LoadingSpinner";

import { scanWaste } from "../services/api";

function ScanWaste() {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleScan = async () => {
    if (!selectedImage) {
      alert("Please upload a waste image first.");
      return;
    }

    try {
      setLoading(true);

      // Send image to FastAPI backend
      const result = await scanWaste(selectedImage);

      console.log("AI Result:", result);

      // Convert uploaded image into Base64
      // so it can be displayed on the Result page.
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageData = reader.result;

        // Store AI result
        sessionStorage.setItem(
          "ecosortResult",
          JSON.stringify(result)
        );

        // Store uploaded image
        sessionStorage.setItem(
          "ecosortImage",
          imageData
        );

        // Open Result page
        navigate("/result");
      };

      reader.readAsDataURL(selectedImage);

    } catch (error) {
      console.error("Scan error:", error);

      alert(
        error.message ||
          "Something went wrong while analyzing the image."
      );

      setLoading(false);
    }
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              AI WASTE SCANNER
            </span>

            <h2>
              Identify Your Waste
            </h2>

            <p>
              Upload a clear image of your waste item.
              EcoSort AI will analyze it using computer vision.
            </p>

          </div>

          <div className="scan-layout">

            <div className="scan-main-panel">

              {!loading ? (
                <>
                  <ImageUploader
                    onImageSelected={setSelectedImage}
                  />

                  <button
                    className="scan-button"
                    type="button"
                    onClick={handleScan}
                    disabled={!selectedImage}
                  >
                    🤖 Prepare for AI Analysis
                  </button>
                </>
              ) : (
                <LoadingSpinner />
              )}

            </div>

            <div className="scan-info-panel">

              <h3>
                For best results
              </h3>

              <div className="info-item">

                <span>
                  💡
                </span>

                <p>
                  Use a clear image with
                  good lighting.
                </p>

              </div>

              <div className="info-item">

                <span>
                  📦
                </span>

                <p>
                  Keep the waste item
                  clearly visible.
                </p>

              </div>

              <div className="info-item">

                <span>
                  🔍
                </span>

                <p>
                  Avoid blurry or extremely
                  dark images.
                </p>

              </div>

              <div className="info-item">

                <span>
                  📷
                </span>

                <p>
                  Keep the item you want
                  to analyze clearly visible.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ScanWaste;