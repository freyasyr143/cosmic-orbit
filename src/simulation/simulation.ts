export interface Part {
  name: string;
  mass: number;
  cost: number;
  power: number;
  sciencePoints?: number;
}

export interface Rocket {
  name: string;
  dryMass: number;
  fuelMass: number;
  exhaustVelocity: number;
  maxPayLoadMass: number;
  cost: number;
}

export interface Destination {
  name: string;
  requiredDeltaV: number;
}

export interface SpaceEventResult {
  eventName: string;
  description: string;
  survived: boolean;
  bonusPoints: number;
}

export interface MissionTarget {
  name: string;
  requiredDeltaV: number;
  difficulty: "Easy" | "Medium" | "Hard";
  eventCount: number;
}

export function calculateTotalMass(parts: Part[]): number {
  let totalMass = 0;
  for (const part of parts) {
    totalMass += part.mass;
  }
  return totalMass;
}

export function calculateTotalCost(parts: Part[]): number {
  let totalCost = 0;
  for (const part of parts) {
    totalCost += part.cost;
  }
  return totalCost;
}

export function calculateTotalPower(parts: Part[]): number {
  let totalPower = 0;
  for (const part of parts) {
    totalPower += part.power;
  }
  return totalPower;
}

export function calculateDeltaV(rocket: Rocket, spacecraftMass: number): number {
  const initialMass = rocket.dryMass + rocket.fuelMass + spacecraftMass;
  const finalMass = rocket.dryMass + spacecraftMass;
  if (finalMass <= 0 || initialMass <= finalMass) return 0;
  return rocket.exhaustVelocity * Math.log(initialMass / finalMass);
}

export function validateParts(parts: Part[]): string[] {
  const errors: string[] = [];
  for (const part of parts) {
    if (!part.name.trim()) {
      errors.push("Part name is missing");
    }
    if (part.mass <= 0) {
      errors.push(part.name + " has invalid mass");
    }
    if (part.cost < 0) {
      errors.push(part.name + " has invalid cost");
    }
  }
  return errors;
}

export function checkMissionReadiness(
  parts: Part[],
  rocket: Rocket,
  destination: Destination,
  maxBudget: number
) {
  const totalMass = calculateTotalMass(parts);
  const totalPower = calculateTotalPower(parts);
  const totalCost = calculateTotalCost(parts) + rocket.cost;
  const availableDeltaV = calculateDeltaV(rocket, totalMass);
  const warnings: string[] = [];

  if (totalCost > maxBudget) {
    warnings.push("Budget exceeded: " + totalCost + "/" + maxBudget);
  }
  if (totalMass > rocket.maxPayLoadMass) {
    warnings.push(
      "Spacecraft too heavy for " +
        rocket.name +
        ": " +
        totalMass +
        " kg > " +
        rocket.maxPayLoadMass +
        " kg"
    );
  }
  if (totalPower < 0) {
    warnings.push(
      "Power deficit " + totalPower + " W: Add more solar panels or batteries"
    );
  }
  if (availableDeltaV < destination.requiredDeltaV) {
    warnings.push(
      "Insufficient Delta-v for " +
        destination.name +
        ": " +
        Math.round(availableDeltaV) +
        " m/s < " +
        destination.requiredDeltaV +
        " m/s"
    );
  }

  return {
    isSuccess: warnings.length === 0,
    metrics: {
      totalMass,
      totalPower,
      totalCost,
      availableDeltaV: Math.round(availableDeltaV),
    },
    warnings,
  };
}

export function simulateSpaceEvent(
  parts: Part[],
  totalPower: number
): SpaceEventResult {
  const events = [
    {
      name: "Solar Flare",
      description:
        "A strong solar explosion hits the spacecraft's electrical systems!",
      checkSurvival: () => totalPower >= 50,
      successMsg:
        "Energy surplus and batteries protected the vehicle systems successfully!",
      failMsg: "A weak energy reserve caused a temporary outage of the devices.",
    },
    {
      name: "Micrometeoroid Shower",
      description:
        "A cloud of tiny space rocks is blocking the spacecraft's path!",
      checkSurvival: () =>
        parts.some(
          (p) => p.name.includes("Thruster") || p.name.includes("Shield")
        ),
      successMsg:
        "The steering or shield moves allowed the vehicle to maneuver and avoid danger!",
      failMsg:
        "Some rocks hit the outer structure and slowed down collecting the data.",
    },
    {
      name: "Deep Space Signal Interference",
      description:
        "Cosmic wave interference is blocking data transmission to Earth!",
      checkSurvival: () => parts.some((p) => p.name.includes("Antenna")),
      successMsg: "High gain antenna kept us in touch with the command center!",
      failMsg: "Some scientific data was lost due to poor connection.",
    },
  ];

  const randomIndex = Math.floor(Math.random() * events.length);
  const chosenEvent = events[randomIndex];
  const isSurvived = chosenEvent.checkSurvival();

  return {
    eventName: chosenEvent.name,
    description:
      chosenEvent.description +
      " " +
      (isSurvived ? chosenEvent.successMsg : chosenEvent.failMsg),
    survived: isSurvived,
    bonusPoints: isSurvived ? 250 : 0,
  };
}

export function calculateFinalScore(
  parts: Part[],
  remainingBudget: number,
  eventResult: SpaceEventResult,
  previousScore: number = 0
): number {
  let scienceScore = 0;
  for (const part of parts) {
    scienceScore += part.sciencePoints || 0;
  }
  const budgetBonus = Math.max(0, Math.round(remainingBudget / 10));
  const currentMissionScore =
    scienceScore + budgetBonus + eventResult.bonusPoints;
  return currentMissionScore + previousScore;
}

export function simulateMissionEvents(
  parts: Part[],
  totalPower: number,
  eventCount: number
): SpaceEventResult[] {
  const results: SpaceEventResult[] = [];
  for (let i = 0; i < eventCount; i++) {
    const singleEvent = simulateSpaceEvent(parts, totalPower);
    results.push(singleEvent);
  }
  return results;
}