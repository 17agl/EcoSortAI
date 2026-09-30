import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              ACCOUNT
            </span>

            <h2>
              Profile
            </h2>

            <p>
              Manage your EcoSort AI profile.
            </p>

          </div>

          <div className="profile-card">

            <div className="large-avatar">
              A
            </div>

            <div className="profile-details">

              <h2>
                Eco User
              </h2>

              <p>
                Recycling Explorer
              </p>

              <div className="profile-stat">

                <span>
                  Scans
                </span>

                <strong>
                  0
                </strong>

              </div>

              <div className="profile-stat">

                <span>
                  Items Recycled
                </span>

                <strong>
                  0
                </strong>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;