"use client";

import { RoadMesh } from "./RoadMesh";

/**
 * Connected Road Network for OPENVERSE Phase 4.
 * Physically unites Town, Forest, Mountain, City, and Coast into a single seamless loop.
 */
export function RoadNetwork() {
  return (
    <group name="road-network">
      {/* 1. Town Main North-South Street (Runs through Town Square) */}
      <RoadMesh position={[0, 0.02, 30]} length={180} width={8} />

      {/* 2. Valley Highway (Connects Town Outskirts North toward the Valley Fork) */}
      <RoadMesh position={[0, 0.05, -120]} length={120} width={8} />

      {/* 3. Forest Branch Road (NW turn leading into Pine Crest Forest) */}
      <RoadMesh
        position={[-130, 1.8, -260]}
        length={190}
        width={7}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* 4. Pine Crest Forest Interior Trail (Winding dirt/asphalt path through canopy) */}
      <RoadMesh position={[-270, 3.8, -350]} length={140} width={6} hasCurbs={false} />

      {/* 5. City Connector Highway (NE turn leading toward Central City) */}
      <RoadMesh
        position={[170, 1.6, -280]}
        length={210}
        width={9}
        rotation={[0, -Math.PI / 3, 0]}
      />

      {/* 6. Central City Grand Avenue (Urban thoroughfare through City center) */}
      <RoadMesh position={[360, 2.8, -420]} length={200} width={10} />

      {/* 7. Mountain Foothills Ascent Road (Leads from Valley up toward Mount Aethel) */}
      <RoadMesh
        position={[0, 8.5, -570]}
        length={160}
        width={7}
        rotation={[0.07, 0, 0]} // Incline climbing up
      />

      {/* 8. Coastal Highway (Runs North-South from City down into Coast beach area) */}
      <RoadMesh position={[380, 0.8, -60]} length={280} width={8} />

      {/* 9. Southern Scenic Byway (Loops from Coast back West into Town outskirts) */}
      <RoadMesh position={[190, 0.2, 40]} length={200} width={7} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}
