import {
  calculateTotalMass,
  calculateTotalCost,
  calculateTotalPower,
  calculateDeltaV,
  validateParts,
  checkMissionReadiness,
  simulateSpaceEvent,
  calculateFinalScore,
  Part,
  Rocket,
  Destination
} from "./simulation";

const sampleParts: Part[] = [
  { name: "Solar Array", mass: 30, cost: 340, power: 40, sciencePoints: 50 },
  { name: "Battery", mass: 70, cost: 200, power: 10, sciencePoints: 10 },
  { name: "Antenna", mass: 30, cost: 230, power: -20, sciencePoints: 30 }
];

const sampleRocket: Rocket = {
  name: "Medium Launcher",
  dryMass: 1000,
  fuelMass: 9000,
  exhaustVelocity: 3000,
  maxPayLoadMass: 500,
  cost: 2000
};

const sampleDestination: Destination = {
  name: "Moon Orbit",
  requiredDeltaV: 6000
};

console.log("=== COSMIC ORBIT SIMULATION TEST ===");

const errors = validateParts(sampleParts);
console.log(
  "Part Validation Errors:",
  errors.length === 0 ? "All parts are valid!" : errors
);

const totalMass = calculateTotalMass(sampleParts);
const totalCost = calculateTotalCost(sampleParts);
const totalPower = calculateTotalPower(sampleParts);

console.log(`Total Spacecraft Mass: ${totalMass} kg`);
console.log(`Total Parts Cost: $${totalCost}`);
console.log(`Total Power Output/Draw: ${totalPower} W`);

const readiness = checkMissionReadiness(
  sampleParts,
  sampleRocket,
  sampleDestination,
  5000
);
console.log("Mission Readiness Result:", readiness);

const eventResult = simulateSpaceEvent(sampleParts, totalPower);
console.log("Simulated Space Event:", eventResult);

const finalScore = calculateFinalScore(sampleParts, 1500, eventResult, 0);
console.log(`Final Mission Score: ${finalScore}`);
console.log("=== TEST COMPLETED SUCCESSFULLY ===");