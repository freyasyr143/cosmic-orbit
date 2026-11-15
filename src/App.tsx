import { useState, useMemo } from "react";
import "./App.css";
import destinationsData from "./data/destinations.json";
import partsData from "./data/parts.json";
import rocketsData from "./data/rockets.json";

type Phase = "concept" | "design" | "launch" | "operations" | "report";

interface Destination {
  name: string;
  requiredDeltaV: number;
}

interface Part {
  name: string;
  mass: number;
  cost: number;
  power: number;
  sciencePoints?: number;
}

interface Rocket {
  name: string;
  dryMass: number;
  fuelMass: number;
  exhaustVelocity: number;
  maxPayLoadMass: number;
  cost: number;
}

function calculateDeltaV(rocket: Rocket, spacecraftMass: number): number {
  const initialMass = rocket.dryMass + rocket.fuelMass + spacecraftMass;
  const finalMass = rocket.dryMass + spacecraftMass;
  if (finalMass <= 0 || initialMass <= finalMass) return 0;
  return rocket.exhaustVelocity * Math.log(initialMass / finalMass);
}

function App() {
  const [phase, setPhase] = useState<Phase>("concept");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [selectedRocket, setSelectedRocket] = useState<Rocket | null>(null);
  const budget = 5000;

  const destinations = destinationsData as Destination[];
  const parts = partsData as Part[];
  const rockets = rocketsData as Rocket[];

  const totals = useMemo(() => {
    const mass = selectedParts.reduce((sum, p) => sum + p.mass, 0);
    const cost = selectedParts.reduce((sum, p) => sum + p.cost, 0);
    const power = selectedParts.reduce((sum, p) => sum + p.power, 0);
    return { mass, cost, power };
  }, [selectedParts]);

  const togglePart = (part: Part) => {
    setSelectedParts((current) => {
      const exists = current.find((p) => p.name === part.name);
      if (exists) return current.filter((p) => p.name !== part.name);
      return [...current, part];
    });
  };

  const launchCheck = useMemo(() => {
    if (!selectedRocket || !selectedDestination) return null;
    const availableDeltaV = calculateDeltaV(selectedRocket, totals.mass);
    const massOk = totals.mass <= selectedRocket.maxPayLoadMass;
    const deltaVOk = availableDeltaV >= selectedDestination.requiredDeltaV;
    return {
      availableDeltaV: Math.round(availableDeltaV),
      massOk,
      deltaVOk,
      canLaunch: massOk && deltaVOk,
    };
  }, [selectedRocket, selectedDestination, totals.mass]);

  return (
    <div className="app">
      <header className="header">
        <h1>Mission Control: Cosmic Orbit</h1>
        <div className="budget">
          Budget remaining: <strong>${budget - totals.cost - (selectedRocket?.cost || 0)}</strong>
        </div>
      </header>

      <nav className="phases">
        <button className={phase === "concept" ? "active" : ""} onClick={() => setPhase("concept")}>1. Concept</button>
        <button className={phase === "design" ? "active" : ""} onClick={() => setPhase("design")}>2. Design</button>
        <button className={phase === "launch" ? "active" : ""} onClick={() => setPhase("launch")}>3. Launch</button>
        <button className={phase === "operations" ? "active" : ""} onClick={() => setPhase("operations")}>4. Operations</button>
        <button className={phase === "report" ? "active" : ""} onClick={() => setPhase("report")}>Mission Report</button>
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
                  className={`destination-card ${selectedDestination?.name === dest.name ? "selected" : ""}`}
                  onClick={() => setSelectedDestination(dest)}
                >
                  <h3>{dest.name}</h3>
                  <p>Required Δv: {dest.requiredDeltaV.toLocaleString()} m/s</p>
                </button>
              ))}
            </div>
            {selectedDestination && (
              <p className="selected-note">Selected: <strong>{selectedDestination.name}</strong></p>
            )}
          </div>
        )}

        {phase === "design" && (
          <div>
            <h2>Phase 2 — Design</h2>
            {!selectedDestination && <p>Please select a destination first.</p>}
            <div className="meters">
              <div className="meter">Mass: <strong>{totals.mass} kg</strong></div>
              <div className="meter">Power: <strong>{totals.power} W</strong></div>
              <div className="meter">Cost: <strong>${totals.cost}</strong></div>
            </div>
            <div className="parts-grid">
              {parts.map((part) => {
                const isSelected = selectedParts.some((p) => p.name === part.name);
                return (
                  <button
                    key={part.name}
                    className={`part-card ${isSelected ? "selected" : ""}`}
                    onClick={() => togglePart(part)}
                  >
                    <h4>{part.name}</h4>
                    <p>Mass: {part.mass} kg</p>
                    <p>Power: {part.power} W</p>
                    <p>Cost: ${part.cost}</p>
                    {part.sciencePoints ? <p>Science: +{part.sciencePoints}</p> : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "launch" && (
          <div>
            <h2>Phase 3 — Launch</h2>
            {!selectedDestination && <p>Select a destination first.</p>}
            {selectedParts.length === 0 && <p>Add some parts first.</p>}

            <div className="parts-grid">
              {rockets.map((rocket) => (
                <button
                  key={rocket.name}
                  className={`part-card ${selectedRocket?.name === rocket.name ? "selected" : ""}`}
                  onClick={() => setSelectedRocket(rocket)}
                >
                  <h4>{rocket.name}</h4>
                  <p>Max payload: {rocket.maxPayLoadMass.toLocaleString()} kg</p>
                  <p>Cost: ${rocket.cost.toLocaleString()}</p>
                </button>
              ))}
            </div>

            {selectedRocket && launchCheck && (
              <div className="launch-result">
                <h3>Launch Check</h3>
                <p>Spacecraft mass: {totals.mass} kg {launchCheck.massOk ? "✅" : "❌"}</p>
                <p>Available Δv: {launchCheck.availableDeltaV.toLocaleString()} m/s {launchCheck.deltaVOk ? "✅" : "❌"}</p>
                <p>Required Δv: {selectedDestination?.requiredDeltaV.toLocaleString()} m/s</p>
                <p className={launchCheck.canLaunch ? "success" : "fail"}>
                  {launchCheck.canLaunch ? "Ready to launch!" : "Cannot launch with current design."}
                </p>
              </div>
            )}
          </div>
        )}

        {phase === "operations" && (
          <div>
            <h2>Phase 4 — Operations</h2>
            <p>Events will appear here.</p>
          </div>
        )}

        {phase === "report" && (
          <div>
            <h2>Mission Report</h2>
            <p>Final score will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;