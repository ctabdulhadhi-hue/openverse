"use client";

/**
 * Prototype terrain ground and landmark reference geometries.
 * Demonstrates 3D depth, scale, perspective, and shadow casting.
 * Note: Full open-world regions (Town, Forest, Mountain, City, Coast) are built in Phase 4.
 */
export function PrototypeGround() {
  return (
    <group name="prototype-ground-environment">
      {/* Primary terrain plane (240m x 240m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260, 32, 32]} />
        <meshStandardMaterial color="#1e2c26" roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Central spawn plaza pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[10, 10.5, 0.1, 48]} />
        <meshStandardMaterial color="#2a3c36" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Inner accent ring on the plaza */}
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <ringGeometry args={[9.5, 9.8, 48]} />
        <meshBasicMaterial color="#38bdf8" opacity={0.4} transparent />
      </mesh>

      {/* Architectural scale reference monoliths (demonstrating shadow casting & depth) */}
      <group name="scale-reference-monoliths">
        {/* North monolith */}
        <mesh position={[0, 4, -20]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 8, 2.5]} />
          <meshStandardMaterial color="#2d3f44" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* East monolith */}
        <mesh position={[24, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 10, 3]} />
          <meshStandardMaterial color="#33474d" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* South monolith */}
        <mesh position={[0, 3, 22]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 6, 2.5]} />
          <meshStandardMaterial color="#28393e" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* West monolith */}
        <mesh position={[-22, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 12, 3]} />
          <meshStandardMaterial color="#364b52" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Diagonal low-poly aesthetic markers */}
        <mesh position={[18, 2.5, 18]} castShadow receiveShadow>
          <coneGeometry args={[2.5, 5, 6]} />
          <meshStandardMaterial color="#243438" roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[-18, 3, -18]} castShadow receiveShadow>
          <coneGeometry args={[3, 6, 6]} />
          <meshStandardMaterial color="#243438" roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[22, 2, -16]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 2, 4, 8]} />
          <meshStandardMaterial color="#243438" roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[-20, 2.5, 16]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.5, 5, 8]} />
          <meshStandardMaterial color="#243438" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
