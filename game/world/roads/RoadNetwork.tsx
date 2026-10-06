"use client";

import { RoadMesh } from "./RoadMesh";

/**
 * Connected Road Network for OPENVERSE.
 *
 * Physically unites Town, Forest, Mountain, City, and Coast:
 * - North Valley Highway from Town Outskirts to the Valley Fork
 * - West Forest Byway ascending into Pine Crest Forest
 * - East Metro Highway crossing into Central City
 * - Mountain Ascent Highway climbing into Mount Aethel foothills
 * - Coastal Highway descending from City to Sunken Coast beach
 * - South Countryside Scenic Road looping back towards Town
 */
export function RoadNetwork() {
  return (
    <group name="road-network">
      {/* 1. North Valley Highway (Town Outskirts North to Valley Fork) */}
      <RoadMesh position={[0, 0.06, -110]} length={150} width={8} />

      {/* 2. South Countryside Road (Town South Outskirts to Southern Countryside) */}
      <RoadMesh position={[0, 0.06, 120]} length={140} width={8} />

      {/* 3. West Forest Byway (Branches NW into Pine Crest Forest) */}
      <RoadMesh
        position={[-110, 1.2, -180]}
        length={160}
        width={7}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* 4. Pine Crest Forest Interior Trail (Winding road through woodland) */}
      <RoadMesh position={[-250, 2.6, -240]} length={180} width={6} hasCurbs={false} />

      {/* 5. East Metro Highway (Branches NE into Central City) */}
      <RoadMesh
        position={[150, 1.0, -180]}
        length={180}
        width={9}
        rotation={[0, -Math.PI / 3, 0]}
      />

      {/* 6. Central City Grand Avenue (Urban thoroughfare) */}
      <RoadMesh position={[320, 1.3, -260]} length={240} width={10} />

      {/* 7. Mountain Ascent Road (Leads from Valley up toward Mount Aethel) */}
      <RoadMesh
        position={[0, 5.0, -320]}
        length={160}
        width={8}
        rotation={[0.06, 0, 0]} // Gentle climb
      />

      {/* 8. Coastal Highway (Descends from City down to Coast) */}
      <RoadMesh position={[360, 0.8, -40]} length={220} width={8} />

      {/* 9. Southern Coast Connection (Loops from Coast back West toward Town) */}
      <RoadMesh position={[180, 0.2, 50]} length={220} width={7} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}
