# Mission Control: Cosmic Orbit

An interactive space mission design game created for the 2026 NASA Space Apps Challenge.

**Play the game:** https://freyasyr143.github.io/cosmic-orbit/

## What is it?

Cosmic Orbit lets players design and run a complete space mission from concept to operations. Players make real engineering trade-offs between mass, power, cost, science instruments, and launch vehicles, then see how those choices affect mission success.

The game follows the core idea of the [Space Mission Design Game challenge](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/): understanding that improving one part of a mission often creates limitations in another.

## How to Play

1. **Concept** — Choose a destination (Mars, Venus, Jupiter, or Saturn). Harder targets have more random events.
2. **Design** — Select spacecraft parts. Watch the live meters for mass, power, cost, and science points.
3. **Launch** — Pick a rocket and check if it can lift your spacecraft and provide enough delta-v.
4. **Operations** — Face events one at a time (Oregon Trail style). Your design choices and decisions affect whether you survive.
5. **Mission Report** — See your final score, event outcomes, budget efficiency, trade-off explanations, and a comparison to real missions (Perseverance, Magellan, Juno, Cassini).

Click **Start Over** at any time to begin a new mission.

## Educational Goals

- Show that there is rarely one perfect design.
- Demonstrate how mass, power, cost, and science instruments interact.
- Let players learn from both successful and failed missions.
- Introduce basic concepts such as delta-v, payload limits, and resource constraints in a simple way.

## Team

- **Riya** — Team Lead / Frontend & Game Flow
- **Chaima** — Simulation logic and test files
- **David** — Data (parts, rockets, destinations), design suggestions, and image research

## Tech

- React + TypeScript
- Vite
- Pure simulation functions for mass, power, cost, and delta-v calculations
- Deployed on GitHub Pages

## Image Credits

Planet background images are from NASA and Wikimedia Commons (public domain):

- **Mars**: [OSIRIS Mars true color](https://commons.wikimedia.org/wiki/File:OSIRIS_Mars_true_color.jpg) — NASA
- **Venus**: [Venus real color](https://commons.wikimedia.org/wiki/File:Venus-real_color.jpg) — NASA / Ricardo Nunes
- **Jupiter**: [Jupiter and its shrunken Great Red Spot](https://commons.wikimedia.org/wiki/File:Jupiter_and_its_shrunken_Great_Red_Spot.jpg) — NASA / JPL
- **Saturn**: [Saturn during Equinox](https://commons.wikimedia.org/wiki/File:Saturn_during_Equinox.jpg) — NASA / JPL / Space Science Institute

## Running Locally

```bash
npm install
npm run dev