export type Unit = {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
};

export type Branch = {
  id: string;
  name: string;
  units: Unit[];
};

export type ItemType = {
  id: string;
  name: string;
  width: number;
  length: number;
  height: number;
  color: string;
  iconName?: string;
};

export type PlacedItem = {
  id: string;
  typeId: string;
  x: number;
  y: number;
  rotation: number;
  z: number;
  stackingError?: boolean;
  stackedOn?: string;
};
