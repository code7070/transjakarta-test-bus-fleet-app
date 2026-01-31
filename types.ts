export interface VehicleAttributes {
  label: string;
  current_status: string;
  latitude: number;
  longitude: number;
  updated_at: string;
  bearing: number;
  speed: number | null;
  occupancy_status: string | null;
  // Mapped properties from 'included' data
  trip_headsign?: string;
  route_name?: string;
  route_color?: string;
  route_text_color?: string;
}

export interface Vehicle {
  id: string;
  type: "vehicle";
  attributes: VehicleAttributes;
  relationships?: {
    route?: { data: { id: string } };
    trip?: { data: { id: string } };
  };
}

export interface RouteAttributes {
  long_name: string;
  short_name: string;
  type: number;
  description: string;
  color: string;
  text_color: string;
}

export interface Route {
  id: string;
  type: "route";
  attributes: RouteAttributes;
}

export interface TripAttributes {
  headsign: string;
  direction_id: number;
}

export interface Trip {
  id: string;
  type: "trip";
  attributes: TripAttributes;
}

export interface ApiResponse<T> {
  data: T;
  included?: any[]; // Allow included data access
  jsonapi: {
    version: string;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string;
  };
}

export type VehicleStatus =
  | "IN_TRANSIT_TO"
  | "STOPPED_AT"
  | "INCOMING_AT"
  | string;
