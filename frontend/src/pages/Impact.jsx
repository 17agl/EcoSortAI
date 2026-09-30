import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Impact() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              ENVIRONMENT
            </span>

            <h2>
              Environmental Impact
            </h2>

            <p>
              Track the environmental impact
              of your recycling activities.
            </p>

          </div>

          <div className="stats-grid">

            <StatCard
              icon="♻️"
              title="Recycled Items"
              value="0"
              description="Items successfully recycled"
            />

            <StatCard
              icon="🌱"
              title="CO₂ Reduction"
              value="0 kg"
              description="Estimated CO₂ savings"
            />

            <StatCard
              icon="💧"
              title="Water Saved"
              value="0 L"
              description="Estimated water savings"
            />

            <StatCard
              icon="⚡"
              title="Energy Saved"
              value="0 kWh"
              description="Estimated energy savings"
            />

          </div>

          <div className="impact-panel">

            <h3>
              Impact Calculation
            </h3>

            <p>
              Environmental impact values will
              eventually be calculated from actual
              recycling activity and material-specific
              environmental factors.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Impact;