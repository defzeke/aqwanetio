import type { Pond, PondsService } from "./ponds.service";

const mockPonds: Pond[] = [
  { id: "pond-1", name: "Laguna Lake Pond A", lat: 14.375, lng: 121.245, ammoniaLevel: 0.2, status: "safe" },
  { id: "pond-2", name: "Batangas Tilapia Farm", lat: 13.756, lng: 121.058, ammoniaLevel: 0.6, status: "warning" },
  { id: "pond-3", name: "Pampanga River Aqua", lat: 14.943, lng: 120.698, ammoniaLevel: 1.2, status: "toxic" },
  { id: "pond-4", name: "Bulacan Bangus Pond", lat: 14.794, lng: 120.879, ammoniaLevel: 0.1, status: "safe" },
  { id: "pond-5", name: "Nueva Ecija Fish Farm", lat: 15.473, lng: 120.947, ammoniaLevel: 0.5, status: "warning" },
  { id: "pond-6", name: "Quezon Shrimp Hatchery", lat: 13.833, lng: 121.667, ammoniaLevel: 0.3, status: "safe" },
  { id: "pond-7", name: "Cavite Coastal Pond", lat: 14.483, lng: 120.900, ammoniaLevel: 0.8, status: "warning" },
  { id: "pond-8", name: "Rizal Highland Aqua", lat: 14.600, lng: 121.200, ammoniaLevel: 1.5, status: "toxic" },
  { id: "pond-9", name: "Pangasinan Milkfish", lat: 16.050, lng: 120.333, ammoniaLevel: 0.15, status: "safe" },
  { id: "pond-10", name: "Isabela Integrated Farm", lat: 17.050, lng: 121.733, ammoniaLevel: 0.45, status: "warning" },
];

export const mockPondsService: PondsService = {
  getAll: () => mockPonds,
  getById: (id) => mockPonds.find((p) => p.id === id),
  getByOwner: (ownerId) => mockPonds.filter((p) => p.ownerId === ownerId),
};
