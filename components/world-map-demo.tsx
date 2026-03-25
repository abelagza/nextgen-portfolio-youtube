"use client";

import { WorldMap } from "@/components/ui/world-map";

export default function WorldMapDemo() {
  return (
    <div className="w-full pb-12">
      <div className="mx-auto w-full max-w-full px-0 sm:px-0">
        <WorldMap
          dots={[
            {
              start: { lat: 47.6062, lng: -122.3321 },
              end: { lat: 34.0522, lng: -118.2437 },
            },
            {
              start: { lat: 25.5, lng: -103.5 },
              end: { lat: 40.7128, lng: -74.006 },
            },
            {
              start: { lat: 40.7128, lng: -74.006 },
              end: { lat: -23.5505, lng: -46.6333 },
            },
            {
              start: { lat: 48.8566, lng: 2.3522 },
              end: { lat: 51.5074, lng: -0.1278 },
            },
            {
              start: { lat: 48.8566, lng: 2.3522 },
              end: { lat: 28.6139, lng: 77.209 },
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: 1.3521, lng: 103.8198 },
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: 35.6762, lng: 139.6503 },
            },
          ]}
        />
      </div>
    </div>
  );
}