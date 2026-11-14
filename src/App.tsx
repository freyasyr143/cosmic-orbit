import { useState } from "react";
import "./App.css";
import destinationsData from "./data/destinations.json";

type Phase = "concept" | "design" | "launch" | "operations" | "report";

interface Destination {
  name: string;
  requiredDeltaV: number;
}

function App() {
  const [phase, setPhase] = useState<Phase>("concept");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const budget = 5000;

  const destinations = destinationsData as Destination[];

  return (
    <div className="app">
      <header className="header">
        <h1>Mission Control: Cosmic Orbit</h1>
        <div className="budget">
          Budget remaining: <strong>${budget}</strong>
        </div>
      </header>

      <nav className="phases">
        <button
          className={phase === "concept" ? "active" : ""}
          onClick={() => setPhase("concept")}
        >
          1. Concept
        </button>
        <button
          className={phase === "design" ? "active" : ""}
          onClick={() => setPhase("design")}
        >
          2. Design
        </button>
        <button
          className={phase === "launch" ? "active" : ""}
          onClick={() => setPhase("launch")}
        >
          3. Launch
        </button>
        <button
          className={phase === "operations" ? "active" : ""}
          onClick={() => setPhase("operations")}
        >
          4. Operations
        </button>
        <button
          className={phase === "report" ? "active" : ""}
          onClick={() => setPhase("report")}
        >
          Mission Report
        </button>
      </nav>

      <main className="content">
        {phase === "concept" && (
          <div>
            <h2>Phase 1 — Concept</h2>
            <p>Choose your target destination.</p>

            <div className="destination-grid">
              {destinations.map((dest) => (
                <button
                  key={dest.name}
                  className={`destination-card ${
                    selectedDestination?.name === dest.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDestination(dest)}
                >
                  <h3>{dest.name}</h3>
                  <p>Required Δv: {dest.requiredDeltaV.toLocaleString()} m/s</p>
                </button>
              ))}
            </div>

            {selectedDestination && (
              <p className="selected-note">
                Selected: <strong>{selectedDestination.name}</strong>
              </p>
            )}
          </div>
        )}

        {phase === "design" && (
          <div>
            <h2>Phase 2 — Design</h2>
            <p>Build your spacecraft with live mass, power, and cost meters.</p>
            {selectedDestination ? (
              <p>Target: {selectedDestination.name}</p>
            ) : (
              <p>Please select a destination first.</p>
            )}
          </div>
        )}

        {phase === "launch" && (
          <div>
            <h2>Phase 3 — Launch</h2>
            <p>Select a launch vehicle and check if it can lift your mass.</p>
          </div>
        )}

        {phase === "operations" && (
          <div>
            <h2>Phase 4 — Operations</h2>
            <p>Mission timeline with random events will appear here.</p>
          </div>
        )}

        {phase === "report" && (
          <div>
            <h2>Mission Report</h2>
            <p>Final score, science returns, and science notes.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;