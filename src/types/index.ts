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