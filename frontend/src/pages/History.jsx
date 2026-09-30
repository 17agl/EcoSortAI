import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getScanHistory } from "../services/api";


function History() {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  useEffect(() => {

    const loadHistory = async () => {

      try {

        setLoading(true);

        const result = await getScanHistory();

        console.log("History API result:", result);

        setHistory(
          result.history || []
        );

      } catch (err) {

        console.error(
          "History error:",
          err
        );

        setError(
          err.message ||
          "Failed to load history."
        );

      } finally {

        setLoading(false);

      }

    };


    loadHistory();

  }, []);


  return (

    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              SCAN HISTORY
            </span>

            <h2>
              Your Previous Scans
            </h2>

            <p>
              View the waste items previously
              analyzed by EcoSort AI.
            </p>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading history...
              </h3>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="empty-state">

              <div className="empty-icon">
                ⚠️
              </div>

              <h3>
                Unable to load history
              </h3>

              <p>
                {error}
              </p>

            </div>

          )}


          {/* NO SCANS */}

          {!loading &&
            !error &&
            history.length === 0 && (

              <div className="empty-state">

                <div className="empty-icon">
                  ♻️
                </div>

                <h3>
                  No scans yet
                </h3>

                <p>
                  Upload a waste image to
                  create your first scan.
                </p>

              </div>

            )}


          {/* SCAN HISTORY */}

          {!loading &&
            !error &&
            history.length > 0 && (

              <div
                style={{
                  display: "grid",
                  gap: "15px"
                }}
              >

                {history.map((scan) => (

                  <div
                    key={scan.id}
                    className="dashboard-panel"
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: "15px"
                      }}
                    >

                      <div>

                        <span className="small-label">
                          SCAN #{scan.id}
                        </span>

                        <h2
                          style={{
                            marginTop: "6px"
                          }}
                        >
                          {scan.class_name}
                        </h2>

                      </div>


                      <div className="material-badge">
                        {scan.action}
                      </div>

                    </div>


                    <div
                      style={{
                        marginTop: "15px",
                        display: "grid",
                        gap: "8px"
                      }}
                    >

                      <p
                        style={{
                          color: "#718077",
                          fontSize: "12px"
                        }}
                      >
                        Confidence:{" "}

                        <strong>

                          {(
                            scan.confidence * 100
                          ).toFixed(1)}

                          %

                        </strong>

                      </p>


                      <p
                        style={{
                          color: "#718077",
                          fontSize: "12px"
                        }}
                      >
                        What to do:{" "}

                        {scan.instruction}

                      </p>


                      <p
                        style={{
                          color: "#718077",
                          fontSize: "12px"
                        }}
                      >
                        Why:{" "}

                        {scan.reason}

                      </p>


                      <p
                        style={{
                          color: "#9aa69f",
                          fontSize: "10px"
                        }}
                      >
                        {scan.created_at
                          ? new Date(
                              scan.created_at
                            ).toLocaleString()
                          : ""}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </section>

      </main>

    </div>

  );
}


export default History;