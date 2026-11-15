import { useState, useMemo } from "react";
import "./App.css";
import destinationsData from "./data/destinations.json";
import partsData from "./data/parts.json";
import rocketsData from "./data/rockets.json";

type Phase = "concept" | "design" | "launch" | "operations" | "report";

interface Destination {
  name: string;
  requiredDeltaV: number;
  difficulty: string;
  eventCount: number;
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

interface EventResult {
  eventName: string;
  description: string;
  survived: boolean;
  bonusPoints: number;
}

function calculateDeltaV(rocket: Rocket, spacecraftMass: number): number {
  const initialMass = rocket.dryMass + rocket.fuelMass + spacecraftMass;
  const finalMass = rocket.dryMass + spacecraftMass;
  if (finalMass <= 0 || initialMass <= finalMass) return 0;
  return rocket.exhaustVelocity * Math.log(initialMass / finalMass);
}

function simulateSpaceEvent(parts: Part[], totalPower: number): EventResult {
  const events = [
    {
      name: "Solar Flare",
      description: "A strong solar explosion hits the spacecraft's electrical systems!",
      checkSurvival: () => totalPower >= 50,
      successMsg: "Energy surplus and batteries protected the systems.",
      failMsg: "Weak power reserve caused a temporary outage.",
    },
    {
      name: "Micrometeoroid Shower",
      description: "A cloud of tiny space rocks is blocking the path!",
      checkSurvival: () => parts.some((p) => p.name.includes("Thruster") || p.name.includes("Shield") || p.name.includes("Propulsion")),
      successMsg: "Maneuvering systems allowed the spacecraft to avoid danger.",
      failMsg: "Some impacts damaged the structure.",
    },
    {
      name: "Signal Interference",
      description: "Cosmic interference is blocking communication with Earth!",
      checkSurvival: () => parts.some((p) => p.name.includes("Antenna")),
      successMsg: "Antenna kept the link with mission control.",
      failMsg: "Some data was lost due to poor connection.",
    },
  ];

  const chosen = events[Math.floor(Math.random() * events.length)];
  const survived = chosen.checkSurvival();

  return {
    eventName: chosen.name,
    description: chosen.description + " " + (survived ? chosen.successMsg : chosen.failMsg),
    survived,
    bonusPoints: survived ? 250 : 0,
  };
}

function App() {
  const [phase, setPhase] = useState<Phase>("concept");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [selectedRocket, setSelectedRocket] = useState<Rocket | null>(null);
  const [events, setEvents] = useState<EventResult[]>([]);
  const budget = 200000;

  const destinations = destinationsData as Destination[];
  const parts = partsData as Part[];
  const rockets = rocketsData as Rocket[];

  const totals = useMemo(() => {
    const mass = selectedParts.reduce((sum, p) => sum + p.mass, 0);
    const cost = selectedParts.reduce((sum, p) => sum + p.cost, 0);
    const power = selectedParts.reduce((sum, p) => sum + p.power, 0);
    const science = selectedParts.reduce((sum, p) => sum + (p.sciencePoints || 0), 0);
    return { mass, cost, power, science };
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

  const runEvents = () => {
    if (!selectedDestination) return;
    const results: EventResult[] = [];
    for (let i = 0; i < selectedDestination.eventCount; i++) {
      results.push(simulateSpaceEvent(selectedParts, totals.power));
    }
    setEvents(results);
  };

  const startOver = () => {
    setPhase("concept");
    setSelectedDestination(null);
    setSelectedParts([]);
    setSelectedRocket(null);
    setEvents([]);
  };

  const totalEventBonus = events.reduce((sum, e) => sum + e.bonusPoints, 0);
  const remainingBudget = budget - totals.cost - (selectedRocket?.cost || 0);
  const budgetBonus = Math.max(0, Math.round(remainingBudget / 10));
  const finalScore = totals.science + totalEventBonus + budgetBonus;

  return (
    <div className="app">
      <header className="header">
        <h1>Mission Control: Cosmic Orbit</h1>
        <div className="budget">
          Budget remaining: <strong>${remainingBudget}</strong>
        </div>
      </header>

      <nav className="phases">
        <button className={phase === "concept" ? "active" : ""} onClick={() => setPhase("concept")}>1. Concept</button>
        <button className={phase === "design" ? "active" : ""} onClick={() => setPhase("design")}>2. Design</button>
        <button className={phase === "launch" ? "active" : ""} onClick={() => setPhase("launch")}>3. Launch</button>
        <button className={phase === "operations" ? "active" : ""} onClick={() => setPhase("operations")}>4. Operations</button>
        <button className={phase === "report" ? "active" : ""} onClick={() => setPhase("report")}>Mission Report</button>
      </nav>

      <div style={{ textAlign: "right", marginBottom: "16px" }}>
        <button className="start-over" onClick={startOver}>Start Over</button>
      </div>

      <main className="content">
        {phase === "concept" && (
          <div>
            <h2>Phase 1 — Concept</h2>
            <p>Choose your target destination. Harder targets have more events.</p>
            <div className="destination-grid">
              {destinations.map((dest) => (
                <button
                  key={dest.name}
                  className={`destination-card ${selectedDestination?.name === dest.name ? "selected" : ""}`}
                  onClick={() => setSelectedDestination(dest)}
                >
                  <h3>{dest.name}</h3>
                  <p>Required Δv: {dest.requiredDeltaV.toLocaleString()} m/s</p>
                  <p>Difficulty: {dest.difficulty} ({dest.eventCount} events)</p>
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
              <div className="meter">Science: <strong>+{totals.science}</strong></div>
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
            <p>Run the mission and face random events.</p>
            {selectedDestination && (
              <p>This target has {selectedDestination.eventCount} events ({selectedDestination.difficulty}).</p>
            )}
            <button className="run-button" onClick={runEvents} disabled={!selectedDestination}>
              Run Mission Events
            </button>

            {events.length > 0 && (
              <div className="mission-visual">
                <div className="mission-playthrough">
                  <div className="stars"></div>
                  <div className="spacecraft-main">🛰️</div>
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className="obstacle"
                      style={{
                        top: `${20 + i * 25}%`,
                        animationDelay: `${i * 1.5}s`,
                      }}
                    >
                      {event.eventName.includes("Solar") ? "☀️" : event.eventName.includes("Micrometeoroid") ? "☄️" : "📡"}
                    </div>
                  ))}
                  <div className="event-overlay">
                    {events[events.length - 1]?.eventName}: {events[events.length - 1]?.survived ? "Survived" : "Impact"}
                  </div>
                </div>

                <div className="spacecraft-status">
                  <div className="spacecraft-icon">🛰️</div>
                  <div className="status-bars">
                    <div className="status-item">
                      <span>Power</span>
                      <div className="bar">
                        <div
                          className="bar-fill power"
                          style={{ width: `${Math.min(100, Math.max(0, (totals.power + 100) / 2))}%` }}
                        />
                      </div>
                    </div>
                    <div className="status-item">
                      <span>Integrity</span>
                      <div className="bar">
                        <div
                          className="bar-fill integrity"
                          style={{ width: `${Math.max(20, 100 - events.filter((e) => !e.survived).length * 15)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="events-timeline">
                  {events.map((event, index) => (
                    <div key={index} className={`timeline-event ${event.survived ? "survived" : "failed"}`}>
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <h4>{event.eventName}</h4>
                        <p>{event.description}</p>
                        <span className="result-badge">
                          {event.survived ? `SUCCESS +${event.bonusPoints}` : "FAILED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "report" && (
          <div>
            <h2>Mission Report</h2>
            <div className="advisor">
              <div className="advisor-icon">🐕‍🦺</div>
              <div className="advisor-text">
                Advisor Laika: “Good work, Commander. Here’s your debrief.”
              </div>
            </div>

            {!selectedDestination ? (
              <p>Complete the mission phases to generate a report.</p>
            ) : (
              <>
                <div className="report-section">
                  <h3>Mission Target</h3>
                  <p><strong>{selectedDestination.name}</strong> — {selectedDestination.difficulty}</p>
                  <p>Required Δv: {selectedDestination.requiredDeltaV.toLocaleString()} m/s</p>
                  <p>Events faced: {selectedDestination.eventCount}</p>
                </div>

                <div className="report-section">
                  <h3>Spacecraft Configuration</h3>
                  <p>Total Mass: {totals.mass} kg</p>
                  <p>Total Power: {totals.power} W</p>
                  <p>Parts Cost: ${totals.cost}</p>
                  <p>Selected Parts: {selectedParts.map((p) => p.name).join(", ") || "None"}</p>
                </div>

                {selectedRocket && (
                  <div className="report-section">
                    <h3>Launch Vehicle</h3>
                    <p><strong>{selectedRocket.name}</strong></p>
                    <p>Launch Cost: ${selectedRocket.cost.toLocaleString()}</p>
                    {launchCheck && (
                      <>
                        <p>Available Δv: {launchCheck.availableDeltaV.toLocaleString()} m/s</p>
                        <p className={launchCheck.canLaunch ? "success" : "fail"}>
                          Launch Status: {launchCheck.canLaunch ? "Successful" : "Failed"}
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="report-section">
                  <h3>Operations Summary</h3>
                  <p>Events survived: {events.filter((e) => e.survived).length} / {events.length}</p>
                  <p>Event bonus points: +{totalEventBonus}</p>
                </div>

                <div className="report-section">
                  <h3>Why This Happened (Trade-offs)</h3>
                  <ul style={{ paddingLeft: "20px", color: "#e7ecef" }}>
                    {totals.power < 0 && <li>Negative power made the spacecraft more vulnerable to solar flares and system outages.</li>}
                    {totals.power >= 50 && <li>Good power margin helped the spacecraft survive solar events.</li>}
                    {selectedParts.some(p => p.name.includes("Antenna"))
                      ? <li>Having an antenna improved communications and helped survive signal interference.</li>
                      : <li>Missing a strong antenna increased the chance of losing data during interference.</li>}
                    {selectedParts.some(p => p.name.includes("Propulsion") || p.name.includes("Thruster"))
                      ? <li>Propulsion or thrusters helped avoid micrometeoroid impacts.</li>
                      : <li>Limited maneuvering ability made the spacecraft more vulnerable to micrometeoroids.</li>}
                    {launchCheck && !launchCheck.massOk && <li>The spacecraft was too heavy for the chosen rocket, which blocked a successful launch.</li>}
                    {launchCheck && !launchCheck.deltaVOk && <li>Not enough delta-v for the chosen destination. A lighter spacecraft or more powerful rocket would help.</li>}
                    {remainingBudget < 0 && <li>The mission went over budget. Reducing instrument cost or choosing a cheaper rocket would improve efficiency.</li>}
                    {totals.science > 100 && <li>High science instrument value increased the final score.</li>}
                  </ul>
                </div>

                <div className="report-section score-box">
                  <h3>Final Score</h3>
                  <p>Science points: +{totals.science}</p>
                  <p>Event bonuses: +{totalEventBonus}</p>
                  <p>Budget efficiency bonus: +{budgetBonus}</p>
                  <p className="final-score">Total: {finalScore}</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;