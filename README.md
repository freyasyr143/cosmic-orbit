# cosmic-orbit

\# Mission Control: Cosmic Orbit



An interactive space mission design game created for the 2026 NASA Space Apps Challenge.



Play the game: \*\*https://freyasyr143.github.io/cosmic-orbit/\*\*



\## What is it?



Cosmic Orbit lets players design and run a complete space mission from concept to operations. Players make real engineering trade-offs between mass, power, cost, science instruments, and launch vehicles, then see how those choices affect mission success.



The game follows the core idea of the \[Space Mission Design Game challenge](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/): understanding that improving one part of a mission often creates limitations in another.



\## How to Play



1\. \*\*Concept\*\* — Choose a destination (Mars, Venus, Jupiter, or Saturn). Harder targets have more random events.

2\. \*\*Design\*\* — Select spacecraft parts. Watch the live meters for mass, power, cost, and science points.

3\. \*\*Launch\*\* — Pick a rocket and check if it can lift your spacecraft and provide enough delta-v.

4\. \*\*Operations\*\* — Run the mission and face random events (solar flares, micrometeoroids, signal interference). Your design choices affect whether you survive them.

5\. \*\*Mission Report\*\* — See your final score, a breakdown of science points, event bonuses, and budget efficiency, plus explanations of the trade-offs you made.



Click \*\*Start Over\*\* at any time to begin a new mission.



\## Educational Goals



\- Show that there is rarely one perfect design.

\- Demonstrate how mass, power, cost, and science instruments interact.

\- Let players learn from both successful and failed missions.

\- Introduce basic concepts such as delta-v, payload limits, and resource constraints in a simple way.



\## Team



\- \*\*Riya\*\* — Team Lead / Frontend \& Game Flow

\- \*\*Chaima\*\* — Simulation logic and test files

\- \*\*David\*\* — Data (parts, rockets, destinations) and design suggestions



\## Tech



\- React + TypeScript

\- Vite

\- Pure simulation functions for mass, power, cost, and delta-v calculations

\- Deployed on GitHub Pages



\## Running Locally



```bash

npm install

npm run dev



## 🔬 How the Simulation Works (Science & Math)

**CosmicOrbit** uses a deterministic physics and engineering simulation module (written in TypeScript) to evaluate spacecraft designs against real orbital mechanics constraints:

1. **Spacecraft Mass & Payload Budget:**
   - $m_{\text{payload}} = \sum m_i$ (must not exceed launch vehicle capacity).
   - Wet Mass ($m_0$) = Dry Mass ($m_f$) + Propellant Mass.

2. **Orbital Mechanics ($\Delta v$):**
   - Computed using the **Tsiolkovsky Rocket Equation**:
     $$\Delta v = v_e \cdot \ln\left(\frac{m_0}{m_f}\right)$$
   - A mission is cleared only if $\Delta v_{\text{achieved}} \ge \Delta v_{\text{required}}$.

3. **Power Margin & Space Events:**
   - $P_{\text{net}} = \sum P_{\text{generated}} - \sum P_{\text{consumed}}$
   - Dynamic space events (solar flares, radiation) test subsystem resilience during operations.
