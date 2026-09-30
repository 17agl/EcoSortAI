import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Chatbot() {
  const [message, setMessage] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    alert(
      "The AI chatbot will be connected in a future phase."
    );

    setMessage("");
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <section className="page-content">

          <div className="page-introduction">

            <span className="small-label">
              AI ASSISTANT
            </span>

            <h2>
              Ask EcoSort AI
            </h2>

            <p>
              Ask questions about recycling,
              waste materials and disposal.
            </p>

          </div>

          <div className="chat-container">

            <div className="chat-welcome">

              <div className="chat-icon">
                🤖
              </div>

              <h3>
                Hello! I'm EcoSort AI.
              </h3>

              <p>
                In a future phase, I will help
                answer recycling questions using
                a knowledge base and AI.
              </p>

              <div className="suggestions">

                <button
                  type="button"
                  onClick={() => {
                    setMessage(
                      "Can I recycle a plastic bottle?"
                    );
                  }}
                >
                  Can I recycle a plastic bottle?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMessage(
                      "How should I dispose of batteries?"
                    );
                  }}
                >
                  How should I dispose of batteries?
                </button>

              </div>

            </div>

            <form
              className="chat-input"
              onSubmit={handleSubmit}
            >

              <input
                type="text"
                placeholder="Ask a recycling question..."
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
              />

              <button type="submit">
                Send
              </button>

            </form>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Chatbot;