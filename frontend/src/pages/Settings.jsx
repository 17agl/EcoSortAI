import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              PREFERENCES
            </span>

            <h2>
              Settings
            </h2>

            <p>
              Configure your EcoSort AI application.
            </p>

          </div>

          <div className="settings-panel">

            <div className="setting-row">

              <div>

                <h3>
                  Notifications
                </h3>

                <p>
                  Receive updates about your
                  recycling activity.
                </p>

              </div>

              <input
                type="checkbox"
              />

            </div>

            <div className="setting-row">

              <div>

                <h3>
                  Environmental Tips
                </h3>

                <p>
                  Show useful recycling and
                  sustainability tips.
                </p>

              </div>

              <input
                type="checkbox"
                defaultChecked
              />

            </div>

            <div className="setting-row">

              <div>

                <h3>
                  Location-Based Recycling
                </h3>

                <p>
                  Future feature for location-specific
                  recycling rules.
                </p>

              </div>

              <input
                type="checkbox"
                disabled
              />

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Settings;