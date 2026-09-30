import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ScanCard from "../components/ScanCard";

function Dashboard() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="welcome-section">

            <div>

              <span className="small-label">
                WELCOME TO ECOSORT AI 👋
              </span>

              <h2>
                Make every waste item count.
              </h2>

              <p>
                Use AI to identify waste and
                discover the right way to recycle it.
              </p>

            </div>

          </div>

          <div className="stats-grid">

            <StatCard
              icon="📷"
              title="Items Scanned"
              value="0"
              description="Start your first scan"
            />

            <StatCard
              icon="♻️"
              title="Items Recycled"
              value="0"
              description="Keep building your impact"
            />

            <StatCard
              icon="🌱"
              title="Eco Score"
              value="0"
              description="Your environmental score"
            />

            <StatCard
              icon="🌍"
              title="CO₂ Saved"
              value="0 kg"
              description="Estimated environmental impact"
            />

          </div>

          <ScanCard />

          <div className="dashboard-grid">

            <div className="dashboard-panel">

              <div className="panel-header">

                <span className="small-label">
                  HOW IT WORKS
                </span>

                <h2>
                  AI-Powered Recycling
                </h2>

              </div>

              <div className="steps">

                <div className="step">

                  <div className="step-number">
                    1
                  </div>

                  <div>

                    <h3>
                      Upload
                    </h3>

                    <p>
                      Take a photo or upload
                      an image of your waste.
                    </p>

                  </div>

                </div>

                <div className="step">

                  <div className="step-number">
                    2
                  </div>

                  <div>

                    <h3>
                      AI Analysis
                    </h3>

                    <p>
                      AI identifies the object
                      and its material.
                    </p>

                  </div>

                </div>

                <div className="step">

                  <div className="step-number">
                    3
                  </div>

                  <div>

                    <h3>
                      Get Guidance
                    </h3>

                    <p>
                      Receive recycling or
                      disposal recommendations.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="dashboard-panel tip-panel">

              <span className="tip-icon">
                💡
              </span>

              <h2>
                Why proper sorting matters
              </h2>

              <p>
                Correctly sorting recyclable materials
                helps reduce contamination and improves
                the efficiency of recycling systems.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;